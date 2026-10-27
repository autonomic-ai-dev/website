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
    ExternalLink,
    Brain,
    Package,
    Code2,
    BookOpen
  } from "lucide-svelte";

  let searchQuery = $state("");
  let selectedTab = $state<"all" | "workflow" | "package">("all");
  let selectedCategory = $state<string>("all");
  let activeTerminalTab = $state<"cli" | "spec" | "seal">("cli");
  let copiedId = $state<string | null>(null);

  interface RegistryItem {
    id: string;
    title: string;
    kind: "workflow" | "package";
    version: string;
    category: "Engineering SDLC" | "Startup & Product" | "Review & QA" | "Language & Frameworks";
    engine: "agent-spine" | "agent-brain";
    statusBadge: string;
    description: string;
    stagesOrSkills: string[];
    tags: string[];
    command: string;
    latencyOrMemory: string;
    seal: string;
    featured?: boolean;
    spec?: string;
  }

  const items: RegistryItem[] = [
    // --- SPINE WORKFLOWS ---
    {
      id: "feature",
      title: "@feature",
      kind: "workflow",
      version: "v2.0.0",
      category: "Engineering SDLC",
      engine: "agent-spine",
      statusBadge: "Verified DAG",
      featured: true,
      description: "Context & intent → domain model → 4-H2 contract → implement → verify → security gate → review gate.",
      stagesOrSkills: ["Context & Intent", "Domain Model", "Implementation", "Verify Harness", "Security Gate", "Review Gate"],
      tags: ["#agent-spine", "#dag", "#feature-lifecycle", "#approval-gate"],
      command: "agent-spine init --with @feature",
      latencyOrMemory: "~65s",
      seal: "sha256:4a12...8e2",
      spec: `name: Feature Lifecycle
version: 2
min_spine_version: "0.19.0"
start_node: ContextAndIntent

nodes:
  - name: ContextAndIntent
    kind: agent
    description: Ground intent in repository domain model and AST symbols.
  - name: FourPartContract
    kind: agent
    description: Draft 4-part specification (Domain, Types, Errors, Invariants).
  - name: Implementation
    kind: agent
    description: Minimal code modification respecting immutability.
  - name: VerifyHarness
    kind: agent
    description: Isolated test execution writing proof to .verify/.
  - name: SecurityGate
    kind: approval_gate
    description: Review boundary isolation and credential checks.
  - name: ReviewGate
    kind: approval_gate
    description: Final engineering review prior to merge.`
    },
    {
      id: "bugfix",
      title: "@bugfix",
      kind: "workflow",
      version: "v2.0.0",
      category: "Engineering SDLC",
      engine: "agent-spine",
      statusBadge: "Verified DAG",
      featured: true,
      description: "Systematic bug reproduction → boundary isolation → regression test → fix → verify loop.",
      stagesOrSkills: ["Reproduce Bug", "Isolate Defect", "Regression Test", "Apply Fix", "Verify Loop"],
      tags: ["#agent-spine", "#bugfix", "#root-cause", "#zero-token-burn"],
      command: "agent-spine init --with @bugfix",
      latencyOrMemory: "~38s",
      seal: "sha256:7b91...4df",
      spec: `name: Bugfix Loop
version: 2
min_spine_version: "0.19.0"
start_node: Reproduce

nodes:
  - name: Reproduce
    kind: agent
    description: Construct failing test in .verify/ reproducing exact symptoms.
  - name: Isolate
    kind: agent
    description: Trace AST callers and isolate root cause logic flaw.
  - name: Fix
    kind: agent
    description: Apply minimal architectural fix without defensive nulls.
  - name: VerifyLoop
    kind: agent
    description: Execute verify suite until clean exit 0 is recorded.`
    },
    {
      id: "gstack-workflow",
      title: "@gstack (Workflow)",
      kind: "workflow",
      version: "v2.0.0",
      category: "Review & QA",
      engine: "agent-spine",
      statusBadge: "Verified DAG",
      featured: true,
      description: "Garry Tan Review Engine: YC Office Hours → Autoplan → Eng Review → Design Review → CEO Gate → QA Lead.",
      stagesOrSkills: ["YC Office Hours", "Autoplan", "Eng Review", "Design Review", "CEO Review Gate", "QA Lead"],
      tags: ["#agent-spine", "#gstack", "#garry-tan", "#ceo-review"],
      command: "agent-spine init --with @gstack",
      latencyOrMemory: "~52s",
      seal: "sha256:5e33...90a",
      spec: `name: Garry Tan gstack Review Engine
version: 2
min_spine_version: "0.19.0"
start_node: YCOfficeHours

nodes:
  - name: YCOfficeHours
    kind: agent
    description: Clarify value proposition and core customer before coding.
  - name: Autoplan
    kind: agent
    description: Decompose mission into strict milestone deliverables.
  - name: EngReview
    kind: agent
    description: Audit against agstack invariants (immutability, zero comments).
  - name: DesignReview
    kind: agent
    description: Check typography, contrast ratios, and responsive layout.
  - name: CEOReviewGate
    kind: approval_gate
    description: Founder signs off on customer experience before deploy.
  - name: QALead
    kind: agent
    description: Execute end-to-end regression tests and seal proof.`
    },
    {
      id: "minimalist-entrepreneur-workflow",
      title: "@minimalist-entrepreneur (Workflow)",
      kind: "workflow",
      version: "v2.0.0",
      category: "Startup & Product",
      engine: "agent-spine",
      statusBadge: "Verified DAG",
      description: "Sahil Lavingia Lifecycle: Community discovery → problem validation → minimal MVP → customer signoff gate → scale.",
      stagesOrSkills: ["Community Discovery", "Problem Validation", "Minimal MVP", "Customer Signoff Gate", "Processize & Scale"],
      tags: ["#agent-spine", "#minimalist-entrepreneur", "#sahil", "#mvp"],
      command: "agent-spine init --with @minimalist-entrepreneur",
      latencyOrMemory: "~45s",
      seal: "sha256:3a88...1bc",
      spec: `name: Minimalist Entrepreneur Lifecycle
version: 2
min_spine_version: "0.19.0"
start_node: CommunityDiscovery

nodes:
  - name: CommunityDiscovery
    kind: agent
    description: Listen to underserved community pain points.
  - name: ProblemValidation
    kind: agent
    description: Confirm willingness to pay before writing any code.
  - name: BuildMinimalMVP
    kind: agent
    description: Scaffold leanest functional product that solves problem.
  - name: CustomerSignoffGate
    kind: approval_gate
    description: Founder validates first paying customer commitments.
  - name: ProcessizeAndScale
    kind: agent
    description: Automate delivery runbooks for sustainable growth.`
    },
    {
      id: "stacked-pr",
      title: "@stacked-pr",
      kind: "workflow",
      version: "v2.0.0",
      category: "Engineering SDLC",
      engine: "agent-spine",
      statusBadge: "Verified DAG",
      description: "Rebase stacked branch dependencies, resolve AST conflicts, and verify clean test suites across branches.",
      stagesOrSkills: ["Inspect Stack", "Rebase Worktree", "Resolve Conflicts", "Verify Harness", "Sealed PR"],
      tags: ["#agent-spine", "#git", "#stacked-branches", "#auto-verify"],
      command: "agent-spine init --with @stacked-pr",
      latencyOrMemory: "~42s",
      seal: "sha256:9f8a...31c",
      spec: `name: Stacked PR & Delivery
version: 2
min_spine_version: "0.19.0"
start_node: InspectStack

nodes:
  - name: InspectStack
    kind: agent
    description: Inspect git branch topology and dependency order.
  - name: RebaseWorktree
    kind: agent
    description: Rebase commits cleanly onto upstream branch.
  - name: VerifyHarness
    kind: agent
    description: Run test suites and record zero-regression evidence.`
    },
    {
      id: "release-notes",
      title: "@release-notes",
      kind: "workflow",
      version: "v2.0.0",
      category: "Engineering SDLC",
      engine: "agent-spine",
      statusBadge: "Verified DAG",
      description: "Tag diff → conventional commit grouping → changelog authoring → review gate → GitHub release.",
      stagesOrSkills: ["Collect Diff", "Draft Notes", "Review Gate", "Publish Changelog"],
      tags: ["#agent-spine", "#release", "#diataxis", "#changelog"],
      command: "agent-spine init --with @release-notes",
      latencyOrMemory: "~28s",
      seal: "sha256:1a99...66b",
      spec: `name: Release Notes
version: 2
min_spine_version: "0.19.0"
start_node: CollectDiff

nodes:
  - name: CollectDiff
    kind: agent
    description: Gather commit log, tag diff, and conventional scopes.
  - name: DraftNotes
    kind: agent
    description: Author notes adhering to STE and Diátaxis specs.
  - name: ReviewGate
    kind: approval_gate
    description: Human reviews notes before publishing.
  - name: Publish
    kind: agent
    description: Commit CHANGELOG.md and publish GitHub release.`
    },
    {
      id: "mcp-health-check",
      title: "@mcp-health-check",
      kind: "workflow",
      version: "v2.0.0",
      category: "Engineering SDLC",
      engine: "agent-spine",
      statusBadge: "Verified DAG",
      description: "agent-brain doctor diagnostics, skill_search latency probe, and route_task routing verification.",
      stagesOrSkills: ["Audit Schemas", "Doctor Diagnostics", "Route Probe", "Telemetry Health"],
      tags: ["#agent-spine", "#mcp", "#doctor", "#routing-verify"],
      command: "agent-spine init --with @mcp-health-check",
      latencyOrMemory: "~15s",
      seal: "sha256:0d12...fa1",
      spec: `name: MCP Health Check
version: 2
min_spine_version: "0.19.0"
start_node: AuditSchemas

nodes:
  - name: AuditSchemas
    kind: agent
    description: Validate all MCP server tools against JSON schema.
  - name: DoctorDiagnostics
    kind: agent
    description: Run agent-brain doctor diagnostic checks.
  - name: RouteProbe
    kind: agent
    description: Probe route_task to verify deterministic routing response.`
    },

    // --- BRAIN SKILL PACKAGES ---
    {
      id: "agstack-pkg",
      title: "@agstack",
      kind: "package",
      version: "v1.0.0",
      category: "Engineering SDLC",
      engine: "agent-brain",
      statusBadge: "Core SDLC Bundle",
      featured: true,
      description: "The official Abhiuday Gupta Stack: 5 mandatory invariants, immutability, zero comment slop, and .verify/ harness.",
      stagesOrSkills: ["Immutability First", "Boundary Discipline", "Fix Root Causes", "Zero Comment Slop", "Verification Root"],
      tags: ["#agent-brain", "#sdlc", "#invariants", "#verify-root"],
      command: "agent-brain package add @agstack",
      latencyOrMemory: "4096-dim Vector",
      seal: "sha256:cc90...41e",
      spec: `package: @agstack
description: Universal engineering process, playbooks, strict verification (.verify/), immutability, and zero comment slop
default_bootstrap: true
recommend_boost: 0.40
rules:
  - immutability-first
  - zero-comment-slop
  - boundary-discipline
  - fix-root-causes
  - verify-root-separation`
    },
    {
      id: "gstack-pkg",
      title: "@gstack (Skills)",
      kind: "package",
      version: "v1.2.0",
      category: "Review & QA",
      engine: "agent-brain",
      statusBadge: "Curated Skills",
      featured: true,
      description: "Garry Tan gstack: YC office hours, CEO review, eng review, design review, devex review, autoplan, QA lead.",
      stagesOrSkills: ["yc-office-hours", "ceo-review", "eng-review", "design-review", "devex-review", "autoplan", "qa-lead"],
      tags: ["#agent-brain", "#yc", "#garry-tan", "#reviews"],
      command: "agent-brain package add @gstack",
      latencyOrMemory: "Curated Git Repo",
      seal: "sha256:88fa...b02",
      spec: `package: @gstack
git_url: https://github.com/garrytan/gstack.git
git_ref: main
description: Garry Tan gstack — YC office hours, CEO review, eng review, design review, devex review, autoplan, QA lead
default_bootstrap: true
recommend_boost: 0.35`
    },
    {
      id: "minimalist-entrepreneur-pkg",
      title: "@minimalist-entrepreneur (Skills)",
      kind: "package",
      version: "v1.0.0",
      category: "Startup & Product",
      engine: "agent-brain",
      statusBadge: "Curated Skills",
      description: "The Minimalist Entrepreneur skills (Sahil Lavingia): community, validation, processize, MVP, first customers, pricing, marketing, growth, culture.",
      stagesOrSkills: ["community", "validation", "processize", "mvp", "first-customers", "pricing", "marketing", "growth"],
      tags: ["#agent-brain", "#sahil", "#minimalist-entrepreneur", "#business"],
      command: "agent-brain package add @minimalist-entrepreneur",
      latencyOrMemory: "Curated Git Repo",
      seal: "sha256:77bc...19d",
      spec: `package: @minimalist-entrepreneur
git_url: https://github.com/slavingia/skills.git
git_ref: main
description: The Minimalist Entrepreneur skills (Sahil Lavingia) — community, validation, processize, MVP, first customers, pricing, marketing, growth, culture`
    },
    {
      id: "matt-skills-pkg",
      title: "@matt-skills",
      kind: "package",
      version: "v1.1.0",
      category: "Engineering SDLC",
      engine: "agent-brain",
      statusBadge: "Curated Skills",
      featured: true,
      description: "Matt Pocock skills for real engineers: software design, TDD cycles, technical specs, code review, bug triage.",
      stagesOrSkills: ["software-design", "tdd", "specs", "code-review", "bug-triage"],
      tags: ["#agent-brain", "#matt-pocock", "#tdd", "#typescript"],
      command: "agent-brain package add @matt-skills",
      latencyOrMemory: "Curated Git Repo",
      seal: "sha256:33de...88a",
      spec: `package: @matt-skills
git_url: https://github.com/mattpocock/skills.git
git_ref: main
description: Matt Pocock skills for real engineers — design, TDD, specs, review, triage
default_bootstrap: true
recommend_boost: 0.35`
    },
    {
      id: "nextjs-pkg",
      title: "@nextjs",
      kind: "package",
      version: "v15.0.0",
      category: "Language & Frameworks",
      engine: "agent-brain",
      statusBadge: "Official Bundle",
      description: "Vercel React, Next.js App Router, React Server Components, Server Actions, and React Native agent skills.",
      stagesOrSkills: ["app-router", "rsc", "server-actions", "caching", "edge-runtime"],
      tags: ["#agent-brain", "#vercel", "#nextjs", "#react"],
      command: "agent-brain package add @nextjs",
      latencyOrMemory: "Curated Git Repo",
      seal: "sha256:12eb...f03",
      spec: `package: @nextjs
git_url: https://github.com/vercel-labs/agent-skills.git
git_ref: main
description: Vercel React, Next.js, and React Native agent skills`
    },
    {
      id: "rust-pkg",
      title: "@rust",
      kind: "package",
      version: "v1.82.0",
      category: "Language & Frameworks",
      engine: "agent-brain",
      statusBadge: "Curated Skills",
      description: "Idiomatic Rust patterns, borrow checker safety, zero-cost abstractions, cargo test harnesses, and clippy lints.",
      stagesOrSkills: ["borrow-checker", "error-handling", "tokio-concurrency", "cargo-test", "clippy-invariants"],
      tags: ["#agent-brain", "#rust", "#cargo", "#systems"],
      command: "agent-brain package add @rust",
      latencyOrMemory: "Curated Git Repo",
      seal: "sha256:99ac...881",
      spec: `package: @rust
git_url: https://github.com/affaan-m/everything-claude-code.git
git_ref: main
description: Rust patterns, testing, and review (via ECC)`
    },
    {
      id: "claude-skills-pkg",
      title: "@claude-skills",
      kind: "package",
      version: "v2.0.0",
      category: "Engineering SDLC",
      engine: "agent-brain",
      statusBadge: "Curated Skills",
      description: "Jeff Allan curated Claude skills library for architectural refactoring, invariant enforcement, and prompt hygiene.",
      stagesOrSkills: ["architecture-refactor", "prompt-hygiene", "security-audit", "test-generation"],
      tags: ["#agent-brain", "#claude", "#refactoring"],
      command: "agent-brain package add @claude-skills",
      latencyOrMemory: "Curated Git Repo",
      seal: "sha256:44ef...771",
      spec: `package: @claude-skills
git_url: https://github.com/jeffallan/claude-skills.git
git_ref: main
description: Jeff Allan curated Claude skills library`
    },
    {
      id: "ecc-pkg",
      title: "@ecc",
      kind: "package",
      version: "v3.0.0",
      category: "Engineering SDLC",
      engine: "agent-brain",
      statusBadge: "Curated Skills",
      description: "Everything Claude Code — comprehensive curated skill repository spanning full-stack web, distributed systems, and tooling.",
      stagesOrSkills: ["fullstack-patterns", "distributed-systems", "database-migration", "api-design"],
      tags: ["#agent-brain", "#ecc", "#claude-code"],
      command: "agent-brain package add @ecc",
      latencyOrMemory: "Curated Git Repo",
      seal: "sha256:66ab...99c",
      spec: `package: @ecc
git_url: https://github.com/affaan-m/everything-claude-code.git
git_ref: main
description: Everything Claude Code — large curated skill library`
    }
  ];

  let selectedItem = $state<RegistryItem>(items[0]);

  let filteredItems = $derived(
    items.filter((item) => {
      const matchesTab =
        selectedTab === "all" ||
        (selectedTab === "workflow" && item.kind === "workflow") ||
        (selectedTab === "package" && item.kind === "package");

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.command.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return matchesTab && matchesCategory && matchesSearch;
    })
  );

  // Keep selectedItem synchronized with the active filter:
  // Whenever the tab/category/search changes, default-select the first visible item if the current selection is filtered out.
  $effect(() => {
    if (filteredItems.length > 0 && !filteredItems.some((item) => item.id === selectedItem?.id)) {
      selectedItem = filteredItems[0];
    }
  });

  function copyCommand(id: string, text: string) {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      copiedId = id;
      setTimeout(() => {
        copiedId = null;
      }, 2000);
    }
  }
