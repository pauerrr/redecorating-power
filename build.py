#!/usr/bin/env python3
"""
Redecorating Power — site builder.

Edit the sources in /content, then run:

    pip install markdown
    python3 build.py

It regenerates:
    data/styles.json, data/styles.js      (from content/styles/*.json)
    dossiers/index.html, dossiers/*.html  (from content/dossiers/*.md)
    dossiers/md/*.md                      (raw copies for coding agents)
    facilitator/index.html                (from content/facilitator-guide.md)

Hand-written pages (index.html, bureau/, exercises/, deck/) read the generated
data at runtime, so they update on their own.
"""
import glob, html, json, os, re, shutil, sys

try:
    import markdown
except ImportError:
    sys.exit("Missing dependency. Run: pip install markdown")

ROOT = os.path.dirname(os.path.abspath(__file__))
C = os.path.join(ROOT, "content")

ISO = {"Austria": "AT", "Belgium": "BE", "Bulgaria": "BG", "Czechia": "CZ", "France": "FR",
       "Germany": "DE", "Greece": "GR", "Hungary": "HU", "Italy": "IT", "Malta": "MT",
       "Netherlands": "NL", "Poland": "PL", "Portugal": "PT", "Romania": "RO", "Spain": "ES"}


def slugify(s):
    return s.lower().replace(" ", "_")


def type_label(t, name):
    t = t.lower()
    if "procuradoria" in name.lower() or "ministério público" in name.lower():
        return "Prosecution"
    if "parliament" in t:
        return "Parliament"
    if "anti" in t:
        return "Anti-corruption"
    if "police" in t:
        return "Police"
    return "Government"


def group_of(label):
    return {"Parliament": "parliament", "Government": "government"}.get(label, "enforcement")


# ---------------------------------------------------------------- styles
def build_styles():
    data = []
    for f in sorted(glob.glob(os.path.join(C, "styles", "*.json"))):
        d = json.load(open(f, encoding="utf-8"))
        d.pop("flag", None)
        d["slug"] = slugify(d["country"])
        d["iso"] = ISO.get(d["country"], d["country"][:2].upper())
        for b in d["bodies"]:
            raw = b["name"]
            note = ""
            m = re.split(r"\s+-\s+used as replacement", raw, maxsplit=1)
            if len(m) == 2:
                raw, note = m[0], "Used as replacement" + m[1]
            short, en = raw, ""
            pm = re.match(r"^(.*?)\s*\((.*)\)\s*$", raw)
            if pm:
                short, en = pm.group(1).strip(), pm.group(2).strip()
            b["short"] = short
            b["en"] = en
            if note:
                b["note"] = note
            b["typeLabel"] = type_label(b["type"], raw)
            b["group"] = group_of(b["typeLabel"])
            b["shot"] = f"{d['slug']}_{re.sub(r'[^a-z-]', '', b['type'].lower())}"
        data.append(d)
    os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)
    json.dump(data, open(os.path.join(ROOT, "data", "styles.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    open(os.path.join(ROOT, "data", "styles.js"), "w", encoding="utf-8").write(
        "window.ATLAS=" + json.dumps(data, ensure_ascii=False) + ";")
    print(f"styles: {len(data)} countries, {sum(len(d['bodies']) for d in data)} bodies")
    return data


# ---------------------------------------------------------------- page shell
def page(title, root, active, body_html, extra_head="", extra_js=""):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)} — Redecorating Power</title>
<link rel="stylesheet" href="{root}assets/dds.css">
<link rel="stylesheet" href="{root}assets/doc.css">
{extra_head}
</head>
<body data-root="{root}" data-page="{active}">
{body_html}
<script src="{root}assets/edition.js"></script>
<script src="{root}assets/qrcode.js"></script>
<script src="{root}assets/site.js"></script>
{extra_js}
</body>
</html>
"""


def md_to_html(text):
    out = markdown.markdown(text, extensions=["tables", "toc", "fenced_code", "sane_lists"],
                            extension_configs={"toc": {"toc_depth": "2-3"}})
    out = re.sub(r'<a href="(https?://[^"]+)"', r'<a href="\1" target="_blank" rel="noopener"', out)
    out = re.sub(r"<table>", '<div class="tbl"><table>', out)
    out = re.sub(r"</table>", "</table></div>", out)
    return out


def toc_from(html_text):
    items = re.findall(r'<h([23]) id="([^"]+)">(.*?)</h\1>', html_text)
    lis = []
    for lvl, hid, label in items:
        label = re.sub(r"<[^>]+>", "", label)
        lis.append(f'<li class="l{lvl}"><a href="#{hid}">{label}</a></li>')
    return "<ul>" + "".join(lis) + "</ul>"


def case_titles(text):
    titles, inside = [], False
    for line in text.splitlines():
        if line.startswith("## "):
            inside = bool(re.search(r"case|system", line, re.I)) and not re.search(r"denial|people|numbers", line, re.I)
            continue
        if inside and line.startswith("### "):
            t = re.sub(r"^###\s*(\d+(\.\d+)*\.?\s*)?", "", line).strip()
            t = re.sub(r"\*\*", "", t)
            t = re.sub(r"^Case\s+\d+\s*[—:–-]\s*", "", t)
            if re.match(r"(political and institutional aftermath|notable exclusions|context note|note on)", t, re.I):
                continue
            titles.append(t)
    return titles


# ---------------------------------------------------------------- dossiers
def build_dossiers(styles):
    src = sorted(glob.glob(os.path.join(C, "dossiers", "*.md")))
    out_dir = os.path.join(ROOT, "dossiers")
    md_dir = os.path.join(out_dir, "md")
    os.makedirs(md_dir, exist_ok=True)
    by_slug = {d["slug"]: d for d in styles}
    cards = []
    for f in src:
        slug = os.path.basename(f)[:-3]
        text = open(f, encoding="utf-8").read()
        shutil.copy(f, os.path.join(md_dir, slug + ".md"))
        country = by_slug.get(slug, {}).get("country", slug.title())
        iso = ISO.get(country, slug[:2].upper())
        body = md_to_html(text)
        body = re.sub(r"^<h1[^>]*>.*?</h1>", "", body, count=1, flags=re.S)
        cases = case_titles(text)
        bodies = by_slug.get(slug, {}).get("bodies", [])
        body_links = "".join(
            f'<a class="tag round" href="../bureau/#{b["shot"]}">{html.escape(b["typeLabel"])}</a>' for b in bodies)
        raw_js = json.dumps(text, ensure_ascii=False).replace("</", "<\\/")
        content = f"""
