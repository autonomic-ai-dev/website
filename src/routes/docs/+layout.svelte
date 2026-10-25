<script lang="ts">
  import { onMount, tick } from "svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import {
    Book,
    Download,
    Terminal,
    Layers,
    Brain,
    Workflow,
    ChevronRight,
    Search,
    Menu,
    X,
    ExternalLink,
    Code2,
    Check,
    Copy,
    Shield,
    Sparkles,
    FileText,
    Activity,
    Cpu,
    GitBranch,
    CheckCircle2,
    Command
  } from "lucide-svelte";

  let { children, data } = $props();
  let pathname = $derived($page.url.pathname);
  let isMobileDocsMenuOpen = $state(false);
  let searchQuery = $state("");

  // Determine active mode based on URL
  let isCliSection = $derived(pathname.startsWith("/docs/cli"));
  let activeTab = $state<'docs' | 'cli'>('docs');

  $effect(() => {
    if (isCliSection) {
      activeTab = 'cli';
    } else {
      activeTab = 'docs';
    }
  });

  interface DocItem {
    href: string;
    label: string;
    icon: any;
    badge?: string;
    subtext?: string;
  }

  interface DocSection {
    title: string;
    items: DocItem[];
  }

  const guideSections: DocSection[] = [
    {
      title: "Getting Started",
      items: [
        { href: "/docs", label: "Introduction & Overview", icon: Book, badge: "Overview" },
        { href: "/docs/architecture", label: "Dual-Engine Architecture", icon: Layers, badge: "Topology" },
        { href: "/docs/installation", label: "Quickstart Installation", icon: Download, badge: "macOS ARM" }
      ]
    },
    {
      title: "Core Architecture",
      items: [
        { href: "/docs/memory", label: "agent-brain", icon: Brain, badge: "Reasoning", subtext: "Token-bounded MCP router, durable vector memory, multi-host rule gates." },
        { href: "/docs/workflows", label: "agent-spine", icon: Workflow, badge: "Execution", subtext: "Declarative YAML DAGs, milestone approval gates, zero-human-block execution." }
      ]
    },
    {
      title: "Registry & Workflows",
      items: [
        { href: "/workflows", label: "Workflows & Skill Packs", icon: Layers, badge: "Hub" }
      ]
    }
  ];

  const cliSections: DocSection[] = [
    {
      title: "Core Engines",
      items: [
        { href: "/docs/cli", label: "CLI Reference Manual", icon: Terminal, badge: "Overview" },
        { href: "/docs/cli/agent-brain", label: "agent-brain CLI", icon: Brain, badge: "6 cmds" },
        { href: "/docs/cli/agent-spine", label: "agent-spine CLI", icon: Workflow, badge: "4 cmds" }
      ]
    }
  ];

  let currentSections = $derived(activeTab === 'cli' ? cliSections : guideSections);

  let filteredSections = $derived.by(() => {
    if (!searchQuery.trim()) return currentSections;
    const q = searchQuery.toLowerCase().trim();
    return currentSections
      .map(section => ({
        ...section,
        items: section.items.filter(item => 
          item.label.toLowerCase().includes(q) || 
          (item.badge && item.badge.toLowerCase().includes(q)) ||
          (item.subtext && item.subtext.toLowerCase().includes(q))
        )
      }))
      .filter(section => section.items.length > 0);
  });

  const allSections = [...guideSections, ...cliSections];
  const activeDocItem = $derived.by(() => {
    for (const sec of allSections) {
      for (const item of sec.items) {
        if (item.href === pathname) return item;
      }
    }
    return null;
  });

  async function renderMermaidDiagrams() {
    if (!browser) return;
    await tick();
    const blocks = document.querySelectorAll("pre.language-mermaid, pre > code.language-mermaid, div.mermaid");
    if (blocks.length === 0) return;

    try {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        themeVariables: {
          darkMode: true,
          background: "#0a0a0c",
          mainBkg: "#0d1117",
          nodeBorder: "#06b6d4",
          primaryColor: "#0d1117",
          primaryTextColor: "#f8fafc",
          primaryBorderColor: "#06b6d4",
          lineColor: "#06b6d4",
          secondaryColor: "#1e293b",
          tertiaryColor: "#0f172a",
          edgeLabelBackground: "#0d1117",
          clusterBkg: "#080d1a",
          clusterBorder: "rgba(6, 182, 212, 0.3)",
          fontFamily: "Fira Code, JetBrains Mono, monospace",
          fontSize: "12px"
        }
      });

      for (let i = 0; i < blocks.length; i++) {
        const el = blocks[i] as HTMLElement;
        if (el.dataset.mermaidRendered === "true") continue;
        el.dataset.mermaidRendered = "true";

        const code = el.innerText || el.textContent || "";
        if (!code.trim()) continue;

        const id = `mermaid-svg-${Date.now()}-${i}`;
        try {
          const { svg } = await mermaid.render(id, code.trim());
          const wrapper = document.createElement("div");
          wrapper.className = "mermaid-diagram-container my-8 p-6 bg-slate-950/90 border border-cyan-500/25 rounded-2xl overflow-x-auto shadow-2xl flex justify-center backdrop-blur-md";
          wrapper.innerHTML = svg;
          const preParent = el.tagName === "CODE" ? el.parentElement : el;
          if (preParent && preParent.parentNode) {
            preParent.parentNode.replaceChild(wrapper, preParent);
          }
        } catch (err) {
          console.warn("Mermaid render error for block:", err);
        }
      }
    } catch (e) {
      console.warn("Mermaid global initialization error:", e);
    }
  }

  function addCopyButtons() {
    if (!browser) return;
    const preBlocks = document.querySelectorAll("article pre:not(.language-mermaid)");
    preBlocks.forEach((pre) => {
      if (pre.querySelector(".copy-code-btn")) return;
      const btn = document.createElement("button");
      btn.className = "copy-code-btn absolute top-3 right-3 px-2 py-1 bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 rounded text-xs font-mono transition flex items-center gap-1 opacity-0 group-hover:opacity-100 border border-slate-700/80 cursor-pointer";
      btn.innerHTML = "<span>Copy</span>";
      btn.onclick = () => {
        const codeEl = pre.querySelector("code") as HTMLElement | null;
        const text = codeEl?.innerText || (pre as HTMLElement).innerText || "";
        navigator.clipboard.writeText(text);
        btn.innerHTML = "<span class='text-emerald-400'>Copied!</span>";
        setTimeout(() => {
          btn.innerHTML = "<span>Copy</span>";
        }, 2000);
      };
      (pre as HTMLElement).style.position = "relative";
      (pre as HTMLElement).classList.add("group");
      pre.appendChild(btn);
    });
  }

  $effect(() => {
    if (pathname) {
      renderMermaidDiagrams();
      addCopyButtons();
    }
  });

  onMount(() => {
    renderMermaidDiagrams();
    addCopyButtons();
  });
