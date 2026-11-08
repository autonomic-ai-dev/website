<script lang="ts">
  import {
    Terminal,
    Shield,
    Copy,
    ArrowRight,
    Activity,
    Zap,
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
  let version = $derived(data?.ecosystemVersion || 'v1.0.0-rc7');
  let activeTab = $state<'brew' | 'source'>('brew');
  let copied = $state(false);

  const commandSnippets: Record<string, { commands: string[]; notes: string[] }> = {
    brew: {
      commands: [
        "brew tap autonomic-ai-dev/tap",
        "brew install agent-brain agent-spine",
        "agent-brain install --all --global",
        "agent-brain doctor"
      ],
      notes: [
        "Developer ID-signed Apple Silicon binaries for agent-brain and agent-spine",
        "Writes the MCP entry and gate hooks for each supported host",
        "Checks the binary, the hooks and the local store"
      ]
    },
    source: {
      commands: [
        "git clone https://github.com/autonomic-ai-dev/agent-brain && cd agent-brain",
        "cargo build --release -p agent-brain -p agent-spine",
        "./target/release/agent-brain install --all --global",
        "./target/release/agent-brain doctor"
      ],
      notes: [
        "Needs a Rust toolchain",
        "Builds the same CLIs from source; the release binaries are the Apple Silicon builds",
        "Same installer and checks as the Homebrew path"
      ]
    }
  };

  const pillars = [
    {
      icon: Network,
      title: "Route each turn within a token budget",
      kicker: "route_task",
      body: "route_task ranks the skills, rules and memory that match the task and fits them into a budget of 350 to 700 tokens, depending on the task kind. Memory keeps 120 tokens reserved, so stored facts are not crowded out by rules.",
      footer: "Budget set per task kind",
    },
    {
      icon: AlertTriangle,
      title: "Record what passed, withhold what failed",
      kicker: "agent-brain verify",
      body: "agent-brain verify runs a command from the project's allowlist and stores its exit code and the hash of the code it tested. Recipes from passing runs are offered as must_apply items. Recipes whose latest run failed are withheld.",
      footer: "Exit codes, not agent claims",
    },
    {
      icon: Shield,
      title: "Gate destructive commands and unverified finishes",
      kicker: "Host hooks",
      body: "bash-gate blocks commands such as rm -rf / and force pushes. The route gate blocks tool calls until the turn is routed. The stop gate blocks a finished turn when the repository's code changed and no passing verify run is recorded.",
      footer: "Enforced by the host, before the tool runs",
    },
    {
      icon: Database,
      title: "Recall the steps that worked before",
      kicker: "recall_procedures",
      body: "With auto_trajectory on (the default), the steps of verified runs are stored as procedure edges. recall_procedures returns the sequence that worked for a similar task, with its success rate.",
      footer: "Stored in SQLite, traversed with recursive CTEs",
    },
  ];

  const steps = [
    { n: "01", title: "Route", body: "route_task selects the skills, rules and memory for the turn, within the token budget for its task kind." },
    { n: "02", title: "Gate", body: "Host hooks check tool calls before they run. The stop gate checks the verify record before a turn can finish." },
    { n: "03", title: "Remember", body: "Passing commands and the facts you store stay in a local SQLite database, so later sessions start from them." },
  ];

  const proof = [
    { value: "0", label: "hosted services", note: "The route path makes no network calls. Routing, memory and verification run locally." },
    { value: "v26", label: "store schema", note: "SQLite migrations, applied on first run." },
    { value: "250", label: "routing regression cases", note: "The jailbreak_routing suite in the agent-brain test suite. Run with cargo test." },
    { value: "0", label: "I/O dependencies in the core crate", note: "Checked on every run by .verify/checks/core_boundary.sh." },
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
  <title>Autonomic AI — Local routing, memory and verification for coding agents</title>
  <meta name="description" content="agent-brain routes skills, rules and memory into a per-task token budget, blocks destructive shell commands, and records which commands passed. agent-spine runs multi-step workflows with verification gates. Works with Claude Code, Cursor, Antigravity, OpenCode, Codex and Gemini CLI." />
  <link rel="canonical" href="https://autonomic-ai.dev/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Autonomic AI — Local routing, memory and verification for coding agents" />
  <meta property="og:description" content="agent-brain routes skills, rules and memory into a per-task token budget, blocks destructive shell commands, and records which commands passed. agent-spine runs multi-step workflows with verification gates." />
  <meta property="og:url" content="https://autonomic-ai.dev/" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Autonomic AI — Local routing, memory and verification for coding agents" />
  <meta name="twitter:description" content="Route, gate and verify coding-agent turns on your machine. Works with Claude Code, Cursor, Antigravity, OpenCode, Codex and Gemini CLI." />
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
      <span class="text-zinc-300 truncate">Beta</span>
      <ArrowRight class="w-3.5 h-3.5 text-zinc-500 shrink-0" />
    </a>

    <h1 class="text-3xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.035em] font-headline max-w-4xl mx-auto leading-[1.08] mb-6 bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent break-words">
      Coding agents that route, gate and verify on your machine.
    </h1>

    <p class="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto font-body leading-relaxed mb-10">
      agent-brain picks the skills, rules and memory each turn needs within a token budget, blocks destructive shell commands before they run, and records which commands passed. agent-spine runs multi-step workflows with verification gates and approval steps.
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
        Hosts where agent-brain installs its gate hooks
      </p>
      <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-neutral-400">
        <span class="flex items-center gap-2 hover:text-white transition-colors"><Terminal class="w-3.5 h-3.5 text-neutral-500" /> CLAUDE CODE</span>
        <span class="flex items-center gap-2 hover:text-white transition-colors"><Activity class="w-3.5 h-3.5 text-neutral-500" /> CURSOR</span>
        <span class="flex items-center gap-2 hover:text-white transition-colors"><Zap class="w-3.5 h-3.5 text-neutral-500" /> ANTIGRAVITY (AGY)</span>
        <span class="flex items-center gap-2 hover:text-white transition-colors"><Layers class="w-3.5 h-3.5 text-neutral-500" /> OPENCODE</span>
        <span class="flex items-center gap-2 hover:text-white transition-colors"><Terminal class="w-3.5 h-3.5 text-neutral-500" /> CODEX</span>
        <span class="flex items-center gap-2 hover:text-white transition-colors"><Terminal class="w-3.5 h-3.5 text-neutral-500" /> GEMINI CLI</span>
      </div>
      <p class="text-[11px] font-mono text-neutral-500 mt-5">
        VS Code and GitHub Copilot get the MCP entry and instructions only. They have no tool hook.
      </p>
    </div>
  </section>

  <!-- AGENT-BRAIN -->
  <section class="max-w-6xl mx-auto px-6 py-16" id="features">
    <div class="max-w-2xl mx-auto text-center mb-16">
      <div class="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">agent-brain</div>
      <h2 class="text-3xl sm:text-4xl font-bold font-headline text-white tracking-tight mb-4">What the routing and gate layer does</h2>
      <p class="text-sm sm:text-base text-zinc-400 leading-relaxed font-body">Prompts are advice, and agents can ignore advice. These checks run in the host, in the store, or in the command you run.</p>
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

  <!-- AGENT-SPINE -->
  <section class="max-w-6xl mx-auto px-6 py-24" id="workflows">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <div>
        <div class="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">agent-spine</div>
        <h2 class="text-3xl font-bold font-headline text-white tracking-tight mb-4">Workflows with verification gates and approval steps</h2>
        <p class="text-sm text-zinc-400 leading-relaxed font-body mb-6">
          A workflow is a YAML graph. Nodes can run an agent, run a verify command, pause at an approval gate, fork and join, or branch speculatively. Each step is appended to a SQLite snapshot log that you can inspect and replay.
        </p>
        <ul class="space-y-3 text-sm text-zinc-300 font-body">
          <li class="flex gap-3"><span class="font-mono text-zinc-500 shrink-0">validate</span><span class="text-zinc-400">Checks YAML syntax, node kinds and that the graph has no cycles.</span></li>
          <li class="flex gap-3"><span class="font-mono text-zinc-500 shrink-0">run --brain</span><span class="text-zinc-400">Routes agent nodes through agent-brain.</span></li>
          <li class="flex gap-3"><span class="font-mono text-zinc-500 shrink-0">inspect, replay</span><span class="text-zinc-400">Read one execution's history, or recreate its final state.</span></li>
          <li class="flex gap-3"><span class="font-mono text-zinc-500 shrink-0">init --with</span><span class="text-zinc-400">Scaffolds built-in workflows such as engineering-safety and feature-from-spec.</span></li>
        </ul>
        <p class="text-xs font-mono text-zinc-500 mt-6">Approval gates auto-approve by default. With auto-approval off, a gate waits until its payload carries approved: true.</p>
      </div>
      <div class="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
        <div class="px-4 py-2.5 border-b border-zinc-800 text-xs font-mono text-zinc-500">workflows/engineering-safety.yaml (excerpt)</div>
        <pre class="p-5 font-mono text-[11px] leading-6 text-zinc-300 overflow-x-auto"><code>name: Engineering Safety
version: 1
start_node: Understand

nodes:
  - name: Understand
    kind: hydrate
  - name: Implement
    kind: agent
  - name: AttemptToBreak
    kind: checkpoint
  - name: QualityGate
    kind: verify
  - name: ReviewGate
    kind: approval_gate

edges:
  - from: QualityGate
    to: ReviewGate
    condition: state.verified == true</code></pre>
        <div class="px-4 py-3 border-t border-zinc-800 font-mono text-xs text-zinc-400">
          <span class="text-zinc-500">$</span> agent-spine validate workflows/engineering-safety.yaml<br />
          <span class="text-zinc-300">validated state-machine workflow 'Engineering Safety' starting at node: Understand</span>
        </div>
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="max-w-6xl mx-auto px-6 py-16" id="platform">
    <div class="max-w-2xl mx-auto text-center mb-16">
      <div class="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">How it works</div>
      <h2 class="text-3xl sm:text-4xl font-bold font-headline text-white tracking-tight mb-4">One local daemon, one store, every host</h2>
      <p class="text-sm sm:text-base text-zinc-400 leading-relaxed font-body">The hosts connect to a shared background daemon through a stdio proxy. Writes go through a single write queue into one SQLite database.</p>
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

  <!-- PROOF POINTS -->
  <section class="max-w-6xl mx-auto px-6 py-16 border-t border-b border-zinc-900" id="benchmarks">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-left">
      {#each proof as item}
        <div class="p-5 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
          <div class="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">{item.label}</div>
          <div class="text-2xl sm:text-3xl font-bold text-white">{item.value}</div>
          <div class="text-zinc-500 text-[11px] mt-1">{item.note}</div>
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
        <h2 class="text-3xl font-bold font-headline text-white tracking-tight mb-4">Store, import and search facts without an agent</h2>
        <p class="text-sm text-zinc-400 leading-relaxed font-body mb-6">
          Store one fact, import a folder of Markdown, or check whether a new draft repeats something already stored. Every connected host reads the same store.
        </p>
        <ul class="space-y-3 text-sm text-zinc-300 font-body">
          <li class="flex gap-3"><span class="font-mono text-zinc-500 shrink-0">recall</span><span class="text-zinc-400">Text, tag and semantic search, with scores and a time window (--since).</span></li>
          <li class="flex gap-3"><span class="font-mono text-zinc-500 shrink-0">remember</span><span class="text-zinc-400">Stores one fact. Secret-like text and oversized text are refused.</span></li>
          <li class="flex gap-3"><span class="font-mono text-zinc-500 shrink-0">import-corpus</span><span class="text-zinc-400">Stores each paragraph of a folder. Re-importing the same text adds nothing.</span></li>
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
        <p class="text-sm text-zinc-400 leading-relaxed font-body mb-5">Benchmarks and other add-ons are extensions. Each one is checked against its registry SHA-256 before it installs.</p>
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
        <p class="text-sm text-zinc-400 leading-relaxed font-body mb-5">Memorable is off by default. Enabling its read-only server is a separate step. Sending traces to its extraction service needs a second flag, and only after the repository's last verify run passed.</p>
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
          <button type="button" onclick={() => activeTab = 'source'} class="px-3.5 py-1.5 rounded transition cursor-pointer {activeTab === 'source' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}">From source</button>
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

      <div class="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        <span>Release binaries are for macOS on Apple Silicon. Other platforms build from source and are not release targets.</span>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="max-w-4xl mx-auto px-6 text-center py-12">
    <div class="p-10 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/40 to-transparent">
      <h2 class="text-2xl sm:text-3xl font-bold font-headline text-white tracking-tight mb-3">
        Install it, run the doctor, and check what your agents have verified.
      </h2>
      <p class="text-sm text-zinc-400 max-w-lg mx-auto mb-6">
        Beta: the commands and behaviour on this page match the released agent-brain and agent-spine. Report what breaks.
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
          <span>agent-brain on GitHub</span>
          <ExternalLink class="w-3.5 h-3.5 text-zinc-500" />
        </a>
        <a
          href="https://github.com/autonomic-ai-dev/agent-spine"
          target="_blank"
          rel="noreferrer"
          class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors inline-flex items-center justify-center gap-1.5"
        >
          <span>agent-spine on GitHub</span>
          <ExternalLink class="w-3.5 h-3.5 text-zinc-500" />
        </a>
      </div>
    </div>
  </section>
</main>
