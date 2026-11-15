<script lang="ts">
	import { onMount } from 'svelte';

	let scrollProgress = $state(0);
	let smoothProgress = $state(0);
	let conduitRef: HTMLElement | undefined = $state();
	let animFrame: number;

	function calculateScroll() {
		if (!conduitRef) {
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			scrollProgress = docHeight > 0 ? Math.max(0, Math.min(1, window.scrollY / docHeight)) : 0;
			return;
		}

		// Calculate progress relative to the conduit height and scroll position
		const rect = conduitRef.getBoundingClientRect();
		const conduitHeight = rect.height;
		// When scroll reaches 0, progress is 0.
		// When the user scrolls, the arrow advances down the conduit smoothly.
		if (window.scrollY <= 10) {
			scrollProgress = 0;
			return;
		}

		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		if (docHeight <= 0) {
			scrollProgress = 0;
			return;
		}

		// Calculate scroll percentage with gentle ease
		const rawProgress = window.scrollY / docHeight;
		scrollProgress = Math.max(0, Math.min(1, rawProgress));
	}

	function springLoop() {
		// Physics spring simulation (stiffness: 0.15, damping: 0.85)
		const diff = scrollProgress - smoothProgress;
		smoothProgress += diff * 0.15;

		if (Math.abs(diff) < 0.0001) {
			smoothProgress = scrollProgress;
		}

		animFrame = requestAnimationFrame(springLoop);
	}

	onMount(() => {
		calculateScroll();
		smoothProgress = scrollProgress;

		window.addEventListener('scroll', calculateScroll, { passive: true });
		window.addEventListener('resize', calculateScroll, { passive: true });

		animFrame = requestAnimationFrame(springLoop);

		return () => {
			window.removeEventListener('scroll', calculateScroll);
			window.removeEventListener('resize', calculateScroll);
			cancelAnimationFrame(animFrame);
		};
	});

	const percentHeight = $derived(`${(smoothProgress * 100).toFixed(2)}%`);
</script>

<div
	aria-hidden="true"
	class="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 hidden sm:block select-none overflow-hidden"
>
	<!-- Constrained exactly to .yc-container for locked alignment with site typography and cards -->
	<div class="yc-container relative mx-auto h-full">
		<!-- Continuous Orange Thread Conduit in content margin zone -->
		<div
			bind:this={conduitRef}
			class="absolute bottom-24 top-20 w-[2px] left-1 sm:left-1.5 lg:left-2"
		>
			<!-- Top Source Knot (Origin Dock) -->
			<div class="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center justify-center">
				<div
					class="flex h-5 w-5 items-center justify-center rounded-full border border-[#ff531a]/40 bg-[#070709]"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-[#ff7a4a] shadow-[0_0_6px_#ff531a]"></span>
				</div>
				<!-- Ambient Source Glow -->
				<div class="absolute -z-10 h-10 w-10 rounded-full bg-[#ff531a]/15 blur-sm"></div>
			</div>

			<!-- Background Static Guide Track -->
			<div
				class="absolute inset-0 w-[2px] rounded-full bg-gradient-to-b from-[#ff531a]/25 via-white/[0.08] to-[#ff531a]/30"
			></div>

			<!-- Active Glowing High-Energy Orange Thread -->
			<div
				style="height: {percentHeight}"
				class="absolute left-0 top-0 w-full overflow-visible"
			>
				<!-- Multi-Tier Optical Glow 1: Wide Ambient Halo -->
				<div
					class="absolute -left-[6px] top-0 h-full w-[14px] rounded-full bg-[#ff531a] opacity-20 blur-[6px]"
				></div>

				<!-- Multi-Tier Optical Glow 2: Mid Focused Halo -->
				<div
					class="absolute -left-[1.5px] top-0 h-full w-[5px] rounded-full bg-[#ff531a] opacity-55 blur-[2px]"
				></div>

				<!-- Multi-Tier Optical Glow 3: Sharp Laser Core -->
				<div
					class="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#ffd9c7] via-[#ff7a4a] to-[#ff531a] shadow-[0_0_8px_#ff531a]"
				></div>
			</div>

			<!-- Main Orange Arrow Runner (Leading the Scroll) -->
			<div
				style="top: {percentHeight}"
				class="absolute left-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
			>
				<!-- Refined Ambient Radial Glow Aura (scaled down from 240px to 140px to avoid bloating) -->
				<div
					class="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-36 sm:w-36"
					style="background: radial-gradient(circle, rgba(255, 83, 26, 0.35) 0%, rgba(255, 83, 26, 0.1) 45%, transparent 70%);"
				></div>

				<!-- Main Orange Arrow Badge -->
				<div class="group relative flex items-center justify-center">
					<!-- Outer Energy Pulse Ring -->
					<div class="absolute -inset-1 animate-pulse rounded-full bg-[#ff531a]/30 blur-xs"></div>

					<!-- The Orange Arrow Head -->
					<div
						class="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#ffd9c7]/80 bg-gradient-to-b from-[#ff8c5a] via-[#ff6a3a] to-[#ff4500] sm:h-7.5 sm:w-7.5"
						style="box-shadow: 0 0 14px 4px rgba(255, 83, 26, 0.8), 0 0 26px 8px rgba(255, 83, 26, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.6);"
					>
						<!-- Crisp Downward Arrow Icon -->
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							class="-translate-y-[0.5px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
						>
							<path
								d="M12 4v16m0 0l-5.5-5.5M12 20l5.5-5.5"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</div>
			</div>

			<!-- Bottom Destination Terminal Node (Landing Dock) -->
			<div class="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center justify-center">
				<div
					class="flex h-5 w-5 items-center justify-center rounded-full border border-[#ff531a]/50 bg-[#070709]"
				>
					<span class="h-2 w-2 rounded-full bg-[#ff7a4a] shadow-[0_0_8px_#ff531a]"></span>
				</div>
				<!-- Ambient Signoff Glow -->
				<div class="absolute -z-10 h-14 w-14 rounded-full bg-[#ff531a]/20 blur-md"></div>
			</div>
		</div>
	</div>
</div>
