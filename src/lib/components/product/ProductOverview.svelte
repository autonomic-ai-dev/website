<script lang="ts">
	import { ArrowRight, Check, Copy, Minus, Terminal as TerminalIcon, Shield, Database, Lock, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { Product } from '#lib/data/products';

	let { product }: { product: Product } = $props();

	let copied = $state(false);
	let copiedCmd = $state<string | null>(null);
	let activeTab = $state<'config' | 'receipt' | 'gate'>('config');

	async function copyInstall() {
		try {
			await navigator.clipboard.writeText(product.install);
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

	const pad = (index: number) => String(index + 1).padStart(2, '0');
</script>

<div class="yc-container">
	<!-- Hero Section -->
	<section class="yc-section yc-section-first dotgrid relative overflow-hidden text-center">
		<!-- Subtle ambient glow -->
		<div class="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[480px] w-[750px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(95,211,154,0.14),transparent_70%)] blur-3xl"></div>

		<div class="mx-auto max-w-3xl">
			<!-- Trust Badge -->
			<span class="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-1.5 font-mono text-[11px] text-neutral-300">
				<span class="live-beacon"></span>
				<span>{product.badge}</span>
			</span>

			<h1 class="mt-7 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold leading-[1.1] tracking-tight text-white">
				{product.headline}
			</h1>
			<p class="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
				{product.subline}
			</p>

			<!-- Install Box -->
			<div id="install" class="mx-auto mt-9 max-w-lg scroll-mt-24 rounded-2xl border border-white/[0.1] bg-[#0c0d10] text-left shadow-2xl">
				<div class="flex items-center justify-between border-b border-white/[0.06] bg-[#07080a] px-4 py-2 font-mono text-xs">
					<div class="flex items-center gap-4">
						<span class="text-white font-medium">brew tap</span>
						<span class="text-neutral-500">curl</span>
						<span class="text-neutral-500">source</span>
					</div>
					<span class="text-[11px] text-neutral-400 font-mono">macOS arm64</span>
				</div>
				<div class="flex items-center justify-between gap-3 px-4 py-3">
					<div class="flex items-center gap-2 overflow-x-auto font-mono text-xs sm:text-sm text-neutral-200 no-scrollbar">
						<span class="select-none text-[#5fd39a]">$</span>
						<span>{product.install}</span>
					</div>
					<button
						type="button"
						onclick={copyInstall}
						aria-label="Copy install command"
						class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-neutral-300 transition-colors hover:bg-white/[0.1] hover:text-white"
					>
						{#if copied}
							<Check size={12} class="text-[#5fd39a]" />
							<span class="text-[#5fd39a]">Copied</span>
						{:else}
							<Copy size={12} />
							<span>Copy</span>
						{/if}
					</button>
				</div>
			</div>

			<!-- Chips -->
			<ul class="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-xs text-neutral-400">
				{#each product.chips as chip (chip)}
					<li class="inline-flex items-center gap-1.5">
						<Check size={13} class="text-[#5fd39a]" />
						<span>{chip}</span>
					</li>
				{/each}
			</ul>

			<!-- Action Buttons -->
			<div class="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 text-sm">
				<a href="/{product.id}/docs" class="yc-btn yc-btn-primary w-full sm:w-auto">
					<span>Read {product.name} docs</span>
					<span class="yc-btn-icon">
						<ArrowRight size={13} />
					</span>
				</a>
				<a href="/{product.id}/blog" class="yc-btn yc-btn-secondary w-full sm:w-auto">
					<span>Read the blog</span>
					<span class="yc-btn-icon">
						<ArrowRight size={13} />
					</span>
				</a>
			</div>
		</div>

		<!-- Interactive Evidence Inspector (Tactile Depth) -->
		<div class="mx-auto mt-14 max-w-3xl rounded-2xl border border-white/[0.12] bg-[#07080a] text-left shadow-2xl overflow-hidden">
			<div class="flex items-center justify-between border-b border-white/[0.08] bg-[#0c0d10] px-4 py-2.5">
				<div class="flex items-center gap-2">
					<span class="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
					<span class="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
					<span class="h-3 w-3 rounded-full bg-[#27c93f]"></span>
					<span class="ml-2 font-mono text-xs text-neutral-400">
						{product.id === 'tekmor' ? '.verify / proof engine' : 'thesmos / execution engine'}
					</span>
				</div>

				<!-- Tab Switches -->
				<div class="flex items-center gap-1 text-xs">
					<button
						type="button"
						onclick={() => (activeTab = 'config')}
						class="rounded-md px-2.5 py-1 font-medium transition-colors {activeTab === 'config' ? 'bg-[#5fd39a]/15 text-[#5fd39a] border border-[#5fd39a]/30' : 'text-neutral-400 hover:text-white'}"
					>
						{product.id === 'tekmor' ? 'verify.toml' : 'workflow.yaml'}
					</button>
					<button
						type="button"
						onclick={() => (activeTab = 'receipt')}
						class="rounded-md px-2.5 py-1 font-medium transition-colors {activeTab === 'receipt' ? 'bg-[#5fd39a]/15 text-[#5fd39a] border border-[#5fd39a]/30' : 'text-neutral-400 hover:text-white'}"
					>
						{product.id === 'tekmor' ? 'receipt.json' : 'state.db'}
					</button>
					<button
						type="button"
						onclick={() => (activeTab = 'gate')}
						class="rounded-md px-2.5 py-1 font-medium transition-colors {activeTab === 'gate' ? 'bg-[#5fd39a]/15 text-[#5fd39a] border border-[#5fd39a]/30' : 'text-neutral-400 hover:text-white'}"
					>
						{product.id === 'tekmor' ? 'Stop Gate' : 'Replay'}
					</button>
				</div>
			</div>

			<!-- Tab Content -->
			<div class="p-5 font-mono text-xs leading-relaxed text-neutral-300">
				{#if product.id === 'tekmor'}
					{#if activeTab === 'config'}
						<div class="text-neutral-500 mb-2"># .verify/verify.toml — Allowlist of trusted commands</div>
						<pre class="text-neutral-200"><span class="text-[#5fd39a]">[verify]</span>
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
						<pre class="text-[#5fd39a]">&#123;
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
						<div class="space-y-1.5">
							<div class="text-neutral-400"><span class="text-blue-400">Claude Code:</span> "I fixed the issue. All test assertions pass!"</div>
							<div class="text-neutral-500">▶ Executing Hook: tekmor stop-gate</div>
							<div class="text-amber-300">Checking current git tree SHA: <span class="text-white">8c12a0f7...</span></div>
							<div class="text-amber-300">Checking last receipt tree SHA: <span class="text-white">4f9a2b8e...</span></div>
							<div class="text-red-400 font-semibold">🛑 HOOK VERDICT: REJECTED (STALE_RECEIPT)</div>
							<div class="text-neutral-400 text-[11px]">Reason: Code modified after test completed. Turn cannot end without fresh proof.</div>
						</div>
					{/if}
				{:else}
					{#if activeTab === 'config'}
						<div class="text-neutral-500 mb-2"># bugfix.yaml — Deterministic DAG definition</div>
						<pre class="text-neutral-200"><span class="text-blue-400">name:</span> bugfix_pipeline
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
						<pre class="text-blue-400">step_id | node_name         | status   | exit_code | timestamp
--------+-------------------+----------+-----------+---------------------
001     | reproduce_failure | FAILED   | 1         | 2026-10-28 14:10:02
002     | isolate_and_patch | COMPLETE | 0         | 2026-10-28 14:11:15
003     | verify_fix        | PASSED   | 0         | 2026-10-28 14:11:42
004     | sign_off          | APPROVED | 0         | 2026-10-28 14:12:01</pre>
					{:else}
						<div class="text-neutral-500 mb-2"># Zero-Re-run Replay</div>
						<div class="space-y-1.5">
							<div class="text-neutral-400"><span class="text-[#5fd39a]">$ </span>agent-spine replay exec_8f12a0</div>
							<div class="text-blue-400">✔ Loaded 4 immutable snapshots from ~/.autonomic/state/spine/state.db</div>
							<div class="text-neutral-300">✔ Reconstructed DAG state graph in 0.04s</div>
							<div class="text-emerald-400 font-semibold">✔ Verification status verified. 0 agent LLM tokens re-spent.</div>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</section>

	<!-- Section 01: Capabilities (Bento Grid with real architectural depth) -->
	<section class="yc-section">
		<div class="flex items-center gap-2">
			<span class="yc-label">01 <b>/</b> Capabilities</span>
		</div>
		<h2 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">What it gives you</h2>
		<p class="mt-2 text-sm text-neutral-400 max-w-xl">Deterministic security gates and proof receipts that make coding agents trustworthy.</p>
		
		<div class="mt-9 rounded-2xl border border-white/[0.12] bg-white/[0.08] p-[1px] shadow-2xl">
			<div class="grid gap-[1px] bg-white/[0.08] sm:grid-cols-2 rounded-[15px] overflow-hidden">
				{#each product.features as feature, index (feature.title)}
					<article class="group relative bg-[#090a0d] p-7 transition-colors hover:bg-[#0e1015] flex flex-col justify-between">
						<div>
							<!-- Card Header -->
							<div class="flex items-center justify-between pb-4 border-b border-white/[0.06]">
								<div class="flex items-center gap-3">
									<span class="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#5fd39a]">
										<Icon name={feature.icon} size={15} />
									</span>
									<span class="font-mono text-xs font-semibold text-[#5fd39a]">{pad(index)}</span>
								</div>
								<span class="text-[11px] font-medium text-neutral-400">Feature</span>
							</div>

							<h3 class="mt-5 text-lg font-semibold text-white tracking-tight">{feature.title}</h3>
							<p class="mt-2 text-sm leading-relaxed text-neutral-400">{feature.body}</p>
						</div>

						<!-- Command Box (Styled to match the clean four-steps style) -->
						<button
							type="button"
							onclick={() => copySnippet(feature.command)}
							title="Click to copy"
							class="mt-6 flex w-full items-center justify-between rounded-lg border border-white/[0.08] bg-[#050608] px-3.5 py-2 font-mono text-xs text-neutral-300 transition-colors hover:border-white/20 hover:bg-[#07080a] text-left"
						>
							<div class="truncate">
								<span class="text-[#5fd39a] mr-2 select-none font-semibold">$</span>
								<span>{feature.command}</span>
							</div>
							{#if copiedCmd === feature.command}
								<span class="text-[11px] font-medium text-[#5fd39a] shrink-0 ml-2">Copied</span>
							{/if}
						</button>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- Section 02: Execution Loop (Linear Connected Stepper) -->
	<section class="yc-section">
		<span class="yc-label">02 <b>/</b> Execution Loop</span>
		<h2 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
			Four steps. Each one leaves evidence.
		</h2>
		<p class="mt-2 text-sm text-neutral-400 max-w-xl">A complete verification lifecycle with tamper-proof cryptographic receipts.</p>

		<!-- Horizontal Connected Flow -->
		<div class="mt-9 rounded-2xl border border-white/[0.12] bg-[#090a0d] p-6 sm:p-8 shadow-2xl">
			<div class="grid gap-6 md:grid-cols-4 relative">
				{#each product.loop as step, index (step.title)}
					<div class="flex flex-col justify-between rounded-xl border border-white/[0.06] bg-[#050608] p-5">
						<div>
							<div class="flex items-center justify-between pb-3 border-b border-white/[0.06]">
								<span class="inline-flex items-center gap-1.5 rounded-md border border-[#5fd39a]/30 bg-[#5fd39a]/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#5fd39a]">
									Step {pad(index)}
								</span>
								<Icon name={step.icon} size={14} />
							</div>

							<h3 class="mt-4 text-base font-semibold text-white tracking-tight">{step.title}</h3>
							<p class="mt-2 text-xs leading-relaxed text-neutral-400">{step.body}</p>
						</div>

						<button
							type="button"
							onclick={() => copySnippet(step.command)}
							title="Click to copy"
							class="mt-5 flex w-full items-center justify-between rounded-lg border border-white/[0.08] bg-[#050608] px-3.5 py-2 font-mono text-xs text-neutral-300 transition-colors hover:border-white/20 hover:bg-[#07080a] text-left"
						>
							<div class="truncate">
								<span class="text-[#5fd39a] mr-2 select-none font-semibold">$</span>
								<span>{step.command}</span>
							</div>
							{#if copiedCmd === step.command}
								<span class="text-[11px] font-medium text-[#5fd39a] shrink-0 ml-2">Copied</span>
							{/if}
						</button>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Section 03: Environment Compatibility (If Present) -->
	{#if product.hosts}
		<section class="yc-section">
			<span class="yc-label">03 <b>/</b> Compatibility</span>
			<h2 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
				Where the gates run, and where they do not.
			</h2>
			<p class="mt-2 text-sm text-neutral-400 max-w-xl">Enforced stop hooks in Claude Code; receipts work in any shell or CI.</p>

			<div class="mt-8 overflow-x-auto rounded-2xl border border-white/[0.1] bg-[#0c0d10] shadow-xl">
				<table class="w-full min-w-[540px] text-left text-sm">
					<thead class="border-b border-white/[0.08] bg-[#07080a] text-xs uppercase tracking-wider text-neutral-400 font-medium">
						<tr>
							<th class="px-6 py-4 font-medium">Host Environment</th>
							<th class="px-6 py-4 font-medium">Protection Mode</th>
							<th class="px-6 py-4 font-medium">Implementation Details</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-white/[0.04]">
						{#each product.hosts as host (host.name)}
							<tr class="transition-colors hover:bg-white/[0.02]">
								<td class="px-6 py-4 font-medium text-white text-xs">{host.name}</td>
								<td class="px-6 py-4">
									{#if host.hooks}
										<span class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-[#5fd39a]">
											<span class="live-beacon"></span>
											active gates
										</span>
									{:else}
										<span class="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-0.5 text-xs text-neutral-400">
											instructions only
										</span>
									{/if}
								</td>
								<td class="px-6 py-4 text-xs text-neutral-400">{host.note ?? ''}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}

	<!-- Section 04: Node Kinds (If Present) -->
	{#if product.nodeKinds}
		<section class="yc-section">
			<span class="yc-label">03 <b>/</b> Building Blocks</span>
			<h2 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
				Eight node kinds for deterministic execution.
			</h2>

			<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each product.nodeKinds as kind (kind.name)}
					<div class="yc-card p-5">
						<p class="font-mono text-sm font-semibold text-white">{kind.name}</p>
						<p class="mt-2 text-xs leading-relaxed text-neutral-400">{kind.body}</p>
					</div>
				{/each}
			</div>
			{#if product.nodeKindsNote}
				<p class="mt-5 rounded-xl border border-white/[0.08] bg-[#07080a] px-5 py-3 text-xs text-neutral-400">
					{product.nodeKindsNote}
				</p>
			{/if}
		</section>
	{/if}

	<!-- Section 05: Numbers You Can Check -->
	<section class="yc-section">
		<span class="yc-label">04 <b>/</b> Invariants</span>
		<h2 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
			Numbers you can check.
		</h2>
		<p class="mt-2 text-sm text-neutral-400">Each figure comes directly from the codebase or the published documentation.</p>

		<dl class="mt-8 grid gap-5 sm:grid-cols-3">
			{#each product.facts as fact (fact.label)}
				<div class="yc-card p-7 relative overflow-hidden">
					<dt class="font-mono text-4xl sm:text-5xl font-semibold tracking-tight text-white">{fact.value}</dt>
					<dd class="mt-3 text-xs text-neutral-400">{fact.label}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<!-- Section 06: Known Limits -->
	<section class="yc-section">
		<span class="yc-label">05 <b>/</b> Honest Boundaries</span>
		<h2 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
			What it does not do yet.
		</h2>
		<p class="mt-2 text-sm text-neutral-400">Engineering boundaries and explicit non-goals for this release.</p>

		<ul class="mt-8 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.1] bg-[#0c0d10] shadow-xl">
			{#each product.limits as limit (limit)}
				<li class="flex gap-4 px-6 py-5 text-xs sm:text-sm leading-relaxed text-neutral-300">
					<Minus size={16} class="mt-0.5 shrink-0 text-neutral-500" />
					<span>{limit}</span>
				</li>
			{/each}
		</ul>
	</section>

	<!-- Section 06: Frequently Asked Questions -->
	{#if product.faqs && product.faqs.length > 0}
		<section id="faq" class="yc-section yc-crosshair">
			<span class="yc-label">06 <b>/</b> Questions</span>
			<h2 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
				Frequently asked questions
			</h2>
			<p class="mt-3 text-sm text-neutral-400">
				Common questions about {product.name} architecture, security boundaries, and runtime execution.
			</p>

			<div class="mt-10 divide-y divide-white/[0.08] border-y border-white/[0.08]">
				{#each product.faqs as faq (faq.q)}
					<details class="group py-6">
						<summary class="flex cursor-pointer list-none items-center justify-between text-base font-medium text-neutral-200 transition-colors hover:text-white outline-none">
							<span>{faq.q}</span>
							<span class="font-mono text-lg text-neutral-500 group-open:hidden">+</span>
							<span class="hidden font-mono text-lg text-[#5fd39a] group-open:inline">&minus;</span>
						</summary>
						<div class="mt-3 text-sm leading-relaxed text-neutral-400 pr-8">
							{faq.a}
						</div>
					</details>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Section 07: Final CTA -->
	<section class="yc-section text-center relative overflow-hidden">
		<div class="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(95,211,154,0.16),transparent_70%)] blur-3xl"></div>

		<div class="yc-card p-8 sm:p-14 max-w-3xl mx-auto">
			<span class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-neutral-300">
				<span class="live-beacon"></span>
				ARM64 MACOS · LOCAL FIRST
			</span>

			<h2 class="mx-auto mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
				{product.finalCta.headline}
			</h2>
			<p class="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-neutral-400">
				{product.finalCta.subline}
			</p>
			<div class="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 text-sm">
				<a href="#install" class="yc-btn yc-btn-primary w-full sm:w-auto">
					<span>Install {product.name}</span>
					<span class="yc-btn-icon">
						<ArrowRight size={13} />
					</span>
				</a>
				<a href="/{product.id}/docs" class="yc-btn yc-btn-secondary w-full sm:w-auto">
					<span>Read the docs</span>
					<span class="yc-btn-icon">
						<ArrowRight size={13} />
					</span>
				</a>
			</div>
		</div>
	</section>
</div>
