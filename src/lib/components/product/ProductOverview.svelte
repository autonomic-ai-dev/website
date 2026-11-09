<script lang="ts">
	import { ArrowRight, Check, Copy, Minus } from 'lucide-svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import Terminal from '#lib/components/ui/Terminal.svelte';
	import type { Product } from '#lib/data/products';

	let { product }: { product: Product } = $props();

	let copied = $state(false);

	async function copyInstall() {
		try {
			await navigator.clipboard.writeText(product.install);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			copied = false;
		}
	}

	const pad = (index: number) => String(index + 1).padStart(2, '0');
</script>

<section class="relative isolate overflow-hidden">
	<div class="mx-auto max-w-5xl px-4 pt-24 pb-16 text-center sm:px-6 lg:pt-32">
		<span class="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-black px-3 py-1 font-mono text-[11px] text-zinc-300">
			<span class="h-1.5 w-1.5 rounded-full bg-white"></span>{product.badge}
		</span>
		<h1 class="mx-auto mt-7 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">{product.headline}</h1>
		<p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">{product.subline}</p>

		<div id="install" class="mx-auto mt-10 max-w-xl scroll-mt-24 rounded-lg border border-zinc-800 bg-black text-left">
			<div class="flex items-center gap-4 border-b border-zinc-900 px-4 py-2 font-mono text-xs">
				<span class="text-white">brew</span>
				<span class="text-zinc-600">curl</span>
				<span class="text-zinc-600">npm</span>
			</div>
			<div class="flex items-center justify-between gap-4 px-4 py-3">
				<code class="overflow-x-auto font-mono text-sm text-zinc-100">{product.install}</code>
				<button
					type="button"
					onclick={copyInstall}
					aria-label="Copy install command"
					class="inline-flex shrink-0 items-center gap-1.5 rounded border border-zinc-800 px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-900"
				>
					{#if copied}<Check size={12} />{:else}<Copy size={12} />{/if}
				</button>
			</div>
		</div>

		<ul class="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-zinc-400">
			{#each product.chips as chip (chip)}
				<li class="inline-flex items-center gap-2"><Check size={14} class="text-zinc-300" />{chip}</li>
			{/each}
		</ul>

		<div class="mt-10 flex flex-wrap justify-center gap-3 text-sm">
			<a href="/docs" class="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 font-medium text-black transition-colors hover:bg-zinc-200">
				Read the docs <ArrowRight size={14} />
			</a>
			<a href="/blog" class="rounded-md border border-zinc-800 px-4 py-2.5 text-zinc-200 transition-colors hover:bg-zinc-900">Read the blog</a>
		</div>
	</div>
</section>

<section class="mx-auto max-w-5xl px-4 pb-28 sm:px-6">
	<Terminal title={product.showcase.title} lines={product.showcase.lines} prompt={product.showcase.prompt} />
</section>

<section class="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
	<p class="font-mono text-[11px] uppercase tracking-widest text-zinc-300">Capabilities</p>
	<h2 class="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">What it gives you</h2>
	<div class="mt-12 grid gap-4 md:grid-cols-3">
		{#each product.features as feature, index (feature.title)}
			<article class="flex flex-col rounded-xl border border-zinc-800 bg-black p-7 transition-colors hover:border-zinc-600">
				<div class="flex items-center justify-between">
					<span class="font-mono text-[11px] text-zinc-300">{pad(index)}</span>
					<span class="text-zinc-500"><Icon name={feature.icon} size={16} /></span>
				</div>
				<h3 class="mt-8 text-lg font-semibold text-white">{feature.title}</h3>
				<p class="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{feature.body}</p>
				<code class="mt-6 block rounded-md border border-zinc-900 bg-black px-3 py-2 font-mono text-xs text-zinc-300">{feature.command}</code>
			</article>
		{/each}
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
	<p class="font-mono text-[11px] uppercase tracking-widest text-zinc-300">How it works</p>
	<h2 class="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Four steps, and each one leaves evidence.</h2>
	<ol class="mt-12 grid gap-4 md:grid-cols-4">
		{#each product.loop as step, index (step.title)}
			<li class="flex flex-col rounded-xl border border-zinc-800 bg-black p-6">
				<div class="flex items-center justify-between">
					<span class="font-mono text-xs text-zinc-500">{pad(index)}</span>
					<span class="text-zinc-300"><Icon name={step.icon} size={16} /></span>
				</div>
				<h3 class="mt-8 text-base font-semibold text-white">{step.title}</h3>
				<p class="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{step.body}</p>
				<code class="mt-6 block truncate rounded-md border border-zinc-900 bg-black px-3 py-2 font-mono text-xs text-zinc-300">{step.command}</code>
			</li>
		{/each}
	</ol>
</section>

{#if product.hosts}
	<section class="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
		<p class="font-mono text-[11px] uppercase tracking-widest text-zinc-300">Hosts</p>
		<h2 class="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Where the gates run, and where they do not.</h2>
		<div class="mt-12 overflow-x-auto rounded-xl border border-zinc-800">
			<table class="w-full min-w-[520px] text-left text-sm">
				<thead class="border-b border-zinc-800 bg-black font-mono text-[11px] uppercase tracking-widest text-zinc-500">
					<tr>
						<th class="px-6 py-3 font-normal">Host</th>
						<th class="px-6 py-3 font-normal">Protection</th>
						<th class="px-6 py-3 font-normal">Note</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-zinc-900">
					{#each product.hosts as host (host.name)}
						<tr class="bg-black">
							<td class="px-6 py-4 font-medium text-white">{host.name}</td>
							<td class="px-6 py-4">
								{#if host.hooks}
									<span class="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-0.5 font-mono text-[11px] text-zinc-200">gates</span>
								{:else}
									<span class="rounded-full border border-zinc-800 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">instructions only</span>
								{/if}
							</td>
							<td class="px-6 py-4 text-zinc-500">{host.note ?? ''}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
{/if}

{#if product.nodeKinds}
	<section class="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
		<p class="font-mono text-[11px] uppercase tracking-widest text-zinc-300">Node kinds</p>
		<h2 class="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Eight building blocks for a workflow.</h2>
		<ul class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each product.nodeKinds as kind (kind.name)}
				<li class="rounded-xl border border-zinc-800 bg-black p-5">
					<p class="font-mono text-sm text-white">{kind.name}</p>
					<p class="mt-2 text-sm leading-relaxed text-zinc-400">{kind.body}</p>
				</li>
			{/each}
		</ul>
		{#if product.nodeKindsNote}
			<p class="mt-6 rounded-lg border border-zinc-900 px-5 py-3 text-sm text-zinc-500">{product.nodeKindsNote}</p>
		{/if}
	</section>
{/if}

<section class="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
	<p class="font-mono text-[11px] uppercase tracking-widest text-zinc-300">Numbers you can check</p>
	<h2 class="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Each figure comes from the code or the docs.</h2>
	<dl class="mt-12 grid gap-4 sm:grid-cols-3">
		{#each product.facts as fact (fact.label)}
			<div class="rounded-xl border border-zinc-800 bg-black p-7">
				<dt class="font-mono text-3xl font-semibold tracking-tight text-white">{fact.value}</dt>
				<dd class="mt-3 text-sm text-zinc-400">{fact.label}</dd>
			</div>
		{/each}
	</dl>
</section>

<section class="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
	<p class="font-mono text-[11px] uppercase tracking-widest text-zinc-300">Known limits</p>
	<h2 class="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">What it does not do yet.</h2>
	<ul class="mt-12 divide-y divide-zinc-900 rounded-xl border border-zinc-800 bg-black">
		{#each product.limits as limit (limit)}
			<li class="flex gap-4 px-6 py-5 text-sm leading-relaxed text-zinc-300">
				<Minus size={16} class="mt-0.5 shrink-0 text-zinc-600" />
				<span>{limit}</span>
			</li>
		{/each}
	</ul>
</section>

<section class="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
	<div class="rounded-2xl border border-zinc-800 bg-black px-6 py-16 text-center sm:px-12">
		<h2 class="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">{product.finalCta.headline}</h2>
		<p class="mx-auto mt-4 max-w-xl text-zinc-400">{product.finalCta.subline}</p>
		<div class="mt-8 flex flex-wrap justify-center gap-3 text-sm">
			<a href="#install" class="rounded-md bg-white px-4 py-2.5 font-medium text-black transition-colors hover:bg-zinc-200">Install {product.name}</a>
			<a href="/docs" class="rounded-md border border-zinc-800 px-4 py-2.5 text-zinc-200 transition-colors hover:bg-zinc-900">Read the docs</a>
		</div>
	</div>
</section>
