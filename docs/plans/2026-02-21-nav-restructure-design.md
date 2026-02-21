# Navigation Restructure & Placeholder Pages — Design Doc

**Date:** 2026-02-21
**Status:** Approved

## Goal

Replace the flat nav (Platform, About, Blog, Careers, Request Demo) with a structured dropdown navigation containing 5 top-level items, 3 of which have dropdown sub-menus. Create 10 new placeholder pages for the sub-items that don't have pages yet.

## Navigation Structure

```
[Logo]  [Company ▾]  [Products ▾]  [Resources ▾]  [Careers]  [Contact]  [Request Demo]
```

### Company (dropdown)
- About Us → `about.html` (existing)
- Customers → `customers.html` (new)
- Partnerships → `partnerships.html` (new)
- Clinical Advisory Board → `advisory-board.html` (new)

### Products (dropdown)
- Synaipse Automation Platform → `automation-platform.html` (new)
- Ambient Scribe → `ambient-scribe.html` (new)
- Synaipse Credentialing → `credentialing.html` (new)

### Resources (dropdown)
- Blog → `blog.html` (existing)
- Customer Testimonials → `testimonials.html` (new)
- News → `news.html` (new)
- Media → `media.html` (new)
- Investors → `investors.html` (new)

### Careers (direct link)
→ `careers.html` (existing)

### Contact (direct link)
→ `index.html#contact` (existing section on homepage)

### Request Demo (CTA button)
→ `index.html#contact`

## Dropdown Behavior

### Desktop
- **Trigger:** CSS `:hover` + `:focus-within` on the parent `.nav-item`
- **Animation:** `opacity 0→1` + `translateY(-8px → 0)` over 200ms (matches existing reveal system easing)
- **Panel:** Positioned `absolute` below the trigger, styled with glassmorphism (matching the nav's backdrop-filter aesthetic)
- **Accessibility:** `:focus-within` ensures keyboard users can tab into dropdowns. `aria-haspopup="true"` on triggers.

### Mobile (< 640px)
- **Trigger:** Tap/click on top-level item toggles `.open` class
- **Behavior:** Accordion — expanding one dropdown closes others
- **Arrow indicator:** Chevron rotates 180° when open
- **JS:** Small addition to existing mobile menu handler in `main.js`

## Placeholder Page Template

Each new page follows this structure:
1. Same `<head>` as other pages (SEO meta, charset, viewport, shared CSS)
2. Same `<nav>` with updated dropdown markup
3. Same mobile menu with updated accordion markup
4. Hero section: page title + one-line subtitle
5. Content area: "Coming Soon" message + CTA to contact
6. Same `<footer>` as other pages

Uses existing CSS classes exclusively — no new page-specific styles needed.

## Files

### Modified (4)
- `index.html` — nav markup, mobile menu markup
- `about.html` — nav markup, mobile menu markup
- `blog.html` — nav markup, mobile menu markup
- `careers.html` — nav markup, mobile menu markup

### Modified (2)
- `styles.css` — dropdown CSS (`.nav-item`, `.nav-dropdown`, animation, mobile accordion)
- `main.js` — mobile accordion toggle logic

### Created (10)
- `customers.html`
- `partnerships.html`
- `advisory-board.html`
- `automation-platform.html`
- `ambient-scribe.html`
- `credentialing.html`
- `testimonials.html`
- `news.html`
- `media.html`
- `investors.html`

## Design Decisions

1. **CSS-only dropdowns over JS:** No click-outside handling needed, simpler, more performant. `:focus-within` handles keyboard accessibility natively.
2. **Glassmorphism dropdown panels:** Consistent with nav's existing `backdrop-filter: blur(20px)` treatment.
3. **Accordion mobile menu over nested slide:** Simpler UX, less JS, works within existing mobile menu structure.
4. **Placeholder pages over empty stubs:** Each page has enough content to feel intentional, not broken.
5. **Contact stays as homepage section:** Avoids creating another page for content that works well in-context.
