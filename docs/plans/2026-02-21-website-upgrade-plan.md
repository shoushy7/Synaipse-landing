# Synaipse Landing Page Upgrade — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the Synaipse landing page with scroll animations, a redesigned hero, product screenshot placeholders, an infinite-scroll EHR marquee, glassmorphism effects, and a new "Platform Preview" section — inspired by Commure and Stedi.

**Architecture:** Progressive enhancement of existing static HTML/CSS/JS site. All animations driven by CSS transitions + `IntersectionObserver` in vanilla JS. No build tools, no frameworks, no new dependencies. Every animation respects `prefers-reduced-motion`.

**Tech Stack:** HTML5, CSS3 (custom properties, `@keyframes`, `backdrop-filter`), vanilla JavaScript (IntersectionObserver API)

**Reference Design Doc:** `docs/plans/2026-02-21-website-upgrade-design.md`

---

## Task 1: CSS Animation Foundation — Scroll Reveal Classes

**Files:**
- Modify: `styles.css` (append after line ~3100, before print styles)

**Step 1: Add scroll-reveal animation CSS**

Add these classes at the end of `styles.css`, just before the `/* ---------- Print Styles ---------- */` section:

```css
/* ---------- Scroll Animations ---------- */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-left {
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-left.visible {
  opacity: 1;
  transform: translateX(0);
}

.reveal-right {
  opacity: 0;
  transform: translateX(40px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-right.visible {
  opacity: 1;
  transform: translateX(0);
}

.reveal-scale {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-scale.visible {
  opacity: 1;
  transform: scale(1);
}

/* Stagger delays for children */
.reveal-stagger > .reveal:nth-child(1) { transition-delay: 0ms; }
.reveal-stagger > .reveal:nth-child(2) { transition-delay: 100ms; }
.reveal-stagger > .reveal:nth-child(3) { transition-delay: 200ms; }
.reveal-stagger > .reveal:nth-child(4) { transition-delay: 300ms; }

@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal-left, .reveal-right, .reveal-scale {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

**Step 2: Verify the CSS is valid**

Open `index.html` in a browser. No visual changes yet (no `.reveal` classes in HTML). Confirm no CSS errors in DevTools console.

**Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: add scroll-reveal animation CSS foundation"
```

---

## Task 2: IntersectionObserver + Stat Counter JS

**Files:**
- Modify: `main.js` (add after existing DOMContentLoaded handler, before the closing `})();`)

**Step 1: Add IntersectionObserver for scroll reveal**

Add this code inside the IIFE in `main.js`, after the existing `DOMContentLoaded` event listener's closing `});` (around line 94), but still inside the outer IIFE:

```javascript
  /* ---------- Scroll Reveal (IntersectionObserver) ---------- */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- Stat Counter Animation ---------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = (String(target).split('.')[1] || '').length;
    var duration = 1800;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = start + (target - start) * eased;
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  var statsSection = document.querySelector('.stats-grid');
  if (statsSection) statsObserver.observe(statsSection);
```

**Step 2: Verify no JS errors**

Open browser, check DevTools console. No errors. The observers are registered but no HTML elements have the classes yet.

**Step 3: Commit**

```bash
git add main.js
git commit -m "feat: add IntersectionObserver scroll reveal and stat counter JS"
```

---

## Task 3: Hero Section Redesign

**Files:**
- Modify: `index.html` (lines 122-137, the hero section)
- Modify: `styles.css` (hero section styles, around lines 482-572)

**Step 1: Replace hero HTML**

Replace the entire `<!-- Hero Section -->` block (lines 122-137) in `index.html` with:

```html
  <!-- Hero Section -->
  <section class="hero" id="main">
    <!-- Floating gradient orbs -->
    <div class="hero-orb hero-orb-1" aria-hidden="true"></div>
    <div class="hero-orb hero-orb-2" aria-hidden="true"></div>
    <div class="hero-orb hero-orb-3" aria-hidden="true"></div>
    <div class="container">
      <div class="hero-split">
        <div class="hero-content">
          <div class="hero-badge"><span class="pulse-dot" aria-hidden="true"></span> Physician-Founded &middot; Now in Private Beta</div>
          <h1>The <span class="highlight">Comprehensive Practice Platform</span></h1>
          <p class="hero-sub">One platform for the entire patient journey &mdash; from intake through reimbursement. Your staff open Synaipse, not their EMR. Bidirectional EHR sync runs quietly in the background.</p>
          <div class="hero-actions">
            <a href="#contact" class="btn-primary">
              Request Early Access
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-visual-frame">
            <div class="hero-visual-titlebar" aria-hidden="true">
              <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
              <span class="titlebar-text">Synaipse Dashboard</span>
            </div>
            <div class="hero-visual-body">
              <div class="hero-visual-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>Platform Preview Coming Soon</span>
              </div>
            </div>
          </div>
          <!-- Floating stat badges -->
          <div class="hero-float-badge hero-float-badge-1" aria-hidden="true">
            <span class="hero-float-icon">&#10003;</span> 87% Appeal Success
          </div>
          <div class="hero-float-badge hero-float-badge-2" aria-hidden="true">
            <span class="hero-float-icon">&#9889;</span> 24/7 Autonomous
          </div>
        </div>
      </div>
    </div>
  </section>
```

