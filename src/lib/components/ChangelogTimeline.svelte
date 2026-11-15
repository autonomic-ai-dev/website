<script lang="ts">
	import { Calendar, ExternalLink, Code2, Tag, ChevronDown, CheckCircle2 } from 'lucide-svelte';
	import type { ChangelogEntry, ChangelogCategory } from '#lib/content/changelog';

	let {
		entries,
		initialFilter = 'all',
		showFilter = true
	}: {
		entries: ChangelogEntry[];
		initialFilter?: 'all' | 'tekmor' | 'thesmos';
		showFilter?: boolean;
	} = $props();

	let customFilter = $state<'all' | 'tekmor' | 'thesmos' | null>(null);
	const filter = $derived(customFilter ?? initialFilter);
	let visibleCount = $state(4);

	const filteredEntries = $derived(
		filter === 'all' ? entries : entries.filter((e) => e.product === filter)
	);

	const visibleEntries = $derived(filteredEntries.slice(0, visibleCount));
	const hasMore = $derived(visibleCount < filteredEntries.length);

	let timelineContainer: HTMLElement | undefined = $state();
	let sentinel: HTMLElement | undefined = $state();
	let indicatorY = $state(0);
	let activeVersion = $state<string>('');

	function updateScroll() {
		if (!timelineContainer) return;
		const rect = timelineContainer.getBoundingClientRect();
		const focusY = window.innerHeight * 0.35;
		const relativeY = focusY - rect.top;
		const maxH = Math.max(0, rect.height - 36);
		indicatorY = Math.max(0, Math.min(relativeY, maxH));

		// Find closest active entry
		const cards = timelineContainer.querySelectorAll<HTMLElement>('[data-version]');
		let closestVer = '';
		let closestDist = Infinity;

		cards.forEach((card) => {
			const cardRect = card.getBoundingClientRect();
			const dist = Math.abs(cardRect.top - focusY);
			if (dist < closestDist) {
				closestDist = dist;
				closestVer = card.getAttribute('data-version') || '';
			}
		});

		if (closestVer) activeVersion = closestVer;
	}

	$effect(() => {
		updateScroll();
		window.addEventListener('scroll', updateScroll, { passive: true });
		window.addEventListener('resize', updateScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', updateScroll);
			window.removeEventListener('resize', updateScroll);
		};
	});

	// Infinite scroll observer
	$effect(() => {
		if (!sentinel) return;
		const observer = new IntersectionObserver(
			(observerEntries) => {
				if (observerEntries[0].isIntersecting && hasMore) {
					visibleCount += 3;
				}
			},
			{ rootMargin: '300px' }
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	});

	function categoryBadgeClass(category: ChangelogCategory) {
		switch (category) {
			case 'Added':
				return 'bg-[#5fd39a]/10 text-[#5fd39a] border-[#5fd39a]/30';
			case 'Changed':
				return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
			case 'Fixed':
				return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
			case 'Security':
				return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
			case 'Migration':
				return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
			default:
				return 'bg-white/10 text-white border-white/20';
		}
	}
</script>

<div>
	<!-- Product Filter Pills (if enabled) -->
	{#if showFilter}
		<div class="mt-8 flex flex-wrap gap-2.5">
			<button
				type="button"
				onclick={() => {
					customFilter = 'all';
					visibleCount = 4;
				}}
				class="rounded-full px-4 py-1.5 text-xs font-medium transition-colors {filter === 'all'
					? 'bg-white text-black font-semibold'
					: 'bg-white/[0.05] text-neutral-300 hover:bg-white/[0.1] hover:text-white'}"
			>
				All Updates ({entries.length})
			</button>
			<button
				type="button"
				onclick={() => {
					customFilter = 'tekmor';
					visibleCount = 4;
				}}
				class="rounded-full px-4 py-1.5 text-xs font-medium transition-colors {filter === 'tekmor'
					? 'bg-[#5fd39a] text-black font-semibold'
					: 'bg-white/[0.05] text-neutral-300 hover:bg-white/[0.1] hover:text-white'}"
			>
				tekmor
			</button>
			<button
				type="button"
				onclick={() => {
					customFilter = 'thesmos';
					visibleCount = 4;
				}}
				class="rounded-full px-4 py-1.5 text-xs font-medium transition-colors {filter === 'thesmos'
					? 'bg-blue-400 text-black font-semibold'
					: 'bg-white/[0.05] text-neutral-300 hover:bg-white/[0.1] hover:text-white'}"
			>
				thesmos
			</button>
		</div>
	{/if}

	<!-- Timeline Container with Animated Tracing Line & Dot -->
	<div bind:this={timelineContainer} class="relative mt-14 max-w-4xl pb-12">
		<!-- Static Background Rail Line -->
		<div class="pointer-events-none absolute left-[15px] sm:left-[19px] top-4 bottom-4 w-[2px] bg-white/[0.08]"></div>

		<!-- Dynamic Active Progress Beam -->
		<div
			class="pointer-events-none absolute left-[15px] sm:left-[19px] top-4 w-[2px] bg-gradient-to-b from-[#5fd39a] via-emerald-400 to-[#5fd39a]"
			style="height: {indicatorY}px; transition: height 0.08s linear;"
		></div>

		<!-- Animated Traveling Glowing Green Dot -->
		<div
			class="pointer-events-none absolute left-[10px] sm:left-[14px] top-4 z-20 h-3 w-3 rounded-full bg-[#5fd39a] shadow-[0_0_14px_#5fd39a] ring-4 ring-[#070709]"
			style="transform: translateY({indicatorY}px); transition: transform 0.08s linear;"
		></div>

		<!-- Timeline Entries -->
		<div class="space-y-14 pl-10 sm:pl-14">
			{#each visibleEntries as entry (entry.version + entry.product)}
				<article
					data-version={entry.version}
					class="relative group transition-opacity duration-300"
				>
					<!-- Anchor ring on the line for this entry -->
					<div
						class="absolute -left-[30px] sm:-left-[41px] top-6 h-2.5 w-2.5 rounded-full border-2 transition-all duration-200 {activeVersion === entry.version
							? 'border-[#5fd39a] bg-[#5fd39a] shadow-[0_0_8px_#5fd39a]'
							: 'border-white/20 bg-[#070709]'}"
					></div>

					<!-- Detailed Release Card -->
					<div class="rounded-2xl border border-white/[0.1] bg-[#090a0d] p-6 sm:p-8 shadow-2xl transition-all duration-200 hover:border-white/20 {activeVersion === entry.version ? 'ring-1 ring-[#5fd39a]/30' : ''}">
						<!-- Card Top Metadata -->
						<div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
							<div class="flex items-center gap-3">
								<span class="rounded-md border px-2.5 py-0.5 font-mono text-xs font-semibold {entry.product === 'tekmor' ? 'border-[#5fd39a]/30 bg-[#5fd39a]/10 text-[#5fd39a]' : 'border-blue-500/30 bg-blue-500/10 text-blue-400'}">
									{entry.productName}
								</span>
								<span class="font-mono text-base font-semibold text-white tracking-tight">
									v{entry.version}
								</span>
							</div>

							<div class="flex items-center gap-4 text-xs font-mono text-neutral-400">
								<span class="flex items-center gap-1.5">
									<Calendar size={13} class="text-neutral-500" />
									{entry.date}
								</span>
								{#if entry.gitTag}
									<a
										href="https://github.com/autonomic-ai-dev/{entry.product === 'thesmos' ? 'agent-spine' : 'tekmor'}/releases/tag/{entry.gitTag}"
										target="_blank"
										rel="noopener noreferrer"
										class="hover:text-white transition-colors inline-flex items-center gap-1"
									>
										<span>{entry.gitTag}</span>
										<ExternalLink size={11} />
									</a>
								{/if}
							</div>
						</div>

						<!-- Headline and Summary -->
						<h2 class="mt-4 text-xl sm:text-2xl font-semibold tracking-tight text-white">
							{entry.title}
						</h2>
						<p class="mt-3 text-sm leading-relaxed text-neutral-300">
							{entry.summary}
						</p>

						<!-- Code Snippet / Config Example (if available) -->
						{#if entry.codeSnippet}
							<div class="mt-6 rounded-xl border border-white/[0.08] bg-[#050608] p-4 text-xs font-mono">
								<div class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.06] text-neutral-400">
									<span class="flex items-center gap-1.5 font-medium text-neutral-300">
										<Code2 size={13} class="text-[#5fd39a]" />
										{entry.codeSnippet.title}
									</span>
									<span class="uppercase text-[10px] text-neutral-500">{entry.codeSnippet.lang}</span>
								</div>
								<pre class="overflow-x-auto text-neutral-200 leading-relaxed no-scrollbar">{entry.codeSnippet.code}</pre>
							</div>
						{/if}

						<!-- Granular Changes Breakdown -->
						<div class="mt-6 space-y-5">
							{#each entry.sections as section (section.category)}
								<div>
									<span class="inline-block rounded border px-2 py-0.5 font-mono text-[10px] uppercase font-bold tracking-wider {categoryBadgeClass(section.category)}">
										{section.category}
									</span>
									<ul class="mt-3 space-y-2 text-xs sm:text-sm text-neutral-300">
										{#each section.items as item (item)}
											<li class="flex items-start gap-2.5 leading-relaxed">
												<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500"></span>
												<span>{item}</span>
											</li>
										{/each}
									</ul>
								</div>
							{/each}
						</div>
					</div>
				</article>
			{/each}
		</div>

		<!-- Infinite Scroll Sentinel Target -->
		<div bind:this={sentinel} class="h-10 flex items-center justify-center mt-6">
			{#if hasMore}
				<div class="flex items-center gap-2 text-xs font-mono text-neutral-500">
					<span class="live-beacon"></span>
					<span>Loading more releases...</span>
				</div>
			{:else}
				<div class="text-xs font-mono text-neutral-600">
					✓ You have reached the beginning of release history
				</div>
			{/if}
		</div>
	</div>
</div>
