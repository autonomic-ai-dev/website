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
		Lock,
		RefreshCw,
		FileCode,
		CheckCircle,
		Flame,
		Layers,
		GitBranch
	} from 'lucide-svelte';
	import Terminal from '#lib/components/ui/Terminal.svelte';
	import ContinuousConduit from '#lib/components/ContinuousConduit.svelte';
	import BenchmarkMetrics from '#lib/components/BenchmarkMetrics.svelte';
	import AnimatedNumber from '#lib/components/AnimatedNumber.svelte';
	import { scrollReveal } from '#lib/actions/scrollReveal';
	import { products } from '#lib/data/products';

	const tool = products.tekmor;
	const spine = products.thesmos;

	type HeroTab = 'governor' | 'thesmos' | 'tekmor';
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

	type InspectorState = 'governor' | 'thesmos' | 'tekmor';
	let inspectorState = $state<InspectorState>('governor');

	const invariants = [
		{
			badge: '01',
			title: '0 Model Calls',
			desc: 'Neither tool calls an LLM or spends your API tokens. Validation is 100% deterministic local Rust execution.',
			icon: Shield
		},
		{
			badge: '02',
			title: 'Allowlisted Gates',
			desc: 'Agents run only what you specify in .verify/verify.toml. Hallucinated, unlisted, or dangerous bash commands are refused.',
			icon: TerminalIcon
		},
		{
			badge: '03',
			title: 'Tree-Hashed Receipts',
			desc: 'Every test run records the git commit SHA and exact tree SHA. Modifying any tracked file immediately marks past passes stale.',
			icon: CheckCircle2
		},
		{
			badge: '04',
			title: 'Append-Only SQLite',
			desc: 'Workflows append immutable step snapshots to SQLite. Time-travel replay reconstructs history with zero re-runs.',
			icon: Database
		}
	];

	const faqs = [
		{
			q: 'How do Thesmos and Tekmor work together in an agent development loop?',
			a: 'Thesmos (agent-spine) defines the deterministic execution plan: a directed acyclic graph (DAG) specifying reproduction, agent repair, verification gates, and human sign-off steps. Tekmor provides the cryptographic enforcement inside those verification nodes and Claude Code stop hooks. An agent cannot wander off script or declare victory without a fresh, valid receipt signed for the exact files on disk.'
		},
		{
			q: 'Why do coding agents claim tests pass when they failed?',
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

	const comparison = [
		{
			metric: 'Workflow Execution Order',
			withoutTekmor: 'Unbounded prompt loops (Stochastic drift)',
			withTekmor: 'Deterministic YAML DAG with strict step transitions'
		},
		{
			metric: 'Agent claims test passed without running command',
			withoutTekmor: 'Accepted (Hallucinated pass)',
			withTekmor: 'Hard Blocked by Claude Code Stop Hook'
		},
		{
			metric: 'Agent touches code after tests finish',
			withoutTekmor: 'Pass accepted as still valid',
			withTekmor: 'Receipt invalidated (Stale git tree hash)'
		},
		{
			metric: 'Arbitrary bash command executed',
			withoutTekmor: 'Runs unchecked in shell',
			withTekmor: 'Refused unless in .verify/ allowlist'
		},
		{
			metric: 'Flaky test runs that intermittently pass',
			withoutTekmor: 'Single lucky pass accepted',
			withTekmor: 'Disagreements flagged as flaky & rejected'
		},
		{
			metric: 'Auditing past agent workflow runs',
			withoutTekmor: 'Requires re-running steps & burning LLM tokens',
			withTekmor: 'Zero-re-run replay from immutable SQLite snapshots'
		},
		{
			metric: 'External LLM tokens spent on verification',
			withoutTekmor: 'Burns metered model API tokens',
			withTekmor: '0 model tokens (Pure deterministic Rust execution)'
		}
	];

	const schema = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				name: 'Autonomic AI',
				url: 'https://autonomic-ai.dev',
				sameAs: ['https://github.com/autonomic-ai-dev'],
				makesOffer: [tool, spine].map((product) => ({
					'@type': 'SoftwareApplication',
					name: product.name,
					url: product.origin
				}))
			},
			{ '@type': 'WebSite', name: 'Autonomic AI', url: 'https://autonomic-ai.dev' }
		]
	};
</script>

