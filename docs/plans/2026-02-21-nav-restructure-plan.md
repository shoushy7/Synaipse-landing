# Navigation Restructure & Placeholder Pages — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace flat nav links with hover-dropdown navigation (Company, Products, Resources, Careers, Contact) and create 10 placeholder pages for new sub-items.

**Architecture:** CSS-only hover dropdowns on desktop using `:hover`/`:focus-within`. JS accordion on mobile. Each new page uses a shared placeholder template with hero + coming-soon content. All pages share the same nav/footer markup.

**Tech Stack:** HTML5, CSS3 (`backdrop-filter`, `:focus-within`, CSS transitions), vanilla JavaScript (accordion toggle)

**Reference Design Doc:** `docs/plans/2026-02-21-nav-restructure-design.md`

---

## Task 1: Dropdown CSS — Desktop & Mobile Styles

**Files:**
- Modify: `styles.css` (after `.nav-cta:hover` block, around line 358)

**Step 1: Add desktop dropdown CSS**

Insert this CSS after the `.nav-cta:hover` closing brace (line ~358) and before the `/* Mobile menu overlay */` comment:

```css
/* ---------- Nav Dropdowns ---------- */
.nav-item {
  position: relative;
}

.nav-item > .nav-item-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--grey);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;
  cursor: default;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
}

.nav-item > .nav-item-trigger:hover,
.nav-item:hover > .nav-item-trigger,
.nav-item:focus-within > .nav-item-trigger {
  color: var(--blue-primary);
}

.nav-item-chevron {
  width: 12px;
  height: 12px;
  transition: transform 0.2s;
}

.nav-item:hover .nav-item-chevron,
.nav-item:focus-within .nav-item-chevron {
  transform: rotate(180deg);
}

.nav-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  min-width: 220px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s, transform 0.2s;
  z-index: 1001;
}

.nav-item:hover > .nav-dropdown,
.nav-item:focus-within > .nav-dropdown {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}

.nav-dropdown a {
  display: block;
  padding: 10px 14px;
  color: var(--slate);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.nav-dropdown a:hover {
  background: var(--blue-pale);
  color: var(--blue-primary);
}
```

**Step 2: Add dark mode overrides for dropdown**

Add inside the `@media (prefers-color-scheme: dark)` block (after the existing `nav` rule):

```css
  .nav-dropdown {
    background: rgba(15, 20, 25, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }

  .nav-dropdown a {
    color: #E8ECF0;
  }

  .nav-dropdown a:hover {
    background: rgba(0, 98, 155, 0.2);
    color: #fff;
  }
```

**Step 3: Add mobile accordion CSS**

Add after the `.mobile-menu .mobile-cta` block (around line 418):

```css
/* Mobile dropdown accordion */
.mobile-nav-group {
  border-bottom: 1px solid var(--border);
}

.mobile-nav-group-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: var(--grey);
  font-size: 16px;
  font-weight: 500;
  padding: 12px 0;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
}

.mobile-nav-group-trigger:hover {
  color: var(--blue-primary);
}

.mobile-nav-group-chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.25s;
  color: var(--grey-light);
}

.mobile-nav-group.open .mobile-nav-group-chevron {
  transform: rotate(180deg);
}

.mobile-nav-group-items {
  display: none;
  padding: 0 0 8px 16px;
  flex-direction: column;
  gap: 0;
}

.mobile-nav-group.open .mobile-nav-group-items {
  display: flex;
}

.mobile-nav-group-items a {
  font-size: 15px;
  padding: 8px 0;
  border-bottom: none;
}
```

**Step 4: Hide nav-links on mobile, show dropdowns**

In the `@media (max-width: 640px)` block, the existing `.nav-links { display: none; }` already handles desktop dropdown hiding. No change needed.

**Step 5: Commit**

```bash
git add styles.css
git commit -m "feat: add dropdown and mobile accordion CSS"
```

---

## Task 2: Update Nav HTML — Desktop Dropdowns

**Files:**
- Modify: `index.html` (lines 100-106, the `.nav-links` div)

**Step 1: Replace the nav-links content**

Replace the entire `.nav-links` div (lines 100-106) with:

