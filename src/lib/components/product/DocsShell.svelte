<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ChevronDown, BookOpen } from 'lucide-svelte';
	import { page } from '$app/state';
	import { renderMermaidBlocks } from '#lib/diagrams';
	import { productPath, type Product } from '#lib/data/products';

	let { product, children }: { product: Product; children: Snippet } = $props();

	let mobileDocsMenuOpen = $state(false);

	const path = $derived(productPath(product, page.url.pathname));
	const prefix = $derived(page.url.pathname.startsWith(`/${product.id}`) ? `/${product.id}` : '');
	const current = $derived(product.docsNav.flatMap((group) => group.links).find((link) => link.href === path));
	const title = $derived(current ? `${current.label} — ${product.name} docs` : `${product.name} docs`);

	function docHref(rawHref: string): string {
		return `${prefix}${rawHref}`;
	}

	function isDocActive(rawHref: string): boolean {
		return path === rawHref;
	}

	let article: HTMLElement | undefined = $state();

	$effect(() => {
		void page.url.pathname;
		mobileDocsMenuOpen = false;
		if (article) renderMermaidBlocks(article);
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={`${current?.label ?? 'Documentation'} for ${product.name}: ${product.subline}`} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
</svelte:head>

<div class="mx-auto flex max-w-6xl gap-12 px-4 py-8 sm:py-12 sm:px-6">
	<!-- Desktop Sidebar -->
	<aside class="hidden w-56 shrink-0 md:block">
		<nav class="sticky top-24 space-y-7 text-sm">
			{#each product.docsNav as group (group.section)}
				<div>
					<p class="mb-2 font-mono text-[11px] uppercase tracking-widest text-zinc-500">{group.section}</p>
					<ul class="space-y-0.5">
						{#each group.links as link (link.href)}
							<li>
								<a
									href={docHref(link.href)}
									class="block rounded px-2.5 py-1.5 transition-colors {isDocActive(link.href)
										? 'bg-white/[0.08] font-medium text-white border-l-2 border-[#5fd39a]'
										: 'text-neutral-400 hover:text-white'}">{link.label}</a
								>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>
	</aside>

	<!-- Main Documentation Content -->
	<div class="min-w-0 flex-1">
		<!-- Mobile Collapsible Docs Navigation Drawer -->
		<div class="mb-8 md:hidden">
			<button
				type="button"
				onclick={() => (mobileDocsMenuOpen = !mobileDocsMenuOpen)}
				class="flex w-full items-center justify-between rounded-xl border border-white/[0.1] bg-[#0c0d10] px-4 py-3 text-xs font-mono text-neutral-200 transition-colors hover:bg-white/[0.04]"
			>
				<span class="flex items-center gap-2">
					<BookOpen size={14} class="text-[#5fd39a]" />
					<span>Section: <strong class="text-white">{current?.label ?? 'Documentation'}</strong></span>
				</span>
				<ChevronDown size={14} class="transition-transform duration-200 {mobileDocsMenuOpen ? 'rotate-180 text-white' : 'text-neutral-400'}" />
			</button>

			{#if mobileDocsMenuOpen}
				<div class="mt-2 rounded-xl border border-white/[0.08] bg-[#090a0d] p-4 space-y-5">
					{#each product.docsNav as group (group.section)}
						<div>
							<p class="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">{group.section}</p>
							<div class="space-y-1">
								{#each group.links as link (link.href)}
									<a
										href={docHref(link.href)}
										onclick={() => (mobileDocsMenuOpen = false)}
										class="block rounded-lg px-3 py-2 text-xs transition-colors {isDocActive(link.href)
											? 'bg-white/[0.08] font-semibold text-white border-l-2 border-[#5fd39a]'
											: 'text-neutral-400 hover:bg-white/[0.04] hover:text-white'}"
									>
										{link.label}
									</a>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<article bind:this={article} class="prose prose-invert max-w-3xl prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white prose-h1:text-3xl sm:prose-h1:text-4xl prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-base sm:prose-h3:text-lg prose-p:leading-relaxed prose-pre:border prose-pre:border-zinc-800 prose-pre:bg-black [&_table]:block [&_table]:overflow-x-auto">
			{@render children()}
		</article>
	</div>
</div>
