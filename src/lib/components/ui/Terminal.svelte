<script lang="ts">
	import { Check, Copy } from 'lucide-svelte';

	let { title, lines, prompt = true }: { title: string; lines: string[]; prompt?: boolean } = $props();

	let copied = $state(false);

	async function copyContent() {
		try {
			await navigator.clipboard.writeText(lines.join('\n'));
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			copied = false;
		}
	}

	function isCommandLine(line: string): boolean {
		const trimmed = line.trim();
		return trimmed.startsWith('$') || 
		       trimmed.startsWith('brew') || 
		       trimmed.startsWith('tekmor') || 
		       trimmed.startsWith('agent-spine') || 
		       trimmed.startsWith('cargo');
	}

	function cleanLine(line: string): string {
		return line.trim().startsWith('$ ') ? line.trim().slice(2) : line;
	}
</script>

<div class="group relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0c0d10] shadow-2xl shadow-black/90 ring-1 ring-white/5 transition-all hover:border-white/20">
	<!-- Terminal header -->
	<div class="flex items-center justify-between border-b border-white/[0.06] bg-[#08080a] px-4 py-2.5 backdrop-blur">
		<div class="flex items-center gap-2">
			<span class="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/80 ring-1 ring-[#ff5f56]/30"></span>
			<span class="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/80 ring-1 ring-[#ffbd2e]/30"></span>
			<span class="h-2.5 w-2.5 rounded-full bg-[#27c93f]/80 ring-1 ring-[#27c93f]/30"></span>
			<span class="ml-3 font-mono text-[11px] text-neutral-400">{title}</span>
		</div>
		<button
			type="button"
			onclick={copyContent}
			aria-label="Copy terminal commands"
			class="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] font-mono text-neutral-400 transition-colors hover:bg-white/[0.08] hover:text-white"
		>
			{#if copied}
				<Check size={11} class="text-[#5fd39a]" />
				<span class="text-[#5fd39a]">Copied</span>
			{:else}
				<Copy size={11} />
				<span>Copy</span>
			{/if}
		</button>
	</div>

	<!-- Terminal lines -->
	<ul class="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-neutral-200 space-y-1.5 no-scrollbar">
		{#each lines as line, index (index)}
			{@const isCmd = prompt && isCommandLine(line)}
			<li class="flex items-start gap-2.5 whitespace-pre">
				{#if isCmd}
					<span class="select-none text-[#5fd39a] font-medium">$</span>
					<span class="text-white font-medium">{cleanLine(line)}</span>
				{:else if line.includes('PASSED')}
					<span class="select-none text-[#5fd39a]">&rarr;</span>
					<span class="font-medium text-[#5fd39a]">{line}</span>
				{:else if line.includes('✔')}
					<span class="text-[#5fd39a]">{line}</span>
				{:else if line.includes('FAILED') || line.includes('REJECTED')}
					<span class="select-none text-red-400">&times;</span>
					<span class="font-medium text-red-400">{line}</span>
				{:else if line.startsWith('#') || line.startsWith('//')}
					<span class="text-neutral-500 italic">{line}</span>
				{:else}
					<span class="text-neutral-400 pl-4">{line}</span>
				{/if}
			</li>
		{/each}
	</ul>
</div>