**Step 2: Replace hero CSS**

Replace the hero CSS block in `styles.css` (from `/* ---------- Hero (Index) ---------- */` through the `.hero-actions` closing brace, approximately lines 482-572) with:

```css
/* ---------- Hero (Index) ---------- */
.hero {
  padding: 140px 0 100px;
  background: linear-gradient(135deg, var(--blue-pale) 0%, var(--white) 35%, var(--white) 65%, var(--amber-pale) 100%);
  position: relative;
  overflow: hidden;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.hero-orb-1 {
  width: 400px;
  height: 400px;
  background: rgba(0, 98, 155, 0.12);
  top: -100px;
  right: 5%;
  animation: float-orb 8s ease-in-out infinite;
}

.hero-orb-2 {
  width: 300px;
  height: 300px;
  background: rgba(232, 168, 56, 0.1);
  bottom: -80px;
  left: 10%;
  animation: float-orb 10s ease-in-out infinite reverse;
}

.hero-orb-3 {
  width: 200px;
  height: 200px;
  background: rgba(0, 98, 155, 0.08);
  top: 40%;
  left: 50%;
  animation: float-orb 12s ease-in-out infinite 2s;
}

@keyframes float-orb {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(15px, -20px); }
  66% { transform: translate(-10px, 15px); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-orb { animation: none; }
}

.hero-split {
  display: flex;
  align-items: center;
  gap: 60px;
  position: relative;
  z-index: 2;
}

.hero-content {
  flex: 1 1 55%;
  max-width: 600px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 98, 155, 0.2);
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  color: var(--blue-primary);
  margin-bottom: 24px;
  box-shadow: var(--shadow-md);
}

.hero-badge .pulse-dot {
  width: 8px;
  height: 8px;
  background: var(--amber-bright);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@media (prefers-reduced-motion: reduce) {
  .hero-badge .pulse-dot { animation: none; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.9); }
}

.hero h1 {
  font-size: 52px;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -2px;
  margin-bottom: 24px;
  color: var(--slate);
}

.hero h1 .highlight {
  color: var(--blue-primary);
}

.hero-sub {
  font-size: 18px;
  color: var(--grey);
  margin-bottom: 40px;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* Hero Visual (right side) */
.hero-visual {
  flex: 1 1 45%;
  position: relative;
  min-height: 380px;
}

.hero-visual-frame {
  background: linear-gradient(135deg, #1A2332 0%, #2D3B4F 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-xl), 0 0 60px rgba(0, 98, 155, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.hero-visual-titlebar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.hero-visual-titlebar .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.hero-visual-titlebar .dot.red { background: #FF5F57; }
.hero-visual-titlebar .dot.yellow { background: #FEBC2E; }
.hero-visual-titlebar .dot.green { background: #28C840; }

.hero-visual-titlebar .titlebar-text {
  margin-left: 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.hero-visual-body {
  padding: 60px 40px;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-visual-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: rgba(255, 255, 255, 0.4);
}

.hero-visual-placeholder svg {
  opacity: 0.5;
}

.hero-visual-placeholder span {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* Floating stat badges */
.hero-float-badge {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 98, 155, 0.15);
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--slate);
  box-shadow: var(--shadow-md);
  white-space: nowrap;
  animation: float-badge 6s ease-in-out infinite;
}

.hero-float-badge-1 {
  top: 10%;
  right: -10px;
  animation-delay: 0s;
}

.hero-float-badge-2 {
  bottom: 15%;
  left: -15px;
  animation-delay: 3s;
}

.hero-float-icon {
  margin-right: 6px;
}

@keyframes float-badge {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-float-badge { animation: none; }
}
```

**Step 3: Add responsive styles for hero split**

In the existing `@media (max-width: 1024px)` block, add:

