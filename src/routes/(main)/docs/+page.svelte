<script lang="ts">
	import { ArrowRight, BookOpen, Terminal, Shield, Workflow, CheckCircle, ExternalLink, Search } from 'lucide-svelte';
	import { products } from '#lib/data/products';

	const tekmor = products.tekmor;
	const thesmos = products.thesmos;

	let searchQuery = $state('');

	const tekmorDocs = [
		{ title: 'Installation', href: '/tekmor/docs/installation', desc: 'macOS Homebrew tap, crates.io, source build, and Claude Code hook registration.' },
		{ title: 'CLI Reference', href: '/tekmor/docs/cli', desc: 'tekmor verify, receipt, ratchet, drift, check-checks, and stop/bash gates.' },
		{ title: 'Verification & Receipts', href: '/tekmor/docs/verification', desc: 'Cryptographic tree hashes, exit code checks, verdicts (PASSED/FAILED/NOT VERIFIED).' },
		{ title: 'Known Limits', href: '/tekmor/docs/limits', desc: 'Keychain access boundaries, assistant message pattern matching, and platform scope.' }
	];

	const thesmosDocs = [
		{ title: 'Installation', href: '/thesmos/docs/installation', desc: 'Single-binary agent-spine installation, shell completion, and doctor check.' },
		{ title: 'Workflows & Node Kinds', href: '/thesmos/docs/workflows', desc: 'YAML schema, Agent, Verify, ApprovalGate, Fork/Join, and SpeculativeFork.' },
		{ title: 'agent-spine CLI', href: '/thesmos/docs/cli/agent-spine', desc: 'run, validate, inspect, replay, and built-in workflow scaffolding.' },
		{ title: 'Design Decisions', href: '/thesmos/docs/decisions', desc: 'Append-only SQLite architecture, deterministic state snapshots, and cognitive knapsacks.' },
		{ title: 'Troubleshooting', href: '/thesmos/docs/troubleshooting', desc: 'Dead-letter queues, execution recovery, and NATS fallback behaviors.' }
	];

	const filteredTekmor = $derived(
		tekmorDocs.filter((d) => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.desc.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const filteredThesmos = $derived(
		thesmosDocs.filter((d) => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.desc.toLowerCase().includes(searchQuery.toLowerCase()))
	);
</script>

<svelte:head>
	<title>Documentation — Autonomic AI</title>
	<meta name="description" content="Official documentation for tekmor (proof evals, tree receipts, stop gates) and thesmos (deterministic workflow DAGs)." />
</svelte:head>

<div class="yc-container py-12 md:py-20">
	<!-- Hero Section -->
	<header class="max-w-3xl">
		<div class="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-neutral-300">
			<span class="live-beacon"></span>
			<span>Autonomic AI Documentation</span>
		</div>
		<h1 class="mt-6 text-5xl sm:text-7xl font-black tracking-tight text-white leading-[1.02]">
			Documentation.
			<span class="block text-neutral-400 sm:text-neutral-500 font-bold mt-2 text-2xl sm:text-3xl md:text-4xl leading-[1.14]">
				Deterministic tools for coding agents.
			</span>
		</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-300 sm:text-lg">
			Comprehensive architectural guides, CLI references, verification schemas, and reproducible examples for Tekmor and Thesmos.
		</p>

		<!-- Search Bar -->
		<div class="relative mt-8 max-w-lg">
			<Search size={16} class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search docs (e.g. receipt, hook, approval gate, sqlite)..."
				class="w-full rounded-xl border border-white/[0.1] bg-[#0c0d10] py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:border-[#5fd39a] focus:outline-none focus:ring-1 focus:ring-[#5fd39a]"
			/>
		</div>
	</header>

	<!-- Documentation Grid -->
	<div class="mt-16 grid gap-12 lg:grid-cols-2">
		<!-- Tekmor Documentation Section -->
		<section class="space-y-6">
			<div class="flex items-center justify-between border-b border-white/[0.08] pb-4">
				<div class="flex items-center gap-3">
					<span class="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-white/[0.05] font-mono text-xs font-bold text-[#5fd39a]">
						T
					</span>
					<div>
						<h2 class="text-xl font-semibold text-white">tekmor</h2>
						<p class="text-xs text-neutral-400">Proof eval, cryptographic receipts, and Claude Code stop gates</p>
					</div>
				</div>
				<a href="/tekmor" class="text-xs font-medium text-[#5fd39a] hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap">
					Product site <ArrowRight size={11} />
				</a>
			</div>

			<div class="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-[1px] shadow-xl">
				<div class="divide-y divide-white/[0.06] rounded-[15px] bg-[#090a0d] overflow-hidden">
					{#each filteredTekmor as doc (doc.href)}
						<a
							href={doc.href}
							class="group block p-5 transition-colors hover:bg-[#0e1015]"
						>
							<div class="flex items-center justify-between">
								<h3 class="text-sm font-semibold text-white group-hover:text-[#5fd39a] transition-colors">{doc.title}</h3>
								<ArrowRight size={13} class="text-neutral-500 transition-transform group-hover:translate-x-1 group-hover:text-[#5fd39a]" />
							</div>
							<p class="mt-2 text-xs leading-relaxed text-neutral-400">{doc.desc}</p>
						</a>
					{/each}
				</div>
			</div>
		</section>

		<!-- Thesmos Documentation Section -->
		<section class="space-y-6">
			<div class="flex items-center justify-between border-b border-white/[0.08] pb-4">
				<div class="flex items-center gap-3">
					<span class="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-white/[0.05] font-mono text-xs font-bold text-blue-400">
						S
					</span>
					<div>
						<h2 class="text-xl font-semibold text-white">thesmos</h2>
						<p class="text-xs text-neutral-400">Deterministic YAML DAG workflows and append-only SQLite snapshots</p>
					</div>
				</div>
				<a href="/thesmos" class="text-xs font-medium text-blue-400 hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap">
					Product site <ArrowRight size={11} />
				</a>
			</div>

			<div class="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-[1px] shadow-xl">
				<div class="divide-y divide-white/[0.06] rounded-[15px] bg-[#090a0d] overflow-hidden">
					{#each filteredThesmos as doc (doc.href)}
						<a
							href={doc.href}
							class="group block p-5 transition-colors hover:bg-[#0e1015]"
						>
							<div class="flex items-center justify-between">
								<h3 class="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{doc.title}</h3>
								<ArrowRight size={13} class="text-neutral-500 transition-transform group-hover:translate-x-1 group-hover:text-blue-400" />
							</div>
							<p class="mt-2 text-xs leading-relaxed text-neutral-400">{doc.desc}</p>
						</a>
					{/each}
				</div>
			</div>
		</section>
	</div>

	<!-- Architectural Overview Callout -->
	<div class="mt-16 rounded-2xl border border-white/[0.12] bg-[#090a0d] p-8">
		<div class="grid gap-8 lg:grid-cols-3">
			<div>
				<span class="font-mono text-xs uppercase tracking-widest text-[#5fd39a]">Security Invariant</span>
				<h3 class="mt-2 text-base font-semibold text-white">0 Model Tokens on Gates</h3>
				<p class="mt-2 text-xs leading-relaxed text-neutral-400">
					Gates and verification are 100% deterministic Rust processes. Neither tool calls an LLM or spends your API tokens to decide if tests passed.
				</p>
			</div>
			<div>
				<span class="font-mono text-xs uppercase tracking-widest text-[#5fd39a]">Cryptographic Proof</span>
				<h3 class="mt-2 text-base font-semibold text-white">Tree SHA Verification</h3>
				<p class="mt-2 text-xs leading-relaxed text-neutral-400">
					Receipts bind test exit codes to git tree SHAs. Any code modification after a test immediately invalidates the receipt as STALE.
				</p>
			</div>
			<div>
				<span class="font-mono text-xs uppercase tracking-widest text-[#5fd39a]">Time-Travel Replay</span>
				<h3 class="mt-2 text-base font-semibold text-white">Append-Only SQLite</h3>
				<p class="mt-2 text-xs leading-relaxed text-neutral-400">
					Every DAG step writes an immutable state snapshot to SQLite. Workflows can be inspected and replayed without re-running LLMs.
				</p>
			</div>
		</div>
	</div>
</div>
