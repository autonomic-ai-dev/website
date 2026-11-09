<script lang="ts">
	import { Copy } from 'lucide-svelte';
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

<section class="mx-auto max-w-6xl px-4 pt-24 pb-20 sm:px-6">
	<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">{product.tagline}</p>
	<h1 class="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">{product.headline}</h1>
	<p class="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">{product.subline}</p>

	<div class="mt-10 flex max-w-2xl items-center justify-between gap-4 rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3">
		<code class="overflow-x-auto font-mono text-sm text-zinc-100">{product.install}</code>
		<button
			type="button"
			onclick={copyInstall}
			class="inline-flex shrink-0 items-center gap-1.5 rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-900"
		>
			<Copy size={12} />{copied ? 'Copied' : 'Copy'}
		</button>
	</div>

	<div class="mt-6 flex flex-wrap gap-3 text-sm">
		<a href="/docs" class="rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-zinc-200">Read the docs</a>
		<a href="/blog" class="rounded-md border border-zinc-800 px-4 py-2 text-zinc-200 hover:bg-zinc-900">Blog</a>
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
	<div class="grid gap-px overflow-hidden rounded-md border border-zinc-800 bg-zinc-800 sm:grid-cols-3">
		{#each product.features as feature (feature.title)}
			<div class="bg-black p-6">
				<h2 class="text-base font-medium text-white">{feature.title}</h2>
				<p class="mt-2 text-sm leading-relaxed text-zinc-400">{feature.body}</p>
			</div>
		{/each}
	</div>
</section>

<section class="mx-auto max-w-6xl border-t border-zinc-900 px-4 py-20 sm:px-6">
	<h2 class="text-2xl font-semibold tracking-tight text-white">Get started</h2>
	<ol class="mt-8 space-y-3">
		{#each product.steps as step, index (step.command)}
			<li class="rounded-md border border-zinc-800 bg-zinc-950 p-4">
				<p class="text-xs text-zinc-500"><span class="font-mono">{index + 1}.</span> {step.label}</p>
				<pre class="mt-2 overflow-x-auto font-mono text-sm text-zinc-100"><code>{step.command}</code></pre>
			</li>
		{/each}
	</ol>
</section>

<section class="mx-auto max-w-6xl border-t border-zinc-900 px-4 py-20 sm:px-6">
	<h2 class="text-2xl font-semibold tracking-tight text-white">What it does not do yet</h2>
	<ul class="mt-6 space-y-3 text-sm text-zinc-400">
		{#each product.limits as limit (limit)}
			<li class="flex gap-3"><span class="text-zinc-600">—</span><span>{limit}</span></li>
		{/each}
	</ul>
</section>
