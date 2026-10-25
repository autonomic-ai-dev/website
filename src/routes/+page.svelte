<script lang="ts">
  import {
    Brain,
    Layers,
    Activity,
    GitBranch,
    Terminal,
    Copy,
    Check,
    ArrowRight,
    ShieldCheck,
    Zap,
    ExternalLink,
    Lock,
    Book,
    Folder,
    CheckCircle2
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
  <div class="p-3.5 rounded-2xl bg-[#0d1117]/90 border border-cyan-500/25 font-mono text-xs flex flex-wrap items-center justify-between gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl">
    <div class="flex items-center gap-3">
      <a 
        href="https://autonomic-ai.openstatus.dev" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="flex items-center gap-2 group cursor-pointer"
      >
        <span class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-white font-bold tracking-wider uppercase text-[11px] group-hover:text-cyan-300 transition-colors">AUTONOMIC::STATUS</span>
      </a>
      <a 
        href="https://autonomic-ai.openstatus.dev" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold text-[10px] hover:bg-emerald-500/25 transition-colors flex items-center gap-1"
      >
        <span>LIVE (OPENSTATUS)</span>
        <ExternalLink size={10} />
      </a>
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
<section class="relative pt-16 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
  <!-- Glowing Pill Tag -->
  <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161b22] border border-cyan-500/30 text-xs font-mono font-medium text-cyan-300 mb-8 shadow-[0_0_16px_rgba(0,242,254,0.15)]">
    <Zap size={14} class="text-cyan-400" />
    <span>⚡ Autonomic 2.0 — Dual-Component Architecture</span>
  </div>
  
  <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] font-sans">
    Autonomous AI Agents Built for <br/>
    <span class="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(99,102,241,0.4)]">
      Real Software Engineering
    </span>
  </h1>
  
  <p class="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mb-10 leading-relaxed font-sans">
    Replace fragile prompt chaining with token-bounded MCP routing, durable vector memory (<code class="text-indigo-400">agent-brain</code>), declarative YAML DAG execution (<code class="text-cyan-400">agent-spine</code>), and strict runtime verification (<code class="text-emerald-400">.verify/</code>).
  </p>

  <!-- Dual Action Buttons -->
  <div class="flex flex-wrap items-center justify-center gap-4 mb-12">
    <a 
      href="/docs/installation" 
      class="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-[0_0_24px_rgba(99,102,241,0.4)] hover:shadow-[0_0_32px_rgba(6,182,212,0.6)] hover:brightness-110 transition-all flex items-center gap-2 group"
    >
      <span>Start Building Free</span>
      <ArrowRight size={16} class="group-hover:translate-x-1 transition-transform" />
    </a>
    <a 
      href="/docs" 
      class="px-6 py-3 rounded-xl font-semibold text-sm bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/30 text-slate-200 transition-all flex items-center gap-2"
    >
      <Book size={16} class="text-cyan-400" />
      <span>Read Documentation</span>
    </a>
    <a 
      href="https://github.com/autonomic-ai-dev/agent-registry" 
      target="_blank" 
      rel="noopener noreferrer" 
      class="px-6 py-3 rounded-xl font-semibold text-sm bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-slate-200 transition-all flex items-center gap-2"
    >
      <GitBranch size={16} class="text-indigo-400" />
      <span>agstack Registry</span>
    </a>
  </div>

  <!-- Interactive Quickstart Terminal Box -->
  <div class="w-full max-w-2xl bg-[#080b10] border border-white/[0.1] rounded-2xl overflow-hidden font-mono shadow-[0_12px_40px_rgba(0,0,0,0.6)] mb-14 text-left">
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

  <!-- Live Terminal Mockup Centerpiece -->
  <div class="w-full max-w-4xl rounded-2xl border border-cyan-500/30 bg-[#0d1117]/90 shadow-[0_0_50px_rgba(6,182,212,0.12)] p-5 text-left font-mono text-xs overflow-hidden backdrop-blur-xl">
    <div class="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08] text-slate-400">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-rose-500/80"></span>
        <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
        <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
        <span class="ml-2 text-slate-300 font-bold">autonomic-console // live-execution</span>
      </div>
      <div class="flex items-center gap-2 text-[10px]">
        <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">TESTS: 100% PASS</span>
        <span class="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">ROUTING: BOUNDED</span>
      </div>
    </div>

    <div class="space-y-2 text-slate-300 leading-relaxed overflow-x-auto">
      <div>
        <span class="text-indigo-400 font-bold">❯ agent-brain route_task</span> 
        <span class="text-slate-400">--user-message "Implement Stripe webhook idempotency" --cwd .</span>
      </div>
      <div class="text-slate-400 pl-4 border-l-2 border-indigo-500/40">
        <span class="text-emerald-400">✔</span> Scored 18 candidate skills &amp; 3 memory records under token ceiling (472/500 tokens).<br/>
        <span class="text-cyan-300">↳ Mounted:</span> @agstack/verification, @agstack/boundary-discipline, @agstack/immutability-first.
      </div>
      <div class="pt-2">
        <span class="text-cyan-400 font-bold">❯ agent-spine run</span> 
        <span class="text-slate-400">--workflow engineering-safety</span>
      </div>
      <div class="text-slate-400 pl-4 border-l-2 border-cyan-500/40 space-y-1">
        <div><span class="text-emerald-400">✔</span> [1/4] Lint &amp; AST Analysis: <span class="text-slate-200">PASS (0 slop comments)</span></div>
        <div><span class="text-emerald-400">✔</span> [2/4] Unit &amp; Regression Tests: <span class="text-slate-200">PASS (14 assertions verified)</span></div>
        <div><span class="text-emerald-400">✔</span> [3/4] Milestone Approval Gate: <span class="text-slate-200">APPROVED via signed token</span></div>
        <div><span class="text-emerald-400">✔</span> [4/4] Deterministic Sandbox (.verify/): <span class="text-emerald-400 font-semibold">100% CLEAN (exit 0)</span></div>
      </div>
    </div>
  </div>