```css
  .hero-split {
    flex-direction: column;
    text-align: center;
  }

  .hero-content {
    max-width: 100%;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-visual {
    min-height: 300px;
    max-width: 500px;
    width: 100%;
    margin: 0 auto;
  }
```

In the existing `@media (max-width: 640px)` block, update the hero h1 font-size rule and add:

```css
  .hero-float-badge {
    display: none;
  }
```

**Step 4: Verify in browser**

Open `index.html`. The hero should show: text left, dark "browser frame" placeholder right, floating gradient orbs in background, glassmorphic badge, two floating stat badges. On mobile (< 640px) it should stack vertically.

**Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "feat: redesign hero with split layout, visual placeholder, and floating orbs"
```

---

## Task 4: Stats Section — Counter Animation Wiring

**Files:**
- Modify: `index.html` (lines ~139-161, stats section)

**Step 1: Add data attributes to stat numbers**

Replace the stats section HTML with counter-ready markup. Each `.stat-number` gets a `data-target`, `data-prefix`, and `data-suffix` attribute and the class `reveal`:

```html
  <!-- Stats -->
  <section class="stats" aria-label="Key metrics">
    <div class="container">
      <div class="stats-grid reveal-stagger">
        <article class="stat-item reveal">
          <div class="stat-number" data-target="87" data-suffix="%">0%</div>
          <div class="stat-label">Appeal Success Rate</div>
        </article>
        <article class="stat-item reveal">
          <div class="stat-number" data-target="68" data-suffix="%">0%</div>
          <div class="stat-label">Call Volume Reduced</div>
        </article>
        <article class="stat-item reveal">
          <div class="stat-number" data-target="2.4" data-prefix="$" data-suffix="M">$0M</div>
          <div class="stat-label">Revenue Recovered</div>
        </article>
        <article class="stat-item reveal">
          <div class="stat-number" data-target="24" data-suffix="/7">0/7</div>
          <div class="stat-label">Autonomous Operation</div>
        </article>
      </div>
    </div>
  </section>
```

**Step 2: Verify in browser**

Scroll to the stats section. Numbers should animate from 0 to their targets with an ease-out curve. The stat items should fade up with staggered timing.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: wire stat counter animations with data attributes"
```

---

## Task 5: EHR Strip — Infinite Scroll Marquee

**Files:**
- Modify: `index.html` (lines ~221-237, EHR strip)
- Modify: `styles.css` (EHR strip section, ~lines 819-855)

**Step 1: Replace EHR strip HTML with marquee**

Replace the EHR strip section with duplicated content for seamless loop:

```html
  <!-- EHR Integrations Strip -->
  <section class="ehr-strip-section" aria-label="EHR Integrations">
    <div class="container">
      <p class="ehr-strip-subtitle">Bidirectional sync with leading EHR systems</p>
    </div>
    <div class="ehr-marquee" aria-hidden="true">
      <div class="ehr-marquee-track">
        <span class="ehr-vendor" style="font-weight:700;">Epic</span>
        <span class="ehr-vendor" style="font-weight:600; font-style:italic;">athenahealth</span>
        <span class="ehr-vendor" style="font-weight:700;">NextGen</span>
        <span class="ehr-vendor" style="font-weight:700; letter-spacing:-0.3px;">Cerner</span>
        <span class="ehr-vendor" style="font-weight:600;">eClinicalWorks</span>
        <span class="ehr-vendor" style="font-weight:700;">Modernizing Medicine</span>
        <span class="ehr-vendor" style="font-weight:700; letter-spacing:0.3px;">Veradigm</span>
        <span class="ehr-vendor" style="font-weight:600;">Greenway</span>
        <span class="ehr-vendor" style="font-weight:700;">AdvancedMD</span>
        <!-- Duplicate for seamless loop -->
        <span class="ehr-vendor" style="font-weight:700;">Epic</span>
        <span class="ehr-vendor" style="font-weight:600; font-style:italic;">athenahealth</span>
        <span class="ehr-vendor" style="font-weight:700;">NextGen</span>
        <span class="ehr-vendor" style="font-weight:700; letter-spacing:-0.3px;">Cerner</span>
        <span class="ehr-vendor" style="font-weight:600;">eClinicalWorks</span>
        <span class="ehr-vendor" style="font-weight:700;">Modernizing Medicine</span>
        <span class="ehr-vendor" style="font-weight:700; letter-spacing:0.3px;">Veradigm</span>
        <span class="ehr-vendor" style="font-weight:600;">Greenway</span>
        <span class="ehr-vendor" style="font-weight:700;">AdvancedMD</span>
      </div>
    </div>
  </section>
```

