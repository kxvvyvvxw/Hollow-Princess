🗡️ Hollow Princess — Scroll-Driven UI Concept

[![Status: Concept](https://img.shields.io/badge/status-concept-blueviolet.svg)](https://github.com/daw99y/paranoid) [![Type: UI%2FUX%20Prototype](https://img.shields.io/badge/type-UI%2FUX%20prototype-333333.svg)](https://github.com/daw99y/paranoid)

![Hollow Princess preview](./public/images/hollow-princess-readme.png)

## Status

- Conceptual UI prototype centered on storytelling, not a shipping product.
- No backend logic, commerce systems, or gameplay features are included.
- All flows (CTAs, downloads, pricing hints) are placeholders for illustration.
- Spline scenes are static, optimized for a narrative showcase.

## Overview

Hollow Princess imagines a fashion-tech capsule site where lore, product, and motion merge into a single scroll journey. Responsive 3D scenes, camera-tied transitions, and glassy UI elements combine to deliver an immersive but non-functional experience.

This is strictly a modern Next.js front-end exploration; no inventory, shopping carts, or live data feeds are part of the concept.

## Features

- Cinematic scroll behavior driven by Spline scenes at precise breakpoints.
- Sectioned storytelling with white “chapter” interludes between scenes.
- Camera-sync between scroll progress and 3D background movement.
- Minimalist glass UI reflecting the sterile, clinical fiction of the capsule.
- Mobile-aware layouts that split desktop and mobile scene setups.
- Character lore hints that suggest a broader world in development.

## Tech Stack

- **Next.js 14** – App Router plus modern React semantics.
- **React 19** – Functional components and hooks for composable UI.
- **TypeScript** – Strong typing for reliable component contracts.
- **Tailwind CSS** – Utility-first styling tuned to the brand palette.
- **Framer Motion** – Subtle viewport transitions and motion cues.
- **Spline 3D** – Scroll-tied scenes with synchronized camera choreography.
- **Lenis (optional)** – Smooth scroll behavior enhancement.
- **Vercel (planned)** – Zero-config previews and hosting.

The stack exists solely for front-end storytelling; there is no real product backend or commerce engine.

## Structure

```
app/
  page.tsx — Primary scroll experience driving the narrative.
  components/ — Motion wrappers, UI blocks, chapter markers, etc.
  styles/ — Supplemental global styles (if needed).

public/
  images/ — Visuals, textures, and branding assets.
  spline/ — Optional 3D scene files or exports.
```

This structure is intentionally simple to keep the code readable for designers and developers alike.

## Setup

1. Clone the repository.
2. Run `pnpm install` (or `npm install`) to install dependencies.
3. Start the dev server with `pnpm dev` (or `npm run dev`).
4. Visit `http://localhost:3000` to explore the prototype locally.

## Screenshots

Visual captures will be added soon:

- Cinematic scroll sections.
- White chapter interludes.
- 3D hero/product scenes.
- UI overlays and text components.

## License

This project is released under the MIT License. You are welcome to explore and reference the concept, but please do not present it as a real product, store, or game.

## Under the Hood

Hollow Princess began as a personal design and development experiment focused on:

- Narrative UI — weaving scroll-driven storytelling into product reveals.
- Motion and camera sync — aligning UI transitions with 3D scene choreography.
- Interaction clarity — using motion with intent instead of decorative flair.
- Creative direction — fusing fashion, tech, and surrealism into a unified voice.

This is not a commercial product, game, or storefront. If you’d like to chat about the design or how it could evolve, feel free to reach out.
