<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ArrowRight, Menu, X } from 'lucide-svelte';
	import { page } from '$app/state';
	import { products, productPath, type Product } from '#lib/data/products';
	import Footer from '#lib/components/Footer.svelte';
	import ContinuousConduit from '#lib/components/ContinuousConduit.svelte';

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

	const installHref = $derived(path === '/' ? '#quickstart' : `${prefix}/docs/installation`);
	const repoUrl = $derived(product.repoUrl || `https://github.com/autonomic-ai-dev/${product.id}`);

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

<div class="min-h-screen bg-[#000000] font-sans text-neutral-100 antialiased selection:bg-white/20 selection:text-white">
	<!-- Top Announcement Banner (Anode Parity) -->
	<div class="border-b border-white/[0.06] bg-[#050505] py-1.5 px-4 text-center text-xs text-neutral-400">
		<a href={product.announce.href} class="inline-flex items-center gap-2 hover:text-white transition-colors">
			<span class="font-mono-code text-[10px] px-1.5 py-0.2 rounded bg-white/[0.1] text-white font-medium uppercase tracking-wider">New</span>
			<span>{product.announce.text}</span>
			<span class="underline underline-offset-4 text-white hover:text-neutral-300 font-medium">{product.announce.label} →</span>
		</a>
	</div>

	<header class="sticky top-0 z-40 border-b border-white/[0.08] bg-[#000000]/95 backdrop-blur-2xl">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3 sm:py-3.5">
			<div class="flex items-center gap-3">
				<a href="{prefix}/" class="flex items-center gap-2.5 group shrink-0">
					<div
						class="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center transition-all duration-300 group-hover:border-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
					>
						<span class="font-mono font-bold text-sm {product.id === 'thesmos' ? 'text-blue-400' : 'text-[#5fd39a]'}">
							{product.name[0].toUpperCase()}
						</span>
					</div>
					<span class="font-bold text-lg tracking-tight text-white group-hover:text-neutral-200 transition-colors">
						{product.name}
					</span>
				</a>
				<span class="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 font-mono-code text-[11px] text-neutral-400">{product.version}</span>
				<a
					href="/"
					title="Autonomic AI Platform"
					class="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 px-2.5 py-0.5 text-[11px] font-mono-code text-neutral-400 hover:text-white transition-all group"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-[#ff531a] group-hover:shadow-[0_0_8px_#ff531a] transition-shadow"></span>
					<span>autonomic-ai.dev</span>
				</a>
			</div>

			<!-- Desktop Nav (Roomy gap-7) -->
			<nav class="hidden items-center gap-7 text-[13px] font-medium md:flex">
				{#each nav as item (item.href)}
					<a href={item.href} class="transition-colors {isActive(item.href) ? 'text-white font-medium' : 'text-neutral-400 hover:text-white'}">{item.label}</a>
				{/each}
			</nav>

			<div class="flex items-center gap-2 sm:gap-2.5 xl:gap-3 shrink-0">
				<a
					href={repoUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="hidden sm:inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-mono-code text-neutral-300 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
				>
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
						/>
					</svg>
					<span>GitHub</span>
				</a>
				<a href={installHref} class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98]">
					<span>Install</span>
					<ArrowRight size={13} />
				</a>

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
						class="rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/[0.05] hover:text-white flex items-center gap-2"
					>
						<span class="w-1.5 h-1.5 rounded-full bg-[#ff531a]"></span>
						<span>autonomic-ai.dev</span>
					</a>
				</div>

				<div class="pt-3 border-t border-white/[0.06] flex items-center gap-3">
					<a
						href={repoUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="flex-1 text-center rounded-xl border border-white/[0.12] bg-white/[0.04] py-2 text-xs font-mono text-neutral-200"
					>
						GitHub
					</a>
					<a
						href={installHref}
						onclick={() => (mobileMenuOpen = false)}
						class="flex-1 text-center rounded-xl bg-white py-2 text-xs font-semibold text-black"
					>
						Install
					</a>
				</div>
			</div>
		{/if}
	</header>

	<main class="relative w-full overflow-x-clip">
		{#if path === '/'}
			<ContinuousConduit color={product.id === 'thesmos' ? 'blue' : 'emerald'} />
		{/if}

		{@render children()}

		<Footer
			brand={product.id === 'thesmos' ? 'thesmos' : 'tekmor'}
			{product}
			withConduit={path === '/'}
		/>
	</main>
</div>
