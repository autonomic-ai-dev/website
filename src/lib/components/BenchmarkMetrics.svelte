<script lang="ts">
	import { onMount } from 'svelte';
	import { Gauge, ShieldCheck, Zap, Cpu, CheckCircle2, XCircle } from 'lucide-svelte';
	import AnimatedNumber from './AnimatedNumber.svelte';

	let inView = $state(false);
	let containerRef: HTMLElement | undefined = $state();

	onMount(() => {
		if (!containerRef) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					inView = entry.isIntersecting;
				}
			},
			{ threshold: 0.15 }
		);
		observer.observe(containerRef);
		return () => observer.disconnect();
	});
</script>

<section id="benchmarks" bind:this={containerRef} class="yc-section yc-crosshair relative">
	<div class="mb-12 flex flex-col gap-2">
		<span class="yc-label">03 <b>/</b> Empirical Benchmarks</span>
		<h2 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
			Deterministic Verification vs Prompt Hallucinations
		</h2>
		<p class="max-w-2xl text-sm leading-relaxed text-neutral-400">
			Measured on Apple Silicon (M3 Max) against standard Claude Code and autonomous agent
			workflows. Hard cryptographic gates replace probabilistic completions with zero token cost.
		</p>
	</div>

	<!-- Top Metric Cards Grid -->
	<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
		<!-- Metric 1 -->
		<div class="yc-card p-5 sm:p-6 transition-all hover:border-white/[0.2]">
			<div class="flex items-center justify-between text-neutral-400">
				<span class="font-mono text-xs text-[#5fd39a]">TOKEN SPEND</span>
				<Zap size={15} class="text-[#5fd39a]" />
			</div>
			<div
				class="mt-4 flex items-baseline gap-1 font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl"
			>
				<AnimatedNumber value={0} duration={1} />
				<span class="text-xs font-normal text-neutral-400">tokens</span>
			</div>
			<p class="mt-2 text-xs text-neutral-400">
				Zero LLM model calls or API tokens consumed for verification.
			</p>
			<div class="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-[#5fd39a]">
				<CheckCircle2 size={12} />
				<span>100% deterministic local Rust</span>
			</div>
		</div>

		<!-- Metric 2 -->
		<div class="yc-card p-5 sm:p-6 transition-all hover:border-white/[0.2]">
			<div class="flex items-center justify-between text-neutral-400">
				<span class="font-mono text-xs text-[#ff7a4a]">VERIFICATION SPEED</span>
				<Gauge size={15} class="text-[#ff7a4a]" />
			</div>
			<div
				class="mt-4 flex items-baseline gap-1 font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl"
			>
				<AnimatedNumber value={0.38} decimals={2} suffix="s" duration={1.2} />
			</div>
			<p class="mt-2 text-xs text-neutral-400">
				14 allowlisted test checks completed and receipt sealed.
			</p>
			<div class="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-[#ff7a4a]">
				<CheckCircle2 size={12} />
				<span>118x faster than LLM judges</span>
			</div>
		</div>

		<!-- Metric 3 -->
		<div class="yc-card p-5 sm:p-6 transition-all hover:border-white/[0.2]">
			<div class="flex items-center justify-between text-neutral-400">
				<span class="font-mono text-xs text-emerald-400">DRIFT PREVENTION</span>
				<ShieldCheck size={15} class="text-emerald-400" />
			</div>
			<div
				class="mt-4 flex items-baseline gap-1 font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl"
			>
				<AnimatedNumber value={100} suffix="%" duration={1.1} />
			</div>
			<p class="mt-2 text-xs text-neutral-400">
				Post-test code changes immediately invalidate past receipts.
			</p>
			<div class="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
				<CheckCircle2 size={12} />
				<span>Tree SHA cryptographic match</span>
			</div>
		</div>

		<!-- Metric 4 -->
		<div class="yc-card p-5 sm:p-6 transition-all hover:border-white/[0.2]">
			<div class="flex items-center justify-between text-neutral-400">
				<span class="font-mono text-xs text-blue-400">RUNTIME RSS</span>
				<Cpu size={15} class="text-blue-400" />
			</div>
			<div
				class="mt-4 flex items-baseline gap-1 font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl"
			>
				<AnimatedNumber prefix="< " value={8} suffix=" MB" duration={1.2} />
			</div>
			<p class="mt-2 text-xs text-neutral-400">
				Compact native binary without daemon or container runtime.
			</p>
			<div class="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-blue-400">
				<CheckCircle2 size={12} />
				<span>99% lighter than container evals</span>
			</div>
		</div>
	</div>

	<!-- Comparative Visual Progress Bars -->
	<div class="mt-8 rounded-2xl border border-white/[0.1] bg-[#090a0d] p-6 sm:p-8 shadow-2xl">
		<h3 class="text-base font-semibold text-white">Execution Loop Comparison</h3>
		<p class="mt-1 text-xs text-neutral-400">
			Comparing token consumption and latency per single agent turn verification.
		</p>

		<div class="mt-6 space-y-6">
			<!-- Bar 1: Verification Duration -->
			<div>
				<div class="flex items-center justify-between font-mono text-xs text-neutral-300">
					<span class="font-medium text-white">Verification Duration (Lower is better)</span>
					<span class="text-[#ff7a4a] font-semibold">118x Faster</span>
				</div>
				<div class="mt-2.5 space-y-2">
					<!-- Tekmor -->
					<div>
						<div class="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
							<span class="text-white flex items-center gap-1">
								<span class="h-1.5 w-1.5 rounded-full bg-[#5fd39a]"></span> Tekmor Isolated Subshell
							</span>
							<span class="text-[#5fd39a] font-semibold">
								<AnimatedNumber value={0.38} decimals={2} suffix="s" />
							</span>
						</div>
						<div class="h-2 w-full rounded-full bg-white/[0.05] overflow-hidden">
							<div
								class="h-full rounded-full bg-gradient-to-r from-[#5fd39a] to-emerald-400 transition-all duration-1000 ease-out"
								style="width: {inView ? '2.5%' : '0%'}"
							></div>
						</div>
					</div>

					<!-- LLM Re-reading log -->
					<div>
						<div class="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
							<span class="text-neutral-400 flex items-center gap-1">
								<span class="h-1.5 w-1.5 rounded-full bg-red-400"></span> LLM Log Inspector Prompt
							</span>
							<span class="text-red-400 font-semibold">
								<AnimatedNumber value={45.2} decimals={1} suffix="s" />
							</span>
						</div>
						<div class="h-2 w-full rounded-full bg-white/[0.05] overflow-hidden">
							<div
								class="h-full rounded-full bg-gradient-to-r from-red-500/60 to-red-500 transition-all duration-1000 ease-out"
								style="width: {inView ? '100%' : '0%'}"
							></div>
						</div>
					</div>
				</div>
			</div>

			<!-- Bar 2: Token Overhead -->
			<div class="pt-4 border-t border-white/[0.06]">
				<div class="flex items-center justify-between font-mono text-xs text-neutral-300">
					<span class="font-medium text-white">Verification Token Cost (Lower is better)</span>
					<span class="text-[#5fd39a] font-semibold">0 API Tokens</span>
				</div>
				<div class="mt-2.5 space-y-2">
					<!-- Tekmor -->
					<div>
						<div class="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
							<span class="text-white flex items-center gap-1">
								<span class="h-1.5 w-1.5 rounded-full bg-[#5fd39a]"></span> Tekmor Local Cryptographic
								Receipt
							</span>
							<span class="text-[#5fd39a] font-semibold">
								<AnimatedNumber value={0} suffix=" tokens" />
							</span>
						</div>
						<div class="h-2 w-full rounded-full bg-white/[0.05] overflow-hidden">
							<div
								class="h-full rounded-full bg-[#5fd39a] transition-all duration-1000 ease-out"
								style="width: {inView ? '1%' : '0%'}"
							></div>
						</div>
					</div>

					<!-- Agent LLM judge -->
					<div>
						<div class="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
							<span class="text-neutral-400 flex items-center gap-1">
								<span class="h-1.5 w-1.5 rounded-full bg-red-400"></span> Multi-turn LLM Completion Loop
							</span>
							<span class="text-red-400 font-semibold">
								<AnimatedNumber value={14200} suffix=" tokens" />
							</span>
						</div>
						<div class="h-2 w-full rounded-full bg-white/[0.05] overflow-hidden">
							<div
								class="h-full rounded-full bg-gradient-to-r from-red-500/60 to-red-500 transition-all duration-1000 ease-out"
								style="width: {inView ? '100%' : '0%'}"
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
