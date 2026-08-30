# MERIDIAN — The Anatomy of Time

A premium, scroll-driven storytelling website for a fictional Swiss watchmaking maison
(**Maison Meridian**, Genève, est. 1847). A single cinematic page told in six chapters:

| Chapter | Effect |
|---|---|
| Prologue | Preloader with 0000→2026 counter, word-mask title reveal, Ken Burns hero, scroll parallax |
| I — The Foundry | Sticky two-column editorial, drop cap, parallax archive photography, pull quote |
| II — The Craft | Pinned, stacked full-screen steps that slide over one another (guilloché → polishing → assembly → observation) |
| III — The Movement | Animated SVG dial with live hands, count-up spec counters |
| IV — The Ledger | Horizontal scroll timeline of 179 years with gold progress rule |
| V — The Collection | Showroom cards with slow hover zoom |
| VI — Epilogue | CTA with magnetic button, form state, footer |

Global touches: Lenis smooth scroll, custom two-part cursor with context labels, film-grain overlay,
scramble-decode chapter labels, marquee strips, right-hand chapter rail, `mix-blend-difference` nav,
`prefers-reduced-motion` support.

## Stack

- [Vite](https://vitejs.dev/) + React 18
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (scroll transforms, reveals)
- [Lenis](https://github.com/darkroomengineering/lenis) (smooth scroll)
- Cormorant Garamond / Inter / Space Grotesk via Google Fonts

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

Meridian is a fictional house created as a design study.