```html
      <div class="nav-links">
        <div class="nav-item">
          <button class="nav-item-trigger" aria-haspopup="true">
            Company
            <svg class="nav-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="nav-dropdown">
            <a href="about.html">About Us</a>
            <a href="customers.html">Customers</a>
            <a href="partnerships.html">Partnerships</a>
            <a href="advisory-board.html">Clinical Advisory Board</a>
          </div>
        </div>
        <div class="nav-item">
          <button class="nav-item-trigger" aria-haspopup="true">
            Products
            <svg class="nav-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="nav-dropdown">
            <a href="automation-platform.html">Synaipse Automation Platform</a>
            <a href="ambient-scribe.html">Ambient Scribe</a>
            <a href="credentialing.html">Synaipse Credentialing</a>
          </div>
        </div>
        <div class="nav-item">
          <button class="nav-item-trigger" aria-haspopup="true">
            Resources
            <svg class="nav-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="nav-dropdown">
            <a href="blog.html">Blog</a>
            <a href="testimonials.html">Customer Testimonials</a>
            <a href="news.html">News</a>
            <a href="media.html">Media</a>
            <a href="investors.html">Investors</a>
          </div>
        </div>
        <a href="careers.html">Careers</a>
        <a href="#contact">Contact</a>
        <a href="#contact" class="nav-cta">Request Demo</a>
      </div>
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add dropdown nav structure to index.html"
```

---

## Task 3: Update Mobile Menu HTML — Accordion Groups

**Files:**
- Modify: `index.html` (lines 113-120, the `.mobile-menu` div)

**Step 1: Replace mobile menu content**

Replace the entire mobile menu div with:

```html
  <!-- Mobile Menu -->
  <div class="mobile-menu" id="mobile-menu" role="navigation" aria-label="Mobile navigation">
    <div class="mobile-nav-group">
      <button class="mobile-nav-group-trigger" aria-expanded="false">
        Company
        <svg class="mobile-nav-group-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="mobile-nav-group-items">
        <a href="about.html">About Us</a>
        <a href="customers.html">Customers</a>
        <a href="partnerships.html">Partnerships</a>
        <a href="advisory-board.html">Clinical Advisory Board</a>
      </div>
    </div>
    <div class="mobile-nav-group">
      <button class="mobile-nav-group-trigger" aria-expanded="false">
        Products
        <svg class="mobile-nav-group-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="mobile-nav-group-items">
        <a href="automation-platform.html">Synaipse Automation Platform</a>
        <a href="ambient-scribe.html">Ambient Scribe</a>
        <a href="credentialing.html">Synaipse Credentialing</a>
      </div>
    </div>
    <div class="mobile-nav-group">
      <button class="mobile-nav-group-trigger" aria-expanded="false">
        Resources
        <svg class="mobile-nav-group-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="mobile-nav-group-items">
        <a href="blog.html">Blog</a>
        <a href="testimonials.html">Customer Testimonials</a>
        <a href="news.html">News</a>
        <a href="media.html">Media</a>
        <a href="investors.html">Investors</a>
      </div>
    </div>
    <a href="careers.html">Careers</a>
    <a href="#contact">Contact</a>
    <a href="#contact" class="mobile-cta">Request Demo</a>
  </div>
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add accordion mobile menu to index.html"
```

---

## Task 4: Mobile Accordion JS

**Files:**
- Modify: `main.js` (inside the DOMContentLoaded handler, after mobile menu close-on-link-click)

**Step 1: Add accordion toggle logic**

Add this after the `// Close menu on Escape key` block (after the closing `});` of the escape handler, around line 38) inside the `if (menuBtn && mobileMenu)` block:

```javascript
      // Mobile accordion toggle
      mobileMenu.querySelectorAll('.mobile-nav-group-trigger').forEach(function (trigger) {
        trigger.addEventListener('click', function () {
          var group = trigger.closest('.mobile-nav-group');
          var wasOpen = group.classList.contains('open');

          // Close all other groups
          mobileMenu.querySelectorAll('.mobile-nav-group.open').forEach(function (g) {
            g.classList.remove('open');
            g.querySelector('.mobile-nav-group-trigger').setAttribute('aria-expanded', 'false');
          });

          // Toggle this group
          if (!wasOpen) {
            group.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
      });
```

