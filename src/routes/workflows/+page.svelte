<script lang="ts">
  import {
    Workflow,
    Package,
    ShieldCheck,
    Terminal,
    Search,
    Copy,
    Check,
    Layers,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Play,
    Sparkles,
    Cpu,
    GitBranch,
    FileCode,
    CheckCircle2
  } from "lucide-svelte";

  let searchQuery = $state("");
  let selectedCategory = $state<"all" | "workflow" | "package">("all");
  let expandedId = $state<string | null>(null);
  let copiedId = $state<string | null>(null);

  interface RegistryItem {
    id: string;
    title: string;
    type: "workflow" | "package";
    badge: string;
    organ: "agent-spine" | "agent-brain";
    description: string;
    command: string;
    tags: string[];
    steps?: string[];
    yaml?: string;
    author?: string;
  }

  const items: RegistryItem[] = [
    {
      id: "engineering-safety",
      title: "engineering-safety.yaml",
      type: "workflow",
      badge: "Safety Gate",
      organ: "agent-spine",
      description: "Invariant verification, AST blast-radius calculation, and immutable snapshot gate before agent commits.",
      command: "agent-spine run workflows/engineering-safety.yaml",
      tags: ["Safety", "Invariants", "AST Check", "Deterministic"],
      steps: ["Claim Verification", "Verify Harness (.verify/)", "Blast Radius Check", "Tamper-Proof Receipt"],
      yaml: `name: engineering-safety
version: 1.0.0
description: Pre-flight and post-execution invariant verification
steps:
  - id: check-invariants
    command: agent-brain verify -- cargo test --quiet
    allow_failure: false
  - id: ast-blast-radius
    command: agent-spine validate .verify/invariants.yaml
    allow_failure: false
  - id: tamper-proof-receipt
    command: agent-brain record-outcome --status success`
    },
    {
      id: "deep-code-review",
      title: "deep-code-review.yaml",
      type: "workflow",
      badge: "Multi-Agent Review",
      organ: "agent-spine",
      description: "Structured multi-agent review pipeline analyzing architecture, test coverage, safety vulnerabilities, and slop.",
      command: "agent-spine run workflows/deep-code-review.yaml",
      tags: ["Code Review", "Architecture", "Zero Regressions"],
      steps: ["Diff Extraction", "Security Audit", "Design Critique", "Review Report"],
      yaml: `name: deep-code-review
version: 1.0.0
description: Multi-perspective architecture and security code review
steps:
  - id: git-diff-analysis
    command: git diff HEAD~1
  - id: security-audit
    command: agent-spine run-tool security-audit
  - id: architecture-critique
    command: agent-spine run-tool architect`
    },
    {
      id: "feature-from-spec",
      title: "feature-from-spec.yaml",
      type: "workflow",
      badge: "Spec to PR",
      organ: "agent-spine",
      description: "Converts natural language specification into TDD scaffolding, implementation passes, and verified pull request.",
      command: "agent-spine run workflows/feature-from-spec.yaml",
      tags: ["TDD", "Automation", "PR Lifecycle"],
      steps: ["Parse Spec", "TDD Scaffold", "Implementation Pass", "Verify & PR"],
      yaml: `name: feature-from-spec
version: 1.0.0
description: End-to-end spec-to-PR pipeline with test-driven gates
steps:
  - id: requirements-contract
    command: agent-spine run-tool requirements-spec
  - id: test-scaffold
    command: cargo test --no-run
  - id: verify-suite
    command: agent-brain verify -- cargo test`
    },
    {
      id: "root-cause-analysis",
      title: "root-cause-analysis.yaml",
      type: "workflow",
      badge: "Auto Triage",
      organ: "agent-spine",
      description: "Automated bug reproduction, stacktrace triage, git bisection, and atomic regression test generation.",
      command: "agent-spine run workflows/root-cause-analysis.yaml",
      tags: ["Debugging", "Git Bisect", "Forensics"],
      steps: ["Reproduction Test", "Git Bisect", "Root Cause Pinpoint", "Regression Test"],
      yaml: `name: root-cause-analysis
version: 1.0.0
description: Automated bug reproduction and git bisection
steps:
  - id: isolate-failure
    command: agent-spine run-tool forensics
  - id: bisect-commit
    command: git bisect start HEAD origin/main`
    },
    {
      id: "database-migration",
      title: "database-migration.yaml",
      type: "workflow",
      badge: "Zero Downtime",
      organ: "agent-spine",
      description: "Zero-downtime database schema migration workflow with dry-run locks and automated rollback test harness.",
      command: "agent-spine run workflows/database-migration.yaml",
      tags: ["Database", "SQL", "Rollback Safe"],
      steps: ["Schema Diff", "Lock Contention Check", "Migration Dry Run", "Data Parity Test"],
      yaml: `name: database-migration
version: 1.0.0
description: Zero-downtime database schema migration
steps:
  - id: schema-check
    command: agent-spine run-tool db-check
  - id: rollback-dryrun
    command: agent-spine run-tool test-rollback`
    },
    {
      id: "brutal-refactor",
      title: "brutal-refactor.yaml",
      type: "workflow",
      badge: "Unslop Engine",
      organ: "agent-spine",
      description: "Strict unslop and code refactoring engine that eliminates dead abstractions with zero behavioral drift.",
      command: "agent-spine run workflows/brutal-refactor.yaml",
      tags: ["Refactoring", "Unslop", "Clean Code"],
      steps: ["State Snapshot", "Unslop Extraction", "Behavioral Parity Test", "Telemetry Check"],
      yaml: `name: brutal-refactor
version: 1.0.0
description: High-precision dead code elimination and zero drift refactor
steps:
  - id: pre-refactor-baseline
    command: agent-brain verify -- cargo test
  - id: remove-slop
    command: agent-spine run-tool unslop`
    },
    {
      id: "agstack-pkg",
      title: "@agstack",
      type: "package",
      badge: "Official Core Pack",
      organ: "agent-brain",
      author: "Abhiuday Gupta",
      description: "Universal engineering process: 43 playbooks, strict verification (.verify/), immutability, and zero comment slop.",
      command: "agent-brain package add @agstack",
      tags: ["Core Playbooks", "Verification", "Zero Slop", "Default Bootstrap"]
    },
    {
      id: "matt-skills-pkg",
      title: "@matt-skills",
      type: "package",
      badge: "Curated Pack",
      organ: "agent-brain",
      author: "Matt Pocock",
      description: "Matt Pocock skills for real engineers — design-first thinking, TDD, specifications, review, and issue triage.",
      command: "agent-brain package add @matt-skills",
      tags: ["TDD", "Specs", "Design Review", "TypeScript"]
    },
    {
      id: "gstack-pkg",
      title: "@gstack",
      type: "package",
      badge: "Curated Pack",
      organ: "agent-brain",
      author: "Garry Tan",
      description: "Garry Tan gstack — YC office hours, CEO review, engineering review, design review, devex review, and autoplan.",
      command: "agent-brain package add @gstack",
      tags: ["YC Office Hours", "CEO Review", "Design Critique"]
    },
    {
      id: "minimalist-entrepreneur-pkg",
      title: "@minimalist-entrepreneur",
      type: "package",
      badge: "Curated Pack",
      organ: "agent-brain",
      author: "Sahil Lavingia",
      description: "The Minimalist Entrepreneur skills — community building, validation, processize, MVP, first customers, and pricing.",
      command: "agent-brain package add @minimalist-entrepreneur",
      tags: ["Validation", "Community", "MVP", "SaaS Pricing"]
    },
    {
      id: "rust-pkg",
      title: "@rust",
      type: "package",
      badge: "Curated Pack",
      organ: "agent-brain",
      author: "ECC Affaan",
      description: "Rust patterns, borrow checker safety, zero-cost abstractions, criterion benchmarks, and strict test harness.",
      command: "agent-brain package add @rust",
      tags: ["Rust", "Safety", "Performance", "Clippy"]
    },
    {
      id: "release-notes-workflow",
      title: "@release-notes",
      type: "workflow",
      badge: "Changelog Engine",
      organ: "agent-spine",
      description: "Extracts semantic commit differentials, classifies user-facing updates, and writes formatted GitHub release notes.",
      command: "agent-spine run @release-notes",
      tags: ["Git Diffs", "Changelog", "SemVer"],
      steps: ["Git Log Extract", "Semantic Categorization", "Changelog Output"]
    },
    {
      id: "stacked-pr-workflow",
      title: "@stacked-pr",
      type: "workflow",
      badge: "Git Stack",
      organ: "agent-spine",
      description: "Manages dependent PR chains and rebase operations across complex multi-branch engineering tasks.",
      command: "agent-spine run @stacked-pr",
      tags: ["Git", "Stacked Diffs", "Rebase"],
      steps: ["Branch Chain Inspect", "Dependency Graph", "Stacked Push"]
    },
    {
      id: "mcp-health-check-workflow",
      title: "@mcp-health-check",
      type: "workflow",
      badge: "Diagnostics",
      organ: "agent-spine",
      description: "Live ping, latency benchmark, and schema assertion across all registered upstream Model Context Protocol daemons.",
      command: "agent-spine run @mcp-health-check",
      tags: ["MCP", "Diagnostics", "Latency Benchmark"],
      steps: ["MCP Handshake", "Ping Latency Check", "Tool Schema Assertion"]
    }
  ];

  let filteredItems = $derived.by(() => {
    let result = items;
    if (selectedCategory !== "all") {
      result = result.filter(item => item.type === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q)) ||
        item.command.toLowerCase().includes(q)
      );
    }
    return result;
  });

  function copyCommand(id: string, text: string) {
    navigator.clipboard.writeText(text);
    copiedId = id;
    setTimeout(() => {
      if (copiedId === id) copiedId = null;
    }, 2000);
  }

  function toggleExpand(id: string) {
    expandedId = expandedId === id ? null : id;
  }
