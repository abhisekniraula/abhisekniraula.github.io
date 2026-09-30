# Regenerates the HTML page shells (head, header, footer, page skeletons).
# Run from anywhere:  python tools/build_pages.py
"""Generates the static HTML shells for every page (shared head/header/footer).
Content itself is rendered from assets/js/site-data.js by assets/js/app.js."""
import pathlib, textwrap

ROOT = pathlib.Path(__file__).resolve().parent.parent  # repo root
SITE = "https://abhisekniraula.github.io"
NAME = "Abhisek Niraula"

NAV = [
    ("home", "index.html", "Home"),
    ("research", "research.html", "Research"),
    ("publications", "publications.html", "Publications"),
    ("presentations", "presentations.html", "Presentations"),
    ("cv", "cv.html", "CV"),
    ("honors", "honors.html", "Honors"),
    ("media", "media.html", "Media"),
    ("contact", "contact.html", "Contact"),
]

HM = """<svg viewBox="0 0 48 48" aria-hidden="true"><use href="#hm"/></svg>"""

SPRITE = """<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <radialGradient id="hmBody" cx="40%" cy="38%" r="70%">
      <stop offset="0" stop-color="#7ff5e6" stop-opacity=".95"/>
      <stop offset=".65" stop-color="#1fb5a6" stop-opacity=".75"/>
      <stop offset="1" stop-color="#0d5f63" stop-opacity=".9"/>
    </radialGradient>
    <symbol id="hm" viewBox="0 0 48 48">
      <path class="hm-flag" d="M33 31 C36 34 34 38 38 40 S42 45 46 46" fill="none" stroke="#9ff7ec" stroke-width="1.4" stroke-linecap="round">
        <animate attributeName="d" dur=".7s" repeatCount="indefinite"
          values="M33 31 C36 34 34 38 38 40 S42 45 46 46;M33 31 C34 35 38 37 37 41 S43 43 45 47;M33 31 C36 34 34 38 38 40 S42 45 46 46"/>
      </path>
      <path d="M4 12c1-6 7-9 13-8 5 0 7 3 11 3 5 0 9 3 9 8 1 5-1 8 0 12 1 5-3 9-9 9-4 0-6-2-10-1-6 1-11-2-12-7-1-4 2-6 1-9-1-3-4-4-3-7z" fill="url(#hmBody)" stroke="#bafcf3" stroke-width="1.1"/>
      <circle cx="22" cy="19" r="5.2" fill="#a78bfa" stroke="#e1d6ff" stroke-width=".9"/>
      <circle cx="21" cy="18.4" r="2" fill="#5b3fd1"/>
      <circle cx="12" cy="15" r="1.5" fill="#f4c46a"/>
      <circle cx="14" cy="27" r="1.8" fill="#f4c46a"/>
      <circle cx="28" cy="29" r="1.3" fill="#f4c46a"/>
      <circle cx="30" cy="14" r="1.1" fill="#ffffff" fill-opacity=".8"/>
    </symbol>
  </defs>
</svg>"""

ICON = {
    "search": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    "theme": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path class="i-moon" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    "menu": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
    "up": '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
}

DESC = {
    "home": "Abhisek Niraula — PhD student in Poultry Science at the University of Georgia studying host–pathogen interactions in the avian gut: histomoniasis, coccidiosis, necrotic enteritis, cecal organoids and microbiome bioinformatics.",
    "research": "Research projects by Abhisek Niraula: cecal organoid models for Histomonas meleagridis, turkey histomoniasis transmission models, necrotic enteritis microbiome, and host genetics of coccidiosis resistance.",
    "publications": "Peer-reviewed publications, submitted and in-preparation manuscripts by Abhisek Niraula, with citations and BibTeX.",
    "presentations": "Conference talks and posters by Abhisek Niraula at PSA, IPSF and AAAP meetings.",
    "cv": "Curriculum vitae of Abhisek Niraula — education, research experience, funding, skills and mentoring.",
    "honors": "Awards, travel grants, scholarships and professional service of Abhisek Niraula.",
    "media": "Media, journal club materials, profiles and photo gallery of Abhisek Niraula.",
    "contact": "Contact Abhisek Niraula for research collaboration, correspondence and presentation invitations.",
    "404": "Page not found.",
}
TITLE = {
    "home": f"{NAME} — Avian Immunobiology · University of Georgia",
    "research": f"Research | {NAME}", "publications": f"Publications | {NAME}",
    "presentations": f"Presentations | {NAME}", "cv": f"CV | {NAME}",
    "honors": f"Honors & Service | {NAME}", "media": f"Media | {NAME}",
    "contact": f"Contact | {NAME}", "404": f"Not found | {NAME}",
}

