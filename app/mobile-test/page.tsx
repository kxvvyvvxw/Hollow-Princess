"use client";

import MobileScrollVideo from "../components/MobileScrollVideo";

export default function MobileTestPage() {
  return (
    <main className="relative min-h-screen">
      {/* Mobile Scroll Video Component */}
      <MobileScrollVideo />

      {/* Scrollable content for testing */}
      <div className="relative z-10">
        {/* Section 1 */}
        <section className="min-h-screen flex items-center justify-center bg-neutral-50/50 backdrop-blur-sm">
          <div className="text-center px-8">
            <h1 className="text-4xl md:text-6xl font-geist-sans font-light tracking-widest text-neutral-800 mb-4">
              Mobile Scroll Test
            </h1>
            <p className="text-neutral-600 text-lg">
              Scroll down to test video scrubbing
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="min-h-screen flex items-center justify-center bg-neutral-100/50 backdrop-blur-sm">
          <div className="text-center px-8 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-geist-sans font-light tracking-widest text-neutral-800 mb-6">
              Section Two
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              Continue scrolling to see the video scrub smoothly through
              different frames. The video playback is directly mapped to your
              scroll position.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="min-h-screen flex items-center justify-center bg-neutral-50/50 backdrop-blur-sm">
          <div className="text-center px-8 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-geist-sans font-light tracking-widest text-neutral-800 mb-6">
              Section Three
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              Scrolling up will reverse the video playback. The lerp-based
              easing ensures smooth transitions in both directions.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="min-h-screen flex items-center justify-center bg-neutral-100/50 backdrop-blur-sm">
          <div className="text-center px-8 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-geist-sans font-light tracking-widest text-neutral-800 mb-6">
              Section Four
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              You've reached the end. Scroll back up to see the video scrub in
              reverse. The component only renders on mobile devices.
            </p>
          </div>
        </section>

        {/* Additional spacing for smooth scrolling */}
        <section className="min-h-screen flex items-center justify-center bg-neutral-50/50 backdrop-blur-sm">
          <div className="text-center px-8">
            <p className="text-neutral-400 text-sm">
              Extra content to ensure smooth scroll range
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

