/* ==========================================================================
   script.js  -  everything that moves or is built by JavaScript.

   EASY EDITS (all in section 1 below):
     - Rotating subtitle words  -> ROLES
     - Contact links            -> CONTACT  (an empty "" link is hidden automatically)
     - Projects                 -> PROJECTS (add a new { ... } block, nothing else to change)
   ========================================================================== */

/* ---------- 1. YOUR CONTENT (edit this part) ---------- */

const NAME = "Vinson Mervin";

// Words that type and delete in the hero subtitle, one after the other
const ROLES = [
  "Computer Science Student",
  "Data Analytics Enthusiast",
  "Aspiring Data Engineer",
  "Machine Learning Explorer",
];

// Footer icons. Leave a link as "" to hide that icon.
const CONTACT = {
  github: "https://github.com/vie-m",
  linkedin: "https://www.linkedin.com/in/vinson-mervin/",
  instagram: "https://www.instagram.com/vinsonm_/",
  email: "vinson.mervin2006@gmail.com",      // becomes a mailto: link
};

// Projects. To add one, copy a { ... } block and paste it at the end (do not forget the comma).
//   title, description : text on the card
//   tech               : small tags
//   github             : link for the "GitHub" button   ("" = button hidden)
//   live               : link for the "Live Demo" button ("" = button hidden)
//   image              : screenshot path or URL         ("" = colored placeholder)
// Cards are numbered automatically: Project #1, #2, #3 ... in this order.
const PROJECTS = [
  {
    title: "VieMeal",
    description:
      "Meal planning and nutrition app: calorie and macro targets, typo-tolerant search over 7,800+ foods (USDA + Indonesian dishes), a rule-based meal planner, progress charts and an optional AI assistant. 19-table PostgreSQL schema with raw SQL.",
    tech: ["React", "Express", "PostgreSQL", "PWA", "Gemini API"],
    github: "https://github.com/vie-m/VieMeal",
    live: "https://viemeal.vercel.app",
    image: "https://raw.githubusercontent.com/vie-m/VieMeal/main/docs/images/dashboard.png",
  },
  {
    title: "vmWeather",
    description:
      "Weather app: search any city or click the map to see current conditions, a 24-hour forecast and a 7-day outlook. Frontend only, using the free Open-Meteo API.",
    tech: ["React", "Vite", "Tailwind CSS", "Leaflet", "Open-Meteo API"],
    github: "https://github.com/vie-m/vmWeather",
    live: "https://vm-weather.vercel.app",
    image: "images/vmweather.png",
  },
  {
    title: "Tiket-IN",
    description:
      "Event ticketing web app with user accounts and a seat map. A database transaction makes sure two people can never book the same seat.",
    tech: ["React", "Node.js", "Express", "PostgreSQL", "JWT"],
    github: "https://github.com/vie-m/Tiket-IN",
    live: "https://tiket-in-ten.vercel.app",
    image: "images/tiket-in.png",
  },
  {
    title: "YouTube Trend Analysis",
    description:
      "Analyzed 3,000 videos across 15 tech-review channels with YouTube Data API, Python and SQLite. Built fair channel/format/age-group performance metrics, SQL analysis, breakout detection and an interactive Streamlit dashboard.",
    tech: ["Python", "YouTube Data API", "SQLite", "pandas", "Streamlit"],
    github: "https://github.com/vie-m/youtube-trend-analysis",
    live: "https://youtube-trend-analysis-l5bvfkbe8ce35rgcipobon.streamlit.app/",
    image: "images/youtube-trends.png",
  },
  {
    title: "Olist E-commerce Data Warehouse",
    description:
      "Data warehouse for 100K Brazilian e-commerce orders: PostgreSQL star schema, Pentaho ETL, 12 SQL queries, RFM customer segmentation and dashboards.",
    tech: ["PostgreSQL", "Pentaho", "SQL", "Python", "Jupyter"],
    github: "https://github.com/vie-m/olist-ecommerce-data-warehouse",
    live: "",   // no live demo for this one, so the button is hidden
    image:
      "https://raw.githubusercontent.com/vie-m/olist-ecommerce-data-warehouse/main/docs/images/dashboard_sales.png",
  },
];

/* ---------- 2. Small helpers ---------- */

// Did the visitor ask the system for less motion? (Then we skip heavy animations.)
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (selector) => document.querySelector(selector);

// Make an element: el("p", "my-class", "text"). Uses textContent, so text is always safe.
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ---------- 3. Hero typing effect ---------- */

const nameEl = $("#typed-name");
const roleEl = $("#typed-role");

async function typeText(node, text, speed) {
  for (let i = 1; i <= text.length; i++) {
    node.textContent = text.slice(0, i);
    await sleep(speed);
  }
}

