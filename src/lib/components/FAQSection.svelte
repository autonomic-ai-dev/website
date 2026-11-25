<script lang="ts">
	import { HelpCircle, ChevronRight } from 'lucide-svelte';
	import { scrollReveal } from '#lib/actions/scrollReveal';

	export interface FAQItem {
		q: string;
		a: string;
	}

	let {
		color = 'orange',
		badge = 'Architecture & Verification FAQ',
		title = 'Frequently Asked Questions',
		description = 'Direct answers on deterministic DAGs, code-hashed receipts, and blocking unverified test claims.',
		items
	}: {
		color?: 'orange' | 'emerald' | 'blue';
		badge?: string;
		title?: string;
		description?: string;
		items: FAQItem[];
	} = $props();

	let openIndices = $state<number[]>([]);

	function toggleIndex(idx: number) {
		if (openIndices.includes(idx)) {
			openIndices = openIndices.filter((i) => i !== idx);
		} else {
			openIndices = [...openIndices, idx];
		}
	}

	const colorStyles = {
		orange: {
			accentText: 'text-[#ff7a4a]',
			activeBorder: 'border-[#ff531a]/40',
			chevronActive: 'text-[#ff7a4a]'
		},
		emerald: {
			accentText: 'text-emerald-400',
			activeBorder: 'border-emerald-500/40',
			chevronActive: 'text-emerald-400'
		},
		blue: {
			accentText: 'text-blue-400',
			activeBorder: 'border-blue-500/40',
			chevronActive: 'text-blue-400'
		}
	};

	const s = $derived(colorStyles[color] ?? colorStyles.orange);
</script>

<section id="faq" use:scrollReveal class="py-24 border-t border-white/[0.08] bg-[#000000]">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center max-w-3xl mx-auto mb-16">
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-white/[0.04] text-neutral-300 text-xs font-mono-code mb-4">
				<HelpCircle class="w-3.5 h-3.5 text-neutral-400" />
				<span>{badge}</span>
			</div>
			<h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
				{title}
			</h2>
			<p class="text-neutral-400 text-sm sm:text-base leading-relaxed">
				{description}
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto items-start">
			{#each items as faq, idx (faq.q)}
				{@const isOpen = openIndices.includes(idx)}
				<div
					use:scrollReveal={{ delay: (idx % 6) * 50 }}
					class="rounded-2xl border yc-card transition-all duration-200 overflow-hidden {isOpen
						? `${s.activeBorder} bg-[#0e0e12] yc-card-glow shadow-lg shadow-black/80`
						: 'border-white/[0.08] bg-[#0a0a0c] hover:border-white/[0.18]'}"
				>
					<button
						type="button"
						aria-expanded={isOpen}
						onclick={() => toggleIndex(idx)}
						class="w-full text-left p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
					>
						<span class="font-semibold text-sm sm:text-base text-white tracking-tight leading-snug">
							{faq.q}
						</span>
						<div
							class="w-6 h-6 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-200 {isOpen
								? `rotate-90 ${s.chevronActive} border-current`
								: 'text-neutral-400'}"
						>
							<ChevronRight size={13} />
						</div>
					</button>

					{#if isOpen}
						<div class="px-6 pb-6 pt-0 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/[0.06] mt-1 pt-3.5">
							{faq.a}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>
