<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { products } from '#lib/data/products';

	let { children }: { children: Snippet } = $props();

	const brain = products['agent-brain'];
	const spine = products['agent-spine'];

	function isActive(href: string) {
		return page.url.pathname === href;
	}
</script>

<div class="min-h-screen bg-black text-zinc-100 font-sans">
	<header class="sticky top-0 z-40 border-b border-zinc-900 bg-black/90 backdrop-blur">
		<div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
			<a href="/" class="text-sm font-semibold text-white">Autonomic AI</a>
			<nav class="flex items-center gap-6 text-sm">
				<a href="/products" class="transition-colors {isActive('/products') ? 'text-white' : 'text-zinc-400 hover:text-white'}">Products</a>
				<a href={brain.origin} class="hidden text-zinc-400 hover:text-white sm:inline">{brain.name}</a>
				<a href={spine.origin} class="hidden text-zinc-400 hover:text-white sm:inline">{spine.name}</a>
			</nav>
			<a
				href="https://github.com/autonomic-ai-dev"
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-900">GitHub</a
			>
		</div>
	</header>

	<main>
		{@render children()}
	</main>

	<footer class="mt-24 border-t border-zinc-900">
		<div class="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
			<p>Autonomic AI builds tools for coding agents.</p>
			<div class="flex flex-wrap gap-5">
				<a href={brain.origin} class="hover:text-white">{brain.name}</a>
				<a href={spine.origin} class="hover:text-white">{spine.name}</a>
				<a href="https://autonomic-ai.openstatus.dev" target="_blank" rel="noopener noreferrer" class="hover:text-white">Status</a>
			</div>
		</div>
	</footer>
</div>
