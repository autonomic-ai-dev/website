<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { MAIN_ORIGIN, mainProducts } from '#lib/data/products';

	let { children }: { children: Snippet } = $props();

	const canonical = $derived(`${MAIN_ORIGIN}${page.url.pathname.replace(/\/+$/, '') || '/'}`);
	const tool = mainProducts[0];
	const spine = mainProducts[1];

	function isActive(href: string) {
		return page.url.pathname === href;
	}
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	<meta property="og:site_name" content="Autonomic AI" />
	<meta property="og:url" content={canonical} />
</svelte:head>

<div class="min-h-screen bg-[#070709] text-neutral-100 font-sans selection:bg-[#5fd39a]/20 selection:text-white">
	<!-- Top Sticky Architectural Navbar -->
	<header class="sticky top-0 z-50 border-b border-white/[0.08] bg-[#070709]/85 backdrop-blur-xl">
		<div class="yc-container flex items-center justify-between py-3.5">
			<div class="flex items-center gap-3">
				<a href="/" class="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white">
					<span class="flex h-6 w-6 items-center justify-center rounded-lg border border-white/20 bg-white/[0.05] font-mono text-[11px] font-bold text-[#5fd39a] group-hover:border-[#5fd39a]/50 transition-colors">
						A
					</span>
					<span class="font-medium text-[15px]">Autonomic AI</span>
				</a>
				<span class="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[11px] text-neutral-400">
					<span class="live-beacon"></span>
					local-first
				</span>
			</div>
			
			<nav class="hidden md:flex items-center gap-7 text-[13px] font-medium text-neutral-400">
				<a href="/#features" class="hover:text-white transition-colors">Features</a>
				<a href="/#how-it-works" class="hover:text-white transition-colors">How it works</a>
				<a href="/#inspector" class="hover:text-white transition-colors">Receipt Proof</a>
				<a href="/docs" class="hover:text-white transition-colors">Docs</a>
				<a href="/blog" class="hover:text-white transition-colors">Blog</a>
				<a href="/changelog" class="hover:text-white transition-colors">Changelog</a>
				<a href="https://autonomic-ai.openstatus.dev" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors flex items-center gap-1.5">
					<span class="live-beacon"></span>
					Status
				</a>
			</nav>

			<div class="flex items-center gap-3">
				<a
					href="https://github.com/autonomic-ai-dev"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-1.5 text-xs font-mono text-neutral-200 transition-all hover:border-white/30 hover:bg-white/[0.08]"
				>
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
					</svg>
					<span>GitHub</span>
				</a>
				<a href="#quickstart" class="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-black transition-all hover:bg-neutral-200">
					<span>Get Started</span>
				</a>
			</div>
		</div>

		<!-- Mobile Horizontal Scroll Navigation -->
		<nav class="flex md:hidden items-center gap-5 overflow-x-auto border-t border-white/[0.06] px-4 py-2 text-xs font-mono text-neutral-400 no-scrollbar">
			<a href="/#features" class="whitespace-nowrap transition-colors hover:text-white">Features</a>
			<a href="/#how-it-works" class="whitespace-nowrap transition-colors hover:text-white">How it works</a>
			<a href="/#inspector" class="whitespace-nowrap transition-colors hover:text-white">Receipt Proof</a>
			<a href="/docs" class="whitespace-nowrap transition-colors hover:text-white">Docs</a>
			<a href="/blog" class="whitespace-nowrap transition-colors hover:text-white">Blog</a>
			<a href="/changelog" class="whitespace-nowrap transition-colors hover:text-white">Changelog</a>
			<a href="https://autonomic-ai.openstatus.dev" target="_blank" rel="noopener noreferrer" class="whitespace-nowrap transition-colors hover:text-white flex items-center gap-1.5">
				<span class="live-beacon"></span>
				Status
			</a>
		</nav>
	</header>

	<main>
		{@render children()}
	</main>

	<!-- Architectural Footer -->
	<footer class="border-t border-white/[0.08] bg-[#070709]">
		<div class="yc-container py-14">
			<div class="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div class="flex items-center gap-2.5">
						<span class="flex h-5 w-5 items-center justify-center rounded border border-white/20 bg-white/[0.05] font-mono text-[10px] text-[#5fd39a]">A</span>
						<span class="font-medium text-white text-sm">Autonomic AI</span>
					</div>
					<p class="mt-2 text-xs text-neutral-500 max-w-sm">Deterministic execution, proof receipts, and workflow snapshots for coding agents.</p>
				</div>
				<div class="flex flex-wrap items-center gap-6 text-xs font-mono">
					<a href="/tekmor" class="text-neutral-400 hover:text-white transition-colors">{tool.name}</a>
					<a href="/thesmos" class="text-neutral-400 hover:text-white transition-colors">{spine.name}</a>
					<a href="/docs" class="text-neutral-400 hover:text-white transition-colors">Docs</a>
					<a href="/blog" class="text-neutral-400 hover:text-white transition-colors">Blog</a>
					<a href="/changelog" class="text-neutral-400 hover:text-white transition-colors">Changelog</a>
					<a href="https://autonomic-ai.openstatus.dev" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors">
						<span class="live-beacon"></span>
						All systems normal
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>