def head(page, file):
    url = f"{SITE}/" + ("" if file == "index.html" else file)
    jsonld = ""
    if page == "home":
        jsonld = """
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Person","name":"Abhisek Niraula","url":"https://abhisekniraula.github.io/",
   "jobTitle":"PhD Student, Graduate Research Assistant","email":"mailto:abhisek.niraula@uga.edu",
   "affiliation":{"@type":"Organization","name":"Department of Poultry Science, University of Georgia"},
   "alumniOf":[{"@type":"CollegeOrUniversity","name":"University of Georgia"},{"@type":"CollegeOrUniversity","name":"Agriculture and Forestry University, Nepal"}],
   "knowsAbout":["Histomoniasis","Coccidiosis","Necrotic enteritis","Poultry immunology","Intestinal organoids","Microbiome bioinformatics"],
   "sameAs":["https://scholar.google.com/citations?user=eDPFj1gAAAAJ","https://www.researchgate.net/profile/Abhisek-Niraula","https://www.linkedin.com/in/abhisek-niraula-336365137"]}
  </script>"""
    return f"""<!DOCTYPE html>
<html lang="en" data-theme="dark" class="no-js">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{TITLE[page]}</title>
  <meta name="description" content="{DESC[page]}" />
  <meta name="author" content="{NAME}" />
  <meta name="theme-color" content="#05080f" />
  <link rel="canonical" href="{url}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="{NAME}" />
  <meta property="og:title" content="{TITLE[page]}" />
  <meta property="og:description" content="{DESC[page]}" />
  <meta property="og:url" content="{url}" />
  <meta property="og:image" content="{SITE}/assets/img/og-card.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png" />
  <script>
    (function () {{
      document.documentElement.classList.remove("no-js");
      try {{ var t = localStorage.getItem("an-theme"); if (t) document.documentElement.dataset.theme = t; }} catch (e) {{}}
    }})();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/styles.css" />{jsonld}
</head>"""

CUR = ' aria-current="page"'

def header(page):
    links = "\n".join(
        f'        <a href="{f}"{CUR if k == page else ""}>{label}</a>' for k, f, label in NAV
    )
    mlinks = "\n".join(
        f'      <a href="{f}"{CUR if k == page else ""}><span>{i+1:02d}</span>{label}</a>' for i, (k, f, label) in enumerate(NAV)
    )
    return f"""
<body data-page="{page}">
  {SPRITE}
  <a href="#main" class="skip-link">Skip to content</a>
  <header class="site-header" id="site-header">
    <div class="container header-inner">
      <a href="index.html" class="brand" aria-label="{NAME} — home">
        <span class="brand-mark">{HM}</span>
        <span><span class="brand-name">{NAME}</span><span class="brand-sub">Avian Immunobiology Lab</span><span class="brand-sub">University of Georgia</span></span>
      </a>
      <nav class="nav" aria-label="Primary">
{links}
      </nav>
      <div class="header-actions">
        <button class="search-trigger" type="button" data-open-palette aria-label="Search the site">{ICON['search']}<span>Search</span><kbd>Ctrl K</kbd></button>
        <button class="icon-btn" id="theme-toggle" type="button" aria-label="Switch colour theme" title="Dark / brightfield">{ICON['theme']}</button>
        <button class="icon-btn menu-btn" id="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">{ICON['menu']}</button>
      </div>
    </div>
    <div class="progress" aria-hidden="true"><span class="progress-bar"></span><span class="progress-hm">{HM}</span></div>
  </header>
  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile">
    <div class="container">
{mlinks}
    </div>
  </nav>
"""