**Step 2: Add marquee CSS**

Add after the existing `.ehr-vendor:hover` rule in `styles.css`:

```css
/* EHR Marquee Animation */
.ehr-marquee {
  overflow: hidden;
  width: 100%;
  padding: 8px 0;
}

.ehr-marquee-track {
  display: flex;
  gap: 48px;
  width: max-content;
  animation: marquee-scroll 30s linear infinite;
}

.ehr-marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .ehr-marquee-track {
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
    width: auto;
  }
}
```

**Step 3: Verify in browser**

The EHR vendor names should scroll smoothly left in a loop. Hovering pauses the animation. On reduced motion, it falls back to a wrapped static layout.

**Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: convert EHR strip to infinite-scroll marquee"
```

---

## Task 6: New "Platform Preview" Section

**Files:**
- Modify: `index.html` (insert new section between role-cards closing `</section>` and the EHR strip)

**Step 1: Add platform preview section HTML**

Insert this block after the closing `</section>` of the Platform section (after line ~219) and before the EHR strip:

```html
  <!-- Platform Preview -->
  <section class="platform-preview">
    <div class="platform-preview-orb platform-preview-orb-1" aria-hidden="true"></div>
    <div class="platform-preview-orb platform-preview-orb-2" aria-hidden="true"></div>
    <div class="container">
      <div class="platform-preview-inner reveal-scale">
        <div class="preview-frame">
          <div class="preview-frame-titlebar" aria-hidden="true">
            <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
            <span class="titlebar-text">Synaipse &mdash; Unified Practice Dashboard</span>
          </div>
          <div class="preview-frame-body">
            <div class="preview-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span class="preview-placeholder-title">Full Platform Demo Coming Soon</span>
              <span class="preview-placeholder-sub">See how Synaipse replaces your entire workflow stack in a single browser tab.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
```

**Step 2: Add platform preview CSS**

Add this to `styles.css` after the EHR strip styles:

```css
/* ---------- Platform Preview ---------- */
.platform-preview {
  padding: 80px 0;
  background: linear-gradient(135deg, #1A2332 0%, #2D3B4F 100%);
  position: relative;
  overflow: hidden;
}

.platform-preview::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

.platform-preview-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
  pointer-events: none;
}

.platform-preview-orb-1 {
  width: 300px; height: 300px;
  background: rgba(0, 98, 155, 0.2);
  top: -100px; left: 10%;
}

.platform-preview-orb-2 {
  width: 250px; height: 250px;
  background: rgba(232, 168, 56, 0.12);
  bottom: -80px; right: 15%;
}

.platform-preview-inner {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}

.preview-frame {
  background: #0F1419;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4), 0 0 60px rgba(0, 98, 155, 0.15);
}

.preview-frame-titlebar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.preview-frame-titlebar .dot {
  width: 12px; height: 12px;
  border-radius: 50%;
}

