<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ArrowRight, Menu, X } from 'lucide-svelte';
	import { page } from '$app/state';
	import { products, productPath, type Product } from '#lib/data/products';
	import Footer from '#lib/components/Footer.svelte';

	let { product, children }: { product: Product; children: Snippet } = $props();

	let mobileMenuOpen = $state(false);

	const prefix = $derived(page.url.pathname.startsWith(`/${product.id}`) ? `/${product.id}` : '');
	const path = $derived(productPath(product, page.url.pathname));
	const canonical = $derived(`${product.origin}${path === '/' ? '' : path}`);
	const other = $derived(Object.values(products).find((p) => p.id !== product.id));

	const nav = $derived([
		{ label: 'Overview', href: `${prefix}/` },
		{ label: 'Docs', href: `${prefix}/docs` },
		{ label: 'Blog', href: `${prefix}/blog` },
		{ label: 'Changelog', href: `${prefix}/changelog` }
	]);

	function isActive(href: string) {
		const targetPath = href.replace(prefix, '') || '/';
		if (targetPath === '/') return path === '/';
		return path === targetPath || path.startsWith(targetPath + '/');
	}

	$effect(() => {
		void page.url.pathname;
		mobileMenuOpen = false;
	});
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	<meta property="og:site_name" content={product.name} />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="min-h-screen bg-[#070709] font-sans text-neutral-100 antialiased selection:bg-[#5fd39a]/20 selection:text-white">
	<a
		href={product.announce.href}
		class="group flex items-center justify-center gap-2 border-b border-white/[0.08] bg-[#090a0d] px-4 py-2 text-center text-xs text-neutral-300 transition-colors hover:text-white"
	>
		<span class="inline-flex h-1.5 w-1.5 rounded-full bg-[#5fd39a] ring-2 ring-[#5fd39a]/20"></span>
		<span class="text-neutral-400">{product.announce.text}</span>
		<span class="font-medium text-white underline decoration-white/20 underline-offset-2 group-hover:decoration-white">{product.announce.label}</span>
		<ArrowRight size={12} class="text-neutral-400 transition-transform group-hover:translate-x-0.5" />
	</a>

	<header class="sticky top-0 z-40 border-b border-white/[0.08] bg-[#070709]/90 backdrop-blur-xl">
		<div class="yc-container flex items-center justify-between py-3.5">
			<div class="flex items-center gap-2.5 sm:gap-3">
				<a href="{prefix}/" class="flex items-center gap-2 text-sm font-semibold tracking-tight text-white hover:text-white/90 transition-colors">
					<span class="flex h-5 w-5 items-center justify-center rounded border border-white/20 bg-white/[0.05] font-mono text-[11px] font-bold text-[#5fd39a]">
						{product.name[0].toUpperCase()}
					</span>
					<span>{product.name}</span>
				</a>
				<span class="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-0.5 font-mono text-[11px] text-neutral-400">{product.version}</span>
				<a href="/" class="hidden sm:inline-block rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-xs text-neutral-300 hover:bg-white/[0.08] hover:text-white transition-colors">← Ecosystem</a>
			</div>

			<!-- Desktop Nav (Roomy gap-7) -->
			<nav class="hidden items-center gap-7 text-sm md:flex">
				{#each nav as item (item.href)}
					<a href={item.href} class="transition-colors {isActive(item.href) ? 'text-white font-medium' : 'text-neutral-400 hover:text-white'}">{item.label}</a>
				{/each}
			</nav>

			<div class="flex items-center gap-2.5">
				<a
					href="https://github.com/autonomic-ai-dev"
					target="_blank"
					rel="noopener noreferrer"
					class="hidden rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:bg-white/[0.08] hover:text-white sm:inline-block"
				>
					GitHub
				</a>
				<a href="#install" class="hidden sm:inline-block rounded-lg bg-white px-3.5 py-1.5 text-xs font-medium text-black transition-colors hover:bg-neutral-200">Install</a>

				<!-- Mobile Menu Toggle Button -->
				<button
					type="button"
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
					class="inline-flex md:hidden items-center justify-center h-8 w-8 rounded-lg border border-white/[0.12] bg-white/[0.04] text-neutral-300 transition-colors hover:bg-white/[0.08] hover:text-white"
				>
					{#if mobileMenuOpen}
						<X size={16} />
					{:else}
						<Menu size={16} />
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile Menu Drawer -->
		{#if mobileMenuOpen}
			<div class="md:hidden border-t border-white/[0.08] bg-[#090a0d] px-4 py-4 space-y-4">
				<div class="flex flex-col space-y-1">
					{#each nav as item (item.href)}
						<a
							href={item.href}
							onclick={() => (mobileMenuOpen = false)}
							class="rounded-lg px-3 py-2 text-sm transition-colors {isActive(item.href) ? 'bg-white/[0.08] font-medium text-white' : 'text-neutral-300 hover:bg-white/[0.05] hover:text-white'}"
						>
							{item.label}
						</a>
					{/each}
					<a
						href="/"
						onclick={() => (mobileMenuOpen = false)}
						class="rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/[0.05] hover:text-white"
					>
						← Back to Autonomic AI Ecosystem
					</a>
				</div>

				<div class="pt-3 border-t border-white/[0.06] flex items-center gap-3">
					<a
						href="https://github.com/autonomic-ai-dev"
						target="_blank"
						rel="noopener noreferrer"
						class="flex-1 text-center rounded-xl border border-white/[0.12] bg-white/[0.04] py-2 text-xs font-mono text-neutral-200"
					>
						GitHub
					</a>
					<a
						href="#install"
						onclick={() => (mobileMenuOpen = false)}
						class="flex-1 text-center rounded-xl bg-white py-2 text-xs font-semibold text-black"
					>
						Install
					</a>
				</div>
			</div>
		{/if}
	</header>

	<main>
		{@render children()}
	</main>

	<Footer brand={product.id === 'thesmos' ? 'thesmos' : 'tekmor'} {product} />
</div>