**Step 2: Commit**

```bash
git add main.js
git commit -m "feat: add mobile accordion toggle JS"
```

---

## Task 5: Update Existing Pages Nav — about.html, blog.html, careers.html

**Files:**
- Modify: `about.html` (nav-links + mobile-menu sections)
- Modify: `blog.html` (nav-links + mobile-menu sections)
- Modify: `careers.html` (nav-links + mobile-menu sections)

**Step 1: Update each page**

For each of the 3 existing pages, replace the `<div class="nav-links">...</div>` and the `<div class="mobile-menu" ...>...</div>` with the SAME markup as Task 2 and Task 3, EXCEPT:

- All `href` values that are anchor-only (e.g. `#contact`, `#platform`) must be prefixed with `index.html` (e.g. `index.html#contact`)
- The `nav-cta` href becomes `index.html#contact`
- The `mobile-cta` href becomes `index.html#contact`

This is the same pattern already used in the existing `about.html` nav (which has `index.html#platform`, `index.html#contact`).

**Step 2: Commit**

```bash
git add about.html blog.html careers.html
git commit -m "feat: update nav dropdowns on about, blog, careers pages"
```

---

## Task 6: Create Placeholder Page Template

**Files:**
- Create: `customers.html` (first placeholder page, used as the template pattern)

**Step 1: Create customers.html**