FOOTER = f"""
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a href="index.html" class="brand"><span class="brand-mark">{HM}</span><span><span class="brand-name">{NAME}</span><span class="brand-sub" data-profile="lab">Avian Immunobiology Laboratory</span></span></a>
          <p class="muted" style="margin:16px 0 0;max-width:40ch;font-size:14.5px" data-profile="affiliation">Department of Poultry Science, University of Georgia</p>
          <p style="margin:14px 0 0"><a class="arrow-link" id="footer-email" href="mailto:abhisek.niraula@uga.edu">abhisek.niraula@uga.edu</a></p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>{''.join(f'<li><a href="{f}">{l}</a></li>' for k, f, l in NAV[1:])}</ul>
        </div>
        <div>
          <h4>Elsewhere</h4>
          <ul id="footer-links"></ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span id="footer-note">© {NAME}</span>
        <span>Tip: press <kbd>Ctrl K</kbd> to search · scroll to meet a tiny <i>Histomonas</i></span>
      </div>
    </div>
  </footer>

  <button class="to-top" id="to-top" type="button" aria-label="Back to top">
    <svg class="ring-svg" viewBox="0 0 46 46" aria-hidden="true"><circle cx="23" cy="23" r="21" fill="none" stroke="var(--line)" stroke-width="2"/><circle id="to-top-ring" cx="23" cy="23" r="21" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-dasharray="131.95" stroke-dashoffset="131.95"/></svg>
    {ICON['up']}
  </button>
  <div class="hm-cursor" id="hm-cursor" aria-hidden="true">{HM}</div>
"""

SCRIPTS = """
  <script src="assets/js/site-data.js"></script>
  <script src="assets/js/app.js"></script>
</body>
</html>
"""

def page_hero(kicker, color, title, lead, extra=""):
    return f"""
    <section class="page-hero" style="--k:var(--{color})">
      <div class="container">
        <p class="kicker reveal">{kicker}</p>
        <h1 class="h-page reveal" style="--d:60ms">{title}</h1>
        <p class="lead reveal" style="--d:120ms">{lead}</p>
        {extra}
      </div>
    </section>"""

BODIES = {}

