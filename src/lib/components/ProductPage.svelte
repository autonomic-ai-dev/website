<script lang="ts">
	type Feature = { title: string; body: string };
	type Step = { label: string; command: string };

	let {
		name,
		tagline,
		headline,
		subline,
		install,
		features,
		steps,
		limits,
		docsHref,
		otherHref,
		otherName
	}: {
		name: string;
		tagline: string;
		headline: string;
		subline: string;
		install: string;
		features: Feature[];
		steps: Step[];
		limits: string[];
		docsHref: string;
		otherHref: string;
		otherName: string;
	} = $props();
</script>

<section class="mx-auto max-w-5xl px-4 pt-20 pb-16 sm:px-6">
	<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">{tagline}</p>
	<h1 class="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">{headline}</h1>
	<p class="mt-5 max-w-2xl text-lg text-zinc-400">{subline}</p>

	<div class="mt-8 flex items-center justify-between gap-4 rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3">
		<code class="font-mono text-sm text-zinc-100">{install}</code>
		<button
			type="button"
			class="shrink-0 rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-900"
			onclick={() => navigator.clipboard?.writeText(install)}>Copy</button
		>
	</div>

	<div class="mt-6 flex flex-wrap gap-3 text-sm">
		<a href={docsHref} class="rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-zinc-200">Read the docs</a>
		<a href={otherHref} class="rounded-md border border-zinc-800 px-4 py-2 text-zinc-200 hover:bg-zinc-900">{otherName}</a>
	</div>
</section>

<section class="mx-auto max-w-5xl border-t border-zinc-900 px-4 py-16 sm:px-6">
	<div class="grid gap-px overflow-hidden rounded-md border border-zinc-800 bg-zinc-800 sm:grid-cols-3">
		{#each features as feature (feature.title)}
			<div class="bg-black p-6">
				<h2 class="text-base font-medium text-white">{feature.title}</h2>
				<p class="mt-2 text-sm leading-relaxed text-zinc-400">{feature.body}</p>
			</div>
		{/each}
	</div>
</section>

<section class="mx-auto max-w-5xl border-t border-zinc-900 px-4 py-16 sm:px-6">
	<h2 class="text-2xl font-semibold tracking-tight text-white">Get started</h2>
	<ol class="mt-8 space-y-4">
		{#each steps as step, index (step.command)}
			<li class="rounded-md border border-zinc-800 bg-zinc-950 p-4">
				<p class="text-xs text-zinc-500"><span class="font-mono">{index + 1}.</span> {step.label}</p>
				<pre class="mt-2 overflow-x-auto font-mono text-sm text-zinc-100"><code>{step.command}</code></pre>
			</li>
		{/each}
	</ol>
</section>

<section class="mx-auto max-w-5xl border-t border-zinc-900 px-4 py-16 sm:px-6">
	<h2 class="text-2xl font-semibold tracking-tight text-white">What it does not do yet</h2>
	<ul class="mt-6 space-y-3 text-sm text-zinc-400">
		{#each limits as limit (limit)}
			<li class="flex gap-3"><span class="text-zinc-600">—</span><span>{limit}</span></li>
		{/each}
	</ul>
</section>

<footer class="mx-auto max-w-5xl border-t border-zinc-900 px-4 py-10 text-xs text-zinc-500 sm:px-6">
	<p>{name} is part of the Autonomic AI tools. Each one installs on its own.</p>
</footer>
