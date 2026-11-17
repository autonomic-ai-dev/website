<script lang="ts">
	import ChangelogTimeline from '#lib/components/ChangelogTimeline.svelte';
	import { changelogEntries } from '#lib/content/changelog';
</script>

<svelte:head>
	<title>Changelog — Autonomic AI</title>
	<meta name="description" content="Product release history, engineering changes, and architectural upgrades for tekmor and thesmos." />
</svelte:head>

<div class="yc-container py-12 md:py-20">
	<!-- Hero Section -->
	<header class="max-w-3xl">
		<div class="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-1.5 font-mono text-xs text-neutral-300">
			<span class="live-beacon"></span>
			<span>Release History & Changelog</span>
		</div>
		<h1 class="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
			What's new in Autonomic AI.
		</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-400 sm:text-lg">
			A chronological log of releases, architectural changes, security enhancements, and bug fixes across Tekmor and Thesmos.
		</p>
	</header>

	<ChangelogTimeline entries={changelogEntries} showFilter={true} />
</div>
