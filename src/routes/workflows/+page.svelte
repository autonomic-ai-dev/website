<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    goto('/registry', { replaceState: true });
  });
</script>

<div class="min-h-screen flex items-center justify-center font-mono text-xs text-slate-400">
  Redirecting to <a href="/registry" class="text-cyan-400 underline ml-1">Autonomic Registry</a>...
</div>
