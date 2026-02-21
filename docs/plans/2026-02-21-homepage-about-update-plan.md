# Homepage & About Page Update — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move product displays to a full Automation Platform page, replace the homepage journey section with an interactive horizontal timeline, and add real founder bios with institution logos to the About page.

**Architecture:** Three independent changes touching `index.html`, `automation-platform.html`, `about.html`, `styles.css`, and `main.js`. No new dependencies — vanilla HTML/CSS/JS. Timeline uses tablist/tabpanel ARIA pattern with click-to-expand cards. Institution logos as inline SVGs.

**Tech Stack:** HTML5, CSS3 (custom properties, flexbox, grid, transitions), vanilla JavaScript (event delegation, classList, setAttribute)

---

### Task 1: Remove hero visual frame from homepage

**Files:**
- Modify: `index.html:209-229` (remove `.hero-visual` div and its contents)

**Step 1: Remove the hero-visual block**

In `index.html`, delete the entire `.hero-visual` div (lines 209-229). The `<div class="hero-split">` should now only contain `<div class="hero-content">...</div>`.

```html
<!-- REMOVE everything from line 209 to 229 inclusive -->
<!-- <div class="hero-visual"> ... </div> -->
```

After removal, close the `.hero-split` div immediately after `.hero-content` closes:

```html
        </div><!-- .hero-content -->
      </div><!-- .hero-split -->
```

**Step 2: Remove the platform preview section**

In `index.html`, delete the entire Platform Preview section (lines 331-352):

```html
<!-- REMOVE the entire section from line 331 to 352 -->
<!-- <section class="platform-preview"> ... </section> -->
```

**Step 3: Verify the homepage still renders**

Open `index.html` in browser. The hero should show headline + CTA without the browser frame. The EHR marquee should appear after the role cards (no platform preview between them).

**Step 4: Commit**

```bash
git add index.html
git commit -m "refactor: remove product interface displays from homepage

Removes hero visual frame (browser mockup + stat badges) and
platform preview section. These will move to the product page."
```

---

### Task 2: Update homepage hero CSS for single-column layout

**Files:**
- Modify: `styles.css` — hero section styles (~lines 740-860)

**Step 1: Simplify hero-split to single-column centered**

The `.hero-split` was a two-column layout (content + visual). Now it's content-only, so center it:

```css
.hero-split {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 48px;
}

.hero-content {
  max-width: 720px;
}

.hero-actions {
  justify-content: center;
}
```

