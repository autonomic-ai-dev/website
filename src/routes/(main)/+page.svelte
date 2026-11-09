<script lang="ts">
	import { products } from '#lib/data/products';

	const list = [products['agent-brain'], products['agent-spine']];
</script>

<svelte:head>
	<title>Autonomic AI — tools for coding agents</title>
	<meta
		name="description"
		content="Autonomic AI builds agent-brain, a context engine and MCP server, and agent-spine, a deterministic workflow engine for coding agents. Each installs on its own."
	/>
	<link rel="canonical" href="https://autonomic-ai.dev" />
</svelte:head>

<section class="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6">
	<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">Autonomic AI</p>
	<h1 class="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">Tools that keep coding agents honest.</h1>
	<p class="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
		Two open tools for AI coding agents. One routes the right context into each task and records what was verified. The other runs multi-step workflows and keeps a snapshot of every step.
	</p>
	<div class="mt-10 flex flex-wrap gap-3 text-sm">
		<a href="/products" class="rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-zinc-200">See the products</a>
	</div>
</section>

<section class="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-md border border-zinc-800 bg-zinc-800 px-0 sm:grid-cols-2 sm:mx-auto">
	{#each list as product (product.id)}
		<a href={product.origin} class="group flex flex-col gap-4 bg-black p-8 hover:bg-zinc-950">
			<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">{product.tagline}</p>
			<h2 class="text-2xl font-semibold text-white">{product.name}</h2>
			<p class="text-sm leading-relaxed text-zinc-400">{product.subline}</p>
			<code class="mt-auto font-mono text-xs text-zinc-300">{product.install}</code>
			<span class="text-sm text-zinc-400 group-hover:text-white">Open {product.name} →</span>
		</a>
	{/each}
</section>
