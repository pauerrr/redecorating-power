#!/usr/bin/env node
/* ==========================================================================
   Redecorating Power — PowerPoint export.
   Builds downloads/redecorating-power-deck.pptx from deck/slides.js,
   data/styles.json and assets/edition.js, so the PowerPoint never drifts
   from the HTML deck.

   Usage (from the repository root):
       npm install pptxgenjs sharp qrcode-generator
       node tools/build-pptx.js

   Set siteUrl in assets/edition.js first if you want QR codes in the file.
   ========================================================================== */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
let qrcode = null; try { qrcode = require("qrcode-generator"); } catch (e) {}
const JSZip = require(require.resolve("jszip", { paths: [path.dirname(require.resolve("pptxgenjs"))] }));

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "downloads", "redecorating-power-deck.pptx");
const D = require(path.join(ROOT, "deck", "slides.js"));
const A = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "styles.json"), "utf8"));
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets", "edition.js"), "utf8"), ctx);
const E = ctx.window.EDITION || {};

/* ---------------------------------------------------------------- theme */
const THEME = {
  name: "Redecorating Power (DDS)", headFontFace: "Roobert", bodyFontFace: "Roobert",
  colors: { dk1: "0B0C0C", lt1: "FFFFFF", dk2: "0B0C0C", lt2: "F0EEE5",
            accent1: "C5FF71", accent2: "3F5DFE", accent3: "FF3F25", accent4: "A9EAFF", accent5: "E1BCE0", accent6: "FBE965",
            hlink: "3F5DFE", folHlink: "3F5DFE" }
};
const PH_ACCENT = { lime: "accent1", blue: "accent2", red: "accent3", sky: "accent4", lilac: "accent5", yellow: "accent6", ink: "text1" };
const HEX = { lime: "C5FF71", sky: "A9EAFF", yellow: "FBE965", lilac: "E1BCE0", red: "FF3F25", blue: "3F5DFE", ink: "0B0C0C" };
const MUTED = "6F6F6A", FAINT = "A9A8A2", HAIR = "C9C7BE", MONO = "Courier New";

/* px on a 1600×900 stage → inches on a 13.333×7.5 slide */
const X = px => +(px / 120).toFixed(3);
const PT = px => Math.round(px * 0.6);

/* ---------------------------------------------------------------- data */
const ALL = []; A.forEach(d => d.bodies.forEach(b => ALL.push({ d, b })));
const byShot = s => ALL.find(x => x.b.shot === s);
const primary = b => { const p = (b.colors || []).find(c => c.role === "primary"); return ((p || b.colors[0] || { hex: "#999999" }).hex).replace("#", "").toUpperCase(); };
function isBlue(hex) { const r = parseInt(hex.slice(0, 2), 16) / 255, g = parseInt(hex.slice(2, 4), 16) / 255, b = parseInt(hex.slice(4, 6), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b); if (mx - mn < .12) return false; let H;
  if (mx === b) H = 60 * ((r - g) / (mx - mn)) + 240; else if (mx === g) H = 60 * ((b - r) / (mx - mn)) + 120; else H = 60 * (((g - b) / (mx - mn)) % 6);
  H = (H + 360) % 360; return H >= 190 && H <= 250; }
