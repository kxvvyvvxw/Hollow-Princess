# NE-S / California Mountain Snake [SS26]

Experimental product capsule site focused on object-driven UI, controlled motion, and sterile visual design.

## Purpose

R&D project to practice:

- 3D integration with scroll-linked interaction
- Clinical UI language and restrained visual identity
- Narrative sequencing without traditional e-commerce patterns

Not built for checkout or transactions.
Primary goal: presentation, interaction design, and environment building.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Framer Motion
- Spline (3D object + camera states)
- Lenis (scroll)

## Design Notes

- White, neutral, lab-adjacent surfaces
- Object at the center; UI secondary
- Minimal typography (Geist primary, Unifraktur for accent)
- Motion = functional, precise, non-decorative
- Mobile treated as a separate composition, not scaled-down desktop

## Key Components

- SplineScene — 3D scene with camera control
- WallNav — 4-side navigation (edge-based)
- Section layouts — scroll-driven narrative panels
- useActiveSection — section tracking for UI state

## To Revisit

- Mobile performance + reduced-motion mode
- Asset weight + Spline optimization
- Scroll easing and timing between sections
- A11y audit

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
app/
├── components/
│   ├── CapsuleHeader.tsx      # Frosted glass header with brand name
│   ├── ScrollIndicator.tsx    # Animated scroll indicator
│   ├── SplineScene.tsx        # 3D scene with camera controls
│   ├── WallNav.tsx            # Wall-based navigation
│   └── sections/              # Page sections
│       ├── Section1.tsx
│       ├── Section2.tsx
│       ├── Section3.tsx
│       └── Section4.tsx
├── hooks/
│   ├── useActiveSection.ts    # Track active section
│   └── useSmoothScroll.ts     # Smooth scroll with camera control
└── types/
    └── camera.ts              # Camera state types
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library for React
- [Spline](https://spline.design/) - 3D design tool

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