.preview-frame-titlebar .dot.red { background: #FF5F57; }
.preview-frame-titlebar .dot.yellow { background: #FEBC2E; }
.preview-frame-titlebar .dot.green { background: #28C840; }

.preview-frame-titlebar .titlebar-text {
  margin-left: 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
}

.preview-frame-body {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
}

.preview-placeholder svg {
  opacity: 0.4;
}

.preview-placeholder-title {
  font-size: 20px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
}

.preview-placeholder-sub {
  font-size: 15px;
  max-width: 400px;
  line-height: 1.6;
}
```

**Step 3: Verify in browser**

A dark section should appear between the role cards and EHR strip, containing a browser-chrome frame with placeholder content and two floating blurred orbs.

**Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: add Platform Preview section with browser frame placeholder"
```

---

## Task 7: Navigation Glassmorphism Enhancement

**Files:**
- Modify: `styles.css` (nav styles, ~lines 256-267)

**Step 1: Update nav styles**

Replace the `nav` CSS rule:

```css
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  transition: box-shadow 0.3s, border-color 0.3s;
}

nav.scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border-bottom-color: rgba(0, 98, 155, 0.1);
}
```

**Step 2: Add scroll detection in main.js**

Add this inside the DOMContentLoaded handler in `main.js`:

```javascript
    /* ---------- Nav Scroll State ---------- */
    var nav = document.querySelector('nav');
    if (nav) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 20) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }, { passive: true });
    }
```

**Step 3: Update dark mode nav rule**

Update the dark mode nav override in `styles.css`:

```css
  nav {
    background: rgba(15, 20, 25, 0.8) !important;
  }
```

**Step 4: Verify**

Scroll the page. The nav should gain a subtle shadow and border tint after scrolling 20px.

**Step 5: Commit**

```bash
git add styles.css main.js
git commit -m "feat: enhance nav with glassmorphism and scroll state"
```

---

## Task 8: Add Reveal Classes to All Sections

**Files:**
- Modify: `index.html` (add `reveal` classes throughout the page)

**Step 1: Add reveal classes to section headers and content blocks**

Add the `reveal` class to these elements throughout `index.html`:

- Each `.section-header` → add `class="section-header reveal"`
- Each `.role-card` → already in a container, add `reveal` to each card and `reveal-stagger` to `.role-cards`
- `.journey-phase` elements → add `reveal`
- `.comparison-before` → add `reveal-left`
- `.comparison-after` → add `reveal-right`
- Each `.step` → add `reveal` and `reveal-stagger` to `.steps`
- Each `.blog-card` in preview → add `reveal`
- `.contact-info` → add `reveal-left`
- `.contact-form` → add `reveal-right`

**Step 2: Verify in browser**

Scroll through the page. Each section should animate into view as you scroll down. Cards should stagger in. The comparison columns should slide in from their respective sides.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add scroll-reveal classes to all sections"
```

---

## Task 9: Role Card Image Placeholders + Enhanced Hover

**Files:**
- Modify: `index.html` (role card markup, around lines 172-217)
- Modify: `styles.css` (role card styles)

**Step 1: Add image placeholder to each role card**

At the top of each `.role-card` (before the `.role-card-icon`), add:

```html
          <div class="role-card-image">
            <div class="role-card-image-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
          </div>
```

**Step 2: Add CSS for image placeholder and enhanced hover**

```css
.role-card-image {
  background: linear-gradient(135deg, #1A2332 0%, #2D3B4F 100%);
  border-radius: 12px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  overflow: hidden;
}

.role-card-image-placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.role-card {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.role-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: var(--shadow-xl);
}
```

**Step 3: Verify**

Each role card should now have a dark image placeholder area at the top and a smooth lift on hover.

**Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: add image placeholders and enhanced hover to role cards"
```

---

## Task 10: Contact Section Glassmorphism Polish

**Files:**
- Modify: `styles.css` (contact section styles)

**Step 1: Update contact form card**

Update the `.contact-form` rule to add glassmorphism:

```css
.contact-form {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 16px;
  padding: 40px;
  box-shadow: var(--shadow-lg);
}
```

**Step 2: Add glow effect to submit button**

Update `.form-submit:hover`:

```css
.form-submit:hover {
  background: var(--blue-deep);
  transform: translateY(-2px);
  box-shadow: var(--shadow-blue-bright), 0 0 20px rgba(0, 98, 155, 0.2);
}
```

**Step 3: Verify and commit**

```bash
git add styles.css
git commit -m "feat: add glassmorphism to contact form and button glow"
```

---

## Task 11: Final Review + Dark Mode Fixes

**Files:**
- Modify: `styles.css` (dark mode block)

**Step 1: Add dark mode overrides for new elements**

Add to the `@media (prefers-color-scheme: dark)` block:

```css
  .hero-badge {
    background: rgba(15, 20, 25, 0.6);
    border-color: rgba(0, 98, 155, 0.3);
  }

  .hero-float-badge {
    background: rgba(26, 35, 50, 0.9);
    border-color: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .hero-visual-frame {
    border-color: rgba(255, 255, 255, 0.12);
  }

  .contact-form {
    background: rgba(26, 35, 50, 0.85);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .role-card-image {
    background: linear-gradient(135deg, #0F1419 0%, #1A2332 100%);
  }
```

**Step 2: Full visual QA in browser**

- Test light mode: all sections, scroll animations, hero, marquee
- Test dark mode: toggle system theme, verify all new elements
- Test mobile (< 640px): hero stacks, marquee works, animations fire
- Test reduced motion: disable animations in system settings

**Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: add dark mode support for all new elements"
```

---

## Summary

| Task | What it does |
|------|-------------|
| 1 | CSS animation foundation (reveal classes) |
| 2 | IntersectionObserver + stat counter JS |
| 3 | Hero redesign (split layout, orbs, placeholder) |
| 4 | Stats counter animation wiring |
| 5 | EHR marquee infinite scroll |
| 6 | New Platform Preview section |
| 7 | Navigation glassmorphism |
| 8 | Add reveal classes sitewide |
| 9 | Role card image placeholders + hover |
| 10 | Contact section glassmorphism |
| 11 | Dark mode fixes + QA |
