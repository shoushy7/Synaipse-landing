# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Static marketing site for Synaipse (physician-led healthcare automation).
- **No build system, no framework, no package.json** — vanilla HTML/CSS/JS only
- Deployed on Vercel; live at `https://synaipse.org`
- Push to `main` → Vercel auto-deploys

## Local Preview
```bash
npx serve -p 3000 .
```
Or use the configured launch profile: `/preview start static-server`

Note: `.reveal*` elements are `opacity:0` until IntersectionObserver fires — if previewing via screenshot tooling, inject:
```js
document.head.insertAdjacentHTML('beforeend','<style>.reveal,.reveal-left,.reveal-right,.reveal-scale{opacity:1!important;transform:none!important;}</style>')
```

## File Structure
```
index.html + 21 other pages   # see list below
styles.css                     # single stylesheet (~9,500+ lines)
main.js                        # single shared JS file (~235 lines)
vercel.json                    # security headers (CSP, X-Frame-Options, etc.)
sitemap.xml / robots.txt       # SEO
images/                        # logos, founder photos
```

**22 HTML pages:** `index`, `about`, `advisory-board`, `ambient-scribe`, `automation-platform`, `blog`, `careers`, `claim-journey`, `credentialing`, `customers`, `day-in-the-life`, `denial-explorer`, `health-score`, `investors`, `media`, `news`, `partnerships`, `pricing`, `resources`, `roi-calculator`, `testimonials`, `trust`

## CSS Architecture
All styles live in `styles.css` — no separate files, no preprocessor.

CSS custom properties (defined in `:root`):
```css
--blue-primary: #00629B
--blue-light:   #2E8BC0
--blue-deep:    #003D5C
--amber:        #C48A1A
--teal:         #0D9488
--slate:        #1A2332
```
- Dark mode: `prefers-color-scheme: dark` media query + `.dark-section` utility class
- Scroll-reveal animation classes: `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale`
- BEM-adjacent naming: `.hero`, `.hero-content`, `.hero-actions`

**CSS cascade gotcha:** The early `@media (prefers-color-scheme: dark)` block at the top of `styles.css` is overridden by base rules defined later in the file. When adding dark mode overrides, always add a second `@media` block *after* the relevant base rules, not only in the early block.

## Key Component Patterns
| Component | Classes | Used in |
|---|---|---|
| Split feature section | `.pf-split`, `.pf-split--reverse`, `.pf-visual`, `.pf-content`, `.pf-mockup`, `.pf-chips`, `.pf-chip`, `.pf-step` | `automation-platform.html` |
| CSS UI mockups | `.role-card-ui`, `.rcu-*` | `index.html` role cards |
| Comparison table | `.comparison-table`, `.comparison-row`, `.cmp-cell--before/after`, `.cmp-x`, `.cmp-check`, `.cmp-arrow` | `index.html` before/after section |

`.pf-split--reverse` uses `direction: rtl` on the grid to visually flip column order without changing HTML source order (preserves screen-reader and tab order).

## JavaScript Patterns (`main.js`)
Everything wrapped in an IIFE: `(function() { 'use strict'; ... })()` — no external libraries.

| Feature | Key classes / attributes |
|---|---|
| Mobile menu | `.mobile-menu-btn` toggles `.mobile-menu.open`; `aria-expanded` managed |
| Mobile nav accordion | `.mobile-nav-group` / `.mobile-nav-group-trigger` |
| Nav scroll state | `.scrolled` added to `<nav>` after 20px scroll |
| Scroll reveal | IntersectionObserver on `.reveal*`; respects `prefers-reduced-motion` |
| Stat counters | `data-target`, `data-prefix`, `data-suffix` attributes on number elements |
| Timeline tabs | `.timeline-node`, `.timeline-panel`, `aria-controls`, `aria-selected`; arrow-key nav (`automation-platform.html`) |
| Form validation | `.contact-form` / `.subscribe-form`; `.invalid` on `.form-group` |

## ⚠️ Nav & Footer: Manually Repeated
**There is no templating system.** Nav and footer HTML are copy-pasted across all 22 pages.

When updating nav or footer, **every HTML file must be updated**.

Current nav groups:
- **Company** (3 items): About Us, Partnerships, Trust & Security
- **Products** (4 items): Automation Platform, Credentialing, Ambient Scribe (Coming Soon), Pricing
- **Resources** (4 items): Knowledge Base, News, Media, Investors
- **Tools** (3 items): ROI Calculator, Denial Code Explorer, Practice Health Score
- Plus standalone: Careers, Contact, Request Demo (CTA)

Note: `customers.html` and `testimonials.html` exist but are **not linked in the nav**.

Active page: set `aria-current="page"` on the correct `<a>` tag.

## Adding a New Page
1. Copy an existing page (e.g., `about.html`) as a starting template
2. Update all `<head>` meta tags: title, description, `og:*`, `twitter:*`, canonical URL
3. Update JSON-LD structured data
4. Set `aria-current="page"` on the correct nav link in the new page
5. Add the new URL to `sitemap.xml`
6. Add a nav link on **all 22 existing pages**

## SEO Conventions
Every page must have: title tag, meta description, `og:*`, `twitter:card`, canonical link, JSON-LD.
- `index.html`: Organization + WebSite JSON-LD
- Product pages: SoftwareApplication JSON-LD
- One `<h1>` per page; descriptive alt text on all images

## Forms
- Submission: Formspree (`action="https://formspree.io/f/{id}"`)
- Client-side validation runs in `main.js` before submission
- Error state: add `.invalid` class to `.form-group` wrappers

## Deployment & Security
- Push to `main` → Vercel auto-deploys (no manual step needed)
- Security headers in `vercel.json` — **do not remove or weaken the CSP**
- If adding a new external resource (font, script, API endpoint), update `connect-src` / `script-src` / `style-src` in `vercel.json`

## Accessibility
- Keyboard nav: Escape closes mobile menu, focus returned to toggle button
- Timeline tabs: arrow keys navigate between tabs
- `aria-expanded` on mobile menu toggle; `aria-current="page"` on active nav link
- `prefers-reduced-motion` respected — scroll animations disabled when set
