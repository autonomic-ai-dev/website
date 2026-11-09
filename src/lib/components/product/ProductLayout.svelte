<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ArrowRight } from 'lucide-svelte';
	import { page } from '$app/state';
	import { products, productPath, type Product } from '#lib/data/products';

	let { product, children }: { product: Product; children: Snippet } = $props();

	const path = $derived(productPath(product, page.url.pathname));
	const canonical = $derived(`${product.origin}${path === '/' ? '' : path}`);
	const other = $derived(Object.values(products).find((p) => p.id !== product.id));

	const nav = [
		{ label: 'Overview', href: '/' },
		{ label: 'Docs', href: '/docs' },
		{ label: 'Blog', href: '/blog' },
		{ label: 'Registry', href: '/registry' }
	];

	function isActive(href: string) {
		if (href === '/') return path === '/';
		return path === href || path.startsWith(href + '/');
	}
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	<meta property="og:site_name" content={product.name} />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="min-h-screen bg-black font-sans text-zinc-100 antialiased">
	<a
		href={product.announce.href}
		class="group flex items-center justify-center gap-2 border-b border-zinc-900 bg-black px-4 py-2 text-center text-xs text-zinc-300 transition-colors hover:text-white"
	>
		<span class="inline-flex h-1.5 w-1.5 rounded-full bg-white"></span>
		<span>{product.announce.text}</span>
		<span class="font-medium text-zinc-200">{product.announce.label}</span>
		<ArrowRight size={12} class="text-zinc-200 transition-transform group-hover:translate-x-0.5" />
	</a>

	<header class="sticky top-0 z-40 border-b border-zinc-900/80 bg-black/80 backdrop-blur-md">
		<div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
			<div class="flex items-center gap-3">
				<a href="/" class="text-sm font-semibold text-white">{product.name}</a>
				<span class="rounded-full border border-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-400">{product.version}</span>
					<a href="https://autonomic-ai.dev" class="rounded-md border border-zinc-800 px-3 py-1 text-sm text-zinc-200 hover:bg-zinc-900">Home</a>
			</div>
			<nav class="hidden items-center gap-7 text-sm md:flex">
				{#each nav as item (item.href)}
					<a href={item.href} class="transition-colors {isActive(item.href) ? 'text-white' : 'text-zinc-400 hover:text-white'}">{item.label}</a>
				{/each}
			</nav>
			<div class="flex items-center gap-2">
				<a
					href="https://github.com/autonomic-ai-dev"
					target="_blank"
					rel="noopener noreferrer"
					class="hidden rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:bg-zinc-900 sm:inline-block">GitHub</a
				>
				<a href="/#install" class="rounded-md bg-white px-3.5 py-1.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200">Install</a>
			</div>
		</div>
		<nav class="flex gap-6 overflow-x-auto border-t border-zinc-900 px-4 py-2 text-sm md:hidden">
			{#each nav as item (item.href)}
				<a href={item.href} class="whitespace-nowrap {isActive(item.href) ? 'text-white' : 'text-zinc-400'}">{item.label}</a>
			{/each}
		</nav>
	</header>

	<main>
		{@render children()}
	</main>

	<footer class="mt-12 border-t border-zinc-900">
		<div class="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
			<div>
				<p class="font-medium text-zinc-300">{product.name}</p>
				<p class="mt-1">Part of Autonomic AI. Installs on its own.</p>
			</div>
			<div class="flex flex-wrap gap-6">
				{#if other}
					<a href={other.origin} class="hover:text-white">{other.name}</a>
				{/if}
				<a href="https://autonomic-ai.dev" class="hover:text-white">Autonomic AI</a>
				<a href="https://autonomic-ai.openstatus.dev" target="_blank" rel="noopener noreferrer" class="hover:text-white">Status</a>
			</div>
		</div>
	</footer>
</div>
