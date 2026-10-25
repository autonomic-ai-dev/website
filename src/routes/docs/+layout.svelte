<script lang="ts">
  import { onMount, tick } from "svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import {
    Book,
    Download,
    Terminal,
    Layers,
    Server,
    Brain,
    Workflow,
    Heart,
    Radio,
    Cpu,
    Shield,
    Eye,
    MessageSquare,
    Activity,
    Plug,
    ChevronRight,
    Search,
    Menu,
    X,
    ExternalLink,
    Code2,
    Check
  } from "lucide-svelte";

  let { children, data } = $props();
  let pathname = $derived($page.url.pathname);
  let isMobileDocsMenuOpen = $state(false);
  let searchQuery = $state("");

  interface DocItem {
    href: string;
    label: string;
    icon: any;
    badge: string;
    description: string;
  }

  interface DocSection {
    title: string;
    items: DocItem[];
  }

  const docSections: DocSection[] = [
    {
      title: "Get Started",
      items: [
        { href: "/docs", label: "Core Concepts", icon: Book, badge: "Concepts", description: "Ecosystem introduction and core philosophy" },
        { href: "/docs/architecture", label: "Architecture Topology", icon: Layers, badge: "Two Components", description: "agent-brain and agent-spine: scope, contracts, and runtime" },
        { href: "/docs/installation", label: "Quick Installation", icon: Download, badge: "Install", description: "Homebrew tap and curl bootstrap" },
      ]
    },
    {
      title: "Manuals",
      items: [
        { href: "/docs/memory", label: "agent-brain", icon: Brain, badge: "Memory", description: "Vector memory, HNSW reasoning, curated skills, MCP hub" },
        { href: "/docs/workflows", label: "agent-spine", icon: Workflow, badge: "Workflows", description: "Deterministic YAML DAG engine and state replay" },
      ]
    },
    {
      title: "CLI Reference",
      items: [
        { href: "/docs/cli", label: "CLI Reference Hub", icon: Terminal, badge: "Overview", description: "CLI ecosystem overview and universal flags" },
        { href: "/docs/cli/agent-brain", label: "agent-brain", icon: Brain, badge: "Brain CLI", description: "Memory, MCP hub, skills, and routing CLI" },
        { href: "/docs/cli/agent-spine", label: "agent-spine", icon: Workflow, badge: "Spine CLI", description: "YAML workflow runner and DAG validator" },
      ]
    }
  ];

  let filteredSections = $derived.by(() => {
    if (!searchQuery.trim()) return docSections;
    const q = searchQuery.toLowerCase().trim();
    return docSections
      .map(section => ({
        ...section,
        items: section.items.filter(item => 
          item.label.toLowerCase().includes(q) || 
          item.badge.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        )
      }))
      .filter(section => section.items.length > 0);
  });

  const activeDocItem = $derived.by(() => {
    for (const sec of docSections) {
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
          background: "#080b11",
          mainBkg: "#081c2e",
          nodeBorder: "#38bdf8",
          primaryColor: "#081c2e",
          primaryTextColor: "#f8fafc",
          primaryBorderColor: "#38bdf8",
          lineColor: "#38bdf8",
          secondaryColor: "#1e293b",
          tertiaryColor: "#0f172a",
          edgeLabelBackground: "#0d1117",
          clusterBkg: "#080d1a",
          clusterBorder: "rgba(56, 189, 248, 0.3)",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
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
          wrapper.className = "mermaid-diagram-container my-8 p-6 bg-[#080b11]/90 border border-cyan-500/25 rounded-2xl overflow-x-auto shadow-2xl flex justify-center backdrop-blur-md";
          wrapper.innerHTML = svg;
          const target = el.tagName === "CODE" && el.parentElement?.tagName === "PRE" ? el.parentElement : el;
          target.replaceWith(wrapper);
        } catch (diagErr) {
          console.warn(`Mermaid render failed for block ${i}:`, diagErr);
          // Clean up any stray error elements Mermaid injects into document body
          const strayError = document.getElementById(id) || document.getElementById(`d${id}`);
          if (strayError) strayError.remove();
          // Leave the raw code block styled cleanly if render fails
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
      btn.className = "copy-code-btn absolute top-3 right-3 px-2 py-1 bg-white/10 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 rounded text-xs font-mono transition flex items-center gap-1 opacity-0 group-hover:opacity-100 border border-white/10";
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

<div class="flex flex-col md:flex-row min-h-screen pt-0 bg-[#080b10]">
  <!-- Mobile Docs Toggle Bar -->
  <div class="md:hidden px-6 py-3.5 border-b border-white/[0.08] flex justify-between items-center bg-[#0d1117] sticky top-16 z-40">
    <div class="flex items-center gap-2">
      <span class="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">DOCS HUB</span>
      {#if activeDocItem}
        <ChevronRight size={14} class="text-slate-500" />
        <span class="text-xs font-mono text-white truncate max-w-[180px]">{activeDocItem.label}</span>
      {/if}
    </div>
    <button 
      onclick={() => isMobileDocsMenuOpen = !isMobileDocsMenuOpen}
      class="p-2 bg-[#161b22] border border-white/10 rounded-lg text-white hover:bg-white/10 transition"
      aria-label="Toggle Navigation"
    >
      {#if isMobileDocsMenuOpen} <X size={18} /> {:else} <Menu size={18} /> {/if}
    </button>
  </div>

  <!-- Docs Sidebar -->
  <aside class="{isMobileDocsMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-72 border-b md:border-b-0 md:border-r border-white/[0.08] p-5 overflow-y-auto shrink-0 bg-[#0d1117]/95 backdrop-blur-xl z-30 sticky top-16 h-[calc(100vh-4rem)]">
    <!-- Live Hub Telemetry Pill -->
    <div class="mb-5 pb-4 border-b border-white/[0.08] flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span class="text-xs font-mono font-bold text-white tracking-wide">CENTRAL DOCS HUB</span>
      </div>
      <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">2 COMPONENTS</span>
    </div>

    <!-- Quick Filter Search -->
    <div class="relative mb-6">
      <Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input 
        type="text" 
        bind:value={searchQuery}
        placeholder="Filter organs & guides..."
        class="w-full bg-[#121622] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 transition"
      />
    </div>

    <!-- Navigation Tree -->
    <div class="space-y-6">
      {#each filteredSections as section}
        <div>
          <h3 class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2.5 px-2 flex items-center justify-between">
            <span>{section.title}</span>
          </h3>
          <ul class="space-y-1">
            {#each section.items as item}
              {@const Icon = item.icon}
              {@const isActive = pathname === item.href}
              <li>
                <a 
                  href={item.href} 
                  onclick={() => isMobileDocsMenuOpen = false} 
                  class="group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-sans transition-all {isActive ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'}"
                >
                  <div class="flex items-center gap-2.5 min-w-0">
                    <Icon size={15} class="{isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors shrink-0" />
                    <span class="truncate">{item.label}</span>
                  </div>
                  <span class="text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 {isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/[0.05] text-slate-400 group-hover:bg-white/10'}">
                    {item.badge}
                  </span>
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <!-- External Links Footer in Sidebar -->
    <div class="mt-8 pt-5 border-t border-white/[0.08] space-y-2">
      <a 
        href="https://github.com/autonomic-ai-dev" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="flex items-center justify-between px-2 py-1.5 rounded text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5 transition"
      >
        <span>GitHub Monorepo</span>
        <ExternalLink size={12} />
      </a>
      <a 
        href="https://agent-ci-dashboard.vercel.app" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="flex items-center justify-between px-2 py-1.5 rounded text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition"
      >
        <span>Mission Control</span>
        <ExternalLink size={12} />
      </a>
    </div>
  </aside>

  <!-- Docs Content Container -->
  <main class="flex-1 min-w-0 p-6 md:p-12 lg:p-16 max-w-5xl">
    <!-- Breadcrumb Header -->
    <div class="mb-8 pb-4 border-b border-white/[0.08] flex items-center justify-between">
      <nav class="flex items-center gap-2 text-xs font-mono text-slate-400" aria-label="Breadcrumb">
        <a href="/docs" class="hover:text-white transition">Docs</a>
        <ChevronRight size={12} class="text-slate-600" />
        {#if activeDocItem}
          <span class="text-cyan-400 font-semibold">{activeDocItem.label}</span>
        {:else}
          <span class="text-cyan-400 font-semibold">Specification</span>
        {/if}
      </nav>
      <div class="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-500">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>SPEC {data?.ecosystemVersion || 'v1.0.0-beta.3.11'}</span>
      </div>
    </div>

    <!-- Article Content -->
    <article class="prose max-w-none">
      {@render children()}
    </article>
  </main>
</div>
