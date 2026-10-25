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
    CheckCircle2,
    Database,
    FolderOpen,
    FileText,
    CheckSquare,
    Fingerprint,
    Shield
  } from "lucide-svelte";

  let activeTab = $state<'brew' | 'spine' | 'brain' | 'cargo'>('brew');
  let copied = $state(false);

  const commandSnippets: Record<string, { commands: string[]; notes: string[] }> = {
    brew: {
      commands: [
        "brew tap autonomic-ai-dev/tap",
        "brew install agent-brain agent-spine",
        "agent-brain doctor"
      ],
      notes: [
        "✔ Tapped autonomic-ai-dev/tap (Formulae: agent-brain, agent-spine)",
        "✔ Installed pre-compiled universal binaries",
        "✔ Doctor: binary, MCP schema, codesign, and hooks verified clean"
      ]
    },
    spine: {
      commands: [
        "agent-spine init --with build-and-test",
        "agent-spine validate .autonomic/state/spine/build-and-test.yaml",
        "agent-spine run .autonomic/state/spine/build-and-test.yaml"
      ],
      notes: [
        "✔ Scaffolded workflow: build-and-test.yaml with state snapshotting",
        "✔ Validated DAG node dependencies, step transitions, and approval gates",
        "✔ Execution complete: all nodes sealed with deterministic state"
      ]
    },
    brain: {
      commands: [
        "agent-brain install --editor cursor",
        "agent-brain package add @testing",
        "agent-brain briefing"
      ],
      notes: [
        "✔ Configured MCP stdio server + editor read-gates in Cursor",
        "✔ Reindexed curated @testing playbooks into local vector store",
        "✔ Route briefing: active token budget 4,120 / 32,000 tokens"
      ]
    },
    cargo: {
      commands: [
        "cargo install --git https://github.com/autonomic-ai-dev/agent-brain agent-brain",
        "cargo install --git https://github.com/autonomic-ai-dev/agent-spine agent-spine",
        "agent-spine doctor"
      ],
      notes: [
        "✔ Compiled agent-brain from source with FastEmbed & HNSW indexing",
        "✔ Compiled agent-spine state machine engine and workflow parser",
        "✔ Environment verified: ready for autonomous agent execution"
      ]
    }
  };

  async function copyCommand() {
    try {
      const text = commandSnippets[activeTab].commands.join("\n");
      await navigator.clipboard.writeText(text);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    }
  }
</script>

<svelte:head>
  <title>Autonomic AI — Autonomous AI Agent Engineering OS</title>
</svelte:head>

