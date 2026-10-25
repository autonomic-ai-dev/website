<script lang="ts">
  import {
    Terminal,
    Search,
    Copy,
    Check,
    Layers,
    ArrowRight,
    Workflow,
    Shield,
    Sparkles,
    Cpu,
    GitBranch,
    CheckCircle2,
    Lock,
    ExternalLink
  } from "lucide-svelte";

  let searchQuery = $state("");
  let selectedCategory = $state<string>("all");
  let activeTerminalTab = $state<"cli" | "yaml" | "seal">("cli");
  let copiedId = $state<string | null>(null);

  interface WorkflowItem {
    id: string;
    title: string;
    version: string;
    category: "Engineering SDLC" | "Startup Playbook" | "Verification & Design" | "Debugging & Hygiene";
    engine: "agent-spine" | "agent-brain" | "Dual-Engine";
    statusBadge: string;
    description: string;
    stages: string[];
    tags: string[];
    command: string;
    latency: string;
    seal: string;
    tokenBound: string;
    featured?: boolean;
    yaml?: string;
  }

  const workflows: WorkflowItem[] = [
    {
      id: "stacked-pr",
      title: "stacked-pr",
      version: "v1.4.0",
      category: "Engineering SDLC",
      engine: "agent-spine",
      statusBadge: "Verified DAG",
      featured: true,
      description: "Multi-phase feature implementation with git worktrees, incremental compile checks, and branch verification.",
      stages: ["Branch Worktree", "AST Compile", "Smoke Tests", "Sealed PR"],
      tags: ["#agent-spine", "#git", "#isolated-branch", "#auto-verify"],
      command: "agent-spine run --workflow stacked-pr",
      latency: "~42s",
      seal: "sha256:9f8a...31c",
      tokenBound: "12k",
      yaml: `name: stacked-pr
version: 1.4.0
description: Multi-phase feature implementation with git worktrees
steps:
  - id: branch-worktree
    command: git worktree add ../feature-branch HEAD
    allow_failure: false
  - id: ast-compile
    command: bun run check && cargo check --quiet
    allow_failure: false
  - id: smoke-tests
    command: agent-brain verify -- bun test
    allow_failure: false
  - id: sealed-pr
    command: agent-spine record-receipt --seal-type sha256`
    },
    {
      id: "minimalist-entrepreneur",
      title: "minimalist-entrepreneur",
      version: "v1.0.0",
      category: "Startup Playbook",
      engine: "agent-spine",
      statusBadge: "Lean MVP",
      description: "Automated MVP validation, customer interview synthesis, and landing page scaffolding based on Sahil Lavingia's playbook.",
      stages: ["Problem Hypo", "Market Signals", "Landing Scaffold", "Stripe Hook"],
      tags: ["#market-fit", "#MVP", "#lean"],
      command: "agent-spine run --workflow minimalist-entrepreneur",
      latency: "~1m 15s",
      seal: "sha256:e8f9...4b2",
      tokenBound: "24k"
    },
    {
      id: "gstack",
      title: "gstack",
      version: "v2.0.0",
      category: "Engineering SDLC",
      engine: "agent-spine",
      statusBadge: "CEO Audit",
      description: "Rigorous code review, product architecture audit, and design critique simulating Garry Tan's startup engineering evaluation.",
      stages: ["Repo Scan", "Architectural Audit", "Garry Tan Review", "Action Plan"],
      tags: ["#review", "#audit", "#architecture"],
      command: "agent-spine run --workflow gstack",
      latency: "~25s",
      seal: "sha256:9a32...8b9",
      tokenBound: "18k"
    },
    {
      id: "pixel-perfect-ui",
      title: "pixel-perfect-ui",
      version: "v1.2.0",
      category: "Verification & Design",
      engine: "Dual-Engine",
      statusBadge: "Visual QA",
      description: "Headless browser snapshot diffing against Stitch designs with strict tolerance thresholds and zero visual regression.",
      stages: ["Headless Capture", "Stitch API Export", "Tolerance Diff", "Visual Pass"],
      tags: ["#agent-brain", "#agent-spine", "#headless-diff"],
      command: "agent-spine run --workflow pixel-perfect-ui",
      latency: "~35s",
      seal: "sha256:3d4e...11f",
      tokenBound: "8k"
    },
    {
      id: "root-cause-fix",
      title: "root-cause-fix",
      version: "v1.1.0",
      category: "Debugging & Hygiene",
      engine: "agent-brain",
      statusBadge: "Zero Burn",
      description: "Traceback isolation, AST mutation testing, and regression test sealing to prevent infinite retry burn loops.",
      stages: ["Traceback Isolate", "AST Mutation", "Falsification Test", "Seal Fix"],
      tags: ["#diagnostics", "#AST", "#anti-burn"],
      command: "agent-spine run --workflow root-cause-fix",
      latency: "~18s",
      seal: "sha256:0a2b...55d",
      tokenBound: "6k"
    }
  ];

  let filteredWorkflows = $derived.by(() => {
    let list = workflows;
    if (selectedCategory !== "all") {
      list = list.filter(w => w.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(w => 
        w.title.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.tags.some(t => t.toLowerCase().includes(q)) ||
        w.command.toLowerCase().includes(q)
      );
    }
    return list;
  });

  function copyText(id: string, text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      copiedId = id;
      setTimeout(() => {
        if (copiedId === id) copiedId = null;
      }, 2000);
    }
  }
