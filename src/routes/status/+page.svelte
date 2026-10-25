<script lang="ts">
  import { onMount } from "svelte";
  import { ExternalLink, Activity } from "lucide-svelte";

  onMount(() => {
    window.location.href = "https://autonomic-ai.openstatus.dev/";
  });
</script>

<svelte:head>
  <title>System Status | Autonomic AI</title>
  <meta http-equiv="refresh" content="0; url=https://autonomic-ai.openstatus.dev/" />
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center px-6">
  <div class="max-w-md w-full p-8 rounded-2xl bg-[#0d1117] border border-cyan-500/20 text-center shadow-2xl">
    <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto mb-4 flex items-center justify-center">
      <Activity size={24} />
    </div>
    <h1 class="text-xl font-bold font-mono text-white mb-2">Redirecting to OpenStatus...</h1>
    <p class="text-xs text-slate-400 mb-6 font-mono leading-relaxed">
      Live latency, uptime, and endpoint status across agent-brain and agent-spine.
    </p>
    <a 
      href="https://autonomic-ai.openstatus.dev/" 
      class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-bold bg-cyan-500 text-[#080b10] hover:bg-cyan-400 transition"
    >
      <span>Open Status Page</span>
      <ExternalLink size={14} />
    </a>
  </div>
</div>
