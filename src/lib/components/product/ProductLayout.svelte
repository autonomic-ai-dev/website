<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { products, productPath, type Product } from '#lib/data/products';

	let { product, children }: { product: Product; children: Snippet } = $props();

	const version = $derived(page.data.organVersions?.[product.id] as string | undefined);
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

<div class="min-h-screen bg-black text-zinc-100 font-sans">
	<header class="sticky top-0 z-40 border-b border-zinc-900 bg-black/90 backdrop-blur">
		<div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
			<div class="flex items-center gap-3">
				<a href="/" class="text-sm font-semibold text-white">{product.name}</a>
				{#if version}
					<span class="rounded-full border border-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-400">{version}</span>
				{/if}
			</div>
			<nav class="hidden items-center gap-6 text-sm md:flex">
				{#each nav as item (item.href)}
					<a
						href={item.href}
						class="transition-colors {isActive(item.href) ? 'text-white' : 'text-zinc-400 hover:text-white'}">{item.label}</a
					>
				{/each}
			</nav>
			<a
				href="https://github.com/autonomic-ai-dev"
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-900">GitHub</a
			>
		</div>
		<nav class="flex gap-5 overflow-x-auto border-t border-zinc-900 px-4 py-2 text-sm md:hidden">
			{#each nav as item (item.href)}
				<a href={item.href} class={isActive(item.href) ? 'text-white' : 'text-zinc-400'}>{item.label}</a>
			{/each}
		</nav>
	</header>

	<main>
		{@render children()}
	</main>

	<footer class="mt-24 border-t border-zinc-900">
		<div class="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
			<p>{product.name} is part of Autonomic AI. It installs on its own.</p>
			<div class="flex flex-wrap gap-5">
				{#if other}
					<a href={other.origin} class="hover:text-white">{other.name}</a>
				{/if}
				<a href="https://autonomic-ai.dev" class="hover:text-white">Autonomic AI</a>
				<a href="https://autonomic-ai.openstatus.dev" target="_blank" rel="noopener noreferrer" class="hover:text-white">Status</a>
			</div>
		</div>
	</footer>
</div>