<svelte:head>
	<title>Autonomic AI — Autonomous Engineering with Deterministic Boundaries</title>
	<meta
		name="description"
		content="Autonomic AI builds Thesmos (deterministic workflow DAGs with SQLite snapshots) and Tekmor (cryptographic verification stop gates and receipts) for coding agents."
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

<!-- Outer Relative Wrapper with Continuous Orange Conduit for Org Level -->
<div class="relative w-full overflow-x-clip">
	<ContinuousConduit color="orange" />

	<!-- Constrained Width Container for the Entire Page -->
	<div class="yc-container">
		<!-- Hero Section with Ambient Glow -->
		<section class="yc-section yc-section-first dotgrid relative overflow-hidden">
			<!-- Subtle Top Radial Glow -->
			<div
				class="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[480px] w-[750px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,83,26,0.12),transparent_70%)] blur-3xl"
			></div>

			<!-- Top Hero Grid: Left Copy & Right Action Box -->
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-12">
				<!-- Left Column (span 7): Title, Mission & Invariant Bullets -->
				<div class="lg:col-span-7 space-y-6">
					<!-- YC Style Top Proof Pill -->
					<div
						class="inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.03] py-1.5 pl-3 pr-4 text-xs font-medium text-neutral-300"
					>
						<span class="live-beacon"></span>
						<span class="text-white">Autonomic AI</span>
						<span class="text-neutral-600">/</span>
						<span class="text-neutral-400">Autonomous Engineering Governor</span>
					</div>

					<!-- Hero Headline with Balanced Line Breaks -->
					<h1
						class="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-bold leading-[1.12] tracking-tight text-white"
					>
						Autonomous Engineering with Deterministic Boundaries.
						<span class="block text-neutral-400 font-normal text-lg sm:text-xl md:text-2xl mt-3 leading-snug">
							Orchestrate the workflow. Cryptographically verify the code.
						</span>
					</h1>

					<p class="max-w-xl text-sm sm:text-base leading-relaxed text-neutral-400">
						Two local-first systems for coding agents.
						<strong class="font-medium text-blue-400">Thesmos</strong> orchestrates multi-step DAG
						workflows with append-only SQLite snapshots.
						<strong class="font-medium text-[#5fd39a]">Tekmor</strong> blocks hallucinated pass
						claims with cryptographic tree receipts.
					</p>

					<!-- Trust Checklist -->
					<div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-neutral-400 pt-1">
						<div class="flex items-center gap-1.5">
							<span class="text-[#ff7a4a] font-bold">✓</span>
							<span>0 Model Calls (100% Rust)</span>
						</div>
						<div class="flex items-center gap-1.5">
							<span class="text-[#5fd39a] font-bold">✓</span>
							<span>Tree-Hashed Receipts</span>
						</div>
						<div class="flex items-center gap-1.5">
							<span class="text-blue-400 font-bold">✓</span>
							<span>Append-Only SQLite</span>
						</div>
					</div>
				</div>

				<!-- Right Column (span 5): Quickstart Install Box & Action Buttons -->
				<div class="lg:col-span-5 space-y-4 pt-1">
					<!-- Command Quick-Copy Bar with Tab Switcher -->
					<div class="rounded-2xl border border-white/[0.1] bg-[#0c0d10] p-3 text-xs shadow-xl">
						<div class="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2">
							<!-- Tabs -->
							<div class="flex items-center gap-1 text-[11px] font-mono">
								<button
									type="button"
									onclick={() => (installTab = 'tap')}
									class="px-2.5 py-1 rounded transition-colors {installTab === 'tap' ? 'bg-white/[0.1] text-white font-medium' : 'text-neutral-400 hover:text-white'}"
								>
									Homebrew Tap
								</button>
								<button
									type="button"
									onclick={() => (installTab = 'tekmor')}
									class="px-2.5 py-1 rounded transition-colors {installTab === 'tekmor' ? 'bg-[#5fd39a]/15 text-[#5fd39a] font-medium' : 'text-neutral-400 hover:text-white'}"
								>
									Tekmor
								</button>
								<button
									type="button"
									onclick={() => (installTab = 'thesmos')}
									class="px-2.5 py-1 rounded transition-colors {installTab === 'thesmos' ? 'bg-blue-500/15 text-blue-400 font-medium' : 'text-neutral-400 hover:text-white'}"
								>
									Thesmos
								</button>
							</div>
							<span class="text-[10px] font-mono text-neutral-500 hidden sm:inline">macOS arm64</span>
						</div>

						<div class="flex items-center justify-between px-2 py-1">
							<div
								class="flex items-center gap-2.5 min-w-0 flex-1 overflow-x-auto no-scrollbar font-mono text-neutral-200"
							>
								<span class="select-none text-[#ff7a4a]">$</span>
								<span class="truncate">{installCommands[installTab]}</span>
							</div>
							<button
								type="button"
								onclick={copyCurrentInstall}
								aria-label="Copy install command"
								class="ml-3 inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-mono text-neutral-300 transition-colors hover:bg-white/[0.1] hover:text-white"
							>
								{#if copiedInstall}
									<Check size={12} class="text-[#ff7a4a]" />
									<span class="text-[#ff7a4a]">Copied</span>
								{:else}
									<Copy size={12} />
									<span>Copy</span>
								{/if}
							</button>
						</div>
					</div>

					<!-- Button Row -->
					<div class="flex flex-col sm:flex-row gap-3 pt-1">
						<a
							href="#how-it-works"
							class="yc-btn yc-btn-primary flex-1 text-center justify-center"
						>
							<span class="truncate">Explore Tekmor & Thesmos</span>
							<span class="yc-btn-icon shrink-0">
								<ArrowRight size={13} />
							</span>
						</a>
						<a
							href="#inspector"
							class="yc-btn yc-btn-secondary flex-1 text-center justify-center"
						>
							<span class="truncate">Inspect Architecture</span>
							<span class="yc-btn-icon shrink-0">
								<ArrowRight size={13} />
							</span>
						</a>
					</div>
				</div>
			</div>

			<!-- Live Terminal Showcase Below Hero Grid -->
			<div class="relative mt-4">
					<div
						class="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#ff531a]/15 via-blue-500/10 to-[#5fd39a]/10 blur-xl opacity-60"
					></div>

					<div
						class="rounded-2xl border border-white/[0.12] bg-[#07080a] shadow-2xl overflow-hidden"
					>
						<!-- Terminal Header with Tabs -->
						<div
							class="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] bg-[#0c0d10] px-4 py-2.5"
						>
							<div class="flex items-center gap-2">
								<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
								<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
								<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
							</div>

							<div class="flex items-center gap-1 text-[11px] sm:text-xs">
								<button
									type="button"
									onclick={() => (heroTab = 'governor')}
									class="rounded-md px-2 py-1 sm:px-2.5 font-medium transition-colors {heroTab ===
									'governor'
										? 'bg-[#ff531a]/15 text-[#ff7a4a] border border-[#ff531a]/30'
										: 'text-neutral-400 hover:text-white'}"
								>
									⚡ Closed-Loop Governor
								</button>
								<button
									type="button"
									onclick={() => (heroTab = 'thesmos')}
									class="rounded-md px-2 py-1 sm:px-2.5 font-medium transition-colors {heroTab ===
									'thesmos'
										? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
										: 'text-neutral-400 hover:text-white'}"
								>
									🔄 Thesmos DAG
								</button>
								<button
									type="button"
									onclick={() => (heroTab = 'tekmor')}
									class="rounded-md px-2 py-1 sm:px-2.5 font-medium transition-colors {heroTab ===
									'tekmor'
										? 'bg-[#5fd39a]/15 text-[#5fd39a] border border-[#5fd39a]/30'
										: 'text-neutral-400 hover:text-white'}"
								>
									🛡️ Tekmor Gate
								</button>
							</div>
						</div>

						<!-- Terminal Body -->
						<div class="p-4 sm:p-5 font-mono text-xs leading-relaxed overflow-x-auto min-h-[260px]">
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
										<div class="pl-4 text-neutral-400">tekmor verify -- .verify/run.sh</div>
										<div class="pl-4 text-[#5fd39a] font-medium flex items-center gap-1.5">
											✔ <AnimatedNumber value={14} duration={0.8} /> checks passed in <AnimatedNumber
												value={0.38}
												decimals={2}
												suffix="s"
												duration={0.8}
											/>
										</div>
										<div class="pl-4 text-neutral-400 text-[11px]">
											✔ Cryptographic receipt signed (.verify/receipt.json)
										</div>
									</div>
									<div
										class="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-2.5 text-[11px] text-emerald-300"
									>
										<div>Workflow Verdict: PASSED · Tree SHA: 4f9a2b8e... · Snapshots: 4</div>
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
									<div
										class="rounded-lg border border-red-500/20 bg-red-950/30 p-2.5 text-[11px] text-red-300"
									>
										<div>🛑 HALT: Workflow terminated deterministically at node 'test'.</div>
										<div class="text-neutral-400 mt-1">Dependent nodes 'ship' skipped. Snapshot sequence 2 written to SQLite.</div>
									</div>
									<div class="pt-2 text-neutral-400">
										<span class="text-blue-400 select-none">$ </span>agent-spine replay exec_8f12a0
									</div>
									<div class="text-neutral-300 flex items-center gap-1.5">
										✔ Rebuilt state graph from state.db in <AnimatedNumber
											value={0.04}
											decimals={2}
											suffix="s"
											duration={0.8}
										/> (0 steps re-run)
									</div>
								</div>
							{:else}
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
									<div
										class="rounded-lg border border-red-500/20 bg-red-950/30 p-2.5 text-[11px] text-red-300"
									>
										<div>🛑 HOOK VERDICT: REJECTED (STALE_RECEIPT)</div>
										<div class="text-neutral-400 mt-1">Files modified after test execution. Turn cannot finish without proof.</div>
									</div>
									<div class="pt-2 text-neutral-400">
										<span class="text-[#5fd39a] select-none">$ </span>tekmor verify -- .verify/run.sh
									</div>
									<div class="text-[#5fd39a] font-medium flex items-center gap-1.5">
										✔ <AnimatedNumber value={14} duration={0.8} /> checks passed · Fresh tree SHA signed · Turn Permitted
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
		</section>

		<!-- The Four Invariants (YC Unified Bento Grid with 1px hairline dividers) -->
		<section id="features" use:scrollReveal class="yc-section yc-crosshair">
			<div class="rounded-2xl border border-white/[0.12] bg-white/[0.08] p-[1px] shadow-2xl">
				<div
					class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/[0.08] rounded-[15px] overflow-hidden"
				>
					{#each invariants as inv, index (inv.badge)}
						<div
							use:scrollReveal={{ delay: (index % 4) * 70 }}
							class="group relative bg-[#090a0d] p-7 transition-colors hover:bg-[#0e1015] flex flex-col justify-between"
						>
							<div>
								<div class="flex items-center justify-between">
									<span class="font-mono text-xs font-semibold tracking-wider text-[#ff7a4a]"
										>{inv.badge}</span
									>
									<inv.icon
										size={16}
										class="text-neutral-500 group-hover:text-white transition-colors"
									/>
								</div>
								<h3 class="mt-5 text-sm font-semibold text-white tracking-tight">{inv.title}</h3>
								<p class="mt-2 text-xs leading-relaxed text-neutral-400">{inv.desc}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Platform Architecture: Closed-Loop Governor -->
		<section id="inspector" use:scrollReveal class="yc-section yc-crosshair">
			<div class="flex flex-col gap-2">
				<span class="yc-label">01 <b>/</b> Architecture</span>
				<h2 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
					The Dual-Engine Governor Loop
				</h2>
				<p class="text-sm text-neutral-400 max-w-xl">
					How Thesmos and Tekmor establish complete operational control over autonomous coding agents.
				</p>
			</div>

			<!-- Interactive Inspector Component -->
			<div
				use:scrollReveal={{ delay: 80 }}
				class="mt-10 rounded-2xl border border-white/[0.12] bg-[#090a0d] p-6 sm:p-8 shadow-2xl"
			>
				<div
					class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]"
				>
					<div>
						<span class="text-xs font-medium text-neutral-400">Select Architecture Stage:</span>
						<div class="mt-3 flex flex-wrap gap-2.5">
							<button
								type="button"
								onclick={() => (inspectorState = 'governor')}
								class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all {inspectorState ===
								'governor'
									? 'bg-[#ff7a4a] text-black font-semibold'
									: 'bg-white/[0.05] text-neutral-300 hover:bg-white/[0.1]'}"
							>
								⚡ Dual-Engine Loop (Orchestration + Verification)
							</button>
							<button
								type="button"
								onclick={() => (inspectorState = 'thesmos')}
								class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all {inspectorState ===
								'thesmos'
									? 'bg-blue-400 text-black font-semibold'
									: 'bg-white/[0.05] text-neutral-300 hover:bg-white/[0.1]'}"
							>
								🔄 Thesmos State Machine (SQLite Snapshots)
							</button>
							<button
								type="button"
								onclick={() => (inspectorState = 'tekmor')}
								class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all {inspectorState ===
								'tekmor'
									? 'bg-[#5fd39a] text-black font-semibold'
									: 'bg-white/[0.05] text-neutral-300 hover:bg-white/[0.1]'}"
							>
								🛡️ Tekmor Proof Gate (Tree Receipts)
							</button>
						</div>
					</div>

					<div class="flex items-center gap-2 text-xs">
						<span class="text-neutral-500">System Mode:</span>
						{#if inspectorState === 'governor'}
							<span
								class="rounded border border-[#ff531a]/30 bg-[#ff531a]/10 px-2.5 py-1 text-[#ff7a4a] font-semibold flex items-center gap-1.5 font-mono text-[11px]"
							>
								<CheckCircle size={13} /> CLOSED-LOOP GOVERNOR
							</span>
						{:else if inspectorState === 'thesmos'}
							<span
								class="rounded border border-blue-500/30 bg-blue-950/60 px-2.5 py-1 text-blue-300 font-semibold flex items-center gap-1.5 font-mono text-[11px]"
							>
								<Layers size={13} /> IMMUTABLE DAG
							</span>
						{:else}
							<span
								class="rounded border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-1 text-emerald-300 font-semibold flex items-center gap-1.5 font-mono text-[11px]"
							>
								<Shield size={13} /> CRYPTOGRAPHIC PROOF
							</span>
						{/if}
					</div>
				</div>

				<!-- Dynamic Inspector Payload -->
				<div class="mt-6 grid gap-6 lg:grid-cols-2">
					<!-- Code / Config / DB Payload -->
					<div
						class="rounded-xl border border-white/[0.08] bg-[#050608] p-4 font-mono text-xs overflow-x-auto min-h-[220px]"
					>
						{#if inspectorState === 'governor'}
							<div
								class="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-neutral-500"
							>
								<span>autonomic-governor.yaml</span>
								<span class="text-[11px] text-[#ff7a4a]">Full Lifecycle DAG</span>
							</div>
							<pre class="overflow-x-auto text-[#ffd9c7] leading-relaxed"><span class="text-[#ff7a4a]">pipeline:</span> bugfix_and_ship
<span class="text-[#ff7a4a]">stages:</span>
  - <span class="text-blue-400">name:</span> reproduce
    <span class="text-neutral-400">kind:</span> verify
    <span class="text-neutral-400">command:</span> <span class="text-amber-300">"cargo test --test repro"</span>
  - <span class="text-blue-400">name:</span> agent_patch
    <span class="text-neutral-400">kind:</span> agent
    <span class="text-neutral-400">enforce_gates:</span> <span class="text-emerald-400">[tekmor-stop-gate]</span>
  - <span class="text-blue-400">name:</span> verify_fix
    <span class="text-neutral-400">kind:</span> verify
    <span class="text-neutral-400">command:</span> <span class="text-amber-300">"tekmor verify -- .verify/run.sh"</span>
  - <span class="text-blue-400">name:</span> snapshot
    <span class="text-neutral-400">storage:</span> <span class="text-blue-400">"sqlite://~/.autonomic/state.db"</span></pre>
						{:else if inspectorState === 'thesmos'}
							<div
								class="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-neutral-500"
							>
								<span>state.db (SQLite snapshots table)</span>
								<span class="text-[11px] text-blue-400">Append-Only Rows</span>
							</div>
							<pre class="overflow-x-auto text-blue-300 leading-relaxed">step_id | node_name         | status   | exit_code | timestamp
--------+-------------------+----------+-----------+---------------------
001     | reproduce_failure | FAILED   | 1         | 2026-10-28 14:10:02
002     | isolate_and_patch | COMPLETE | 0         | 2026-10-28 14:11:15
003     | verify_fix        | PASSED   | 0         | 2026-10-28 14:11:42
004     | sign_off          | APPROVED | 0         | 2026-10-28 14:12:01</pre>
						{:else}
							<div
								class="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-neutral-500"
							>
								<span>.verify/receipt.json</span>
								<span class="text-[11px] text-emerald-400">Cryptographic Evidence</span>
							</div>
							<pre class="overflow-x-auto text-[#5fd39a] leading-relaxed">&#123;
  "schema": "v1.0.0",
  "command": ".verify/run.sh",
  "exit_code": 0,
  "git_commit": "a8f3b12",
  "tree_sha": "4f9a2b8e19c02d...",
  "verdict": "PASSED",
  "checks_passed": 14,
  "stale": false
&#125;</pre>
						{/if}
					</div>

					<!-- Explanation & Architectural Guarantee -->
					<div class="flex flex-col justify-between p-2">
						<div>
							{#if inspectorState === 'governor'}
								<h4 class="text-base font-semibold text-white">Closed-Loop Governor: Zero Hallucination</h4>
								<p class="mt-2 text-sm leading-relaxed text-neutral-300">
									Thesmos defines the exact state machine DAG that the agent must traverse. When the
									agent finishes writing code, Tekmor's Claude Code stop hook physically blocks the turn
									until an allowlisted verification run generates a matching cryptographic tree receipt.
								</p>
							{:else if inspectorState === 'thesmos'}
								<h4 class="text-base font-semibold text-blue-300">
									Append-Only SQLite History
								</h4>
								<p class="mt-2 text-sm leading-relaxed text-neutral-300">
									Every workflow node transition appends an immutable row to SQLite. Rows are never edited
									or deleted. Replay reconstructs the entire state graph in under 5ms without re-running agent
									steps or spending external LLM API tokens.
								</p>
							{:else}
								<h4 class="text-base font-semibold text-emerald-300">Git Tree-Bound Proof Receipts</h4>
								<p class="mt-2 text-sm leading-relaxed text-neutral-300">
									Tekmor executes only allowlisted commands from <code class="text-neutral-200">.verify/verify.toml</code>.
									The receipt binds to the exact git commit and tree SHA. Modifying any tracked source file immediately
									invalidates earlier passes.
								</p>
							{/if}
						</div>

						<div
							class="mt-6 pt-4 border-t border-white/[0.06] font-mono text-xs text-neutral-400 flex items-center justify-between"
						>
							<span>Local-first Apple Silicon execution</span>
							<span class="text-[#ff7a4a]">0 model tokens spent on validation</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Empirical Benchmarks Section (Properly numbered 02) -->
		<BenchmarkMetrics />

		<!-- Side-by-Side Product Chapters (01 & 02 Bento) -->
		<section id="how-it-works" use:scrollReveal class="yc-section yc-crosshair">
			<div class="flex flex-col gap-2">
				<span class="yc-label">03 <b>/</b> Execution Engine</span>
				<h2 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
					Two Independent Local-First Engines
				</h2>
				<p class="text-sm text-neutral-400 max-w-xl">
					Each engine runs independently on macOS Apple Silicon with zero external dependencies.
				</p>
			</div>

			<div class="mt-12 grid gap-8 lg:grid-cols-2">
				<!-- Product Card 1: Tekmor -->
				<div use:scrollReveal={{ delay: 0 }} class="yc-card yc-card-glow p-7 sm:p-8 flex flex-col justify-between">
					<div>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2.5">
								<span
									class="rounded-md border border-[#5fd39a]/30 bg-[#5fd39a]/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#5fd39a]"
								>
									01
								</span>
								<span class="text-xs font-medium text-neutral-400">{tool.version}</span>
							</div>
							<span
								class="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-medium text-neutral-300"
							>
								Proof Eval
							</span>
						</div>

						<h3 class="mt-6 text-2xl font-semibold tracking-tight text-white">{tool.name}</h3>
						<p class="mt-1 text-xs font-medium text-[#5fd39a]">{tool.tagline}</p>
						<p class="mt-4 text-sm leading-relaxed text-neutral-300">{tool.subline}</p>

						<!-- Live Terminal Snippet inside Card -->
						<div
							class="mt-6 rounded-xl border border-white/[0.08] bg-[#060608] p-4 font-mono text-[11px] leading-relaxed"
						>
							<div
								class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.06] text-neutral-500"
							>
								<div class="flex items-center gap-1.5">
									<span class="h-2 w-2 rounded-full bg-red-500/70"></span>
									<span class="h-2 w-2 rounded-full bg-yellow-500/70"></span>
									<span class="h-2 w-2 rounded-full bg-green-500/70"></span>
									<span class="ml-1.5 text-[10px] text-neutral-400">tekmor proof</span>
								</div>
								<span class="text-[10px] text-emerald-400 font-medium">signed</span>
							</div>
							<div class="text-neutral-400">
								<span class="text-[#5fd39a] select-none">$ </span>tekmor verify -- .verify/run.sh
							</div>
							<div class="text-[#5fd39a] font-medium mt-1 flex items-center gap-1">
								✔ <AnimatedNumber value={14} duration={0.8} /> checks passed in <AnimatedNumber
									value={0.38}
									decimals={2}
									suffix="s"
									duration={0.8}
								/>
							</div>
							<div class="text-neutral-400 mt-1">
								<span class="text-[#5fd39a] select-none">$ </span>tekmor verify receipt
							</div>
							<div class="text-neutral-300 mt-1 text-[10px] flex items-center gap-1.5">
								<span>Tree: <span class="text-[#5fd39a]">4f9a2b...</span></span>
								<span>·</span>
								<span
									class="rounded bg-emerald-950/80 border border-emerald-500/30 px-1 py-0.2 text-[9px] font-bold text-emerald-400 uppercase"
									>PASSED</span
								>
							</div>
						</div>

						<ul class="mt-6 space-y-2.5 text-xs text-neutral-400">
							{#each tool.chips as chip (chip)}
								<li class="flex items-center gap-2">
									<Check size={13} class="text-[#5fd39a]" />
									<span>{chip}</span>
								</li>
							{/each}
						</ul>
					</div>

					<div class="mt-8 pt-6 border-t border-white/[0.08]">
						<div
							class="flex items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-[#070709] px-3.5 py-2"
						>
							<div
								class="flex items-center gap-2 min-w-0 overflow-x-auto no-scrollbar font-mono text-xs text-neutral-300"
							>
								<span class="text-[#5fd39a] select-none">$</span>
								<span class="truncate">{tool.install}</span>
							</div>
							<button
								type="button"
								onclick={copyTekmor}
								class="shrink-0 rounded px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors border border-white/[0.08] hover:bg-white/[0.06]"
								aria-label="Copy tekmor command"
							>
								{#if copiedTekmor}<span class="text-[#5fd39a]">Copied</span>{:else}<span>Copy</span
									>{/if}
							</button>
						</div>
						<div class="mt-5 flex flex-wrap items-center justify-between gap-3">
							<a
								href="/tekmor"
								class="yc-btn yc-btn-primary"
								style="height: 38px; font-size: 12px;"
							>
								<span>Explore Tekmor</span>
								<span class="yc-btn-icon" style="width: 22px; height: 22px;">
									<ArrowRight size={11} />
								</span>
							</a>
							<span class="text-xs text-neutral-400"> Claude Code Hooks </span>
						</div>
					</div>
				</div>

				<!-- Product Card 2: Thesmos -->
				<div use:scrollReveal={{ delay: 100 }} class="yc-card yc-card-glow p-7 sm:p-8 flex flex-col justify-between">
					<div>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2.5">
								<span
									class="rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-400"
								>
									02
								</span>
								<span class="text-xs font-medium text-neutral-400">{spine.version}</span>
							</div>
							<span
								class="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-medium text-neutral-300"
							>
								Workflows
							</span>
						</div>

						<h3 class="mt-6 text-2xl font-semibold tracking-tight text-white">{spine.name}</h3>
						<p class="mt-1 text-xs font-medium text-blue-400">{spine.tagline}</p>
						<p class="mt-4 text-sm leading-relaxed text-neutral-300">{spine.subline}</p>

						<!-- Live YAML Snippet inside Card -->
						<div
							class="mt-6 rounded-xl border border-white/[0.08] bg-[#060608] p-4 font-mono text-[11px] leading-relaxed"
						>
							<div
								class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.06] text-neutral-500"
							>
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
								- <span class="text-neutral-200">step:</span> verify
								<span class="text-neutral-500"># tekmor gate</span>
							</div>
							<div class="text-neutral-400 pl-3">
								- <span class="text-neutral-200">step:</span> agent
								<span class="text-neutral-500"># bounded turns</span>
							</div>
							<div class="text-neutral-300 pl-3">
								- <span class="text-neutral-200">snapshot:</span>
								<span class="text-blue-400">state.db</span>
								<span class="text-neutral-500">(SQLite)</span>
							</div>
						</div>

						<ul class="mt-6 space-y-2.5 text-xs text-neutral-400">
							{#each spine.chips as chip (chip)}
								<li class="flex items-center gap-2">
									<Check size={13} class="text-blue-400" />
									<span>{chip}</span>
								</li>
							{/each}
						</ul>
					</div>

					<div class="mt-8 pt-6 border-t border-white/[0.08]">
						<div
							class="flex items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-[#070709] px-3.5 py-2"
						>
							<div
								class="flex items-center gap-2 min-w-0 overflow-x-auto no-scrollbar font-mono text-xs text-neutral-300"
							>
								<span class="text-blue-400 select-none">$</span>
								<span class="truncate">{spine.install}</span>
							</div>
							<button
								type="button"
								onclick={copySpine}
								class="shrink-0 rounded px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors border border-white/[0.08] hover:bg-white/[0.06]"
								aria-label="Copy thesmos command"
							>
								{#if copiedSpine}<span class="text-[#5fd39a]">Copied</span>{:else}<span>Copy</span
									>{/if}
							</button>
						</div>
						<div class="mt-5 flex flex-wrap items-center justify-between gap-3">
							<a
								href="/thesmos"
								class="yc-btn yc-btn-secondary"
								style="height: 38px; font-size: 12px;"
							>
								<span>Explore Thesmos</span>
								<span class="yc-btn-icon" style="width: 22px; height: 22px;">
									<ArrowRight size={11} />
								</span>
							</a>
							<span class="text-xs text-neutral-400"> Deterministic DAGs </span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Comparison Matrix (Why Gates > Instructions) -->
		<section id="comparison" use:scrollReveal class="yc-section yc-crosshair bg-[#050507]">
			<span class="yc-label">04 <b>/</b> Comparison</span>
			<h2 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
				Unrestricted Agents vs The Autonomic Governor
			</h2>
			<p class="mt-3 text-sm text-neutral-400 max-w-2xl">
				System prompts ask agents to behave. Tekmor and Thesmos enforce deterministic boundaries at
				the process and filesystem level.
			</p>

			<!-- Mobile swipe indicator -->
			<div
				class="flex items-center justify-end sm:hidden text-[11px] font-mono text-neutral-500 mt-6 -mb-6"
			>
				<span>Swipe to view &rarr;</span>
			</div>

			<div
				class="mt-8 sm:mt-10 overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0b0b0d]"
			>
				<table class="w-full min-w-[580px] text-left text-sm">
					<thead
						class="border-b border-white/[0.08] bg-[#070709] font-mono text-[11px] uppercase tracking-wider text-neutral-400"
					>
						<tr>
							<th class="px-5 py-3.5 sm:px-6 sm:py-4 font-normal">Scenario</th>
							<th class="px-5 py-3.5 sm:px-6 sm:py-4 font-normal text-neutral-500"
								>Unrestricted Agent</th
							>
							<th class="px-5 py-3.5 sm:px-6 sm:py-4 font-normal text-[#ff7a4a]"
								>With Thesmos & Tekmor</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-white/[0.04]">
						{#each comparison as item (item.metric)}
							<tr class="transition-colors hover:bg-white/[0.02]">
								<td class="px-5 py-4 sm:px-6 text-xs font-medium text-white">{item.metric}</td>
								<td class="px-5 py-4 sm:px-6 text-xs text-neutral-400">{item.withoutTekmor}</td>
								<td class="px-5 py-4 sm:px-6 text-xs font-medium text-[#ff7a4a]"
									>{item.withTekmor}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<!-- FAQ Accordion with Monospace Operators -->
		<section id="faq" use:scrollReveal class="yc-section yc-crosshair">
			<span class="yc-label">05 <b>/</b> Details</span>
			<h2 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
				Frequently asked questions
			</h2>
			<p class="mt-3 text-sm text-neutral-400">
				Common questions about deterministic DAGs, SQLite snapshots, and cryptographic tree receipts.
			</p>

			<div class="mt-10 divide-y divide-white/[0.08] border-y border-white/[0.08]">
				{#each faqs as faq (faq.q)}
					<details class="group py-6">
						<summary
							class="flex cursor-pointer list-none items-center justify-between text-base font-medium text-neutral-200 transition-colors hover:text-white outline-none"
						>
							<span>{faq.q}</span>
							<span class="font-mono text-lg text-neutral-500 group-open:hidden">+</span>
							<span class="hidden font-mono text-lg text-[#ff7a4a] group-open:inline">&minus;</span>
						</summary>
						<div class="mt-3 text-sm leading-relaxed text-neutral-400 pr-8">
							{faq.a}
						</div>
					</details>
				{/each}
			</div>
		</section>
	</div>
</div>
