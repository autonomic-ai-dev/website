<script lang="ts">
	import AnimatedNumber from './AnimatedNumber.svelte';
	import { scrollReveal } from '#lib/actions/scrollReveal';

	export interface BenchmarkStat {
		label: string;
		value: number;
		prefix?: string;
		suffix?: string;
		decimals?: number;
		duration?: number;
		detail: string;
		tag?: string;
	}

	let {
		color = 'orange',
		badge = 'Empirical Benchmarks',
		title = 'Measured, not estimated.',
		description = 'Recorded runs on local macOS Apple Silicon and Linux CI runners. Every figure is backed by verifiable receipt logs and SQLite state traces.',
		stats,
		methodLink = '/docs#benchmarks'
	}: {
		color?: 'orange' | 'emerald' | 'blue';
		badge?: string;
		title?: string;
		description?: string;
		stats?: BenchmarkStat[];
		methodLink?: string;
	} = $props();

	const defaultStats: BenchmarkStat[] = [
		{
			label: 'Stop Gate Overhead',
			value: 0.11,
			suffix: 's',
			decimals: 2,
			duration: 1.0,
			detail: 'Added to a real test suite (median of 5 runs): 35.80s with Tekmor, 35.68s without. 41x less added time than an LLM judge (4.5s).'
		},
		{
			label: 'Validation Token Cost',
			value: 0,
			suffix: ' tokens',
			decimals: 0,
			duration: 0.8,
			detail: 'Zero LLM model calls or API tokens consumed for verification. 100% deterministic local Rust process execution.'
		},
		{
			label: 'Hallucinated Pass Catch Rate',
			value: 100,
			suffix: '%',
			decimals: 0,
			duration: 1.1,
			detail: 'Post-test code modifications immediately invalidate past receipts via git tree hashing. False victory claims blocked 100% of the time.'
		},
		{
			label: 'State Replay Latency',
			value: 4.8,
			suffix: ' ms',
			decimals: 1,
			duration: 0.9,
			detail: 'Time-travel state graph reconstruction from SQLite snapshots. 0 steps re-executed, 0 API tokens spent, zero model drift.'
		}
	];

	const displayStats = $derived(stats && stats.length > 0 ? stats : defaultStats);
</script>

<section id="benchmarks" use:scrollReveal={{ threshold: 0.05 }} class="py-24 border-t border-white/[0.08] bg-[#000000]">
	<div class="max-w-6xl mx-auto px-5 sm:px-8">
		<div class="max-w-2xl mx-auto text-center">
			<span class="text-xs font-mono-code uppercase tracking-wider text-neutral-400">{badge}</span>
			<h2 class="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-white">{title}</h2>
			<p class="mt-4 text-base text-neutral-400 leading-relaxed">
				{description}
			</p>
		</div>

		<div class="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-5">
			{#each displayStats as s (s.label)}
				<div
					class="rounded-2xl border border-white/[0.08] bg-[#0a0a0c] yc-card p-7 sm:p-8 hover:border-white/[0.22] hover:-translate-y-1 transition-all duration-200"
				>
					<div class="text-xs font-mono-code uppercase tracking-wider text-neutral-500">{s.label}</div>
					<div class="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-white font-mono-code flex items-baseline">
						{#if s.prefix}<span>{s.prefix}</span>{/if}
						<AnimatedNumber
							value={s.value}
							decimals={s.decimals ?? 0}
							duration={s.duration ?? 1}
							suffix={s.suffix ?? ''}
						/>
					</div>
					<p class="mt-4 text-sm text-neutral-400 leading-relaxed">{s.detail}</p>
				</div>
			{/each}
		</div>

		<div class="mt-12 text-center">
			<a
				href={methodLink}
				class="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white hover:text-black transition-colors"
			>
				See the full results and method
			</a>
		</div>
	</div>
</section>
