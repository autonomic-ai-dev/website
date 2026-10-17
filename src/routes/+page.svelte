<script lang="ts">
  import {
    Brain,
    Heart,
    Activity,
    GitBranch,
    ShieldAlert,
    Cpu,
    Layers,
    Terminal,
    Radio,
    Copy,
    Check,
    ArrowRight,
    ShieldCheck,
    Zap,
    ExternalLink
  } from "lucide-svelte";
  import { agents } from "$lib/data/agents";
  import { inview } from "$lib/actions/inview";
  import { spotlight } from "$lib/actions/spotlight";
  import { tilt } from "$lib/actions/tilt";

  let activeTab = $state<'brew' | 'cargo' | 'curl'>('brew');
  let copied = $state(false);

  const commandMap = {
    brew: "brew tap autonomic-ai-dev/tap && brew install agent-body agent-brain",
    cargo: "cargo install agent-body agent-brain agent-spine agent-muscle",
    curl: "curl -fsSL https://autonomic-ai.dev/install.sh | bash"
  };

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(commandMap[activeTab]);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    }
  }
</script>

<!-- Live Telemetry Status Header -->
<div class="pt-24 px-6 max-w-7xl mx-auto">
  <div class="p-3 rounded-xl bg-[#0a0e14] border border-cyan-500/20 font-mono text-xs flex flex-wrap items-center justify-between gap-3 shadow-2xl">
    <div class="flex items-center gap-3">
      <span class="flex h-2 w-2 relative">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span class="text-white font-bold tracking-wider uppercase text-[11px]">AUTONOMIC::MESH</span>
      <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold text-[10px]">
        11/11 ORGANS NOMINAL
      </span>
      <span class="text-slate-500 hidden sm:inline">•</span>
      <span class="text-slate-400 hidden sm:inline">RTT: <strong class="text-cyan-400">&lt;0.8ms</strong></span>
    </div>
    <div class="flex items-center gap-3">
      <span class="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-[10px]">
        DARWIN ARM64 METAL
      </span>
      <span class="text-slate-500 hidden md:inline">•</span>
      <a href="/docs/architecture" class="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-semibold text-[11px]">
        <span>Architecture Spec</span>
        <ArrowRight size={12} />
      </a>
    </div>
  </div>
</div>

