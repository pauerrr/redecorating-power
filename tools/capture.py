#!/usr/bin/env python3
"""
Redecorating Power — refresh screenshots and measured design tokens.

    pip install playwright pillow
    python3 -m playwright install chromium
    python3 tools/capture.py                 # every body
    python3 tools/capture.py spain_police    # one or more bodies by id
    python3 tools/capture.py --measure-only  # tokens only, keep screenshots

For each body in content/styles/*.json it:
  1. opens the page at 1440 x 1600, tries to decline non-essential cookies,
  2. saves screenshots/<id>.webp and screenshots/thumbs/<id>.webp,
  3. measures colours (by on-screen area) and fonts (by amount of text) from
     the computed styles, and writes them back into the JSON as "colors" and
     "fonts" with tokens_source = "measured".
Then run `python3 build.py` to regenerate the site data.

Some government sites block data-centre IP addresses or answer automated
browsers with a CAPTCHA. The script detects the usual walls ("Access Denied",
"Just a moment", CAPTCHA pages) and leaves those bodies untouched. Run it from
an ordinary home or office connection, or capture those few by hand. Never
solve a CAPTCHA with automation.
"""
import colorsys, glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(ROOT, "screenshots")
WALLS = re.compile(r"access denied|just a moment|captcha|performing security verification|are you a robot|verify you are human", re.I)
DECLINE = re.compile(r"reject|decline|refuse|only necessary|necessary only|essential only|weiger|refuser|ablehnen|rifiuta|rechazar|recusar|elutasít|odrzuć|odmítnout|απόρριψη|uniquement les cookies essentiels|nur notwendige", re.I)

MEASURE_JS = r"""() => {
 const toHex=c=>{const m=c.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(',').map(s=>parseFloat(s));if(p.length===4&&p[3]<0.6)return null;return '#'+p.slice(0,3).map(v=>Math.round(v).toString(16).padStart(2,'0')).join('').toUpperCase()};
 const fam=f=>f.split(',')[0].replace(/["']/g,'').trim();
 const bg={},tx={},ln={},fonts={};
 const H=Math.min(document.documentElement.scrollHeight,3200);
 for(const el of document.querySelectorAll('body, body *')){
   const r=el.getBoundingClientRect(); if(r.width<2||r.height<2||r.top>H)continue;
   const s=getComputedStyle(el); if(s.visibility==='hidden'||s.display==='none'||parseFloat(s.opacity)<0.2)continue;
   const b=toHex(s.backgroundColor); if(b){bg[b]=(bg[b]||0)+Math.min(r.width,1440)*Math.min(r.height,1200)}
   let own=0; for(const n of el.childNodes){if(n.nodeType===3)own+=n.textContent.trim().length}
   if(own>0){const c=toHex(s.color); if(c){ if(el.closest('a'))ln[c]=(ln[c]||0)+own; else tx[c]=(tx[c]||0)+own }
     const f=fam(s.fontFamily); fonts[f]=(fonts[f]||0)+own; }
 }
 const pick=sel=>{const e=document.querySelector(sel);if(!e)return null;return {font:fam(getComputedStyle(e).fontFamily)}};
 const top=o=>Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,8);
 const loaded=[...new Set([...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family.replace(/["']/g,'')))];
 return {bg:top(bg),text:top(tx),links:top(ln),fonts:top(fonts),loaded,h1:pick('h1'),h2:pick('h2')};
}"""

ICON = re.compile(r"awesome|icon|glyph|material symbols|dashicons|fontello", re.I)
SYSTEM = {"arial", "helvetica", "verdana", "tahoma", "georgia", "times new roman", "trebuchet ms", "segoe ui", "sans-serif", "system-ui", "-apple-system"}


def hls(h):
    h = h.lstrip("#"); r, g, b = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return colorsys.rgb_to_hls(r, g, b)


def dist(a, b):
    a, b = a.lstrip("#"), b.lstrip("#")
    return sum(abs(int(a[i:i + 2], 16) - int(b[i:i + 2], 16)) for i in (0, 2, 4))