</script>

<svelte:head>
  <title>Autonomic Registry — Curated DAG Workflows & Brain Skill Packages</title>
  <meta name="description" content="Explore deterministic Spine DAG workflows and Brain skill packages for autonomous AI software engineering." />
  <link rel="canonical" href="https://autonomic-ai.dev/registry" />
</svelte:head>

<div class="relative min-h-screen bg-black text-neutral-100 font-body antialiased selection:bg-neutral-800 selection:text-white pb-24">
  
  <!-- Subtle Background Grid & Glows -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none"></div>
  <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">

    <!-- HERO SECTION -->
    <header class="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-neutral-300 mb-6">
        <Sparkles size={13} class="text-neutral-400" />
        <span>Autonomic Registry • Dual-Engine Ecosystem</span>
      </div>

      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-headline font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
        Deterministic Workflows & <br />
        <span class="text-white">
          Curated Skill Packages
        </span>
      </h1>

      <p class="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed font-body">
        Browse certified <span class="text-white font-mono font-medium">agent-spine</span> DAG workflows for multi-step state execution, and <span class="text-white font-mono font-medium">agent-brain</span> skill bundles for token-bounded cognitive reasoning.
      </p>

      <!-- Quick Metrics Pill Banner -->
      <div class="mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs font-mono text-neutral-400">
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-950/80 border border-white/10">
          <Workflow size={13} class="text-neutral-300" />
          <span>7 Verified Spine DAGs</span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-950/80 border border-white/10">
          <Brain size={13} class="text-neutral-300" />
          <span>8 Audited Skill Packages</span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-950/80 border border-white/10">
          <Shield size={13} class="text-emerald-400" />
          <span>100% .verify/ Proven</span>
        </div>
      </div>
    </header>

    <!-- CONTROLS: Engine Filter Tabs + Category Selector + Search Input -->
    <div class="mb-10 space-y-4">
      <div class="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        <!-- Engine / Kind Switcher -->
        <div class="inline-flex p-1 rounded-xl bg-neutral-950 border border-white/10 backdrop-blur-sm">
          <button
            onclick={() => selectedTab = "all"}
            class="px-4 py-2 rounded-lg text-xs font-headline font-semibold transition-all {selectedTab === 'all' ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-white'}"
          >
            All Resources ({items.length})
          </button>
          <button
            onclick={() => selectedTab = "workflow"}
            class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-headline font-semibold transition-all {selectedTab === 'workflow' ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-white'}"
          >
            <Workflow size={13} />
            <span>Spine Workflows (7)</span>
          </button>
          <button
            onclick={() => selectedTab = "package"}
            class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-headline font-semibold transition-all {selectedTab === 'package' ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-white'}"
          >
            <Brain size={13} />
            <span>Brain Packages (8)</span>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative flex-1 max-w-md">
          <Search size={15} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search by title, tag (#dag, #sdlc), or command..."
            class="w-full bg-neutral-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition"
          />
          {#if searchQuery}
            <button
              onclick={() => searchQuery = ""}
              class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs font-mono"
            >
              clear
            </button>
          {/if}
        </div>
      </div>

      <!-- Categories Row -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span class="text-neutral-500 font-mono text-[11px] uppercase tracking-wider shrink-0 mr-1">Scope:</span>
        {#each ["all", "Engineering SDLC", "Startup & Product", "Review & QA", "Language & Frameworks"] as cat}
          <button
            onclick={() => selectedCategory = cat}
            class="px-3 py-1 rounded-lg border text-xs font-medium transition-all shrink-0 {selectedCategory === cat ? 'bg-white text-black font-semibold border-white' : 'bg-white/[0.04] text-neutral-400 border-white/[0.08] hover:border-white/20 hover:text-white'}"
          >
            {cat === "all" ? "All Categories" : cat}
          </button>
        {/each}
      </div>
    </div>

    <!-- MAIN TWO-COLUMN LAYOUT: Cards Grid (Left) + Interactive Inspector (Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- LEFT COLUMN: Grid of Items (8 Cols) -->
      <div class="lg:col-span-7 xl:col-span-8 space-y-4">
        {#if filteredItems.length === 0}
          <div class="p-12 text-center rounded-2xl border border-white/[0.06] bg-slate-950/40">
            <Layers size={32} class="text-slate-600 mx-auto mb-3" />
            <h3 class="font-headline font-bold text-white text-base">No registry resources found</h3>
            <p class="text-xs text-slate-400 mt-1">Try modifying your query or selecting "All Resources".</p>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each filteredItems as item}
              <div
                role="button"
                tabindex="0"
                onclick={() => selectedItem = item}
                onkeydown={(e) => { if (e.key === 'Enter') selectedItem = item; }}
                class="group text-left p-5 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between {selectedItem.id === item.id ? 'bg-neutral-900 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.06)]' : 'bg-neutral-950/60 border-white/10 hover:border-white/20 hover:bg-neutral-900/40'}"
              >
                <div>
                  <!-- Top Badge Row -->
                  <div class="flex items-center justify-between mb-3">
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/[0.04] text-neutral-300 border border-white/10">
                      {#if item.kind === 'workflow'}
                        <Workflow size={10} />
                        <span>Spine DAG</span>
                      {:else}
                        <Brain size={10} />
                        <span>Brain Pkg</span>
                      {/if}
                    </span>

                    <span class="text-[10px] font-mono text-neutral-500">{item.version}</span>
                  </div>

                  <!-- Title -->
                  <h3 class="font-headline text-base font-bold text-white group-hover:text-neutral-200 transition-colors flex items-center justify-between">
                    <span>{item.title}</span>
                    {#if selectedItem.id === item.id}
                      <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                    {/if}
                  </h3>

                  <!-- Description -->
                  <p class="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <!-- Footer & Command Action -->
                <div class="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div class="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500">
                    <span>{item.latencyOrMemory}</span>
                  </div>

                  <button
                    onclick={(e) => {
                      e.stopPropagation();
                      copyCommand(item.id, item.command);
                    }}
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/[0.04] hover:bg-white/[0.1] text-neutral-300 hover:text-white border border-white/10 transition"
                  >
                    {#if copiedId === item.id}
                      <Check size={11} class="text-emerald-400" />
                      <span class="text-emerald-400">Copied</span>
                    {:else}
                      <Copy size={11} />
                      <span>Copy</span>
                    {/if}
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- RIGHT COLUMN: Interactive Inspector & Blueprint Terminal (4-5 Cols) -->
      <aside class="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4">
        <div class="p-6 rounded-2xl bg-slate-950/80 border border-white/[0.1] shadow-2xl backdrop-blur-md">
          
          <!-- Inspector Header -->
          <div class="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-white"></div>
              <span class="font-headline font-bold text-white text-sm">Resource Inspector</span>
            </div>
            <span class="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30">
              {selectedItem.statusBadge}
            </span>
          </div>

          <!-- Inspector Content -->
          <div class="mt-4 space-y-4">
            <div>
              <h2 class="text-lg font-headline font-extrabold text-white">{selectedItem.title}</h2>
              <p class="text-xs text-neutral-400 mt-1 leading-relaxed">{selectedItem.description}</p>
            </div>

            <!-- Stages or Skills Chips -->
            <div>
              <span class="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-2">
                {selectedItem.kind === 'workflow' ? 'DAG Stage Progression:' : 'Included Skills / Invariants:'}
              </span>
              <div class="flex flex-wrap gap-1.5">
                {#each selectedItem.stagesOrSkills as stage}
                  <span class="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.04] text-neutral-300 border border-white/[0.08]">
                    {stage}
                  </span>
                {/each}
              </div>
            </div>

            <!-- Code Execution Block -->
            <div>
              <span class="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1.5">
                Terminal Execution:
              </span>
              <div class="p-3 rounded-xl bg-black border border-white/10 flex items-center justify-between font-mono text-xs">
                <span class="text-neutral-200 truncate mr-2">{selectedItem.command}</span>
                <button
                  onclick={() => copyCommand(`inspector-${selectedItem.id}`, selectedItem.command)}
                  class="p-1.5 rounded-lg hover:bg-white/[0.1] text-neutral-400 hover:text-white transition"
                  title="Copy command"
                >
                  {#if copiedId === `inspector-${selectedItem.id}`}
                    <Check size={13} class="text-emerald-400" />
                  {:else}
                    <Copy size={13} />
                  {/if}
                </button>
              </div>
            </div>

            <!-- Blueprint / Spec Preview -->
            {#if selectedItem.spec}
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                    {selectedItem.kind === 'workflow' ? 'YAML Blueprint Manifest:' : 'Package Specification:'}
                  </span>
                  <span class="text-[10px] font-mono text-neutral-500">{selectedItem.seal}</span>
                </div>
                <pre class="p-3.5 rounded-xl bg-black border border-white/10 text-[11px] font-mono text-neutral-300 overflow-x-auto max-h-56 leading-relaxed"><code>{selectedItem.spec}</code></pre>
              </div>
            {/if}

            <!-- Quick Jump Link to Docs -->
            <div class="pt-2">
              {#if selectedItem.id === 'minimalist-entrepreneur-pkg' || selectedItem.id === 'minimalist-entrepreneur-workflow'}
                <a
                  href="/docs/minimalist-entrepreneur"
                  class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-headline font-semibold border border-white/10 transition"
                >
                  <span>Read Minimalist Entrepreneur Docs</span>
                  <ArrowRight size={13} />
                </a>
              {:else if selectedItem.id === 'gstack-pkg' || selectedItem.id === 'gstack-workflow'}
                <a
                  href="/docs/gstack"
                  class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-headline font-semibold border border-white/10 transition"
                >
                  <span>Read Garry Tan gstack Review Docs</span>
                  <ArrowRight size={13} />
                </a>
              {:else if selectedItem.kind === 'workflow'}
                <a
                  href="/docs/workflows"
                  class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-headline font-semibold border border-white/10 transition"
                >
                  <span>Read agent-spine Manual</span>
                  <ArrowRight size={13} />
                </a>
              {:else if selectedItem.id === 'agstack-pkg'}
                <a
                  href="/docs/agstack"
                  class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-headline font-semibold border border-white/10 transition"
                >
                  <span>Read AGSTACK SDLC Docs</span>
                  <ArrowRight size={13} />
                </a>
              {:else}
                <a
                  href="/docs/memory"
                  class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-headline font-semibold border border-white/10 transition"
                >
                  <span>Read agent-brain Manual</span>
                  <ArrowRight size={13} />
                </a>
              {/if}
            </div>

          </div>
        </div>
      </aside>

    </div>

  </div>
</div>
