<script lang="ts">
  import {
    Terminal,
    Shield,
    Zap,
    Copy,
    ArrowRight,
    Activity,
    Cpu,
    Layers,
    FileCode,
    AlertTriangle,
    Network,
    ExternalLink,
    Database,
    Lock,
    Package
  } from "lucide-svelte";

  let { data } = $props();
  let version = $derived(data?.ecosystemVersion || 'v1.0.0-rc6');
  let activeTab = $state<'brew' | 'cargo'>('brew');
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
        "Installs the developer ID-signed Apple Silicon binaries for agent-brain and agent-spine",
        "Configures the MCP stdio server, SQLite store, and host pre-tool hooks",
        "Ready for turn routing across Cursor, Claude Code, Antigravity, and OpenCode"
      ]
    },
    cargo: {
      commands: [
        "cargo install --git https://github.com/autonomic-ai-dev/agent-brain agent-brain",
        "cargo install --git https://github.com/autonomic-ai-dev/agent-spine agent-spine",
        "agent-brain doctor"
      ],
      notes: [
        "Compiled from source with SQLite, BM25, and the procedure graph engine",
        "The core crate has no I/O dependencies",
        "The shared daemon listens on ~/.autonomic/memory/serve.sock"
      ]
    }
  };

  const pillars = [
    {
      icon: Network,
      title: "Self-Evolving Procedure Graph",
      kicker: "Execution flight recorder",
      body: "Steps across verify and turn boundaries accumulate into procedure_edges. For a similar task, recall_procedures returns the multi-step sequence that worked before, not generic advice.",
      footer: "Recursive CTE traversal",
    },
    {
      icon: AlertTriangle,
      title: "Closed-Loop Trap Detection",
      kicker: "Negative reinforcement",
      body: "Outcomes are recorded in verify_outcomes. A command that exits non-zero is kept out of recommendations, and a recipe that exits 0 can be promoted to a must_apply rule.",
      footer: "Failed recipes squelched",
    },
    {
      icon: Shield,
      title: "Active Policy Sentry",
      kicker: "Host-level guardrails",
      body: "Hooks run inside the host runtime (route_gate and bash-gate). They block destructive shell commands, unscouted large reads, and task completion without a passing verification.",
      footer: "Enforced before the tool runs",
    },
    {
      icon: Activity,
      title: "Shared Cross-Host Daemon",
      kicker: "One writer, many readers",
      body: "Every host connects through a stdio proxy to one background daemon, which is the only writer to brain.db. A fix found in Claude Code is available in Cursor and Antigravity without copying it.",
      footer: "Single brain.db",
    },
  ];

  const steps = [
    { n: "01", title: "Route", body: "route_task ranks skills, rules, and memory for the turn and fits them into a fixed token budget." },
    { n: "02", title: "Govern", body: "Host hooks check each tool call before it runs. Destructive commands and bypassed checks are stopped at the tool boundary." },
    { n: "03", title: "Remember", body: "Verified commands and approved facts are stored locally, so the next session starts from what already passed." },
  ];

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
  <link rel="canonical" href="https://autonomic-ai.dev/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Autonomic AI — Local-First Cognitive Governor & Procedure Graph for Coding Agents" />
  <meta property="og:description" content="Local-first cognitive governor and procedure graph for coding agents. Enforces turn-level token budgeting, blocks prompt injection and destructive commands, and accumulates execution DAGs across Cursor, Claude Code, and Antigravity." />
  <meta property="og:url" content="https://autonomic-ai.dev/" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Autonomic AI — Local-First Cognitive Governor & Procedure Graph" />
  <meta name="twitter:description" content="Local-first cognitive governor and procedure graph for coding agents. Enforces turn-level token budgeting, blocks prompt injection, and executes deterministic DAG workflows." />
</svelte:head>

