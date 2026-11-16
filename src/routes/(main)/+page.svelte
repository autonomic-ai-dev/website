<script lang="ts">
	import {
		ArrowRight,
		Check,
		Copy,
		Shield,
		Database,
		Terminal as TerminalIcon,
		CheckCircle2,
		AlertTriangle,
		XCircle,
		CheckCircle,
		Layers
	} from 'lucide-svelte';
	import AnimatedNumber from '#lib/components/AnimatedNumber.svelte';
	import EcosystemBar from '#lib/components/EcosystemBar.svelte';
	import BenchmarkMetrics from '#lib/components/BenchmarkMetrics.svelte';
	import DriftComparison from '#lib/components/DriftComparison.svelte';
	import BentoPillars, { type Pillar } from '#lib/components/BentoPillars.svelte';
	import FAQSection, { type FAQItem } from '#lib/components/FAQSection.svelte';
	import { scrollReveal } from '#lib/actions/scrollReveal';
	import { products } from '#lib/data/products';

	const tool = products.tekmor;
	const spine = products.thesmos;

	type HeroTab = 'governor' | 'thesmos' | 'tekmor' | 'receipt';
	let heroTab = $state<HeroTab>('governor');

	type InstallTab = 'tap' | 'tekmor' | 'thesmos';
	let installTab = $state<InstallTab>('tap');
	let copiedInstall = $state(false);

	const installCommands: Record<InstallTab, string> = {
		tap: 'brew tap autonomic-ai-dev/tap',
		tekmor: 'brew install autonomic-ai-dev/tap/tekmor',
		thesmos: 'brew install autonomic-ai-dev/tap/agent-spine'
	};

	async function copyCurrentInstall() {
		try {
			await navigator.clipboard.writeText(installCommands[installTab]);
			copiedInstall = true;
			setTimeout(() => (copiedInstall = false), 1500);
		} catch {
			copiedInstall = false;
		}
	}

	let copiedTekmor = $state(false);
	let copiedSpine = $state(false);

	async function copyTekmor() {
		try {
			await navigator.clipboard.writeText(tool.install);
			copiedTekmor = true;
			setTimeout(() => (copiedTekmor = false), 1500);
		} catch {
			copiedTekmor = false;
		}
	}

	async function copySpine() {
		try {
			await navigator.clipboard.writeText(spine.install);
			copiedSpine = true;
			setTimeout(() => (copiedSpine = false), 1500);
		} catch {
			copiedSpine = false;
		}
	}

	const pillars: Pillar[] = [
		{
			badge: '01',
			title: '0 Model Calls',
			desc: 'Validation never spends API tokens or calls an LLM judge. 100% deterministic local Rust execution with nanosecond latency.',
			tag: 'Local Rust Engine',
			icon: Shield,
			snippet: `$ tekmor verify -- cargo test
✔ 14 checks passed in 0.38s
✔ Model calls made: 0 · Tokens consumed: 0`,
			statusLabel: 'Zero token expenditure'
		},
		{
			badge: '02',
			title: 'Allowlisted Process Gates',
			desc: 'Agents run only explicitly pre-approved commands defined in .verify/verify.toml. Hallucinated, unlisted, or dangerous bash commands are rejected.',
			tag: '.verify/verify.toml',
			icon: TerminalIcon,
			snippet: `[[commands]]
name = "test"
run = "cargo test --test repro"
timeout_seconds = 60`,
			statusLabel: 'Strict command allowlist'
		},
		{
			badge: '03',
			title: 'Tree-Hashed Receipts',
			desc: 'Every test run cryptographically binds to the git commit and directory tree SHA. Modifying any tracked file immediately invalidates past passes.',
			tag: 'Merkle Tree SHA',
			icon: CheckCircle2,
			snippet: `Checking tree SHA: 4f9a2b8e...
Status: PASSED · Stale: false
Turn verdict: PERMITTED`,
			statusLabel: 'Cryptographic proof contract'
		},
		{
			badge: '04',
			title: 'Append-Only SQLite State',
			desc: 'Thesmos workflows append immutable step snapshots to SQLite. Time-travel replay reconstructs history in <5ms without re-running agent steps.',
			tag: 'Time-Travel Replay',
			icon: Database,
			snippet: `$ thesmos replay exec_8f12a0
Reconstructed 4 DAG steps in 4.8ms
Zero model API calls`,
			statusLabel: 'Immutable audit trail'
		}
	];

	const faqs: FAQItem[] = [
		{
			q: 'How do Thesmos and Tekmor work together in an agent development loop?',
			a: 'Thesmos (agent-spine) defines the deterministic execution plan: a directed acyclic graph (DAG) specifying reproduction, agent repair, verification gates, and human sign-off steps. Tekmor provides cryptographic enforcement inside verification nodes and Claude Code stop hooks. An agent cannot wander off script or declare victory without a fresh, valid receipt signed for the exact files on disk.'
		},
		{
			q: 'Why do coding agents claim tests pass when they actually failed?',
			a: 'Language models produce plausible-sounding completions. When an agent runs a complex test suite or bash command, it frequently misreads exit codes, hallucinated assertions, or assumes completion prematurely. Tekmor introduces a hard stop gate in Claude Code hooks: an agent saying the tests passed without a cryptographically verified receipt for the exact current code is physically blocked.'
		},
		{
			q: 'How does an immutable SQLite snapshot save LLM tokens during debugging?',
			a: 'In unstructured agent loops, investigating a failure or reviewing past decisions requires re-running expensive LLM context windows or scraping chat logs. Thesmos appends an immutable row to SQLite after every node execution. Running `agent-spine replay` reads the snapshots and reconstructs the full state graph in under 5ms with zero token expenditure and zero model API calls.'
		},
		{
			q: 'How does a cryptographic tree receipt work under the hood?',
			a: 'When `tekmor verify` runs an allowlisted command, it records the exit status, stdout/stderr, git commit, and tree hash into a local receipt (.verify/receipt.json). If any tracked file is touched afterward, the tree hash changes and the receipt is immediately marked STALE.'
		},
		{
			q: 'Do either of these tools send telemetry or open network ports?',
			a: 'No. Tekmor and Thesmos run 100% locally on your machine. Both tools make 0 model calls and open 0 network connections (apart from initial Homebrew binary download). Your code, logs, and execution traces never leave your machine.'
		},
		{
			q: 'Can I use them with Claude Code, Cursor, Codex, or my own agent harness?',
			a: 'Yes. Tekmor hooks directly into Claude Code via `tekmor install` and can also be called directly from zsh, bash, or CI. Thesmos runs deterministic YAML workflows for any coding agent setup.'
		}
	];

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Autonomic AI',
		url: 'https://autonomic-ai.dev',
		description:
			'Deterministic proof evaluation and workflow governors for autonomous coding agents.'
	};