</script>

<svelte:head>
  <title>Workflows & Skill Packages — Autonomic AI Registry</title>
  <meta name="description" content="Explore deterministic DAG workflows for agent-spine and curated skill packages for agent-brain. Zero hallucination, tamper-proof receipts." />
  <meta property="og:title" content="Workflows & Skill Packages — Autonomic AI Registry" />
  <meta property="og:description" content="Deterministic DAG workflows for agent-spine and curated skill packages for agent-brain." />
  <link rel="canonical" href="https://autonomic-ai.dev/workflows" />
</svelte:head>

<div class="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
  
  <!-- Breadcrumb & Cluster HUD Cockpit -->
  <section class="rounded-2xl bg-slate-950/80 border border-cyan-500/20 p-6 shadow-2xl relative overflow-hidden mb-10">
    <div class="absolute -top-24 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
      
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
          <span class="text-cyan-400 font-semibold tracking-wider uppercase">autonomic-os</span>
          <span class="text-slate-600">//</span>
          <span class="text-slate-300">registry</span>
          <span class="text-slate-600">//</span>
          <span class="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">workflows & packages</span>
        </div>
        
        <h1 class="text-2xl sm:text-3xl font-headline font-bold text-white tracking-tight">
          Workflows & Registry Hub
        </h1>
        <p class="text-sm font-body text-slate-300 max-w-2xl leading-relaxed">
          Deterministic DAG orchestrations executed by <code class="font-mono text-cyan-300">agent-spine</code> and curated skill packages synced by <code class="font-mono text-cyan-300">agent-brain</code>. Built for reproducible engineering with verified receipts.
        </p>
      </div>

      <!-- Live Quickstart Command Card -->
      <div class="rounded-xl bg-slate-900/90 border border-slate-800 p-4 shrink-0 font-mono text-xs w-full lg:w-96 shadow-lg">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="flex items-center gap-1.5 text-cyan-400 font-medium">
            <Terminal size={14} />
            <span>EXECUTE WORKFLOW</span>
          </span>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">agent-spine</span>
        </div>
        <div class="bg-black/60 rounded-lg p-2.5 text-slate-300 border border-white/5 flex items-center justify-between group">
          <span class="truncate pr-2 text-cyan-200">$ agent-spine run @engineering-safety</span>
          <button 
            onclick={() => copyCommand('quickstart', 'agent-spine run workflows/engineering-safety.yaml')}
            class="text-slate-400 hover:text-cyan-300 transition p-1"
            title="Copy command"
            aria-label="Copy quickstart command"
          >
            {#if copiedId === 'quickstart'}
              <Check size={14} class="text-emerald-400" />
            {:else}
              <Copy size={14} />
            {/if}
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Controls: Filter Pills & Search Input -->
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
    
    <!-- Category Filter Tabs -->
    <div class="inline-flex p-1.5 rounded-xl bg-slate-950/80 border border-white/10 shadow-lg w-full sm:w-auto">
      <button 
        onclick={() => selectedCategory = 'all'} 
        class="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-mono font-semibold transition flex items-center justify-center gap-1.5 {selectedCategory === 'all' ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-white'}"
      >
        <Layers size={13} />
        <span>All Items ({items.length})</span>
      </button>

      <button 
        onclick={() => selectedCategory = 'workflow'} 
        class="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-mono font-semibold transition flex items-center justify-center gap-1.5 {selectedCategory === 'workflow' ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-white'}"
      >
        <Workflow size={13} />
        <span>DAG Workflows ({items.filter(i => i.type === 'workflow').length})</span>
      </button>

      <button 
        onclick={() => selectedCategory = 'package'} 
        class="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-mono font-semibold transition flex items-center justify-center gap-1.5 {selectedCategory === 'package' ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-white'}"
      >
        <Package size={13} />
        <span>Skill Packages ({items.filter(i => i.type === 'package').length})</span>
      </button>
    </div>

    <!-- Live Search Filter -->
    <div class="relative w-full sm:w-80">
      <Search size={15} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
      <input 
        type="text" 
        bind:value={searchQuery}
        placeholder="Search workflows, packages, tags..."
        class="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 shadow-inner transition"
      />
      {#if searchQuery}
        <button 
          onclick={() => searchQuery = ""}
          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono"
        >
          ✕
        </button>
      {/if}
    </div>
  </div>

  <!-- Bento Grid of Registry Items -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each filteredItems as item}
      <div class="rounded-2xl bg-slate-950/70 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 p-6 flex flex-col justify-between shadow-xl group hover:shadow-cyan-500/5 hover:-translate-y-0.5">
        <div>
          <!-- Card Header: Title & Badges -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 {item.type === 'workflow' ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' : 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400'}">
                {#if item.type === 'workflow'}
                  <Workflow size={16} />
                {:else}
                  <Package size={16} />
                {/if}
              </div>
              <h3 class="font-headline font-bold text-base text-white truncate group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 {item.type === 'workflow' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30' : 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30'}">
              {item.badge}
            </span>
          </div>

          <!-- Description -->
          <p class="text-xs font-body text-slate-300 leading-relaxed mb-4">
            {item.description}
          </p>

          <!-- Steps or Author Pill -->
          {#if item.steps}
            <div class="mb-4 space-y-1.5 bg-black/40 p-3 rounded-xl border border-white/5">
              <div class="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>DAG Transition Pipeline</span>
                <span class="text-cyan-400">{item.steps.length} Gates</span>
              </div>
              <div class="flex flex-wrap items-center gap-1.5">
                {#each item.steps as step, idx}
                  <span class="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded">
                    <span class="text-cyan-400 text-[10px]">{idx + 1}.</span> {step}
                  </span>
                {/each}
              </div>
            </div>
          {:else if item.author}
            <div class="mb-4 flex items-center justify-between text-xs font-mono bg-black/40 px-3 py-2 rounded-xl border border-white/5">
              <span class="text-slate-400">Curator</span>
              <span class="text-cyan-300 font-semibold">{item.author}</span>
            </div>
          {/if}

          <!-- Tag Pills -->
          <div class="flex flex-wrap gap-1.5 mb-5">
            {#each item.tags as tag}
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-800">
                {tag}
              </span>
            {/each}
          </div>
        </div>

        <!-- Card Footer: Command & Inspection Trigger -->
        <div class="pt-4 border-t border-white/5 space-y-3">
          <!-- Command Prompt Box with Copy -->
          <div class="flex items-center justify-between bg-black/60 rounded-xl px-3 py-2 border border-white/10 group/cmd">
            <code class="text-xs font-mono text-cyan-300 truncate pr-2 select-all">
              {item.command}
            </code>
            <button 
              onclick={() => copyCommand(item.id, item.command)}
              class="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
              title="Copy Command"
              aria-label="Copy command"
            >
              {#if copiedId === item.id}
                <Check size={14} class="text-emerald-400" />
              {:else}
                <Copy size={14} />
              {/if}
            </button>
          </div>

          <!-- Expandable YAML Spec Preview for Workflows -->
          {#if item.yaml}
            <div>
              <button 
                onclick={() => toggleExpand(item.id)}
                class="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition py-1"
              >
                <span>{expandedId === item.id ? 'Hide DAG YAML' : 'Inspect YAML Spec'}</span>
                {#if expandedId === item.id}
                  <ChevronUp size={13} />
                {:else}
                  <ChevronDown size={13} />
                {/if}
              </button>
              
              {#if expandedId === item.id}
                <div class="mt-2 p-3 bg-black/80 rounded-xl border border-cyan-500/20 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
                  <pre class="bg-transparent border-0 p-0 m-0"><code>{item.yaml}</code></pre>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <!-- Bottom CTA: How to Submit to the Registry -->
  <section class="mt-16 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-950/80 to-indigo-950/40 border border-cyan-500/20 p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
    <div class="space-y-2">
      <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/30">
        <Sparkles size={13} />
        <span>OPEN REGISTRY SPECIFICATION</span>
      </div>
      <h3 class="text-xl font-headline font-bold text-white">Publish your DAG workflow or skill package</h3>
      <p class="text-xs font-body text-slate-300 max-w-xl">
        Every workflow in the Autonomic Registry is version-pinned, deterministic, and executes in an isolated harness. Submit your package to <code class="font-mono text-cyan-300">agent-registry/registry.json</code> via Pull Request.
      </p>
    </div>
    <div class="flex items-center gap-3 shrink-0">
      <a 
        href="https://github.com/autonomic-ai-dev/agent-registry" 
        target="_blank" 
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200 active:scale-95"
      >
        <span>Contribute on GitHub</span>
        <ExternalLink size={14} />
      </a>
      <a 
        href="/docs/workflows" 
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition"
      >
        <span>Workflow Docs</span>
      </a>
    </div>
  </section>

</div>
