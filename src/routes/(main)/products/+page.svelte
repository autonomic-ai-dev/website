<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import { products } from '#lib/data/products';

	const list = [products['agent-brain'], products['agent-spine']];
</script>

<svelte:head>
	<title>Products — Autonomic AI</title>
	<meta name="description" content="The Autonomic AI products: agent-brain and agent-spine. Each has its own site, docs, blog and install command." />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Products — Autonomic AI" />
	<meta property="og:description" content="Install one, or both. Each product has its own site, docs and blog." />
</svelte:head>

<section class="relative isolate overflow-hidden">
	<div class="mx-auto max-w-6xl px-4 pt-24 pb-16 sm:px-6">
		<p class="font-mono text-xs uppercase tracking-widest text-zinc-300">Products</p>
		<h1 class="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">Install one. Or both. Each stands alone.</h1>
		<p class="mt-6 max-w-xl text-lg text-zinc-400">Pick the job you have today. Each product has its own site, its own docs, and its own install command.</p>
	</div>
</section>

<section class="mx-auto max-w-6xl space-y-5 px-4 pb-28 sm:px-6">
	{#each list as product (product.id)}
		<article class="grid gap-8 rounded-xl border border-zinc-800 bg-black p-8 transition-colors hover:border-zinc-600 md:grid-cols-[1fr_auto] md:items-center md:p-10">
			<div>
				<div class="flex flex-wrap items-baseline gap-3">
					<h2 class="text-2xl font-semibold text-white">{product.name}</h2>
					<span class="font-mono text-xs text-zinc-500">{product.version}</span>
				</div>
				<p class="mt-2 font-mono text-xs uppercase tracking-widest text-zinc-500">{product.tagline}</p>
				<p class="mt-5 max-w-2xl leading-relaxed text-zinc-400">{product.subline}</p>
				<code class="mt-6 inline-block rounded border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-100">{product.install}</code>
			</div>
			<div class="flex flex-wrap gap-3 text-sm md:flex-col">
				<a href={product.origin} class="inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2.5 font-medium text-black transition-colors hover:bg-zinc-200">
					Open {product.name} <ArrowRight size={14} />
				</a>
				<a href={`${product.origin}/docs`} class="rounded-md border border-zinc-800 px-4 py-2.5 text-center text-zinc-200 transition-colors hover:bg-zinc-900">Docs</a>
				<a href={`${product.origin}/blog`} class="rounded-md border border-zinc-800 px-4 py-2.5 text-center text-zinc-200 transition-colors hover:bg-zinc-900">Blog</a>
			</div>
		</article>
	{/each}
</section>
