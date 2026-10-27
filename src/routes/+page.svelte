<script lang="ts">
  import {
    Terminal,
    Shield,
    Zap,
    Check,
    Copy,
    ArrowRight,
    Database,
    Activity,
    GitBranch,
    Cpu,
    Layers,
    Lock,
    CheckCircle2,
    FolderOpen,
    FileCode,
    RefreshCw,
    AlertTriangle,
    Network,
    ExternalLink
  } from "lucide-svelte";

  let { data } = $props();
  let version = $derived(data?.ecosystemVersion || 'v1.0.0-rc2');
  let activeTab = $state<'brew' | 'brain' | 'spine' | 'cargo'>('brew');
  let activeConsoleTab = $state<'procedure-graph' | 'trap-detection' | 'policy-sentry' | 'neural-bus'>('procedure-graph');
  let copied = $state(false);

  const commandSnippets: Record<string, { commands: string[]; notes: string[] }> = {
    brew: {
      commands: [
        "brew tap autonomic-ai-dev/tap",
        "brew install agent-brain agent-spine",
        "agent-brain doctor"
      ],
      notes: [
        "Installed developer ID-signed Apple Silicon universal binary",
        "Verified MCP stdio server, SQLite schema v23, and host hooks",
        "Ready for local-first turn routing across all coding agents"
      ]
    },
    brain: {
      commands: [
        "agent-brain install --global",
        "agent-brain package add nextlevelbuilder/ui-ux-pro-max-skill",
        "agent-brain briefing"
      ],
      notes: [
        "Configured MCP stdio server + editor read-gates in global scope",
        "Recursively indexed package into local vector and procedure DAG",
        "Route briefing: token budget 448 / 600 tokens (cache latency: 0.4ms)"
      ]
    },
    spine: {
      commands: [
        "agent-spine init --with build-and-test",
        "agent-spine validate .autonomic/state/spine/build-and-test.yaml",
        "agent-spine run .autonomic/state/spine/build-and-test.yaml"
      ],
      notes: [
        "Scaffolded declarative YAML DAG workflow with state snapshotting",
        "Validated node dependencies, step transitions, and approval gates",
        "Execution complete: all nodes sealed with deterministic state"
      ]
    },
    cargo: {
      commands: [
        "cargo install --git https://github.com/autonomic-ai-dev/agent-brain agent-brain",
        "cargo install --git https://github.com/autonomic-ai-dev/agent-spine agent-spine",
        "agent-brain doctor"
      ],
      notes: [
        "Compiled from source with SQLite vec, BM25, and procedure DAG engine",
        "Zero external I/O runtime dependencies in core engine boundary",
        "Daemon ready on ~/.autonomic/memory/serve.sock"
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
  <title>Autonomic AI — Local-First Cognitive Governor & Procedure Graph for Coding Agents</title>
  <meta name="description" content="Local-first cognitive governor and procedure graph for coding agents. Enforces turn-level token budgeting, blocks prompt injection and destructive commands, and accumulates execution DAGs across Cursor, Claude Code, and Antigravity." />
</svelte:head>

<main class="relative z-10 pb-28 text-zinc-100 selection:bg-zinc-800 selection:text-white">
  <!-- HERO SECTION -->
  <section class="max-w-6xl mx-auto px-6 text-center pt-16 pb-20">
    <!-- Top Pill Badge -->
    <a 
      href="/docs/architecture" 
      class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 backdrop-blur-md mb-8 transition-colors text-xs font-mono text-zinc-400 cursor-pointer"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
      <span>v1.0.0-rc2</span>
      <span class="text-zinc-600">/</span>
      <span class="text-zinc-300">Local-First Cognitive Governor &amp; Procedure Graph</span>
      <ArrowRight class="w-3.5 h-3.5 text-zinc-500" />
    </a>

    <!-- Hero Headline -->
    <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight font-headline max-w-4xl mx-auto leading-[1.08] mb-6 text-white">
      Autonomous Coding Agents Need A Cognitive Governor, <span class="text-zinc-400">Not Just Static Prompts.</span>
    </h1>

    <!-- Subtitle -->
    <p class="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-body leading-relaxed mb-10">
      Turn router packs skills into a strict <span class="text-zinc-200 font-mono">~500-token budget</span>. Host pre-tool hooks block destructive shell escapes and prompt injection. Recursive procedure graphs accumulate execution DAGs that never forget.
    </p>

    <!-- CTAs -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
      <a 
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-zinc-950 bg-white hover:bg-zinc-200 transition-colors cursor-pointer" 
        href="#quickstart"
      >
        <span>Install via Homebrew</span>
        <ArrowRight class="w-4 h-4" />
      </a>
      <a 
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 transition-colors" 
        href="/docs/architecture"
      >
        <FileCode class="w-4 h-4 text-zinc-400" />
        <span>Read Architecture Spec</span>
      </a>
    </div>

    <!-- Supported Hosts Badge Row -->
    <div class="pt-6 pb-12 border-b border-zinc-900 max-w-4xl mx-auto">
      <p class="text-[11px] uppercase font-mono tracking-widest text-zinc-500 mb-5 font-semibold">
        Tested and enforced across modern coding agent runtimes
      </p>
      <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-zinc-400">
        <span class="flex items-center gap-2 hover:text-white transition-colors">
          <Terminal class="w-3.5 h-3.5 text-zinc-500" /> CLAUDE CODE
        </span>
        <span class="flex items-center gap-2 hover:text-white transition-colors">
          <Cpu class="w-3.5 h-3.5 text-zinc-500" /> CURSOR
        </span>
        <span class="flex items-center gap-2 hover:text-white transition-colors">
          <Zap class="w-3.5 h-3.5 text-zinc-500" /> ANTIGRAVITY (AGY)
        </span>
        <span class="flex items-center gap-2 hover:text-white transition-colors">
          <Layers class="w-3.5 h-3.5 text-zinc-500" /> OPENCODE
        </span>
        <span class="flex items-center gap-2 hover:text-white transition-colors">
          <GitBranch class="w-3.5 h-3.5 text-zinc-500" /> GITHUB ACTIONS
        </span>
      </div>
    </div>

    <!-- HERO CENTERPIECE: Minimalist Developer Console (Memorable / Render Inspired) -->
    <div class="mt-12 max-w-5xl mx-auto rounded-xl border border-white/10 bg-neutral-950/80 shadow-2xl text-left overflow-hidden ring-1 ring-white/[0.05]" id="console">
      <!-- Window Title & Tab Bar -->
      <div class="px-4 py-2.5 bg-zinc-900/70 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <div class="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
          <span class="ml-2 text-xs font-mono text-zinc-400">agent-brain v1.0.0-rc2</span>
        </div>

        <!-- Pillar Switcher Tabs -->
        <div class="inline-flex p-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[11px] font-mono">
          <button 
            type="button" 
            onclick={() => activeConsoleTab = 'procedure-graph'}
            class="px-2.5 py-1 rounded transition cursor-pointer {activeConsoleTab === 'procedure-graph' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}"
          >
            1. Procedure Graph
          </button>
          <button 
            type="button" 
            onclick={() => activeConsoleTab = 'trap-detection'}
            class="px-2.5 py-1 rounded transition cursor-pointer {activeConsoleTab === 'trap-detection' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}"
          >
            2. Trap Detection
          </button>
          <button 
            type="button" 
            onclick={() => activeConsoleTab = 'policy-sentry'}
            class="px-2.5 py-1 rounded transition cursor-pointer {activeConsoleTab === 'policy-sentry' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}"
          >
            3. Policy Sentry
          </button>
          <button 
            type="button" 
            onclick={() => activeConsoleTab = 'neural-bus'}
            class="px-2.5 py-1 rounded transition cursor-pointer {activeConsoleTab === 'neural-bus' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}"
          >
            4. Neural Bus
          </button>
        </div>
      </div>

      <!-- Console Body Grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 min-h-[380px] font-mono text-xs">
        <!-- Left Panel: State Metadata -->
        <div class="md:col-span-4 p-4 border-b md:border-b-0 md:border-r border-zinc-800/80 bg-zinc-950/40 flex flex-col justify-between">
          <div class="space-y-4">
            <div>
              <div class="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-2">Internal Engine State</div>
              {#if activeConsoleTab === 'procedure-graph'}
                <div class="space-y-2">
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Database Schema</div>
                    <div class="text-zinc-200 font-semibold mt-0.5">v23: procedure_edges</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Traversal Algorithm</div>
                    <div class="text-zinc-200 font-semibold mt-0.5">Recursive SQLite CTEs (p95 ≤ 31ms)</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Auto Trajectory Capture</div>
                    <div class="text-emerald-400 font-semibold mt-0.5">Active (verify &amp; turn hooks)</div>
                  </div>
                </div>
              {:else if activeConsoleTab === 'trap-detection'}
                <div class="space-y-2">
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Outcome Attribution</div>
                    <div class="text-zinc-200 font-semibold mt-0.5">Linked to route_log_id</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Exit Code Squelching</div>
                    <div class="text-amber-400 font-semibold mt-0.5">Failing recipes dropped</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Promotion to must_apply</div>
                    <div class="text-emerald-400 font-semibold mt-0.5">Exit 0 commands promoted</div>
                  </div>
                </div>
              {:else if activeConsoleTab === 'policy-sentry'}
                <div class="space-y-2">
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Pre-Tool Gate</div>
                    <div class="text-rose-400 font-semibold mt-0.5">Physical tool blockage on bypass</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Shell Gate (bash-gate)</div>
                    <div class="text-emerald-400 font-semibold mt-0.5">Blocks rm -rf /, --no-verify</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Scoped Read Fence</div>
                    <div class="text-zinc-200 font-semibold mt-0.5">1h token-bounded unlock</div>
                  </div>
                </div>
              {:else}
                <div class="space-y-2">
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Daemon Socket</div>
                    <div class="text-zinc-200 font-semibold mt-0.5">~/.autonomic/memory/serve.sock</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Storage Engine</div>
                    <div class="text-zinc-200 font-semibold mt-0.5">SQLite WAL + HNSW index</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Multi-Device Sync</div>
                    <div class="text-emerald-400 font-semibold mt-0.5">agent-brain sync git supported</div>
                  </div>
                </div>
              {/if}
            </div>
          </div>

          <!-- Bottom Token Meter -->
          <div class="pt-4 mt-4 border-t border-zinc-800/80">
            <div class="flex items-center justify-between text-[11px] mb-1">
              <span class="text-zinc-400">Turn Budget Knapsack</span>
              <span class="text-zinc-200 font-medium">448 / 600 tok</span>
            </div>
            <div class="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-400 rounded-full w-[74%]"></div>
            </div>
            <div class="text-[10px] text-zinc-500 mt-1.5 flex justify-between">
              <span>Warm Cache Latency</span>
              <span class="text-emerald-400 font-medium">0.42ms</span>
            </div>
          </div>
        </div>

        <!-- Right Panel: Live Execution Log -->
        <div class="md:col-span-8 p-4 bg-black/40 flex flex-col justify-between overflow-x-auto">
          <div class="space-y-2 leading-relaxed">
            {#if activeConsoleTab === 'procedure-graph'}
              <div class="text-zinc-500">[14:32:01.100] <span class="text-zinc-300">mcp::call</span> recall_procedures(query="reproduce and patch regression", task_kind="debugging")</div>
              <div class="text-zinc-400 pl-3 border-l border-zinc-800">
                <span class="text-emerald-400">✔</span> Traversed graph in <span class="text-zinc-200">12ms</span>: Matched workflow: <span class="text-zinc-200 font-semibold">bugfix_regression</span>
              </div>
              <div class="p-2.5 rounded bg-zinc-900/50 border border-zinc-800 text-zinc-300 my-1 text-[11px]">
                <div class="text-zinc-400 font-semibold mb-1">RECALLED PROCEDURE DAG SEQUENCE:</div>
                <div class="text-zinc-300">1. isolate_failing_case → 2. write_reproduction_test → 3. patch_core_logic → 4. run_verification_suite</div>
                <div class="text-zinc-500 text-[10px] mt-1">Success rate: 100% across 8 previous executions. Next node suggestion: [patch_core_logic]</div>
              </div>
              <div class="text-zinc-500">[14:32:01.140] <span class="text-emerald-400">Auto Trajectory</span>: Staged execution path into workflow_trajectory for active turn.</div>
            {:else if activeConsoleTab === 'trap-detection'}
              <div class="text-zinc-500">[14:32:02.010] <span class="text-zinc-300">agent-brain verify</span> -- npm run test:broken</div>
              <div class="text-rose-400 pl-3 border-l border-rose-900/60">
                <span class="text-rose-400">✖ Command failed with exit 1</span>: Missing test target in package.json
              </div>
              <div class="p-2.5 rounded bg-zinc-900/50 border border-amber-900/50 text-amber-200 my-1 text-[11px]">
                <div class="text-amber-400 font-semibold flex items-center gap-1.5 mb-1">
                  <AlertTriangle class="w-3.5 h-3.5 text-amber-400" />
                  <span>TRAP DETECTED &amp; SQUELCHED:</span>
                </div>
                <div>Failure fingerprint indexed. Squelched 'npm run test:broken' from future recipe recommendations.</div>
                <div class="text-zinc-400 text-[10px] mt-1">Active constraint promoted: <span class="text-zinc-200 font-mono">must_apply: Prefer .verify/run.sh</span></div>
              </div>
              <div class="text-zinc-500">[14:32:02.240] <span class="text-zinc-400">Result</span>: Future agent turns are prevented from executing this failing command.</div>
            {:else if activeConsoleTab === 'policy-sentry'}
              <div class="text-zinc-500">[14:32:03.001] <span class="text-zinc-300">agent attempted execution</span>: git push --force origin main</div>
              <div class="text-rose-400 pl-3 border-l border-rose-900/60">
                <span class="text-rose-400">BLOCKED BY bash-gate (code 2)</span>: Destructive Git override denied.
              </div>
              <div class="p-2.5 rounded bg-zinc-900/50 border border-zinc-800 text-zinc-300 my-1 text-[11px]">
                <div class="text-zinc-400 font-semibold mb-1">REASON:</div>
                <div>Force pushing to protected branches is forbidden by policy. Agent must create a feature branch and pull request.</div>
              </div>
              <div class="text-zinc-500">[14:32:03.015] <span class="text-emerald-400">Physical Sentry</span>: Tool call rejected before execution. Zero repository damage.</div>
            {:else}
              <div class="text-zinc-500">[14:32:04.100] <span class="text-zinc-300">Terminal (Claude Code)</span>: agent-brain verify -- cargo test (Exit 0)</div>
              <div class="text-emerald-400 pl-3 border-l border-zinc-800">
                <span class="text-emerald-400">✔</span> Recorded verified recipe in <span class="text-zinc-200">~/.autonomic/memory/brain.db</span>
              </div>
              <div class="p-2.5 rounded bg-zinc-900/50 border border-zinc-800 text-zinc-300 my-1 text-[11px]">
                <div class="text-zinc-400 font-semibold mb-1">CROSS-HOST NEURAL BUS DISPATCH:</div>
                <div>Cursor IDE &amp; Antigravity immediately read newly verified recipe from SQLite WAL shared socket.</div>
                <div class="text-zinc-500 text-[10px] mt-1">Zero configuration required. All local agents operate as a cohesive engineering swarm.</div>
              </div>
              <div class="text-zinc-500">[14:32:04.150] <span class="text-zinc-400">Telemetry</span>: 3 connected host agents synchronized.</div>
            {/if}
          </div>

          <div class="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Local SQLite WAL · Deterministic Verification</span>
            <span class="text-zinc-400 font-mono">Status: Active Sentry</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION: THE 4 STRATEGIC PILLARS (Category-Defining Architecture) -->
  <section class="max-w-6xl mx-auto px-6 py-24" id="pillars">
    <div class="max-w-2xl mx-auto text-center mb-16">
      <div class="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Category-Defining Architecture</div>
      <h2 class="text-3xl sm:text-4xl font-bold font-headline text-white tracking-tight mb-4">
        Four Pillars Beyond Static Prompts
      </h2>
      <p class="text-sm sm:text-base text-zinc-400 leading-relaxed font-body">
        Passive skill libraries dump markdown text. agent-brain provides active cognitive governance, closed-loop reinforcement, and deterministic execution memory.
      </p>
    </div>

    <!-- 4 Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Pillar 1 -->
      <div class="p-7 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 transition-colors flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
              <Network class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-white font-headline">1. Self-Evolving Procedure Graph</h3>
              <p class="text-xs font-mono text-zinc-500">The Execution Flight Recorder</p>
            </div>
          </div>
          <p class="text-sm text-zinc-400 leading-relaxed mb-4 font-body">
            Replaces static prompt templates with a persistent procedural DAG. Execution steps across <span class="text-zinc-200 font-mono">verify</span> and turn boundaries automatically accumulate into SQLite schema v23 (<span class="text-zinc-200 font-mono">procedure_edges</span>). When encountering similar tasks, <span class="text-zinc-200 font-mono">recall_procedures</span> injects the proven multi-step sequence rather than generic text.
          </p>
        </div>
        <div class="pt-4 border-t border-zinc-800/80 text-xs font-mono text-zinc-400 flex items-center justify-between">
          <span>Recursive CTE Traversal</span>
          <span class="text-emerald-400 font-semibold">p95 ≤ 31ms</span>
        </div>
      </div>

      <!-- Pillar 2 -->
      <div class="p-7 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 transition-colors flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
              <AlertTriangle class="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 class="text-base font-bold text-white font-headline">2. Closed-Loop Trap Detection</h3>
              <p class="text-xs font-mono text-zinc-500">Negative Reinforcement Sentry</p>
            </div>
          </div>
          <p class="text-sm text-zinc-400 leading-relaxed mb-4 font-body">
            LLMs repeatedly hallucinate deprecated flags and failing test commands. agent-brain captures execution outcomes directly into <span class="text-zinc-200 font-mono">verify_outcomes</span>. Commands that exit non-zero are instantly squelched from recommendations, while proven recipes (exit 0) are elevated into mandatory <span class="text-zinc-200 font-mono">must_apply</span> directives.
          </p>
        </div>
        <div class="pt-4 border-t border-zinc-800/80 text-xs font-mono text-zinc-400 flex items-center justify-between">
          <span>Failed Recipe Squelching</span>
          <span class="text-emerald-400 font-semibold">Zero-Token Loops</span>
        </div>
      </div>

      <!-- Pillar 3 -->
      <div class="p-7 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 transition-colors flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
              <Shield class="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h3 class="text-base font-bold text-white font-headline">3. Active Policy Sentry</h3>
              <p class="text-xs font-mono text-zinc-500">Host-Level Mechanical Guardrails</p>
            </div>
          </div>
          <p class="text-sm text-zinc-400 leading-relaxed mb-4 font-body">
            Prompts and advisory instructions are routinely ignored by LLMs. agent-brain hooks directly into the host runtime (<span class="text-zinc-200 font-mono">route_gate.py</span>, <span class="text-zinc-200 font-mono">bash-gate</span>). It physically halts execution if an agent attempts unscouted massive file reads, unallowlisted destructive operations, or bypasses verification before completing tasks.
          </p>
        </div>
        <div class="pt-4 border-t border-zinc-800/80 text-xs font-mono text-zinc-400 flex items-center justify-between">
          <span>Jailbreak &amp; Prompt Defense</span>
          <span class="text-emerald-400 font-semibold">250/250 Passed</span>
        </div>
      </div>

      <!-- Pillar 4 -->
      <div class="p-7 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 transition-colors flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
              <Activity class="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 class="text-base font-bold text-white font-headline">4. Universal Cross-Host Neural Bus</h3>
              <p class="text-xs font-mono text-zinc-500">Shared Background Daemon</p>
            </div>
          </div>
          <p class="text-sm text-zinc-400 leading-relaxed mb-4 font-body">
            Eliminates siloed agent context. A build fix discovered by Claude Code in your terminal is instantly available to Cursor in the IDE, Antigravity in agentic loops, and CI runners. All hosts connect over stdio proxy to a unified background SQLite daemon with WAL concurrency.
          </p>
        </div>
        <div class="pt-4 border-t border-zinc-800/80 text-xs font-mono text-zinc-400 flex items-center justify-between">
          <span>Cross-Host Synchronization</span>
          <span class="text-emerald-400 font-semibold">Shared brain.db</span>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION: VERIFIED BENCHMARKS (Evidence-Based, Zero Fluff) -->
  <section class="max-w-6xl mx-auto px-6 py-16 border-t border-b border-zinc-900" id="benchmarks">
    <div class="max-w-2xl mx-auto text-center mb-12">
      <div class="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Measured System Metrics</div>
      <h2 class="text-2xl sm:text-3xl font-bold font-headline text-white tracking-tight mb-3">
        Engineered for Sub-Millisecond Speed &amp; Hard Isolation
      </h2>
      <p class="text-xs sm:text-sm text-zinc-400">Every metric is verified through recorded CLI execution in .verify/.</p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-left">
      <div class="p-5 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
        <div class="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">Warm Route Latency</div>
        <div class="text-2xl sm:text-3xl font-bold text-white">≤ 24ms</div>
        <div class="text-zinc-500 text-[11px] mt-1">p95 over 500+ turns</div>
      </div>
      <div class="p-5 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
        <div class="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">Procedure Traversal</div>
        <div class="text-2xl sm:text-3xl font-bold text-emerald-400">≤ 31ms</div>
        <div class="text-zinc-500 text-[11px] mt-1">p95 recursive CTE depth</div>
      </div>
      <div class="p-5 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
        <div class="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">Jailbreak Defense</div>
        <div class="text-2xl sm:text-3xl font-bold text-white">250/250</div>
        <div class="text-zinc-500 text-[11px] mt-1">Adversarial queries passed</div>
      </div>
      <div class="p-5 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
        <div class="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">Core I/O Isolation</div>
        <div class="text-2xl sm:text-3xl font-bold text-emerald-400">0 I/O</div>
        <div class="text-zinc-500 text-[11px] mt-1">agent-brain-core boundary</div>
      </div>
    </div>
  </section>

  <!-- SECTION: QUICKSTART DEPLOYMENT -->
  <section class="max-w-5xl mx-auto px-6 py-24" id="quickstart">
    <div class="rounded-xl border border-white/10 bg-neutral-950/80 p-6 sm:p-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h3 class="text-lg font-bold font-headline text-white flex items-center gap-2">
            <Terminal class="w-4 h-4 text-zinc-400" />
            Quickstart Installation
          </h3>
          <p class="text-xs text-zinc-400 mt-1">Verified CLI commands for agent-brain and agent-spine.</p>
        </div>

        <!-- Tabs -->
        <div class="inline-flex p-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-xs font-mono">
          <button 
            type="button" 
            onclick={() => activeTab = 'brew'} 
            class="px-3 py-1.5 rounded transition cursor-pointer {activeTab === 'brew' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}"
          >
            Homebrew
          </button>
          <button 
            type="button" 
            onclick={() => activeTab = 'brain'} 
            class="px-3 py-1.5 rounded transition cursor-pointer {activeTab === 'brain' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}"
          >
            agent-brain
          </button>
          <button 
            type="button" 
            onclick={() => activeTab = 'spine'} 
            class="px-3 py-1.5 rounded transition cursor-pointer {activeTab === 'spine' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}"
          >
            agent-spine
          </button>
          <button 
            type="button" 
            onclick={() => activeTab = 'cargo'} 
            class="px-3 py-1.5 rounded transition cursor-pointer {activeTab === 'cargo' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}"
          >
            Cargo Source
          </button>
        </div>
      </div>

      <!-- Terminal Body -->
      <div class="mt-6 rounded-lg bg-black/60 border border-zinc-800/80 p-5 font-mono text-xs relative group">
        <button 
          type="button" 
          onclick={copyCommand}
          class="absolute top-4 right-4 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1.5 border border-zinc-700 transition cursor-pointer"
        >
          {#if copied}
            <span class="text-emerald-400">✔ Copied</span>
          {:else}
            <Copy class="w-3.5 h-3.5" />
            <span>Copy</span>
          {/if}
        </button>

        <div class="space-y-3">
          {#each commandSnippets[activeTab].commands as cmd, idx}
            <div class="text-zinc-300">
              <span class="text-zinc-500 font-bold">$</span> {cmd}
            </div>
            {#if commandSnippets[activeTab].notes[idx]}
              <div class="text-zinc-500 text-[11px] pl-3 border-l border-zinc-800">
                {commandSnippets[activeTab].notes[idx]}
              </div>
            {/if}
          {/each}
        </div>
      </div>

      <!-- Footer Pill -->
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-500">
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Apple Silicon (arm64) &amp; Linux x86_64</span>
          <span>•</span>
          <span>Zero Telemetry Leaks</span>
        </div>
        <span class="text-zinc-600">macOS 13+ · SQLite 3.45+</span>
      </div>
    </div>
  </section>

  <!-- BOTTOM CALL TO ACTION -->
  <section class="max-w-4xl mx-auto px-6 text-center py-12">
    <div class="p-10 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/40 to-transparent">
      <h2 class="text-2xl sm:text-3xl font-bold font-headline text-white tracking-tight mb-3">
        Ready to govern your coding agents?
      </h2>
      <p class="text-sm text-zinc-400 max-w-lg mx-auto mb-6">
        Install the local binary, configure your host hooks in one click, and stop losing architectural context between turns.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a 
          href="#quickstart" 
          class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-zinc-950 bg-white hover:bg-zinc-200 transition-colors"
        >
          Get Started
        </a>
        <a 
          href="https://github.com/autonomic-ai-dev/agent-brain" 
          target="_blank" 
          rel="noreferrer"
          class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors inline-flex items-center justify-center gap-1.5"
        >
          <span>View on GitHub</span>
          <ExternalLink class="w-3.5 h-3.5 text-zinc-500" />
        </a>
      </div>
    </div>
  </section>
</main>