<section class="hero doc-hero">
  <div>
    <div class="eyebrow rise"><a class="tag round" href="./">All dossiers</a><span class="mono">{iso} · research snapshot Oct 2026</span></div>
    <h1 class="h-1 rise" style="--i:1">{html.escape(country)}</h1>
  </div>
  <div class="hero-side rise" style="--i:2">
    <p class="lede">{len(cases)} cases on file. Named people hold final convictions or resigned; everyone else appears by role only.</p>
    <div class="cta">
      <button class="pill solid" id="copyMd">Copy dossier for your agent</button>
      <a class="pill" href="md/{slug}.md" download>Download .md</a>
    </div>
    <div class="tags"><span class="mono muted" style="margin-right:6px">Style this country:</span>{body_links}</div>
  </div>
</section>
<section class="sheet">
  <div class="sheet-in doc">
    <aside class="toc no-print"><div class="mono muted">Contents</div>{toc_from(body)}</aside>
    <article class="prose">
      <div class="callout"><strong>Before you quote anything:</strong> check the legal status line for that person. Court cases move. If a case in this file has changed since October 2026, the facilitator guide lists which ones to recheck.</div>
      {body}
    </article>
  </div>
</section>"""
        js = f"""<script>
const RAW={raw_js};
document.getElementById('copyMd').addEventListener('click',()=>copyText(RAW,'Dossier copied. Paste it into your agent.'));
</script>"""
        open(os.path.join(out_dir, slug + ".html"), "w", encoding="utf-8").write(
            page(f"{country} dossier", "../", "dossiers", content, extra_js=js))
        cards.append((country, iso, slug, cases))

    rows = "".join(f"""
      <a class="row dos-row" href="{slug}.html">
        <span class="mono">{iso}</span>
        <span class="name">{html.escape(country)}</span>
        <span class="cases hide-m">{" · ".join(html.escape(c.split(" (")[0]) for c in cases[:4])}</span>
        <span class="tag ghost">{len(cases)} cases</span>
      </a>""" for country, iso, slug, cases in cards)
    content = f"""
<section class="hero">
  <div>
    <div class="eyebrow rise"><span class="tag round">Dossiers</span><span>15 countries</span></div>
    <h1 class="h-1 rise" style="--i:1">The record</h1>
  </div>
  <div class="hero-side rise" style="--i:2">
    <p class="lede">What the institutions in the Style Bureau would rather you scrolled past. Court rulings, amounts in euros, sentences, the people connected to them, and the phrases officials used on the way out.</p>
  </div>
</section>
<section class="sheet">
  <div class="sheet-in">
    <div class="sec-head">
      <div class="num">How to use these files</div>
      <h2 class="h-2">Read one properly. Pick one case. Chase the number, the date and the court.</h2>
    </div>
    <div class="rows">{rows}</div>
    <p class="body" style="margin-top:40px">Every file is also available as raw markdown (the Download button on each page, or all fifteen in one zip from <a href="../downloads/">Downloads</a>) so you can hand it to a coding agent whole. Inclusion rule: final conviction for a corruption-related offence, or resignation over a documented scandal. People on trial, acquitted or cleared on appeal appear by role only.</p>
  </div>
</section>"""
    open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8").write(page("Dossiers", "../", "dossiers", content))
    print(f"dossiers: {len(cards)} pages")


# ---------------------------------------------------------------- facilitator
def build_facilitator():
    f = os.path.join(C, "facilitator-guide.md")
    if not os.path.exists(f):
        print("facilitator: content/facilitator-guide.md missing, skipped")
        return
    text = open(f, encoding="utf-8").read()
    body = md_to_html(text)
    body = re.sub(r"^<h1[^>]*>.*?</h1>", "", body, count=1, flags=re.S)
    content = f"""
<section class="hero doc-hero">
  <div>
    <div class="eyebrow rise"><span class="tag round">Facilitators</span><span>Read this the week before</span></div>
    <h1 class="h-1 rise" style="--i:1">Running the room</h1>
  </div>
  <div class="hero-side rise" style="--i:2">
    <p class="lede">Setup, timings for three formats, the moves that rescue a stuck team, and the court cases to recheck before every edition.</p>
    <div class="cta"><a class="pill solid" href="../deck/">Open the deck</a><a class="pill" href="../downloads/">Downloads</a></div>
  </div>
</section>
<section class="sheet">
  <div class="sheet-in doc">
    <aside class="toc no-print"><div class="mono muted">Contents</div>{toc_from(body)}</aside>
    <article class="prose">{body}</article>
  </div>
</section>"""
    os.makedirs(os.path.join(ROOT, "facilitator"), exist_ok=True)
    open(os.path.join(ROOT, "facilitator", "index.html"), "w", encoding="utf-8").write(
        page("Facilitator guide", "../", "facilitator", content))
    print("facilitator: built")


if __name__ == "__main__":
    s = build_styles()
    build_dossiers(s)
    build_facilitator()
