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
    ExternalLink,
    Lock,
    Eye,
    MessageSquare,
    Workflow,
    Server
  } from "lucide-svelte";
  import { agents } from "$lib/data/agents";
  import { inview } from "$lib/actions/inview";
  import { spotlight } from "$lib/actions/spotlight";
  import { tilt } from "$lib/actions/tilt";

  const inScope = agents.filter((agent) => agent.id === "brain" || agent.id === "spine");

  let { data } = $props();
  let activeTab = $state<'brew' | 'cargo' | 'curl'>('brew');
  let copied = $state(false);

  const commandMap = {
    brew: "brew tap autonomic-ai-dev/tap && brew install agent-brain agent-spine",
    cargo: "cargo install agent-brain agent-spine",
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
<div class="pt-8 px-6 max-w-7xl mx-auto">
  <div class="p-3 rounded-xl bg-[#0d1117]/90 border border-cyan-500/25 font-mono text-xs flex flex-wrap items-center justify-between gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
    <div class="flex items-center gap-3">
      <span class="flex h-2 w-2 relative">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span class="text-white font-bold tracking-wider uppercase text-[11px]">AUTONOMIC::MESH</span>
      <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold text-[10px]">
        2/2 COMPONENTS IN SCOPE
      </span>
      <span class="text-slate-600 hidden sm:inline">|</span>
      <span class="text-slate-400 hidden sm:inline">MESH RTT: <strong class="text-cyan-400 font-mono">&lt;0.8ms</strong></span>
    </div>
    <div class="flex items-center gap-3">
      <span class="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-[10px]">
        DARWIN ARM64 METAL ACCELERATED
      </span>
      <span class="text-slate-600 hidden md:inline">|</span>
      <a href="/docs/architecture" class="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-semibold text-[11px]">
        <span>Architecture Spec</span>
        <ArrowRight size={12} />
      </a>
    </div>
  </div>
</div>

<!-- Hero Section -->
<section class="relative pt-16 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
  <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161b22] border border-cyan-500/30 text-xs font-mono font-medium text-cyan-300 mb-6 shadow-[0_0_12px_rgba(0,242,254,0.15)]">
    <Zap size={14} class="text-cyan-400" />
    <span>Two Components · No Shared Library · Local-First</span>
  </div>
  
  <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight font-sans">
    Autonomous systems that <br/>
    <span class="text-gradient">build, heal, and evolve.</span>
  </h1>
  
  <p class="text-base sm:text-lg md:text-xl text-[#8b949e] max-w-3xl mb-10 leading-relaxed font-sans">
    The bio-digital computing mesh for autonomous software engineering. Built in Rust with deterministic DAG execution, AST-guarded sandboxing, token budgeting, and durable vector memory.
  </p>

  <!-- Interactive Quickstart Terminal Box -->
  <div class="w-full max-w-2xl bg-[#080b10] border border-white/[0.1] rounded-xl overflow-hidden font-mono shadow-[0_12px_40px_rgba(0,0,0,0.6)] mb-10 text-left">
    <div class="bg-[#0d1117] border-b border-white/[0.08] px-4 py-2.5 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          onclick={() => activeTab = 'brew'}
          class="px-2.5 py-1 rounded text-xs transition-colors {activeTab === 'brew' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-white'}"
        >
          Homebrew
        </button>
        <button
          onclick={() => activeTab = 'cargo'}
          class="px-2.5 py-1 rounded text-xs transition-colors {activeTab === 'cargo' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-white'}"
        >
          Cargo
        </button>
        <button
          onclick={() => activeTab = 'curl'}
          class="px-2.5 py-1 rounded text-xs transition-colors {activeTab === 'curl' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-white'}"
        >
          Curl
        </button>
      </div>
      <button
        onclick={copyCommand}
        class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161b22] hover:bg-[#21262d] text-slate-300 text-xs transition-colors border border-white/10"
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
    <div class="p-4 text-xs font-mono text-emerald-400 flex items-center gap-2 overflow-x-auto bg-[#080b10]">
      <span class="text-cyan-400 font-bold select-none">&gt;_</span>
      <code class="text-[#f0f6fc] select-all">{commandMap[activeTab]}</code>
    </div>
  </div>
  
  <!-- Hero Action Buttons -->
  <div class="flex flex-col sm:flex-row items-center gap-3.5">
    <a href="#ecosystem" class="px-6 py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-emerald-400 text-[#080b10] hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all">
      Read the architecture
    </a>
    <a href="/docs/architecture" class="px-6 py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[#161b22] hover:bg-[#21262d] text-white border border-white/10 hover:border-cyan-400/40 transition-all flex items-center gap-2">
      <span>Architecture Specs</span>
      <ArrowRight size={14} />
    </a>
    <a href="https://github.com/autonomic-ai-dev" target="_blank" rel="noopener noreferrer" class="px-5 py-3 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-[#0d1117] hover:bg-[#161b22] border border-white/[0.08] transition-all flex items-center gap-2">
      <ExternalLink size={14} />
      <span>GitHub</span>
    </a>
  </div>
</section>

<!-- Two-component scope grid -->
<section id="ecosystem" class="py-20 px-6 max-w-7xl mx-auto">
  <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <div class="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2">// Subsystem Topology</div>
      <h2 class="text-3xl md:text-5xl font-bold text-white tracking-tight">Two Components, One Job Each</h2>
    </div>
    <p class="text-[#8b949e] max-w-md text-xs font-mono leading-relaxed">
      agent-brain supplies the right skills, rules, and memory for each turn. agent-spine runs deterministic workflows. Each is a local process, and neither depends on a shared library.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
    {#each inScope as agent}
      {@const Icon = agent.icon}
      <a 
        href={`/agents/${agent.id}`} 
        use:spotlight
        use:tilt={{ max: 6, scale: 1.01 }}
        use:inview={{ delay: 25 * agent.id.length }}
        class="bg-[#0d1117]/90 backdrop-blur-md border border-white/[0.08] hover:border-cyan-400/40 rounded-xl p-5 flex flex-col justify-between group relative overflow-hidden h-full {agent.span} reveal-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      >
        <!-- Subtle Top Glow Bar -->
        <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent group-hover:via-cyan-400 transition-colors"></div>
        
        <div>
          <!-- Header Strip: Icon, Latency Badge, Protocol Tag -->
          <div class="flex items-center justify-between gap-2 mb-4 font-mono text-[10px]">
            <div class="w-9 h-9 rounded-lg bg-[#161b22] border border-white/10 flex items-center justify-center group-hover:border-cyan-500/30 transition-colors">
              <Icon class="text-cyan-400" size={18} />
            </div>
            <div class="flex items-center gap-1.5 flex-wrap justify-end">
              <span class="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{agent.latency}</span>
              </span>
              <span class="px-1.5 py-0.5 rounded bg-[#161b22] text-slate-400 border border-white/[0.08]">
                {agent.protocol}
              </span>
            </div>
          </div>

          <h3 class="text-lg font-bold text-white mb-0.5 font-mono tracking-tight group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
            <span>{agent.name}</span>
          </h3>
          <div class="text-[10px] font-mono font-semibold text-cyan-400 mb-2.5 uppercase tracking-wider">{agent.role}</div>
          <p class="text-[#8b949e] group-hover:text-slate-300 transition-colors text-xs leading-relaxed font-sans mb-4">
            {agent.description}
          </p>
        </div>

        <div>
          <!-- Features tags -->
          <div class="flex flex-wrap gap-1 mb-3">
            {#each agent.features.slice(0, 3) as feature}
              <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-[#161b22] text-slate-300 border border-white/[0.06]">
                {feature}
              </span>
            {/each}
          </div>

          <div class="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
            <span>{data?.organVersions?.[agent.name] || agent.version}</span>
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
      use:inview={{ delay: 150 }}
      class="bg-gradient-to-br from-[#0d1117] via-[#10141a] to-[#161b22] border border-cyan-500/30 rounded-xl p-6 flex flex-col justify-between group relative overflow-hidden h-full md:col-span-2 reveal-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
    >
      <div class="absolute right-0 top-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors"></div>
      <div>
        <div class="flex items-center gap-2 mb-3">
          <ShieldCheck size={18} class="text-cyan-400" />
          <span class="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300">Architecture Specification</span>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2 font-mono text-gradient">Centralized Architecture Hub</h3>
        <p class="text-[#8b949e] text-xs leading-relaxed max-w-lg mb-4 font-sans">
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

<!-- Features Section: Aerospace Resilience Principles -->
<section id="features" class="py-24 px-6 max-w-7xl mx-auto border-t border-white/[0.08]">
  <div use:inview class="mb-16 text-center reveal-hidden">
    <div class="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2">// Resilience Principles</div>
    <h2 class="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Engineered for Homeostasis</h2>
    <p class="text-[#8b949e] max-w-2xl mx-auto text-base font-sans">Continuous, self-aware services designed with zero lock contention, deterministic execution, and verifiable safety.</p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    
    <!-- Principle 1: Vector Memory & Semantic Routing -->
    <div class="p-7 rounded-xl bg-[#0d1117]/85 border border-white/[0.08] hover:border-cyan-500/30 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div class="flex items-center justify-between mb-5">
        <div class="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center">
          <Brain size={24} />
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161b22] text-slate-400 border border-white/[0.08]">
          agent-brain
        </span>
      </div>
      <h3 class="text-xl font-bold text-white mb-2 font-mono">Vector Memory & Semantic Routing</h3>
      <p class="text-[#8b949e] text-xs leading-relaxed font-sans">agent-brain enforces strict read gates and injects durable facts, verified recipes, and relevant skills under strict token bounds into every coding turn.</p>
    </div>

    <!-- Principle 2: Deterministic DAG Workflows -->
    <div class="p-7 rounded-xl bg-[#0d1117]/85 border border-white/[0.08] hover:border-emerald-500/30 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div class="flex items-center justify-between mb-5">
        <div class="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center">
          <Layers size={24} />
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161b22] text-slate-400 border border-white/[0.08]">
          agent-spine
        </span>
      </div>
      <h3 class="text-xl font-bold text-white mb-2 font-mono">Deterministic DAG Workflows</h3>
      <p class="text-[#8b949e] text-xs leading-relaxed font-sans">agent-spine structures execution through declarative YAML pipelines, providing parallel fan-out, immutable execution snapshots, and replayable step state.</p>
    </div>

    <!-- Principle 3: Token Headroom & Read Gate Isolation -->
    <div class="p-7 rounded-xl bg-[#0d1117]/85 border border-white/[0.08] hover:border-indigo-500/30 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div class="flex items-center justify-between mb-5">
        <div class="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 flex items-center justify-center">
          <Zap size={24} />
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161b22] text-slate-400 border border-white/[0.08]">
          agent-brain
        </span>
      </div>
      <h3 class="text-xl font-bold text-white mb-2 font-mono">Token Headroom & Read Gates</h3>
      <p class="text-[#8b949e] text-xs leading-relaxed font-sans">Hard read gates block prompt pollution. agent-brain scores each candidate across skills, memory, and rules to keep context reads strictly budgeted.</p>
    </div>

    <!-- Principle 4: Human-in-the-Loop Approval Gates -->
    <div class="p-7 rounded-xl bg-[#0d1117]/85 border border-white/[0.08] hover:border-amber-500/30 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div class="flex items-center justify-between mb-5">
        <div class="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center">
          <ShieldCheck size={24} />
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161b22] text-slate-400 border border-white/[0.08]">
          agent-spine
        </span>
      </div>
      <h3 class="text-xl font-bold text-white mb-2 font-mono">Approval Gates & Verification</h3>
      <p class="text-[#8b949e] text-xs leading-relaxed font-sans">Crucial milestones pause for approval before destructive actions, while deterministic .verify/ test suites attest 100% clean passes before landing.</p>
    </div>
  </div>
</section>
