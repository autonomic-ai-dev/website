<script lang="ts">
	import { ArrowRight, Calendar, ChevronLeft, ChevronRight, User } from 'lucide-svelte';
	import { page } from '$app/state';
	import type { Product } from '#lib/data/products';
	import type { PostMeta } from '#lib/content/blog';

	let { data, product }: { data: { posts: PostMeta[] }; product: Product } = $props();

	let currentPage = $state(1);
	const postsPerPage = 4;

	let allPosts = $derived(data.posts);
	let totalPages = $derived(Math.max(1, Math.ceil(allPosts.length / postsPerPage)));
	let paginatedPosts = $derived(allPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage));

	const prefix = $derived(page.url.pathname.startsWith(`/${product.id}`) ? `/${product.id}` : '');

	function postLink(slug: string) {
		return `${prefix}/blog/${slug}`;
	}

	function goTo(newPage: number) {
		currentPage = newPage;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	const breadcrumbSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: product.name, item: product.origin },
			{ '@type': 'ListItem', position: 2, name: 'Blog', item: `${product.origin}/blog` }
		]
	});
</script>

<svelte:head>
	<title>Blog — {product.name}</title>
	<meta name="description" content={`Posts about ${product.name}: design decisions, trade-offs and how it is measured.`} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={`Blog — ${product.name}`} />
	<meta property="og:url" content={`${product.origin}/blog`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={`Blog — ${product.name}`} />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`}
</svelte:head>

<div class="yc-container py-12 md:py-20">
	<header class="max-w-3xl">
		<div class="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-neutral-300">
			<span class="live-beacon"></span>
			<span>{product.name} Engineering Blog</span>
		</div>
		<h1 class="mt-6 text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.05]">
			<span class="capitalize">{product.name}</span> Journal.
			<span class="block text-neutral-400 sm:text-neutral-500 font-bold mt-2 text-2xl sm:text-3xl leading-[1.15]">
				The engineering behind {product.name}.
			</span>
		</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-300 sm:text-lg">
			Trade-offs, performance measurements, and architecture decisions written by the engineers building {product.name}.
		</p>
	</header>

	<div class="mt-14 space-y-6 max-w-4xl">
		{#each paginatedPosts as post (post.slug)}
			<article class="yc-card p-7 sm:p-9 group relative transition-colors hover:border-white/20">
				<div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4 text-xs font-mono">
					<div class="flex items-center gap-3">
						<span class="rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold {product.id === 'tekmor' ? 'border-[#5fd39a]/30 bg-[#5fd39a]/10 text-[#5fd39a]' : 'border-blue-500/30 bg-blue-500/10 text-blue-400'}">
							{post.category}
						</span>
					</div>
					<div class="flex items-center gap-4 text-neutral-400">
						<span class="flex items-center gap-1.5">
							<Calendar size={13} />
							{post.date}
						</span>
						{#if post.author}
							<span class="flex items-center gap-1.5">
								<User size={13} />
								{post.author}
							</span>
						{/if}
					</div>
				</div>

				<h2 class="mt-5 text-xl sm:text-2xl font-semibold tracking-tight text-white group-hover:text-[#5fd39a] transition-colors">
					<a href={postLink(post.slug)} class="focus:outline-none">
						{post.title}
					</a>
				</h2>
				<p class="mt-3 text-sm leading-relaxed text-neutral-400">
					{post.excerpt}
				</p>

				<div class="mt-6 flex items-center justify-between pt-4 border-t border-white/[0.06]">
					<a
						href={postLink(post.slug)}
						class="inline-flex items-center gap-1.5 text-xs font-medium text-white group-hover:text-[#5fd39a] transition-colors"
					>
						<span>Read article</span>
						<ArrowRight size={13} class="transition-transform group-hover:translate-x-1" />
					</a>
					<span class="font-mono text-xs text-neutral-500">
						5 min read
					</span>
				</div>
			</article>
		{/each}
	</div>

	{#if totalPages > 1}
		<nav class="mt-14 flex items-center justify-between border-t border-white/[0.08] pt-6 max-w-4xl" aria-label="Pagination">
			<button
				type="button"
				onclick={() => goTo(currentPage - 1)}
				disabled={currentPage === 1}
				class="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#0c0d10] px-4 py-2 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/[0.08] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
			>
				<ChevronLeft size={14} />
				<span>Previous</span>
			</button>

			<span class="font-mono text-xs text-neutral-400">
				Page <span class="text-white font-semibold">{currentPage}</span> of {totalPages}
			</span>

			<button
				type="button"
				onclick={() => goTo(currentPage + 1)}
				disabled={currentPage === totalPages}
				class="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#0c0d10] px-4 py-2 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/[0.08] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
			>
				<span>Next</span>
				<ChevronRight size={14} />
			</button>
		</nav>
	{/if}
</div>
