<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { productPath, type Product } from '#lib/data/products';

	let { product, children }: { product: Product; children: Snippet } = $props();

	const path = $derived(productPath(product, page.url.pathname));
	const current = $derived(product.docsNav.flatMap((group) => group.links).find((link) => link.href === path));
	const title = $derived(current ? `${current.label} — ${product.name} docs` : `${product.name} docs`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={`${current?.label ?? 'Documentation'} for ${product.name}: ${product.subline}`} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
</svelte:head>

<div class="mx-auto flex max-w-6xl gap-12 px-4 py-12 sm:px-6">
	<aside class="hidden w-56 shrink-0 md:block">
		<nav class="sticky top-24 space-y-7 text-sm">
			{#each product.docsNav as group (group.section)}
				<div>
					<p class="mb-2 font-mono text-[11px] uppercase tracking-widest text-zinc-500">{group.section}</p>
					<ul class="space-y-0.5">
						{#each group.links as link (link.href)}
							<li>
								<a
									href={link.href}
									class="block rounded px-2 py-1.5 transition-colors {page.url.pathname === link.href
										? 'bg-zinc-900 text-white'
										: 'text-zinc-400 hover:text-white'}">{link.label}</a
								>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>
	</aside>
	<article class="prose prose-invert min-w-0 max-w-3xl flex-1 prose-pre:border prose-pre:border-zinc-800 prose-pre:bg-zinc-950">
		{@render children()}
	</article>
</div>