Keep all existing `.hero-visual-*` CSS rules in place (they'll be reused on the product page). Just adjust `.hero-split` and `.hero-content`.

**Step 2: Verify hero is centered**

Open `index.html` in browser. Hero text and CTA button should be horizontally centered.

**Step 3: Commit**

```bash
git add styles.css
git commit -m "style: center hero layout after visual frame removal"
```

---

### Task 3: Build full Automation Platform product page

**Files:**
- Modify: `automation-platform.html` (replace placeholder body with full product page)

**Step 1: Replace the page content**

Replace the Page Hero and Coming Soon sections (lines 142-161) with:

1. **Hero section** with the browser frame mockup (moved from homepage) and floating badges
2. **5 Feature sections** — alternating layout, one per workflow phase:
   - Intake Automation (icon: clipboard)
   - Clinical Visit Intelligence (icon: heartbeat)
   - Surgery Scheduling Assistant (icon: calendar)
   - Prior Authorization Engine (icon: shield)
   - Revenue Cycle Management (icon: dollar)
3. **CTA section** at bottom

Each feature section structure:

```html
<section class="product-feature" id="intake">
  <div class="container">
    <div class="product-feature-inner reveal">
      <div class="product-feature-icon" aria-hidden="true">
        <svg><!-- phase icon --></svg>
      </div>
      <div class="product-feature-content">
        <h2>Intake Automation</h2>
        <p>Short description of the phase.</p>
        <ul class="product-feature-list">
          <li>Referral receipt and processing</li>
          <li>Medical record gathering</li>
          <li>Insurance verification</li>
          <li>Smart scheduling</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

Feature sections content:

| Phase | Description | Sub-items |
|-------|-------------|-----------|
| Intake Automation | Automated patient onboarding from first referral to scheduled appointment. | Referral receipt and processing, Medical record gathering, Insurance verification, Smart scheduling |
| Clinical Visit Intelligence | AI-powered tools that support every moment of the clinical encounter. | Automated pre-visit patient intake, Patient summarization and HPI drafting, Ambient scribing, Automated E&M coding and billing |
| Surgery Scheduling Assistant | A smart assistant that bridges the gap between the surgeon and the operating room. | Collects procedure details not in clinic note, Identifies required supplies, location, and reps, Assesses urgency level, Coordinates with secretary to schedule with hospital |
| Prior Authorization Engine | End-to-end prior authorization handled autonomously. | Authorization packet preparation, Electronic submission to payers, Real-time status tracking |
| Revenue Cycle Management | From operative note to collected payment — fully automated. | Operative note coding, Claim preparation, submission, and tracking, Claim denial management and appeals, Collections follow-up |

**Step 2: Verify the product page renders**

Open `automation-platform.html` in browser. Should show hero with browser frame, 5 feature sections, and CTA.

**Step 3: Commit**

```bash
git add automation-platform.html
git commit -m "feat: build full automation platform product page

Replaces placeholder with hero (browser mockup moved from homepage),
5 feature sections covering intake through RCM, and a CTA."
```

---

### Task 4: Add product page CSS

**Files:**
- Modify: `styles.css` — add new `.product-feature` styles

**Step 1: Add product feature section styles**

Add after the existing `.about-hero` styles (or after the platform-preview styles). New classes needed:

```css
/* ---------- Product Feature Sections ---------- */
.product-feature {
  padding: 80px 0;
}

.product-feature:nth-child(even) {
  background: var(--off-white);
}

.product-feature-inner {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 32px;
  align-items: start;
  max-width: 800px;
  margin: 0 auto;
}

.product-feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(0, 98, 155, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--blue-primary);
}

.product-feature-icon svg {
  width: 28px;
  height: 28px;
  stroke: var(--blue-primary);
}

.product-feature-content h2 {
  font-family: 'DM Sans', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: var(--slate);
  margin-bottom: 12px;
}

.product-feature-content p {
  font-size: 16px;
  color: var(--grey);
  line-height: 1.7;
  margin-bottom: 20px;
}

.product-feature-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-feature-list li {
  font-size: 15px;
  color: var(--slate);
  padding-left: 24px;
  position: relative;
}

.product-feature-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--blue-primary);
  opacity: 0.5;
}

