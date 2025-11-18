### NE-S / California Mountain Snake [SS26] — Product Requirements Document (PRD)

Version: 1.0  
Date: 2025-11-11  
Owner: Frontend (Next.js)  
Repository: `paranoid` (Next.js App Router)

### 1. Overview

"Hollow Princess” is an immersive, single-experience showcase that fuses medical aesthetics with high-fashion storytelling. The site uses surgical minimalism, a central 3D object (Spline), subtle cinematics, and wall-style navigation to guide users through four curated sections. This is not an e‑commerce site; it is a narrative and visual capsule.

### 2. Objectives and Success Criteria

- Communicate the capsule’s aesthetic: sterile, precise, emotionally restrained luxury.
- Deliver a smooth, cinematic experience across desktop and mobile.
- Showcase a central 3D Spline object with scroll-/section-synchronized motion.
- Provide intuitive wall navigation and section tracking.
- Keep performance high and motion subtle under defined limits.

Success indicators:

- First Contentful Paint ≤ 2.5s on mid-tier devices.
- Time to Interactive ≤ 4s on mid-tier devices.
- Smooth scrolling without visible jank on modern mobile.
- 0 major accessibility blockers (WCAG 2.1 AA focus/contrast/keyboard).

### 3. Scope

In-scope

- Next.js App Router single-page experience with 4 sections.
- Tailwind CSS v4 styling; Framer Motion animations.
- Spline 3D integration with camera state management.
- Lenis-based smooth scrolling.
- Wall-based navigation with active section tracking.
- Frosted-glass header, vignette overlay, loading screen.

Out-of-scope

- Cart, checkout, account, or any transactional flows.
- Heavy CMS integration; only static copy/assets.
- Server-side business logic beyond Next.js defaults.

### 4. Target Audience

High-end fashion consumers, creative directors, and press. Expectations: refined interactions, minimal UI, flawless motion, and strong art direction.

### 5. UX Principles

- Surgical minimalism; negative space; central object focus.
- Subtle, precise, cinematic motion (no bouncy/playful transitions).
- Soft typography and restrained color.
- Desktop-first with simplified, performant mobile.

### 6. Information Architecture

- Landing: loading → vignette overlay → central Spline.
- Sections (1→4): narrative and imagery around 3D focus.
- Fixed frosted header; fixed wall navigation.
- Scroll indicator guides initial interaction.

### 7. Visual & Typography

- Color: white and neutral tones.
- Typography utilities: `font-geist-sans`, `font-geist-mono`, `font-gothic`, `font-spectral`.
- Text tone: `text-neutral-600/85`; tracking: `tracking-widest`.
- Glass: `backdrop-blur-md`; overlays: near-solid `opacity-95` where specified.
- Layering: fixed overlays with `z-[10..50]`.

### 8. Animation Guidelines

- Library: Framer Motion.
- Style: subtle, precise, cinematic.
- Easing: `easeInOut` or `anticipate`.
- Durations: UI fades ≤ 1.2s; scroll transitions ≤ 2s.
- GPU-friendly transforms only (translate/scale/opacity).
- Scroll linking: `useScroll`, `useTransform`.

### 9. Technical Architecture

- Framework: Next.js (App Router).
- Styling: Tailwind CSS v4 only (no custom CSS files).
- Animation: Framer Motion.
- 3D: Spline with camera state management.
- Smooth scrolling: Lenis.
- Fonts: Geist family (Sans/Mono), UnifrakturMaguntia, Spectral.
- State: local React hooks only.

Structure

```
app/
  components/
    CapsuleHeader.tsx
    ScrollIndicator.tsx
    SplineScene.tsx
    SplineSceneClient.tsx
    VignetteOverlay.tsx
    WallNav.tsx
    sections/
      Section1.tsx
      Section2.tsx
      Section3.tsx
      Section4.tsx
      Card.tsx
  hooks/
    useActiveSection.ts
    useSmoothScroll.ts
    useDeviceType.ts
  types/
    camera.ts
```

### 10. Functional Requirements

10.1 App Shell

- Use Next.js App Router layout in `app/layout.tsx`.
- Global styles loaded via `app/globals.css`.
- Fonts applied with Tailwind utilities (no inline styles).

  10.2 Header (`app/components/CapsuleHeader.tsx`)

- Fixed top positioning with frosted glass (`backdrop-blur-md`).
- Soft text: `text-neutral-600/85`, `tracking-widest`.
- Z-index within 20–40 range to float above content.
- Minimal interactions; hover states are subtle opacity/transitions.

  10.3 Vignette Overlay (`app/components/VignetteOverlay.tsx`)

- Subtle vignette to focus viewing area.
- GPU transforms only; no layout thrash.
- Toggleable via state for performance testing.

  10.4 Loading Screen (`app/components/LoadingScreen.tsx`)

- Simple branded loader fading out once Spline and first section are ready.
- Fade duration ≤ 800ms, `easeInOut`.

  10.5 Spline Scene (`app/components/SplineScene.tsx`, `SplineSceneClient.tsx`)

- Central 3D object anchored in viewport.
- Camera transitions driven by scroll/section changes.
- Use `requestAnimationFrame` for camera motion to ensure smoothness.
- `useRef` for expensive instances and clean-up on unmount.
- Defer heavy work until first interaction where possible.

  10.6 Wall Navigation (`app/components/WallNav.tsx`)

- Fixed wall-style nav with clear active state.
- Uses `useActiveSection.ts` to highlight the current section.
- Keyboard-accessible and screen-reader friendly.
- Z-index 30–40, minimal hit targets with generous spacing.

  10.7 Scroll Indicator (`app/components/ScrollIndicator.tsx`)

