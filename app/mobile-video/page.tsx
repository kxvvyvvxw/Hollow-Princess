import MobileScrollVideo from "../components/MobileScrollVideo";

export default function Page() {
	return (
		<main className="min-h-screen w-full bg-white text-neutral-600">
			{/* Hero mobile-only scroll video (UA-gated inside component) */}
			<MobileScrollVideo />

			{/* Extra content to enable scrolling and verify scrubbing across the page */}
			<section className="mx-auto max-w-3xl px-6 py-16">
				<h1 className="font-geist-sans text-2xl tracking-widest mb-4">Mobile Scroll Video Test</h1>
				<p className="text-neutral-600/85">
					This page is for testing the mobile-only, user-agent detected scroll-scrubbed video.
					On mobile, scroll down and up to scrub the video with easing. On desktop or tablets,
					nothing renders.
				</p>
			</section>

			<div className="h-[250vh] w-full bg-neutral-100" />
		</main>
	);
}


