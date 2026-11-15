<script lang="ts">
	import { onMount } from 'svelte';

	let scrollProgress = $state(0);
	let smoothProgress = $state(0);
	let animFrame: number;

	function calculateScroll() {
		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		if (docHeight <= 0) {
			scrollProgress = 0;
			return;
		}
		const current = window.scrollY / docHeight;
		scrollProgress = Math.max(0, Math.min(1, current));
	}

	function springLoop() {
		// Physics spring simulation (stiffness: 0.12, damping: 0.82)
		const diff = scrollProgress - smoothProgress;
		smoothProgress += diff * 0.12;

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
	class="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 select-none overflow-hidden"
>
	<div class="relative mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Continuous Orange Thread Conduit -->
		<div
			class="absolute bottom-24 top-28 w-[2px] left-1.5 sm:left-2.5 lg:left-3 xl:-left-6 2xl:-left-10"
		>
			<!-- Top Source Knot (Hero Origin) -->
			<div class="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center justify-center">
				<div
					class="flex h-6 w-6 items-center justify-center rounded-full border border-[#ff531a]/40 bg-[#070709]"
				>
					<span class="h-2 w-2 rounded-full bg-[#ff7a4a] shadow-[0_0_8px_#ff531a]"></span>
				</div>
				<!-- Ambient Source Glow -->
				<div class="absolute -z-10 h-16 w-16 rounded-full bg-[#ff531a]/15 blur-md"></div>
			</div>

			<!-- Background Static Guide Track -->
			<div
				class="absolute inset-0 w-[2px] rounded-full bg-gradient-to-b from-[#ff531a]/20 via-white/[0.06] to-[#ff531a]/25"
			></div>

			<!-- Active Glowing High-Energy Orange Thread -->
			<div
				style="height: {percentHeight}"
				class="absolute left-0 top-0 w-full overflow-visible transition-[height] duration-75 ease-out"
			>
				<!-- Multi-Tier Optical Glow 1: Wide Ambient Halo -->
				<div
					class="absolute -left-[7px] top-0 h-full w-[16px] rounded-full bg-[#ff531a] opacity-20 blur-[8px]"
				></div>

				<!-- Multi-Tier Optical Glow 2: Mid Focused Halo -->
				<div
					class="absolute -left-[2px] top-0 h-full w-[6px] rounded-full bg-[#ff531a] opacity-60 blur-[3px]"
				></div>

				<!-- Multi-Tier Optical Glow 3: Sharp Laser Core -->
				<div
					class="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#ffd9c7] via-[#ff7a4a] to-[#ff531a] shadow-[0_0_10px_#ff531a]"
				></div>
			</div>

			<!-- Main Orange Arrow Runner (Leading the Scroll) -->
			<div
				style="top: {percentHeight}"
				class="absolute left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 transition-[top] duration-75 ease-out"
			>
				<!-- 240px Ambient Radial Glow Aura -->
				<div
					class="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-60 sm:w-60"
					style="background: radial-gradient(circle, rgba(255, 83, 26, 0.42) 0%, rgba(255, 83, 26, 0.12) 45%, rgba(255, 83, 26, 0) 70%);"
				></div>

				<!-- Main Orange Arrow Badge -->
				<div class="group relative flex items-center justify-center">
					<!-- Outer Energy Pulse Ring -->
					<div class="absolute -inset-1 animate-pulse rounded-full bg-[#ff531a]/40 blur-sm"></div>

					<!-- The Orange Arrow Head -->
					<div
						class="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#ffd9c7]/80 bg-gradient-to-b from-[#ff8c5a] via-[#ff6a3a] to-[#ff4500] sm:h-8 sm:w-8"
						style="box-shadow: 0 0 16px 5px rgba(255, 83, 26, 0.85), 0 0 32px 10px rgba(255, 83, 26, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.6);"
					>
						<!-- Crisp Downward Arrow Icon -->
						<svg
							width="14"
							height="14"
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
					class="flex h-6 w-6 items-center justify-center rounded-full border border-[#ff531a]/50 bg-[#070709]"
				>
					<span class="h-2.5 w-2.5 rounded-full bg-[#ff7a4a] shadow-[0_0_10px_#ff531a]"></span>
				</div>
				<!-- Ambient Signoff Glow -->
				<div class="absolute -z-10 h-20 w-20 rounded-full bg-[#ff531a]/20 blur-lg"></div>
			</div>
		</div>
	</div>
</div>
