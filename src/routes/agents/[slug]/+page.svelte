<script lang="ts">
  import { ArrowLeft, Code, CheckCircle2, Terminal, Shield, Cpu, Activity, ExternalLink, ArrowRight } from "lucide-svelte";
  
  let { data } = $props();
  let agent = $derived(data.agent);
  let Icon = $derived(agent.icon);
</script>

<svelte:head>
  <title>{agent.name} - Autonomic AI Dev</title>
  <meta name="description" content={agent.description} />
</svelte:head>

<main class="pt-8 pb-24 px-6 max-w-6xl mx-auto min-h-screen">
  
  <!-- Breadcrumb Navigation -->
  <div class="mb-8 flex items-center justify-between border-b border-white/[0.08] pb-4">
    <a href="/#ecosystem" class="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors">
      <ArrowLeft size={14} />
      <span>// Back to Subsystem Topology</span>
    </a>

    <div class="flex items-center gap-2 text-[10px] font-mono">
      <span class="relative flex h-1.5 w-1.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
      </span>
      <span class="text-emerald-400 font-semibold uppercase">NODE ACTIVE</span>
      <span class="text-slate-600">|</span>
      <span class="text-slate-400">LATENCY: {agent.latency}</span>
    </div>
  </div>

  <!-- Organ Header Avionics Banner -->
  <div class="bg-[#0d1117]/90 border border-white/[0.08] rounded-xl p-6 md:p-8 mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
    <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-emerald-400 to-transparent"></div>
    
    <div class="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
      <div class="flex items-center gap-5">
        <div class="w-16 h-16 rounded-xl bg-[#161b22] border border-cyan-500/30 shadow-[0_0_16px_rgba(0,242,254,0.15)] flex items-center justify-center shrink-0">
          <Icon size={32} class="text-cyan-400" />
        </div>
        
        <div>
          <div class="flex items-center gap-2.5 flex-wrap mb-1.5">
            <h1 class="text-2xl md:text-3xl font-extrabold text-white font-mono tracking-tight">{agent.name}</h1>
            <span class="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-[10px] font-mono font-semibold uppercase">
              {agent.role}
            </span>
            <span class="px-2 py-0.5 rounded bg-[#161b22] text-slate-400 border border-white/[0.08] text-[10px] font-mono">
              {agent.version}
            </span>
          </div>
          <p class="text-sm text-[#8b949e] font-sans max-w-2xl">{agent.description}</p>
        </div>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <a 
          href={agent.githubLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          class="px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[#161b22] hover:bg-[#21262d] text-white border border-white/10 hover:border-cyan-400/40 transition-all flex items-center gap-2 justify-center w-full md:w-auto"
        >
          <Code size={14} />
          <span>Source Code</span>
          <ExternalLink size={12} class="text-slate-400" />
        </a>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
    
    <!-- Left Column: Architecture & Role (2 Cols) -->
    <div class="md:col-span-2 space-y-6">
      <div class="bg-[#0d1117]/85 border border-white/[0.08] rounded-xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div class="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2">// Architecture & Role</div>
        <h2 class="text-xl font-bold text-white mb-4 font-mono">Subsystem Specification</h2>
        
        <p class="text-sm text-[#8b949e] mb-8 leading-relaxed font-sans">
          {agent.longDescription}
        </p>

        <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-4">// Verified Capabilities</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {#each agent.features as feature}
            <div class="flex items-center gap-3 p-3 rounded-lg bg-[#161b22] border border-white/[0.06] text-xs font-mono">
              <CheckCircle2 class="text-emerald-400 shrink-0" size={16} />
              <span class="text-slate-200">{feature}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Quick CLI Reference Banner -->
      <div class="bg-[#080b10] border border-white/[0.08] rounded-xl p-5 font-mono text-xs shadow-xl">
        <div class="flex items-center justify-between mb-3 text-slate-400 text-[11px]">
          <span class="flex items-center gap-2">
            <Terminal size={14} class="text-cyan-400" />
            <span>CLI INVOCATION</span>
          </span>
          <a href={`/docs/cli/${agent.id === 'agent-body' ? 'autonomic' : agent.id}`} class="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-semibold">
            <span>Flag-Level Docs</span>
            <ArrowRight size={12} />
          </a>
        </div>
        <div class="p-3 rounded-lg bg-[#0d1117] border border-white/[0.06] text-slate-200 flex items-center gap-2 overflow-x-auto">
          <span class="text-cyan-400 font-bold select-none">&gt;_</span>
          <code>{agent.id === 'agent-body' ? 'autonomic status' : `${agent.id} --help`}</code>
        </div>
      </div>
    </div>

    <!-- Right Column: Subsystem Metrics & Specs -->
    <div class="space-y-6">
      
      <div class="bg-[#0d1117]/85 border border-white/[0.08] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div class="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-4">// Telemetry Profile</div>
        
        <div class="space-y-4 font-mono text-xs">
          <div class="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span class="text-slate-400">IPC Protocol</span>
            <span class="text-cyan-300 font-semibold">{agent.protocol}</span>
          </div>

          <div class="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span class="text-slate-400">Response Latency</span>
            <span class="text-emerald-400 font-semibold">{agent.latency}</span>
          </div>

          <div class="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span class="text-slate-400">Process Model</span>
            <span class="text-slate-200">Isolated Daemon</span>
          </div>

          <div class="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span class="text-slate-400">Runtime Target</span>
            <span class="text-slate-200">Rust (Metal / CUDA)</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-slate-400">Release Version</span>
            <span class="text-slate-200">{agent.version}</span>
          </div>
        </div>
      </div>

      <!-- Quick Docs Action Card -->
      <a 
        href="/docs/architecture" 
        class="block p-5 rounded-xl bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-cyan-500/30 hover:border-cyan-400 transition-all group"
      >
        <div class="text-xs font-mono font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
          <Activity size={14} />
          <span>Ecosystem Blueprint</span>
        </div>
        <p class="text-xs text-slate-300 mb-3 font-sans">Learn how {agent.name} interfaces with the 10 other autonomous organs in the mesh.</p>
        <div class="text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1">
          <span>Read Architecture Spec</span>
          <ArrowRight size={12} class="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </a>
    </div>

  </div>
</main>