const FORMAT = D.FORMATS[E.format] || D.FORMATS["3h30"];
const phaseMins = ph => ({ "00": [0], "01": [1], "02": [2], "03": [4], "04": [5], "05": [6], "06": [7] }[ph] || []).reduce((a, i) => a + FORMAT[i], 0);
const kitUrl = (E.siteUrl || "").trim();
const shortUrl = u => u.replace(/^https?:\/\//, "").replace(/\/$/, "");
const edLine = [E.event, E.venue, E.city, E.date, E.time].filter(Boolean).join(" · ");

async function shotPng(shot, w, h) {
  const f = path.join(ROOT, "screenshots", shot + ".webp");
  if (!fs.existsSync(f)) return null;
  const meta = await sharp(f).metadata();
  const ratio = w / h; const cw = meta.width; const ch = Math.min(meta.height, Math.round(cw / ratio));
  const buf = await sharp(f).extract({ left: 0, top: 0, width: cw, height: ch }).resize(Math.round(w * 1.5)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
async function qrPng(url) {
  if (!qrcode || !url) return null;
  const q = qrcode(0, "M"); q.addData(url); q.make(); const n = q.getModuleCount(); let p = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) p += `M${c},${r}h1v1h-1z`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 ${n + 4} ${n + 4}" width="800" height="800" shape-rendering="crispEdges"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/><path d="${p}" fill="#0B0C0C"/></svg>`;
  return "image/png;base64," + (await sharp(Buffer.from(svg)).png().toBuffer()).toString("base64");
}

/* ---------------------------------------------------------------- deck */
(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = "Redecorating Power — workshop deck";
  pres.author = "Domestic Data Streamers";
  pres.company = "Domestic Data Streamers";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const num = { x: X(1380), y: X(840), w: X(150), h: X(30), fontFace: MONO, fontSize: 9, color: MUTED, align: "right" };

  pres.defineSlideMaster({ title: "RP Cover", background: { color: C.background2 },
    objects: [{ placeholder: { options: { name: "title", type: "title", align: "left", x: X(72), y: X(300), w: X(1150), h: X(390), fontSize: PT(150), bold: false, color: C.text1, valign: "bottom", margin: 0 }, text: "" } }] });
  pres.defineSlideMaster({ title: "RP Phase", background: { color: C.background2 },
    objects: [{ placeholder: { options: { name: "title", type: "title", align: "left", x: X(72), y: X(560), w: X(1400), h: X(200), fontSize: PT(104), color: C.text1, valign: "bottom", margin: 0 }, text: "" } }] });
  pres.defineSlideMaster({ title: "RP Content White", background: { color: C.background1 }, slideNumber: num,
    objects: [{ placeholder: { options: { name: "title", type: "title", align: "left", x: X(72), y: X(96), w: X(1456), h: X(100), fontSize: PT(68), color: C.text1, valign: "bottom", margin: 0 }, text: "" } }] });
  pres.defineSlideMaster({ title: "RP Content Cream", background: { color: C.background2 }, slideNumber: num,
    objects: [{ placeholder: { options: { name: "title", type: "title", align: "left", x: X(72), y: X(96), w: X(1456), h: X(100), fontSize: PT(68), color: C.text1, valign: "bottom", margin: 0 }, text: "" } }] });
  pres.defineSlideMaster({ title: "RP Dark", background: { color: C.text1 }, slideNumber: { ...num, color: FAINT },
    objects: [{ placeholder: { options: { name: "title", type: "title", align: "left", x: X(72), y: X(130), w: X(760), h: X(400), fontSize: PT(96), color: C.background2, valign: "top", margin: 0 }, text: "" } }] });
  pres.defineSlideMaster({ title: "RP Exercise", background: { color: C.background2 }, slideNumber: num,
    objects: [{ rect: { x: X(44), y: X(44), w: X(1512), h: X(780), fill: { color: C.background1 }, line: { type: "none" }, rectRadius: 0 } },
              { placeholder: { options: { name: "title", type: "title", align: "left", x: X(108), y: X(160), w: X(570), h: X(240), fontSize: PT(72), color: C.text1, valign: "top", margin: 0 }, text: "" } }] });
  pres.defineSlideMaster({ title: "RP Blank", background: { color: C.background1 }, slideNumber: num, objects: [] });

  const tb = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, fontFace: THEME.bodyFontFace, color: C.text1, valign: "top", ...o });
  const hair = (slide, x, y, w, color) => slide.addShape(pres.shapes.LINE, { x: X(x), y: X(y), w: X(w), h: 0, line: { color: color || HAIR, width: 0.75 } });
  const pill = (slide, text, x, y, o = {}) => { const w = o.w || Math.max(90, text.length * 9 + 34);
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: X(x), y: X(y), w: X(w), h: X(32), rectRadius: 0.5, fill: o.fill ? { color: o.fill } : { type: "none" }, line: { color: o.line || C.text1, width: 0.75 }, objectName: "Tag " + text });
    tb(slide, text, { x: X(x), y: X(y), w: X(w), h: X(32), fontSize: 10, align: "center", valign: "middle", color: o.color || C.text1 }); };
  const qrBlock = async (slide, x, y, w, dark) => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: X(x), y: X(y), w: X(w), h: X(w + 70), rectRadius: 0.25, fill: { color: C.background1 }, line: { type: "none" }, objectName: "Kit address card" });
    const q = await qrPng(kitUrl);
    if (q) { slide.addImage({ data: q, x: X(x + 24), y: X(y + 24), w: X(w - 48), h: X(w - 48), altText: "QR code to the workshop kit", objectName: "QR code" });
      tb(slide, shortUrl(kitUrl), { x: X(x + 24), y: X(y + w - 10), w: X(w - 48), h: X(60), fontSize: 10, fontFace: MONO }); }
    else tb(slide, [{ text: "Kit address", options: { fontSize: 12, color: MUTED, breakLine: true } }, { text: "Add your GitHub Pages address here, or set siteUrl in assets/edition.js and rebuild for a QR code.", options: { fontSize: 16 } }],
      { x: X(x + 28), y: X(y + 28), w: X(w - 56), h: X(w), objectName: "Kit address placeholder" });
  };

  let section = null;
  const sectionFor = s => ({ "00": "00 Boot", "01": "01 Read the grammar", "02": "02 Pick a target", "03": "03 Clone the skin", "04": "04 Pour in the story", "05": "05 The register", "06": "06 Debrief" }[s.ph] || null);
  pres.addSection({ title: "Opening" }); section = "Opening";

  for (const s of D.SLIDES) {
    const sec = sectionFor(s);
    if (sec && sec !== section && (s.t === "phase")) { pres.addSection({ title: sec }); section = sec; }
    if (s.t === "close" && section !== "Close") { pres.addSection({ title: "Close" }); section = "Close"; }
    const add = master => pres.addSlide({ masterName: master, sectionTitle: section });
    let sl;

    switch (s.t) {
      case "cover": {
        sl = add("RP Cover");
        tb(sl, "DOMESTIC DATA STREAMERS", { x: X(72), y: X(40), w: X(700), h: X(30), fontSize: 10, charSpacing: 4 });
        sl.addText("Redecorating\nPower", { placeholder: "title" });
        tb(sl, "A workshop on bureaucratic aesthetics and the stories they hide.", { x: X(72), y: X(720), w: X(1000), h: X(50), fontSize: PT(30) });
        tb(sl, edLine || "Education & Tools", { x: X(72), y: X(790), w: X(1000), h: X(40), fontSize: PT(20), color: edLine ? C.text1 : MUTED });
        await qrBlock(sl, 1228, 120, 300);
        break; }
      case "join": {
        sl = add("RP Content White");
        sl.addText("Open the kit", { placeholder: "title" });
        tb(sl, kitUrl ? shortUrl(kitUrl) : "your-user.github.io/redecorating-power", { x: X(72), y: X(260), w: X(820), h: X(120), fontSize: PT(34), fontFace: MONO, objectName: "Kit address" });
        const wifi = E.wifi && E.wifi.network ? `Wifi: ${E.wifi.network}${E.wifi.password ? "   Password: " + E.wifi.password : ""}` : "Style Bureau · Dossiers · Exercises · this deck";
        tb(sl, wifi, { x: X(72), y: X(740), w: X(820), h: X(50), fontSize: PT(24) });
        await qrBlock(sl, 1000, 150, 520);
        break; }
      case "phase": {
        const col = D.PHASES[s.ph].color; const dark = ["red", "blue", "ink"].includes(col);
        sl = add("RP Phase");
        sl.background = { color: C[PH_ACCENT[col]] };
        const fg = dark ? C.background2 : C.text1;
        tb(sl, s.ph, { x: X(58), y: X(20), w: X(1000), h: X(420), fontSize: PT(420), color: fg, objectName: "Phase number" });
        sl.addText(s.title, { placeholder: "title", color: fg });
        tb(sl, s.line || "", { x: X(72), y: X(780), w: X(1300), h: X(50), fontSize: PT(30), color: fg });
        const m = phaseMins(s.ph);
        if (m) { sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: X(1390), y: X(60), w: X(140), h: X(52), rectRadius: 0.5, fill: { type: "none" }, line: { color: fg, width: 1 }, objectName: "Duration" });
                 tb(sl, `${m} min`, { x: X(1390), y: X(60), w: X(140), h: X(52), fontSize: PT(24), align: "center", valign: "middle", color: fg }); }
        break; }
      case "question": {
        sl = add("RP Blank");
        const img = await shotPng(s.shot, 860, 900);
        if (img) sl.addImage({ data: img, x: 0, y: 0, w: X(860), h: X(900), altText: s.caption, objectName: "Screenshot" });
        tb(sl, s.q, { x: X(940), y: X(170), w: X(590), h: X(420), fontSize: PT(70), objectName: "Question" });
        tb(sl, s.caption, { x: X(940), y: X(780), w: X(590), h: X(40), fontSize: 11, color: MUTED });
        break; }
      case "exercise": {
        const col = D.PHASES[s.ph].color;
        sl = add("RP Exercise");
        pill(sl, "Exercise " + s.id, 108, 104, { fill: "0B0C0C", line: "0B0C0C", color: "FFFFFF", w: 130 });
        sl.addShape(pres.shapes.OVAL, { x: X(252), y: X(111), w: X(18), h: X(18), fill: { color: C[PH_ACCENT[col]] }, line: { type: "none" } });
        tb(sl, "Phase " + s.ph, { x: X(280), y: X(104), w: X(200), h: X(32), fontSize: 10, valign: "middle", color: MUTED });
        sl.addText(s.title, { placeholder: "title" });
        hair(sl, 108, 420, 560);
        tb(sl, [["Time", s.time], ["Who", s.who], ["Hand in", s.out]].map(([k, v], i, a) => ([{ text: k + "    ", options: { color: MUTED } }, { text: v, options: { breakLine: i < a.length - 1 } }])).flat(),
          { x: X(108), y: X(440), w: X(560), h: X(150), fontSize: PT(22), paraSpaceAfter: 6 });
        tb(sl, "Sheet: " + (kitUrl ? shortUrl(kitUrl) + "/" : "kit/") + s.link, { x: X(108), y: X(760), w: X(600), h: X(30), fontSize: 9, fontFace: MONO, color: MUTED });
        let y = 104; hair(sl, 740, y, 760);
        for (let i = 0; i < s.steps.length; i++) {
          const L = s.steps[i].length; const h = L > 95 ? 128 : L > 46 ? 100 : 72;
          tb(sl, String(i + 1).padStart(2, "0"), { x: X(740), y: X(y + 20), w: X(50), h: X(30), fontSize: 9, fontFace: MONO, color: MUTED });
          tb(sl, s.steps[i], { x: X(800), y: X(y + 14), w: X(700), h: X(h - 20), fontSize: PT(26) });
          y += h; hair(sl, 740, y, 760);
        }
        break; }
      case "statement": {
        sl = add(s.dark ? "RP Dark" : "RP Content Cream");
        const fg = s.dark ? C.background2 : C.text1;
        tb(sl, s.big, { x: X(72), y: X(130), w: X(1400), h: X(420), fontSize: PT(100), color: fg, objectName: "Statement" });
        if (s.small) tb(sl, s.small, { x: X(72), y: X(640), w: X(1000), h: X(160), fontSize: PT(26), color: fg });
        break; }
      case "timeline": {
        sl = add("RP Content White");
        sl.addText(s.title, { placeholder: "title" });
        const tot = FORMAT.reduce((a, b) => a + b, 0); let x = 72; const W = 1456;
        let start = null; const m = (E.time || "").match(/(\d{1,2})[:.h](\d{2})/); if (m) start = +m[1] * 60 + +m[2];
        const fmt = t => `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
        let acc = 0, k = 0;
        D.BLOCKS.forEach((b, i) => { const mins = FORMAT[i]; if (!mins) return;
          const fill = b.ph === "—" ? { color: "D7D5CC" } : b.ph === "07" ? { color: C.text1 } : { color: C[PH_ACCENT[D.PHASES[b.ph].color]] };
          const w = W * mins / tot; sl.addShape(pres.shapes.RECTANGLE, { x: X(x), y: X(270), w: X(w - 4), h: X(56), fill, line: { type: "none" }, objectName: "Block " + b.name }); x += w;
          const col = k % 3, row = Math.floor(k / 3); const rx = 72 + col * 500, ry = 390 + row * 66;
          sl.addShape(pres.shapes.OVAL, { x: X(rx), y: X(ry + 22), w: X(20), h: X(20), fill, line: { type: "none" } });
          tb(sl, (b.ph !== "—" ? b.ph + " · " : "") + b.name, { x: X(rx + 34), y: X(ry + 14), w: X(320), h: X(36), fontSize: PT(24) });
          tb(sl, start != null ? fmt(start + acc) : mins + " min", { x: X(rx + 340), y: X(ry + 16), w: X(110), h: X(36), fontSize: 11, fontFace: MONO, align: "right", color: MUTED });
          hair(sl, rx, ry + 60, 460); acc += mins; k++; });
        tb(sl, `Run of show · ${Math.floor(tot / 60)}h${tot % 60 ? String(tot % 60).padStart(2, "0") : ""}`, { x: X(72), y: X(40), w: X(600), h: X(30), fontSize: 10, charSpacing: 3 });
        break; }
      case "rule": {
        sl = add("RP Dark");
        sl.addText([{ text: "Convicted or resigned.", options: { breakLine: true } }, { text: "Nothing else.", options: { highlight: "C5FF71", color: "0B0C0C" } }], { placeholder: "title" });
        let y = 140; hair(sl, 880, y, 650, "5B5B57");
        for (const p of s.points) { const h = p.length > 150 ? 190 : 150; tb(sl, p, { x: X(880), y: X(y + 20), w: X(650), h: X(h - 30), fontSize: PT(25), color: C.background2 }); y += h; hair(sl, 880, y, 650, "5B5B57"); }
        break; }
      case "palette": {
        sl = add("RP Content White");
        sl.addText(s.title, { placeholder: "title" });
        tb(sl, s.line, { x: X(72), y: X(205), w: X(1200), h: X(36), fontSize: PT(24), color: MUTED });
        const n = ALL.filter(x => isBlue(primary(x.b))).length;
        tb(sl, String(n), { x: X(62), y: X(260), w: X(420), h: X(240), fontSize: PT(240), objectName: "Blue count" });
        tb(sl, `of ${ALL.length} lead with a navy or royal blue`, { x: X(80), y: X(510), w: X(380), h: X(90), fontSize: PT(28) });
        const gx = 640, gy = 290, step = 58, d = 44, labs = ["Parliament", "Government", "Enforcement"];
        A.forEach((c, ci) => tb(sl, c.iso, { x: X(gx + ci * step), y: X(gy - 40), w: X(d), h: X(26), fontSize: 9, fontFace: MONO, align: "center", color: MUTED }));
        for (let r = 0; r < 3; r++) {
          tb(sl, labs[r], { x: X(gx - 150), y: X(gy + r * step + 10), w: X(140), h: X(26), fontSize: 10, color: MUTED });
          A.forEach((c, ci) => { const b = c.bodies[r]; if (!b) return; const h = primary(b);
            sl.addShape(pres.shapes.OVAL, { x: X(gx + ci * step), y: X(gy + r * step), w: X(d), h: X(d), fill: { color: h }, line: isBlue(h) ? { color: "E2E1DC", width: 0.5 } : { color: "0B0C0C", width: 2.25 }, objectName: `${c.iso} ${b.typeLabel} ${h}` }); });
        }
        tb(sl, "Ringed: the ones that didn't.", { x: X(gx), y: X(780), w: X(600), h: X(30), fontSize: 12, color: MUTED });
        break; }
      case "fonts": {
        sl = add("RP Content White");
        sl.addText(s.title, { placeholder: "title" });
        tb(sl, s.line, { x: X(72), y: X(205), w: X(1200), h: X(36), fontSize: PT(24), color: MUTED });
        const cnt = {}, disp = {};
        ALL.forEach(({ b }) => { const f = (b.fonts || []).find(x => /body/.test(x.usage)) || b.fonts[0]; if (!f) return; const k = f.family.toLowerCase(); cnt[k] = (cnt[k] || 0) + 1; if (!disp[k] || /[A-Z]/.test(f.family[0])) disp[k] = f.family; });
        const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 6);
        tb(sl, disp[top[0][0]], { x: X(72), y: X(290), w: X(680), h: X(200), fontSize: PT(180), fontFace: "Roboto", objectName: "Top typeface" });
        tb(sl, `Google's house typeface. Body text on ${top[0][1]} of the ${ALL.length} sites, ahead of Arial.`, { x: X(80), y: X(520), w: X(600), h: X(100), fontSize: PT(28) });
        sl.addChart(pres.charts.BAR, [{ name: "Sites", labels: top.map(([k]) => disp[k]), values: top.map(([, v]) => v) }], {
          x: X(760), y: X(270), w: X(780), h: X(400), barDir: "bar", catAxisOrientation: "maxMin", chartColors: ["0B0C0C"], barGapWidthPct: 60,
          showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: "0B0C0C", dataLabelFontFace: "+mn-lt",
          catAxisLabelFontSize: 14, catAxisLabelColor: "0B0C0C", catAxisLabelFontFace: "+mn-lt", valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
          catAxisLineShow: false, showLegend: false, showTitle: false, objectName: "Typeface count chart" });
        break; }
      case "systems": {
        sl = add("RP Content Cream");
        sl.addText(s.title, { placeholder: "title" });
        const ws = [400, 320, 320, 400]; let x = 72;
        for (let i = 0; i < s.items.length; i++) { const it = s.items[i]; const w = ws[i]; const h = i % 2 ? 240 : 300; const y = i % 2 ? 330 : 270;
          const img = await shotPng(it.shot, w, h);
          if (img) sl.addImage({ data: img, x: X(x), y: X(y), w: X(w), h: X(h), rounding: false, altText: it.country + " government site", objectName: "Screenshot " + it.country });
          tb(sl, it.name, { x: X(x), y: X(y + h + 14), w: X(w), h: X(60), fontSize: PT(24) });
          const bx = byShot(it.shot); const hex = bx ? primary(bx.b) : "999999";
          sl.addShape(pres.shapes.OVAL, { x: X(x), y: X(y + h + 82), w: X(18), h: X(18), fill: { color: hex }, line: { type: "none" } });
          tb(sl, `${it.country} · ${it.font}`, { x: X(x + 28), y: X(y + h + 76), w: X(w - 28), h: X(30), fontSize: PT(18), color: MUTED });
          x += w + 24; }
        break; }
      case "annotate": {
        sl = add("RP Blank");
        const img = await shotPng(s.shot, 900, 900);
        if (img) sl.addImage({ data: img, x: 0, y: 0, w: X(900), h: X(900), altText: s.caption, objectName: "Screenshot" });
        tb(sl, s.title, { x: X(970), y: X(90), w: X(560), h: X(140), fontSize: PT(56), objectName: "Title" });
        let y = 250; hair(sl, 970, y, 560);
        s.points.forEach((p, i) => { const h = p.length > 40 ? 88 : 58;
          sl.addShape(pres.shapes.OVAL, { x: X(970), y: X(y + 14), w: X(30), h: X(30), fill: { color: C.accent1 }, line: { type: "none" } });
          tb(sl, String(i + 1), { x: X(970), y: X(y + 14), w: X(30), h: X(30), fontSize: 10, align: "center", valign: "middle" });
          tb(sl, p, { x: X(1018), y: X(y + 12), w: X(512), h: X(h - 16), fontSize: PT(22) }); y += h; hair(sl, 970, y, 560); });
        tb(sl, s.caption, { x: X(970), y: X(800), w: X(560), h: X(30), fontSize: 10, color: MUTED });
        break; }
      case "voice": {
        sl = add("RP Content White");
        sl.addText(s.title, { placeholder: "title" });
        tb(sl, "Real wording, taken from the sites in the Style Bureau.", { x: X(72), y: X(205), w: X(1200), h: X(36), fontSize: PT(24), color: MUTED });
        let y = 250; hair(sl, 72, y, 1456);
        for (const [sh, ix] of s.picks) { const x = byShot(sh); if (!x) continue; const l = (x.b.language_samples || [])[ix]; if (!l) continue;
          const h = l.original.length > 90 ? 150 : 118;
          tb(sl, [{ text: `“${l.original}”`, options: { fontSize: PT(25), breakLine: true } }, { text: l.english, options: { fontSize: PT(16), color: MUTED } }], { x: X(72), y: X(y + 14), w: X(1080), h: X(h - 20), paraSpaceAfter: 4 });
          tb(sl, [{ text: x.b.short, options: { breakLine: true } }, { text: `${x.d.country} · ${l.context.split(/[,(]/)[0]}`, options: { color: MUTED } }], { x: X(1190), y: X(y + 14), w: X(338), h: X(h - 20), fontSize: 10, align: "right" });
          y += h; hair(sl, 72, y, 1456); }
        break; }
      case "list": {
        sl = add("RP Content White");
        pill(sl, s.kicker, 72, 110);
        tb(sl, s.title, { x: X(72), y: X(160), w: X(540), h: X(420), fontSize: PT(64), objectName: "Title" });
        let y = 150; hair(sl, 680, y, 848);
        const each = Math.min(150, Math.floor(660 / s.items.length));
        s.items.forEach((it, i) => {
          tb(sl, String(i + 1).padStart(2, "0"), { x: X(680), y: X(y + 26), w: X(50), h: X(26), fontSize: 9, fontFace: MONO, color: MUTED });
          tb(sl, [{ text: it.h, options: { fontSize: PT(28), breakLine: true } }, { text: it.d, options: { fontSize: PT(19), color: MUTED } }], { x: X(740), y: X(y + 16), w: X(788), h: X(each - 24), paraSpaceAfter: 4 });
          y += each; hair(sl, 680, y, 848); });
        break; }
      case "ladder": {
        sl = add("RP Content White");
        sl.addText(s.title, { placeholder: "title" });
        const spec = [{ y: 250, fs: 30, c: FAINT, h: 60 }, { y: 330, fs: 38, c: MUTED, h: 70 }, { y: 450, fs: 42, c: C.text1, h: 300 }];
        s.rungs.forEach((r, i) => { tb(sl, "0" + (i + 1), { x: X(72), y: X(spec[i].y + 10), w: X(60), h: X(30), fontSize: 10, fontFace: MONO, color: MUTED });
          tb(sl, r, { x: X(162), y: X(spec[i].y), w: X(1370), h: X(spec[i].h), fontSize: PT(spec[i].fs), color: spec[i].c }); });
        tb(sl, s.source, { x: X(162), y: X(790), w: X(800), h: X(30), fontSize: 11, color: MUTED });
        break; }
      case "compare": {
        sl = add("RP Content White");
        sl.addText(s.title, { placeholder: "title" });
        pill(sl, s.left.label, 72, 262, { line: HAIR, color: MUTED });
        tb(sl, s.left.text, { x: X(72), y: X(320), w: X(540), h: X(240), fontSize: PT(38), color: FAINT, strike: "sngStrike" });
        pill(sl, s.right.label, 700, 262, { fill: "C5FF71", line: "C5FF71" });
        sl.addShape(pres.shapes.RECTANGLE, { x: X(700), y: X(320), w: X(828), h: X(380), fill: { color: "FFFFFF" }, line: { color: "C9CCD1", width: 0.75 }, objectName: "Mock notice" });
        sl.addShape(pres.shapes.RECTANGLE, { x: X(700), y: X(320), w: X(828), h: X(56), fill: { color: "0D357B" }, line: { type: "none" }, objectName: "Mock notice header" });
        tb(sl, s.right.head, { x: X(724), y: X(320), w: X(780), h: X(56), fontFace: "Arial", bold: true, fontSize: 13, color: "FFFFFF", valign: "middle" });
        tb(sl, s.right.text, { x: X(724), y: X(396), w: X(780), h: X(230), fontFace: "Arial", fontSize: PT(27), color: "1D1D1B" });
        hair(sl, 700, 650, 828, "E2E4E8");
        tb(sl, "Inicio › Sala de Prensa › Notas informativas", { x: X(724), y: X(660), w: X(780), h: X(30), fontFace: "Arial", fontSize: 9, color: "5E5E5E" });
        tb(sl, s.source, { x: X(700), y: X(790), w: X(800), h: X(30), fontSize: 11, color: MUTED });
        break; }
      case "brk": {
        sl = add("RP Phase");
        sl.background = { color: C.accent1 };
        tb(sl, s.title, { x: X(60), y: X(150), w: X(1100), h: X(320), fontSize: PT(290), objectName: "Break" });
        tb(sl, `${FORMAT[3] || 10} minutes`, { x: X(80), y: X(480), w: X(800), h: X(80), fontSize: PT(54) });
        tb(sl, s.line, { x: X(80), y: X(760), w: X(1200), h: X(60), fontSize: PT(30) });
        break; }
      case "close": {
        sl = add("RP Dark");
        sl.addText("Case\nclosed.", { placeholder: "title", fontSize: PT(160) });
        tb(sl, "The kit stays online. Take it home, run it again, send us what you make.", { x: X(72), y: X(560), w: X(820), h: X(110), fontSize: PT(30), color: C.background2 });
        const meta = [E.submitUrl ? "Post your site: " + shortUrl(E.submitUrl) : null, E.hashtag || null, "hello@domesticstreamers.com"].filter(Boolean).join("\n");
        tb(sl, meta, { x: X(72), y: X(730), w: X(820), h: X(100), fontSize: PT(20), color: FAINT });
        await qrBlock(sl, 1148, 130, 380);
        break; }
      default: sl = add("RP Blank"); tb(sl, "Unknown slide type: " + s.t, { x: 1, y: 1, w: 8, h: 1, fontSize: 18 });
    }
    if (s.notes) sl.addNotes(s.notes);
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await pres.writeFile({ fileName: OUT });
  await patchTheme(OUT, THEME);
  console.log("wrote", path.relative(ROOT, OUT), `(${D.SLIDES.length} slides)`);
})().catch(e => { console.error("Build failed:", e.message); process.exit(1); });

/* pptxgenjs can't write theme colours, so patch the theme part directly */
async function patchTheme(file, T) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const themes = Object.keys(zip.files).filter(f => /^ppt\/theme\/theme\d+\.xml$/.test(f));
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  for (const t of themes) {
    let x = await zip.file(t).async("string");
    for (const [k, v] of Object.entries(T.colors)) x = x.replace(new RegExp(`<a:${k}>[\\s\\S]*?</a:${k}>`), `<a:${k}><a:srgbClr val="${v}"/></a:${k}>`);
    x = x.replace(/<a:clrScheme name="[^"]*"/, `<a:clrScheme name="${esc(T.name)}"`);
    x = x.replace(/(<a:majorFont>\s*<a:latin typeface=")[^"]*"/, `$1${esc(T.headFontFace)}"`).replace(/(<a:minorFont>\s*<a:latin typeface=")[^"]*"/, `$1${esc(T.bodyFontFace)}"`);
    zip.file(t, x);
  }
  fs.writeFileSync(file, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}