<!-- Hero Section -->
<section class="relative pt-12 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
  <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-cyan-500/30 text-xs font-mono font-medium text-cyan-300 mb-6">
    <Zap size={14} class="text-cyan-400" />
    <span>Eleven Specialized Organs · Zero Shared State · Local-First</span>
  </div>
  
  <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
    Autonomous systems that <br/>
    <span class="text-gradient">build, heal, and evolve.</span>
  </h1>
  
  <p class="text-lg md:text-xl text-slate-400 max-w-3xl mb-8 leading-relaxed font-sans">
    The bio-digital computing mesh for autonomous software engineering. Built in Rust with deterministic DAG execution, AST-guarded sandboxing, token budgeting, and durable memory.
  </p>

  <!-- Interactive Quickstart Terminal Box -->
  <div class="w-full max-w-2xl bg-[#080b10] border border-white/10 rounded-xl overflow-hidden font-mono shadow-2xl mb-10 text-left">
    <div class="bg-[#0d1117] border-b border-white/10 px-4 py-2.5 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          onclick={() => activeTab = 'brew'}
          class="px-2.5 py-1 rounded text-xs transition-colors {activeTab === 'brew' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-400 hover:text-white'}"
        >
          Homebrew
        </button>
        <button
          onclick={() => activeTab = 'cargo'}
          class="px-2.5 py-1 rounded text-xs transition-colors {activeTab === 'cargo' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-400 hover:text-white'}"
        >
          Cargo
        </button>
        <button
          onclick={() => activeTab = 'curl'}
          class="px-2.5 py-1 rounded text-xs transition-colors {activeTab === 'curl' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-400 hover:text-white'}"
        >
          Curl
        </button>
      </div>
      <button
        onclick={copyCommand}
        class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161b22] hover:bg-white/10 text-slate-300 text-xs transition-colors border border-white/10"
        title="Copy command to clipboard"
      >
        {#if copied}
          <Check size={12} class="text-emerald-400" />
          <span class="text-emerald-400 font-semibold">Copied!</span>
        {:else}
          <Copy size={12} />
          <span>Copy</span>
        {/if}
      </button>
    </div>
    <div class="p-4 text-xs font-mono text-emerald-400 flex items-center gap-2 overflow-x-auto">
      <span class="text-cyan-400 font-bold select-none">&gt;_</span>
      <code class="text-slate-200 select-all">{commandMap[activeTab]}</code>
    </div>
  </div>
  
  <div class="flex flex-col sm:flex-row items-center gap-4">
    <a href="#ecosystem" class="px-8 py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 text-sm font-mono">
      Explore 11-Organ Mesh
    </a>
    <a href="/docs/architecture" class="px-8 py-3.5 rounded-full font-bold text-white glass hover:bg-white/10 transition-all border border-white/10 hover:-translate-y-0.5 flex items-center gap-2 text-sm font-mono">
      <span>Architectural Specs</span>
      <ArrowRight size={14} />
    </a>
    <a href="https://github.com/autonomic-ai-dev" target="_blank" rel="noopener noreferrer" class="px-6 py-3.5 rounded-full font-bold text-slate-300 glass hover:bg-white/10 transition-all border border-white/10 hover:-translate-y-0.5 flex items-center gap-2 text-sm font-mono">
      <ExternalLink size={14} />
      <span>GitHub</span>
    </a>
  </div>
</section>

<!-- 11-Organ Bio-Digital Mesh Bento Grid -->
<section id="ecosystem" class="py-20 px-6 max-w-7xl mx-auto">
  <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <div class="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2">Subsystem Topology</div>
      <h2 class="text-3xl md:text-5xl font-bold text-white tracking-tight">The 11-Organ Bio-Digital Mesh</h2>
    </div>
    <p class="text-slate-400 max-w-md text-sm font-mono">
      Each organ is an independent, sandboxed process with memory barriers and verifiable contracts.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-4 gap-5 auto-rows-fr">
    {#each agents as agent}
      {@const Icon = agent.icon}
      <a 
        href={`/agents/${agent.id}`} 
        use:spotlight
        use:tilt={{ max: 8, scale: 1.01 }}
        use:inview={{ delay: 30 * agent.id.length }}
        class="glass-card spotlight-card p-6 flex flex-col justify-between group relative overflow-hidden h-full {agent.span} reveal-hidden border border-white/[0.08] hover:border-cyan-500/40 transition-all"
      >
        <!-- Background Gradient Hover -->
        <div class="absolute inset-0 bg-gradient-to-br {agent.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
        
        <div>
          <!-- Header Strip: Icon, Status Pill, Protocol Tag -->
          <div class="flex items-center justify-between gap-2 mb-4 font-mono text-[10px]">
            <div class="w-10 h-10 rounded-xl bg-slate-800/60 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Icon class="text-cyan-400" size={20} />
            </div>
            <div class="flex items-center gap-1.5 flex-wrap justify-end">
              <span class="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{agent.latency}</span>
              </span>
              <span class="px-1.5 py-0.5 rounded bg-[#161b22] text-slate-400 border border-white/10">
                {agent.protocol}
              </span>
            </div>
          </div>

          <h3 class="text-xl font-bold text-white mb-1 font-mono tracking-tight group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
            <span>{agent.name}</span>
          </h3>
          <div class="text-[11px] font-mono font-semibold text-cyan-400 mb-3">{agent.role}</div>
          <p class="text-slate-400 group-hover:text-slate-300 transition-colors text-xs leading-relaxed font-sans mb-4">
            {agent.description}
          </p>
        </div>

        <div>
          <!-- Features tags -->
          <div class="flex flex-wrap gap-1 mb-3">
            {#each agent.features.slice(0, 3) as feature}
              <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/5">
                {feature}
              </span>
            {/each}
          </div>

          <div class="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
            <span>{agent.version}</span>
            <span class="flex items-center gap-1">
              <span>Inspect</span>
              <ArrowRight size={12} class="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </a>
    {/each}

    <!-- Centralized Architecture Hub Card -->
    <a 
      href="/docs/architecture" 
      use:spotlight
      use:tilt={{ max: 5, scale: 1.01 }}
      use:inview={{ delay: 200 }}
      class="glass-card spotlight-card p-6 flex flex-col justify-between group relative overflow-hidden h-full md:col-span-2 bg-gradient-to-br from-[#0B0F19] to-slate-900 border-cyan-500/30 reveal-hidden"
    >
      <div class="absolute right-0 top-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors"></div>
      <div>
        <div class="flex items-center gap-2 mb-3">
          <ShieldCheck size={18} class="text-cyan-400" />
          <span class="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300">Architecture Specification</span>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2 font-mono text-gradient">Centralized Architecture Hub</h3>
        <p class="text-slate-300 text-xs leading-relaxed max-w-lg mb-4">
          Deep-dive into multi-process supervision, Tree-sitter AST validation gates, UDS socket proxying, token headroom rate-limiters, and executable verification playbooks.
        </p>
      </div>
      <div class="inline-flex items-center gap-2 font-mono font-bold text-xs text-cyan-400 group-hover:text-cyan-300">
        <span>Read Architecture Blueprint</span>
        <ArrowRight size={14} class="group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  </div>
</section>

<!-- Features Section -->
<section id="features" class="py-24 px-6 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
  <div use:inview class="mb-16 text-center reveal-hidden">
    <div class="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2">Resilience Principles</div>
    <h2 class="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Built for Autonomy</h2>
    <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">Continuous, self-aware services designed with zero lock contention and verifiable safety.</p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
        <Heart size={28} />
      </div>
      <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">Token Headroom & Self-Healing</h3>
      <p class="text-slate-600 dark:text-slate-400">Agent Heart enforces hard token spending limits and garbage-collects vector stores, while Agent Body supervises process lifecycles and restarts fallen daemons.</p>
    </div>
    <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
        <Activity size={28} />
      </div>
      <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">Real-Time Telemetry & CI Dashboard</h3>
      <p class="text-slate-600 dark:text-slate-400">Mission Control streams pipeline states, checks triage, and terminal logs across all eleven repositories directly in the browser and terminal HUD.</p>
    </div>
    <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-6">
        <Cpu size={28} />
      </div>
      <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">AST Guard & Sandboxed Execution</h3>
      <p class="text-slate-600 dark:text-slate-400">Agent Muscle validates Tree-sitter AST syntax before command execution, intercepts malicious patterns, and adaptively compresses voluminous output to bounded 4KB slices.</p>
    </div>
    <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
        <ShieldAlert size={28} />
      </div>
      <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">Verified Recipes & Policy Gates</h3>
      <p class="text-slate-600 dark:text-slate-400">Agent Brain injects battle-tested verified shell recipes into every turn, while Agent Mouth and Immune enforce human approvals and OSV vulnerability scanning.</p>
    </div>
  </div>
</section>
