<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Menu, X, ArrowRight, ExternalLink } from 'lucide-svelte';
	import { page } from '$app/state';
	import { MAIN_ORIGIN, mainProducts } from '#lib/data/products';
	import Footer from '#lib/components/Footer.svelte';

	let { children }: { children: Snippet } = $props();

	let mobileMenuOpen = $state(false);

	const canonical = $derived(`${MAIN_ORIGIN}${page.url.pathname.replace(/\/+$/, '') || '/'}`);
	const tool = mainProducts[0];
	const spine = mainProducts[1];

	function isActive(href: string) {
		return page.url.pathname === href;
	}

	$effect(() => {
		void page.url.pathname;
		mobileMenuOpen = false;
	});
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	<meta property="og:site_name" content="Autonomic AI" />
	<meta property="og:url" content={canonical} />
</svelte:head>

<div
	class="min-h-screen bg-[#070709] text-neutral-100 font-sans selection:bg-[#5fd39a]/20 selection:text-white"
>
	<!-- Top Sticky Architectural Navbar -->
	<header class="sticky top-0 z-50 border-b border-white/[0.08] bg-[#070709]/90 backdrop-blur-xl">
		<div class="yc-container flex items-center justify-between py-3.5">
			<!-- Brand Logo & Optional Badge -->
			<div class="flex items-center gap-3">
				<a
					href="/"
					class="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white shrink-0"
				>
					<span
						class="flex h-6 w-6 items-center justify-center rounded-lg border border-white/20 bg-white/[0.05] font-mono text-[11px] font-bold text-[#5fd39a] group-hover:border-[#5fd39a]/50 transition-colors"
					>
						A
					</span>
					<span class="font-medium text-[15px]">Autonomic AI</span>
				</a>
				<span
					class="hidden xl:inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[11px] text-neutral-400"
				>
					<span class="live-beacon"></span>
					local-first
				</span>
			</div>

			<!-- Desktop Primary Nav (visible on lg and above with roomy spacing) -->
			<nav
				class="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] font-medium text-neutral-400"
			>
				<a href="/tekmor" class="hover:text-white transition-colors {isActive('/tekmor') ? 'text-white' : ''}">Tekmor</a>
				<a href="/thesmos" class="hover:text-white transition-colors {isActive('/thesmos') ? 'text-white' : ''}">Thesmos</a>
				<a href="/docs" class="hover:text-white transition-colors {isActive('/docs') ? 'text-white' : ''}">Docs</a>
				<a href="/blog" class="hover:text-white transition-colors {isActive('/blog') ? 'text-white' : ''}">Blog</a>
				<a href="/changelog" class="hover:text-white transition-colors {isActive('/changelog') ? 'text-white' : ''}">Changelog</a>
				<a
					href="https://autonomic-ai.openstatus.dev"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-white transition-colors flex items-center gap-1.5"
				>
					<span class="live-beacon"></span>
					Status
				</a>
			</nav>

			<!-- Desktop Actions & Mobile Menu Toggle -->
			<div class="flex items-center gap-2.5 sm:gap-3">
				<a
					href="https://github.com/autonomic-ai-dev"
					target="_blank"
					rel="noopener noreferrer"
					class="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-1.5 text-xs font-mono text-neutral-200 transition-all hover:border-white/30 hover:bg-white/[0.08]"
				>
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
						/>
					</svg>
					<span>GitHub</span>
				</a>

				<a
					href="/#how-it-works"
					class="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-black transition-all hover:bg-neutral-200"
				>
					<span>Get Started</span>
				</a>

				<!-- Mobile Hamburger Menu Button -->
				<button
					type="button"
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
					class="inline-flex lg:hidden items-center justify-center h-8 w-8 rounded-lg border border-white/[0.12] bg-white/[0.04] text-neutral-300 transition-colors hover:bg-white/[0.08] hover:text-white"
				>
					{#if mobileMenuOpen}
						<X size={16} />
					{:else}
						<Menu size={16} />
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile Menu Drawer (Smooth slide-down) -->
		{#if mobileMenuOpen}
			<div class="lg:hidden border-t border-white/[0.08] bg-[#090a0d] px-4 py-5 space-y-6">
				<!-- Products Section -->
				<div>
					<span class="font-mono text-[11px] uppercase tracking-wider text-neutral-500"
						>Products</span
					>
					<div class="mt-2.5 grid grid-cols-2 gap-2.5">
						<a
							href="/tekmor"
							onclick={() => (mobileMenuOpen = false)}
							class="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-colors hover:border-[#5fd39a]/40 hover:bg-white/[0.05]"
						>
							<div class="flex items-center justify-between">
								<span class="font-semibold text-white text-sm">{tool.name}</span>
								<span
									class="rounded bg-[#5fd39a]/15 px-1.5 py-0.5 font-mono text-[10px] text-[#5fd39a]"
									>v1.0.0</span
								>
							</div>
							<p class="mt-1 text-[11px] text-neutral-400">Proof evals & stop gates</p>
						</a>

						<a
							href="/thesmos"
							onclick={() => (mobileMenuOpen = false)}
							class="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-colors hover:border-blue-500/40 hover:bg-white/[0.05]"
						>
							<div class="flex items-center justify-between">
								<span class="font-semibold text-white text-sm">{spine.name}</span>
								<span
									class="rounded bg-blue-500/15 px-1.5 py-0.5 font-mono text-[10px] text-blue-400"
									>v1.0.0-rc3</span
								>
							</div>
							<p class="mt-1 text-[11px] text-neutral-400">Deterministic DAG workflows</p>
						</a>
					</div>
				</div>

				<!-- Site Navigation Links -->
				<div>
					<span class="font-mono text-[11px] uppercase tracking-wider text-neutral-500"
						>Navigation</span
					>
					<div class="mt-2.5 flex flex-col space-y-1">
						<a
							href="/docs"
							onclick={() => (mobileMenuOpen = false)}
							class="rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/[0.05] hover:text-white"
						>
							Documentation
						</a>
						<a
							href="/blog"
							onclick={() => (mobileMenuOpen = false)}
							class="rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/[0.05] hover:text-white"
						>
							Blog
						</a>
						<a
							href="/changelog"
							onclick={() => (mobileMenuOpen = false)}
							class="rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/[0.05] hover:text-white"
						>
							Changelog
						</a>
						<a
							href="https://autonomic-ai.openstatus.dev"
							target="_blank"
							rel="noopener noreferrer"
							class="rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/[0.05] hover:text-white flex items-center justify-between"
						>
							<span class="flex items-center gap-2">
								<span class="live-beacon"></span>
								System Status
							</span>
							<ExternalLink size={13} class="text-neutral-500" />
						</a>
					</div>
				</div>

				<!-- Mobile Actions -->
				<div class="pt-2 border-t border-white/[0.06] flex items-center gap-3">
					<a
						href="https://github.com/autonomic-ai-dev"
						target="_blank"
						rel="noopener noreferrer"
						class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] py-2.5 text-xs font-mono text-neutral-200 transition-all hover:bg-white/[0.08]"
					>
						<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
							/>
						</svg>
						<span>GitHub</span>
					</a>
					<a
						href="/#how-it-works"
						onclick={() => (mobileMenuOpen = false)}
						class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-xs font-semibold text-black transition-all hover:bg-neutral-200"
					>
						<span>Get Started</span>
						<ArrowRight size={13} />
					</a>
				</div>
			</div>
		{/if}
	</header>

	<main>
		{@render children()}
	</main>

	<!-- Architectural Footer -->
	<Footer brand="org" />
</div>