</script>

<svelte:head>
  <title>Workflows &amp; Skill Packs Registry — Autonomic AI</title>
  <meta name="description" content="Declarative DAG state machines executed by agent-spine with milestone approvals, cryptographic SHA-256 seals, and zero-human-block determinism." />
  <meta property="og:title" content="Workflows &amp; Skill Packs Registry — Autonomic AI" />
  <meta property="og:description" content="Explore deterministic multi-step engineering workflows and curated skill packs for the dual-engine architecture." />
  <link rel="canonical" href="https://autonomic-ai.dev/workflows" />
</svelte:head>

<div class="min-h-screen text-slate-100 font-body selection:bg-cyan-500/25 selection:text-cyan-300">
  
  <!-- ==================== HERO SECTION ==================== -->
  <section class="relative pt-8 pb-14 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
      
      <!-- Top Pill Badge -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-6 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span>⚡ Deterministic Multi-Step Workflows</span>
      </div>

      <!-- Main Headline -->
      <h1 class="font-headline font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-4xl leading-[1.15]">
        Workflows &amp; <span class="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Skill Packs</span>
      </h1>

      <!-- Subtitle -->
      <p class="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
        Declarative DAG state machines executed by <code class="font-mono text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-cyan-500/20 text-sm">agent-spine</code> with milestone approvals, cryptographic SHA-256 seals, and zero-human-block determinism.
      </p>

      <!-- Terminal Runner Cockpit Box -->
      <div class="mt-8 w-full max-w-2xl bg-slate-900/90 border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all hover:border-cyan-500/30 text-left">
        <!-- Terminal Header Bar -->
        <div class="flex items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-white/[0.06]">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span class="ml-2 font-mono text-xs text-slate-400">bash • spine-daemon-session</span>
          </div>
          <!-- Terminal Tabs -->
          <div class="flex items-center gap-1 font-mono text-[11px]">
            <button 
              onclick={() => activeTerminalTab = 'cli'} 
              class="px-2.5 py-0.5 rounded transition {activeTerminalTab === 'cli' ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'}"
            >
              CLI invocation
            </button>
            <button 
              onclick={() => activeTerminalTab = 'yaml'} 
              class="px-2.5 py-0.5 rounded transition {activeTerminalTab === 'yaml' ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'}"
            >
              YAML Spec
            </button>
            <button 
              onclick={() => activeTerminalTab = 'seal'} 
              class="px-2.5 py-0.5 rounded transition {activeTerminalTab === 'seal' ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'}"
            >
              Verification Seal
            </button>
          </div>
        </div>

        <!-- Terminal Body -->
        <div class="p-4 sm:p-5 font-mono text-xs sm:text-sm bg-[#08080a]">
          {#if activeTerminalTab === 'cli'}
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-2 overflow-x-auto text-slate-300">
                <span class="text-cyan-400 select-none">$</span>
                <span class="text-indigo-400 font-semibold">agent-spine</span>
                <span class="text-slate-400">run</span>
                <span class="text-cyan-300">--workflow</span>
                <span class="text-emerald-400">stacked-pr</span>
                <span class="text-slate-500">--verify-rules</span>
                <span class="text-slate-400">.invariants</span>
              </div>
              <button 
                onclick={() => copyText('hero-cmd', 'agent-spine run --workflow stacked-pr --verify-rules .invariants')}
                class="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition"
                title="Copy Command"
              >
                {#if copiedId === 'hero-cmd'}
                  <Check size={16} class="text-emerald-400" />
                {:else}
                  <Copy size={16} />
                {/if}
              </button>
            </div>
          {:else if activeTerminalTab === 'yaml'}
            <div class="text-slate-300 space-y-1 text-xs">
              <span class="text-slate-500"># Declarative DAG Orchestration</span><br/>
              <span class="text-cyan-400">name:</span> stacked-pr<br/>
              <span class="text-cyan-400">version:</span> 1.4.0<br/>
              <span class="text-cyan-400">milestones:</span><br/>
              &nbsp;&nbsp;- <span class="text-indigo-300">id:</span> worktree-isolate<br/>
              &nbsp;&nbsp;- <span class="text-indigo-300">id:</span> ast-compile-gate<br/>
              &nbsp;&nbsp;- <span class="text-indigo-300">id:</span> verify-proof-sealing
            </div>
          {:else}
            <div class="text-slate-300 space-y-1 text-xs">
              <span class="text-slate-500"># Tamper-Proof Cryptographic Receipt</span><br/>
              <span class="text-emerald-400">status:</span> SEALED_INVARIANT_VERIFIED<br/>
              <span class="text-cyan-400">hash:</span> sha256:9f8a31c5040e3b624a492161dc2581691361<br/>
              <span class="text-indigo-300">engine:</span> agent-spine v1.0.0-rc2 (ARM64 Apple Silicon)
            </div>
          {/if}
        </div>
      </div>

      <!-- Feature Guarantee Pillars -->
      <div class="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>Production Pipelines</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          <span>DAG State Transitions</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Zero-Drift Guarantee</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
          <span>SHA-256 Sealed</span>
        </div>
      </div>

    </div>
  </section>

  <!-- ==================== FILTER & SEARCH BAR ==================== -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
    <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-2 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-md">
      
      <!-- Filter Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 font-mono text-xs scrollbar-none">
        <button 
          onclick={() => selectedCategory = 'all'}
          class="px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap {selectedCategory === 'all' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}"
        >
          All Workflows ({workflows.length})
        </button>
        <button 
          onclick={() => selectedCategory = 'Engineering SDLC'}
          class="px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap {selectedCategory === 'Engineering SDLC' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}"
        >
          Engineering SDLC
        </button>
        <button 
          onclick={() => selectedCategory = 'Startup Playbook'}
          class="px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap {selectedCategory === 'Startup Playbook' ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}"
        >
          Startup Playbook
        </button>
        <button 
          onclick={() => selectedCategory = 'Verification & Design'}
          class="px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap {selectedCategory === 'Verification & Design' ? 'bg-teal-950/80 text-teal-300 border border-teal-500/30 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}"
        >
          Verification &amp; Design
        </button>
        <button 
          onclick={() => selectedCategory = 'Debugging & Hygiene'}
          class="px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap {selectedCategory === 'Debugging & Hygiene' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}"
        >
          Debugging &amp; Hygiene
        </button>
      </div>

      <!-- Live Search Box -->
      <div class="relative w-full lg:w-72 shrink-0">
        <Search size={15} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input 
          type="text" 
          bind:value={searchQuery}
          placeholder="Filter workflows or tags..."
          class="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
        />
        {#if searchQuery}
          <button 
            onclick={() => searchQuery = ""}
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-mono"
          >
            ✕
          </button>
        {/if}
      </div>

    </div>
  </section>

  <!-- ==================== BENTO GRID OF WORKFLOWS ==================== -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {#each filteredWorkflows as item}
        <div class="group relative rounded-2xl bg-slate-900/40 border border-white/[0.08] p-6 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] {item.featured ? 'md:col-span-2' : ''}">
          <div class="space-y-4">
            
            <!-- Card Header & Badges -->
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-xs font-mono font-medium text-cyan-300">
                  {item.category}
                </span>
                <span class="text-xs font-mono text-slate-500">•</span>
                <span class="px-2 py-0.5 rounded bg-slate-950 border border-white/[0.06] text-[11px] font-mono text-slate-300">
                  {item.engine}
                </span>
              </div>
              <span class="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-2 py-0.5 rounded">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {item.statusBadge}
              </span>
            </div>

            <!-- Title & Description -->
            <div>
              <h3 class="text-xl font-headline font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                {item.title}
                <span class="text-xs font-mono font-normal text-slate-500">{item.version}</span>
              </h3>
              <p class="mt-2 text-sm text-slate-400 leading-relaxed font-body">
                {item.description}
              </p>
            </div>

            <!-- Mini DAG Step Flow Visualizer -->
            <div class="p-3.5 rounded-xl bg-slate-950/80 border border-white/[0.06]">
              <div class="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>DAG Execution Sequence</span>
                <span class="text-cyan-400">{item.stages.length} Stages</span>
              </div>
              <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
                {#each item.stages as stage, idx}
                  <div class="px-2.5 py-1 rounded bg-slate-900 border border-white/[0.08] text-slate-300 whitespace-nowrap {idx === item.stages.length - 1 ? 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]' : ''}">
                    {stage}
                  </div>
                  {#if idx < item.stages.length - 1}
                    <ArrowRight size={13} class="text-slate-600 shrink-0" />
                  {/if}
                {/each}
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              {#each item.tags as tag}
                <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-white/[0.06] text-slate-400">
                  {tag}
                </span>
              {/each}
            </div>

          </div>

          <!-- Card Footer Terminal & Metadata -->
          <div class="mt-6 pt-4 border-t border-white/[0.06] space-y-3">
            <div class="flex items-center justify-between p-2 rounded-xl bg-slate-950/90 border border-white/[0.08] font-mono text-xs">
              <div class="truncate text-slate-300">
                <span class="text-cyan-400">$</span> {item.command}
              </div>
              <button 
                onclick={() => copyText(item.id, item.command)}
                class="shrink-0 ml-2 p-1 text-slate-400 hover:text-cyan-400 transition"
                title="Copy CLI Command"
              >
                {#if copiedId === item.id}
                  <Check size={14} class="text-emerald-400" />
                {:else}
                  <Copy size={14} />
                {/if}
              </button>
            </div>
            
            <div class="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
              <span>Latency: <strong class="text-white">{item.latency}</strong></span>
              <span>Seal: <code class="text-indigo-400 font-mono">{item.seal}</code></span>
              <span>Token Bound: <strong class="text-cyan-300">{item.tokenBound}</strong></span>
            </div>
          </div>

        </div>
      {/each}

    </div>
  </main>

  <!-- ==================== DUAL-ENGINE INVARIANT ARCHITECTURE BANNER ==================== -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20">
    <div class="relative rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-white/[0.08] p-8 sm:p-12 overflow-hidden shadow-2xl">
      
      <!-- Inner Glow Blobs -->
      <div class="absolute -top-24 -left-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Banner Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/[0.08] relative z-10">
        <div>
          <div class="flex items-center gap-2 font-mono text-xs text-cyan-400 tracking-wider uppercase mb-1.5">
            <Lock size={13} />
            <span>System Invariant Blueprint</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-headline font-bold text-white tracking-tight">
            The Dual-Engine SDLC Invariant Guarantee
          </h2>
        </div>
        <div class="px-3 py-1 rounded-full bg-slate-900 border border-white/[0.08] text-xs font-mono text-slate-300">
          STRICT DETERMINISM
        </div>
      </div>

      <!-- Balanced Engine Columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 relative z-10">
        
        <!-- Engine 1: agent-brain -->
        <div class="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 relative group hover:border-cyan-500/40 transition">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2 font-mono">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
              <span class="text-white font-bold text-sm">agent-brain</span>
            </div>
            <span class="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">Cognitive Layer</span>
          </div>
          <h4 class="text-base font-headline font-bold text-white mb-2">Cognitive Routing &amp; Skill Synthesis</h4>
          <p class="text-xs font-body text-slate-400 leading-relaxed mb-4">
            Token-bounded MCP router, durable vector memory, dynamic AST context bounds, and cross-session semantic search. Synthesizes task goals into bounded executable definitions.
          </p>
          <div class="flex flex-wrap gap-2 text-[10px] font-mono text-cyan-300">
            <span class="px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/20">MCP 2.0 PROTOCOL</span>
            <span class="px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/20">TOKEN BOUNDED</span>
            <span class="px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/20">AST BOUNDARIES</span>
          </div>
        </div>

        <!-- Engine 2: agent-spine -->
        <div class="p-6 rounded-2xl bg-slate-950/60 border border-indigo-500/20 relative group hover:border-indigo-500/40 transition">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2 font-mono">
              <span class="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
              <span class="text-white font-bold text-sm">agent-spine</span>
            </div>
            <span class="text-[10px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">Execution Layer</span>
          </div>
          <h4 class="text-base font-headline font-bold text-white mb-2">Deterministic Execution Engine</h4>
          <p class="text-xs font-body text-slate-400 leading-relaxed mb-4">
            Milestone approval gates, sandboxed git worktrees, immutable state transitions, and zero-human-block execution. State changes execute through mathematical runtime verification.
          </p>
          <div class="flex flex-wrap gap-2 text-[10px] font-mono text-indigo-300">
            <span class="px-2 py-0.5 rounded bg-slate-900 border border-indigo-500/20">MATHEMATICAL DAGS</span>
            <span class="px-2 py-0.5 rounded bg-slate-900 border border-indigo-500/20">SEALED RECEIPTS</span>
            <span class="px-2 py-0.5 rounded bg-slate-900 border border-indigo-500/20">STRICT REPRODUCIBILITY</span>
          </div>
        </div>

      </div>

      <!-- Sealed Receipt Banner Bottom -->
      <div class="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-500 gap-3 relative z-10">
        <div class="flex items-center gap-2 text-cyan-400">
          <Shield size={14} />
          <span>Cryptographically Sealed Receipt: SHA-256 verified • Autonomic System Engine</span>
        </div>
        <div class="text-[11px] text-slate-500">
          Pinned to v1.0.0-rc2 Runtime
        </div>
      </div>

    </div>
  </section>

</div>
