# Homepage & About Page Update — Design Document

**Date:** 2026-02-21
**Status:** Approved

## Overview

Three coordinated changes to the Synaipse landing site:

1. **Move product interface displays** from homepage to a full Automation Platform product page
2. **Replace the Patient Journey section** with an interactive horizontal click-to-expand timeline
3. **Add real founder bios and institution logos** to the About page

## Change 1: Product Interface Migration

### What moves off the homepage

- **Hero visual frame** (browser chrome mockup with floating stat badges)
- **Platform Preview section** (full-width browser frame with "Coming Soon")

The homepage hero retains its headline, subtext, CTA buttons, and EHR marquee.

### What the Automation Platform page becomes

Replace `automation-platform.html` placeholder with a full product page:

1. **Hero** — Headline + subtext + moved browser frame mockup
2. **5 Feature Sections** — One per workflow phase, alternating left/right layout:
   - Intake Automation
   - Clinical Visit Intelligence
   - Surgery Scheduling Assistant
   - Prior Authorization Engine
   - Revenue Cycle Management
3. **CTA** — "Request Demo" linking to contact section

Each feature section has an icon, title, short description, and bullet-point sub-items.

## Change 2: Interactive Horizontal Patient Timeline

### Replaces

The current vertical 3-phase "Patient Journey Automated From Referral to Revenue" section in `index.html`.

### Interaction model

- **Click-to-expand cards**: clicking a phase node expands a detail panel below the timeline. One phase open at a time.
- First phase (Intake) auto-expanded on page load.

### Desktop layout (>768px)

```
  Intake ——— Visit ——— Surgery ——— PA ——— RCM
    ●          ○          ○        ○       ○
              ▼
  ┌──────────────────────────────────────────┐
  │  Clinical Visit                          │
  │  • Automated pre-visit patient intake    │
  │  • Patient summarization / HPI drafting  │
  │  • Ambient scribing                      │
  │  • Automated E&M coding / billing        │
  └──────────────────────────────────────────┘
```

### Mobile layout (<768px)

Stacks vertically as an accordion (same pattern as mobile nav).

### 5 Phases

| Phase | Sub-items |
|-------|-----------|
| Intake | Referral, Record Gathering, Insurance Verification, Scheduling |
| Clinical Visit | Pre-visit Patient Intake, Patient Summarization/HPI Drafting, Ambient Scribing, E&M Coding/Billing |
| Surgery Scheduling | Procedure detail collection, Supplies/location/reps, Urgency assessment, Secretary coordination |
| Prior Authorization | Packet Prep, Submission, Tracking |
| RCM | Operative Note Coding, Claim Prep/Submission/Tracking, Denial Management, Collections |

### Styling

- Active node: `--blue-primary` with subtle pulse animation
- Inactive nodes: `--grey`
- Detail card: glassmorphism background (matches existing card patterns)
- Connecting line segments between nodes
- Scroll-reveal animation via existing IntersectionObserver

### Accessibility

- `role="tablist"` on timeline container
- `role="tab"` on phase nodes with `aria-selected`
- `role="tabpanel"` on detail cards with `aria-hidden`
- Keyboard navigation: arrow keys between tabs, Enter/Space to activate
- `prefers-reduced-motion` disables pulse and slide animations

## Change 3: Founders & Institution Logos

### Founder cards

**Soliman Oushy, MD** — Co-Founder & CEO
- Board-eligible neurosurgeon specializing in cerebrovascular, brain tumor, and spine surgery
- Trained at Mayo Clinic (residency + neuroendovascular fellowship), Harvard Medical School/Boston Children's Hospital (pediatric cerebrovascular fellowship), University of Miami (cerebrovascular fellowship)
- Currently at Mayfield Brain & Spine, Cincinnati

**Robert F. James, MD** — Co-Founder & CTO
- ABNS-certified neurovascular surgeon with 20+ years of experience
- Trained at Vanderbilt University Medical Center (open cerebrovascular and endovascular fellowship)
- Academic career spanning East Carolina, Louisville, and Indiana University
- Currently at Mayfield Brain & Spine, Cincinnati

### Institution logo row

Below both founder cards, a shared credibility row:
- Label: "Trained at Leading Institutions"
- 5 monochrome inline SVG logos in a centered row:
  - Mayo Clinic
  - Harvard Medical School
  - Boston Children's Hospital
  - University of Miami
  - Vanderbilt University
- Subtle opacity hover effect
- Responsive: wraps on mobile

### Story quote

Update attribution from "— Synaipse Founders" to "— Soliman Oushy, MD & Robert James, MD"

## Technical Constraints

- No new dependencies — vanilla HTML/CSS/JS only
- Timeline JS follows existing accordion patterns (click toggle, one-open-at-a-time)
- Institution logos as inline SVGs (no image files)
- All new elements get `reveal` classes for scroll animation
- Dark mode support for all new components
- `prefers-reduced-motion` respected throughout
