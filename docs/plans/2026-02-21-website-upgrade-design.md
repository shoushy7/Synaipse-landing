# Synaipse Landing Page Upgrade — Design Document

**Date:** 2026-02-21
**Status:** Approved
**Inspiration:** Commure RCM page, Stedi homepage

## Goals

1. Make the site feel dynamic and premium (not static/document-like)
2. Strengthen the hero section with a visual element and stronger hook
3. Add product screenshot placeholder slots throughout
4. Add scroll-triggered animations and micro-interactions sitewide
5. Draw inspiration from Commure (product-forward, card sections, logo carousel) and Stedi (glassmorphism, gradient meshes, floating orbs, polish)

## Design Decisions

### Overall Aesthetic
- Keep Synaipse's existing light-mode blue (#00629B) / amber (#E8A838) / slate palette
- Add depth through gradient mesh backgrounds, glassmorphism, and floating decorative elements
- Enhance dark mode with matching improvements
- All animations respect `prefers-reduced-motion`

### 1. Hero Section Redesign
- **Layout:** Split — text left (~55%), product visual placeholder right (~45%)
- **Background:** Animated gradient orbs (blurred circles in blue/amber) floating subtly
- **Badge:** Glassmorphic treatment (backdrop-blur, semi-transparent background)
- **Headline:** Keep current text, add subtle gradient or highlight animation on key words
- **Visual placeholder:** Dark rounded card (matching journey section aesthetic) with placeholder text "Platform Preview Coming Soon" — styled to accept a real screenshot later
- **Entrance animations:** Staggered fade-up on page load (text first, then visual)

### 2. Scroll Animations (Sitewide)
- Use `IntersectionObserver` API — no scroll event listeners
- **Fade-up pattern:** Elements start `opacity: 0; transform: translateY(30px)` and animate to visible when entering viewport
- **Stats section:** Counting animation on numbers (0 -> target) when scrolled into view
- **Role cards:** Staggered entrance (100ms delay between cards)
- **Journey steps:** Sequential reveal with brief delays
- **Comparison columns:** Slide in from left/right respectively
- All animations use CSS transitions triggered by a `.visible` class added via JS

### 3. EHR Integration Strip → Infinite Scroll Marquee
- Replace static flex layout with CSS-animated infinite scroll
- Duplicate vendor list for seamless loop
- Smooth horizontal scroll, pauses on hover
- Respects reduced motion (falls back to static layout)

### 4. Platform Section (Role Cards) Enhancement
- Add image placeholder container at top of each card (dark, rounded, with subtle icon)
- Enhanced hover: lift + deeper shadow + slight scale (1.02)
- `will-change: transform` on hover-targeted elements

### 5. New Section: "Platform Preview"
- Insert between Platform (role cards) and EHR Strip sections
- Full-width dark background (matching journey section gradient)
- Centered large screenshot placeholder in a browser-chrome frame (title bar with dots)
- Floating decorative gradient orbs (Stedi-style, 50px blur, blue/amber, low opacity)
- Caption text below the frame
- Subtle cross-hatch or dot pattern overlay (already used in journey section)

### 6. Navigation Enhancement
- Increase backdrop-filter blur from 12px to 20px
- Add subtle bottom border glow on scroll
- Smoother transition on scroll state change

### 7. Contact Section Polish
- Gradient mesh background (subtle radial gradients)
- Glassmorphic form card (backdrop-blur, semi-transparent border)
- Button hover: add subtle glow effect

### 8. Micro-Interactions
- All buttons: subtle translateY(-2px) + shadow increase on hover (already partially exists)
- Card hover states: smooth lift animation
- Link hover: color transitions (already exists, keep)
- Form focus: amber glow ring (already exists for inputs)

## Technical Approach

- **No new dependencies** — all CSS + vanilla JS
- **Animations via CSS classes** — JS only adds/removes `.visible` class via IntersectionObserver
- **Counter animation** — small JS function for stat counting
- **Marquee** — pure CSS `@keyframes` with `animation` on duplicated content
- **Performance:** `will-change` hints, `transform`/`opacity` only (GPU-composited), `IntersectionObserver` with `rootMargin` for early triggering
- **Accessibility:** All animations wrapped in `prefers-reduced-motion` media queries

## Files Modified

1. `index.html` — Hero restructure, new platform preview section, marquee markup
2. `styles.css` — New animation classes, glassmorphism, gradient meshes, marquee, enhanced hovers
3. `main.js` — IntersectionObserver setup, stat counter, marquee hover-pause

## Out of Scope

- About, Blog, Careers pages (can apply animations later as a follow-up)
- Actual product screenshots (placeholder slots only)
- Dark mode adjustments for new elements (follow-up pass)
- New content/copy changes (keeping existing messaging)
