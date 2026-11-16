<script lang="ts">
	import { onMount } from 'svelte';

	let { color = 'orange' }: { color?: 'orange' | 'emerald' | 'blue' } = $props();

	let scrollProgress = $state(0);
	let smoothProgress = $state(0);
	let conduitRef: HTMLElement | undefined = $state();
	let animFrame: number;

	const themes = {
		orange: {
			accent: '#ff531a',
			track: 'linear-gradient(to bottom, rgba(255, 83, 26, 0.35), rgba(255, 255, 255, 0.15), rgba(255, 83, 26, 0.4))',
			core: 'linear-gradient(to bottom, #ffd9c7, #ff7a4a, #ff531a)',
			badgeBg: 'linear-gradient(to bottom, #ff8c5a, #ff6a3a, #ff4500)',
			badgeBorder: 'rgba(255, 217, 199, 0.85)',
			badgeShadow:
				'0 0 16px 5px rgba(255, 83, 26, 0.85), 0 0 32px 10px rgba(255, 83, 26, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
			pulseRing: 'rgba(255, 83, 26, 0.4)',
			radialAura:
				'radial-gradient(circle, rgba(255, 83, 26, 0.45) 0%, rgba(255, 83, 26, 0.12) 45%, transparent 70%)',
			dotColor: '#ff7a4a'
		},
		emerald: {
			accent: '#10b981',
			track: 'linear-gradient(to bottom, rgba(16, 185, 129, 0.4), rgba(255, 255, 255, 0.15), rgba(16, 185, 129, 0.45))',
			core: 'linear-gradient(to bottom, #d1fae5, #5fd39a, #10b981)',
			badgeBg: 'linear-gradient(to bottom, #6ee7b7, #34d399, #059669)',
			badgeBorder: 'rgba(209, 250, 229, 0.85)',
			badgeShadow:
				'0 0 16px 5px rgba(16, 185, 129, 0.85), 0 0 32px 10px rgba(16, 185, 129, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
			pulseRing: 'rgba(16, 185, 129, 0.4)',
			radialAura:
				'radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(16, 185, 129, 0.12) 45%, transparent 70%)',
			dotColor: '#5fd39a'
		},
		blue: {
			accent: '#3b82f6',
			track: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.4), rgba(255, 255, 255, 0.15), rgba(59, 130, 246, 0.45))',
			core: 'linear-gradient(to bottom, #dbeafe, #60a5fa, #3b82f6)',
			badgeBg: 'linear-gradient(to bottom, #93c5fd, #3b82f6, #1d4ed8)',
			badgeBorder: 'rgba(219, 234, 254, 0.85)',
			badgeShadow:
				'0 0 16px 5px rgba(59, 130, 246, 0.85), 0 0 32px 10px rgba(59, 130, 246, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
			pulseRing: 'rgba(59, 130, 246, 0.4)',
			radialAura:
				'radial-gradient(circle, rgba(59, 130, 246, 0.45) 0%, rgba(59, 130, 246, 0.12) 45%, transparent 70%)',
			dotColor: '#60a5fa'
		}
	} as const;

	const t = $derived(themes[color] ?? themes.orange);

	function calculateScroll() {
		const currentY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
		const totalScrollable =
			Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight;

		if (totalScrollable <= 0) {
			scrollProgress = 0;
			return;
		}

		// Linear full-page scroll progress matching Anode architecture.
		// When the rail spans the entire document through the footer, linear progress naturally
		// tracks the viewing area (middle of the screen ~50vh) with completely uniform velocity.
		const rawProgress = Math.max(0, Math.min(1, currentY / totalScrollable));
		scrollProgress = rawProgress;
	}

	function springLoop() {
		// Responsive physics spring simulation (stiffness: 0.22, damping: 0.78) for organic fluid tracking
		const diff = scrollProgress - smoothProgress;
		smoothProgress += diff * 0.22;

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
	class="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 select-none"
>
	<!-- Constrained to .yc-container with deliberate exterior margin positioning -->
	<div class="yc-container relative mx-auto h-full">
		<!-- Continuous Thread Conduit positioned securely in the container gutter with ample copy clearance -->
		<div
			bind:this={conduitRef}
			class="absolute bottom-24 top-20 w-[2px] left-2 sm:left-3.5 md:left-4 xl:-left-4 2xl:-left-8"
		>
			<!-- Top Source Knot (Origin Dock) -->
			<div class="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center justify-center">
				<div
					class="flex h-5 w-5 items-center justify-center rounded-full bg-[#070709]"
					style="border: 1px solid {t.accent}66;"
				>
					<span
						class="h-1.5 w-1.5 rounded-full"
						style="background-color: {t.dotColor}; box-shadow: 0 0 6px {t.accent};"
					></span>
				</div>
				<!-- Ambient Source Glow -->
				<div
					class="absolute -z-10 h-10 w-10 rounded-full blur-sm"
					style="background-color: {t.accent}26;"
				></div>
			</div>

			<!-- Background Static Guide Track (Always Crisp & Visible) -->
			<div
				class="absolute inset-0 w-[2px] rounded-full"
				style="background: {t.track};"
			></div>

			<!-- Active Glowing High-Energy Thread -->
			<div
				style="height: {percentHeight}"
				class="absolute left-0 top-0 w-full overflow-visible"
			>
				<!-- Multi-Tier Optical Glow 1: Wide Ambient Halo -->
				<div
					class="absolute -left-[6px] top-0 h-full w-[14px] rounded-full opacity-25 blur-[6px]"
					style="background-color: {t.accent};"
				></div>

				<!-- Multi-Tier Optical Glow 2: Mid Focused Halo -->
				<div
					class="absolute -left-[1.5px] top-0 h-full w-[5px] rounded-full opacity-60 blur-[2px]"
					style="background-color: {t.accent};"
				></div>

				<!-- Multi-Tier Optical Glow 3: Sharp Laser Core -->
				<div
					class="absolute left-0 top-0 h-full w-[2px]"
					style="background: {t.core}; box-shadow: 0 0 10px {t.accent};"
				></div>
			</div>

			<!-- Main Arrow Runner (Leading the Scroll with Ample Content Clearance) -->
			<div
				style="top: {percentHeight}"
				class="absolute left-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
			>
				<!-- Compact Ambient Radial Glow Aura -->
				<div
					class="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-32 sm:w-32"
					style="background: {t.radialAura};"
				></div>

				<!-- Main Arrow Badge -->
				<div class="group relative flex items-center justify-center">
					<!-- Outer Energy Pulse Ring -->
					<div
						class="absolute -inset-1 animate-pulse rounded-full blur-xs"
						style="background-color: {t.pulseRing};"
					></div>

					<!-- The Arrow Head -->
					<div
						class="relative flex h-7 w-7 items-center justify-center rounded-full sm:h-7.5 sm:w-7.5"
						style="background: {t.badgeBg}; border: 1px solid {t.badgeBorder}; box-shadow: {t.badgeShadow};"
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
					class="flex h-5 w-5 items-center justify-center rounded-full bg-[#070709]"
					style="border: 1px solid {t.accent}80;"
				>
					<span
						class="h-2 w-2 rounded-full"
						style="background-color: {t.dotColor}; box-shadow: 0 0 8px {t.accent};"
					></span>
				</div>
				<!-- Ambient Signoff Glow -->
				<div
					class="absolute -z-10 h-14 w-14 rounded-full blur-md"
					style="background-color: {t.accent}33;"
				></div>
			</div>
		</div>
	</div>
</div>
