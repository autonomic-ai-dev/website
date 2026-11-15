<script lang="ts">
	import ChangelogTimeline from '#lib/components/ChangelogTimeline.svelte';
	import { changelogEntries } from '#lib/content/changelog';
	import { products } from '#lib/data/products';

	const product = products.tekmor;
</script>

<svelte:head>
	<title>tekmor changelog — Autonomic AI</title>
	<meta name="description" content="Release notes and change history for tekmor." />
</svelte:head>

<div class="yc-container py-12 md:py-20">
	<header class="max-w-3xl">
		<div class="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-1.5 font-mono text-xs text-neutral-300">
			<span class="live-beacon"></span>
			<span>tekmor changelog</span>
		</div>
		<h1 class="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
			tekmor release history.
		</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-400 sm:text-lg">
			All changes, fixes, and security hardening for tekmor proof evals and Claude Code stop hooks.
		</p>
	</header>

	<ChangelogTimeline entries={changelogEntries} initialFilter="tekmor" showFilter={false} />
</div>
