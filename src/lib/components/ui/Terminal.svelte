<script lang="ts">
	let { title, lines, prompt = true }: { title: string; lines: string[]; prompt?: boolean } = $props();
</script>

<div class="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60 ring-1 ring-white/5">
	<div class="flex items-center gap-2 border-b border-zinc-900 px-4 py-3">
		<span class="h-2.5 w-2.5 rounded-full bg-zinc-700"></span>
		<span class="h-2.5 w-2.5 rounded-full bg-zinc-700"></span>
		<span class="h-2.5 w-2.5 rounded-full bg-zinc-700"></span>
		<span class="ml-3 font-mono text-xs text-zinc-500">{title}</span>
	</div>
	<ul class="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-zinc-100 {prompt ? 'space-y-1.5' : ''}">
		{#each lines as line, index (index)}
			<li class="flex gap-3 whitespace-pre">
				{#if prompt}<span class="select-none text-sky-400">$</span>{/if}
				<span class={prompt ? 'break-all' : ''}>{line}</span>
			</li>
		{/each}
	</ul>
</div>
