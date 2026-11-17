<script lang="ts">
	import { scrollReveal } from '#lib/actions/scrollReveal';

	interface Tech {
		name: string;
		spec: string;
	}

	let {
		color = 'orange',
		technologies,
		label = 'Works with any standard coding agent stack. Claude Code, Cursor, and CI pipelines.'
	}: {
		color?: 'orange' | 'emerald' | 'blue';
		technologies?: Tech[];
		label?: string;
	} = $props();

	const defaultTechs: Tech[] = [
		{ name: 'Claude Code', spec: 'Stop hook integration' },
		{ name: 'Cursor / Codex', spec: 'Local terminal CLI' },
		{ name: 'Rust Native', spec: 'Zero LLM token calls' },
		{ name: 'SQLite 3', spec: 'Append-only audit trail' },
		{ name: 'Git Tree SHA', spec: 'Merkle receipt hashing' },
		{ name: 'GitHub Actions', spec: 'CI gate enforcement' },
		{ name: 'macOS & Linux', spec: 'Apple Silicon & amd64' },
		{ name: 'Homebrew Tap', spec: 'Single binary install' }
	];

	const dotColors = {
		orange: 'bg-[#ff531a] shadow-[0_0_8px_#ff531a]',
		emerald: 'bg-[#5fd39a] shadow-[0_0_8px_#5fd39a]',
		blue: 'bg-blue-400 shadow-[0_0_8px_#60a5fa]'
	};

	const dotClass = $derived(dotColors[color] ?? dotColors.orange);
	const techs = $derived(technologies && technologies.length > 0 ? technologies : defaultTechs);
</script>

<section use:scrollReveal class="py-16 border-y border-white/[0.08] bg-[#000000]">
	<div class="yc-container mx-auto px-4 pl-12 sm:pl-16 md:pl-20 lg:pl-24">
		<div class="flex justify-center mb-8">
			<span class="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1 text-xs text-neutral-300 font-mono-code text-center">
				<span class="w-1.5 h-1.5 rounded-full {dotClass} shrink-0"></span>
				<span>{label}</span>
			</span>
		</div>

		<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
			{#each techs as tech, idx (tech.name)}
				<div
					use:scrollReveal={{ delay: idx * 40 }}
					class="p-3 rounded-xl border border-white/[0.06] bg-[#08080a] hover:border-white/[0.2] hover:-translate-y-1 transition-all duration-200 text-center group cursor-default"
				>
					<div class="text-xs font-bold text-neutral-300 group-hover:text-white transition-colors">
						{tech.name}
					</div>
					<div class="text-[10px] font-mono-code text-neutral-500 mt-1 truncate">
						{tech.spec}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