<main class="relative z-10 pb-28 text-zinc-100 selection:bg-zinc-800 selection:text-white">
  <!-- HERO -->
  <section class="max-w-6xl mx-auto px-6 text-center pt-16 pb-20">
    <a
      href="/docs/architecture"
      class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 backdrop-blur-md mb-8 transition-colors text-xs font-mono text-zinc-400 cursor-pointer max-w-full"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
      <span class="whitespace-nowrap font-medium text-zinc-300">{version}</span>
      <span class="text-zinc-600 hidden sm:inline">/</span>
      <span class="text-zinc-300 truncate">Local-first governor for coding agents</span>
      <ArrowRight class="w-3.5 h-3.5 text-zinc-500 shrink-0" />
    </a>

    <h1 class="text-3xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.035em] font-headline max-w-4xl mx-auto leading-[1.08] mb-6 bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent break-words">
      Autonomous Coding Agents Need A Cognitive Governor.
    </h1>

    <p class="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto font-body leading-relaxed mb-10">
      Routes each turn's skills and memory into a fixed token budget, stops destructive commands before they run, and keeps a record of what passed, so the next session starts from verified work.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
      <a
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-black bg-white hover:bg-neutral-200 transition-all shadow-[0_0_24px_rgba(255,255,255,0.18)] cursor-pointer active:scale-95"
        href="#quickstart"
      >
        <span>Install</span>
        <ArrowRight class="w-4 h-4" />
      </a>
      <a
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-neutral-300 bg-neutral-900/90 hover:bg-neutral-800 border border-white/10 hover:border-white/20 transition-all active:scale-95"
        href="/docs/architecture"
      >
        <FileCode class="w-4 h-4 text-neutral-400" />
        <span>Read the architecture</span>
      </a>
    </div>

    <div class="pt-6 pb-12 border-b border-neutral-800/80 max-w-4xl mx-auto">
      <p class="text-[11px] uppercase font-mono tracking-widest text-neutral-500 mb-5 font-semibold">
        Works with the coding agents you already use
      </p>
      <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-neutral-400">
        <span class="flex items-center gap-2 hover:text-white transition-colors"><Terminal class="w-3.5 h-3.5 text-neutral-500" /> CLAUDE CODE</span>
        <span class="flex items-center gap-2 hover:text-white transition-colors"><Cpu class="w-3.5 h-3.5 text-neutral-500" /> CURSOR</span>
        <span class="flex items-center gap-2 hover:text-white transition-colors"><Zap class="w-3.5 h-3.5 text-neutral-500" /> ANTIGRAVITY (AGY)</span>
        <span class="flex items-center gap-2 hover:text-white transition-colors"><Layers class="w-3.5 h-3.5 text-neutral-500" /> OPENCODE</span>
      </div>
    </div>

    <!-- PRODUCT CONSOLE -->
    <div class="mt-12 max-w-5xl mx-auto rounded-2xl border border-white/15 bg-neutral-950 shadow-[0_24px_60px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.1)] text-left overflow-hidden ring-1 ring-white/[0.05]" id="console">
      <div class="px-4 py-2.5 bg-zinc-900/70 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <div class="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
          <span class="ml-2 text-xs font-mono text-zinc-400">agent-brain {version} · example session</span>
        </div>

        <div class="inline-flex max-w-full overflow-x-auto p-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[11px] font-mono whitespace-nowrap">
          <button type="button" onclick={() => activeConsoleTab = 'procedure-graph'} class="px-2.5 py-1 rounded transition cursor-pointer {activeConsoleTab === 'procedure-graph' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}">1. Procedure Graph</button>
          <button type="button" onclick={() => activeConsoleTab = 'trap-detection'} class="px-2.5 py-1 rounded transition cursor-pointer {activeConsoleTab === 'trap-detection' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}">2. Trap Detection</button>
          <button type="button" onclick={() => activeConsoleTab = 'policy-sentry'} class="px-2.5 py-1 rounded transition cursor-pointer {activeConsoleTab === 'policy-sentry' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}">3. Policy Sentry</button>
          <button type="button" onclick={() => activeConsoleTab = 'neural-bus'} class="px-2.5 py-1 rounded transition cursor-pointer {activeConsoleTab === 'neural-bus' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}">4. Shared Daemon</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 min-h-[380px] font-mono text-xs">
        <div class="md:col-span-4 p-4 border-b md:border-b-0 md:border-r border-zinc-800/80 bg-zinc-950/40 flex flex-col justify-between">
          <div class="space-y-4">
            <div>
              <div class="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-2">Internal Engine State</div>
              {#if activeConsoleTab === 'procedure-graph'}
                <div class="space-y-2">
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Procedure store</div>
                    <div class="text-zinc-200 font-semibold mt-0.5">procedure_edges (migration 23)</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Traversal</div>
                    <div class="text-zinc-200 font-semibold mt-0.5">Recursive SQLite CTE</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Auto trajectory capture</div>
                    <div class="text-emerald-400 font-semibold mt-0.5">Active (verify and turn hooks)</div>
                  </div>
                </div>
              {:else if activeConsoleTab === 'trap-detection'}
                <div class="space-y-2">
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Outcome attribution</div>
                    <div class="text-zinc-200 font-semibold mt-0.5">Linked to route_log_id</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Failing commands</div>
                    <div class="text-amber-400 font-semibold mt-0.5">Left out of recommendations</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Passing commands</div>
                    <div class="text-emerald-400 font-semibold mt-0.5">Eligible for must_apply</div>
                  </div>
                </div>
              {:else if activeConsoleTab === 'policy-sentry'}
                <div class="space-y-2">
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Pre-tool gate</div>
                    <div class="text-rose-400 font-semibold mt-0.5">Tool call stopped before it runs</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Shell gate (bash-gate)</div>
                    <div class="text-emerald-400 font-semibold mt-0.5">Blocks destructive commands</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Scoped read fence</div>
                    <div class="text-zinc-200 font-semibold mt-0.5">Time-limited unlock</div>
                  </div>
                </div>
              {:else}
                <div class="space-y-2">
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Daemon socket</div>
                    <div class="text-zinc-200 font-semibold mt-0.5">~/.autonomic/memory/serve.sock</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Storage</div>
                    <div class="text-zinc-200 font-semibold mt-0.5">SQLite WAL, one writer</div>
                  </div>
                  <div class="p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
                    <div class="text-zinc-400 text-[11px]">Multi-device sync</div>
                    <div class="text-emerald-400 font-semibold mt-0.5">Optional, via agent-brain sync git</div>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>

        <div class="md:col-span-8 p-4 bg-black/40 flex flex-col justify-between overflow-x-auto">
          <div class="space-y-2 leading-relaxed">
            {#if activeConsoleTab === 'procedure-graph'}
              <div class="text-zinc-500">[14:32:01.100] <span class="text-zinc-300">mcp::call</span> recall_procedures(query="reproduce and patch regression", task_kind="debugging")</div>
              <div class="text-zinc-400 pl-3 border-l border-zinc-800">
                <span class="text-emerald-400">✔</span> Matched workflow: <span class="text-zinc-200 font-semibold">bugfix_regression</span>
              </div>
              <div class="p-2.5 rounded bg-zinc-900/50 border border-zinc-800 text-zinc-300 my-1 text-[11px]">
                <div class="text-zinc-400 font-semibold mb-1">RECALLED PROCEDURE SEQUENCE:</div>
                <div class="text-zinc-300">1. isolate_failing_case → 2. write_reproduction_test → 3. patch_core_logic → 4. run_verification_suite</div>
              </div>
              <div class="text-zinc-500">[14:32:01.140] <span class="text-emerald-400">Auto trajectory</span>: Staged the execution path for the active turn.</div>
            {:else if activeConsoleTab === 'trap-detection'}
              <div class="text-zinc-500">[14:32:02.010] <span class="text-zinc-300">agent-brain verify</span> -- npm run test:broken</div>
              <div class="text-rose-400 pl-3 border-l border-rose-900/60">
                <span class="text-rose-400">✖ Command failed with exit 1</span>: Missing test target in package.json
              </div>
              <div class="p-2.5 rounded bg-zinc-900/50 border border-amber-900/50 text-amber-200 my-1 text-[11px]">
                <div class="text-amber-400 font-semibold flex items-center gap-1.5 mb-1">
                  <AlertTriangle class="w-3.5 h-3.5 text-amber-400" />
                  <span>Failure recorded</span>
                </div>
                <div>The command is left out of future recommendations.</div>
                <div class="text-zinc-400 text-[10px] mt-1">A passing command in the same repo can be promoted to <span class="text-zinc-200 font-mono">must_apply</span>.</div>
              </div>
              <div class="text-zinc-500">[14:32:02.240] <span class="text-zinc-400">Result</span>: Future turns are steered away from this command.</div>
            {:else if activeConsoleTab === 'policy-sentry'}
              <div class="text-zinc-500">[14:32:03.001] <span class="text-zinc-300">agent attempted execution</span>: git push --force origin main</div>
              <div class="text-rose-400 pl-3 border-l border-rose-900/60">
                <span class="text-rose-400">BLOCKED BY bash-gate</span>: Destructive git override denied.
              </div>
              <div class="p-2.5 rounded bg-zinc-900/50 border border-zinc-800 text-zinc-300 my-1 text-[11px]">
                <div class="text-zinc-400 font-semibold mb-1">REASON:</div>
                <div>Force pushes to protected branches are denied by policy. The agent should use a feature branch and a pull request.</div>
              </div>
              <div class="text-zinc-500">[14:32:03.015] <span class="text-emerald-400">Sentry</span>: Tool call rejected before execution.</div>
            {:else}
              <div class="text-zinc-500">[14:32:04.100] <span class="text-zinc-300">Terminal (Claude Code)</span>: agent-brain verify -- cargo test (exit 0)</div>
              <div class="text-emerald-400 pl-3 border-l border-zinc-800">
                <span class="text-emerald-400">✔</span> Recorded the passing run in <span class="text-zinc-200">~/.autonomic/memory/brain.db</span>
              </div>
              <div class="p-2.5 rounded bg-zinc-900/50 border border-zinc-800 text-zinc-300 my-1 text-[11px]">
                <div class="text-zinc-400 font-semibold mb-1">SHARED DAEMON:</div>
                <div>Cursor and Antigravity read the new record through the same daemon socket.</div>
                <div class="text-zinc-500 text-[10px] mt-1">No per-host configuration beyond the install step.</div>
              </div>
              <div class="text-zinc-500">[14:32:04.150] <span class="text-zinc-400">Telemetry</span>: connected hosts synchronized.</div>
            {/if}
          </div>

          <div class="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Local SQLite WAL · deterministic verification</span>
            <span class="text-zinc-400 font-mono">Illustrative session</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PROOF POINTS -->
  <section class="max-w-6xl mx-auto px-6 py-16 border-t border-b border-zinc-900" id="benchmarks">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-left">
      <div class="p-5 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
        <div class="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">Hosted services</div>
        <div class="text-2xl sm:text-3xl font-bold text-emerald-400">0</div>
        <div class="text-zinc-500 text-[11px] mt-1">required to run locally</div>
      </div>
      <div class="p-5 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
        <div class="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">Store schema</div>
        <div class="text-2xl sm:text-3xl font-bold text-white">v25</div>
        <div class="text-zinc-500 text-[11px] mt-1">SQLite migrations</div>
      </div>
      <div class="p-5 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
        <div class="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">Adversarial route tests</div>
        <div class="text-2xl sm:text-3xl font-bold text-white">250/250</div>
        <div class="text-zinc-500 text-[11px] mt-1">passed, per the agent-brain README</div>
      </div>
      <div class="p-5 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
        <div class="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">Core I/O</div>
        <div class="text-2xl sm:text-3xl font-bold text-emerald-400">0</div>
        <div class="text-zinc-500 text-[11px] mt-1">I/O dependencies in agent-brain-core</div>
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="max-w-6xl mx-auto px-6 py-24" id="platform">
    <div class="max-w-2xl mx-auto text-center mb-16">
      <div class="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">How it works</div>
      <h2 class="text-3xl sm:text-4xl font-bold font-headline text-white tracking-tight mb-4">From the first prompt to a verified commit</h2>
      <p class="text-sm sm:text-base text-zinc-400 leading-relaxed font-body">One local daemon sits between your coding agents and the things they need to know: skills, rules, memory, and what passed last time.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each steps as step}
        <div class="p-7 rounded-xl border border-zinc-800 bg-zinc-900/20">
          <div class="text-xs font-mono text-zinc-500 mb-3">{step.n}</div>
          <h3 class="text-lg font-bold text-white font-headline mb-2">{step.title}</h3>
          <p class="text-sm text-zinc-400 leading-relaxed font-body">{step.body}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- FEATURES -->
  <section class="max-w-6xl mx-auto px-6 py-8" id="features">
    <div class="max-w-2xl mx-auto text-center mb-16">
      <div class="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Capabilities</div>
      <h2 class="text-3xl sm:text-4xl font-bold font-headline text-white tracking-tight mb-4">Four things a prompt cannot do</h2>
      <p class="text-sm sm:text-base text-zinc-400 leading-relaxed font-body">Prompts are advice, and agents ignore advice. These run in the host, in the store, or in the daemon.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each pillars as pillar}
        <div class="p-7 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 transition-colors flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
                <pillar.icon class="w-4 h-4" />
              </div>
              <div>
                <h3 class="text-base font-bold text-white font-headline">{pillar.title}</h3>
                <p class="text-xs font-mono text-zinc-500">{pillar.kicker}</p>
              </div>
            </div>
            <p class="text-sm text-zinc-400 leading-relaxed mb-4 font-body">{pillar.body}</p>
          </div>
          <div class="pt-4 border-t border-zinc-800/80 text-xs font-mono text-zinc-400">{pillar.footer}</div>
        </div>
      {/each}
    </div>
  </section>

  <!-- MEMORY -->
  <section class="max-w-6xl mx-auto px-6 py-24" id="memory">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
          <Database class="w-3.5 h-3.5" /> Memory from the shell
        </div>
        <h2 class="text-3xl font-bold font-headline text-white tracking-tight mb-4">Read, write, and import facts without an agent</h2>
        <p class="text-sm text-zinc-400 leading-relaxed font-body mb-6">
          Store one fact, import a folder of Markdown, or check whether a draft repeats something you already said. The same store serves every connected host.
        </p>
        <ul class="space-y-3 text-sm text-zinc-300 font-body">
          <li class="flex gap-3"><span class="font-mono text-zinc-500 shrink-0">recall</span><span class="text-zinc-400">Text, tag, and semantic search, with a score and a time window.</span></li>
          <li class="flex gap-3"><span class="font-mono text-zinc-500 shrink-0">remember</span><span class="text-zinc-400">Store one fact. Secrets and oversized text are refused.</span></li>
          <li class="flex gap-3"><span class="font-mono text-zinc-500 shrink-0">import-corpus</span><span class="text-zinc-400">Store each paragraph of a folder once. Re-imports create nothing new.</span></li>
        </ul>
      </div>
      <div class="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
        <div class="px-4 py-2.5 border-b border-zinc-800 text-xs font-mono text-zinc-500">shell</div>
        <div class="p-5 font-mono text-xs leading-7 text-zinc-300 space-y-3">
          <div><span class="text-zinc-500">$</span> agent-brain import-corpus ~/writing --tag voice</div>
          <div><span class="text-zinc-500">$</span> agent-brain remember --text "Shipped the nightly export" --tag posted</div>
          <div><span class="text-zinc-500">$</span> agent-brain recall "nightly export" --tag posted --semantic --min-score 0.8</div>
        </div>
      </div>
    </div>
  </section>

  <!-- EXTENSIONS & PRIVACY -->
  <section class="max-w-6xl mx-auto px-6 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="p-7 rounded-xl border border-zinc-800 bg-zinc-900/20">
        <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
          <Package class="w-3.5 h-3.5" /> Small core
        </div>
        <h3 class="text-lg font-bold text-white font-headline mb-2">Optional features install separately</h3>
        <p class="text-sm text-zinc-400 leading-relaxed font-body mb-5">Benchmarks and other add-ons live in extensions. Each is checked against its registry SHA-256 before it installs.</p>
        <div class="rounded-lg border border-zinc-800 bg-black/60 p-4 font-mono text-xs text-zinc-300 space-y-1.5">
          <div><span class="text-zinc-500">$</span> agent-brain ext list</div>
          <div><span class="text-zinc-500">$</span> agent-brain ext add bench</div>
        </div>
      </div>
      <div class="p-7 rounded-xl border border-zinc-800 bg-zinc-900/20">
        <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
          <Lock class="w-3.5 h-3.5" /> Local by default
        </div>
        <h3 class="text-lg font-bold text-white font-headline mb-2">Nothing leaves the machine unless you enable it</h3>
        <p class="text-sm text-zinc-400 leading-relaxed font-body mb-5">Memorable is off by default. Its read-only server needs an explicit enable. Sending a trace to its extraction service needs a second flag, and only after the repository's last verify passed.</p>
        <div class="rounded-lg border border-zinc-800 bg-black/60 p-4 font-mono text-xs text-zinc-300 space-y-1.5">
          <div><span class="text-zinc-500">$</span> agent-brain memorable status</div>
          <div><span class="text-zinc-500">$</span> agent-brain memorable enable</div>
        </div>
      </div>
    </div>
  </section>

  <!-- QUICKSTART -->
  <section class="max-w-5xl mx-auto px-6 py-24" id="quickstart">
    <div class="rounded-xl border border-white/10 bg-neutral-950/80 p-6 sm:p-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h3 class="text-lg font-bold font-headline text-white flex items-center gap-2">
            <Terminal class="w-4 h-4 text-zinc-400" />
            Install
          </h3>
          <p class="text-xs text-zinc-400 mt-1">The agent-brain and agent-spine commands.</p>
        </div>

        <div class="inline-flex p-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-xs font-mono">
          <button type="button" onclick={() => activeTab = 'brew'} class="px-3.5 py-1.5 rounded transition cursor-pointer {activeTab === 'brew' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}">Homebrew</button>
          <button type="button" onclick={() => activeTab = 'cargo'} class="px-3.5 py-1.5 rounded transition cursor-pointer {activeTab === 'cargo' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}">Cargo source</button>
        </div>
      </div>

      <div class="mt-6 rounded-lg bg-black/60 border border-zinc-800/80 p-5 font-mono text-xs relative group overflow-x-auto">
        <button
          type="button"
          onclick={copyCommand}
          class="absolute top-4 right-4 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1.5 border border-zinc-700 transition cursor-pointer shrink-0 z-10"
        >
          {#if copied}
            <span class="text-emerald-400">✔ Copied</span>
          {:else}
            <Copy class="w-3.5 h-3.5" />
            <span>Copy</span>
          {/if}
        </button>

        <div class="space-y-3 pr-16 sm:pr-0">
          {#each commandSnippets[activeTab].commands as cmd, idx}
            <div class="text-zinc-300 break-all sm:break-normal">
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

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-500">
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>macOS on Apple Silicon (signed binaries)</span>
          <span>•</span>
          <span>Other platforms: build from source</span>
        </div>
        <span class="text-zinc-600">macOS 13+</span>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="max-w-4xl mx-auto px-6 text-center py-12">
    <div class="p-10 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/40 to-transparent">
      <h2 class="text-2xl sm:text-3xl font-bold font-headline text-white tracking-tight mb-3">
        Ready to govern your coding agents?
      </h2>
      <p class="text-sm text-zinc-400 max-w-lg mx-auto mb-6">
        Install the local binaries, run the doctor, and stop losing what passed between sessions.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href="#quickstart" class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-zinc-950 bg-white hover:bg-zinc-200 transition-colors">
          Get started
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