BODIES["home"] = """
    <section class="hero" id="hero">
      <canvas class="hero-canvas" id="hero-canvas" aria-hidden="true"></canvas>
      <div class="container hero-grid">
        <div>
          <p class="kicker reveal" data-profile="title">PhD Student · Graduate Research Assistant</p>
          <h1 class="h-display reveal" style="--d:80ms" id="hero-headline">Host–pathogen biology of the <span class="grad-text">avian gut</span></h1>
          <p class="hero-focus reveal" style="--d:160ms">Currently working on&nbsp;<span class="hero-rotator" id="hero-rotator"><span class="on">histomoniasis</span></span></p>
          <p class="lead reveal" style="--d:220ms" data-profile="summary"></p>
          <div class="hero-cta reveal" style="--d:280ms">
            <a class="btn btn-primary magnetic" href="research.html">Explore research <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
            <a class="btn magnetic" id="cv-link" href="assets/cv/Abhisek_Niraula_CV.pdf" download>Download CV <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg></a>
          </div>
          <div class="social reveal" style="--d:340ms" id="hero-links"></div>
        </div>
        <div class="reveal" style="--d:200ms">
          <div class="eyepiece" id="eyepiece">
            <div class="eyepiece-inner" id="eyepiece-inner">
              <div class="ring"></div><div class="ring r2"></div>
              <div class="eyepiece-lens"><img id="hero-image" src="assets/img/histomonas-hero.webp" alt="" width="900" height="825" fetchpriority="high" /></div>
              <div class="reticle"></div>
            </div>
            <div class="hud hud-tl">Obj <b>100×</b> · Oil<br />Ch <b>DAPI</b> / FITC / TRITC</div>
            <div class="hud hud-br">Stage <b id="hud-xy">X 0000 · Y 0000</b><br />Focus <b id="hud-z" class="u">+0.00 µm</b></div>
            <div class="hud hud-bl"><span class="scalebar"></span><span class="u">10 µm</span></div>
            <div class="caption-fig" id="hero-caption"><i>Histomonas meleagridis</i> · AI-generated illustration (Google Gemini)</div>
          </div>
        </div>
      </div>
      <div class="scroll-cue" aria-hidden="true"><i></i>Scroll</div>
    </section>

    <section class="section-tight">
      <div class="container"><div class="stats reveal" id="stats-grid"></div></div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div><p class="kicker reveal" style="--k:var(--violet)">Research focus</p>
          <h2 class="h2 reveal">Three enteric diseases. One question:<br class="br-lg" /> how does the gut defend itself?</h2></div>
          <a class="btn reveal" href="research.html">All projects</a>
        </div>
        <div class="grid grid-3" id="pillars"></div>
        <div class="chips reveal" id="focus-badges" style="margin-top:28px"></div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-head">
          <div><p class="kicker reveal" style="--k:var(--gold)">Selected publications</p>
          <h2 class="h2 reveal">First-author work</h2></div>
          <a class="btn reveal" href="publications.html">All publications</a>
        </div>
        <div id="home-pubs"></div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="grid grid-2" style="align-items:start;gap:48px">
          <div>
            <p class="kicker reveal" style="--k:var(--rose)">On the road</p>
            <h2 class="h2 reveal">Recent talks &amp; posters</h2>
            <div class="timeline reveal" id="home-talks" style="margin-top:32px"></div>
            <p style="margin-top:28px"><a class="arrow-link" href="presentations.html">All presentations <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></p>
          </div>
          <div>
            <p class="kicker reveal" style="--k:var(--teal)">Funding</p>
            <h2 class="h2 reveal">Supported research</h2>
            <div id="home-funding" style="margin-top:32px;display:grid;gap:14px"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="cta-band reveal">
          <p class="kicker">Collaborate</p>
          <h2 class="h2" style="max-width:22ch">Working on enteric disease, organoids or the poultry microbiome?</h2>
          <p class="lead" style="margin-top:14px">I'm always glad to talk science, collaborations and speaking invitations.</p>
          <div class="hero-cta"><a class="btn btn-primary magnetic" href="contact.html">Get in touch</a><a class="btn magnetic" data-copy-email href="#">Copy email</a></div>
        </div>
      </div>
    </section>
"""

BODIES["research"] = page_hero("Research", "teal", "From flock to <span class=\"grad-text\">organoid</span>",
    "My work links in vivo challenge models with laboratory systems — cecal organoids, microbiome sequencing and host genetics — to understand and control enteric diseases of poultry.",
    '<div class="filter-bar reveal" style="margin-top:32px;--d:180ms" id="project-filters" role="group" aria-label="Filter projects by theme"></div>') + """
    <section class="section" style="padding-top:24px">
      <div class="container"><div class="grid" id="project-grid" style="gap:22px"></div></div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="container">
        <p class="kicker reveal" style="--k:var(--gold)">Toolkit</p>
        <h2 class="h2 reveal">Methods I use</h2>
        <div class="grid grid-3" id="skills-grid" style="margin-top:32px"></div>
      </div>
    </section>
"""

BODIES["publications"] = page_hero("Publications", "gold", "Publications",
    "Peer-reviewed articles, manuscripts under review and work in progress. Use search and filters, click a year to focus, and grab a formatted citation or BibTeX in one click.",
    '<div class="mini-stats reveal" id="pub-stats" style="--d:180ms"></div>') + """
    <div class="toolbar">
      <div class="container toolbar-row">
        <div class="filter-bar" id="publication-tabs" role="group" aria-label="Publication status"></div>
        <label class="search-field"><span class="sr-only">Search publications</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input id="publication-search" type="search" placeholder="Search title, author, journal, keyword…" autocomplete="off" />
        </label>
      </div>
    </div>
    <section class="section" style="padding-top:40px">
      <div class="container pub-layout">
        <aside class="pub-aside">
          <p class="kicker">By year</p>
          <div class="histo" id="pub-histo"></div>
          <div style="margin-top:28px">
            <p class="kicker" style="--k:var(--violet)">Refine</p>
            <div class="filter-bar" id="pub-role" style="margin-top:12px" role="group" aria-label="Authorship"></div>
            <div class="filter-bar" id="pub-type" style="margin-top:8px" role="group" aria-label="Article type"></div>
          </div>
          <p style="margin-top:28px"><a class="arrow-link" id="scholar-link" href="#" target="_blank" rel="noopener">Google Scholar profile <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M7 17 17 7M8 7h9v9"/></svg></a></p>
        </aside>
        <div id="publication-list" aria-live="polite"></div>
      </div>
    </section>
"""

