/* =========================================================================
   Abhisek Niraula — site behaviour
   Renders every page from window.SITE_DATA (assets/js/site-data.js) and adds
   the interactive layer: microscope hero, Histomonas scroll cursor, command
   palette (Ctrl/⌘ K), citations, lightbox, filters and theme switching.
   You normally never need to edit this file — edit site-data.js instead.
   ========================================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- data */
  const clone = (v) => JSON.parse(JSON.stringify(v || {}));
  const ORIGINAL = clone(window.SITE_DATA || {});
  let PREVIEW = false;
  let DATA = ORIGINAL;
  try {
    const stored = localStorage.getItem("abhisekSiteDataPreview");
    if (stored) { DATA = JSON.parse(stored); PREVIEW = true; }
  } catch (e) { DATA = ORIGINAL; }

  const page = document.body.dataset.page || "home";
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));
  const esc = (v) => String(v ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const P = () => DATA.profile || {};
  const MY_NAME_PATTERNS = [/Niraula,\s*A\.?/g, /Niraula,\s*Abhisek/g];

  const ICONS = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    quote: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 7h4v4c0 3-2 5-4 6M14 7h4v4c0 3-2 5-4 6"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m5 12 5 5 9-10"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m15 5-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m9 5 7 7-7 7"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 13h6M9 17h6"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/></svg>',
    page: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 9h16"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M13 3 5 14h6l-1 7 8-11h-6z"/></svg>',
    scholar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 9l11 6 9-4.9V17h2V9z"/><path d="M5 13.2V17c0 1.7 3.1 3 7 3s7-1.3 7-3v-3.8l-7 3.8z" opacity=".7"/></svg>',
    research: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 2H4.4A2.4 2.4 0 0 0 2 4.4v15.2A2.4 2.4 0 0 0 4.4 22h15.2a2.4 2.4 0 0 0 2.4-2.4V4.4A2.4 2.4 0 0 0 19.6 2zM9.7 16.8c-.5 0-1.8-.1-2.5-1.3l-1.3-2.1h-.8v2.4c0 .4.3.5.9.5v.4H3v-.4c.6 0 .9-.1.9-.5V9.5c0-.4-.3-.5-.9-.5v-.4h3.3c1.6 0 2.8.7 2.8 2.2 0 1.1-.8 1.8-1.7 2.1l1.4 2.2c.4.6.8.9 1.2 1v.4zm8.6-2.7c-.4 1.9-1.6 2.9-3.4 2.9-2.2 0-3.4-1.6-3.4-3.8s1.4-3.9 3.5-3.9c.8 0 1.4.2 1.9.5l.3-.4h.4v2.4h-.4c-.3-1.3-1-2-2.1-2-1.4 0-2 1.3-2 3.3 0 2.1.7 3.3 2.1 3.3 1.1 0 1.8-.9 1.9-2.3h-1.7v-.5h3.1v.5z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.5V9h3.6zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z"/></svg>',
    profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  };
  const HM_SVG = '<svg viewBox="0 0 48 48" aria-hidden="true"><use href="#hm"/></svg>';

  /* ------------------------------------------------------ colour themes */
  const THEME_RULES = [
    { c: "teal", k: ["histomon", "blackhead", "organoid", "heterakis"] },
    { c: "gold", k: ["coccid", "eimeria", "alloantigen", "mhc"] },
    { c: "rose", k: ["necrotic", "clostrid", "perfringens"] },
    { c: "violet", k: ["microbio", "qiime"] },
    { c: "blue", k: ["genetic", "influenza", "salmonella", "zoono", "parasit", "jackal"] },
  ];
  function colorFor(text) {
    const t = String(text || "").toLowerCase();
    for (const r of THEME_RULES) if (r.k.some((k) => t.includes(k))) return r.c;
    return "blue";
  }
  const cvar = (c) => `var(--${c})`;

  /* ------------------------------------------------------ seeded random */
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  /* Procedural "micrograph" artwork used wherever a real image is missing. */
  const HEX = { teal: "#4fe3d1", gold: "#f4c46a", rose: "#ff7ab6", violet: "#a78bfa", blue: "#6ea8ff" };
  function micrograph(seedText, color = "teal", opts = {}) {
    const W = opts.w || 640, H = opts.h || 420, r = rng(hash(seedText));
    const main = HEX[color] || HEX.teal, alt = color === "violet" ? HEX.teal : HEX.violet, id = "g" + hash(seedText + color).toString(36);
    let cells = "";
    const n = 14 + Math.floor(r() * 10);
    for (let i = 0; i < n; i++) {
      const x = r() * W, y = r() * H, rad = 14 + r() * 46, col = r() > 0.78 ? alt : main, o = 0.25 + r() * 0.55;
      const pts = [];
      const k = 9, wob = 0.12 + r() * 0.12;
      for (let j = 0; j < k; j++) { const a = (j / k) * Math.PI * 2, rr = rad * (1 + (r() - 0.5) * wob * 2); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
      let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
      for (let j = 0; j < k; j++) { const p1 = pts[(j + 1) % k], p0 = pts[j]; const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2; d += ` Q${p0[0].toFixed(1)} ${p0[1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`; }
      cells += `<path d="${d}Z" fill="url(#${id}f)" stroke="${col}" stroke-opacity="${o}" stroke-width="1.4" fill-opacity="${o * 0.6}"/>`;
      cells += `<circle cx="${(x + (r() - 0.5) * rad * 0.4).toFixed(1)}" cy="${(y + (r() - 0.5) * rad * 0.4).toFixed(1)}" r="${(rad * (0.22 + r() * 0.12)).toFixed(1)}" fill="${alt}" fill-opacity="${(o * 0.7).toFixed(2)}"/>`;
      if (r() > 0.72) { const a = r() * Math.PI * 2, x2 = x + Math.cos(a) * rad * 2.2, y2 = y + Math.sin(a) * rad * 2.2; cells += `<path d="M${(x + Math.cos(a) * rad).toFixed(1)} ${(y + Math.sin(a) * rad).toFixed(1)} Q${((x + x2) / 2 + 12).toFixed(1)} ${((y + y2) / 2 - 12).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${main}" stroke-opacity=".6" fill="none" stroke-width="1.2"/>`; }
      for (let g = 0; g < 3; g++) cells += `<circle cx="${(x + (r() - 0.5) * rad).toFixed(1)}" cy="${(y + (r() - 0.5) * rad).toFixed(1)}" r="${(1 + r() * 2).toFixed(1)}" fill="${HEX.gold}" fill-opacity=".7"/>`;
    }
    const label = opts.label ? `<text x="18" y="${H - 18}" font-family="JetBrains Mono, monospace" font-size="12" fill="#cfe" fill-opacity=".7" letter-spacing="1">${esc(opts.label)}</text>` : "";
    return `<svg class="art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Decorative micrograph-style illustration">
      <defs><radialGradient id="${id}f"><stop offset="0" stop-color="${main}" stop-opacity=".05"/><stop offset=".8" stop-color="${main}" stop-opacity=".25"/><stop offset="1" stop-color="${main}" stop-opacity=".5"/></radialGradient>
      <radialGradient id="${id}v" cx="50%" cy="50%" r="75%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></radialGradient></defs>
      <rect width="${W}" height="${H}" fill="#03070d"/>${cells}<rect width="${W}" height="${H}" fill="url(#${id}v)"/>
      <rect x="${W - 98}" y="${H - 26}" width="70" height="4" rx="2" fill="#fff" fill-opacity=".85"/>
      <text x="${W - 63}" y="${H - 32}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#fff" fill-opacity=".8">20 µm</text>${label}
    </svg>`;
  }

  /* --------------------------------------------------------- helpers */
  function markMe(authors) {
    let s = esc(authors);
    MY_NAME_PATTERNS.forEach((re) => { s = s.replace(re, (m) => `<strong>${m}</strong>`); });
    return s;
  }
  function chip(text, color) { return `<span class="chip${color ? " chip-dot" : ""}"${color ? ` style="--c:${cvar(color)}"` : ""}>${esc(text)}</span>`; }
  const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
  function dateKey(item) {
    const y = parseInt(item.year, 10) || 0;
    const m = MONTHS[String(item.date || "").slice(0, 3).toLowerCase()] || 0;
    return y * 100 + m;
  }
  function toast(msg) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = ICONS.check + `<span>${esc(msg)}</span>`;
    t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2200);
  }
  async function copyText(text, label = "Copied to clipboard") {
    try { await navigator.clipboard.writeText(text); }
    catch (e) { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (_) {} ta.remove(); }
    toast(label);
  }
  function allPublications() {
    const pubs = DATA.publications || {};
    return [
      ...(pubs.published || []).map((p) => ({ ...p, _status: "published" })),
      ...(pubs.submitted || []).map((p) => ({ ...p, _status: "submitted" })),
      ...(pubs.inPreparation || []).map((p) => ({ ...p, _status: "inPreparation" })),
    ];
  }
  const pubLink = (p) => p.url || (p.doi ? `https://doi.org/${p.doi}` : "");
  const isFirst = (p) => /first/i.test(p.role || "");
  const isMine = (p) => p.presentedByMe === true || /presenting author|presenter/i.test(p.role || "");

  /* --------------------------------------------------------- citations */
  function parseAuthors(str) {
    const s = String(str || "").replace(/\s*&\s*/g, ", ").replace(/;\s*/g, ", ");
    const parts = s.split(/,\s*/).map((x) => x.trim()).filter(Boolean);
    const out = [];
    for (let i = 0; i < parts.length; i += 2) out.push(parts[i + 1] ? `${parts[i]}, ${parts[i + 1]}` : parts[i]);
    return out;
  }
  function apa(p) {
    const bits = [`${p.authors} (${p.year}). ${p.title}.`];
    if (p.journal) bits.push(` ${p.journal}${p.volume ? `, ${p.volume}` : ""}${p.pages ? `, ${p.pages}` : ""}.`);
    else if (p.target) bits.push(` ${p.target}.`);
    if (p.doi) bits.push(` https://doi.org/${p.doi}`); else if (p.url) bits.push(` ${p.url}`);
    return bits.join("");
  }
  function bibtex(p) {
    const authors = parseAuthors(p.authors);
    const first = (authors[0] || "author").split(",")[0].normalize("NFD").replace(/[^\w]/g, "").toLowerCase();
    const word = (String(p.title).match(/[A-Za-z]{4,}/) || ["paper"])[0].toLowerCase();
    const vol = String(p.volume || ""), m = vol.match(/^(\d+)\((\d+)\)$/);
    const f = [
      ["title", `{${p.title}}`], ["author", authors.join(" and ")],
      ["journal", p.journal], ["year", p.year],
      ["volume", m ? m[1] : vol], ["number", m ? m[2] : ""],
      ["pages", String(p.pages || "").replace(/[–—]/g, "--")], ["doi", p.doi], ["url", p.url],
      ["note", p._status && p._status !== "published" ? (p.target || p.status) : ""],
    ].filter(([, v]) => v);
    const type = p.journal ? "article" : "unpublished";
    return `@${type}{${first}${p.year}${word},\n${f.map(([k, v]) => `  ${k} = {${v}}`).join(",\n")}\n}`;
  }

  /* ---------------------------------------------------------- overlays */
  function makeOverlay(id, cls = "") {
    let o = document.getElementById(id);
    if (o) return o;
    o = document.createElement("div");
    o.id = id; o.className = `overlay ${cls}`; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true");
    o.addEventListener("click", (e) => { if (e.target === o) closeOverlay(o); });
    document.body.appendChild(o);
    return o;
  }
  let lastFocus = null;
  function openOverlay(o) {
    lastFocus = document.activeElement;
    o.classList.add("open");
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => { const f = o.querySelector("input, button, [href]"); f && f.focus(); }, 30);
  }
  function closeOverlay(o) {
    if (!o) return;
    o.classList.remove("open");
    document.documentElement.style.overflow = "";
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") $$(".overlay.open").forEach(closeOverlay);
    const o = $(".overlay.open");
    if (e.key === "Tab" && o) { // focus trap
      const f = $$("a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])", o).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  function openCite(p) {
    const o = makeOverlay("cite-modal");
    const a = apa(p), b = bibtex(p);
    o.innerHTML = `<div class="dialog" aria-labelledby="cite-title">
      <div class="dialog-head"><strong id="cite-title">Cite this work</strong><button class="icon-btn" data-close aria-label="Close">${ICONS.close}</button></div>
      <div class="dialog-body">
        <p class="muted" style="margin:0 0 14px;font-size:14px">${esc(p.title)}</p>
        <span class="label">APA</span>
        <div class="code">${esc(a)}<button class="btn btn-sm" data-c="apa">${ICONS.copy}Copy</button></div>
        <span class="label">BibTeX</span>
        <div class="code">${esc(b)}<button class="btn btn-sm" data-c="bib">${ICONS.copy}Copy</button></div>
      </div></div>`;
    o.querySelector("[data-close]").onclick = () => closeOverlay(o);
    o.querySelector('[data-c="apa"]').onclick = () => copyText(a, "APA citation copied");
    o.querySelector('[data-c="bib"]').onclick = () => copyText(b, "BibTeX copied");
    italicize(o);
    openOverlay(o);
  }

  function openLightbox(list, index) {
    const o = makeOverlay("lightbox", "lightbox");
    const show = (i) => {
      index = (i + list.length) % list.length;
      const it = list[index];
      const media = it.image
        ? `<img src="${esc(it.image)}" alt="${esc(it.imageAlt || it.title)}" />`
        : micrograph(it.title, colorFor(it.title + " " + (it.tags || []).join(" ")), { w: 1000, h: 520, label: (it.type || "").toUpperCase() });
      o.innerHTML = `<div class="dialog" aria-label="${esc(it.title)}">
        <div class="lb-stage">${media}
          ${list.length > 1 ? `<button class="icon-btn lb-nav lb-prev" aria-label="Previous">${ICONS.left}</button><button class="icon-btn lb-nav lb-next" aria-label="Next">${ICONS.right}</button>` : ""}
        </div>
        <div class="dialog-body">
          <div class="entry-head"><span class="kicker" style="--k:${cvar(colorFor(it.title))}">${esc(it.type || it.category || "")}${it.year ? " · " + esc(it.year) : ""}</span>
          <span style="display:flex;gap:8px;align-items:center"><span class="dim mono" style="font-size:12px">${index + 1} / ${list.length}</span><button class="icon-btn" data-close aria-label="Close">${ICONS.close}</button></span></div>
          <h3 class="h3" style="margin-top:12px;font-size:1.25rem">${esc(it.title)}</h3>
          ${it.authors ? `<p class="pub-authors">${markMe(it.authors)}</p>` : ""}
          ${it.event ? `<p class="muted" style="margin:8px 0 0;font-size:14px">${esc(it.event)} · ${esc(it.location || "")} · ${esc(it.date || "")}</p>` : ""}
          ${it.status ? `<div class="chips" style="margin-top:14px">${chip(it.status, "teal")}${it.role ? chip(it.role) : ""}${(it.tags || []).map((t) => chip(t)).join("")}</div>` : ""}
        </div></div>`;
      o.querySelector("[data-close]").onclick = () => closeOverlay(o);
      const pv = o.querySelector(".lb-prev"), nx = o.querySelector(".lb-next");
      pv && (pv.onclick = () => show(index - 1));
      nx && (nx.onclick = () => show(index + 1));
      italicize(o);
    };
    o.onkeydown = (e) => { if (e.key === "ArrowLeft") show(index - 1); if (e.key === "ArrowRight") show(index + 1); };
    show(index);
    openOverlay(o);
    setTimeout(() => o.querySelector("[data-close]")?.focus(), 40);
  }

  /* ------------------------------------------------------ common chrome */
  function renderProfile() {
    const p = P();
    $$("[data-profile]").forEach((el) => { const v = p[el.dataset.profile]; if (v) el.textContent = v; });
    $$("#cv-link").forEach((a) => { if (p.cvFile) a.href = p.cvFile; });
    const img = $("#hero-image");
    if (img && p.heroImage) { img.src = p.heroImage; img.alt = p.heroImageAlt || ""; }
    const fe = $("#footer-email"); if (fe && p.email) { fe.href = `mailto:${p.email}`; fe.textContent = p.email; }
    const fn = $("#footer-note"); if (fn) fn.textContent = DATA.footerNote || `© ${new Date().getFullYear()} ${p.name || ""}`;
    const fl = $("#footer-links");
    if (fl) fl.innerHTML = (DATA.links || []).filter((l) => l.icon !== "email").map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("");
    $$("[data-copy-email]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); copyText(p.email, "Email copied"); }));
  }
  function socialLinks(root) {
    if (!root) return;
    root.innerHTML = (DATA.links || []).map((l) => `<a href="${esc(l.url)}" ${/^mailto:/.test(l.url) ? "" : 'target="_blank" rel="noopener"'} aria-label="${esc(l.label)}">${ICONS[l.icon] || ICONS.ext}<span>${esc(l.label)}</span></a>`).join("");
  }

  function initHeader() {
    const header = $("#site-header"), toTop = $("#to-top"), ring = $("#to-top-ring");
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, scrollY / max) : 0;
      header && header.classList.toggle("scrolled", scrollY > 8);
      header && header.style.setProperty("--p", p.toFixed(4));
      header && header.style.setProperty("--pv", p > 0.01 ? 1 : 0);
      toTop && toTop.classList.toggle("show", scrollY > innerHeight * 0.8);
      ring && ring.setAttribute("stroke-dashoffset", (131.95 * (1 - p)).toFixed(2));
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener("resize", update);
    update();
    toTop && toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));

    const btn = $("#menu-toggle"), menu = $("#mobile-menu");
    btn && btn.addEventListener("click", () => {
      const open = !menu.classList.contains("open");
      menu.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      document.documentElement.style.overflow = open ? "hidden" : "";
    });
    menu && menu.addEventListener("click", (e) => { if (e.target.closest("a")) { menu.classList.remove("open"); document.documentElement.style.overflow = ""; } });
  }

  function initTheme() {
    const btn = $("#theme-toggle");
    const paint = () => {
      const light = document.documentElement.dataset.theme === "light";
      const svg = btn && btn.querySelector("svg");
      if (svg) svg.innerHTML = light ? ICONS.moon : ICONS.sun;
      const meta = $('meta[name="theme-color"]'); meta && meta.setAttribute("content", light ? "#f5f6f2" : "#05080f");
    };
    btn && btn.addEventListener("click", () => toggleTheme());
    window.__paintTheme = paint;
    paint();
  }
  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    const apply = () => { document.documentElement.dataset.theme = next; try { localStorage.setItem("an-theme", next); } catch (e) {} window.__paintTheme && window.__paintTheme(); document.dispatchEvent(new Event("themechange")); };
    if (document.startViewTransition && !reduced) document.startViewTransition(apply); else apply();
  }

  /* Tiny Histomonas that takes over the mouse pointer while the page scrolls. */
  function initHistomonasCursor() {
    const el = $("#hm-cursor");
    if (!el || !finePointer || reduced) return;
    const svg = el.querySelector("svg");
    let x = -100, y = -100, has = false, t = null, lastY = scrollY, tilt = 0;
    const place = () => { el.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`; };
    addEventListener("pointermove", (e) => { if (e.pointerType !== "mouse") return; x = e.clientX; y = e.clientY; has = true; if (document.documentElement.classList.contains("hm-scrolling")) place(); }, { passive: true });
    document.addEventListener("mouseleave", () => { has = false; });
    addEventListener("scroll", () => {
      if (!has) return;
      const dy = scrollY - lastY; lastY = scrollY;
      tilt = Math.max(-28, Math.min(28, tilt * 0.6 + dy * 0.9));
      svg.style.setProperty("--tilt", `${tilt.toFixed(1)}deg`);
      place();
      document.documentElement.classList.add("hm-scrolling");
      clearTimeout(t);
      t = setTimeout(() => { document.documentElement.classList.remove("hm-scrolling"); tilt = 0; svg.style.setProperty("--tilt", "0deg"); }, 650);
    }, { passive: true });
  }

  function initReveal(root = document) {
    const items = $$(".reveal:not(.in)", root);
    if (!("IntersectionObserver" in window) || reduced) { items.forEach((i) => i.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    items.forEach((i) => io.observe(i));
  }
  function stagger(root) { $$(".reveal", root).forEach((el, i) => el.style.setProperty("--d", `${Math.min(i, 8) * 60}ms`)); }

  function initPointerFx() {
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest && e.target.closest(".spot");
      if (card) { const r = card.getBoundingClientRect(); card.style.setProperty("--mx", `${e.clientX - r.left}px`); card.style.setProperty("--my", `${e.clientY - r.top}px`); }
    }, { passive: true });
    if (!finePointer || reduced) return;
    $$(".magnetic").forEach((b) => {
      b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${((e.clientX - r.left) / r.width - 0.5) * 8}px, ${((e.clientY - r.top) / r.height - 0.5) * 8}px)`; });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });
  }

  /* ------------------------------------------------- command palette */
  function paletteIndex() {
    const pages = [
      ["Home", "index.html", "Overview"], ["Research", "research.html", "Projects & methods"], ["Publications", "publications.html", "Articles & manuscripts"],
      ["Presentations", "presentations.html", "Talks & posters"], ["CV", "cv.html", "Education, experience, funding"], ["Honors & service", "honors.html", "Awards & activities"],
      ["Media", "media.html", "Journal club, profiles, gallery"], ["Contact", "contact.html", "Email & collaboration"],
    ].map(([t, u, s]) => ({ g: "Pages", t, s, u, i: "page" }));
    const actions = [
      { g: "Actions", t: "Toggle dark / brightfield theme", s: "Appearance", i: "bolt", run: toggleTheme },
      { g: "Actions", t: "Copy email address", s: P().email, i: "email", run: () => copyText(P().email, "Email copied") },
      { g: "Actions", t: "Download CV (PDF)", s: "PDF", i: "download", u: P().cvFile },
    ];
    const pubs = allPublications().map((p) => ({ g: "Publications", t: p.title, s: `${p.journal || p.target || ""} · ${p.year}`, u: pubLink(p) || "publications.html", ext: !!pubLink(p), i: "doc", k: `${p.authors} ${(p.keywords || []).join(" ")}` }));
    const pres = (DATA.presentations || []).map((p) => ({ g: "Presentations", t: p.title, s: `${p.event} · ${p.year}`, u: "presentations.html", i: "mic", k: `${p.authors} ${(p.tags || []).join(" ")} ${p.location}` }));
    const proj = (DATA.projects || []).map((p) => ({ g: "Research", t: p.title, s: `${p.status} · ${p.year}`, u: "research.html#" + slug(p.title), i: "flask", k: (p.tags || []).join(" ") + " " + p.summary }));
    return { pages, actions, all: [...pages, ...actions, ...proj, ...pubs, ...pres] };
  }
  function initPalette() {
    const o = makeOverlay("palette", "palette");
    o.innerHTML = `<div class="dialog" aria-label="Search the site">
      <div class="palette-input">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'}
        <input id="palette-q" type="text" placeholder="Search pages, papers, talks, projects…" autocomplete="off" aria-label="Search" aria-controls="palette-list" /><kbd>Esc</kbd></div>
      <ul class="palette-list" id="palette-list" role="listbox"></ul>
      <div class="palette-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span><span><kbd>Enter</kbd> open</span></div></div>`;
    const input = $("#palette-q", o), list = $("#palette-list", o);
    let items = [], sel = 0, idx = null;
    const render = () => {
      idx = idx || paletteIndex();
      const q = input.value.trim().toLowerCase();
      const terms = q.split(/\s+/).filter(Boolean);
      if (!terms.length) items = [...idx.pages, ...idx.actions];
      else {
        const groups = {};
        idx.all.forEach((it) => {
          const hay = `${it.t} ${it.s || ""} ${it.k || ""}`.toLowerCase();
          if (terms.every((t) => hay.includes(t))) (groups[it.g] = groups[it.g] || []).push(it);
        });
        items = Object.values(groups).flatMap((g) => g.slice(0, 6));
      }
      sel = Math.min(sel, Math.max(0, items.length - 1));
      let g = "";
      list.innerHTML = items.length ? items.map((it, i) => {
        const head = it.g !== g ? `<li class="palette-group" role="presentation">${esc((g = it.g))}</li>` : "";
        return `${head}<li class="palette-item" role="option" id="pi-${i}" data-i="${i}" aria-selected="${i === sel}" style="--c:${cvar(colorFor(it.t + " " + (it.k || "")))}">
          <span class="pi-icon">${ICONS[it.i] || ICONS.page}</span><span class="pi-text"><div class="pi-title">${esc(it.t)}</div>${it.s ? `<div class="pi-sub">${esc(it.s)}</div>` : ""}</span></li>`;
      }).join("") : `<li class="palette-group" style="padding:24px;text-align:center;text-transform:none;letter-spacing:0">No results for “${esc(input.value)}”</li>`;
      italicize(list);
    };
    const go = (i) => {
      const it = items[i]; if (!it) return;
      closeOverlay(o);
      if (it.run) return it.run();
      if (it.ext) window.open(it.u, "_blank", "noopener"); else location.href = it.u;
    };
    const mark = () => { $$(".palette-item", list).forEach((el) => el.setAttribute("aria-selected", String(+el.dataset.i === sel))); const cur = $(`#pi-${sel}`, list); cur && cur.scrollIntoView({ block: "nearest" }); };
    input.addEventListener("input", () => { sel = 0; render(); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(items.length - 1, sel + 1); mark(); }
      if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); mark(); }
      if (e.key === "Enter") { e.preventDefault(); go(sel); }
    });
    list.addEventListener("click", (e) => { const li = e.target.closest(".palette-item"); li && go(+li.dataset.i); });
    list.addEventListener("mousemove", (e) => { const li = e.target.closest(".palette-item"); if (li && +li.dataset.i !== sel) { sel = +li.dataset.i; mark(); } });
    const open = () => { input.value = ""; sel = 0; render(); openOverlay(o); setTimeout(() => input.focus(), 30); };
    $$("[data-open-palette]").forEach((b) => b.addEventListener("click", open));
    document.addEventListener("keydown", (e) => {
      const typing = /input|textarea|select/i.test(document.activeElement?.tagName || "");
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); o.classList.contains("open") ? closeOverlay(o) : open(); }
      else if (e.key === "/" && !typing && !o.classList.contains("open")) { e.preventDefault(); open(); }
    });
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    if (isMac) $$("kbd").forEach((k) => { if (k.textContent === "Ctrl K") k.textContent = "⌘K"; });
  }
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");

  /* --------------------------------------------- scientific names */
  const SPECIES = ["Histomonas meleagridis", "H. meleagridis", "Eimeria maxima", "Eimeria acervulina", "Eimeria tenella", "Clostridium perfringens", "C. perfringens", "Heterakis gallinarum", "Escherichia coli", "E. coli", "Salmonella", "Eimeria", "Histomonas", "Clostridium", "Heterakis"];
  const SPECIES_RE = new RegExp(`\\b(${SPECIES.sort((a, b) => b.length - a.length).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "g");
  function italicize(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || p.closest("i, em, script, style, textarea, input, code, .code, svg, title, option")) return NodeFilter.FILTER_REJECT;
        SPECIES_RE.lastIndex = 0;
        return SPECIES_RE.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      const frag = document.createDocumentFragment(); let last = 0; const t = n.nodeValue; SPECIES_RE.lastIndex = 0; let m;
      while ((m = SPECIES_RE.exec(t))) { frag.append(t.slice(last, m.index)); const i = document.createElement("i"); i.textContent = m[0]; frag.append(i); last = m.index + m[0].length; }
      frag.append(t.slice(last)); n.replaceWith(frag);
    });
  }

  /* ================================================================ HOME */
  function renderHome() {
    socialLinks($("#hero-links"));

    // rotating focus words
    const words = DATA.profile?.rotatingFocus || ["histomoniasis", "cecal organoids", "coccidiosis", "necrotic enteritis", "the poultry microbiome"];
    const rot = $("#hero-rotator");
    if (rot) {
      rot.innerHTML = words.map((w, i) => `<span class="${i ? "" : "on"}"><b style="--c:${cvar(colorFor(w))}">${esc(w)}</b></span>`).join("");
      rot.setAttribute("aria-label", words.join(", "));
      if (!reduced && words.length > 1) { let i = 0; setInterval(() => { const s = rot.children; s[i].classList.remove("on"); i = (i + 1) % s.length; s[i].classList.add("on"); }, 2600); }
    }

    // stats with count-up
    const sg = $("#stats-grid");
    if (sg) {
      sg.innerHTML = (DATA.stats || []).map((s) => `<div class="stat"><div class="stat-value" data-count="${esc(s.value)}">${esc(s.value)}</div><div class="stat-label">${esc(s.label)}</div></div>`).join("");
      countUp(sg);
    }

    // disease pillars
    const pillars = DATA.pillars || [];
    const pubs = allPublications(), pres = DATA.presentations || [];
    const pg = $("#pillars");
    if (pg) {
      pg.innerHTML = pillars.map((p, i) => {
        const terms = (p.match || [p.title]).map((t) => t.toLowerCase());
        const hit = (x) => terms.some((t) => JSON.stringify(x).toLowerCase().includes(t));
        const c = p.color || colorFor(p.title);
        return `<a class="card spot pillar reveal" href="${esc(p.link || "research.html")}" style="--c:${cvar(c)};--d:${i * 80}ms">
          <div class="pillar-art">${micrograph(p.title, c, { w: 600, h: 220 })}<span class="art-label">${esc(p.label || p.title)}</span></div>
          <div class="pillar-body"><span class="kicker" style="--k:${cvar(c)}">${esc(p.host || "")}</span>
          <h3 class="h3" style="font-size:1.4rem">${esc(p.title)}</h3><p class="muted" style="margin:0;font-size:14.5px">${esc(p.summary)}</p>
          <div class="pillar-meta"><span><b>${pubs.filter(hit).length}</b> papers</span><span><b>${pres.filter(hit).length}</b> talks</span><span class="arrow-link" style="margin-left:auto">${ICONS.arrow}</span></div></div></a>`;
      }).join("");
    }
    const fb = $("#focus-badges");
    if (fb) fb.innerHTML = (DATA.focusAreas || []).map((f) => chip(f, colorFor(f))).join("");

    // first-author publications
    const hp = $("#home-pubs");
    if (hp) {
      const sel = pubs.filter((p) => p._status === "published" && isFirst(p)).sort((a, b) => b.year - a.year).slice(0, 3);
      hp.innerHTML = `<div class="grid grid-3">${sel.map((p, i) => `<article class="card spot card-pad reveal" style="--c:${cvar(colorFor(p.title + (p.keywords || []).join(" ")))};--d:${i * 80}ms;display:flex;flex-direction:column;gap:12px">
        <div class="chips"><span class="status-pill" style="--c:${cvar(colorFor(p.title + (p.keywords || []).join(" ")))}">${esc(p.type)}</span><span class="chip">${esc(p.year)}</span></div>
        <h3 class="pub-title"><a href="${esc(pubLink(p))}" target="_blank" rel="noopener">${esc(p.title)}</a></h3>
        <p class="pub-authors" style="margin:0">${markMe(p.authors)}</p>
        <p class="pub-venue muted" style="margin-top:auto"><em>${esc(p.journal)}</em>${p.volume ? `, ${esc(p.volume)}` : ""}</p>
        <div class="pub-actions"><button class="btn btn-sm" data-cite="${esc(p.title)}">${ICONS.quote}Cite</button>${pubLink(p) ? `<a class="btn btn-sm" href="${esc(pubLink(p))}" target="_blank" rel="noopener">${ICONS.ext}Read</a>` : ""}</div>
      </article>`).join("")}</div>`;
      bindCite(hp);
    }

    // recent talks
    const ht = $("#home-talks");
    if (ht) {
      ht.innerHTML = [...pres].sort((a, b) => dateKey(b) - dateKey(a)).filter(isMine).slice(0, 4).map((p) => `<div class="tl-item" style="--c:${cvar(colorFor(p.title + (p.tags || []).join(" ")))}">
        <div class="tl-date">${esc(p.date)} · ${esc(p.type)}</div>
        <div class="h3" style="margin-top:6px;font-size:1.02rem;line-height:1.45">${esc(p.title)}</div>
        <div class="muted" style="font-size:13.5px;margin-top:4px">${esc(p.event)} — ${esc(p.location)}</div></div>`).join("");
    }

    // funding
    const hf = $("#home-funding");
    if (hf) hf.innerHTML = (DATA.funding || []).map((f, i) => fundingCard(f, i)).join("");

    initHeroField($("#hero-canvas"), $("#hero"));
    initEyepiece();
  }

  function fundingCard(f, i = 0) {
    const c = colorFor(f.title + f.theme);
    return `<article class="card spot card-pad reveal" style="--c:${cvar(c)};--d:${i * 80}ms">
      <div class="entry-head"><span class="kicker" style="--k:${cvar(c)}">${esc(f.agency)}</span><span class="chip mono">${esc(f.years)}</span></div>
      <h3 class="h3" style="margin-top:12px">${esc(f.title)}</h3>
      <p class="muted" style="margin:10px 0 0;font-size:14px">${esc(f.investigators)}</p>
      <div class="chips" style="margin-top:14px">${chip(f.role, c)}${f.theme ? String(f.theme).split("•").map((t) => chip(t.trim())).join("") : ""}</div>
    </article>`;
  }

  function countUp(root) {
    const els = $$("[data-count]", root);
    const run = (el) => {
      const raw = el.dataset.count, n = parseFloat(raw);
      if (isNaN(n) || reduced) return;
      const suffix = raw.replace(/^[\d.]+/, ""), t0 = performance.now(), dur = 1400;
      const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(n * e) + suffix; if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } }), { threshold: 0.6 });
    els.forEach((e) => io.observe(e));
  }

  function initEyepiece() {
    const ep = $("#eyepiece"), inner = $("#eyepiece-inner"), xy = $("#hud-xy"), z = $("#hud-z");
    if (!ep) return;
    const hero = $("#hero");
    if (finePointer && !reduced) {
      hero.addEventListener("pointermove", (e) => {
        const r = ep.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth, dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
        inner.style.transform = `rotateY(${dx * 14}deg) rotateX(${-dy * 14}deg)`;
        if (xy) xy.textContent = `X ${String(Math.round(e.clientX * 1.7)).padStart(4, "0")} · Y ${String(Math.round(e.clientY * 1.7)).padStart(4, "0")}`;
      });
      hero.addEventListener("pointerleave", () => { inner.style.transform = ""; });
    }
    addEventListener("scroll", () => { if (z) z.textContent = `${scrollY >= 0 ? "+" : ""}${(scrollY / 40).toFixed(2)} µm`; }, { passive: true });
  }

  /* Animated "live microscope" field behind the hero: drifting cells and a
     few swimming histomonads. Cells are gently pushed away from the pointer. */
  function initHeroField(canvas, host) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1, cells = [], swimmers = [], mouse = { x: -9999, y: -9999 }, running = false, visible = true, raf = 0, t = 0;
    let colors = {};
    const readColors = () => { const cs = getComputedStyle(document.documentElement); ["teal", "violet", "gold", "rose", "blue"].forEach((k) => (colors[k] = cs.getPropertyValue("--" + k).trim() || HEX[k])); colors.light = document.documentElement.dataset.theme === "light"; };
    const rand = Math.random;
    function resize() {
      const r = host.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(70, Math.round((W * H) / 20000));
      cells = Array.from({ length: n }, () => ({
        x: rand() * W, y: rand() * H, r: 4 + Math.pow(rand(), 2.2) * 26, z: 0.35 + rand() * 0.65,
        vx: (rand() - 0.5) * 0.18, vy: (rand() - 0.5) * 0.18, c: rand() > 0.82 ? "violet" : rand() > 0.9 ? "gold" : "teal", ph: rand() * 6.28,
      }));
      swimmers = Array.from({ length: W < 700 ? 2 : 4 }, () => ({ x: rand() * W, y: rand() * H, a: rand() * 6.28, s: 0.35 + rand() * 0.35, r: 7 + rand() * 5, ph: rand() * 6.28 }));
    }
    function blob(x, y, r, wob, ph, k = 8) {
      ctx.beginPath();
      for (let i = 0; i <= k; i++) {
        const a = (i / k) * Math.PI * 2, rr = r * (1 + wob * Math.sin(a * 3 + ph) + wob * 0.6 * Math.cos(a * 2 - ph * 1.3));
        const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath();
    }
    function frame() {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      const L = colors.light;
      for (const c of cells) {
        const dx = c.x - mouse.x, dy = c.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 22000) { const d = Math.sqrt(d2) || 1, f = (1 - d / 148) * 0.35 * c.z; c.vx += (dx / d) * f; c.vy += (dy / d) * f; }
        c.vx += (rand() - 0.5) * 0.02; c.vy += (rand() - 0.5) * 0.02;
        c.vx *= 0.97; c.vy *= 0.97;
        c.x += c.vx + 0.05 * c.z; c.y += c.vy - 0.03 * c.z;
        const m = c.r * 2;
        if (c.x < -m) c.x = W + m; if (c.x > W + m) c.x = -m; if (c.y < -m) c.y = H + m; if (c.y > H + m) c.y = -m;
        const col = colors[c.c];
        ctx.globalAlpha = (L ? 0.28 : 0.32) * c.z;
        blob(c.x, c.y, c.r, 0.06, c.ph + t * 0.6);
        const g = ctx.createRadialGradient(c.x, c.y, c.r * 0.2, c.x, c.y, c.r * 1.1);
        g.addColorStop(0, "transparent"); g.addColorStop(0.75, col + (L ? "22" : "33")); g.addColorStop(1, col + "aa");
        ctx.fillStyle = g; ctx.fill();
        ctx.lineWidth = 1; ctx.strokeStyle = col; ctx.stroke();
        ctx.beginPath(); ctx.arc(c.x + c.r * 0.15, c.y - c.r * 0.1, c.r * 0.3, 0, 6.283); ctx.fillStyle = colors.violet; ctx.globalAlpha *= 0.8; ctx.fill();
      }
      for (const s of swimmers) {
        s.a += (rand() - 0.5) * 0.08;
        const dx = s.x - mouse.x, dy = s.y - mouse.y;
        if (dx * dx + dy * dy < 26000) s.a = s.a * 0.9 + Math.atan2(dy, dx) * 0.1; // shy of the cursor
        s.x += Math.cos(s.a) * s.s; s.y += Math.sin(s.a) * s.s;
        if (s.x < -40) s.x = W + 40; if (s.x > W + 40) s.x = -40; if (s.y < -40) s.y = H + 40; if (s.y > H + 40) s.y = -40;
        // flagellum trails behind
        ctx.globalAlpha = L ? 0.55 : 0.75;
        ctx.beginPath();
        const bx = s.x - Math.cos(s.a) * s.r, by = s.y - Math.sin(s.a) * s.r;
        ctx.moveTo(bx, by);
        for (let i = 1; i <= 14; i++) {
          const l = i * 2.1, w = Math.sin(t * 14 + i * 0.7 + s.ph) * (i * 0.35);
          ctx.lineTo(bx - Math.cos(s.a) * l - Math.sin(s.a) * w, by - Math.sin(s.a) * l + Math.cos(s.a) * w);
        }
        ctx.strokeStyle = colors.teal; ctx.lineWidth = 1.1; ctx.stroke();
        blob(s.x, s.y, s.r, 0.12, t * 2 + s.ph);
        const g = ctx.createRadialGradient(s.x - s.r * 0.3, s.y - s.r * 0.3, 1, s.x, s.y, s.r * 1.2);
        g.addColorStop(0, colors.teal + "ee"); g.addColorStop(1, colors.teal + "44");
        ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = colors.teal; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(s.x + Math.cos(s.a) * s.r * 0.2, s.y + Math.sin(s.a) * s.r * 0.2, s.r * 0.36, 0, 6.283); ctx.fillStyle = colors.violet; ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(frame);
    }
    const start = () => { if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    readColors(); resize();
    document.addEventListener("themechange", readColors);
    addEventListener("resize", () => { resize(); if (reduced) frame(); });
    host.addEventListener("pointermove", (e) => { const r = host.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }, { passive: true });
    host.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
    if (reduced) { frame(); return; }
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(host);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    start();
  }

  function bindCite(root) {
    const pubs = allPublications();
    $$("[data-cite]", root).forEach((b) => b.addEventListener("click", () => { const p = pubs.find((x) => x.title === b.dataset.cite); p && openCite(p); }));
  }

  /* ============================================================ RESEARCH */
  const GENERIC = new Set(["microbiome", "turkey", "turkey poults", "broiler", "control and prevention strategies", "public health", "disease resistance"]);
  function relatedFor(project) {
    const terms = (project.tags || []).map((t) => t.toLowerCase()).filter((t) => !GENERIC.has(t) && t.length > 3);
    const hit = (x) => { const s = JSON.stringify(x).toLowerCase(); return terms.filter((t) => s.includes(t)).length; };
    const pubs = allPublications().map((p) => [p, hit(p)]).filter(([, n]) => n).sort((a, b) => b[1] - a[1] || b[0].year - a[0].year).map(([p]) => p);
    const pres = (DATA.presentations || []).map((p) => [p, hit(p)]).filter(([, n]) => n).sort((a, b) => b[1] - a[1] || dateKey(b[0]) - dateKey(a[0])).map(([p]) => p);
    return { pubs, pres };
  }
  let projectTheme = "All";
  function renderResearch() {
    const projects = DATA.projects || [];
    const themes = ["All", ...new Set(projects.map((p) => p.theme).filter(Boolean))];
    const fb = $("#project-filters");
    if (fb) {
      const h = location.hash.slice(1);
      fb.innerHTML = themes.map((t) => `<button class="filter" type="button" aria-pressed="${t === projectTheme}" data-t="${esc(t)}">${esc(t)}<span class="count">${t === "All" ? projects.length : projects.filter((p) => p.theme === t).length}</span></button>`).join("");
      $$("button", fb).forEach((b) => b.addEventListener("click", () => { projectTheme = b.dataset.t; renderResearch(); }));
      if (h && !renderResearch._scrolled) { renderResearch._scrolled = true; setTimeout(() => document.getElementById(h)?.scrollIntoView({ behavior: "smooth" }), 400); }
    }
    const grid = $("#project-grid");
    if (grid) {
      const shown = projectTheme === "All" ? projects : projects.filter((p) => p.theme === projectTheme);
      grid.innerHTML = shown.map((p) => {
        const c = colorFor(p.theme + " " + p.title), rel = relatedFor(p);
        const art = micrograph(p.title, c, { w: 620, h: 520 }) + `<span class="art-label">${esc(p.theme)}</span>`;
        const img = p.image ? `<img src="${esc(p.image)}" alt="${esc(p.imageAlt || "")}" loading="lazy" onerror="this.remove()" />` : "";
        const relHTML = rel.pubs.length + rel.pres.length ? `<details class="related"><summary>Related outputs · ${rel.pubs.length} papers, ${rel.pres.length} talks</summary><ul>
          ${rel.pubs.map((x) => `<li data-k="PUB">${pubLink(x) ? `<a href="${esc(pubLink(x))}" target="_blank" rel="noopener">${esc(x.title)}</a>` : esc(x.title)} <span class="dim">(${esc(x.year)}${x._status !== "published" ? ", " + esc(x.status) : ""})</span></li>`).join("")}
          ${rel.pres.map((x) => `<li data-k="TALK">${esc(x.title)} <span class="dim">(${esc(x.event.replace(/Annual Meeting/, "").trim())}, ${esc(x.year)})</span></li>`).join("")}</ul></details>` : "";
        return `<article class="card spot project reveal" id="${slug(p.title)}" style="--c:${cvar(c)}">
          <div class="project-art">${art}${img}</div>
          <div class="project-body">
            <div class="chips"><span class="status-pill" style="--c:${cvar(c)}">${esc(p.status)}</span><span class="chip mono">${esc(p.year)}</span></div>
            <h2 class="h3">${esc(p.title)}</h2>
            <p class="muted" style="margin:0">${esc(p.summary)}</p>
            <div class="chips">${(p.tags || []).map((t) => chip(t)).join("")}</div>
            ${relHTML}
          </div></article>`;
      }).join("") || `<div class="empty">No projects for this theme yet.</div>`;
      initReveal(grid);
    }
    const sg = $("#skills-grid");
    if (sg && !sg.dataset.done) {
      sg.dataset.done = 1;
      const cols = ["violet", "teal", "gold"];
      sg.innerHTML = (DATA.skills || []).map((g, i) => `<div class="card spot card-pad reveal" style="--c:${cvar(cols[i % 3])};--d:${i * 80}ms"><span class="kicker" style="--k:${cvar(cols[i % 3])}">${String(i + 1).padStart(2, "0")}</span><h3 class="h3" style="margin:12px 0 14px">${esc(g.group)}</h3><div class="chips">${(g.items || []).map((x) => chip(x)).join("")}</div></div>`).join("");
    }
  }

  /* ======================================================== PUBLICATIONS */
  const pubState = { tab: "all", q: "", years: null, role: "All", type: "All" };
  function renderPublications() {
    const all = allPublications();
    const tabs = [["all", "All"], ["published", "Published"], ["submitted", "Submitted"], ["inPreparation", "In preparation"]];
    const stats = $("#pub-stats");
    if (stats && !stats.dataset.done) {
      stats.dataset.done = 1;
      const pub = all.filter((p) => p._status === "published");
      const journals = new Set(pub.map((p) => p.journal)).size;
      const years = pub.map((p) => +p.year).filter(Boolean);
      stats.innerHTML = [[pub.length, "peer-reviewed"], [all.filter(isFirst).length, "first-author"], [journals, "journals"], [all.length - pub.length, "in the pipeline"], [years.length ? `${Math.min(...years)}–${String(Math.max(...years)).slice(2)}` : "", "active years"]]
        .map(([n, l]) => `<div class="mini-stat"><b>${n}</b><span>${l}</span></div>`).join("");
    }
    const sch = $("#scholar-link"), sc = (DATA.links || []).find((l) => /scholar/i.test(l.label));
    if (sch) sch.href = sc ? sc.url : "#";

    const tb = $("#publication-tabs");
    tb.innerHTML = tabs.map(([k, l]) => `<button class="filter" type="button" aria-pressed="${pubState.tab === k}" data-k="${k}">${l}<span class="count">${k === "all" ? all.length : all.filter((p) => p._status === k).length}</span></button>`).join("");
    $$("button", tb).forEach((b) => b.addEventListener("click", () => { pubState.tab = b.dataset.k; pubState.years = null; renderPublications(); }));

    const byTab = all.filter((p) => pubState.tab === "all" || p._status === pubState.tab);
    const roleOpts = ["All", "First author", "Co-author"], typeOpts = ["All", ...new Set(all.map((p) => (/review/i.test(p.type) ? "Review" : "Research")))];
    const rb = $("#pub-role"), yb = $("#pub-type");
    rb.innerHTML = roleOpts.map((r) => `<button class="filter" type="button" aria-pressed="${pubState.role === r}" data-r="${r}">${r}</button>`).join("");
    yb.innerHTML = typeOpts.map((r) => `<button class="filter" type="button" aria-pressed="${pubState.type === r}" data-y="${r}">${r === "All" ? "All types" : r}</button>`).join("");
    $$("button", rb).forEach((b) => b.addEventListener("click", () => { pubState.role = b.dataset.r; renderPublications(); }));
    $$("button", yb).forEach((b) => b.addEventListener("click", () => { pubState.type = b.dataset.y; renderPublications(); }));

    const q = pubState.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = byTab.filter((p) => {
      if (pubState.role === "First author" && !isFirst(p)) return false;
      if (pubState.role === "Co-author" && isFirst(p)) return false;
      if (pubState.type !== "All" && (/review/i.test(p.type) ? "Review" : "Research") !== pubState.type) return false;
      const hay = `${p.title} ${p.authors} ${p.journal || ""} ${p.target || ""} ${(p.keywords || []).join(" ")} ${p.year}`.toLowerCase();
      return q.every((t) => hay.includes(t));
    });

    // year histogram (click to filter)
    const counts = {};
    filtered.forEach((p) => (counts[p.year] = (counts[p.year] || 0) + 1));
    const allYears = [...new Set(all.map((p) => p.year))].sort();
    const max = Math.max(1, ...Object.values(counts));
    const hb = $("#pub-histo");
    hb.innerHTML = allYears.map((y) => `<button type="button" aria-pressed="${!pubState.years || pubState.years === y}" data-y="${y}" title="${counts[y] || 0} in ${y}"><span class="n">${counts[y] || 0}</span><span class="bar" style="height:${((counts[y] || 0) / max) * 80 + 4}px"></span>${String(y).slice(2) ? "’" + String(y).slice(2) : y}</button>`).join("");
    $$("button", hb).forEach((b) => b.addEventListener("click", () => { pubState.years = pubState.years === b.dataset.y ? null : b.dataset.y; renderPublications(); }));

    const shown = filtered.filter((p) => !pubState.years || p.year === pubState.years);
    const groups = {};
    shown.forEach((p) => (groups[p.year] = groups[p.year] || []).push(p));
    const order = { inPreparation: 0, submitted: 1, published: 2 };
    const root = $("#publication-list");
    const years = Object.keys(groups).sort((a, b) => b - a);
    root.innerHTML = years.length ? years.map((y) => `<div class="year-group"><div class="year-label">${esc(y)}</div><div>
      ${groups[y].sort((a, b) => order[a._status] - order[b._status]).map(pubCard).join("")}</div></div>`).join("")
      : `<div class="empty">No publications match these filters. <button class="arrow-link" type="button" id="pub-reset">Reset filters</button></div>`;
    $("#pub-reset")?.addEventListener("click", () => { Object.assign(pubState, { tab: "all", q: "", years: null, role: "All", type: "All" }); $("#publication-search").value = ""; renderPublications(); });
    bindCite(root);
    $$("[data-copydoi]", root).forEach((b) => b.addEventListener("click", () => copyText(`https://doi.org/${b.dataset.copydoi}`, "DOI link copied")));
    italicize(root);
  }
  function pubCard(p) {
    const c = colorFor(p.title + " " + (p.keywords || []).join(" "));
    const statusColor = p._status === "published" ? "teal" : p._status === "submitted" ? "gold" : "violet";
    const link = pubLink(p);
    return `<article class="card spot pub" style="--c:${cvar(c)}">
      <h3 class="pub-title">${link ? `<a href="${esc(link)}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title)}</h3>
      <p class="pub-authors">${markMe(p.authors)}</p>
      <p class="pub-venue muted">${p.journal ? `<em>${esc(p.journal)}</em>${p.volume ? `, ${esc(p.volume)}` : ""}${p.pages ? `, ${esc(p.pages)}` : ""}` : esc(p.target || "")}</p>
      ${p.summary && p._status !== "published" ? `<p class="muted" style="margin:8px 0 0;font-size:14px">${esc(p.summary)}</p>` : ""}
      <div class="pub-foot">
        <div class="chips"><span class="status-pill" style="--c:${cvar(statusColor)}">${esc(p._status === "published" ? "Published" : p.status)}</span>${chip(p.type)}${isFirst(p) ? chip("First author", "gold") : ""}${(p.keywords || []).slice(0, 3).map((k) => chip(k)).join("")}</div>
        <div class="pub-actions">
          <button class="btn btn-sm" type="button" data-cite="${esc(p.title)}">${ICONS.quote}Cite</button>
          ${p.doi ? `<button class="btn btn-sm" type="button" data-copydoi="${esc(p.doi)}" title="Copy DOI link">${ICONS.copy}DOI</button>` : ""}
          ${link ? `<a class="btn btn-sm" href="${esc(link)}" target="_blank" rel="noopener">${ICONS.ext}Open</a>` : ""}
        </div>
      </div></article>`;
  }

  /* ======================================================= PRESENTATIONS */
  const presState = { who: "All", type: "All", year: "All" };
  function renderPresentations() {
    const list = [...(DATA.presentations || [])].sort((a, b) => dateKey(b) - dateKey(a));
    const st = $("#pres-stats");
    if (st && !st.dataset.done) {
      st.dataset.done = 1;
      const venues = new Set(list.map((p) => p.event)).size;
      st.innerHTML = [[list.length, "presentations"], [list.filter(isMine).length, "presented by me"], [list.filter((p) => /oral|symposium/i.test(p.type)).length, "oral & symposium"], [venues, "meetings"]].map(([n, l]) => `<div class="mini-stat"><b>${n}</b><span>${l}</span></div>`).join("");
    }
    const who = $("#pres-who");
    who.innerHTML = ["All", "Presented by me", "Co-authored"].map((w) => `<button class="filter" type="button" aria-pressed="${presState.who === w}" data-w="${w}">${w}</button>`).join("");
    $$("button", who).forEach((b) => b.addEventListener("click", () => { presState.who = b.dataset.w; renderPresentations(); }));
    const ts = $("#presentation-type"), ys = $("#presentation-year");
    ts.innerHTML = ["All", ...new Set(list.map((p) => p.type))].map((t) => `<option value="${esc(t)}" ${t === presState.type ? "selected" : ""}>${t === "All" ? "All types" : esc(t)}</option>`).join("");
    ys.innerHTML = ["All", ...new Set(list.map((p) => p.year))].map((t) => `<option value="${esc(t)}" ${t === presState.year ? "selected" : ""}>${t === "All" ? "All years" : esc(t)}</option>`).join("");
    ts.onchange = () => { presState.type = ts.value; renderPresentations(); };
    ys.onchange = () => { presState.year = ys.value; renderPresentations(); };

    const shown = list.filter((p) => (presState.who === "All" || (presState.who === "Presented by me") === isMine(p)) && (presState.type === "All" || p.type === presState.type) && (presState.year === "All" || p.year === presState.year));
    const grid = $("#presentation-grid");
    grid.innerHTML = shown.map((p, i) => {
      const c = colorFor(p.title + " " + (p.tags || []).join(" "));
      return `<article class="card spot pres-card lift reveal" style="--c:${cvar(c)};--d:${(i % 3) * 70}ms">
        <button class="pres-media" type="button" data-i="${i}" aria-label="Open details: ${esc(p.title)}">
          ${micrograph(p.title, c, { w: 640, h: 480 })}
          ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}" loading="lazy" onerror="this.remove()" />` : ""}
          <span class="pres-badge chip glass-pill">${esc(p.type)}</span>
        </button>
        <div class="pres-body">
          <div class="chips">${isMine(p) ? chip("Presenting author", "teal") : chip("Co-author")}${p.status && p.status !== "Presented" ? chip(p.status, "gold") : ""}</div>
          <h3 class="h3">${esc(p.title)}</h3>
          <div class="pres-meta"><span>${esc(p.event)}</span><span class="dim">${esc(p.location)} · ${esc(p.date)}</span></div>
        </div></article>`;
    }).join("") || `<div class="empty" style="grid-column:1/-1">Nothing matches these filters.</div>`;
    $$(".pres-media", grid).forEach((b) => b.addEventListener("click", () => openLightbox(shown, +b.dataset.i)));
    initReveal(grid);
    italicize(grid);
  }

  /* ================================================================== CV */
  function renderCV() {
    const ed = $("#education-list");
    ed.innerHTML = (DATA.education || []).map((e, i) => `<div class="tl-item reveal" style="--c:${cvar(["teal", "violet", "gold"][i % 3])}">
      <div class="tl-date">${esc(e.dates)}</div>
      <h3 class="h3" style="margin-top:6px">${esc(e.degree)}</h3>
      <div class="entry-sub">${esc(e.institution)} · ${esc(e.location)}</div>
      ${e.advisor ? `<div class="entry-sub">Advisor: ${e.advisorUrl ? `<a class="arrow-link" href="${esc(e.advisorUrl)}" target="_blank" rel="noopener">${esc(e.advisor)}</a>` : esc(e.advisor)}</div>` : ""}
      ${e.details ? `<p class="entry-body">${esc(e.details)}</p>` : ""}</div>`).join("");
    $("#experience-list").innerHTML = (DATA.experience || []).map((x) => `<article class="card spot card-pad reveal">
      <div class="entry-head"><h3 class="h3">${esc(x.title)}</h3><span class="chip mono">${esc(x.dates)}</span></div>
      <div class="entry-sub">${esc(x.organization)} · ${esc(x.location)}</div>
      <div class="entry-body"><p style="margin:0">${esc(x.summary)}</p><ul>${(x.bullets || []).map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div></article>`).join("");
    $("#funding-list").innerHTML = (DATA.funding || []).map((f, i) => fundingCard(f, i)).join("");
    $("#skills-list").innerHTML = (DATA.skills || []).map((g) => `<div class="skill-group reveal"><h3 class="h3" style="font-size:1rem;margin-bottom:10px">${esc(g.group)}</h3><div class="chips">${(g.items || []).map((x) => chip(x)).join("")}</div></div>`).join("");
    $("#mentoring-list").innerHTML = (DATA.mentoring || []).map((m) => `<article class="card spot card-pad reveal"><h3 class="h3">${esc(m.title)}</h3><p class="entry-body" style="margin-bottom:0">${esc(m.details)}</p></article>`).join("");
    $("#affiliation-list").innerHTML = (DATA.affiliations || []).map((a) => chip(a, "teal")).join("");
    scrollSpy($$("#cv-toc a"));
  }
  function scrollSpy(links) {
    if (!("IntersectionObserver" in window)) return;
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { links.forEach((l) => l.classList.remove("active")); map.get(e.target.id)?.classList.add("active"); } }), { rootMargin: "-35% 0px -60% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); s && io.observe(s); });
  }

  /* ============================================================== HONORS */
  function renderHonors() {
    const h = [...(DATA.honors || [])].sort((a, b) => b.year - a.year);
    const st = $("#honor-stats");
    if (st) st.innerHTML = [[h.length, "awards & scholarships"], [h.filter((x) => /travel/i.test(x.title)).length, "travel awards"], [(DATA.professionalActivities || []).length, "service roles"], [(DATA.affiliations || []).length, "memberships"]].map(([n, l]) => `<div class="mini-stat"><b>${n}</b><span>${l}</span></div>`).join("");
    $("#honors-list").innerHTML = h.map((x) => `<div class="tl-item reveal" style="--c:${cvar(/travel/i.test(x.title) ? "teal" : /excellence|merit/i.test(x.title) ? "gold" : "violet")}">
      <div class="tl-date">${esc(x.year)}</div><h3 class="h3" style="margin-top:6px">${esc(x.title)}</h3>
      <div class="entry-sub">${esc(x.organization)}</div><p class="entry-body" style="margin-bottom:0">${esc(x.details)}</p></div>`).join("");
    $("#activities-list").innerHTML = (DATA.professionalActivities || []).map((a, i) => `<article class="card spot card-pad reveal" style="--c:${cvar(["violet", "teal", "gold", "rose", "blue"][i % 5])};padding:20px 22px">
      <h3 class="h3" style="font-size:1.02rem">${esc(a.title)}</h3><p class="entry-body" style="margin:6px 0 0">${esc(a.details)}</p></article>`).join("");
  }

  /* =============================================================== MEDIA */
  let mediaCat = "All";
  function renderMedia() {
    const items = (DATA.media || []).filter((m) => m.url); // entries without a link are treated as drafts
    const cats = ["All", ...new Set(items.map((m) => m.category))];
    const fb = $("#media-filters");
    fb.innerHTML = cats.map((c) => `<button class="filter" type="button" aria-pressed="${c === mediaCat}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
    $$("button", fb).forEach((b) => b.addEventListener("click", () => { mediaCat = b.dataset.c; renderMedia(); }));
    const shown = items.filter((m) => mediaCat === "All" || m.category === mediaCat);
    const grid = $("#media-grid");
    grid.innerHTML = shown.map((m, i) => {
      const c = colorFor(m.title + m.category), isPdf = /\.pdf($|\?)/i.test(m.url), ext = /^https?:/.test(m.url);
      return `<a class="card spot card-pad media-card lift reveal" href="${esc(m.url)}" ${ext || isPdf ? 'target="_blank" rel="noopener"' : ""} style="--c:${cvar(c)};--d:${(i % 3) * 70}ms">
        <div class="entry-head"><span class="kicker" style="--k:${cvar(c)}">${esc(m.category)}</span><span class="chip mono">${esc(m.year)}</span></div>
        <h3 class="h3">${esc(m.title)}</h3><p class="muted" style="margin:0;font-size:14px">${esc(m.summary)}</p>
        <div class="entry-head" style="margin-top:auto;padding-top:8px"><span class="dim" style="font-size:13px">${esc(m.source)}</span><span class="arrow-link">${isPdf ? "PDF" : "Open"} ${ICONS.ext}</span></div></a>`;
    }).join("") || `<div class="empty" style="grid-column:1/-1">Nothing here yet.</div>`;
    initReveal(grid);
    italicize(grid);

    const gal = $("#gallery");
    if (gal && !gal.dataset.done) {
      gal.dataset.done = 1;
      const photos = [...(DATA.presentations || [])].filter((p) => p.image).sort((a, b) => dateKey(b) - dateKey(a));
      gal.innerHTML = photos.map((p, i) => `<figure class="reveal" tabindex="0" role="button" data-i="${i}" aria-label="Open photo: ${esc(p.title)}"><img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}" loading="lazy" /><figcaption>${esc(p.event)} · ${esc(p.year)}</figcaption></figure>`).join("");
      $$("figure", gal).forEach((f) => { const open = () => openLightbox(photos, +f.dataset.i); f.addEventListener("click", open); f.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }); });
    }
  }

  /* ============================================================= CONTACT */
  function renderContact() {
    const p = P();
    const a = $("#primary-email-link"), b = $("#secondary-email-link");
    if (a) { a.href = `mailto:${p.email}`; a.textContent = p.email; }
    if (b) { b.href = `mailto:${p.secondaryEmail || p.email}`; b.textContent = p.secondaryEmail || p.email; }
    $$("[data-copy]").forEach((btn) => btn.addEventListener("click", () => copyText(btn.dataset.copy === "primary" ? p.email : p.secondaryEmail || p.email, "Email copied")));
    socialLinks($("#contact-links"));
    const clock = $("#local-clock");
    const tick = () => { try { clock.textContent = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit", second: "2-digit", weekday: "short" }).format(new Date()) + " ET"; } catch (e) { clock.textContent = "Eastern Time (ET)"; } };
    if (clock) { tick(); setInterval(tick, 1000); }
    $("#mailto-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#sender-name").value, email = $("#sender-email").value, topic = $("#inquiry-topic").value, msg = $("#inquiry-message").value;
      location.href = `mailto:${encodeURIComponent(p.email)}?subject=${encodeURIComponent(`${topic} — from ${name}`)}&body=${encodeURIComponent(`${msg}\n\n— ${name}\n${email}`)}`;
    });
  }

  /* ========================================= edit mode (?edit=true) */
  function initEditMode() {
    const want = new URLSearchParams(location.search).get("edit") === "true";
    if (PREVIEW) {
      const bar = document.createElement("div");
      bar.className = "toast show"; bar.style.pointerEvents = "auto";
      bar.innerHTML = `<span>Showing your local preview of site-data.js</span><button class="btn btn-sm" id="exit-preview">Exit preview</button>`;
      document.body.appendChild(bar);
      $("#exit-preview").onclick = () => { try { localStorage.removeItem("abhisekSiteDataPreview"); } catch (e) {} location.reload(); };
    }
    if (!want) return;
    const panel = document.createElement("div");
    panel.className = "edit-panel open";
    panel.innerHTML = `<strong>Edit mode</strong><p class="muted" style="margin:0;font-size:13px">Edit the JSON, preview it in this browser, then download the new <code>site-data.js</code> and replace the file in <code>assets/js/</code>.</p>
      <textarea class="input" id="json-editor" spellcheck="false"></textarea>
      <div class="chips"><button class="btn btn-sm btn-primary" id="ed-apply">Preview</button><button class="btn btn-sm" id="ed-dl">Download site-data.js</button><button class="btn btn-sm" id="ed-reset">Reset</button><span class="dim" id="ed-status" style="font-size:12px"></span></div>`;
    document.body.appendChild(panel);
    const ta = $("#json-editor"), st = $("#ed-status");
    ta.value = JSON.stringify(DATA, null, 2);
    $("#ed-apply").onclick = () => { try { const d = JSON.parse(ta.value); localStorage.setItem("abhisekSiteDataPreview", JSON.stringify(d)); location.reload(); } catch (e) { st.textContent = "JSON error: " + e.message; } };
    $("#ed-reset").onclick = () => { try { localStorage.removeItem("abhisekSiteDataPreview"); } catch (e) {} ta.value = JSON.stringify(ORIGINAL, null, 2); st.textContent = "Reset to published data."; };
    $("#ed-dl").onclick = () => {
      try {
        const d = JSON.parse(ta.value);
        const blob = new Blob([`/* EDIT THIS FILE TO UPDATE WEBSITE CONTENT. */\n\nwindow.SITE_DATA = ${JSON.stringify(d, null, 2)};\n`], { type: "text/javascript" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "site-data.js"; a.click();
      } catch (e) { st.textContent = "JSON error: " + e.message; }
    };
  }

  /* ================================================================ boot */
  function boot() {
    renderProfile();
    initHeader();
    initTheme();
    try {
      if (page === "home") renderHome();
      if (page === "research") renderResearch();
      if (page === "publications") {
        renderPublications();
        const s = $("#publication-search");
        s && s.addEventListener("input", () => { pubState.q = s.value; renderPublications(); });
      }
      if (page === "presentations") renderPresentations();
      if (page === "cv") renderCV();
      if (page === "honors") renderHonors();
      if (page === "media") renderMedia();
      if (page === "contact") renderContact();
      if (page === "404") initHeroField($("#hero-canvas"), $(".hero"));
    } catch (err) { console.error("Render error:", err); }
    initPalette();
    initHistomonasCursor();
    initPointerFx();
    italicize($("#main"));
    initReveal();
    initEditMode();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
