<script lang="ts">
	let { lines }: { lines: string[] } = $props();
</script>

<div class="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60 ring-1 ring-white/5">
	<div class="flex items-center gap-2 border-b border-zinc-900 px-4 py-3">
		<span class="h-2.5 w-2.5 rounded-full bg-zinc-700"></span>
		<span class="h-2.5 w-2.5 rounded-full bg-zinc-700"></span>
		<span class="h-2.5 w-2.5 rounded-full bg-zinc-700"></span>
		<span class="ml-3 font-mono text-xs text-zinc-500">zsh</span>
	</div>
	<ul class="space-y-3 p-5 font-mono text-[13px] leading-6">
		{#each lines as line (line)}
			<li class="flex gap-3">
				<span class="select-none text-sky-400">$</span>
				<span class="break-all text-zinc-100">{line}</span>
			</li>
		{/each}
	</ul>
</div>