<main class="relative z-10 pb-24">
  <!-- HERO SECTION -->
  <section class="max-w-6xl mx-auto px-6 text-center pt-8 pb-16">
    <!-- Top Pill Tag -->
    <a href="/docs/architecture" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-slate-900/60 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] mb-8 transition-transform hover:scale-105 cursor-pointer">
      <span class="text-amber-400 text-xs leading-none">⚡</span>
      <span class="text-xs font-headline font-medium text-slate-200 tracking-wide">
        Autonomic AI — <span class="text-cyan-400 font-semibold">Production-Grade Agent Architecture</span>
      </span>
      <span class="material-symbols-outlined text-xs text-slate-400">arrow_forward</span>
    </a>

    <!-- Hero Headline -->
    <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-headline max-w-4xl mx-auto leading-[1.1] mb-6 text-white">
      Autonomous AI Agents Built for <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300 drop-shadow-[0_0_35px_rgba(6,182,212,0.3)]">Real Engineering</span>
    </h1>

    <!-- Subtitle -->
    <p class="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-body leading-relaxed mb-10">
      Replace fragile agent prompts with disciplined SDLC playbooks, token-bounded MCP routing, DAG workflows, and strict runtime verification (<span class="font-mono text-cyan-300 text-sm bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20">.verify/</span>).
    </p>

    <!-- Dual Action CTAs -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
      <a class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-headline font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.45)] transition-all duration-200 active:scale-95 group" href="#quickstart">
        <span>Start Building Free</span>
        <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">rocket_launch</span>
      </a>
      <a class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-headline font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-200 active:scale-95" href="/docs/architecture">
        <span class="material-symbols-outlined text-base text-cyan-400">terminal</span>
        <span>View Architecture Spec</span>
      </a>
    </div>

    <!-- Verified Compatible Agent Environments Row -->
    <div class="pt-4 pb-14 border-b border-slate-800/60 max-w-4xl mx-auto">
      <p class="text-xs uppercase font-mono tracking-widest text-slate-500 mb-6 font-semibold">
        Tested and verified across modern coding agent runtimes
      </p>
      <div class="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-80 transition-all duration-300">
        <div class="flex items-center gap-2 text-slate-300 font-headline font-semibold text-sm">
          <span class="material-symbols-outlined text-cyan-400 text-lg">deployed_code</span> ANTIGRAVITY (AGY)
        </div>
        <div class="flex items-center gap-2 text-slate-300 font-headline font-semibold text-sm">
          <span class="material-symbols-outlined text-indigo-400 text-lg">edit_note</span> CURSOR
        </div>
        <div class="flex items-center gap-2 text-slate-300 font-headline font-semibold text-sm">
          <span class="material-symbols-outlined text-teal-400 text-lg">terminal</span> CLAUDE CODE
        </div>
        <div class="flex items-center gap-2 text-slate-300 font-headline font-semibold text-sm">
          <span class="material-symbols-outlined text-cyan-400 text-lg">code</span> GEMINI CLI
        </div>
      </div>
    </div>

    <!-- HERO CENTERPIECE: Framer-Style Developer Console Mockup -->
    <div class="mt-14 max-w-5xl mx-auto rounded-xl border border-cyan-500/30 bg-slate-950/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden text-left ring-1 ring-white/5" id="console">
      <!-- Window Chrome Bar -->
      <div class="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-rose-500/80"></div>
          <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span class="ml-3 text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-xs text-cyan-400">data_object</span>
            autonomic://local-runtime/run/verify-pipeline
          </span>
        </div>
        <div class="flex items-center gap-3 text-xs font-mono">
          <span class="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            LIVE EXEC
          </span>
          <span class="text-slate-400 hidden sm:inline">RAM: 412MB</span>
        </div>
      </div>

      <!-- IDE Main Split Content -->
      <div class="grid grid-cols-1 md:grid-cols-12 min-h-[420px] font-mono text-xs">
        <!-- Left Sidebar: Organ Pipeline Status -->
        <div class="md:col-span-4 p-4 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-950/60 flex flex-col justify-between">
          <div>
            <div class="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>Active Architecture</span>
              <span class="text-cyan-400">VERIFIED</span>
            </div>
            <ul class="space-y-2.5">
              <li class="p-2.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-cyan-400 text-sm">memory</span>
                  <span class="font-medium text-slate-200">agent-brain</span>
                </div>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">Routing</span>
              </li>
              <li class="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between hover:border-slate-700">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-indigo-400 text-sm">account_tree</span>
                  <span class="font-medium text-slate-300">agent-spine</span>
                </div>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">DAG: active</span>
              </li>
              <li class="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between hover:border-slate-700">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-emerald-400 text-sm">policy</span>
                  <span class="font-medium text-slate-300">agstack</span>
                </div>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Policy: Enforced</span>
              </li>
              <li class="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between hover:border-slate-700">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-teal-400 text-sm">verified</span>
                  <span class="font-medium text-slate-300">.verify/</span>
                </div>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">14/14 tests pass</span>
              </li>
            </ul>
          </div>

          <!-- Token Budget Meter in Sidebar -->
          <div class="pt-4 mt-4 border-t border-slate-800/80">
            <div class="flex items-center justify-between text-[11px] mb-1.5">
              <span class="text-slate-400">AST Token Window</span>
              <span class="text-cyan-300 font-semibold">4,120 / 32,000</span>
            </div>
            <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full w-[13%]"></div>
            </div>
            <div class="flex items-center justify-between text-[10px] text-slate-500 mt-2">
              <span>Strict Read Gates: Active</span>
              <span class="text-emerald-400 font-medium">Zero Leakage</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Live Execution Terminal Logs -->
        <div class="md:col-span-8 p-4 bg-slate-950/90 flex flex-col justify-between overflow-x-auto terminal-scrollbar">
          <div class="space-y-1.5 leading-relaxed font-mono">
            <div class="text-slate-500">[14:32:01.002] <span class="text-indigo-400 font-semibold">[agent-spine]</span> Initializing DAG graph: build-and-test.yaml</div>
            <div class="text-slate-500">[14:32:01.120] <span class="text-cyan-400 font-semibold">[agent-brain]</span> Resolving MCP routing table: [git, rust_ast, test_runner]</div>
            <div class="text-slate-400 pl-4 border-l border-slate-800">
              <span class="text-emerald-400">✔</span> Bound schema: <span class="text-slate-200">mcp://protocol.v2/agent-brain</span> (strictly read gated)
            </div>
            <div class="text-slate-500">[14:32:01.440] <span class="text-emerald-400 font-semibold">[agent-brain]</span> Applying token budget gate: 448/500 tokens routed</div>
            <div class="text-slate-400 pl-4 border-l border-slate-800">
              <span class="text-slate-500">Token allocation:</span> 4,120 / 32,000 tokens <span class="text-emerald-400">[Optimal]</span>
            </div>
            <div class="text-slate-500">[14:32:02.050] <span class="text-cyan-400 font-semibold">[agent-spine]</span> Step 01: [Plan] <span class="text-emerald-400">PASSED</span> (220ms)</div>
            <div class="text-slate-500">[14:32:02.290] <span class="text-cyan-400 font-semibold">[agent-spine]</span> Step 02: [Lint &amp; Invariants] <span class="text-emerald-400">PASSED</span> (140ms)</div>
            <div class="text-slate-500">[14:32:02.820] <span class="text-indigo-400 font-semibold">[.verify/]</span> Running independent sandbox verification suite...</div>
            <div class="text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800 my-1">
              <span class="text-emerald-400 font-semibold">SUCCESS:</span> All 14 runtime integration tests verified. Cryptographic artifact sealed: <span class="text-cyan-300">sha256:7f9e8a...</span>
            </div>
            <div class="text-slate-500 flex items-center gap-1 text-[11px] pt-1">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Standby for human approval gate or production merge...</span>
            </div>
          </div>

          <!-- Terminal Footnote Bar -->
          <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-xs text-emerald-400">check_circle</span>
              Boundary isolation: 100% Guaranteed
            </span>
            <span class="font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">SDLC Spec: Invariant-Locked</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION: FEATURE BENTO GRID (THE AUTONOMIC ORGAN SYSTEM) -->
  <section class="max-w-6xl mx-auto px-6 py-20" id="organs">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <div class="inline-flex items-center gap-1 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
        <span class="material-symbols-outlined text-sm">hub</span>
        Modular Architecture of Autonomous Agents
      </div>
      <h2 class="text-3xl sm:text-4xl font-headline font-bold text-white tracking-tight mb-4">
        The Autonomic Architecture
      </h2>
      <p class="text-slate-400 text-sm sm:text-base">
        Deconstructed, specialized system modules replacing generic non-deterministic LLM loops with verified software engineering disciplines.
      </p>
    </div>

    <!-- Bento Grid (4 Cards) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <!-- Card 1: agent-brain (Span 7) -->
      <div class="md:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl p-7 hover:border-cyan-500/40 transition-all duration-300 relative group overflow-hidden">
        <div class="absolute -top-24 -right-24 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all"></div>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <span class="material-symbols-outlined text-xl">neurology</span>
          </div>
          <div>
            <h3 class="text-lg font-headline font-bold text-white">agent-brain</h3>
            <p class="text-xs font-mono text-cyan-400">Token-Bounded MCP Router & Vector Memory</p>
          </div>
        </div>
        <p class="text-slate-400 text-sm leading-relaxed mb-6 font-body">
          Strict MCP tool routing prevents token window explosion. Cross-session context injection dynamically evaluates dependency trees before loading AST tokens.
        </p>

        <!-- Mini Routing Diagram Visualization -->
        <div class="rounded-xl border border-slate-800/80 bg-slate-950/80 p-4 font-mono text-xs">
          <div class="flex items-center justify-between text-[11px] text-slate-500 pb-3 mb-3 border-b border-slate-800">
            <span>MCP Protocol Bus</span>
            <span class="text-cyan-400">Bounded Context: 8k Tokens</span>
          </div>
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300 flex flex-col items-center gap-1">
              <span class="material-symbols-outlined text-base">route</span>
              <span class="text-[11px] font-semibold">Router</span>
              <span class="text-[9px] text-slate-400">Strict AST</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 text-slate-300 flex flex-col items-center gap-1">
              <span class="material-symbols-outlined text-base text-indigo-400">database</span>
              <span class="text-[11px] font-semibold">Vector Store</span>
              <span class="text-[9px] text-slate-400">Hashed Memory</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 text-slate-300 flex flex-col items-center gap-1">
              <span class="material-symbols-outlined text-base text-emerald-400">lock</span>
              <span class="text-[11px] font-semibold">Tool Fence</span>
              <span class="text-[9px] text-slate-400">Sandbox Isolation</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: agent-spine (Span 5) -->
      <div class="md:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl p-7 hover:border-indigo-500/40 transition-all duration-300 relative group overflow-hidden">
        <div class="absolute -top-24 -right-24 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all"></div>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <span class="material-symbols-outlined text-xl">account_tree</span>
          </div>
          <div>
            <h3 class="text-lg font-headline font-bold text-white">agent-spine</h3>
            <p class="text-xs font-mono text-indigo-400">Declarative YAML DAG Workflows</p>
          </div>
        </div>
        <p class="text-slate-400 text-sm leading-relaxed mb-6 font-body">
          State machine engine ensuring step-by-step determinism. Eliminates unguided autonomous drift with hard human approval gates.
        </p>

        <!-- Interactive Visual DAG Step Tracker -->
        <div class="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3.5 space-y-2 font-mono text-xs">
          <div class="flex items-center gap-2 text-slate-300">
            <span class="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px]">1</span>
            <span>Plan &amp; Architecture</span>
            <span class="ml-auto text-emerald-400 text-[10px]">VERIFIED</span>
          </div>
          <div class="flex items-center gap-2 text-slate-300">
            <span class="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px]">2</span>
            <span>Code &amp; Invariant Gate</span>
            <span class="ml-auto text-emerald-400 text-[10px]">VERIFIED</span>
          </div>
          <div class="flex items-center gap-2 text-cyan-300">
            <span class="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-[10px] animate-pulse">3</span>
            <span>.verify/ Independent Sandbox</span>
            <span class="ml-auto text-cyan-400 text-[10px]">RUNNING</span>
          </div>
          <div class="flex items-center gap-2 text-slate-500">
            <span class="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px]">4</span>
            <span>Human Approval Gate</span>
            <span class="ml-auto text-slate-500 text-[10px]">QUEUED</span>
          </div>
        </div>
      </div>

      <!-- Card 3: agstack SDLC Engine (Span 6) -->
      <div class="md:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl p-7 hover:border-teal-500/40 transition-all duration-300 relative group overflow-hidden">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <span class="material-symbols-outlined text-xl">terminal</span>
          </div>
          <div>
            <h3 class="text-lg font-headline font-bold text-white">agstack SDLC Engine</h3>
            <p class="text-xs font-mono text-teal-400">25+ Disciplined Playbooks &amp; Skills</p>
          </div>
        </div>
        <p class="text-slate-400 text-sm leading-relaxed mb-6 font-body">
          Replaces verbose, hallucinated comment slop with verifiable code artifacts. Strict verification separation keeps evaluation isolated from generation.
        </p>

        <!-- File Tree Preview -->
        <div class="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3.5 font-mono text-xs text-slate-400 space-y-1.5">
          <div class="text-cyan-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-xs">folder_open</span> .verify/
          </div>
          <div class="pl-4 text-slate-300 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-xs text-cyan-400">description</span> spec.invariants.md
          </div>
          <div class="pl-4 text-slate-300 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-xs text-cyan-400">checklist</span> regression-matrix.yaml
          </div>
          <div class="pl-4 text-emerald-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-xs">verified</span> cryptographic_proof.sig
          </div>
        </div>
      </div>

      <!-- Card 4: Strict Verification Harness (.verify/) (Span 6) -->
      <div class="md:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl p-7 hover:border-cyan-500/40 transition-all duration-300 relative group overflow-hidden">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-teal-950/60 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <span class="material-symbols-outlined text-xl">verified</span>
          </div>
          <div>
            <h3 class="text-lg font-headline font-bold text-white">Strict Verification Harness (.verify/)</h3>
            <p class="text-xs font-mono text-teal-400">Allowlisted Phased Runner & Proof Artifacts</p>
          </div>
        </div>
        <p class="text-slate-400 text-sm leading-relaxed mb-6 font-body">
          Strict verification root separation keeps input fixtures read-only while test harnesses, snapshots, and logs output strictly under .verify/. Zero permission asking: every modification is verified before completion.
        </p>

        <!-- Metric Cards -->
        <div class="grid grid-cols-2 gap-3 font-mono">
          <div class="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3.5">
            <span class="text-slate-500 text-[10px] block mb-1">VERIFICATION PASS RATE</span>
            <span class="text-2xl font-bold text-emerald-400">100%</span>
            <span class="text-[10px] text-slate-400 block mt-1">Exit code 0 mandatory</span>
          </div>
          <div class="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3.5">
            <span class="text-slate-500 text-[10px] block mb-1">PROOF ARTIFACT SURVIVAL</span>
            <span class="text-2xl font-bold text-cyan-400">Deterministic</span>
            <span class="text-[10px] text-slate-400 block mt-1">Self-contained evidence</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION: REAL INTERACTIVE QUICKSTART TERMINAL -->
  <section class="max-w-5xl mx-auto px-6 py-16" id="quickstart">
    <div class="rounded-2xl border border-cyan-500/30 bg-slate-950/90 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.12)]">
      <!-- Header & Runtime Tabs -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h3 class="text-xl font-headline font-bold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-cyan-400">terminal</span>
            Deploy In Your Engineering Stack
          </h3>
          <p class="text-xs text-slate-400 mt-1 font-body">Verified CLI commands for agent-brain and agent-spine.</p>
        </div>
        <!-- Runtimes Tabs -->
        <div class="inline-flex p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
          <button 
            type="button" 
            onclick={() => activeTab = 'brew'} 
            class="px-3 py-1.5 rounded-md transition cursor-pointer {activeTab === 'brew' ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}"
          >
            Homebrew
          </button>
          <button 
            type="button" 
            onclick={() => activeTab = 'spine'} 
            class="px-3 py-1.5 rounded-md transition cursor-pointer {activeTab === 'spine' ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}"
          >
            agent-spine
          </button>
          <button 
            type="button" 
            onclick={() => activeTab = 'brain'} 
            class="px-3 py-1.5 rounded-md transition cursor-pointer {activeTab === 'brain' ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}"
          >
            agent-brain
          </button>
          <button 
            type="button" 
            onclick={() => activeTab = 'cargo'} 
            class="px-3 py-1.5 rounded-md transition cursor-pointer {activeTab === 'cargo' ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}"
          >
            Cargo Source
          </button>
        </div>
      </div>

      <!-- Terminal Shell Body -->
      <div class="mt-6 rounded-xl bg-black/60 border border-slate-800 p-5 font-mono text-sm relative group">
        <button 
          type="button" 
          onclick={copyCommand}
          class="absolute top-4 right-4 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
        >
          {#if copied}
            <span class="text-emerald-400">✔ Copied</span>
          {:else}
            <span class="material-symbols-outlined text-xs">content_copy</span>
            <span>Copy</span>
          {/if}
        </button>

        <div class="space-y-3">
          {#each commandSnippets[activeTab].commands as cmd, idx}
            <div class="text-slate-400">
              <span class="text-cyan-400 font-bold">$</span> {cmd}
            </div>
            {#if commandSnippets[activeTab].notes[idx]}
              <div class="text-slate-500 text-xs pl-4">
                {commandSnippets[activeTab].notes[idx]}
              </div>
            {/if}
          {/each}
        </div>
      </div>

      <!-- Terminal Verification Status Pill -->
      <div class="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Tested on macOS &amp; Linux</span>
          <span>•</span>
          <span class="text-cyan-300">100% Rust Core</span>
          <span>•</span>
          <span>Local-first &amp; Zero Ambient Context Leakage</span>
        </div>
        <span class="text-slate-500">Rust &gt;= 1.80 / Brew 4.x</span>
      </div>
    </div>
  </section>

  <!-- SECTION: NON-NEGOTIABLE INVARIANTS -->
  <section class="max-w-6xl mx-auto px-6 py-20" id="spec">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <div class="inline-flex items-center gap-1 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
        <span class="material-symbols-outlined text-sm">gavel</span>
        SDLC Guarantees
      </div>
      <h2 class="text-3xl sm:text-4xl font-headline font-bold text-white tracking-tight mb-4">
        The Engineering Invariants That Never Fail
      </h2>
      <p class="text-slate-400 text-sm sm:text-base">
        Our core architectural pillars replace statistical hope with deterministic mathematical and runtime constraints.
      </p>
    </div>

    <!-- 4-Card Invariant Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Invariant 1 -->
      <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 font-mono font-bold text-sm">
            01
          </div>
          <h3 class="text-base font-headline font-bold text-white mb-2">Immutability First</h3>
          <p class="text-slate-400 text-xs leading-relaxed font-body">
            Once an organ step validates, artifacts are cryptographically hashed and sealed. No background modifications allowed.
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400 flex items-center gap-1">
          <span class="material-symbols-outlined text-xs">fingerprint</span>
          SHA-256 Proof Sealing
        </div>
      </div>

      <!-- Invariant 2 -->
      <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 font-mono font-bold text-sm">
            02
          </div>
          <h3 class="text-base font-headline font-bold text-white mb-2">Boundary Discipline</h3>
          <p class="text-slate-400 text-xs leading-relaxed font-body">
            Strict context windows and AST tool fencing. Agents cannot exceed assigned scopes or hallucinate out-of-band parameters.
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-mono text-indigo-400 flex items-center gap-1">
          <span class="material-symbols-outlined text-xs">fence</span>
          Fenced AST Sandbox
        </div>
      </div>

      <!-- Invariant 3 -->
      <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 font-mono font-bold text-sm">
            03
          </div>
          <h3 class="text-base font-headline font-bold text-white mb-2">Fix Root Causes</h3>
          <p class="text-slate-400 text-xs leading-relaxed font-body">
            Automatic trace analysis pinpoints logic bugs rather than looping infinite token retries and burning operational budgets.
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
          <span class="material-symbols-outlined text-xs">troubleshoot</span>
          Zero Token Burn Loops
        </div>
      </div>

      <!-- Invariant 4 -->
      <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded-xl bg-teal-950/60 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 font-mono font-bold text-sm">
            04
          </div>
          <h3 class="text-base font-headline font-bold text-white mb-2">Zero Comment Slop</h3>
          <p class="text-slate-400 text-xs leading-relaxed font-body">
            Enforced clean, production-grade code output without redundant assistant narrative or conversational fluff in repositories.
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-mono text-teal-400 flex items-center gap-1">
          <span class="material-symbols-outlined text-xs">code_blocks</span>
          Pure Production Code
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION: HIGH-IMPACT CALL TO ACTION BANNER -->
  <section class="max-w-6xl mx-auto px-6 py-12">
    <div class="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-10 sm:p-16 text-center shadow-[0_0_60px_rgba(6,182,212,0.2)]">
      <!-- Cosmic glow background inside banner -->
      <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-500/30 via-cyan-500/30 to-teal-400/20 blur-[90px] rounded-full pointer-events-none"></div>
      <div class="relative z-10 max-w-2xl mx-auto">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          Enterprise Production Ready
        </div>
        <h2 class="text-3xl sm:text-5xl font-headline font-extrabold text-white tracking-tight mb-6">
          Architect Your Autonomous Fleet Today
        </h2>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 font-body">
          Join forward-thinking software engineering organizations migrating from chaotic prompt chains to disciplined, verifiable agent operations.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-headline font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-200 active:scale-95" href="#quickstart">
            <span>Install CLI (Homebrew)</span>
            <span class="material-symbols-outlined text-base">arrow_forward</span>
          </a>
          <a class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-headline font-medium text-slate-200 bg-slate-900 border border-slate-700/80 hover:border-cyan-500/40 transition-all duration-200 active:scale-95" href="/docs/architecture">
            <span class="material-symbols-outlined text-base text-cyan-400">calendar_month</span>
            <span>Architecture Spec</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</main>