async function deleteText(node, speed) {
  let text = node.textContent;
  while (text.length > 0) {
    text = text.slice(0, -1);
    node.textContent = text;
    await sleep(speed);
  }
}

async function runHero() {
  if (reduceMotion) {            // no typing: just show the final text
    $("#name-cursor").remove();
    nameEl.textContent = NAME;
    roleEl.textContent = ROLES[0];
    return;
  }
  nameEl.textContent = "";
  roleEl.textContent = "";
  await sleep(400);
  await typeText(nameEl, NAME, 85);     // 1) type the name
  $("#name-cursor").remove();           //    name is done: only the subtitle cursor keeps blinking
  await sleep(450);

  let i = 0;                            // 2) then loop through the roles forever
  while (true) {
    await typeText(roleEl, ROLES[i], 55);
    await sleep(1500);
    await deleteText(roleEl, 30);
    await sleep(300);
    i = (i + 1) % ROLES.length;
  }
}

/* ---------- 4. Navbar: hamburger menu + highlight current section ---------- */

const navToggle = $("#nav-toggle");
const navMenu = $("#nav-menu");

function setMenu(open) {
  navMenu.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

navToggle.addEventListener("click", () => setMenu(!navMenu.classList.contains("open")));
navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
window.addEventListener("resize", () => { if (window.innerWidth > 820) setMenu(false); });

// Highlight the nav link of the section that is on screen
const navLinks = [...navMenu.querySelectorAll("a")];
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === "#" + entry.target.id;
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }   // a thin band in the middle of the screen
  );
  document.querySelectorAll("section[id], footer[id]").forEach((s) => sectionObserver.observe(s));
}

/* ---------- 5. Projects: build the cards from the PROJECTS list ---------- */

function makeButton(url, label, iconClass, extraClass, ariaLabel) {
  const a = el("a", "btn btn-small " + extraClass);
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.setAttribute("aria-label", ariaLabel);
  const icon = el("i", iconClass);
  icon.setAttribute("aria-hidden", "true");
  a.append(icon, document.createTextNode(label));
  return a;
}

function renderProjects() {
  const grid = $("#projects-grid");

  PROJECTS.forEach((p, index) => {
    const card = el("article", "project reveal");
    card.style.setProperty("--d", index * 0.1 + "s");   // cards appear one after the other

    // Image area: a screenshot if given, otherwise a colored placeholder with an icon
    const media = el("div", "project-media");
    if (p.image) {
      const img = el("img");
      img.src = p.image;
      img.alt = "Screenshot of " + p.title;
      img.loading = "lazy";
      media.append(img);
    } else {
      const icon = el("i", "fa-solid fa-code");
      icon.setAttribute("aria-hidden", "true");
      media.append(icon);
    }

    const body = el("div", "project-body");
    body.append(
      el("p", "project-num", "Project #" + (index + 1)),   // auto-numbered
      el("h3", "project-title", p.title),
      el("p", "project-desc", p.description)
    );

    const tags = el("ul", "tags");
    tags.setAttribute("aria-label", "Technologies used");
    p.tech.forEach((t) => tags.append(el("li", "", t)));
    body.append(tags);

    // Buttons: an empty link means the button is not created at all
    const actions = el("div", "project-actions");
    if (p.github) {
      actions.append(makeButton(p.github, " GitHub", "fa-brands fa-github", "btn-ghost", p.title + " on GitHub (opens in a new tab)"));
    }
    if (p.live) {
      actions.append(makeButton(p.live, " Live Demo", "fa-solid fa-arrow-up-right-from-square", "btn-primary", p.title + " live demo (opens in a new tab)"));
    }
    if (actions.children.length) body.append(actions);

    card.append(media, body);
    grid.append(card);
  });
}