/* Product page CTA */
.product-cta {
  padding: 80px 0;
  text-align: center;
  background: linear-gradient(135deg, var(--blue-primary), #004d7a);
  color: white;
}

.product-cta h2 {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
}

.product-cta p {
  font-size: 18px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 32px;
}

/* Responsive */
@media (max-width: 768px) {
  .product-feature-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .product-feature-icon {
    margin: 0 auto;
  }
  .product-feature-list li {
    text-align: left;
  }
}
```

**Step 2: Add dark mode overrides**

Inside the `@media (prefers-color-scheme: dark)` block:

```css
.product-feature:nth-child(even) {
  background: rgba(255,255,255,0.02);
}
.product-feature-icon {
  background: rgba(0, 98, 155, 0.15);
}
.product-feature-content h2 {
  color: var(--white);
}
.product-feature-content p {
  color: rgba(255,255,255,0.7);
}
.product-feature-list li {
  color: rgba(255,255,255,0.85);
}
.product-cta {
  background: linear-gradient(135deg, #003d5f, #002a42);
}
```

**Step 3: Verify product page styling**

Open `automation-platform.html`. Feature sections should have icon + content grid, alternating backgrounds, clean typography.

**Step 4: Commit**

```bash
git add styles.css
git commit -m "style: add product feature section styles with dark mode"
```

---

### Task 5: Replace journey section HTML with horizontal timeline

**Files:**
- Modify: `index.html:384-482` (replace entire journey section)

**Step 1: Replace the journey section**

Delete lines 384-482 (the entire `<section class="journey">...</section>`) and replace with the new horizontal timeline:

```html
<!-- Patient Timeline -->
<section class="timeline" id="journey">
  <div class="container">
    <header class="section-header reveal">
      <div class="section-label">Patient Journey</div>
      <h2 class="section-title">Automated From <span class="highlight">Referral to Revenue</span></h2>
      <p class="section-sub">Click a phase to explore how Synaipse automates every step of the patient journey.</p>
    </header>

    <div class="timeline-track" role="tablist" aria-label="Patient journey phases">
      <div class="timeline-line" aria-hidden="true"></div>

      <button class="timeline-node active" role="tab" aria-selected="true" aria-controls="panel-intake" id="tab-intake" data-phase="intake">
        <span class="timeline-node-dot"></span>
        <span class="timeline-node-label">Intake</span>
      </button>
      <button class="timeline-node" role="tab" aria-selected="false" aria-controls="panel-visit" id="tab-visit" data-phase="visit">
        <span class="timeline-node-dot"></span>
        <span class="timeline-node-label">Clinical Visit</span>
      </button>
      <button class="timeline-node" role="tab" aria-selected="false" aria-controls="panel-surgery" id="tab-surgery" data-phase="surgery">
        <span class="timeline-node-dot"></span>
        <span class="timeline-node-label">Surgery Scheduling</span>
      </button>
      <button class="timeline-node" role="tab" aria-selected="false" aria-controls="panel-pa" id="tab-pa" data-phase="pa">
        <span class="timeline-node-dot"></span>
        <span class="timeline-node-label">Prior Auth</span>
      </button>
      <button class="timeline-node" role="tab" aria-selected="false" aria-controls="panel-rcm" id="tab-rcm" data-phase="rcm">
        <span class="timeline-node-dot"></span>
        <span class="timeline-node-label">RCM</span>
      </button>
    </div>

    <div class="timeline-panels">
      <div class="timeline-panel active" role="tabpanel" id="panel-intake" aria-labelledby="tab-intake">
        <h3>Intake Automation</h3>
        <p>From the moment a referral arrives, Synaipse takes over — gathering records, verifying coverage, and getting the patient on the schedule.</p>
        <ul>
          <li>Referral receipt and processing</li>
          <li>Medical record gathering</li>
          <li>Insurance verification</li>
          <li>Smart scheduling</li>
        </ul>
      </div>
      <div class="timeline-panel" role="tabpanel" id="panel-visit" aria-labelledby="tab-visit" hidden>
        <h3>Clinical Visit Intelligence</h3>
        <p>AI-powered tools that support every moment of the clinical encounter — so providers stay focused on the patient.</p>
        <ul>
          <li>Automated pre-visit patient intake</li>
          <li>Patient summarization &amp; HPI drafting</li>
          <li>Ambient scribing</li>
          <li>Automated E&amp;M coding &amp; billing</li>
        </ul>
      </div>
      <div class="timeline-panel" role="tabpanel" id="panel-surgery" aria-labelledby="tab-surgery" hidden>
        <h3>Surgery Scheduling Assistant</h3>
        <p>A smart assistant that bridges the gap between the surgeon and the OR — collecting the details your clinic note doesn't capture.</p>
        <ul>
          <li>Collects procedure details not in clinic note</li>
          <li>Identifies required supplies, location, and reps</li>
          <li>Assesses urgency level</li>
          <li>Coordinates with secretary to schedule with hospital</li>
        </ul>
      </div>
      <div class="timeline-panel" role="tabpanel" id="panel-pa" aria-labelledby="tab-pa" hidden>
        <h3>Prior Authorization Engine</h3>
        <p>End-to-end prior authorization handled autonomously — from packet assembly to payer submission to status tracking.</p>
        <ul>
          <li>Authorization packet preparation</li>
          <li>Electronic submission to payers</li>
          <li>Real-time status tracking</li>
        </ul>
      </div>
      <div class="timeline-panel" role="tabpanel" id="panel-rcm" aria-labelledby="tab-rcm" hidden>
        <h3>Revenue Cycle Management</h3>
        <p>From operative note to collected payment — the full revenue cycle automated end to end.</p>
        <ul>
          <li>Operative note coding</li>
          <li>Claim preparation, submission, and tracking</li>
          <li>Claim denial management and appeals</li>
          <li>Collections follow-up</li>
        </ul>
      </div>
    </div>

    <div class="timeline-sync-note">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
      <span>Every step syncs bidirectionally with your EHR in real time</span>
    </div>
  </div>
</section>
```

**Step 2: Verify HTML is valid**

Open `index.html` in browser. The timeline section should appear (unstyled) where the journey was.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: replace journey section with horizontal patient timeline

Interactive 5-phase timeline with click-to-expand detail panels
covering intake, clinical visit, surgery scheduling, prior auth,
and RCM."
```

---

### Task 6: Add timeline CSS

**Files:**
- Modify: `styles.css` — replace old `.journey` styles (lines 1332-1485) with new `.timeline` styles

**Step 1: Replace journey CSS with timeline CSS**

Remove the old `.journey` through `.journey-sync-note span` block (lines 1332-1485). Add in its place:

```css
/* ---------- Patient Timeline ---------- */
.timeline {
  padding: 100px 0;
  background: linear-gradient(180deg, var(--slate) 0%, #0f1a26 100%);
  position: relative;
  overflow: hidden;
}

.timeline .section-label {
  color: var(--amber-bright);
}

.timeline .section-title {
  color: var(--white);
}

.timeline .section-sub {
  color: rgba(255,255,255,0.7);
}

/* --- Track (horizontal line + nodes) --- */
.timeline-track {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 800px;
  margin: 48px auto 0;
  padding: 0 20px;
}

.timeline-line {
  position: absolute;
  top: 16px;
  left: 40px;
  right: 40px;
  height: 3px;
  background: rgba(255,255,255,0.15);
  border-radius: 2px;
}

/* --- Node (button) --- */
.timeline-node {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  min-width: 80px;
}

.timeline-node-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  border: 3px solid rgba(255,255,255,0.25);
  transition: all 0.3s ease;
  position: relative;
}

.timeline-node-dot::after {
  content: '';
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  background: transparent;
  transition: background 0.3s ease;
}

.timeline-node.active .timeline-node-dot {
  background: var(--blue-primary);
  border-color: var(--blue-primary);
  box-shadow: 0 0 0 6px rgba(0, 98, 155, 0.25);
}

.timeline-node.active .timeline-node-dot::after {
  background: white;
}

.timeline-node:hover:not(.active) .timeline-node-dot {
  border-color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.15);
}

.timeline-node-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.5);
  transition: color 0.3s ease;
  white-space: nowrap;
}

.timeline-node.active .timeline-node-label {
  color: white;
}

.timeline-node:hover:not(.active) .timeline-node-label {
  color: rgba(255,255,255,0.75);
}

/* --- Pulse animation on active node --- */
@keyframes timeline-pulse {
  0%, 100% { box-shadow: 0 0 0 6px rgba(0, 98, 155, 0.25); }
  50% { box-shadow: 0 0 0 12px rgba(0, 98, 155, 0.1); }
}

.timeline-node.active .timeline-node-dot {
  animation: timeline-pulse 2.5s ease-in-out infinite;
}

/* --- Panels --- */
.timeline-panels {
  max-width: 800px;
  margin: 32px auto 0;
  padding: 0 20px;
  position: relative;
  min-height: 200px;
}

.timeline-panel {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 32px;
  display: none;
}

.timeline-panel.active {
  display: block;
  animation: timeline-panel-in 0.35s ease-out;
}

@keyframes timeline-panel-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.timeline-panel h3 {
  font-family: 'DM Sans', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.timeline-panel p {
  font-size: 15px;
  color: rgba(255,255,255,0.7);
  line-height: 1.7;
  margin-bottom: 20px;
}

.timeline-panel ul {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.timeline-panel ul li {
  font-size: 14px;
  color: rgba(255,255,255,0.85);
  padding-left: 20px;
  position: relative;
}

.timeline-panel ul li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--amber-bright);
}

/* --- Sync note --- */
.timeline-sync-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
  padding: 14px 24px;
  border-radius: 999px;
  background: rgba(232, 168, 56, 0.08);
  border: 1px solid rgba(232, 168, 56, 0.15);
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.timeline-sync-note svg {
  flex-shrink: 0;
  color: var(--amber-bright);
}

.timeline-sync-note span {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
}

/* --- Mobile: stack vertically --- */
@media (max-width: 768px) {
  .timeline-track {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0;
  }

  .timeline-line {
    top: 16px;
    bottom: 16px;
    left: 15px;
    right: auto;
    width: 3px;
    height: auto;
  }

  .timeline-node {
    flex-direction: row;
    gap: 16px;
    padding: 12px 0;
    min-width: 0;
  }

  .timeline-node-dot {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
  }

  .timeline-node-label {
    font-size: 15px;
  }

  .timeline-panels {
    padding: 0;
  }

  .timeline-panel ul {
    grid-template-columns: 1fr;
  }
}

/* --- Reduced motion --- */
@media (prefers-reduced-motion: reduce) {
  .timeline-node.active .timeline-node-dot {
    animation: none;
  }
  .timeline-panel.active {
    animation: none;
  }
}
```

**Step 2: Verify timeline styling**

Open `index.html`. The timeline should show 5 nodes on a horizontal line, with Intake expanded by default. Click each node — the panel should switch.

**Step 3: Commit**

```bash
git add styles.css
git commit -m "style: add horizontal patient timeline styles

Replaces old vertical journey CSS with interactive timeline track,
nodes, panels, glassmorphism cards, mobile vertical stack, and
reduced-motion support."
```

---

### Task 7: Add timeline JavaScript

**Files:**
- Modify: `main.js` — add timeline tab interaction

**Step 1: Add timeline interaction handler**

Inside the `DOMContentLoaded` callback in `main.js`, add after the existing subscribe form validation block (~line 125):

```javascript
/* ---------- Patient Timeline Tabs ---------- */
var timelineTrack = document.querySelector('.timeline-track');
if (timelineTrack) {
  var nodes = timelineTrack.querySelectorAll('.timeline-node');
  var panels = document.querySelectorAll('.timeline-panel');

  timelineTrack.addEventListener('click', function (e) {
    var node = e.target.closest('.timeline-node');
    if (!node || node.classList.contains('active')) return;

    // Deactivate all
    nodes.forEach(function (n) {
      n.classList.remove('active');
      n.setAttribute('aria-selected', 'false');
    });
    panels.forEach(function (p) {
      p.classList.remove('active');
      p.hidden = true;
    });

    // Activate clicked
    node.classList.add('active');
    node.setAttribute('aria-selected', 'true');
    var panelId = node.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    if (panel) {
      panel.hidden = false;
      panel.classList.add('active');
    }
  });

  // Keyboard navigation: arrow keys between tabs
  timelineTrack.addEventListener('keydown', function (e) {
    var nodeArr = Array.from(nodes);
    var currentIndex = nodeArr.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    var newIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      newIndex = (currentIndex + 1) % nodeArr.length;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      newIndex = (currentIndex - 1 + nodeArr.length) % nodeArr.length;
      e.preventDefault();
    } else if (e.key === 'Home') {
      newIndex = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      newIndex = nodeArr.length - 1;
      e.preventDefault();
    }

    if (newIndex !== currentIndex) {
      nodeArr[newIndex].focus();
      nodeArr[newIndex].click();
    }
  });
}
```

**Step 2: Verify interactivity**

Open `index.html`. Click each timeline node — the detail panel should switch. Use arrow keys to navigate between nodes. Verify `aria-selected` toggles in devtools.

**Step 3: Commit**

```bash
git add main.js
git commit -m "feat: add timeline tab interaction with keyboard navigation

Click-to-expand panels, one active at a time, arrow key navigation,
Home/End support, proper ARIA state management."
```

---

### Task 8: Update founder cards on About page

**Files:**
- Modify: `about.html:235-258` (founder cards)

**Step 1: Replace founder card content**

Replace the two `<article class="founder-card">` blocks (lines 236-258) with real names, titles, and bios:

```html
<article class="founder-card">
  <div class="founder-avatar" aria-hidden="true">👨‍⚕️</div>
  <h3 class="founder-name">Soliman Oushy, MD</h3>
  <div class="founder-title">Co-Founder &amp; CEO</div>
  <p class="founder-bio">A cerebrovascular neurosurgeon specializing in brain tumor, cerebrovascular, and spine surgery. Trained at Mayo Clinic, Harvard Medical School / Boston Children's Hospital, and the University of Miami. Currently practicing at Mayfield Brain &amp; Spine in Cincinnati.</p>
  <div class="founder-credentials">
    <span class="founder-credential">Cerebrovascular Surgery</span>
    <span class="founder-credential">MD</span>
    <span class="founder-credential">Mayfield Brain &amp; Spine</span>
  </div>
</article>

<article class="founder-card">
  <div class="founder-avatar" aria-hidden="true">👨‍⚕️</div>
  <h3 class="founder-name">Robert F. James, MD</h3>
  <div class="founder-title">Co-Founder &amp; CTO</div>
  <p class="founder-bio">An ABNS-certified neurovascular surgeon with over 20 years of experience spanning academic and private practice. Trained at Vanderbilt University Medical Center, with a distinguished career across multiple university programs. Currently practicing at Mayfield Brain &amp; Spine in Cincinnati.</p>
  <div class="founder-credentials">
    <span class="founder-credential">Neurovascular Surgery</span>
    <span class="founder-credential">ABNS Certified</span>
    <span class="founder-credential">Mayfield Brain &amp; Spine</span>
  </div>
</article>
```

**Step 2: Update story quote attribution**

In `about.html`, find line 279 and replace:

```html
<!-- OLD -->
<cite>— Synaipse Founders</cite>

<!-- NEW -->
<cite>— Soliman Oushy, MD &amp; Robert F. James, MD</cite>
```

**Step 3: Verify founder cards**

Open `about.html`. Founder cards should show real names, titles, and bios.

**Step 4: Commit**

```bash
git add about.html
git commit -m "content: add real founder names, bios, and credentials

Soliman Oushy, MD (Co-Founder & CEO) and Robert F. James, MD
(Co-Founder & CTO) with customized biographical information."
```

---

### Task 9: Add institution logo row to About page

**Files:**
- Modify: `about.html` — add logo row after `.founders-grid` closing tag (after line 259)
- Modify: `styles.css` — add `.institution-logos` styles

**Step 1: Add institution logos HTML**

After the `</div><!-- .founders-grid -->` closing tag (line 259) and before `</div></section>` (line 260), add:

```html
<div class="institution-logos">
  <p class="institution-logos-label">Trained at Leading Institutions</p>
  <div class="institution-logos-row">
    <!-- Mayo Clinic -->
    <div class="institution-logo" aria-label="Mayo Clinic">
      <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M10 8h4l6 18h.2l6-18h4v24h-3V13.5h-.2L21.2 32h-2.4L13.2 13.5H13V32h-3V8z" fill="currentColor"/>
        <path d="M42 8h3.2l8.8 24h-3.4l-2-6H38.4l-2 6H33L42 8zm-.8 15h8.6L45.5 11.2h-.2L41.2 23z" fill="currentColor"/>
        <path d="M57 23.5L49 8h3.6l5.8 12.2h.2L64.4 8H68l-8 15.5V32h-3V23.5z" fill="currentColor"/>
        <path d="M82 7.5c7.5 0 12 5 12 12.5s-4.5 12.5-12 12.5S70 27.5 70 20s4.5-12.5 12-12.5zm0 22c5.5 0 9-3.8 9-9.5s-3.5-9.5-9-9.5-9 3.8-9 9.5 3.5 9.5 9 9.5z" fill="currentColor"/>
      </svg>
    </div>
    <!-- Harvard Medical School -->
    <div class="institution-logo" aria-label="Harvard Medical School">
      <svg viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="0" y="26" font-family="'DM Sans',sans-serif" font-weight="700" font-size="18" fill="currentColor" letter-spacing="-0.5">Harvard</text>
        <text x="0" y="38" font-family="'DM Sans',sans-serif" font-weight="400" font-size="10" fill="currentColor" letter-spacing="0.5">MEDICAL SCHOOL</text>
      </svg>
    </div>
    <!-- Boston Children's Hospital -->
    <div class="institution-logo" aria-label="Boston Children's Hospital">
      <svg viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="0" y="22" font-family="'DM Sans',sans-serif" font-weight="700" font-size="15" fill="currentColor">Boston Children's</text>
        <text x="0" y="36" font-family="'DM Sans',sans-serif" font-weight="400" font-size="11" fill="currentColor" letter-spacing="0.3">HOSPITAL</text>
      </svg>
    </div>
    <!-- University of Miami -->
    <div class="institution-logo" aria-label="University of Miami">
      <svg viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="0" y="22" font-family="'DM Sans',sans-serif" font-weight="700" font-size="15" fill="currentColor">University of</text>
        <text x="0" y="36" font-family="'DM Sans',sans-serif" font-weight="700" font-size="15" fill="currentColor">Miami</text>
      </svg>
    </div>
    <!-- Vanderbilt -->
    <div class="institution-logo" aria-label="Vanderbilt University Medical Center">
      <svg viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="0" y="22" font-family="'DM Sans',sans-serif" font-weight="700" font-size="16" fill="currentColor" letter-spacing="-0.3">Vanderbilt</text>
        <text x="0" y="36" font-family="'DM Sans',sans-serif" font-weight="400" font-size="9" fill="currentColor" letter-spacing="0.5">UNIVERSITY MEDICAL CENTER</text>
      </svg>
    </div>
  </div>
</div>
```

**Step 2: Add institution logos CSS**

Add to `styles.css` after the `.founder-credential` styles (~line 2235):

```css
/* ---------- Institution Logos ---------- */
.institution-logos {
  margin-top: 56px;
  text-align: center;
}

.institution-logos-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--grey);
  margin-bottom: 28px;
}

.institution-logos-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.institution-logo {
  color: var(--grey);
  opacity: 0.55;
  transition: opacity 0.3s ease;
}

.institution-logo:hover {
  opacity: 0.85;
}

.institution-logo svg {
  height: 36px;
  width: auto;
}

@media (max-width: 768px) {
  .institution-logos-row {
    gap: 24px;
  }
  .institution-logo svg {
    height: 28px;
  }
}
```

**Step 3: Add dark mode overrides**

Inside the dark mode media query:

```css
.institution-logos-label {
  color: rgba(255,255,255,0.5);
}
.institution-logo {
  color: rgba(255,255,255,0.6);
}
.institution-logo:hover {
  color: rgba(255,255,255,0.9);
  opacity: 0.9;
}
```

**Step 4: Verify logos render**

Open `about.html`. Below the founder cards, "Trained at Leading Institutions" label should appear with 5 monochrome logos in a centered row.

**Step 5: Commit**

```bash
git add about.html styles.css
git commit -m "feat: add institution logo row to founders section

Shared credibility row with Mayo Clinic, Harvard Medical School,
Boston Children's Hospital, University of Miami, and Vanderbilt
logos as inline SVGs with hover effects and dark mode support."
```

---

### Task 10: Visual QA and cross-page verification

**Files:**
- Potentially all modified files for small fixes

**Step 1: Check homepage end-to-end**

Open `index.html` in browser:
- [ ] Hero is centered with no browser frame
- [ ] Stats section follows hero
- [ ] Role cards section intact
- [ ] EHR marquee displays correctly
- [ ] Timeline section shows 5 nodes horizontally
- [ ] Clicking each node shows correct detail panel
- [ ] Only one panel shown at a time
- [ ] Intake is expanded by default
- [ ] Arrow keys navigate between timeline nodes
- [ ] Mobile view: timeline stacks vertically
- [ ] Dark mode: all timeline elements visible
- [ ] `prefers-reduced-motion`: no pulse or slide animations

**Step 2: Check Automation Platform page**

Open `automation-platform.html`:
- [ ] Hero shows browser frame mockup
- [ ] 5 feature sections display with icons and bullets
- [ ] Alternating backgrounds work
- [ ] CTA button links to contact
- [ ] Mobile: single column layout
- [ ] Dark mode: all sections readable

**Step 3: Check About page**

Open `about.html`:
- [ ] Founder cards show real names and bios
- [ ] Institution logos row displays below cards
- [ ] Logos are monochrome, hover opacity works
- [ ] Story quote has updated attribution
- [ ] Mobile: logos wrap naturally
- [ ] Dark mode: logos and label visible

**Step 4: Fix any issues found**

Apply targeted fixes. Common issues to watch:
- CSS specificity conflicts (use parent class prefixing as done in Task 8 of nav plan)
- Dark mode color overrides missing
- Mobile breakpoint alignment

**Step 5: Commit fixes if any**

```bash
git add -A
git commit -m "fix: visual QA adjustments for homepage/about update"
```
