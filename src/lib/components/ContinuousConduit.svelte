<script lang="ts">
	import { onMount } from 'svelte';

	let { color = 'orange' }: { color?: 'orange' | 'emerald' | 'blue' } = $props();

	let scrollProgress = $state(0);
	let smoothProgress = $state(0);
	let conduitRef: HTMLElement | undefined = $state();
	let animFrame: number;

	const themes = {
		orange: {
			track: 'from-[#ff531a]/25 via-white/[0.08] to-[#ff531a]/30',
			knotBorder: 'border-[#ff531a]/40',
			knotDot: 'bg-[#ff7a4a] shadow-[0_0_6px_#ff531a]',
			knotGlow: 'bg-[#ff531a]/15',
			haloWide: 'bg-[#ff531a]',
			haloMid: 'bg-[#ff531a]',
			core: 'from-[#ffd9c7] via-[#ff7a4a] to-[#ff531a] shadow-[0_0_8px_#ff531a]',
			radialAura:
				'radial-gradient(circle, rgba(255, 83, 26, 0.35) 0%, rgba(255, 83, 26, 0.1) 45%, transparent 70%)',
			pulseRing: 'bg-[#ff531a]/30',
			badgeBorder: 'border-[#ffd9c7]/80',
			badgeBg: 'bg-gradient-to-b from-[#ff8c5a] via-[#ff6a3a] to-[#ff4500]',
			badgeShadow:
				'0 0 14px 4px rgba(255, 83, 26, 0.8), 0 0 26px 8px rgba(255, 83, 26, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
			dockBorder: 'border-[#ff531a]/50',
			dockDot: 'bg-[#ff7a4a] shadow-[0_0_8px_#ff531a]',
			dockGlow: 'bg-[#ff531a]/20'
		},
		emerald: {
			track: 'from-[#10b981]/25 via-white/[0.08] to-[#10b981]/30',
			knotBorder: 'border-[#10b981]/40',
			knotDot: 'bg-[#5fd39a] shadow-[0_0_6px_#10b981]',
			knotGlow: 'bg-[#10b981]/15',
			haloWide: 'bg-[#10b981]',
			haloMid: 'bg-[#10b981]',
			core: 'from-[#d1fae5] via-[#5fd39a] to-[#10b981] shadow-[0_0_8px_#10b981]',
			radialAura:
				'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(16, 185, 129, 0.1) 45%, transparent 70%)',
			pulseRing: 'bg-[#10b981]/30',
			badgeBorder: 'border-[#d1fae5]/80',
			badgeBg: 'bg-gradient-to-b from-[#6ee7b7] via-[#34d399] to-[#059669]',
			badgeShadow:
				'0 0 14px 4px rgba(16, 185, 129, 0.8), 0 0 26px 8px rgba(16, 185, 129, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
			dockBorder: 'border-[#10b981]/50',
			dockDot: 'bg-[#5fd39a] shadow-[0_0_8px_#10b981]',
			dockGlow: 'bg-[#10b981]/20'
		},
		blue: {
			track: 'from-[#3b82f6]/25 via-white/[0.08] to-[#3b82f6]/30',
			knotBorder: 'border-[#3b82f6]/40',
			knotDot: 'bg-[#60a5fa] shadow-[0_0_6px_#3b82f6]',
			knotGlow: 'bg-[#3b82f6]/15',
			haloWide: 'bg-[#3b82f6]',
			haloMid: 'bg-[#3b82f6]',
			core: 'from-[#dbeafe] via-[#60a5fa] to-[#3b82f6] shadow-[0_0_8px_#3b82f6]',
			radialAura:
				'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(59, 130, 246, 0.1) 45%, transparent 70%)',
			pulseRing: 'bg-[#3b82f6]/30',
			badgeBorder: 'border-[#dbeafe]/80',
			badgeBg: 'bg-gradient-to-b from-[#93c5fd] via-[#3b82f6] to-[#1d4ed8]',
			badgeShadow:
				'0 0 14px 4px rgba(59, 130, 246, 0.8), 0 0 26px 8px rgba(59, 130, 246, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
			dockBorder: 'border-[#3b82f6]/50',
			dockDot: 'bg-[#60a5fa] shadow-[0_0_8px_#3b82f6]',
			dockGlow: 'bg-[#3b82f6]/20'
		}
	} as const;

	const t = $derived(themes[color] ?? themes.orange);

	function calculateScroll() {
		const currentY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
		const docHeight =
			Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight;

		if (docHeight <= 0) {
			scrollProgress = 0;
			return;
		}

		// Smooth normalized progression from 0 to 1 on both scroll down and scroll up
		const rawProgress = Math.max(0, Math.min(1, currentY / docHeight));
		scrollProgress = rawProgress;
	}

	function springLoop() {
		// Responsive physics spring simulation (stiffness: 0.18, damping: 0.82)
		const diff = scrollProgress - smoothProgress;
		smoothProgress += diff * 0.18;

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
	<!-- Constrained to .yc-container with deliberate exterior margin positioning -->
	<div class="yc-container relative mx-auto h-full">
		<!-- Continuous Thread Conduit positioned securely in the container gutter with ample copy clearance -->
		<div
			bind:this={conduitRef}
			class="absolute bottom-24 top-20 w-[2px] left-2 sm:left-3.5 md:left-4 lg:left-5"
		>
			<!-- Top Source Knot (Origin Dock) -->
			<div class="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center justify-center">
				<div
					class="flex h-5 w-5 items-center justify-center rounded-full border {t.knotBorder} bg-[#070709]"
				>
					<span class="h-1.5 w-1.5 rounded-full {t.knotDot}"></span>
				</div>
				<!-- Ambient Source Glow -->
				<div class="absolute -z-10 h-10 w-10 rounded-full {t.knotGlow} blur-sm"></div>
			</div>

			<!-- Background Static Guide Track -->
			<div
				class="absolute inset-0 w-[2px] rounded-full bg-gradient-to-b {t.track}"
			></div>

			<!-- Active Glowing High-Energy Thread -->
			<div
				style="height: {percentHeight}"
				class="absolute left-0 top-0 w-full overflow-visible"
			>
				<!-- Multi-Tier Optical Glow 1: Wide Ambient Halo -->
				<div
					class="absolute -left-[6px] top-0 h-full w-[14px] rounded-full {t.haloWide} opacity-20 blur-[6px]"
				></div>

				<!-- Multi-Tier Optical Glow 2: Mid Focused Halo -->
				<div
					class="absolute -left-[1.5px] top-0 h-full w-[5px] rounded-full {t.haloMid} opacity-55 blur-[2px]"
				></div>

				<!-- Multi-Tier Optical Glow 3: Sharp Laser Core -->
				<div
					class="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b {t.core}"
				></div>
			</div>

			<!-- Main Arrow Runner (Leading the Scroll with Ample Content Clearance) -->
			<div
				style="top: {percentHeight}"
				class="absolute left-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
			>
				<!-- Compact Ambient Radial Glow Aura (scaled to 112px to guarantee zero text obstruction) -->
				<div
					class="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-28 sm:w-28"
					style="background: {t.radialAura};"
				></div>

				<!-- Main Arrow Badge -->
				<div class="group relative flex items-center justify-center">
					<!-- Outer Energy Pulse Ring -->
					<div class="absolute -inset-1 animate-pulse rounded-full {t.pulseRing} blur-xs"></div>

					<!-- The Arrow Head -->
					<div
						class="relative flex h-7 w-7 items-center justify-center rounded-full border {t.badgeBorder} {t.badgeBg} sm:h-7.5 sm:w-7.5"
						style="box-shadow: {t.badgeShadow};"
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
					class="flex h-5 w-5 items-center justify-center rounded-full border {t.dockBorder} bg-[#070709]"
				>
					<span class="h-2 w-2 rounded-full {t.dockDot}"></span>
				</div>
				<!-- Ambient Signoff Glow -->
				<div class="absolute -z-10 h-14 w-14 rounded-full {t.dockGlow} blur-md"></div>
			</div>
		</div>
	</div>
</div>