/* Tilt + moving glow on project cards (only for mouse users, never with reduced motion) */
function addCardEffects() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!finePointer || reduceMotion) return;

  document.querySelectorAll(".project").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;    // 0 (left) to 1 (right)
      const y = (e.clientY - r.top) / r.height;    // 0 (top) to 1 (bottom)
      card.style.setProperty("--mx", x * 100 + "%");
      card.style.setProperty("--my", y * 100 + "%");
      card.style.transform =
        `perspective(900px) rotateY(${(x - 0.5) * 8}deg) rotateX(${(0.5 - y) * 8}deg) translateY(-6px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

/* ---------- 6. Footer contact icons ---------- */

function renderContact() {
  const list = $("#social");
  const items = [
    { href: CONTACT.github,    icon: "fa-brands fa-github",    label: "GitHub" },
    { href: CONTACT.linkedin,  icon: "fa-brands fa-linkedin",  label: "LinkedIn" },
    { href: CONTACT.instagram, icon: "fa-brands fa-instagram", label: "Instagram" },
    { href: CONTACT.email ? "mailto:" + CONTACT.email : "", icon: "fa-solid fa-envelope", label: "Email" },
  ];

  items.forEach((item) => {
    if (!item.href) return;                 // empty link -> hide icon
    const li = el("li");
    const a = el("a");
    a.href = item.href;
    a.setAttribute("aria-label", item.label);
    a.title = item.label;
    if (!item.href.startsWith("mailto:")) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    const icon = el("i", item.icon);
    icon.setAttribute("aria-hidden", "true");
    a.append(icon);
    li.append(a);
    list.append(li);
  });
}

/* ---------- 7. Fade / slide in when scrolled into view ---------- */

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((i) => i.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);       // animate only once
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((i) => observer.observe(i));
}

/* ---------- 8. Particle network background (canvas) ---------- */

(function particles() {
  const canvas = $("#bg");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // The accent color from CSS (--accent-rgb), so changing it in style.css recolors the dots too
  const rgb = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim() || "34, 211, 238";

  const LINK_DISTANCE = 130;     // dots closer than this get a line
  const MOUSE_RADIUS = 150;      // how far the mouse pushes dots away
  let width = 0, height = 0, dpr = 1;
  let dots = [];
  let frameId = null;
  const mouse = { x: -9999, y: -9999 };

  function makeDots() {
    const mobile = width < 700;
    // Fewer dots on phones keeps it smooth and saves battery
    const count = mobile
      ? Math.min(38, Math.floor((width * height) / 9000))
      : Math.min(110, Math.floor((width * height) / 14000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 0.8,
    }));
  }

  function resize() {
    const widthChanged = window.innerWidth !== width;
    dpr = Math.min(window.devicePixelRatio || 1, 2);   // sharp on retina, but capped for speed
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Phones change height when the address bar hides: only rebuild the dots if the width changed
    if (widthChanged || dots.length === 0) makeDots();
    if (reduceMotion) draw();             // keep the still picture sharp after resizing
  }

  function step() {
    for (const d of dots) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > width) d.vx *= -1;     // bounce on the edges
      if (d.y < 0 || d.y > height) d.vy *= -1;

      // Mouse gently pushes nearby dots away
      const dx = d.x - mouse.x, dy = d.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const push = (1 - dist / MOUSE_RADIUS) * 0.6;
        d.x += (dx / dist) * push;
        d.y += (dy / dist) * push;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Lines between close dots (more transparent when further apart)
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DISTANCE) {
          ctx.strokeStyle = `rgba(${rgb}, ${(1 - dist / LINK_DISTANCE) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    // Lines from the mouse to dots around it
    for (const d of dots) {
      const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
      if (dist < MOUSE_RADIUS) {
        ctx.strokeStyle = `rgba(${rgb}, ${(1 - dist / MOUSE_RADIUS) * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    // The dots
    ctx.fillStyle = `rgba(${rgb}, 0.75)`;
    for (const d of dots) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    step();
    draw();
    frameId = requestAnimationFrame(loop);
  }

  function start() { if (!frameId && !reduceMotion) frameId = requestAnimationFrame(loop); }
  function stop()  { if (frameId) { cancelAnimationFrame(frameId); frameId = null; } }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  // Pause when the tab is hidden: no wasted battery or CPU
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  resize();
  if (reduceMotion) draw();   // reduced motion: one still picture, no animation
  else start();
})();

/* ---------- 9. Download CV button ----------
   A plain <a download> link is not enough: browsers ignore "download" in some cases
   (for example when index.html is opened by double-click) and just show the PDF.
   So the click is handled here: get the PDF as a "blob", then save it with a download link. */

const CV_FILE = "Vinson_Mervin_CV.pdf";    // name of the saved file on the visitor's computer

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.append(s);
  });
}

async function getCvBlob(url) {
  try {
    // Normal case (website on Vercel / GitHub Pages / local server): read the real PDF file
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.blob();
  } catch (err) {
    // Page opened by double-click (file://): the browser blocks fetch, so use the copy in cv-data.js
    await loadScript("cv-data.js");
    const bytes = Uint8Array.from(atob(window.CV_BASE64), (c) => c.charCodeAt(0));
    return new Blob([bytes], { type: "application/pdf" });
  }
}

function setupCvDownload() {
  const link = $("#cv-download");
  if (!link) return;
  link.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      saveBlob(await getCvBlob(link.getAttribute("href")), CV_FILE);
    } catch (err) {
      window.open(link.href, "_blank", "noopener");   // last resort: open the PDF in a new tab
    }
  });
}

/* ---------- 10. Start everything ---------- */

setupCvDownload();
renderProjects();
renderContact();
addCardEffects();
setupReveal();
runHero();
