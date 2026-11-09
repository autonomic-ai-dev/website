<script lang="ts">
  import { Check, Copy } from "lucide-svelte";

  type Entry = { name: string; description: string; command: string };
  let { entries }: { entries: Entry[] } = $props();

  let copied = $state<string | null>(null);

  async function copy(command: string) {
    try {
      await navigator.clipboard.writeText(command);
      copied = command;
      setTimeout(() => (copied = null), 1500);
    } catch {
      copied = null;
    }
  }
</script>

<ul class="divide-y divide-zinc-900 border-y border-zinc-900">
  {#each entries as entry (entry.name)}
    <li class="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <p class="font-mono text-sm text-white">{entry.name}</p>
        <p class="mt-1 text-sm text-zinc-400">{entry.description}</p>
      </div>
      <button
        type="button"
        onclick={() => copy(entry.command)}
        class="flex shrink-0 items-center gap-2 rounded border border-zinc-800 px-3 py-1.5 font-mono text-xs text-zinc-300 hover:bg-zinc-900"
      >
        {#if copied === entry.command}<Check size={12} />{:else}<Copy size={12} />{/if}
        {entry.command}
      </button>
    </li>
  {/each}
</ul>
