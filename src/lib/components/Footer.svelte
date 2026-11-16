<script lang="ts">
	import {
		Layers,
		BookOpen,
		Newspaper,
		ExternalLink,
		Terminal,
		FileCode2,
		Sparkles,
		ShieldCheck,
		ArrowRight
	} from 'lucide-svelte';
	import { scrollReveal } from '#lib/actions/scrollReveal';
	import type { Product } from '#lib/data/products';

	let {
		brand = 'org',
		product
	}: {
		brand?: 'org' | 'tekmor' | 'thesmos';
		product?: Product;
	} = $props();

	const isTekmor = $derived(brand === 'tekmor');
	const isThesmos = $derived(brand === 'thesmos');
	const isOrg = $derived(brand === 'org');

	const watermarkText = $derived(isTekmor ? 'Tekmor' : isThesmos ? 'Thesmos' : 'Autonomic AI');

	const ctaTitle = $derived(
		isTekmor
			? 'Start with Tekmor.'
			: isThesmos
				? 'Start with Thesmos.'
				: 'Start with Autonomic AI.'
	);

	const ctaDesc = $derived(
		isTekmor
			? 'Zero-overhead cryptographic proof gates for coding agents. Eliminate hallucinated pass claims with tree-hashed receipts.'
			: isThesmos
				? 'Replace chaotic prompt loops with deterministic YAML DAGs, approval gates, and SQLite state replay.'
				: 'Deterministic proof evaluation, stop gates, and workflow governors for coding agents. Zero unverified tool calls.'
	);

	const ctaHref = $derived(
		isTekmor ? '/tekmor/docs' : isThesmos ? '/thesmos/docs' : '/docs'
	);

	const ctaButtonText = $derived(
		isTekmor ? 'Read Tekmor docs →' : isThesmos ? 'Read Thesmos docs →' : 'Explore the docs →'
	);
</script>

