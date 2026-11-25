<script lang="ts">
	import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-svelte';
	import { scrollReveal } from '#lib/actions/scrollReveal';

	let {
		color = 'orange',
		badge = 'Architecture Without Drift',
		title = 'Stop Letting Coding Agents Grade Their Own Homework',
		description = 'When coding agents verify their own code with unrestricted bash commands, stochastic prompt completions declare victory even when tests fail. Autonomic AI enforces recorded proof at the OS and process boundary.',
		leftBadge = 'The Stochastic Prompt Trap',
		leftTitle = 'Fragile Self-Declared Passes',
		leftDesc = 'Language models misread exit codes, assume bash commands succeeded, and alter files after running tests without re-verifying.',
		rightBadge = 'Deterministic Boundary',
		rightTitle = 'Process & Deterministic Gates',
		rightDesc = 'Thesmos governs the execution DAG in append-only SQLite. Tekmor physically blocks turns until an allowlisted check records a PASSED receipt for the current code.',
		leftPoints = [
			'Agents misread exit codes or swallow assertion failures silently',
			'Files modified after test execution still reported as "all tests pass"',
			'Arbitrary hallucinated bash commands executed with zero allowlist',
			'Debugging failed runs requires burning thousands of expensive tokens'
		],
		rightPoints = [
			'Claude Code stop hooks physically block turn finish without valid receipt',
			'Any counted edit or a new commit makes earlier test passes stop counting',
			'Allowlisted commands only (.verify/verify.toml); unlisted execution refused',
			'Time-travel replay from immutable SQLite snapshots in <5ms with 0 tokens'
		],
		leftSnippetHeader = 'unstructured-agent.log (Unverified Prompt Loop)',
		leftSnippetCode = `> claude-code: "All 14 unit tests pass! I will now finish the turn."
! files modified after test command: src/auth/token.rs (+18, -4)
! code changed after test run: 4f9a2b8e -> 8c12a0f7 (Tests were NEVER re-run!)
? exit code was ignored: bash exit code 1 treated as text completion
✗ Agent self-declared pass accepted with zero recorded evidence`,
		rightSnippetHeader = 'tekmor verify receipt',
		rightSnippetCode = `tekmor verify -- sh -c true
tekmor verify receipt
✔ Verify receipt: PASSED
  commit:    2a424911d701
  code hash: e3b0c44298fc
------------------------------------------------------------
Claude Code Stop Hook: receipt PASSED
✔ Turn permitted · 0 model calls`
	}: {
		color?: 'orange' | 'emerald' | 'blue';
		badge?: string;
		title?: string;
		description?: string;
		leftBadge?: string;
		leftTitle?: string;
		leftDesc?: string;
		rightBadge?: string;
		rightTitle?: string;
		rightDesc?: string;
		leftPoints?: string[];
		rightPoints?: string[];
		leftSnippetHeader?: string;
		leftSnippetCode?: string;
		rightSnippetHeader?: string;
		rightSnippetCode?: string;
	} = $props();

	const colorStyles = {
		orange: {
			badgeBorder: 'border-[#ff531a]/40',
			badgeBg: 'bg-[#ff531a]/10',
			badgeText: 'text-[#ff7a4a]',
			iconColor: 'text-[#ff7a4a]',
			cardHover: 'hover:border-[#ff531a]/30'
		},
		emerald: {
			badgeBorder: 'border-emerald-500/40',
			badgeBg: 'bg-emerald-950/40',
			badgeText: 'text-emerald-400',
			iconColor: 'text-emerald-400',
			cardHover: 'hover:border-emerald-500/30'
		},
		blue: {
			badgeBorder: 'border-blue-500/40',
			badgeBg: 'bg-blue-950/40',
			badgeText: 'text-blue-400',
			iconColor: 'text-blue-400',
			cardHover: 'hover:border-blue-500/30'
		}
	};

	const s = $derived(colorStyles[color] ?? colorStyles.orange);
</script>

<section id="drift" use:scrollReveal class="py-24 relative overflow-hidden bg-[#000000] border-t border-white/[0.08]">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
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

		<!-- Side-by-side comparison cards -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
			<!-- Status Quo: The Stochastic Agent Trap -->
			<div
				use:scrollReveal={{ delay: 0 }}
				class="relative rounded-2xl border border-white/[0.08] bg-[#0a0a0c] yc-card p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between hover:border-red-500/25 transition-all duration-300"
			>
				<div class="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
					<h3 class="text-xl font-bold text-neutral-200">
						{leftTitle}
					</h3>
					<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-code bg-red-950/40 text-red-400 border border-red-900/40 shrink-0">
						<XCircle class="w-3.5 h-3.5" />
						{leftBadge}
					</span>
				</div>

				<div class="space-y-4">
					<p class="text-sm text-neutral-400 leading-relaxed">
						{leftDesc}
					</p>

					<!-- Code Snippet: Stochastic failure -->
					<div class="rounded-xl bg-[#050507] p-4 border border-white/[0.06] font-mono-code text-xs text-neutral-400 space-y-1.5 overflow-x-auto">
						<div class="text-neutral-500 pb-2 border-b border-white/[0.04] flex items-center justify-between">
							<span>{leftSnippetHeader}</span>
							<span class="text-red-400">Prone to Drift</span>
						</div>
						<pre class="text-red-300/90 leading-relaxed whitespace-pre-wrap">{leftSnippetCode}</pre>
					</div>

					<!-- Drawbacks checklist -->
					<div class="space-y-2 pt-2">
						{#each leftPoints as point (point)}
							<div class="flex items-start gap-2 text-xs text-neutral-400">
								<AlertTriangle class="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
								<span>{point}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Autonomic Boundary: Deterministic & Verified -->
			<div
				use:scrollReveal={{ delay: 100 }}
				class="relative rounded-2xl border border-white/[0.08] bg-[#0a0a0c] yc-card yc-card-glow p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between {s.cardHover} transition-all duration-300 shadow-2xl"
			>
				<div class="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
					<h3 class="text-xl font-bold text-white">
						{rightTitle}
					</h3>
					<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-code {s.badgeBg} {s.badgeText} border {s.badgeBorder} shrink-0">
						<CheckCircle2 class="w-3.5 h-3.5" />
						{rightBadge}
					</span>
				</div>

				<div class="space-y-4">
					<p class="text-sm text-neutral-300 leading-relaxed">
						{rightDesc}
					</p>

					<!-- Code Snippet: Deterministic verification -->
					<div class="rounded-xl bg-[#050507] p-4 border border-white/[0.06] font-mono-code text-xs text-neutral-300 space-y-1.5 overflow-x-auto">
						<div class="text-neutral-500 pb-2 border-b border-white/[0.04] flex items-center justify-between">
							<span>{rightSnippetHeader}</span>
							<span class="{s.badgeText} font-semibold">100% Deterministic Proof</span>
						</div>
						<pre class="{s.badgeText} leading-relaxed whitespace-pre-wrap">{rightSnippetCode}</pre>
					</div>

					<!-- Benefits checklist -->
					<div class="space-y-2 pt-2">
						{#each rightPoints as point (point)}
							<div class="flex items-start gap-2 text-xs text-neutral-300">
								<CheckCircle2 class="w-3.5 h-3.5 {s.iconColor} shrink-0 mt-0.5" />
								<span>{point}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
