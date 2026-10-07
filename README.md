# Raahim — Portfolio

Multi-page portfolio site for Raahim, an AI automation engineer. Five pages
(home, work, services, contact, 404) with motion graphics, scroll animation,
and a contact form.

## Stack

- **Astro 7** + **React 19** islands (interactive pieces only)
- **Tailwind CSS 4**
- **GSAP** (scroll reveals, parallax, line draw) — all fail-visible
- **Vanta / Three.js** (hero backgrounds) — skipped under reduced motion
- **Space Grotesk + IBM Plex Sans**, self-hosted via Fontsource
- Icons & graphics: hand-drawn SVG (Phosphor for UI icons), no stock photos

## Run

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve the production build
```

## Notes before launch

- Contact form posts to **Web3Forms** (access key in `src/lib/site.ts` —
  public by design; submissions email you and appear in the Web3Forms
  dashboard).
- Replace placeholders: LinkedIn URL in `src/lib/site.ts`, and the
  domain in `astro.config.mjs` + `public/robots.txt` (currently
  `example.com`).