def tokens(m):
    """Turn raw measurements into the kit's colour and font roles."""
    tot = sum(a for _, a in m["bg"]) or 1
    bgs = [(h, a / tot) for h, a in m["bg"]]
    cols = []

    def add(h, role, share=None):
        if not h or any(dist(c["hex"], h) < 24 for c in cols):
            return
        e = {"hex": h.upper(), "role": role}
        if share is not None:
            e["share"] = round(share * 100)
        cols.append(e)

    sat = [(h, s) for h, s in bgs if hls(h)[2] > .25 and .07 < hls(h)[1] < .82]
    dark = [(h, s) for h, s in bgs if hls(h)[2] <= .25 and hls(h)[1] < .3]
    neutral = [(h, s) for h, s in bgs if hls(h)[2] <= .25 and hls(h)[1] >= .82]
    links = [h for h, _ in m.get("links", []) if hls(h)[1] < .85]
    texts = [h for h, _ in m.get("text", []) if hls(h)[1] < .55]
    if sat: add(sat[0][0], "primary", sat[0][1])
    elif links and hls(links[0])[2] > .25: add(links[0], "primary")
    elif dark: add(dark[0][0], "primary", dark[0][1])
    if neutral: add(neutral[0][0], "background", neutral[0][1])
    if len(neutral) > 1: add(neutral[1][0], "surface", neutral[1][1])
    if texts: add(texts[0], "text")
    if links: add(links[0], "link")
    for h, s in sat[1:4]:
        add(h, "secondary" if not any(c["role"] == "secondary" for c in cols) else "accent", s)
    for h, s in dark[:1]:
        add(h, "dark band", s)

    ft = sum(n for _, n in m["fonts"]) or 1
    loaded = [x.lower() for x in m.get("loaded", [])]
    src = lambda f: "web font" if f.lower() in loaded else ("system" if f.lower() in SYSTEM else "web font / local")
    hf = next((m[k]["font"] for k in ("h1", "h2") if m.get(k) and m[k].get("font") and not ICON.search(m[k]["font"])), None)
    bodyf = next((f for f, _ in m["fonts"] if not ICON.search(f)), None)
    fonts = []
    if hf and hf != bodyf: fonts.append({"family": hf, "usage": "headings", "source": src(hf)})
    if bodyf: fonts.append({"family": bodyf, "usage": "body" + ("" if hf and hf != bodyf else " + headings"), "source": src(bodyf), "share": round(dict(m["fonts"])[bodyf] / ft * 100)})
    for f, n in m["fonts"]:
        if f in (hf, bodyf) or ICON.search(f) or n / ft < .06: continue
        fonts.append({"family": f, "usage": "secondary", "source": src(f), "share": round(n / ft * 100)})
    return cols, fonts


def main():
    from playwright.sync_api import sync_playwright
    from PIL import Image
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    measure_only = "--measure-only" in sys.argv
    files = sorted(glob.glob(os.path.join(ROOT, "content", "styles", "*.json")))
    os.makedirs(os.path.join(SHOTS, "thumbs"), exist_ok=True)
    with sync_playwright() as p:
        br = p.chromium.launch(args=["--disable-blink-features=AutomationControlled"])
        ctx = br.new_context(viewport={"width": 1440, "height": 1600}, locale="en-GB",
                             user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36")
        for f in files:
            d = json.load(open(f, encoding="utf-8"))
            slug = d["country"].lower().replace(" ", "_")
            changed = False
            for b in d["bodies"]:
                sid = f"{slug}_{re.sub(r'[^a-z-]', '', b['type'].lower())}"
                if args and sid not in args:
                    continue
                pg = ctx.new_page()
                try:
                    pg.goto(b["url"], timeout=60000, wait_until="domcontentloaded")
                    pg.wait_for_timeout(6000)
                    if WALLS.search(pg.title() + " " + pg.inner_text("body")[:400]):
                        print(f"WALL  {sid}: the site served a bot check. Capture it by hand.")
                        continue
                    for el in pg.query_selector_all("button, a, input[type=button]"):
                        try:
                            if el.is_visible() and DECLINE.search((el.inner_text() or el.get_attribute("value") or "")[:60]):
                                el.click(timeout=2000); pg.wait_for_timeout(1500); break
                        except Exception:
                            pass
                    m = pg.evaluate(MEASURE_JS)
                    cols, fonts = tokens(m) if m["bg"] and m["fonts"] else ([], [])
                    if cols and fonts:
                        b["colors"], b["fonts"], b["tokens_source"] = cols, fonts, "measured"; changed = True
                    if not measure_only:
                        tmp = os.path.join(SHOTS, sid + ".png")
                        pg.screenshot(path=tmp)
                        im = Image.open(tmp).convert("RGB")
                        im.save(os.path.join(SHOTS, sid + ".webp"), "WEBP", quality=72, method=6)
                        im.crop((0, 0, 1440, 1100)).resize((720, 550)).save(os.path.join(SHOTS, "thumbs", sid + ".webp"), "WEBP", quality=70, method=6)
                        os.remove(tmp)
                    print(f"ok    {sid}")
                except Exception as e:
                    print(f"FAIL  {sid}: {str(e)[:100]}")
                finally:
                    pg.close()
            if changed:
                json.dump(d, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        br.close()
    print("Done. Now run: python3 build.py")


if __name__ == "__main__":
    main()
