<script lang="ts">
	import { ArrowLeft, ArrowRight, Calendar, User, Tag } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function productUrl(product: string | undefined, pageNum: number) {
		const params = new URLSearchParams();
		if (product) params.set('product', product);
		if (pageNum > 1) params.set('page', String(pageNum));
		const qs = params.toString();
		return `/blog${qs ? `?${qs}` : ''}`;
	}

	function postHref(post: { product: string; slug: string }) {
		return `/${post.product}/blog/${post.slug}`;
	}
</script>

<svelte:head>
	<title>Blog — Autonomic AI</title>
	<meta name="description" content="Technical engineering articles, architecture deep-dives, and research on deterministic tools for coding agents." />
</svelte:head>

<div class="yc-container py-12 md:py-20">
	<!-- Hero Section -->
	<header class="max-w-3xl">
		<div class="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-1.5 font-mono text-xs text-neutral-300">
			<span class="live-beacon"></span>
			<span>Autonomic AI Engineering Blog</span>
		</div>
		<h1 class="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
			Research & Engineering
		</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-400 sm:text-lg">
			Deep-dives into cryptographic tree receipts, Claude Code process hooks, append-only SQLite snapshots, and cognitive state machines.
		</p>

		<!-- Product Filter Tabs -->
		<div class="mt-8 flex flex-wrap gap-2.5">
			<a
				href="/blog"
				class="rounded-full px-4 py-1.5 text-xs font-medium transition-colors {!data.selectedProduct
					? 'bg-white text-black font-semibold'
					: 'bg-white/[0.05] text-neutral-300 hover:bg-white/[0.1] hover:text-white'}"
			>
				All Articles ({data.paginated.totalItems})
			</a>
			<a
				href="/blog?product=tekmor"
				class="rounded-full px-4 py-1.5 text-xs font-medium transition-colors {data.selectedProduct === 'tekmor'
					? 'bg-[#5fd39a] text-black font-semibold'
					: 'bg-white/[0.05] text-neutral-300 hover:bg-white/[0.1] hover:text-white'}"
			>
				tekmor
			</a>
			<a
				href="/blog?product=thesmos"
				class="rounded-full px-4 py-1.5 text-xs font-medium transition-colors {data.selectedProduct === 'thesmos'
					? 'bg-blue-400 text-black font-semibold'
					: 'bg-white/[0.05] text-neutral-300 hover:bg-white/[0.1] hover:text-white'}"
			>
				thesmos
			</a>
		</div>
	</header>

	<!-- Blog Posts List -->
	<div class="mt-14 space-y-6 max-w-4xl">
		{#each data.paginated.items as post (post.slug)}
			<article class="yc-card p-7 sm:p-9 group relative transition-colors hover:border-white/20">
				<div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4 text-xs font-mono">
					<div class="flex items-center gap-3">
						<span class="rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold {post.product === 'tekmor' ? 'border-[#5fd39a]/30 bg-[#5fd39a]/10 text-[#5fd39a]' : 'border-blue-500/30 bg-blue-500/10 text-blue-400'}">
							{post.product}
						</span>
						<span class="text-neutral-500">·</span>
						<span class="text-neutral-400">{post.category}</span>
					</div>
					<div class="flex items-center gap-4 text-neutral-400">
						<span class="flex items-center gap-1.5">
							<Calendar size={13} />
							{post.date}
						</span>
						<span class="flex items-center gap-1.5">
							<User size={13} />
							{post.author}
						</span>
					</div>
				</div>

				<h2 class="mt-5 text-xl sm:text-2xl font-semibold tracking-tight text-white group-hover:text-[#5fd39a] transition-colors">
					<a href={postHref(post)} class="focus:outline-none">
						{post.title}
					</a>
				</h2>
				<p class="mt-3 text-sm leading-relaxed text-neutral-400">
					{post.excerpt}
				</p>

				<div class="mt-6 flex items-center justify-between pt-4 border-t border-white/[0.06]">
					<a
						href={postHref(post)}
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

	<!-- Pagination Controls -->
	{#if data.paginated.totalPages > 1}
		<nav class="mt-14 flex items-center justify-between border-t border-white/[0.08] pt-6 max-w-4xl" aria-label="Pagination">
			<div>
				{#if data.paginated.hasPrev}
					<a
						href={productUrl(data.selectedProduct, data.paginated.page - 1)}
						class="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#0c0d10] px-4 py-2 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/[0.08] hover:text-white"
					>
						<ArrowLeft size={13} />
						<span>Previous</span>
					</a>
				{:else}
					<span class="inline-flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-2 text-xs font-medium text-neutral-600 cursor-not-allowed">
						<ArrowLeft size={13} />
						<span>Previous</span>
					</span>
				{/if}
			</div>

			<div class="font-mono text-xs text-neutral-400">
				Page <span class="text-white font-semibold">{data.paginated.page}</span> of {data.paginated.totalPages}
			</div>

			<div>
				{#if data.paginated.hasNext}
					<a
						href={productUrl(data.selectedProduct, data.paginated.page + 1)}
						class="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#0c0d10] px-4 py-2 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/[0.08] hover:text-white"
					>
						<span>Next</span>
						<ArrowRight size={13} />
					</a>
				{:else}
					<span class="inline-flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-2 text-xs font-medium text-neutral-600 cursor-not-allowed">
						<span>Next</span>
						<ArrowRight size={13} />
					</span>
				{/if}
			</div>
		</nav>
	{/if}
</div>
