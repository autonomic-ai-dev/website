<script lang="ts">
	import { ArrowRight, Check, Copy } from 'lucide-svelte';
	import { products } from '#lib/data/products';

	const list = [products.tekmor, products.thesmos];
	let copiedId = $state<string | null>(null);

	async function copyCommand(id: string, cmd: string) {
		try {
			await navigator.clipboard.writeText(cmd);
			copiedId = id;
			setTimeout(() => (copiedId = null), 1500);
		} catch {
			copiedId = null;
		}
	}
</script>

<svelte:head>
	<title>Products — Autonomic AI</title>
	<meta name="description" content="The Autonomic AI products: tekmor and thesmos. Each installs on its own with its own install command." />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Products — Autonomic AI" />
	<meta property="og:description" content="Install one, or both. Each product has its own site, docs and blog." />
</svelte:head>

<div class="yc-container">
	<!-- Header Section -->
	<section class="yc-section yc-section-first dotgrid relative overflow-hidden">
		<div class="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(95,211,154,0.1),transparent_70%)] blur-3xl"></div>

		<div>
			<span class="yc-label">Catalog <b>/</b> Standalone Tools</span>
			<h1 class="mt-6 max-w-3xl text-5xl sm:text-7xl font-black tracking-tight text-white leading-[1.02]">
				Products.
				<span class="block text-neutral-400 sm:text-neutral-500 font-bold mt-2 text-2xl sm:text-3xl md:text-4xl leading-[1.14]">
					Install one. Or both. Each stands alone.
				</span>
			</h1>
			<p class="mt-4 max-w-xl text-base text-neutral-300 sm:text-lg leading-relaxed">
				Pick the job you have today. Each product installs on its own with its own single-binary Homebrew tap.
			</p>
		</div>
	</section>

	<!-- Products List Section -->
	<section class="yc-section yc-crosshair space-y-6">
		{#each list as product, index (product.id)}
			<article class="yc-card p-8 md:p-10">
				<div class="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
					<div>
						<div class="flex flex-wrap items-center gap-3">
							<span class="rounded border border-white/[0.1] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#5fd39a]">
								0{index + 1}
							</span>
							<h2 class="text-2xl font-bold text-white capitalize">{product.name}</h2>
							<span class="rounded-full border border-white/[0.08] px-2 py-0.5 font-mono text-xs text-neutral-400">
								{product.version}
							</span>
						</div>

						<p class="mt-2 font-mono text-xs uppercase tracking-wider text-neutral-400">{product.tagline}</p>
						<p class="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-300">{product.subline}</p>

						<!-- Install Command Box -->
						<div class="mt-6 flex max-w-xl items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#070709] px-3.5 py-2 font-mono text-xs text-neutral-200">
							<div class="flex items-center gap-2 overflow-x-auto">
								<span class="select-none text-[#5fd39a]">$</span>
								<span>{product.install}</span>
							</div>
							<button
								type="button"
								onclick={() => copyCommand(product.id, product.install)}
								aria-label="Copy install command"
								class="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-neutral-300 transition-colors hover:bg-white/[0.1] hover:text-white"
							>
								{#if copiedId === product.id}
									<Check size={11} class="text-[#5fd39a]" />
									<span class="text-[#5fd39a]">Copied</span>
								{:else}
									<Copy size={11} />
									<span>Copy</span>
								{/if}
							</button>
						</div>
					</div>

					<div class="flex flex-wrap gap-3 text-sm md:flex-col md:min-w-[170px]">
						<a href={product.origin} class="yc-btn yc-btn-primary">
							<span>Open {product.name}</span>
							<span class="yc-btn-icon">
								<ArrowRight size={12} />
							</span>
						</a>
						<a href={`${product.origin}/docs`} class="yc-btn yc-btn-secondary">
							<span>Documentation</span>
							<span class="yc-btn-icon">
								<ArrowRight size={12} />
							</span>
						</a>
						{#if product.hasBlog}
							<a href={`${product.origin}/blog`} class="yc-btn yc-btn-secondary">
								<span>Release Blog</span>
								<span class="yc-btn-icon">
									<ArrowRight size={12} />
								</span>
							</a>
						{/if}
					</div>
				</div>
			</article>
		{/each}
	</section>
</div>
