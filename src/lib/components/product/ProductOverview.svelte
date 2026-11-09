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
</script>

<section class="relative isolate overflow-hidden">
	<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(50%_60%_at_50%_0%,rgba(56,189,248,0.14),transparent_70%)]"></div>
	<div class="mx-auto grid max-w-6xl gap-14 px-4 pt-20 pb-24 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-28">
		<div>
			<p class="font-mono text-xs uppercase tracking-widest text-sky-400">{product.tagline}</p>
			<h1 class="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">{product.headline}</h1>
			<p class="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">{product.subline}</p>

			<div id="install" class="mt-10 flex max-w-xl scroll-mt-24 items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">
				<code class="overflow-x-auto font-mono text-sm text-zinc-100">{product.install}</code>
				<button
					type="button"
					onclick={copyInstall}
					class="inline-flex shrink-0 items-center gap-1.5 rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-900"
				>
					{#if copied}<Check size={12} />Copied{:else}<Copy size={12} />Copy{/if}
				</button>
			</div>

			<div class="mt-4 flex flex-wrap gap-3 text-sm">
				<a href="/docs" class="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 font-medium text-black transition-colors hover:bg-zinc-200">
					Read the docs <ArrowRight size={14} />
				</a>
				<a href="/blog" class="rounded-md border border-zinc-800 px-4 py-2.5 text-zinc-200 transition-colors hover:bg-zinc-900">Read the blog</a>
			</div>
		</div>

		<Terminal lines={product.terminal} />
	</div>
</section>

<section class="border-y border-zinc-900 bg-zinc-950/40">
	<dl class="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
		{#each product.facts as fact (fact.label)}
			<div>
				<dt class="font-mono text-3xl font-semibold tracking-tight text-white">{fact.value}</dt>
				<dd class="mt-2 text-sm text-zinc-400">{fact.label}</dd>
			</div>
		{/each}
	</dl>
</section>

<section class="mx-auto max-w-6xl px-4 py-24 sm:px-6">
	<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">What it gives you</p>
	<div class="mt-8 grid gap-4 md:grid-cols-3">
		{#each product.features as feature (feature.title)}
			<article class="group rounded-xl border border-zinc-800 bg-zinc-950 p-7 transition-colors hover:border-zinc-600">
				<div class="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 text-sky-400">
					<Icon name={feature.icon} size={16} />
				</div>
				<h2 class="mt-6 text-lg font-semibold text-white">{feature.title}</h2>
				<p class="mt-3 text-sm leading-relaxed text-zinc-400">{feature.body}</p>
			</article>
		{/each}
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
	<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">The loop</p>
	<h2 class="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white">Four steps, each one checkable.</h2>
	<ol class="mt-12 grid gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800 md:grid-cols-4">
		{#each product.loop as step, index (step.title)}
			<li class="bg-black p-7">
				<div class="flex items-center justify-between text-zinc-500">
					<span class="font-mono text-xs">0{index + 1}</span>
					<span class="text-sky-400"><Icon name={step.icon} size={16} /></span>
				</div>
				<h3 class="mt-8 text-base font-semibold text-white">{step.title}</h3>
				<p class="mt-2 text-sm leading-relaxed text-zinc-400">{step.body}</p>
			</li>
		{/each}
	</ol>
</section>

{#if product.hosts}
	<section class="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
		<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">Hosts</p>
		<h2 class="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white">Where the gates run, and where they do not.</h2>
		<ul class="mt-10 grid gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800 sm:grid-cols-2">
			{#each product.hosts as host (host.name)}
				<li class="flex items-center justify-between gap-4 bg-black px-6 py-4">
					<div>
						<p class="text-sm font-medium text-white">{host.name}</p>
						{#if host.note}<p class="mt-0.5 text-xs text-zinc-500">{host.note}</p>{/if}
					</div>
					{#if host.hooks}
						<span class="rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[11px] text-sky-300">gates</span>
					{:else}
						<span class="rounded-full border border-zinc-800 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">instructions only</span>
					{/if}
				</li>
			{/each}
		</ul>
	</section>
{/if}

<section class="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
	<div class="grid gap-10 rounded-xl border border-zinc-800 bg-zinc-950 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
		<div>
			<h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{product.finalCta.headline}</h2>
			<p class="mt-3 max-w-xl text-zinc-400">{product.finalCta.subline}</p>
		</div>
		<div class="flex flex-wrap gap-3 text-sm">
			<a href="#install" class="rounded-md bg-white px-4 py-2.5 font-medium text-black transition-colors hover:bg-zinc-200">Install {product.name}</a>
			<a href="/docs" class="rounded-md border border-zinc-800 px-4 py-2.5 text-zinc-200 transition-colors hover:bg-zinc-900">Docs</a>
		</div>
	</div>
</section>

<section class="mx-auto max-w-6xl border-t border-zinc-900 px-4 py-24 sm:px-6">
	<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">Limits, stated up front</p>
	<ul class="mt-8 grid gap-4 md:grid-cols-2">
		{#each product.limits as limit (limit)}
			<li class="flex gap-3 rounded-lg border border-zinc-900 p-5 text-sm leading-relaxed text-zinc-400">
				<Minus size={16} class="mt-0.5 shrink-0 text-zinc-600" />
				<span>{limit}</span>
			</li>
		{/each}
	</ul>
</section>
