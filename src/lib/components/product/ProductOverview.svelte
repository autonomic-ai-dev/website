<script lang="ts">
	import {
		ArrowRight,
		Check,
		Copy,
		Minus,
		Terminal as TerminalIcon,
		Shield,
		Database,
		Lock,
		AlertTriangle,
		CheckCircle2,
		RefreshCw
	} from 'lucide-svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import AnimatedNumber from '#lib/components/AnimatedNumber.svelte';
	import EcosystemBar from '#lib/components/EcosystemBar.svelte';
	import BenchmarkMetrics, { type BenchmarkStat } from '#lib/components/BenchmarkMetrics.svelte';
	import DriftComparison from '#lib/components/DriftComparison.svelte';
	import BentoPillars, { type Pillar } from '#lib/components/BentoPillars.svelte';
	import FAQSection, { type FAQItem } from '#lib/components/FAQSection.svelte';
	import { scrollReveal } from '#lib/actions/scrollReveal';
	import type { Product } from '#lib/data/products';

	let { product }: { product: Product } = $props();

	let copied = $state(false);
	let copiedCmd = $state<string | null>(null);
	let copiedChapter = $state<number | null>(null);
	let activeTab = $state<'config' | 'receipt' | 'gate'>('config');

	type InstallMethod = 'brew' | 'curl' | 'source';
	let installMethod = $state<InstallMethod>('brew');

	const isTekmor = $derived(product.id === 'tekmor');
	const accentColor = $derived<'emerald' | 'blue'>(isTekmor ? 'emerald' : 'blue');
	const accentText = $derived(isTekmor ? 'text-[#5fd39a]' : 'text-blue-400');
	const accentBorder = $derived(isTekmor ? 'border-[#5fd39a]/30' : 'border-blue-500/30');
	const accentBg = $derived(isTekmor ? 'bg-[#5fd39a]/15' : 'bg-blue-500/15');
	const accentBadgeBg = $derived(isTekmor ? 'bg-[#5fd39a]/10' : 'bg-blue-500/10');
	const glowBg = $derived(
		isTekmor
			? 'bg-[radial-gradient(ellipse_at_center,rgba(95,211,154,0.14),transparent_70%)]'
			: 'bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.14),transparent_70%)]'
	);

	const installCmd = $derived(
		installMethod === 'brew'
			? product.install
			: installMethod === 'curl'
				? `curl -fsSL https://raw.githubusercontent.com/autonomic-ai-dev/tap/master/install-${product.id}.sh | bash`
				: `cargo install --git https://github.com/autonomic-ai-dev/tap ${product.id === 'thesmos' ? 'agent-spine' : 'tekmor'}`
	);

	async function copyInstall() {
		try {
			await navigator.clipboard.writeText(installCmd);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			copied = false;
		}
	}

	async function copySnippet(cmd: string) {
		try {
			await navigator.clipboard.writeText(cmd);
			copiedCmd = cmd;
			setTimeout(() => (copiedCmd = null), 1500);
		} catch {
			copiedCmd = null;
		}
	}

	async function copyChapterTranscript(text: string, index: number) {
		try {
			await navigator.clipboard.writeText(text);
			copiedChapter = index;
			setTimeout(() => (copiedChapter = null), 1500);
		} catch {
			copiedChapter = null;
		}
	}

	// Ecosystem technologies for each product
	const tekmorTechs = [
		{ name: 'Claude Code', spec: 'Pre-compact & stop hooks' },
		{ name: 'Git Tree SHA', spec: 'Merkle tree verification' },
		{ name: 'Rust 2024', spec: 'Zero model API calls' },
		{ name: 'Bash & Zsh', spec: 'Local CLI stop gate' },
		{ name: 'receipt.json', spec: 'Cryptographic evidence' },
		{ name: 'verify.toml', spec: 'Allowlist enforcement' },
		{ name: 'GitHub Actions', spec: 'Deterministic exit gates' },
		{ name: 'Homebrew Tap', spec: 'Single static binary' }
	];

	const thesmosTechs = [
		{ name: 'YAML DAGs', spec: 'Deterministic workflows' },
		{ name: 'SQLite 3', spec: 'Append-only snapshots' },
		{ name: 'Claude Code', spec: 'Bounded agent nodes' },
		{ name: 'State Replay', spec: 'Zero token reconstruction' },
		{ name: 'Rust Engine', spec: 'Local process execution' },
		{ name: 'Verify Gates', spec: 'Pre & post conditions' },
		{ name: 'Approval Nodes', spec: 'Human-in-the-loop gates' },
		{ name: 'Homebrew Tap', spec: 'Single static binary' }
	];

	// Benchmark statistics for each product (Differentiated & Empirical)
	const tekmorStats: BenchmarkStat[] = [
		{
			label: 'Stop Gate Overhead',
			value: 0.11,
			suffix: 's',
			decimals: 2,
			duration: 1.0,
			detail: 'Added to a real test suite (median of 5 runs): 35.80s with Tekmor, 35.68s without. 41x faster than an LLM judge (4.5s).'
		},
		{
			label: 'Receipt Generation Latency',
			value: 0.38,
			suffix: ' ms',
			decimals: 2,
			duration: 0.8,
			detail: 'Cryptographic git tree Merkle check across all tracked workspace files in memory. Instantaneous verdict on turn completion.'
		},
		{
			label: 'Hallucinated Pass Block Rate',
			value: 100,
			suffix: '%',
			decimals: 0,
			duration: 1.1,
			detail: 'Post-test code modifications immediately invalidate past receipts via git tree hashing. False victory claims blocked 100% of the time.'
		},
		{
			label: 'Zero Model API Spend',
			value: 0,
			suffix: ' tokens',
			decimals: 0,
			duration: 0.8,
			detail: 'Zero LLM model calls or external API tokens consumed for verification. 100% deterministic local Rust process execution.'
		}
	];

	const thesmosStats: BenchmarkStat[] = [
		{
			label: 'Time-Travel Replay Latency',
			value: 4.8,
			suffix: ' ms',
			decimals: 1,
			duration: 0.9,
			detail: 'Time-travel state graph reconstruction from SQLite snapshots. 0 steps re-executed, 0 API tokens spent, zero model drift.'
		},
		{
			label: 'Failure Debugging Token Spend',
			value: 0,
			suffix: ' tokens',
			decimals: 0,
			duration: 0.8,
			detail: 'Investigating past failure traces reads immutable SQLite snapshots. 0 tokens vs 120,000 tokens for scraping prompt histories.'
		},
		{
			label: 'DAG Transition Enforcement',
			value: 100,
			suffix: '%',
			decimals: 0,
			duration: 1.1,
			detail: 'Strict deterministic DAG step transitions. Agents cannot skip reproduction, bypass approval gates, or run unlisted commands.'
		},
		{
			label: 'Atomic Snapshot Commit',
			value: 0.02,
			suffix: 's',
			decimals: 2,
			duration: 0.8,
			detail: 'Instantaneous step state serialization and append-only commit to SQLite state.db upon node completion.'
		}
	];

	// Drift Comparison specs tailored specifically per product
	const tekmorDrift = {
		badge: 'Tekmor vs Unconstrained Agents',
		title: 'Stop Relying on Unverifiable Agent Turn Claims',
		description: 'Tekmor introduces hard stop gates in Claude Code hooks: an agent declaring tests passed without a fresh tree-signed receipt is physically blocked from completing the turn.',
		leftBadge: 'Unverified Turn Trap',
		leftTitle: 'Fragile Self-Declared Passes',
		leftDesc: 'Language models misread exit codes, assume bash commands succeeded, or alter files after test execution without re-verifying.',
		leftPoints: [
			'Agents misread exit codes or swallow assertion failures silently',
			'Files modified after test execution still reported as "all tests pass"',
			'Arbitrary un-allowlisted bash commands run without deterministic gating',
			'Zero cryptographic proof connecting terminal output to git commit state'
		],
		leftSnippetHeader: 'unstructured-agent.log (Unverified Prompt Loop)',
		leftSnippetCode: `> claude-code: "All 14 unit tests pass! I will now finish the turn."
! files modified after test command: src/auth/token.rs (+18, -4)
! git tree changed: 4f9a2b8e -> 8c12a0f7 (Tests were NEVER re-run!)
? exit code was ignored: bash exit code 1 treated as text completion
✗ Agent self-declared pass accepted with zero cryptographic evidence`,
		rightBadge: 'Cryptographic Process Gate',
		rightTitle: 'Tree-Hashed Receipts',
		rightDesc: 'Every check writes a signed receipt tied to the exact Git tree SHA. Claude Code stop hook physically blocks turns without one.',
		rightPoints: [
			'Claude Code stop hooks physically block turn finish without valid receipt',
			'Git Merkle tree SHA changes immediately invalidate earlier test passes',
			'Allowlisted commands only (.verify/verify.toml); unlisted execution refused',
			'Local zero-token verification executes in <1ms without LLM overhead'
		],
		rightSnippetHeader: '.verify/receipt.json (Cryptographically Verified)',
		rightSnippetCode: `tekmor verify -- go test -count=1 ./...
✔ 14 checks passed in 0.38s
✔ git commit: 8c12a0f · tree SHA: 8c12a0f7b9e31...
✔ receipt written to .verify/receipt.json (stale: false)
------------------------------------------------------------
Claude Code Stop Hook: VERIFIED (tree hash match)
✔ Turn permitted · 0 hallucinated passes · 0 model calls`
	};

	const thesmosDrift = {
		badge: 'Thesmos vs Stochastic Prompt Loops',
		title: 'Stop Relying on Unbounded Agent Context Loops',
		description: 'Thesmos replaces unstructured prompt loops with deterministic DAG workflows and append-only SQLite state replay.',
		leftBadge: 'The Stochastic Prompt Trap',
		leftTitle: 'Unbounded Context Drift',
		leftDesc: 'Multi-step coding agents wander in loop hallucinations, drop intermediate state across tool calls, and cannot be replayed.',
		leftPoints: [
			'Agent loses context midway through a 12-step refactor and repeats work',
			'Failure investigation burns 40k+ tokens reading ambiguous chat transcripts',
			'No formal state machine: tool calls execute out of order or skip approvals',
			'Non-deterministic runs cannot be reproduced or regression-tested in CI'
		],
		leftSnippetHeader: 'unstructured-agent.log (Context Drift & Lost State)',
		leftSnippetCode: `> agent: "Step 7 failed due to missing migration. Retrying Step 1..."
! intermediate artifact lost: memory context dropped during summarization
! cycle detected: Step 1 -> Step 3 -> Step 1 (loop count: 4)
? token spend: 48,210 tokens consumed without state persistence
✗ Crash recovery impossible: process exited with no checkpoint`,
		rightBadge: 'Deterministic DAG Engine',
		rightTitle: 'Append-Only SQLite State Machine',
		rightDesc: 'Thesmos governs every transition as an immutable SQLite transaction. Instant time-travel replay without spending a single LLM token.',
		rightPoints: [
			'Strictly typed YAML DAG enforces valid transitions and approval gates',
			'Atomic SQLite snapshots save exact memory, tools, and diffs per node',
			'agent-spine replay reproduces any execution node in <5ms with 0 tokens',
			'Speculative fork branches parallel agents and joins consensus deterministically'
		],
		rightSnippetHeader: 'state.db (Immutable SQLite Transition)',
		rightSnippetCode: `agent-spine run workflows/bugfix.yaml --exec-id exec_8f12a0
✔ Node [analyze] -> SUCCESS (snapshot committed to state.db: 0.02s)
✔ Node [generate_patch] -> SUCCESS (diff verified, tree 9b4a1)
✔ Node [approval_gate] -> GRANTED (human approval receipt signed)
------------------------------------------------------------
agent-spine replay exec_8f12a0 --step generate_patch
✔ Replayed state in 4.8ms · 0 LLM tokens spent · Bit-identical state`
	};

	const drift = $derived(isTekmor ? tekmorDrift : thesmosDrift);

	// Pillars for each product
	const tekmorPillars: Pillar[] = [
		{
			badge: '01',
			title: '0 Model Calls',
			desc: 'Validation is 100% deterministic local Rust execution. Neither tool calls an LLM or spends your API tokens.',
			tag: 'Local Rust Engine',
			icon: Shield,
			snippet: `$ tekmor verify -- go test -count=1 ./...
✔ 14 checks passed in 0.38s
✔ Model calls: 0 · Network connections: 0`,
			statusLabel: 'Deterministic Rust'
		},
		{
			badge: '02',
			title: 'Allowlisted Process Gates',
			desc: 'Agents run only what you specify in .verify/verify.toml. Hallucinated, unlisted, or dangerous bash commands are refused.',
			tag: '.verify/verify.toml',
			icon: TerminalIcon,
			snippet: `[[commands]]
name = "test"
run = ".verify/run.sh"
flaky_repeat = 3`,
			statusLabel: 'Command allowlist'
		},
		{
			badge: '03',
			title: 'Tree-Hashed Receipts',
			desc: 'Every test run records git commit SHA and directory tree SHA. Modifying any tracked file immediately marks past passes stale.',
			tag: 'Git Merkle Tree',
			icon: CheckCircle2,
			snippet: `Checking tree SHA: 4f9a2b8e...
Status: PASSED · Stale: false
Turn verdict: PERMITTED`,
			statusLabel: 'Cryptographic binding'
		},
		{
			badge: '04',
			title: 'Claude Code Stop Hook',
			desc: 'Integrates natively into Claude Code as a physical stop gate. Agents claiming tests pass without a fresh receipt are blocked.',
			tag: 'Physical Gate',
			icon: Lock,
			snippet: `Claude Code: "All tests pass!"
Hook Execution: tekmor stop-gate
🛑 HOOK VERDICT: REJECTED (STALE_RECEIPT)`,
			statusLabel: 'Stop gate enforcement'
		}
	];

	const thesmosPillars: Pillar[] = [
		{
			badge: '01',
			title: 'Deterministic YAML DAGs',
			desc: 'Replaces chaotic, unbounded prompt loops with a structured directed acyclic graph defining reproduction, repair, and sign-off.',
			tag: 'Workflow State Machine',
			icon: TerminalIcon,
			snippet: `pipeline: bugfix_pipeline
start_node: reproduce_failure
nodes: [reproduce, patch, verify, sign_off]`,
			statusLabel: 'Strict DAG traversal'
		},
		{
			badge: '02',
			title: 'Append-Only SQLite History',
			desc: 'Workflows append immutable step snapshots to SQLite. Rows are never edited or overwritten, providing a verifiable tamper-proof audit trail.',
			tag: 'state.db (SQLite)',
			icon: Database,
			snippet: `step_id | node_name  | status | exit_code
001     | reproduce  | FAILED | 1
002     | patch      | DONE   | 0`,
			statusLabel: 'Immutable audit log'
		},
		{
			badge: '03',
			title: 'Time-Travel State Replay',
			desc: 'Replay command reads SQLite snapshots and reconstructs the full state graph in under 5ms with zero token expenditure and zero model calls.',
			tag: 'Zero-Token Replay',
			icon: RefreshCw,
			snippet: `$ agent-spine replay exec_8f12a0
✔ Reconstructed state graph in 4.8ms
✔ 0 steps re-executed · 0 tokens spent`,
			statusLabel: 'Instant state replay'
		},
		{
			badge: '04',
			title: 'Human Approval Gates',
			desc: 'Built-in approval nodes halt execution until human review. Bounded agent steps prevent runaway loops and uncontrolled tool proliferation.',
			tag: 'Human-in-the-Loop',
			icon: Shield,
			snippet: `- name: production_deploy
  kind: approval_gate
  timeout_seconds: 3600
  verdict: PENDING_HUMAN_SIGN_OFF`,
			statusLabel: 'Bounded execution'
		}
	];

	const pad = (index: number) => String(index + 1).padStart(2, '0');
