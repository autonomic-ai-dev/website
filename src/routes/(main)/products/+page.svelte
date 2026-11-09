<script lang="ts">
	import { products } from '#lib/data/products';

	const list = [products['agent-brain'], products['agent-spine']];
</script>

<svelte:head>
	<title>Products — Autonomic AI</title>
	<meta name="description" content="The Autonomic AI products: agent-brain and agent-spine. Each has its own site, docs and install." />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Products — Autonomic AI" />
	<meta property="og:description" content="The Autonomic AI products: agent-brain and agent-spine. Each has its own site, docs and install." />
</svelte:head>

<section class="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6">
	<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">Products</p>
	<h1 class="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Two tools. Each installs on its own.</h1>
	<p class="mt-6 max-w-2xl text-lg text-zinc-400">Pick the one you need. Each product has its own site, documentation and blog.</p>
</section>

<section class="mx-auto max-w-6xl space-y-6 px-4 pb-24 sm:px-6">
	{#each list as product (product.id)}
		<article class="rounded-md border border-zinc-800 bg-zinc-950 p-8">
			<div class="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
				<h2 class="text-2xl font-semibold text-white">{product.name}</h2>
				<span class="font-mono text-xs text-zinc-500">{product.tagline}</span>
			</div>
			<p class="mt-4 max-w-2xl text-zinc-400">{product.subline}</p>
			<pre class="mt-6 overflow-x-auto rounded border border-zinc-800 bg-black p-4 font-mono text-sm text-zinc-100"><code>{product.install}</code></pre>
			<div class="mt-6 flex flex-wrap gap-3 text-sm">
				<a href={product.origin} class="rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-zinc-200">Open {product.name}</a>
				<a href={`${product.origin}/docs`} class="rounded-md border border-zinc-800 px-4 py-2 text-zinc-200 hover:bg-zinc-900">Docs</a>
				<a href={`${product.origin}/blog`} class="rounded-md border border-zinc-800 px-4 py-2 text-zinc-200 hover:bg-zinc-900">Blog</a>
			</div>
		</article>
	{/each}
</section>