</script>

<div class="flex flex-col lg:flex-row min-h-screen bg-[#0a0a0c] text-slate-300 font-body">
  
  <!-- Mobile Docs Toggle Bar -->
  <div class="lg:hidden px-6 py-3.5 border-b border-white/[0.08] flex justify-between items-center bg-slate-950 sticky top-20 z-40">
    <div class="flex items-center gap-2">
      <span class="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">{activeTab === 'cli' ? 'CLI REFERENCE' : 'DOCUMENTATION'}</span>
      {#if activeDocItem}
        <ChevronRight size={14} class="text-slate-500" />
        <span class="text-xs font-mono text-white truncate max-w-[180px]">{activeDocItem.label}</span>
      {/if}
    </div>
    <button 
      onclick={() => isMobileDocsMenuOpen = !isMobileDocsMenuOpen}
      class="p-2 bg-slate-900 border border-white/10 rounded-lg text-white hover:bg-white/10 transition"
      aria-label="Toggle Navigation"
    >
      {#if isMobileDocsMenuOpen} <X size={18} /> {:else} <Menu size={18} /> {/if}
    </button>
  </div>

  <!-- LEFT SIDEBAR: Nav Tree (Stitch Layout) -->
  <aside class="{isMobileDocsMenuOpen ? 'block' : 'hidden'} lg:block w-full lg:w-72 shrink-0 sticky top-20 h-auto lg:h-[calc(100vh-5rem)] overflow-y-auto px-5 py-6 border-b lg:border-b-0 lg:border-r border-white/[0.06] text-xs font-body bg-slate-950/80 backdrop-blur-xl z-30">
    
    <!-- Engine Status Pill -->
    <div class="mb-5 p-2.5 rounded-xl bg-slate-900/90 border border-white/[0.08] flex items-center justify-between shadow-inner">
      <div class="flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span class="font-mono text-[11px] text-slate-300 font-medium">Autonomous Engine {data?.ecosystemVersion || 'v1.0.0-rc2'}</span>
      </div>
      <span class="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/20">LIVE</span>
    </div>

    <!-- Section Switcher Tabs: Docs vs CLI -->
    <div class="grid grid-cols-2 gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-5 font-mono text-xs">
      <a 
        href="/docs" 
        onclick={() => activeTab = 'docs'}
        class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all text-center {activeTab === 'docs' ? 'bg-cyan-950/80 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-slate-200'}"
      >
        <Book size={13} />
        <span>Docs</span>
      </a>
      <a 
        href="/docs/cli" 
        onclick={() => activeTab = 'cli'}
        class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all text-center {activeTab === 'cli' ? 'bg-cyan-950/80 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-slate-200'}"
      >
        <Terminal size={13} />
        <span>CLI Reference</span>
      </a>
    </div>

    <!-- Quick Filter Search Input -->
    <div class="relative mb-5">
      <Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input 
        type="text" 
        bind:value={searchQuery}
        placeholder={activeTab === 'cli' ? "Filter CLI commands..." : "Filter guides..."}
        class="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 transition"
      />
    </div>

    <!-- Navigation Tree Sections -->
    <div class="space-y-6">
      {#each filteredSections as section}
        <div>
          <div class="px-2 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>{section.title}</span>
          </div>
          <ul class="space-y-1">
            {#each section.items as item}
              {@const Icon = item.icon}
              {@const isActive = pathname === item.href}
              <li>
                <a 
                  href={item.href} 
                  onclick={() => isMobileDocsMenuOpen = false} 
                  class="group flex flex-col p-2.5 rounded-xl text-xs transition-all {isActive ? 'bg-cyan-950/40 text-cyan-300 font-medium border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'}"
                >
                  <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-2">
                      <Icon size={14} class="{isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'} transition-colors shrink-0" />
                      <span class="font-headline font-medium">{item.label}</span>
                    </div>
                    {#if item.badge}
                      <span class="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 {isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-900 text-slate-400 group-hover:bg-slate-800'}">
                        {item.badge}
                      </span>
                    {/if}
                  </div>
                  {#if item.subtext}
                    <p class="text-[10px] text-slate-500 mt-1 pl-5.5 leading-relaxed truncate">
                      {item.subtext}
                    </p>
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}

      <!-- Quick Command Index for CLI mode -->
      {#if activeTab === 'cli'}
        <div class="pt-4 border-t border-white/[0.06] space-y-4">
          <div>
            <div class="px-2 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-cyan-400/90 flex items-center gap-1.5">
              <Brain size={13} />
              <span>agent-brain Commands</span>
            </div>
            <ul class="space-y-1 font-mono text-[11px]">
              <li><a href="/docs/cli/agent-brain#serve" class="block px-2.5 py-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-white/[0.03] transition-colors">serve <span class="text-slate-600 font-sans">Daemon mode</span></a></li>
              <li><a href="/docs/cli/agent-brain#route_task" class="block px-2.5 py-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-white/[0.03] transition-colors">route_task <span class="text-slate-600 font-sans">Turn gating</span></a></li>
              <li><a href="/docs/cli/agent-brain#install" class="block px-2.5 py-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-white/[0.03] transition-colors">install <span class="text-slate-600 font-sans">Host hooks</span></a></li>
              <li><a href="/docs/cli/agent-brain#doctor" class="block px-2.5 py-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-white/[0.03] transition-colors">doctor <span class="text-slate-600 font-sans">Diagnostics</span></a></li>
              <li><a href="/docs/cli/agent-brain#package" class="block px-2.5 py-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-white/[0.03] transition-colors">package <span class="text-slate-600 font-sans">Skill packs</span></a></li>
            </ul>
          </div>

          <div>
            <div class="px-2 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-indigo-400/90 flex items-center gap-1.5">
              <Workflow size={13} />
              <span>agent-spine Commands</span>
            </div>
            <ul class="space-y-1 font-mono text-[11px]">
              <li><a href="/docs/cli/agent-spine#run" class="block px-2.5 py-1 rounded text-slate-400 hover:text-indigo-300 hover:bg-white/[0.03] transition-colors">run <span class="text-slate-600 font-sans">Execute DAG</span></a></li>
              <li><a href="/docs/cli/agent-spine#validate" class="block px-2.5 py-1 rounded text-slate-400 hover:text-indigo-300 hover:bg-white/[0.03] transition-colors">validate <span class="text-slate-600 font-sans">Invariants</span></a></li>
              <li><a href="/docs/cli/agent-spine#init" class="block px-2.5 py-1 rounded text-slate-400 hover:text-indigo-300 hover:bg-white/[0.03] transition-colors">init <span class="text-slate-600 font-sans">Scaffold YAML</span></a></li>
              <li><a href="/docs/cli/agent-spine#status" class="block px-2.5 py-1 rounded text-slate-400 hover:text-indigo-300 hover:bg-white/[0.03] transition-colors">status <span class="text-slate-600 font-sans">Audits</span></a></li>
            </ul>
          </div>
        </div>
      {/if}

      <!-- Strict Dual-Engine Invariant Footer -->
      <div class="pt-6 border-t border-white/[0.06] text-slate-500 text-[11px]">
        <span class="text-slate-400 font-medium block mb-1">Dual-Engine Invariant</span>
        Strict bifurcation: cognitive routing (<span class="text-cyan-400 font-mono">brain</span>) and deterministic state execution (<span class="text-indigo-400 font-mono">spine</span>).
      </div>
    </div>
  </aside>

  <!-- MAIN DOCUMENTATION CANVAS -->
  <main class="flex-1 min-w-0 px-6 sm:px-10 lg:px-12 py-8 max-w-4xl mx-auto overflow-hidden">
    <!-- Breadcrumb Header -->
    <div class="mb-6 pb-4 border-b border-white/[0.08] flex items-center justify-between">
      <nav class="flex items-center gap-2 text-xs font-mono text-slate-400" aria-label="Breadcrumb">
        <a href={activeTab === 'cli' ? "/docs/cli" : "/docs"} class="hover:text-cyan-400 transition">
          {activeTab === 'cli' ? 'CLI Reference' : 'Docs'}
        </a>
        <ChevronRight size={12} class="text-slate-600" />
        {#if activeDocItem}
          <span class="text-cyan-400 font-medium">{activeDocItem.label}</span>
        {:else}
          <span class="text-cyan-400 font-medium">Specification</span>
        {/if}
      </nav>
      <div class="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-500">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>SPEC {data?.ecosystemVersion || 'v1.0.0-rc2'}</span>
      </div>
    </div>

    <!-- Article Content -->
    <article class="prose max-w-none">
      {@render children()}
    </article>
  </main>

  <!-- RIGHT RAIL: Table of Contents & Quick Links (Stitch Design) -->
  <aside class="w-64 shrink-0 hidden xl:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto px-5 py-8 border-l border-white/[0.06] text-xs font-body">
    <div class="space-y-6">
      <div>
        <div class="px-2 mb-3 text-[11px] font-headline font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <FileText size={13} class="text-cyan-400" />
          <span>ON THIS PAGE</span>
        </div>
        <ul class="space-y-2 text-slate-400 text-xs font-body">
          <li>
            <a href="#hero" class="text-cyan-300 font-medium hover:text-cyan-200 transition">Introduction & Overview</a>
          </li>
          <li class="pl-2 border-l border-white/10 space-y-1.5">
            <a href="#dual-engine-blueprint" class="block hover:text-slate-200 transition">The Dual-Engine Blueprint</a>
            <a href="#agent-brain-section" class="block text-slate-500 hover:text-cyan-300 font-mono text-[11px] transition">agent-brain (Reasoning)</a>
            <a href="#agent-spine-section" class="block text-slate-500 hover:text-indigo-300 font-mono text-[11px] transition">agent-spine (DAG Runner)</a>
          </li>
          <li>
            <a href="#quickstart" class="hover:text-slate-200 transition">Quickstart & Installation</a>
          </li>
          <li>
            <a href="#invariants" class="hover:text-slate-200 transition">Invariant & Safety Contracts</a>
          </li>
        </ul>
      </div>

      <div class="pt-6 border-t border-white/[0.06] space-y-3 font-mono text-xs text-slate-400">
        <a 
          href="https://github.com/autonomic-ai-dev/agent-registry" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="flex items-center justify-between hover:text-white transition"
        >
          <span>Edit this page on GitHub</span>
          <ExternalLink size={12} />
        </a>
        <a 
          href="https://autonomic-ai.openstatus.dev" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="flex items-center justify-between hover:text-emerald-400 transition"
        >
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>OpenStatus (Live)</span>
          </span>
          <ExternalLink size={12} />
        </a>
        <div class="text-[11px] text-slate-500 pt-2">
          Release {data?.ecosystemVersion || 'v1.0.0-rc2'}
        </div>
      </div>
    </div>
  </aside>

</div>
