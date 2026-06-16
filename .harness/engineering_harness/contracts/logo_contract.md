# Feature Contract: Seliabot Brand Logo Integration

This contract defines the deliverables, design specifications, and verification metrics required to upgrade Seliabot's brand assets to a professional-grade, high-fidelity SVG brand identity.

---

## 1. Scope & Deliverables

### 1.1. Vector Brand Assets
- **Asset [landing-page/favicon.svg](landing-page/favicon.svg)**: Create a new custom high-fidelity SVG. It must feature Seliabot's distinctive brand gradient (from `#6C5CE7` to `#00D2FF`) with a futuristic, clean geometric "S" logo that scales perfectly down to a 16x16 browser icon.
- **Asset [platform-dashboard/public/favicon.svg](platform-dashboard/public/favicon.svg)**: Deploy the exact same design to the Dashboard's public folder to ensure brand synchronization.

### 1.2. Landing Page Navigation Branding
- **Navbar Integration**: Inline the beautiful new logo SVG directly into the main navbar header across:
  - [landing-page/index.html](landing-page/index.html)
  - [landing-page/es/index.html](landing-page/es/index.html)
  - [landing-page/es/medicos/index.html](landing-page/es/medicos/index.html)
- **CSS Style Updates**: Re-style the `.nav-logo-icon` class in [landing-page/styles/main.css](landing-page/styles/main.css) so that the new SVG has perfect alignment, spacing, hover glow effects, and transitions.

---

## 2. Verification Metrics (Definition of Done)

- **Legibility**: The logo mark must be sharp and legible at various resolutions:
  - Favicon size ($16 \times 16$ and $32 \times 32$ pixels).
  - Navigation size ($36 \times 36$ pixels).
  - Open Graph large display ($1200 \times 630$ pixels).
- **Responsive Layout**: The logo must not cause layout shifts on mobile or desktop navigation blocks.
- **Zero Console Errors**: Serves cleanly with no XML or markup errors.
