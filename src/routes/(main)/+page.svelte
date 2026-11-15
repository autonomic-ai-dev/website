<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import Terminal from '#lib/components/ui/Terminal.svelte';
	import { mainProducts } from '#lib/data/products';

	const tool = mainProducts[0];
	const workflow = mainProducts[1];
	const list = [
		{ product: tool, hook: 'A pass counts only when its receipt says so.' },
		{ product: workflow, hook: 'A workflow runs in a fixed order and keeps a record of each step.' }
	];

	const schema = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				name: 'Autonomic AI',
				url: 'https://autonomic-ai.dev',
				sameAs: ['https://github.com/autonomic-ai-dev'],
				makesOffer: [tool, workflow].map((product) => ({ '@type': 'SoftwareApplication', name: product.name, url: product.origin }))
			},
			{ '@type': 'WebSite', name: 'Autonomic AI', url: 'https://autonomic-ai.dev' }
		]
	};
</script>

<svelte:head>
	<title>Autonomic AI — proof and workflows for coding agents</title>
	<meta
		name="description"
		content="Autonomic AI builds tekmor, which checks a coding agent's pass claims against receipts for the exact code, and thesmos, a workflow engine that keeps a record of every step. Each installs on its own."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Autonomic AI — proof and workflows for coding agents" />
	<meta property="og:description" content="Agents say the work is done. tekmor makes them show the receipt. thesmos runs the steps in order and keeps the record." />
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<section class="relative isolate overflow-hidden">
	<div class="mx-auto grid max-w-6xl gap-14 px-4 pt-24 pb-24 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-32">
		<div>
			<p class="font-mono text-xs uppercase tracking-widest text-zinc-300">Autonomic AI</p>
			<h1 class="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
				Agents say the work is done. <span class="text-zinc-500">Make them show the receipt.</span>
			</h1>
			<p class="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
				Autonomic AI builds two open tools for coding agents. tekmor checks an agent's pass claim against a receipt for the exact code on disk. thesmos runs a multi-step workflow in a fixed order and keeps a record of every step. Each installs on its own, and both run on your machine.
			</p>
			<div class="mt-10 flex flex-wrap gap-3 text-sm">
				<a href={tool.origin} class="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 font-medium text-black transition-colors hover:bg-zinc-200">
					Start with {tool.name} <ArrowRight size={14} />
				</a>
				<a href={workflow.origin} class="rounded-md border border-zinc-800 px-4 py-2.5 text-zinc-200 transition-colors hover:bg-zinc-900">Start with {workflow.name}</a>
			</div>
		</div>
		<Terminal title={tool.showcase.title} lines={tool.showcase.lines} prompt={tool.showcase.prompt} />
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
	<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">Two problems</p>
	<div class="mt-8 grid gap-4 md:grid-cols-2">
		<article class="rounded-xl border border-zinc-800 bg-black p-8">
			<h2 class="text-xl font-semibold text-white">A pass claim is not evidence.</h2>
			<p class="mt-4 leading-relaxed text-zinc-400">
				An agent that says the tests pass may have run them once, on code it has since changed, and the chat does not show which. tekmor makes the claim checkable. A PASSED receipt names the command, the commit and the hash of the code it ran against. Change a file that counts, and the receipt says NOT VERIFIED until the check runs again.
			</p>
		</article>
		<article class="rounded-xl border border-zinc-800 bg-black p-8">
			<h2 class="text-xl font-semibold text-white">A loop is not a process.</h2>
			<p class="mt-4 leading-relaxed text-zinc-400">
				A prompt loop can take a different route on every run and leave nothing to inspect afterwards. thesmos writes the route down as named steps and the edges between them. A failed check stops the run before the next step, and every step adds a row you can read back and replay.
			</p>
		</article>
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
		<p class="mx-auto mt-4 max-w-xl text-zinc-400">
			Each product installs on its own. tekmor makes no model calls and opens no network connection on its own. thesmos runs on your machine and ships as one binary.
		</p>
		<div class="mt-8 flex flex-wrap justify-center gap-3 text-sm">
			<a href="/products" class="rounded-md bg-white px-4 py-2.5 font-medium text-black transition-colors hover:bg-zinc-200">Compare the products</a>
		</div>
	</div>
</section>