BODIES["presentations"] = page_hero("Presentations", "rose", "Talks &amp; posters",
    "Oral, poster and symposium presentations at the Poultry Science Association, International Poultry Scientific Forum and American Association of Avian Pathologists meetings.",
    '<div class="mini-stats reveal" id="pres-stats" style="--d:180ms"></div>') + """
    <div class="toolbar">
      <div class="container toolbar-row">
        <div class="filter-bar" id="pres-who" role="group" aria-label="Presenter"></div>
        <div class="filter-bar">
          <label class="sr-only" for="presentation-type">Type</label>
          <select class="input" id="presentation-type" style="width:auto;height:36px"></select>
          <label class="sr-only" for="presentation-year">Year</label>
          <select class="input" id="presentation-year" style="width:auto;height:36px"></select>
        </div>
      </div>
    </div>
    <section class="section" style="padding-top:40px">
      <div class="container"><div class="grid grid-3" id="presentation-grid"></div></div>
    </section>
"""

BODIES["cv"] = page_hero("Curriculum vitae", "blue", "Curriculum vitae",
    "Education, research experience, funding, skills and mentoring. The full CV is available as a PDF.",
    '<div class="hero-cta reveal no-print" style="--d:180ms"><a class="btn btn-primary magnetic" id="cv-link" href="assets/cv/Abhisek_Niraula_CV.pdf" download>Download PDF</a><button class="btn" type="button" onclick="window.print()">Print this page</button></div>') + """
    <section class="section" style="padding-top:24px">
      <div class="container cv-layout">
        <nav class="toc" id="cv-toc" aria-label="CV sections">
          <a href="#education">Education</a><a href="#experience">Experience</a><a href="#funding">Funding</a>
          <a href="#skills">Skills</a><a href="#mentoring">Mentoring</a><a href="#affiliations">Affiliations</a>
        </nav>
        <div>
          <section class="cv-section" id="education"><h2 class="h2">Education</h2><div class="timeline" id="education-list"></div></section>
          <section class="cv-section" id="experience"><h2 class="h2">Research experience</h2><div id="experience-list"></div></section>
          <section class="cv-section" id="funding"><h2 class="h2">Grants &amp; funding</h2><div class="grid" id="funding-list"></div></section>
          <section class="cv-section" id="skills"><h2 class="h2">Skills</h2><div id="skills-list"></div></section>
          <section class="cv-section" id="mentoring"><h2 class="h2">Mentoring</h2><div class="grid grid-2" id="mentoring-list"></div></section>
          <section class="cv-section" id="affiliations"><h2 class="h2">Professional affiliations</h2><div class="chips" id="affiliation-list"></div></section>
        </div>
      </div>
    </section>
"""

BODIES["honors"] = page_hero("Recognition &amp; service", "gold", "Honors &amp; service",
    "Awards, travel grants and scholarships, together with peer review, judging, memberships and community roles.",
    '<div class="mini-stats reveal" id="honor-stats" style="--d:180ms"></div>') + """
    <section class="section" style="padding-top:24px">
      <div class="container grid grid-2" style="gap:56px;align-items:start">
        <div>
          <p class="kicker" style="--k:var(--gold)">Awards</p>
          <h2 class="h2">Awards &amp; scholarships</h2>
          <div class="timeline" id="honors-list" style="margin-top:32px"></div>
        </div>
        <div>
          <p class="kicker" style="--k:var(--violet)">Service</p>
          <h2 class="h2">Professional activities</h2>
          <div class="grid" id="activities-list" style="margin-top:32px;gap:12px"></div>
        </div>
      </div>
    </section>
"""

