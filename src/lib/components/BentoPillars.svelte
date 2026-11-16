<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { scrollReveal } from '#lib/actions/scrollReveal';

	export interface Pillar {
		badge: string;
		title: string;
		desc: string;
		tag: string;
		icon: ComponentType;
		snippet?: string;
		statusLabel?: string;
	}

	let {
		color = 'orange',
		badge = 'Core Architectural Guarantees',
		title = 'Engineered for Deterministic Verification',
		description = 'Four foundational invariants enforced by local Rust processes. Zero reliance on LLM self-evaluation.',
		pillars
	}: {
		color?: 'orange' | 'emerald' | 'blue';
		badge?: string;
		title?: string;
		description?: string;
		pillars?: Pillar[];
	} = $props();

	const colorStyles = {
		orange: {
			accent: '#ff531a',
			text: 'text-[#ff7a4a]',
			badgeBg: 'bg-[#ff531a]/10',
			badgeBorder: 'border-[#ff531a]/25',
			glow: 'rgba(255, 83, 26, 0.12)'
		},
		emerald: {
			accent: '#10b981',
			text: 'text-[#5fd39a]',
			badgeBg: 'bg-[#5fd39a]/10',
			badgeBorder: 'border-[#5fd39a]/25',
			glow: 'rgba(16, 185, 129, 0.12)'
		},
		blue: {
			accent: '#3b82f6',
			text: 'text-blue-400',
			badgeBg: 'bg-blue-500/10',
			badgeBorder: 'border-blue-500/25',
			glow: 'rgba(59, 130, 246, 0.12)'
		}
	};

	const s = $derived(colorStyles[color] ?? colorStyles.orange);

	// Interactive spotlight cursor tracker
	let mouseX = $state(0);
	let mouseY = $state(0);
	let activeCard = $state<number | null>(null);

	function handleMouseMove(e: MouseEvent, index: number) {
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
		activeCard = index;
	}

	function handleMouseLeave() {
		activeCard = null;
	}
</script>

<section id="pillars" use:scrollReveal class="py-24 relative overflow-hidden bg-[#000000] border-t border-white/[0.08]">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="text-center max-w-3xl mx-auto mb-16">
			<span class="text-xs font-mono-code uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
				{badge}
			</span>
			<h2 class="text-3xl sm:text-5xl font-bold tracking-tight text-white">
				{title}
			</h2>
			<p class="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed">
				{description}
			</p>
		</div>

		<!-- 4 Bento Cards Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#if pillars}
				{#each pillars as p, idx (p.title)}
					{@const Icon = p.icon}
					<div
						role="region"
						aria-label={p.title}
						use:scrollReveal={{ delay: idx * 60 }}
						onmousemove={(e) => handleMouseMove(e, idx)}
						onmouseleave={handleMouseLeave}
						class="relative rounded-2xl border border-white/[0.08] bg-[#090a0d] yc-card yc-card-glow p-6 sm:p-8 overflow-hidden transition-all duration-300 hover:border-white/[0.22] hover:-translate-y-1 flex flex-col justify-between"
					>
						<!-- Spotlight Cursor Radial Beam -->
						<div
							class="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-2xl"
							style="opacity: {activeCard === idx ? 1 : 0}; background: radial-gradient(600px circle at {mouseX}px {mouseY}px, {s.glow}, transparent 40%);"
						></div>

						<div class="relative z-10 space-y-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2.5">
									<div class="w-8 h-8 rounded-lg {s.badgeBg} border {s.badgeBorder} flex items-center justify-center {s.text} shrink-0">
										<Icon size={16} />
									</div>
									<span class="text-xs font-mono-code {s.text} font-bold">
										Pillar {p.badge}
									</span>
								</div>
								<span class="text-[11px] font-mono-code text-neutral-400 uppercase tracking-wider">
									{p.tag}
								</span>
							</div>

							<div>
								<h3 class="text-xl font-bold text-white tracking-tight">
									{p.title}
								</h3>
								<p class="mt-2 text-sm text-neutral-400 leading-relaxed">
									{p.desc}
								</p>
							</div>
						</div>

						{#if p.snippet}
							<div class="relative z-10 mt-6 pt-4 border-t border-white/[0.06]">
								<div class="rounded-xl bg-[#050608] border border-white/[0.06] p-3 font-mono-code text-[11px] text-neutral-300 overflow-x-auto">
									<pre class="leading-relaxed whitespace-pre-wrap">{p.snippet}</pre>
								</div>
								{#if p.statusLabel}
									<div class="mt-3 flex items-center justify-between text-[11px] font-mono-code text-neutral-400">
										<span>Audit Guarantee</span>
										<span class="{s.text} font-medium">{p.statusLabel}</span>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>
</section>
