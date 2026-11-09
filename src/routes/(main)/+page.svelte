<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import Terminal from '#lib/components/ui/Terminal.svelte';
	import { products } from '#lib/data/products';

	const brain = products['agent-brain'];
	const spine = products['agent-spine'];
	const list = [
		{ product: brain, hook: 'Your rules reach the agent before it writes a line.' },
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
				makesOffer: [brain, spine].map((product) => ({ '@type': 'SoftwareApplication', name: product.name, url: product.origin }))
			},
			{ '@type': 'WebSite', name: 'Autonomic AI', url: 'https://autonomic-ai.dev' }
		]
	};
</script>

<svelte:head>
	<title>Autonomic AI — tools for coding agents</title>
	<meta
		name="description"
		content="Autonomic AI builds agent-brain, a context engine and MCP server, and agent-spine, a deterministic workflow engine for coding agents. Each installs on its own."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Autonomic AI — tools for coding agents" />
	<meta property="og:description" content="Two open tools that make coding agents follow your rules and show their work." />
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<section class="relative isolate overflow-hidden">
	<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(50%_60%_at_50%_0%,rgba(56,189,248,0.14),transparent_70%)]"></div>
	<div class="mx-auto grid max-w-6xl gap-14 px-4 pt-24 pb-24 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-32">
		<div>
			<p class="font-mono text-xs uppercase tracking-widest text-sky-400">Autonomic AI</p>
			<h1 class="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">Coding agents skip steps. These tools make them show their work.</h1>
			<p class="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
				Two open tools for AI coding agents. agent-brain routes your rules into each task and records what was verified. agent-spine runs multi-step workflows and keeps a snapshot of every step.
			</p>
			<div class="mt-10 flex flex-wrap gap-3 text-sm">
				<a href={brain.origin} class="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 font-medium text-black transition-colors hover:bg-zinc-200">
					Start with {brain.name} <ArrowRight size={14} />
				</a>
				<a href={spine.origin} class="rounded-md border border-zinc-800 px-4 py-2.5 text-zinc-200 transition-colors hover:bg-zinc-900">Start with {spine.name}</a>
			</div>
		</div>
		<Terminal title={brain.showcase.title} lines={brain.showcase.lines} />
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
	<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">Pick the one your team needs</p>
	<div class="mt-8 grid gap-4 md:grid-cols-2">
		{#each list as item (item.product.id)}
			<a href={item.product.origin} class="group flex flex-col gap-5 rounded-xl border border-zinc-800 bg-zinc-950 p-8 transition-colors hover:border-zinc-600">
				<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">{item.product.tagline}</p>
				<h2 class="text-2xl font-semibold text-white">{item.hook}</h2>
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
	<div class="rounded-xl border border-zinc-800 bg-zinc-950 p-10 text-center md:p-16">
		<h2 class="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Install one. Check its first result yourself.</h2>
		<p class="mx-auto mt-4 max-w-xl text-zinc-400">Each product installs on its own. agent-brain makes no model calls and ships no telemetry SDK.</p>
		<div class="mt-8 flex flex-wrap justify-center gap-3 text-sm">
			<a href="/products" class="rounded-md bg-white px-4 py-2.5 font-medium text-black transition-colors hover:bg-zinc-200">Compare the products</a>
		</div>
	</div>
</section>
