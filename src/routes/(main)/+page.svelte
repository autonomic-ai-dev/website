<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import Terminal from '#lib/components/ui/Terminal.svelte';
	import { mainProducts } from '#lib/data/products';

	const tool = mainProducts[0];
	const spine = mainProducts[1];
	const list = [
		{ product: tool, hook: 'A check passes only when its receipt says so.' },
		{ product: spine, hook: 'Every step leaves a snapshot you can read back.' }
	];

	const schema = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				name: 'Autonomic AI',
				url: 'https://autonomic-ai.dev',
				sameAs: ['https://github.com/autonomic-ai-dev'],
				makesOffer: [tool, spine].map((product) => ({ '@type': 'SoftwareApplication', name: product.name, url: product.origin }))
			},
			{ '@type': 'WebSite', name: 'Autonomic AI', url: 'https://autonomic-ai.dev' }
		]
	};
</script>

<svelte:head>
	<title>Autonomic AI — tools for coding agents</title>
	<meta
		name="description"
		content="Autonomic AI builds tekmor, a proof eval for coding agents, and agent-spine, a deterministic workflow engine. Each installs on its own."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Autonomic AI — tools for coding agents" />
	<meta property="og:description" content="Two open tools that make coding agents follow your rules and show their work." />
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<section class="relative isolate overflow-hidden">
	<div class="mx-auto grid max-w-6xl gap-14 px-4 pt-24 pb-24 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-32">
		<div>
			<p class="font-mono text-xs uppercase tracking-widest text-zinc-300">Autonomic AI</p>
			<h1 class="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">Coding agents skip steps. These tools make them show their work.</h1>
			<p class="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
				Two open tools for AI coding agents. tekmor runs the checks your project allows and records a receipt for each result. agent-spine runs multi-step workflows and keeps a snapshot of every step.
			</p>
			<div class="mt-10 flex flex-wrap gap-3 text-sm">
				<a href={tool.origin} class="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 font-medium text-black transition-colors hover:bg-zinc-200">
					Start with {tool.name} <ArrowRight size={14} />
				</a>
				<a href={spine.origin} class="rounded-md border border-zinc-800 px-4 py-2.5 text-zinc-200 transition-colors hover:bg-zinc-900">Start with {spine.name}</a>
			</div>
		</div>
		<Terminal title={tool.showcase.title} lines={tool.showcase.lines} />
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
	<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">Pick the one your team needs</p>
	<div class="mt-8 grid gap-4 md:grid-cols-2">
		{#each list as item (item.product.id)}
			<a href={item.product.origin} class="group flex flex-col gap-5 rounded-xl border border-zinc-800 bg-black p-8 transition-colors hover:border-zinc-600">
				<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">{item.product.tagline}</p>
				<h2 class="text-xl font-semibold text-white">{item.hook}</h2>
				<p class="text-sm leading-relaxed text-zinc-400">{item.product.subline}</p>
				<code class="mt-auto font-mono text-xs text-zinc-300">{item.product.install}</code>
				<span class="inline-flex items-center gap-2 text-sm text-zinc-300 group-hover:text-white">
					Open {item.product.name} <ArrowRight size={14} class="transition-transform group-hover:translate-x-0.5" />
				</span>
			</a>
		{/each}
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
	<div class="rounded-xl border border-zinc-800 bg-black p-10 text-center md:p-16">
		<h2 class="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Install one. Check its first result yourself.</h2>
		<p class="mx-auto mt-4 max-w-xl text-zinc-400">Each product installs on its own. tekmor makes no model calls and opens no network connection on its own.</p>
		<div class="mt-8 flex flex-wrap justify-center gap-3 text-sm">
			<a href="/products" class="rounded-md bg-white px-4 py-2.5 font-medium text-black transition-colors hover:bg-zinc-200">Compare the products</a>
		</div>
	</div>
</section>