</script>

<div class="yc-container pl-10 sm:pl-14 md:pl-16 lg:pl-20">
	<!-- Hero Section (Anode Parity) -->
	<section class="pt-24 sm:pt-32 pb-16 relative overflow-hidden bg-[#000000]">
		<!-- Subtle ambient glow -->
		<div
			class="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[480px] w-[750px] -translate-x-1/2 rounded-full {glowBg} blur-3xl"
		></div>

		<!-- Top Monospace Release Pill (Anode Parity) -->
		<div class="flex flex-wrap items-center gap-2 mb-8 text-xs font-mono-code text-neutral-400">
			<span class="w-2 h-2 rounded-full {isTekmor ? 'bg-emerald-500' : 'bg-blue-500'} animate-pulse"></span>
			<span class="text-white font-medium">{product.version}</span>
			<span class="text-neutral-600">•</span>
			<span>Runs locally</span>
			<span class="text-neutral-600">•</span>
			<span>No model calls</span>
			<span class="text-neutral-600">•</span>
			<span class="text-neutral-500">Apache 2.0 Open Source</span>
		</div>

		<!-- Two-Column Balanced Hero Grid (Anode Parity) -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12">
			<!-- Left Column (span 7): Title, Mission & Invariant Bullets -->
			<div class="lg:col-span-7 flex flex-col justify-between space-y-6">
				<h1 class="text-5xl sm:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[1.02]">
					<span class="capitalize">{product.name}.</span>
					<span class="block text-neutral-500 font-bold mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-[2.2rem] xl:text-[2.6rem] leading-[1.14]">
						{product.headline}
					</span>
				</h1>

				<p class="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal max-w-xl">
					{product.subline}
				</p>

				<!-- Trust Checklist / Chips -->
				<div class="flex flex-wrap items-center gap-5 text-xs font-mono-code text-neutral-400 pt-2">
					{#each product.chips as chip (chip)}
						<div class="flex items-center gap-1.5">
							<span class="{accentText} font-bold">✓</span>
							<span>{chip}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Right Column (span 5): Quickstart Install Box & Action Buttons -->
			<div id="quickstart" class="lg:col-span-5 space-y-4 pt-1">
				<!-- Install Box with Tab Switcher (Anode Parity) -->
				<div class="rounded-2xl border border-white/[0.12] bg-[#0c0c0f] hover:border-white/[0.28] transition-all p-4 shadow-2xl">
					<div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/[0.06] text-xs font-mono-code text-neutral-400">
						<div class="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-lg border border-white/[0.06] shrink-0">
							{#each [
								{ id: 'brew' as const, label: 'brew install' },
								{ id: 'curl' as const, label: 'curl' },
								{ id: 'source' as const, label: 'source' }
							] as tab (tab.id)}
								<button
									type="button"
									onclick={() => (installMethod = tab.id)}
									class="relative px-2.5 py-0.5 text-[11px] font-mono-code rounded transition-colors {installMethod === tab.id ? 'bg-white text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'}"
								>
									{tab.label}
								</button>
							{/each}
						</div>
						<span class="text-[10px] sm:text-[11px] text-neutral-500 font-mono-code shrink-0">macOS arm64</span>
					</div>

					<div class="flex items-center justify-between gap-3 font-mono-code text-xs sm:text-sm">
						<div class="flex items-center gap-2 overflow-x-auto no-scrollbar truncate text-neutral-200">
							<span class="{accentText} font-bold select-none">$</span>
							<span class="truncate">{installCmd}</span>
						</div>
						<button
							type="button"
							onclick={copyInstall}
							class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.08] border border-white/[0.12] hover:bg-white/[0.16] text-xs font-mono-code text-neutral-200 transition-colors shrink-0"
							aria-label="Copy install command"
						>
							{#if copied}
								<span class="{accentText} font-bold">Copied</span>
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
						href="{product.id}/docs"
						class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-neutral-200 text-sm font-semibold transition-all shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98]"
					>
						<span>Read {product.name} docs</span>
						<ArrowRight class="w-4 h-4" />
					</a>
					<a
						href="{product.id}/blog"
						class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/20 text-neutral-300 hover:text-white hover:border-white/40 text-sm font-medium transition-all"
					>
						<span>Read the blog</span>
					</a>
				</div>

				<p class="text-xs text-neutral-500 font-mono-code pt-1">
					Free and open source under Apache 2.0. Runs 100% locally on your machine.
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
						<span class="ml-2 font-mono-code text-[11px] text-neutral-400">.{product.id} / proof engine</span>
					</div>

					<div class="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono-code">
						{#if isTekmor}
							<button
								type="button"
								onclick={() => (activeTab = 'config')}
								class="rounded-md px-2.5 py-1 font-medium transition-colors {activeTab === 'config'
									? 'bg-[#5fd39a]/15 text-[#5fd39a] border border-[#5fd39a]/30'
									: 'text-neutral-400 hover:text-white'}"
							>
								verify.toml
							</button>
							<button
								type="button"
								onclick={() => (activeTab = 'receipt')}
								class="rounded-md px-2.5 py-1 font-medium transition-colors {activeTab === 'receipt'
									? 'bg-[#5fd39a]/15 text-[#5fd39a] border border-[#5fd39a]/30'
									: 'text-neutral-400 hover:text-white'}"
							>
								receipt.json
							</button>
							<button
								type="button"
								onclick={() => (activeTab = 'gate')}
								class="rounded-md px-2.5 py-1 font-medium transition-colors {activeTab === 'gate'
									? 'bg-[#ff531a]/15 text-[#ff7a4a] border border-[#ff531a]/30'
									: 'text-neutral-400 hover:text-white'}"
							>
								Stop Gate
							</button>
						{:else}
							<button
								type="button"
								onclick={() => (activeTab = 'config')}
								class="rounded-md px-2.5 py-1 font-medium transition-colors {activeTab === 'config'
									? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
									: 'text-neutral-400 hover:text-white'}"
							>
								workflow.yaml
							</button>
							<button
								type="button"
								onclick={() => (activeTab = 'receipt')}
								class="rounded-md px-2.5 py-1 font-medium transition-colors {activeTab === 'receipt'
									? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
									: 'text-neutral-400 hover:text-white'}"
							>
								state.db (SQLite)
							</button>
							<button
								type="button"
								onclick={() => (activeTab = 'gate')}
								class="rounded-md px-2.5 py-1 font-medium transition-colors {activeTab === 'gate'
									? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
									: 'text-neutral-400 hover:text-white'}"
							>
								State Replay
							</button>
						{/if}
					</div>
				</div>

				<!-- Terminal Body -->
				<div class="p-5 font-mono-code text-xs leading-relaxed overflow-x-auto min-h-[250px]">
					{#if isTekmor}
						{#if activeTab === 'config'}
							<div class="text-neutral-500 mb-2"># .verify/verify.toml — Allowlist of trusted commands</div>
							<pre class="overflow-x-auto text-neutral-200"><span class="text-[#5fd39a]">[verify]</span>
version = <span class="text-amber-300">"1.0.0"</span>
timeout_seconds = <span class="text-amber-300">60</span>

<span class="text-[#5fd39a]">[[commands]]</span>
name = <span class="text-amber-300">"test"</span>
run = <span class="text-amber-300">".verify/run.sh"</span>
flaky_repeat = <span class="text-amber-300">3</span>

<span class="text-[#5fd39a]">[[commands]]</span>
name = <span class="text-amber-300">"lint"</span>
run = <span class="text-amber-300">"cargo clippy -- -D warnings"</span></pre>
						{:else if activeTab === 'receipt'}
							<div class="text-neutral-500 mb-2">// .verify/receipt.json — Cryptographic proof of execution</div>
							<pre class="overflow-x-auto text-[#5fd39a]">&#123;
  <span class="text-neutral-400">"schema":</span> <span class="text-amber-300">"v1.0.0"</span>,
  <span class="text-neutral-400">"command":</span> <span class="text-amber-300">".verify/run.sh"</span>,
  <span class="text-neutral-400">"exit_code":</span> <span class="text-white">0</span>,
  <span class="text-neutral-400">"git_commit":</span> <span class="text-amber-300">"1a2b3c4d5e6f"</span>,
  <span class="text-neutral-400">"tree_sha":</span> <span class="text-amber-300">"4f9a2b8e19c02d7e"</span>,
  <span class="text-neutral-400">"verdict":</span> <span class="text-emerald-400 font-bold">"PASSED"</span>,
  <span class="text-neutral-400">"source":</span> <span class="text-amber-300">"cli"</span>,
  <span class="text-neutral-400">"stale":</span> <span class="text-emerald-400">false</span>
&#125;</pre>
						{:else}
							<div class="text-neutral-500 mb-2"># Claude Code Stop Gate Hook Interception</div>
							<div class="space-y-1.5 overflow-x-auto">
								<div class="text-neutral-400">
									<span class="text-blue-400">Claude Code:</span> "I fixed the issue. All test assertions pass!"
								</div>
								<div class="text-neutral-500">▶ Executing Hook: tekmor stop-gate</div>
								<div class="text-amber-300">Checking current git tree SHA: <span class="text-white">8c12a0f7...</span></div>
								<div class="text-amber-300">Checking last receipt tree SHA: <span class="text-white">4f9a2b8e...</span></div>
								<div class="rounded-lg border border-red-500/20 bg-red-950/30 p-2.5 text-[11px] text-red-300">
									<div>🛑 HOOK VERDICT: REJECTED (STALE_RECEIPT)</div>
									<div class="text-neutral-400 mt-1">Reason: Code modified after test completed. Turn cannot end without fresh proof.</div>
								</div>
							</div>
						{/if}
					{:else if activeTab === 'config'}
						<div class="text-neutral-500 mb-2"># bugfix.yaml — Deterministic DAG definition</div>
						<pre class="overflow-x-auto text-neutral-200"><span class="text-blue-400">name:</span> bugfix_pipeline
<span class="text-blue-400">start_node:</span> reproduce_failure
<span class="text-blue-400">nodes:</span>
  - <span class="text-white">name:</span> reproduce_failure
    <span class="text-white">kind:</span> verify
    <span class="text-white">command:</span> <span class="text-amber-300">"cargo test --test reproduce_bug"</span>
  - <span class="text-white">name:</span> isolate_and_patch
    <span class="text-white">kind:</span> agent
  - <span class="text-white">name:</span> verify_fix
    <span class="text-white">kind:</span> verify
    <span class="text-white">command:</span> <span class="text-amber-300">"cargo test --all-features"</span>
  - <span class="text-white">name:</span> sign_off
    <span class="text-white">kind:</span> approval_gate</pre>
					{:else if activeTab === 'receipt'}
						<div class="text-neutral-500 mb-2">-- SQLite snapshots table (state.db)</div>
						<pre class="overflow-x-auto text-blue-400">step_id | node_name         | status   | exit_code | timestamp
--------+-------------------+----------+-----------+---------------------
001     | reproduce_failure | FAILED   | 1         | 2026-10-28 14:10:02
002     | isolate_and_patch | COMPLETE | 0         | 2026-10-28 14:11:15
003     | verify_fix        | PASSED   | 0         | 2026-10-28 14:11:42
004     | sign_off          | APPROVED | 0         | 2026-10-28 14:12:01</pre>
					{:else}
						<div class="text-neutral-500 mb-2"># Zero-Re-run Replay</div>
						<div class="space-y-1.5 overflow-x-auto">
							<div class="text-neutral-400">
								<span class="text-blue-400">$ </span>agent-spine replay exec_8f12a0
							</div>
							<div class="text-blue-400 flex items-center gap-1.5">
								✔ Loaded 4 immutable snapshots from ~/.autonomic/state/spine/state.db
							</div>
							<div class="text-neutral-300 flex items-center gap-1.5">
								✔ Reconstructed DAG state graph in 0.04s
							</div>
							<div class="text-emerald-400 font-semibold flex items-center gap-1.5">
								✔ Verification status verified. 0 agent LLM tokens re-spent.
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Animated Connector Arrow from Terminal to Pipeline (Anode Parity) -->
		<div class="flex flex-col items-center justify-center pt-6 pb-4 relative">
			<div class="h-8 w-[1px] bg-gradient-to-b from-white/20 via-{isTekmor ? '[#5fd39a]' : 'blue-500'}/60 to-{isTekmor ? '[#5fd39a]' : 'blue-500'} relative overflow-hidden">
				<div class="absolute top-0 left-0 w-full h-4 bg-white shadow-[0_0_8px_rgba(255,255,255,1)] animate-pulse"></div>
			</div>
			<div class="w-6 h-6 rounded-full bg-[#0a0a0c] border border-white/20 flex items-center justify-center shadow-lg my-1">
				<span class="text-[11px] {accentText} font-mono-code font-bold leading-none">↓</span>
			</div>
			<span class="text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest mt-0.5">
				Deterministic Execution Flow
			</span>
		</div>

		<!-- 3 Value Pillars Connected by Flow Arrows (Anode Parity) -->
		<div class="relative grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 pb-8">
			<!-- Stage 1 -->
			<div class="p-5 rounded-2xl bg-[#08080b] border border-white/[0.08] flex flex-col justify-between hover:border-white/[0.2] transition-colors">
				<div>
					<div class="flex items-center justify-between mb-2">
						<div class="flex items-center gap-2 text-xs font-mono-code font-bold text-white">
							<span class="px-1.5 py-0.5 rounded {accentBadgeBg} border {accentBorder} {accentText}">01</span>
							<span>{isTekmor ? 'Configure' : 'Plan'}</span>
						</div>
						<span class="text-[10px] font-mono-code text-neutral-400 uppercase">{isTekmor ? 'verify.toml' : 'YAML DAG'}</span>
					</div>
					<p class="text-xs text-neutral-400 leading-relaxed">
						{isTekmor
							? 'Define trusted test and lint commands with explicit flaky repetition parameters.'
							: 'Declare reproducible workflow graph nodes, dependencies, and approval conditions.'}
					</p>
				</div>
				<div class="mt-3 pt-2.5 border-t border-white/[0.04] text-[11px] font-mono-code {accentText} flex items-center gap-1.5">
					<span>Pre-execution contract</span>
					<span class="text-neutral-600">→</span>
				</div>
			</div>

			<!-- Stage 2 -->
			<div class="p-5 rounded-2xl bg-[#08080b] border border-white/[0.08] flex flex-col justify-between hover:border-white/[0.2] transition-colors">
				<div>
					<div class="flex items-center justify-between mb-2">
						<div class="flex items-center gap-2 text-xs font-mono-code font-bold text-white">
							<span class="px-1.5 py-0.5 rounded {accentBadgeBg} border {accentBorder} {accentText}">02</span>
							<span>Execute</span>
						</div>
						<span class="text-[10px] font-mono-code text-neutral-400 uppercase">{isTekmor ? 'Subshell Run' : 'State Commits'}</span>
					</div>
					<p class="text-xs text-neutral-400 leading-relaxed">
						{isTekmor
							? 'Runs allowlisted checks in isolated process. Records exit codes and git tree hash.'
							: 'Executes node by node, committing an immutable snapshot to SQLite after every step.'}
					</p>
				</div>
				<div class="mt-3 pt-2.5 border-t border-white/[0.04] text-[11px] font-mono-code {accentText} flex items-center gap-1.5">
					<span>Bounded execution</span>
					<span class="text-neutral-600">→</span>
				</div>
			</div>

			<!-- Stage 3 -->
			<div class="p-5 rounded-2xl bg-[#08080b] border border-white/[0.08] flex flex-col justify-between hover:border-white/[0.2] transition-colors">
				<div>
					<div class="flex items-center justify-between mb-2">
						<div class="flex items-center gap-2 text-xs font-mono-code font-bold text-white">
							<span class="px-1.5 py-0.5 rounded {accentBadgeBg} border {accentBorder} {accentText}">03</span>
							<span>{isTekmor ? 'Stop Gate' : 'Replay'}</span>
						</div>
						<span class="text-[10px] font-mono-code text-neutral-400 uppercase">{isTekmor ? 'receipt.json' : 'state.db'}</span>
					</div>
					<p class="text-xs text-neutral-400 leading-relaxed">
						{isTekmor
							? 'Blocks agent turn completion if code changed after test or without signed receipt.'
							: 'Reconstructs entire historical execution state in 4.8ms with zero token expenditure.'}
					</p>
				</div>
				<div class="mt-3 pt-2.5 border-t border-white/[0.04] text-[11px] font-mono-code {accentText} flex items-center gap-1.5">
					<span>Cryptographic verdict</span>
					<span class="{accentText}">✓</span>
				</div>
			</div>
		</div>
	</section>
</div>

<!-- Ecosystem Integration Bar (Anode Parity) -->
<EcosystemBar technologies={isTekmor ? tekmorTechs : thesmosTechs} />

<div class="yc-container pl-10 sm:pl-14 md:pl-16 lg:pl-20">
	<!-- Empirical Benchmarks Section (Anode Parity) -->
	<BenchmarkMetrics
		color={accentColor}
		badge="{product.name} Benchmarks"
		stats={isTekmor ? tekmorStats : thesmosStats}
		methodLink="{product.id}/docs#benchmarks"
	/>

	<!-- Drift Comparison: Stochastic Agent Trap vs Deterministic Boundary (Anode Parity) -->
	<DriftComparison
		color={accentColor}
		badge={drift.badge}
		title={drift.title}
		description={drift.description}
		leftBadge={drift.leftBadge}
		leftTitle={drift.leftTitle}
		leftDesc={drift.leftDesc}
		leftPoints={drift.leftPoints}
		leftSnippetHeader={drift.leftSnippetHeader}
		leftSnippetCode={drift.leftSnippetCode}
		rightBadge={drift.rightBadge}
		rightTitle={drift.rightTitle}
		rightDesc={drift.rightDesc}
		rightPoints={drift.rightPoints}
		rightSnippetHeader={drift.rightSnippetHeader}
		rightSnippetCode={drift.rightSnippetCode}
	/>

	<!-- Product Architecture Narrative (Interactive Chapters) -->
	<section id="architecture" use:scrollReveal class="py-24 border-t border-white/[0.08] bg-[#000000]">
		<div class="text-center max-w-3xl mx-auto mb-16">
			<span class="text-xs font-mono-code uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
				System Architecture
			</span>
			<h2 class="text-3xl sm:text-5xl font-bold tracking-tight text-white">
				{product.story.headline}
			</h2>
			<p class="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed">
				How {product.name} establishes runtime boundaries at the OS and filesystem layer.
			</p>
		</div>

		<div class="space-y-12">
			{#each product.story.chapters as chapter, index (chapter.title)}
				<article
					use:scrollReveal={{ delay: index * 60 }}
					class="rounded-2xl border border-white/[0.08] bg-[#0a0a0c] yc-card p-6 sm:p-8"
				>
					<div class="grid gap-8 lg:grid-cols-12 items-start">
						<div class="lg:col-span-5 space-y-3">
							<div class="flex items-center gap-2 font-mono-code text-xs {accentText}">
								<span class="px-2 py-0.5 rounded {accentBadgeBg} border {accentBorder} font-bold">{pad(index)}</span>
								<span>Chapter {index + 1}</span>
							</div>
							<h3 class="text-xl font-bold text-white tracking-tight">{chapter.title}</h3>
							<p class="text-xs sm:text-sm leading-relaxed text-neutral-400">{chapter.body}</p>
						</div>

						<div class="lg:col-span-7">
							{#if chapter.transcript && chapter.transcript.length > 0}
								{@const transcriptText = chapter.transcript.join('\n')}
								<div class="rounded-xl border border-white/[0.08] bg-[#050608] p-4 font-mono-code text-xs">
									<div class="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-neutral-500 text-[11px]">
										<span>Execution Transcript</span>
										<button
											type="button"
											onclick={() => copyChapterTranscript(transcriptText, index)}
											class="hover:text-white transition-colors"
										>
											{#if copiedChapter === index}
												<span class="{accentText}">Copied</span>
											{:else}
												<span>Copy</span>
											{/if}
										</button>
									</div>
									<pre class="overflow-x-auto text-neutral-300 leading-relaxed whitespace-pre-wrap">{transcriptText}</pre>
								</div>
							{/if}
						</div>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<!-- The Four Pillars Bento Section with Spotlight Hover (Anode Parity) -->
	<BentoPillars
		color={accentColor}
		badge="{product.name} Invariants"
		title="Engineered for Deterministic Verification"
		description="Four immutable runtime guarantees provided by {product.name}."
		pillars={isTekmor ? tekmorPillars : thesmosPillars}
	/>

	<!-- Limitations Section (Honest Engineering Scope) -->
	<section id="limitations" use:scrollReveal class="py-24 border-t border-white/[0.08] bg-[#000000]">
		<div class="text-center max-w-3xl mx-auto mb-16">
			<span class="text-xs font-mono-code uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
				Engineering Boundaries
			</span>
			<h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-white">
				What {product.name} Is Not
			</h2>
			<p class="mt-4 text-base text-neutral-400 leading-relaxed">
				Honest limits and operational boundaries. What {product.name} does not do, by design.
			</p>
		</div>

		<ul class="max-w-4xl mx-auto divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-[#090a0d] shadow-xl">
			{#each product.limits as limit (limit)}
				<li class="flex gap-4 px-6 py-5 text-xs sm:text-sm leading-relaxed text-neutral-300">
					<Minus size={16} class="mt-0.5 shrink-0 text-neutral-500" />
					<span>{limit}</span>
				</li>
			{/each}
		</ul>
	</section>

	<!-- Interactive 2-Column FAQ Bento Section (Anode Parity) -->
	{#if product.faqs && product.faqs.length > 0}
		<FAQSection
			color={accentColor}
			badge="{product.name} Architecture &amp; FAQ"
			title="Frequently Asked Questions"
			description="Direct answers on {product.name} security boundaries, runtime execution, and integration with agent harnesses."
			items={product.faqs}
		/>
	{/if}
</div>
