/* Shared page chrome: top bar, footer, edition strip, QR codes, copy-to-clipboard. */
(function(){
  const body = document.body;
  const ROOT = body.dataset.root || "./";
  const PAGE = body.dataset.page || "";
  const E = window.EDITION || {};

  const LINKS = [
    ["home", "Kit", ""],
    ["bureau", "Style Bureau", "bureau/"],
    ["dossiers", "Dossiers", "dossiers/"],
    ["exercises", "Exercises", "exercises/"],
    ["deck", "Deck", "deck/"],
    ["facilitator", "Facilitators", "facilitator/"],
    ["downloads", "Downloads", "downloads/"]
  ];

  /* public root URL of the kit, used for QR codes and copy links */
  window.kitUrl = function(path){
    let base = (E.siteUrl || "").trim();
    if(!base){ base = new URL(ROOT, location.href).href; }
    if(!base.endsWith("/")) base += "/";
    return base + (path || "");
  };

  /* ---------- top bar ---------- */
  const bar = document.createElement("header");
  bar.className = "bar";
  bar.innerHTML = `
    <div class="bar-in">
      <a class="wordmark" href="${ROOT}">Domestic Data Streamers <span class="kit">/ Redecorating Power</span></a>
      <nav class="menu" id="menu" aria-label="Main menu">
        ${LINKS.map(([k,l,h])=>`<a href="${ROOT}${h}" class="${k===PAGE?'on':''}">${l}</a>`).join("")}
      </nav>
      <button class="pill menu-toggle" aria-expanded="false" aria-controls="menu">Menu</button>
    </div>`;
  body.prepend(bar);
  const tg = bar.querySelector(".menu-toggle");
  tg.addEventListener("click", ()=>{
    const m = bar.querySelector(".menu"); const o = m.classList.toggle("open");
    tg.setAttribute("aria-expanded", o);
  });

  /* ---------- grain + toast ---------- */
  const g = document.createElement("div"); g.className = "grain"; body.appendChild(g);
  const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role","status"); body.appendChild(t);
  let tt;
  window.toast = function(msg){
    t.textContent = msg; t.classList.add("on");
    clearTimeout(tt); tt = setTimeout(()=>t.classList.remove("on"), 1900);
  };
  window.copyText = function(text, msg){
    const done = ()=>toast(msg || "Copied");
    const fail = ()=>toast("Could not copy. Select the text and copy by hand.");
    if(navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(text).then(done).catch(()=>legacy(text)?done():fail());
    } else { legacy(text)?done():fail(); }
  };
  function legacy(text){
    const ta = document.createElement("textarea"); ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0;left:-9999px"; document.body.appendChild(ta);
    ta.select(); let ok = false; try{ ok = document.execCommand("copy"); }catch(e){}
    ta.remove(); return ok;
  }

  /* ---------- edition strip ---------- */
  window.editionLine = function(){
    return [E.event, E.venue, E.city, E.date, E.time].filter(Boolean).join(" · ");
  };
  document.querySelectorAll("[data-edition]").forEach(el=>{
    const line = editionLine();
    if(line){ el.innerHTML = `<span class="dot"></span><span>${line}</span>`; el.classList.add("on"); }
  });

  /* ---------- QR codes (vendored qrcode-generator, MIT) ---------- */
  window.drawQR = function(el, url){
    if(typeof qrcode !== "function"){ el.textContent = url; return; }
    const q = qrcode(0, "M"); q.addData(url); q.make();
    const n = q.getModuleCount(); let p = "";
    for(let r=0;r<n;r++) for(let c=0;c<n;c++) if(q.isDark(r,c)) p += `M${c},${r}h1v1h-1z`;
    el.innerHTML = `<svg viewBox="-2 -2 ${n+4} ${n+4}" role="img" aria-label="QR code for ${url}" shape-rendering="crispEdges"><rect x="-2" y="-2" width="${n+4}" height="${n+4}" fill="#fff"/><path d="${p}" fill="#0B0C0C"/></svg>`;
  };
  document.querySelectorAll("[data-qr]").forEach(el=>drawQR(el, kitUrl(el.dataset.qr)));
  document.querySelectorAll("[data-kiturl]").forEach(el=>{ el.textContent = kitUrl(el.dataset.kiturl).replace(/^https?:\/\//,""); });

  /* ---------- footer ---------- */
  const f = document.createElement("footer");
  f.className = "foot";
  f.innerHTML = `
    <div class="foot-in">
      <div>
        <div class="lab">Redecorating Power</div>
        <p class="big">Clone the look of power. Fill it with the record.</p>
      </div>
      <div>
        <div class="lab">The kit</div>
        <ul>${LINKS.map(([k,l,h])=>`<li><a href="${ROOT}${h}">${l}</a></li>`).join("")}</ul>
      </div>
      <div>
        <div class="lab">Made by</div>
        <ul>
          <li><a href="https://www.domesticstreamers.com" target="_blank" rel="noopener">Domestic Data Streamers</a></li>
          <li><a href="https://www.domesticstreamers.com/education/" target="_blank" rel="noopener">Education &amp; Tools</a></li>
          <li><a href="mailto:hello@domesticstreamers.com">hello@domesticstreamers.com</a></li>
        </ul>
      </div>
      <div class="legal">
        <span>Screenshots and design tokens reproduced for criticism, parody and education. Named people hold final convictions or resigned over documented scandals; every claim links to its source.</span>
        <span>Research snapshot: October 2026</span>
      </div>
    </div>`;
  body.appendChild(f);
})();