- Subtle prompt near fold; fades after initial engagement.
- Motion ≤ 1.2s, `easeInOut`.

  10.8 Sections (`app/components/sections/Section1.tsx`..`Section4.tsx`)

- Desktop-first layout; simplified mobile variants.
- Each section animates in with subtle fades/transforms.
- Copy uses `text-neutral-600/85` and `tracking-widest`.
- Cards (`Card.tsx`) provide modular content blocks.

  10.9 Section 2 Alignment Requirement

- Dates must be left-aligned within the left column and locations right-aligned within the right column to avoid overlapping the central Spline model [[memory:10723388]].
- Use Tailwind utilities for alignment (`justify-self-start`, `text-left` for dates; right alignment where appropriate for locations).

  10.10 Smooth Scrolling (`app/hooks/useSmoothScroll.ts`)

- Integrate Lenis with proper cleanup.
- Avoid double scroll handlers; centralize scroll effects.

  10.11 Active Section Tracking (`app/hooks/useActiveSection.ts`)

- Track section in view, debounce updates as needed.
- Provide API for components to react to section changes.

  10.12 Device Handling (`app/hooks/useDeviceType.ts`)

- Identify simplified mode for mobile; reduce motion and shader load.
- Ensure parity of content semantics across devices.

### 11. Non-Functional Requirements

Performance

- Spline scene loads progressively; display minimal viable visuals ASAP.
- Avoid layout shifts during section transitions (CLS-friendly).
- Animate with transforms/opacity only.

Accessibility

- Keyboard navigable header and wall nav.
- Sufficient contrast for soft neutral text on backgrounds.
- Reduced motion preference respected via `prefers-reduced-motion`.
- Semantic landmarks and headings for sections.

SEO/Meta

- Proper `<title>`, meta description, and social tags via Next.js metadata.
- Descriptive alt text for important imagery.

Security

- No external forms or user data collection.
- Limit third-party scripts to essentials.

### 12. Component Specifications

CapsuleHeader.tsx

- Props: none (or site meta if needed).
- Behavior: fixed, frosted, subtle hover states.

WallNav.tsx

- Props: `sections: { id: string; label: string }[]`.
- Behavior: highlights active via `useActiveSection`, smooth scroll to targets.

ScrollIndicator.tsx

- Props: none.
- Behavior: pulse/fade cue removed after first scroll.

SplineScene.tsx / SplineSceneClient.tsx

- Props: optional camera targets per section.
- Behavior: scroll/section-driven camera easing with rAF.

sections/Section1..4.tsx

- Props: none.
- Behavior: on-enter fade/translate; copy and images per art direction.

sections/Card.tsx

- Props: `title`, `body`, optional media.
- Behavior: compact, reusable content unit.

LoadingScreen.tsx

- Props: none.
- Behavior: blocks until first render-ready state.

VignetteOverlay.tsx

- Props: optional intensity.
- Behavior: subtle vignette; accessible toggle for testing.

LocationButton.tsx

- Props: label/location.
- Behavior: part of section content; respects minimalism.

### 13. Data & State

`types/camera.ts`

- Strong typing for camera state (positions, targets, easing).
- Camera states keyed per section.

Local state

- Active section id, device type, reduced motion flag.
- No global stores required.

### 14. Error Handling & Fallbacks

- Spline load failure: show static hero image and continue sections.
- Disable advanced motion on low-power devices or errors.
- Ensure overlay/header remain usable under degraded states.

### 15. Edge Cases

- Very short screens: ensure first section content remains visible (no overlap).
- Extremely wide monitors: maintain central focus; limit max width of text blocks.
- Reduced motion: no parallax-heavy or long-duration transitions.
- Slow networks: loader shows; content enters progressively.

### 16. Milestones

M1: Baseline shell with sections and header  
M2: Lenis and Framer Motion integrated  
M3: Spline scene integration with camera state  
M4: Wall navigation + active section tracking  
M5: Responsive and accessibility pass  
M6: Performance tuning and polish

### 17. Acceptance Criteria

- Header is fixed with frosted effect, soft typography, and correct z-index.
- Spline object renders centrally; camera transitions are smooth and tied to sections.
- Wall navigation highlights active section and scrolls correctly.
- Scroll indicator appears initially and fades upon interaction.
- Section 2: dates left-aligned (left column), locations right-aligned (right column) without overlapping the Spline.
- Smooth scrolling works without interfering with keyboard navigation.
- Animations adhere to duration and easing constraints.
- Site meets performance targets on mid-tier devices.
- Accessibility checks (keyboard focus, contrast, reduced motion) pass.

### 18. TestSprite Readiness

- This PRD is placed at `testsprite_tests/tmp/prd_files/NE-S-SS26-PRD.md` for ingestion.
- Assumptions: TestSprite will parse markdown headings and requirement bullets to generate tests.
- Manual test anchors:
  - Header: fixed, blur, typography utilities present.
  - Spline: renders, camera state updates on section change.
  - WallNav: active state changes; scrolls to anchors.
  - Section2 alignment rule verified against central Spline.
  - Reduced motion path disables long transitions.

### 19. Risks & Mitigations

- 3D performance variance: provide reduced motion and static fallback.
- Scroll handler conflicts: centralize via `useSmoothScroll`.
- Over-animated UI: enforce duration/easing budget and PR review.

### 20. Maintenance

- Keep component APIs small and documented in-file.
- Prefer composition (`Card.tsx`) over bespoke layouts.
- Tailwind-only styling; remove dead classes as designs evolve.