</section>

<!-- Dual-Engine Architecture Bento Grid -->
<section id="ecosystem" class="py-20 px-6 max-w-7xl mx-auto">
  <div class="mb-14 text-center max-w-2xl mx-auto">
    <div class="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2">// Architecture Topology</div>
    <h2 class="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Two Components, One Job Each</h2>
    <p class="text-slate-400 text-sm leading-relaxed">
      Deconstructed, specialized system modules replacing fragile, unguided LLM loops with disciplined engineering processes.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Card 1: agent-brain (Span 7) -->
    <div 
      use:spotlight
      use:tilt={{ max: 5, scale: 1.01 }}
      class="md:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0d1117]/90 backdrop-blur-xl p-7 hover:border-cyan-500/40 transition-all duration-300 relative group overflow-hidden shadow-xl"
    >
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Brain size={22} />
          </div>
          <div>
            <h3 class="text-lg font-bold text-white font-mono">agent-brain</h3>
            <p class="text-xs font-mono text-cyan-400">Token-Bounded MCP Router &amp; Vector Memory</p>
          </div>
        </div>
        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
          &lt;0.8ms RTT
        </span>
      </div>

      <p class="text-slate-300 text-xs leading-relaxed mb-6 font-sans">
        Strict MCP tool routing prevents token window explosion. Cross-session context injection dynamically evaluates repository trees before loading AST tokens into editor models.
      </p>

      <div class="rounded-xl border border-white/5 bg-[#080b10] p-4 font-mono text-xs">
        <div class="flex items-center justify-between text-[11px] text-slate-400 pb-3 mb-3 border-b border-white/5">
          <span>MCP Protocol Bus</span>
          <span class="text-cyan-400">Bounded Context: 8k Tokens</span>
        </div>
        <div class="grid grid-cols-3 gap-2.5 text-center">
          <div class="p-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300 flex flex-col items-center gap-1">
            <Zap size={16} class="text-cyan-400" />
            <span class="text-[11px] font-semibold">Turn Router</span>
            <span class="text-[9px] text-slate-400">Strict AST Gate</span>
          </div>
          <div class="p-2.5 rounded-lg bg-slate-900/70 border border-white/5 text-slate-300 flex flex-col items-center gap-1">
            <Folder size={16} class="text-indigo-400" />
            <span class="text-[11px] font-semibold">Vector Store</span>
            <span class="text-[9px] text-slate-400">HNSW Graph</span>
          </div>
          <div class="p-2.5 rounded-lg bg-slate-900/70 border border-white/5 text-slate-300 flex flex-col items-center gap-1">
            <Lock size={16} class="text-emerald-400" />
            <span class="text-[11px] font-semibold">Tool Fence</span>
            <span class="text-[9px] text-slate-400">Sandbox Guard</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 2: agent-spine (Span 5) -->
    <div 
      use:spotlight
      use:tilt={{ max: 5, scale: 1.01 }}
      class="md:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0d1117]/90 backdrop-blur-xl p-7 hover:border-indigo-500/40 transition-all duration-300 relative group overflow-hidden shadow-xl"
    >
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Layers size={22} />
          </div>
          <div>
            <h3 class="text-lg font-bold text-white font-mono">agent-spine</h3>
            <p class="text-xs font-mono text-indigo-400">Declarative YAML DAG Engine</p>
          </div>
        </div>
        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
          &lt;1.2ms
        </span>
      </div>

      <p class="text-slate-300 text-xs leading-relaxed mb-6 font-sans">
        State machine engine ensuring step-by-step determinism. Eliminates unguided autonomous drift with hard human approval gates and immutable checkpoints.
      </p>

      <div class="rounded-xl border border-white/5 bg-[#080b10] p-3.5 space-y-2 font-mono text-xs">
        <div class="flex items-center gap-2 text-slate-300">
          <span class="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px]">1</span>
          <span>Plan &amp; Architecture</span>
          <span class="ml-auto text-emerald-400 text-[10px]">VERIFIED</span>
        </div>
        <div class="flex items-center gap-2 text-slate-300">
          <span class="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px]">2</span>
          <span>Code &amp; AST Invariants</span>
          <span class="ml-auto text-emerald-400 text-[10px]">VERIFIED</span>
        </div>
        <div class="flex items-center gap-2 text-cyan-300">
          <span class="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-[10px] animate-pulse">3</span>
          <span>.verify/ Sandbox Execution</span>
          <span class="ml-auto text-cyan-400 text-[10px]">RUNNING</span>
        </div>
        <div class="flex items-center gap-2 text-slate-500">
          <span class="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px]">4</span>
          <span>Human Approval Gate</span>
          <span class="ml-auto text-slate-500 text-[10px]">QUEUED</span>
        </div>
      </div>
    </div>

    <!-- Card 3: agstack SDLC Operating System (Span 6) -->
    <div 
      use:spotlight
      class="md:col-span-6 rounded-2xl border border-white/[0.08] bg-[#0d1117]/90 backdrop-blur-xl p-7 hover:border-cyan-500/30 transition-all duration-300 shadow-xl"
    >
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Terminal size={20} />
        </div>
        <div>
          <h3 class="text-lg font-bold text-white font-mono">agstack SDLC Engine</h3>
          <p class="text-xs font-mono text-cyan-400">25+ Backend &amp; DevOps Playbooks</p>
        </div>
      </div>

      <p class="text-slate-300 text-xs leading-relaxed mb-6 font-sans">
        Transforms agent execution with disciplined playbooks: Minimalist Entrepreneurship, Garry Tan executive review suite, zero AI comment slop, and verification separation.
      </p>

      <div class="rounded-xl border border-white/5 bg-[#080b10] p-3.5 font-mono text-xs text-slate-400 space-y-1.5">
        <div class="text-cyan-400 flex items-center gap-1.5 font-semibold">
          <Folder size={14} /> .verify/
        </div>
        <div class="pl-4 text-slate-300 flex items-center gap-1.5">
          <CheckCircle2 size={12} class="text-cyan-400" /> spec.invariants.md
        </div>
        <div class="pl-4 text-slate-300 flex items-center gap-1.5">
          <CheckCircle2 size={12} class="text-cyan-400" /> regression-matrix.yaml
        </div>
        <div class="pl-4 text-emerald-400 flex items-center gap-1.5 font-semibold">
          <ShieldCheck size={12} /> cryptographic_proof.sig
        </div>
      </div>
    </div>

    <!-- Card 4: Strict Verification Harness (.verify/) (Span 6) -->
    <div 
      use:spotlight
      class="md:col-span-6 rounded-2xl border border-white/[0.08] bg-[#0d1117]/90 backdrop-blur-xl p-7 hover:border-emerald-500/30 transition-all duration-300 shadow-xl"
    >
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h3 class="text-lg font-bold text-white font-mono">Strict Verification (.verify/)</h3>
          <p class="text-xs font-mono text-emerald-400">Allowlisted Phased Runner &amp; Proof Artifacts</p>
        </div>
      </div>

      <p class="text-slate-300 text-xs leading-relaxed mb-6 font-sans">
        Strict root separation keeps input fixtures read-only while all generated test harnesses and logs output under <code class="text-cyan-300">.verify/</code>. Zero permission asking: every modification is verified before completion.
      </p>

      <div class="grid grid-cols-2 gap-3 font-mono">
        <div class="rounded-xl border border-white/5 bg-[#080b10] p-3.5">
          <span class="text-slate-500 text-[10px] block mb-1">VERIFICATION PASS RATE</span>
          <span class="text-2xl font-bold text-emerald-400">100%</span>
          <span class="text-[10px] text-slate-400 block mt-1">Exit code 0 mandatory</span>
        </div>
        <div class="rounded-xl border border-white/5 bg-[#080b10] p-3.5">
          <span class="text-slate-500 text-[10px] block mb-1">PROOF ARTIFACT SURVIVAL</span>
          <span class="text-2xl font-bold text-cyan-400">Deterministic</span>
          <span class="text-[10px] text-slate-400 block mt-1">Self-contained evidence</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SDLC Invariants Section -->