</script>

<svelte:head>
	<title>Autonomic AI — Autonomous Engineering with Deterministic Boundaries</title>
	<meta
		name="description"
		content="Local-first deterministic orchestrator and cryptographic verification stop gates for coding agents. Zero unverified tool calls."
	/>
	<meta property="og:type" content="website" />
	<meta
		property="og:title"
		content="Autonomic AI — Autonomous Engineering with Deterministic Boundaries"
	/>
	<meta
		property="og:description"
		content="Local-first deterministic orchestrator and cryptographic verification stop gates for coding agents."
	/>
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<!-- Constrained Width Container for the Entire Page with Ample Left Clearance from Vertical Conduit -->
<div class="yc-container pl-10 sm:pl-14 md:pl-16 lg:pl-20">
	<!-- Hero Section with Ambient Glow (Anode Parity) -->
	<section class="pt-24 sm:pt-32 pb-16 relative overflow-hidden bg-[#000000]">
		<!-- Subtle Top Radial Glow -->
		<div
			class="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[480px] w-[750px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,83,26,0.12),transparent_70%)] blur-3xl"
		></div>

		<!-- Top Monospace Release Pill (Anode Parity) -->
		<div class="flex flex-wrap items-center gap-2 mb-8 text-xs font-mono-code text-neutral-400">
			<span class="w-2 h-2 rounded-full bg-[#ff531a] animate-pulse"></span>
			<span class="text-white font-medium">Local-First</span>
			<span class="text-neutral-600">•</span>
			<span>Deterministic DAGs &amp; Proof Stop Gates</span>
			<span class="text-neutral-600">•</span>
			<span class="text-neutral-500">Apache 2.0 Open Source</span>
		</div>

		<!-- Two-Column Balanced Hero Grid (Anode Parity) -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12">
			<!-- Left Column (span 7): Title, Mission & Invariant Bullets -->
			<div class="lg:col-span-7 flex flex-col justify-between space-y-6">
				<h1 class="text-5xl sm:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[1.02]">
					Autonomic AI.
					<span class="block text-neutral-500 font-bold mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-[2.2rem] xl:text-[2.6rem] leading-[1.14]">
						Autonomous engineering with deterministic boundaries.
					</span>
				</h1>

				<p class="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal max-w-xl">
					Orchestrate the workflow. Cryptographically verify the code. Two local-first systems for coding agents:
					<strong class="font-medium text-blue-400">Thesmos</strong> orchestrates multi-step DAG
					workflows with append-only SQLite snapshots, while
					<strong class="font-medium text-[#5fd39a]">Tekmor</strong> blocks hallucinated pass claims
					with cryptographic tree receipts.
				</p>

				<!-- Trust Checklist (Anode Parity) -->
				<div class="flex flex-wrap items-center gap-5 text-xs font-mono-code text-neutral-400 pt-2">
					<div class="flex items-center gap-1.5">
						<span class="text-[#ff7a4a] font-bold">✓</span>
						<span>0 Model Calls (100% Rust)</span>
					</div>
					<div class="flex items-center gap-1.5">
						<span class="text-[#ff7a4a] font-bold">✓</span>
						<span>Tree-Hashed Receipts</span>
					</div>
					<div class="flex items-center gap-1.5">
						<span class="text-[#ff7a4a] font-bold">✓</span>
						<span>Append-Only SQLite</span>
					</div>
				</div>
			</div>

			<!-- Right Column (span 5): Quickstart Install Box & Action Buttons -->
			<div id="quickstart" class="lg:col-span-5 space-y-4 pt-1">
				<!-- Install Box with Tab Switcher (Anode Parity) -->
				<div class="rounded-2xl border border-white/[0.12] bg-[#0c0c0f] hover:border-white/[0.28] transition-all p-4 shadow-2xl">
					<div class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.06] text-xs font-mono-code text-neutral-400">
						<div class="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-lg border border-white/[0.06]">
							{#each [
								{ id: 'tap' as const, label: 'brew tap' },
								{ id: 'tekmor' as const, label: 'tekmor' },
								{ id: 'thesmos' as const, label: 'thesmos' }
							] as tab (tab.id)}
								<button
									type="button"
									onclick={() => (installTab = tab.id)}
									class="relative px-2.5 py-0.5 text-[11px] font-mono-code rounded transition-colors {installTab === tab.id ? 'bg-white text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'}"
								>
									{tab.label}
								</button>
							{/each}
						</div>
						<span class="text-[11px] text-neutral-500 font-mono-code">macOS arm64 / linux amd64</span>
					</div>

					<div class="flex items-center justify-between gap-3 font-mono-code text-xs sm:text-sm">
						<div class="flex items-center gap-2 overflow-x-auto no-scrollbar truncate text-neutral-200">
							<span class="text-[#ff7a4a] font-bold select-none">$</span>
							<span class="truncate">{installCommands[installTab]}</span>
						</div>
						<button
							type="button"
							onclick={copyCurrentInstall}
							class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.08] border border-white/[0.12] hover:bg-white/[0.16] text-xs font-mono-code text-neutral-200 transition-colors shrink-0"
							aria-label="Copy install command"
						>
							{#if copiedInstall}
								<span class="text-[#ff7a4a] font-bold">Copied</span>
							{:else}
								<Copy class="w-3.5 h-3.5" />
								<span>Copy</span>
							{/if}
						</button>
					</div>
				</div>

				<!-- CTA Button Row (Anode Parity) -->
				<div class="flex flex-wrap items-center gap-3 pt-2">
					<a
						href="/docs"
						class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-neutral-200 text-sm font-semibold transition-all shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98]"
					>
						<span>Explore Documentation</span>
						<ArrowRight class="w-4 h-4" />
					</a>
					<a
						href="#how-it-works"
						class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/20 text-neutral-300 hover:text-white hover:border-white/40 text-sm font-medium transition-all"
					>
						<span>Compare Engines</span>
					</a>
				</div>

				<p class="text-xs text-neutral-500 font-mono-code pt-1">
					Free and open source under Apache 2.0. 100% local Rust execution. Zero LLM calls.
				</p>
			</div>
		</div>

		<!-- Centerpiece Interactive Terminal (Anode Parity) -->
		<div class="relative w-full my-8">
			<div class="rounded-2xl border border-white/[0.12] bg-[#07080a] shadow-2xl overflow-hidden">
				<!-- Terminal Header with Tabs -->
				<div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] bg-[#0c0d10] px-4 py-2.5">
					<div class="flex items-center gap-2">
						<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
						<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
						<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
					</div>

					<div class="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono-code">
						<button
							type="button"
							onclick={() => (heroTab = 'governor')}
							class="rounded-md px-2.5 py-1 font-medium transition-colors {heroTab === 'governor'
								? 'bg-[#ff531a]/15 text-[#ff7a4a] border border-[#ff531a]/30'
								: 'text-neutral-400 hover:text-white'}"
						>
							⚡ Closed-Loop Governor
						</button>
						<button
							type="button"
							onclick={() => (heroTab = 'thesmos')}
							class="rounded-md px-2.5 py-1 font-medium transition-colors {heroTab === 'thesmos'
								? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
								: 'text-neutral-400 hover:text-white'}"
						>
							🔄 Thesmos DAG
						</button>
						<button
							type="button"
							onclick={() => (heroTab = 'tekmor')}
							class="rounded-md px-2.5 py-1 font-medium transition-colors {heroTab === 'tekmor'
								? 'bg-[#5fd39a]/15 text-[#5fd39a] border border-[#5fd39a]/30'
								: 'text-neutral-400 hover:text-white'}"
						>
							🛡️ Tekmor Gate
						</button>
						<button
							type="button"
							onclick={() => (heroTab = 'receipt')}
							class="rounded-md px-2.5 py-1 font-medium transition-colors {heroTab === 'receipt'
								? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
								: 'text-neutral-400 hover:text-white'}"
						>
							📋 Receipt Schema
						</button>
					</div>
				</div>

				<!-- Terminal Body -->
				<div class="p-5 font-mono-code text-xs leading-relaxed overflow-x-auto min-h-[250px]">
					{#if heroTab === 'governor'}
						<div class="space-y-2">
							<div class="text-neutral-400">
								<span class="text-[#ff7a4a] select-none">$ </span>thesmos run bugfix.yaml --verify-with tekmor
							</div>
							<div class="text-neutral-300">
								<span class="text-blue-400 font-semibold">▶ [1/3] verify: reproduce_failure</span>
								<div class="pl-4 text-neutral-400">Executing 'cargo test --test repro' in isolated subshell...</div>
								<div class="pl-4 text-red-400">✖ Repro confirmed (exit 1) · [snapshot #1 committed to state.db]</div>
							</div>
							<div class="text-neutral-300">
								<span class="text-blue-400 font-semibold">▶ [2/3] agent: isolate_and_patch</span>
								<div class="pl-4 text-neutral-400">Claude Code invoked in bounded workspace with explicit contract</div>
								<div class="pl-4 text-neutral-300">✔ 2 files modified (+24, -6) · [snapshot #2 committed]</div>
							</div>
							<div class="text-neutral-300">
								<span class="text-[#5fd39a] font-semibold">▶ [3/3] gate: verify_fix</span>
								<div class="pl-4 text-neutral-400">tekmor verify -- go test -count=1 ./...</div>
								<div class="pl-4 text-[#5fd39a] font-medium flex items-center gap-1.5">
									✔ 1 check passed in 0.38s · Cryptographic receipt signed (.verify/receipt.json)
								</div>
							</div>
							<div class="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-2.5 text-[11px] text-emerald-300">
								<div>Workflow Verdict: PASSED · Tree SHA: 4f9a2b8e... · Snapshots: 4 committed</div>
								<div class="text-emerald-400 font-medium mt-1 flex items-center gap-1.5">
									<CheckCircle size={13} /> Autonomic Governor: Execution permitted, zero hallucinated steps.
								</div>
							</div>
						</div>
					{:else if heroTab === 'thesmos'}
						<div class="space-y-2">
							<div class="text-neutral-400">
								<span class="text-blue-400 select-none">$ </span>agent-spine run halt.yaml
							</div>
							<div class="text-neutral-300">
								[001] verify  build        ✔ echo compiling (0.02s) -> state.db
							</div>
							<div class="text-red-400">
								[002] verify  test         ✖ echo 2 failed &gt;&amp;2 (exit 1)
							</div>
							<div class="rounded-lg border border-red-500/20 bg-red-950/30 p-2.5 text-[11px] text-red-300">
								<div>🛑 HALT: Workflow terminated deterministically at node 'test'.</div>
								<div class="text-neutral-400 mt-1">Dependent nodes skipped. Snapshot sequence 2 written to SQLite.</div>
							</div>
							<div class="pt-2 text-neutral-400">
								<span class="text-blue-400 select-none">$ </span>agent-spine replay exec_8f12a0
							</div>
							<div class="text-neutral-300 flex items-center gap-1.5">
								✔ Rebuilt state graph from state.db in 0.04s (0 steps re-run · 0 tokens spent)
							</div>
						</div>
					{:else if heroTab === 'tekmor'}
						<div class="space-y-2">
							<div class="text-neutral-400">
								<span class="text-red-400 select-none">&gt; </span>Claude Code: "All tests pass! I will now finish the turn."
							</div>
							<div class="text-neutral-500 text-[11px]">
								Hook Execution: tekmor stop-gate
							</div>
							<div class="text-amber-300">
								Checking current git tree SHA: <span class="text-white">8c12a0f7...</span>
							</div>
							<div class="text-amber-300">
								Checking last receipt tree SHA: <span class="text-white">4f9a2b8e...</span>
							</div>
							<div class="rounded-lg border border-red-500/20 bg-red-950/30 p-2.5 text-[11px] text-red-300">
								<div>🛑 HOOK VERDICT: REJECTED (STALE_RECEIPT)</div>
								<div class="text-neutral-400 mt-1">Files modified after test execution. Turn cannot finish without proof.</div>
							</div>
							<div class="pt-2 text-neutral-400">
								<span class="text-[#5fd39a] select-none">$ </span>tekmor verify -- go test -count=1 ./...
							</div>
							<div class="text-[#5fd39a] font-medium flex items-center gap-1.5">
								✔ 14 checks passed · Fresh tree SHA signed · Turn Permitted
							</div>
						</div>
					{:else}
						<div class="space-y-1 text-neutral-300">
							<div class="text-neutral-500 pb-2 border-b border-white/[0.04] flex items-center justify-between">
								<span>.verify/receipt.json (Cryptographic Evidence)</span>
								<span class="text-emerald-400">Schema v1.0.0</span>
							</div>
							<pre class="text-[#5fd39a] leading-relaxed whitespace-pre">&#123;
  "schema": "v1.0.0",
  "command": ".verify/run.sh",
  "exit_code": 0,
  "git_commit": "a8f3b12",
  "tree_sha": "4f9a2b8e19c02d...",
  "verdict": "PASSED",
  "checks_passed": 14,
  "stale": false
&#125;</pre>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Animated Connector Arrow from Terminal to Pipeline (Anode Parity) -->
		<div class="flex flex-col items-center justify-center pt-6 pb-4 relative">
			<div class="h-8 w-[1px] bg-gradient-to-b from-white/20 via-[#ff531a]/60 to-[#ff531a] relative overflow-hidden">
				<div class="absolute top-0 left-0 w-full h-4 bg-white shadow-[0_0_8px_rgba(255,83,26,1)] animate-pulse"></div>
			</div>
			<div class="w-6 h-6 rounded-full bg-[#0a0a0c] border border-[#ff531a]/40 flex items-center justify-center shadow-[0_0_10px_rgba(255,83,26,0.3)] my-1">
				<span class="text-[11px] text-[#ff7a4a] font-mono-code font-bold leading-none">↓</span>
			</div>
			<span class="text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest mt-0.5">
				Deterministic Execution Flow
			</span>
		</div>

		<!-- 3 Value Pillars Connected by Flow Arrows (Anode Parity) -->
		<div class="relative grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 pb-8">
			<!-- Stage 1: Reproduce -->
			<div class="p-5 rounded-2xl bg-[#08080b] border border-white/[0.08] flex flex-col justify-between hover:border-white/[0.2] transition-colors">
				<div>
					<div class="flex items-center justify-between mb-2">
						<div class="flex items-center gap-2 text-xs font-mono-code font-bold text-white">
							<span class="px-1.5 py-0.5 rounded bg-[#ff531a]/10 border border-[#ff531a]/20 text-[#ff7a4a]">01</span>
							<span>Reproduce</span>
						</div>
						<span class="text-[10px] font-mono-code text-neutral-400 uppercase">Isolated Subshell</span>
					</div>
					<p class="text-xs text-neutral-400 leading-relaxed">
						Execute reproduction command in bounded subshell. Confirm failure and commit snapshot #1 to SQLite.
					</p>
				</div>
				<div class="mt-3 pt-2.5 border-t border-white/[0.04] text-[11px] font-mono-code text-[#ff7a4a] flex items-center gap-1.5">
					<span>Zero unverified assumptions</span>
					<span class="text-neutral-600">→</span>
				</div>
			</div>

			<!-- Stage 2: Bounded Agent -->
			<div class="p-5 rounded-2xl bg-[#08080b] border border-white/[0.08] flex flex-col justify-between hover:border-white/[0.2] transition-colors">
				<div>
					<div class="flex items-center justify-between mb-2">
						<div class="flex items-center gap-2 text-xs font-mono-code font-bold text-white">
							<span class="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">02</span>
							<span>Bounded Agent</span>
						</div>
						<span class="text-[10px] font-mono-code text-neutral-400 uppercase">Contract Scope</span>
					</div>
					<p class="text-xs text-neutral-400 leading-relaxed">
						Claude Code invoked with explicit target constraints. Turns bounded by Thesmos DAG state machine.
					</p>
				</div>
				<div class="mt-3 pt-2.5 border-t border-white/[0.04] text-[11px] font-mono-code text-blue-400 flex items-center gap-1.5">
					<span>Strict step enforcement</span>
					<span class="text-neutral-600">→</span>
				</div>
			</div>

			<!-- Stage 3: Gate & Sign -->
			<div class="p-5 rounded-2xl bg-[#08080b] border border-white/[0.08] flex flex-col justify-between hover:border-white/[0.2] transition-colors">
				<div>
					<div class="flex items-center justify-between mb-2">
						<div class="flex items-center gap-2 text-xs font-mono-code font-bold text-white">
							<span class="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">03</span>
							<span>Gate &amp; Sign</span>
						</div>
						<span class="text-[10px] font-mono-code text-neutral-400 uppercase">Cryptographic Proof</span>
					</div>
					<p class="text-xs text-neutral-400 leading-relaxed">
						Tekmor runs allowlisted verify script, validates tree hash, and writes signed receipt. Stop gate permits turn.
					</p>
				</div>
				<div class="mt-3 pt-2.5 border-t border-white/[0.04] text-[11px] font-mono-code text-emerald-400 flex items-center gap-1.5">
					<span>Tree SHA verified</span>
					<span class="text-emerald-400">✓</span>
				</div>
			</div>
		</div>
	</section>
</div>

<!-- Ecosystem Integration Bar (Anode Parity) -->
<EcosystemBar />

<div class="yc-container pl-10 sm:pl-14 md:pl-16 lg:pl-20">
	<!-- Empirical Benchmarks Section (Anode Parity) -->
	<BenchmarkMetrics color="orange" />

	<!-- Drift Comparison: Stochastic Agent Trap vs Deterministic Boundary (Anode Parity) -->
	<DriftComparison color="orange" />

	<!-- Side-by-Side Product Chapters (Tekmor & Thesmos Bento) -->
	<section id="how-it-works" use:scrollReveal class="py-24 border-t border-white/[0.08] bg-[#000000]">
		<div class="text-center max-w-3xl mx-auto mb-16">
			<span class="text-xs font-mono-code uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
				Autonomous Execution Engines
			</span>
			<h2 class="text-3xl sm:text-5xl font-bold tracking-tight text-white">
				Two Independent Local-First Engines
			</h2>
			<p class="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed">
				Each engine runs independently on macOS Apple Silicon and Linux with zero external model dependencies.
			</p>
		</div>

		<div class="grid gap-8 lg:grid-cols-2">
			<!-- Product Card 1: Tekmor -->
			<div use:scrollReveal={{ delay: 0 }} class="yc-card yc-card-glow p-7 sm:p-8 flex flex-col justify-between">
				<div>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2.5">
							<span class="rounded-md border border-[#5fd39a]/30 bg-[#5fd39a]/10 px-2 py-0.5 font-mono-code text-[11px] font-semibold text-[#5fd39a]">
								01
							</span>
							<span class="text-xs font-medium text-neutral-400">{tool.version}</span>
						</div>
						<span class="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-medium text-neutral-300">
							Proof Eval
						</span>
					</div>

					<h3 class="mt-6 text-2xl font-bold tracking-tight text-white">{tool.name}</h3>
					<p class="mt-1 text-xs font-medium text-[#5fd39a]">{tool.tagline}</p>
					<p class="mt-4 text-sm leading-relaxed text-neutral-300">{tool.subline}</p>

					<!-- Live Terminal Snippet inside Card -->
					<div class="mt-6 rounded-xl border border-white/[0.08] bg-[#060608] p-4 font-mono-code text-[11px] leading-relaxed">
						<div class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.06] text-neutral-500">
							<div class="flex items-center gap-1.5">
								<span class="h-2 w-2 rounded-full bg-red-500/70"></span>
								<span class="h-2 w-2 rounded-full bg-yellow-500/70"></span>
								<span class="h-2 w-2 rounded-full bg-green-500/70"></span>
								<span class="ml-1.5 text-[10px] text-neutral-400">tekmor proof</span>
							</div>
							<span class="text-[10px] text-emerald-400 font-medium">signed</span>
						</div>
						<div class="text-neutral-400">
							<span class="text-[#5fd39a] select-none">$ </span>tekmor verify -- go test -count=1 ./...
						</div>
						<div class="text-[#5fd39a] font-medium mt-1 flex items-center gap-1">
							✔ 1 check passed in 0.38s
						</div>
						<div class="text-neutral-400 mt-1">
							<span class="text-[#5fd39a] select-none">$ </span>tekmor verify receipt
						</div>
						<div class="text-neutral-300 mt-1 text-[10px] flex items-center gap-1.5">
							<span>Tree: <span class="text-[#5fd39a]">4f9a2b...</span></span>
							<span>·</span>
							<span class="rounded bg-emerald-950/80 border border-emerald-500/30 px-1 py-0.2 text-[9px] font-bold text-emerald-400 uppercase">PASSED</span>
						</div>
					</div>

					<ul class="mt-6 space-y-2.5 text-xs text-neutral-400 font-mono-code">
						{#each tool.chips as chip (chip)}
							<li class="flex items-center gap-2">
								<Check size={13} class="text-[#5fd39a]" />
								<span>{chip}</span>
							</li>
						{/each}
					</ul>
				</div>

				<div class="mt-8 pt-6 border-t border-white/[0.08]">
					<div class="flex items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-[#070709] px-3.5 py-2 font-mono-code text-xs">
						<div class="flex items-center gap-2 min-w-0 overflow-x-auto no-scrollbar text-neutral-300">
							<span class="text-[#5fd39a] select-none">$</span>
							<span class="truncate">{tool.install}</span>
						</div>
						<button
							type="button"
							onclick={copyTekmor}
							class="shrink-0 rounded px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors border border-white/[0.08] hover:bg-white/[0.06]"
							aria-label="Copy tekmor command"
						>
							{#if copiedTekmor}<span class="text-[#5fd39a]">Copied</span>{:else}<span>Copy</span>{/if}
						</button>
					</div>
					<div class="mt-5 flex flex-wrap items-center justify-between gap-3">
						<a
							href="/tekmor"
							class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
						>
							<span>Explore Tekmor</span>
							<ArrowRight size={12} />
						</a>
						<span class="text-xs text-neutral-400 font-mono-code">Claude Code Hooks</span>
					</div>
				</div>
			</div>

			<!-- Product Card 2: Thesmos -->
			<div use:scrollReveal={{ delay: 100 }} class="yc-card yc-card-glow p-7 sm:p-8 flex flex-col justify-between">
				<div>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2.5">
							<span class="rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 font-mono-code text-[11px] font-semibold text-blue-400">
								02
							</span>
							<span class="text-xs font-medium text-neutral-400">{spine.version}</span>
						</div>
						<span class="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-medium text-neutral-300">
							Workflows
						</span>
					</div>

					<h3 class="mt-6 text-2xl font-bold tracking-tight text-white">{spine.name}</h3>
					<p class="mt-1 text-xs font-medium text-blue-400">{spine.tagline}</p>
					<p class="mt-4 text-sm leading-relaxed text-neutral-300">{spine.subline}</p>

					<!-- Live YAML Snippet inside Card -->
					<div class="mt-6 rounded-xl border border-white/[0.08] bg-[#060608] p-4 font-mono-code text-[11px] leading-relaxed">
						<div class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.06] text-neutral-500">
							<div class="flex items-center gap-1.5">
								<span class="h-2 w-2 rounded-full bg-blue-500/70"></span>
								<span class="h-2 w-2 rounded-full bg-indigo-500/70"></span>
								<span class="h-2 w-2 rounded-full bg-purple-500/70"></span>
								<span class="ml-1.5 text-[10px] text-neutral-400">workflow.yaml</span>
							</div>
							<span class="text-[10px] text-blue-400 font-medium">immutable</span>
						</div>
						<div class="text-blue-400">pipeline:</div>
						<div class="text-neutral-400 pl-3">
							- <span class="text-neutral-200">step:</span> verify <span class="text-neutral-500"># tekmor gate</span>
						</div>
						<div class="text-neutral-400 pl-3">
							- <span class="text-neutral-200">step:</span> agent <span class="text-neutral-500"># bounded turns</span>
						</div>
						<div class="text-neutral-300 pl-3">
							- <span class="text-neutral-200">snapshot:</span> <span class="text-blue-400">state.db</span> <span class="text-neutral-500">(SQLite)</span>
						</div>
					</div>

					<ul class="mt-6 space-y-2.5 text-xs text-neutral-400 font-mono-code">
						{#each spine.chips as chip (chip)}
							<li class="flex items-center gap-2">
								<Check size={13} class="text-blue-400" />
								<span>{chip}</span>
							</li>
						{/each}
					</ul>
				</div>

				<div class="mt-8 pt-6 border-t border-white/[0.08]">
					<div class="flex items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-[#070709] px-3.5 py-2 font-mono-code text-xs">
						<div class="flex items-center gap-2 min-w-0 overflow-x-auto no-scrollbar text-neutral-300">
							<span class="text-blue-400 select-none">$</span>
							<span class="truncate">{spine.install}</span>
						</div>
						<button
							type="button"
							onclick={copySpine}
							class="shrink-0 rounded px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors border border-white/[0.08] hover:bg-white/[0.06]"
							aria-label="Copy thesmos command"
						>
							{#if copiedSpine}<span class="text-[#5fd39a]">Copied</span>{:else}<span>Copy</span>{/if}
						</button>
					</div>
					<div class="mt-5 flex flex-wrap items-center justify-between gap-3">
						<a
							href="/thesmos"
							class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
						>
							<span>Explore Thesmos</span>
							<ArrowRight size={12} />
						</a>
						<span class="text-xs text-neutral-400 font-mono-code">Deterministic DAGs</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- The Four Pillars Bento Section with Spotlight Hover (Anode Parity) -->
	<BentoPillars color="orange" {pillars} />

	<!-- Interactive 2-Column FAQ Bento Section (Anode Parity) -->
	<FAQSection color="orange" items={faqs} />
</div>