<footer id="footer" class="border-t border-white/[0.08] bg-[#070709] pt-4 pb-12">
	<div class="yc-container">
		<!-- Pre-Footer CTA with Bidirectional Scroll Reveal -->
		<div
			use:scrollReveal={{ delay: 0 }}
			class="py-20 sm:py-24 text-center border-b border-white/[0.08]"
		>
			<h2 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-5">
				{ctaTitle}
			</h2>
			<p class="text-sm sm:text-base lg:text-lg text-neutral-400 max-w-xl mx-auto mb-8 leading-relaxed">
				{ctaDesc}
			</p>
			<div class="flex flex-wrap items-center justify-center gap-4">
				<a
					href={ctaHref}
					class="px-7 py-3 rounded-full bg-white text-black hover:bg-neutral-200 text-sm font-semibold transition-all shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98]"
				>
					{ctaButtonText}
				</a>
				{#if !isOrg}
					<a
						href="/"
						class="px-6 py-3 rounded-full border border-white/[0.12] bg-white/[0.03] text-neutral-300 hover:text-white hover:bg-white/[0.06] text-sm font-medium transition-all"
					>
						← Ecosystem Home
					</a>
				{/if}
			</div>
		</div>

		<!-- Main 5-Column Navigation Grid -->
		<div
			use:scrollReveal={{ delay: 80 }}
			class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-6 py-12 border-b border-white/[0.06]"
		>
			<!-- Col 1: Brand & Status -->
			<div class="col-span-2 md:col-span-4 lg:col-span-1 space-y-3.5">
				<div class="flex items-center gap-2.5">
					<div
						class="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center"
					>
						<span class="font-mono text-xs font-bold text-[#5fd39a]">
							{isTekmor ? 'T' : isThesmos ? 'S' : 'A'}
						</span>
					</div>
					<span class="font-bold text-white text-base tracking-tight">{watermarkText}</span>
				</div>
				<p class="text-neutral-400 text-xs leading-relaxed">
					Deterministic proof-of-evidence execution engine and workflow governor for coding agents.
					Zero LLM calls.
				</p>
				<div
					class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-[#5fd39a]"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 live-beacon"></span>
					<span>Deterministic Gates Active</span>
				</div>
			</div>

			<!-- Col 2: Guides & Documentation -->
			<div>
				<h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-300 font-mono mb-4">
					Guides & Docs
				</h3>
				<ul class="space-y-2.5 text-xs text-neutral-400">
					{#if isTekmor}
						<li>
							<a href="/tekmor/docs" class="hover:text-white transition-colors">Overview</a>
						</li>
						<li>
							<a href="/tekmor/docs/installation" class="hover:text-white transition-colors">Installation</a>
						</li>
						<li>
							<a href="/tekmor/docs/cli" class="hover:text-white transition-colors">CLI Reference</a>
						</li>
						<li>
							<a href="/tekmor/docs/verification" class="hover:text-white transition-colors">Verification & Receipts</a>
						</li>
						<li>
							<a href="/tekmor/docs/limits" class="hover:text-white transition-colors">Honest Boundaries</a>
						</li>
					{:else if isThesmos}
						<li>
							<a href="/thesmos/docs" class="hover:text-white transition-colors">Overview</a>
						</li>
						<li>
							<a href="/thesmos/docs/installation" class="hover:text-white transition-colors">Installation</a>
						</li>
						<li>
							<a href="/thesmos/docs/cli/agent-spine" class="hover:text-white transition-colors">CLI (agent-spine)</a>
						</li>
						<li>
							<a href="/thesmos/docs/workflows" class="hover:text-white transition-colors">DAG Workflows Spec</a>
						</li>
						<li>
							<a href="/thesmos/docs/decisions" class="hover:text-white transition-colors">Architecture Decisions</a>
						</li>
					{:else}
						<li>
							<a href="/tekmor/docs" class="hover:text-white transition-colors">Tekmor Documentation</a>
						</li>
						<li>
							<a href="/thesmos/docs" class="hover:text-white transition-colors">Thesmos Documentation</a>
						</li>
						<li>
							<a href="/tekmor/docs/installation" class="hover:text-white transition-colors">Installation Guide</a>
						</li>
						<li>
							<a href="/tekmor/docs/verification" class="hover:text-white transition-colors">Tree-Hashed Receipts</a>
						</li>
						<li>
							<a href="/thesmos/docs/workflows" class="hover:text-white transition-colors">Deterministic DAGs</a>
						</li>
					{/if}
				</ul>
			</div>

			<!-- Col 3: Architecture & Concepts -->
			<div>
				<h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-300 font-mono mb-4">
					Architecture
				</h3>
				<ul class="space-y-2.5 text-xs text-neutral-400">
					<li>
						<a href="/tekmor/docs/verification" class="hover:text-white transition-colors">
							Tree-Hashed Receipts
						</a>
					</li>
					<li>
						<a href="/tekmor/docs/cli" class="hover:text-white transition-colors">
							Claude Code Stop Hook
						</a>
					</li>
					<li>
						<a href="/thesmos/docs/workflows" class="hover:text-white transition-colors">
							Prompt Loops vs DAGs
						</a>
					</li>
					<li>
						<a href="/thesmos/docs/cli/agent-spine" class="hover:text-white transition-colors">
							Append-Only SQLite Replay
						</a>
					</li>
					<li>
						<a href="/tekmor/docs/limits" class="hover:text-white transition-colors">
							Honest Limits & Boundaries
						</a>
					</li>
				</ul>
			</div>

			<!-- Col 4: Developer Tools & CLI -->
			<div>
				<h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-300 font-mono mb-4">
					Developer Tools
				</h3>
				<ul class="space-y-2.5 text-xs text-neutral-400">
					<li>
						<a
							href="https://github.com/autonomic-ai-dev/homebrew-tap"
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-white transition-colors flex items-center gap-1.5"
						>
							<Terminal size={13} class="text-neutral-400" />
							<span>brew tap autonomic-ai-dev</span>
							<ExternalLink size={10} class="text-neutral-500 ml-auto" />
						</a>
					</li>
					<li>
						<a href="/tekmor/docs/cli" class="hover:text-white transition-colors flex items-center gap-1.5">
							<ShieldCheck size={13} class="text-neutral-400" />
							<span>tekmor verify CLI</span>
						</a>
					</li>
					<li>
						<a href="/thesmos/docs/cli/agent-spine" class="hover:text-white transition-colors flex items-center gap-1.5">
							<Layers size={13} class="text-neutral-400" />
							<span>agent-spine CLI</span>
						</a>
					</li>
					<li>
						<a href="/tekmor/docs/verification" class="hover:text-white transition-colors flex items-center gap-1.5">
							<Sparkles size={13} class="text-neutral-400" />
							<span>receipt.json Schema</span>
						</a>
					</li>
					<li>
						<a
							href="https://github.com/autonomic-ai-dev"
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-white transition-colors flex items-center gap-1.5"
						>
							<span>GitHub Releases</span>
							<ExternalLink size={10} class="text-neutral-500 ml-auto" />
						</a>
					</li>
				</ul>
			</div>

			<!-- Col 5: Context & Community -->
			<div>
				<h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-300 font-mono mb-4">
					Context & Specs
				</h3>
				<ul class="space-y-2.5 text-xs text-neutral-400">
					<li>
						<a
							href={isTekmor ? '/tekmor/changelog' : isThesmos ? '/thesmos/changelog' : '/changelog'}
							class="hover:text-white transition-colors flex items-center gap-1.5"
						>
							<Sparkles size={13} class="text-neutral-400" />
							<span>Changelog & Releases</span>
						</a>
					</li>
					<li>
						<a
							href={isTekmor ? '/tekmor/blog' : isThesmos ? '/thesmos/blog' : '/blog'}
							class="hover:text-white transition-colors flex items-center gap-1.5"
						>
							<Newspaper size={13} class="text-neutral-400" />
							<span>Engineering Blog</span>
						</a>
					</li>
					<li>
						<a
							href="https://github.com/autonomic-ai-dev"
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-white transition-colors flex items-center gap-1.5"
						>
							<BookOpen size={13} class="text-neutral-400" />
							<span>GitHub Repository</span>
							<ExternalLink size={10} class="text-neutral-500 ml-auto" />
						</a>
					</li>
					<li>
						<a
							href="https://autonomic-ai.openstatus.dev"
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-white transition-colors flex items-center gap-1.5"
						>
							<span class="live-beacon"></span>
							<span>Live Systems Status</span>
							<ExternalLink size={10} class="text-neutral-500 ml-auto" />
						</a>
					</li>
					<li>
						<a
							href="/llms.txt"
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-white font-mono text-[11px] transition-colors flex items-center gap-1.5"
						>
							<FileCode2 size={13} class="text-neutral-400" />
							<span>/llms.txt</span>
						</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Sub-Footer -->
		<div
			use:scrollReveal={{ delay: 120 }}
			class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-mono"
		>
			<div>
				© 2026 Autonomic AI. Open source under Apache 2.0 license.
			</div>
			<div
				class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-neutral-300 text-xs"
			>
				<span class="w-1.5 h-1.5 rounded-full bg-[#5fd39a] live-beacon"></span>
				<span>Compiled with Rust 1.85+ • Bare-Metal Local-First Native • 0 LLM Calls</span>
			</div>
		</div>

		<!-- Giant Watermark Logo -->
		<div
			id="watermark"
			class="pt-16 sm:pt-20 pb-4 overflow-hidden select-none pointer-events-none text-center"
		>
			<span
				class="text-[90px] sm:text-[150px] lg:text-[210px] xl:text-[240px] font-black tracking-tighter bg-gradient-to-b from-white/[0.22] via-white/[0.09] to-white/[0.02] bg-clip-text text-transparent leading-none block font-sans"
			>
				{watermarkText}
			</span>
		</div>
	</div>
</footer>