BODIES["media"] = page_hero("Media", "violet", "Media &amp; gallery",
    "Journal club materials, profiles and moments from conferences. Click any photo to open it.",
    '<div class="filter-bar reveal" style="margin-top:32px;--d:180ms" id="media-filters" role="group" aria-label="Filter media"></div>') + """
    <section class="section" style="padding-top:24px">
      <div class="container"><div class="grid grid-3" id="media-grid"></div></div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="container">
        <p class="kicker" style="--k:var(--rose)">Gallery</p>
        <h2 class="h2">Conference moments</h2>
        <div class="masonry" id="gallery" style="margin-top:32px"></div>
      </div>
    </section>
"""

BODIES["contact"] = page_hero("Contact", "teal", "Let's talk science",
    "For research correspondence, collaboration inquiries and presentation invitations, email is the best way to reach me.") + """
    <section class="section" style="padding-top:16px">
      <div class="container contact-grid">
        <div class="card card-pad spot reveal">
          <h2 class="h3" style="font-size:1.35rem" data-profile="name"></h2>
          <p class="muted" style="margin:6px 0 0;font-size:14.5px"><span data-profile="lab"></span><br /><span data-profile="affiliation"></span></p>
          <dl style="margin:20px 0 0">
            <div class="contact-row"><div><dt>Institutional email</dt><dd><a id="primary-email-link" href="#"></a></dd></div><button class="btn btn-sm" type="button" data-copy="primary">Copy</button></div>
            <div class="contact-row"><div><dt>Secondary email</dt><dd><a id="secondary-email-link" href="#"></a></dd></div><button class="btn btn-sm" type="button" data-copy="secondary">Copy</button></div>
            <div class="contact-row"><div><dt>Location</dt><dd data-profile="location"></dd></div></div>
            <div class="contact-row"><div><dt>Local time in Athens</dt><dd class="clock" id="local-clock">--:--</dd></div></div>
          </dl>
          <div class="social" id="contact-links"></div>
        </div>
        <div class="card card-pad reveal" style="--d:100ms">
          <h2 class="h3" style="font-size:1.35rem">Write a quick note</h2>
          <p class="muted" style="margin:6px 0 20px;font-size:14.5px">This opens a pre-filled draft in your email app — nothing is stored on this site.</p>
          <form id="mailto-form" class="grid" style="gap:14px">
            <div class="grid grid-2" style="gap:14px">
              <div><label class="label" for="sender-name">Name</label><input class="input" id="sender-name" required autocomplete="name" /></div>
              <div><label class="label" for="sender-email">Your email</label><input class="input" id="sender-email" type="email" required autocomplete="email" /></div>
            </div>
            <div><label class="label" for="inquiry-topic">Topic</label>
              <select class="input" id="inquiry-topic"><option>Research collaboration</option><option>Speaking invitation</option><option>Question about a paper</option><option>Other</option></select></div>
            <div><label class="label" for="inquiry-message">Message</label><textarea class="input" id="inquiry-message" required placeholder="Hi Abhisek, …"></textarea></div>
            <div><button class="btn btn-primary" type="submit">Open email draft</button></div>
          </form>
        </div>
      </div>
    </section>
"""

BODIES["404"] = """
    <section class="hero" style="min-height:70vh">
      <canvas class="hero-canvas" id="hero-canvas" aria-hidden="true"></canvas>
      <div class="container" style="text-align:center">
        <p class="kicker">Error 404</p>
        <h1 class="h-display">Specimen <span class="grad-text">not found</span></h1>
        <p class="lead" style="margin:18px auto 0">This slide seems to have wandered off the stage. Try the search, or head back home.</p>
        <div class="hero-cta" style="justify-content:center"><a class="btn btn-primary" href="index.html">Back to home</a><button class="btn" type="button" data-open-palette>Search the site</button></div>
      </div>
    </section>
"""

for k, f, _ in NAV + [("404", "404.html", "")]:
    h = head(k, f)
    if k == "404": h = h.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n  <base href="/" />\n  <meta name="robots" content="noindex" />')
    html = h + header(k) + f'\n  <main id="main">{BODIES[k]}\n  </main>\n' + FOOTER + SCRIPTS
    (ROOT / f).write_text(html, encoding="utf-8")
    print("wrote", f)