<section id="features" class="py-20 px-6 max-w-7xl mx-auto border-t border-white/[0.08]">
  <div use:inview class="mb-14 text-center reveal-hidden">
    <div class="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2">// Engineering Discipline</div>
    <h2 class="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">The agstack Invariants</h2>
    <p class="text-slate-400 max-w-2xl mx-auto text-sm font-sans">Continuous, self-aware development policies designed for zero comment slop, type safety, and verifiable outcomes.</p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <!-- Invariant 1 -->
    <div class="p-7 rounded-2xl bg-[#0d1117]/85 border border-white/[0.08] hover:border-cyan-500/30 transition-all shadow-xl">
      <div class="flex items-center justify-between mb-5">
        <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center">
          <Brain size={24} />
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161b22] text-slate-400 border border-white/[0.08]">
          agent-brain
        </span>
      </div>
      <h3 class="text-xl font-bold text-white mb-2 font-mono">Vector Memory &amp; Semantic Routing</h3>
      <p class="text-slate-400 text-xs leading-relaxed font-sans">agent-brain enforces strict read gates and injects durable facts, verified recipes, and relevant skills under strict token bounds into every coding turn.</p>
    </div>

    <!-- Invariant 2 -->
    <div class="p-7 rounded-2xl bg-[#0d1117]/85 border border-white/[0.08] hover:border-emerald-500/30 transition-all shadow-xl">
      <div class="flex items-center justify-between mb-5">
        <div class="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center">
          <Layers size={24} />
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161b22] text-slate-400 border border-white/[0.08]">
          agent-spine
        </span>
      </div>
      <h3 class="text-xl font-bold text-white mb-2 font-mono">Deterministic DAG Workflows</h3>
      <p class="text-slate-400 text-xs leading-relaxed font-sans">agent-spine structures execution through declarative YAML pipelines, providing parallel fan-out, immutable execution snapshots, and replayable step state.</p>
    </div>

    <!-- Invariant 3 -->
    <div class="p-7 rounded-2xl bg-[#0d1117]/85 border border-white/[0.08] hover:border-indigo-500/30 transition-all shadow-xl">
      <div class="flex items-center justify-between mb-5">
        <div class="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 flex items-center justify-center">
          <Zap size={24} />
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161b22] text-slate-400 border border-white/[0.08]">
          agent-brain
        </span>
      </div>
      <h3 class="text-xl font-bold text-white mb-2 font-mono">Token Headroom &amp; Read Gates</h3>
      <p class="text-slate-400 text-xs leading-relaxed font-sans">Hard read gates block prompt pollution. agent-brain scores each candidate across skills, memory, and rules to keep context reads strictly budgeted.</p>
    </div>

    <!-- Invariant 4 -->
    <div class="p-7 rounded-2xl bg-[#0d1117]/85 border border-white/[0.08] hover:border-amber-500/30 transition-all shadow-xl">
      <div class="flex items-center justify-between mb-5">
        <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center">
          <ShieldCheck size={24} />
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161b22] text-slate-400 border border-white/[0.08]">
          agent-spine
        </span>
      </div>
      <h3 class="text-xl font-bold text-white mb-2 font-mono">Approval Gates &amp; Verification</h3>
      <p class="text-slate-400 text-xs leading-relaxed font-sans">Crucial milestones pause for approval before destructive actions, while deterministic .verify/ test suites attest 100% clean passes before landing.</p>
    </div>
  </div>
</section>