Use this full template. Note: the nav/mobile-menu markup is IDENTICAL to about.html (with `index.html#contact` hrefs). The page-specific parts are: `<title>`, meta description, hero title, hero subtitle, and the coming-soon message.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO Meta Tags -->
  <title>Customers | Synaipse</title>
  <meta name="description" content="See how healthcare practices are transforming their operations with Synaipse.">
  <meta name="author" content="Synaipse Inc.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://synaipse.org/customers">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://synaipse.org/customers">
  <meta property="og:title" content="Customers | Synaipse">
  <meta property="og:description" content="See how healthcare practices are transforming their operations with Synaipse.">
  <meta property="og:image" content="https://synaipse.org/og-image.png">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

  <!-- Shared Stylesheet -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <a class="skip-link" href="#main">Skip to main content</a>

  <!-- Navigation (SAME as index.html, with index.html# prefixed hrefs) -->
  [EXACT NAV MARKUP FROM TASK 2 WITH index.html# PREFIXED HREFS]

  <!-- Mobile Menu (SAME as index.html, with index.html# prefixed hrefs) -->
  [EXACT MOBILE MENU MARKUP FROM TASK 3 WITH index.html# PREFIXED HREFS]

  <!-- Page Hero -->
  <section class="about-hero" id="main">
    <div class="container">
      <div class="about-hero-content">
        <h1>Customers</h1>
        <p class="about-hero-sub">See how healthcare practices are transforming their operations with Synaipse.</p>
      </div>
    </div>
  </section>

  <!-- Coming Soon -->
  <section class="platform" style="min-height: 40vh;">
    <div class="container" style="text-align: center; padding: 80px 0;">
      <p style="font-size: 18px; color: var(--grey); margin-bottom: 32px;">This page is coming soon. In the meantime, we'd love to tell you about our customers.</p>
      <a href="index.html#contact" class="btn-primary">
        Get in Touch
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </div>
  </section>

  <!-- Footer (SAME as about.html) -->
  [EXACT FOOTER MARKUP FROM about.html]

  <script>
    window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/speed-insights/script.js"></script>
  <script defer src="main.js"></script>

</body>
</html>
```

**Step 2: Commit**

```bash
git add customers.html
git commit -m "feat: add customers placeholder page"
```

---

## Task 7: Create Remaining 9 Placeholder Pages

**Files:**
- Create: `partnerships.html`
- Create: `advisory-board.html`
- Create: `automation-platform.html`
- Create: `ambient-scribe.html`
- Create: `credentialing.html`
- Create: `testimonials.html`
- Create: `news.html`
- Create: `media.html`
- Create: `investors.html`

**Step 1: Create each page using the customers.html template**

Each page is identical to `customers.html` except for these fields:

| File | Title | Meta description | Hero h1 | Hero subtitle | Coming-soon message |
|------|-------|-----------------|---------|---------------|-------------------|
| partnerships.html | Partnerships \| Synaipse | Partner with Synaipse to bring AI automation to healthcare practices. | Partnerships | Partner with Synaipse to bring AI-powered automation to healthcare practices nationwide. | We're building strategic partnerships across healthcare. |
| advisory-board.html | Clinical Advisory Board \| Synaipse | Meet the physicians and healthcare leaders guiding Synaipse's product development. | Clinical Advisory Board | Meet the physicians and healthcare leaders guiding our product development. | Our advisory board page is being prepared. |
| automation-platform.html | Synaipse Automation Platform \| Synaipse | The AI-powered practice management platform that replaces your entire workflow stack. | Synaipse Automation Platform | The AI-powered platform that replaces your entire workflow stack in a single browser tab. | Detailed product information is coming soon. |
| ambient-scribe.html | Ambient Scribe \| Synaipse | AI-powered ambient clinical documentation that captures, codes, and documents encounters automatically. | Ambient Scribe | AI-powered ambient clinical documentation that captures, codes, and documents encounters automatically. | Detailed product information is coming soon. |
| credentialing.html | Synaipse Credentialing \| Synaipse | Automated provider credentialing and enrollment that eliminates manual paperwork. | Synaipse Credentialing | Automated provider credentialing and enrollment that eliminates manual paperwork. | Detailed product information is coming soon. |
| testimonials.html | Customer Testimonials \| Synaipse | Hear from healthcare practices using Synaipse to transform their operations. | Customer Testimonials | Hear from healthcare practices using Synaipse to transform their operations. | Customer stories are being collected. |
| news.html | News \| Synaipse | Latest news and announcements from Synaipse. | News | Latest news and announcements from Synaipse. | Our news page is being prepared. |
| media.html | Media \| Synaipse | Press resources, brand assets, and media inquiries for Synaipse. | Media | Press resources, brand assets, and media inquiries. | Our media kit is being prepared. |
| investors.html | Investors \| Synaipse | Investment information and updates for Synaipse stakeholders. | Investors | Investment information and updates for Synaipse stakeholders. | Investor information is coming soon. |

Each page also needs the correct `<link rel="canonical">` and Open Graph URLs updated to match (e.g. `https://synaipse.org/partnerships`).

**Step 2: Commit**

```bash
git add partnerships.html advisory-board.html automation-platform.html ambient-scribe.html credentialing.html testimonials.html news.html media.html investors.html
git commit -m "feat: add 9 remaining placeholder pages"
```

---

## Task 8: Visual QA & Final Fixes

**Files:**
- Possibly modify: `styles.css` (any visual tweaks found during QA)

**Step 1: Desktop QA**

Open `index.html` in a browser. Verify:
- Hovering over Company, Products, Resources shows dropdown panels
- Dropdown panels appear below the trigger, centered, with glassmorphism background
- Clicking dropdown links navigates to the correct pages
- Each placeholder page loads with hero + coming-soon content
- Nav on placeholder pages works (dropdowns, links)
- Careers and Contact links work (direct, no dropdown)
- Request Demo CTA button still works

**Step 2: Mobile QA (< 640px)**

Resize to mobile width. Verify:
- Hamburger menu opens mobile menu
- Company, Products, Resources show as accordion triggers
- Tapping expands children, tapping again collapses
- Expanding one group closes the other
- Careers and Contact show as direct links
- All links navigate correctly

**Step 3: Dark mode QA**

Toggle system theme to dark. Verify:
- Dropdown panels have dark background
- Links are readable
- Accordion items are readable

**Step 4: Fix any issues found, then commit**

```bash
git add -A
git commit -m "fix: visual QA adjustments for nav dropdowns"
```

---

## Summary

| Task | What it does |
|------|-------------|
| 1 | Dropdown + accordion CSS (desktop hover, mobile toggle, dark mode) |
| 2 | Desktop nav HTML with dropdown structure |
| 3 | Mobile menu HTML with accordion groups |
| 4 | Mobile accordion toggle JS |
| 5 | Update nav on about.html, blog.html, careers.html |
| 6 | Create first placeholder page (customers.html as template) |
| 7 | Create remaining 9 placeholder pages |
| 8 | Visual QA and final fixes |
