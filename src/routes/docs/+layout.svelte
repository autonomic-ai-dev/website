<script lang="ts">
  import { onMount, tick } from "svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import {
    ChevronRight,
    ExternalLink,
    FileText,
    Brain,
    Workflow,
    Layers,
    Book,
    Menu,
    X
  } from "lucide-svelte";

  let { children, data } = $props();
  let pathname = $derived($page.url.pathname);
  let isMobileDocsMenuOpen = $state(false);

  // Determine active section based on URL
  let isCliSection = $derived(pathname.startsWith("/docs/cli"));
  let activeTab = $state<'docs' | 'cli'>('docs');
  let activeHash = $state("");

  $effect(() => {
    if (isCliSection) {
      activeTab = 'cli';
    } else {
      activeTab = 'docs';
    }
  });

  $effect(() => {
    if (browser) {
      activeHash = window.location.hash;
      const handleHashChange = () => {
        activeHash = window.location.hash;
      };
      window.addEventListener("hashchange", handleHashChange);
      return () => {
        window.removeEventListener("hashchange", handleHashChange);
      };
    }
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
  
  <!-- Mobile Navigation Header -->
  <div class="lg:hidden px-6 py-3.5 border-b border-white/[0.08] flex justify-between items-center bg-slate-950 sticky top-20 z-40">
    <div class="flex items-center gap-2">
      <span class="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">{activeTab === 'cli' ? 'CLI REFERENCE' : 'DOCUMENTATION'}</span>
      <ChevronRight size={14} class="text-slate-500" />
      <span class="text-xs font-mono text-white truncate max-w-[180px]">
        {pathname.endsWith('/agent-brain') ? 'agent-brain CLI' : pathname.endsWith('/agent-spine') ? 'agent-spine CLI' : pathname.endsWith('/cli') ? 'CLI Overview' : 'Overview'}
      </span>
    </div>
    <button 
      onclick={() => isMobileDocsMenuOpen = !isMobileDocsMenuOpen}
      class="p-2 bg-slate-900 border border-white/10 rounded-lg text-white hover:bg-white/10 transition"
      aria-label="Toggle Navigation"
    >
      {#if isMobileDocsMenuOpen} <X size={18} /> {:else} <Menu size={18} /> {/if}
    </button>
  </div>

  <!-- LEFT SIDEBAR: Pixel-Perfect Stitch Navigation Tree -->
  <aside class="{isMobileDocsMenuOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0 sticky top-20 h-auto lg:h-[calc(100vh-5rem)] overflow-y-auto px-5 py-6 border-b lg:border-b-0 lg:border-r border-white/[0.06] text-xs font-body bg-[#0a0a0c] z-30">
    
    {#if activeTab === 'cli'}
      <!-- CLI Reference Mode: Clean Navigation Tree without Redundant Top Container -->
      <div class="space-y-6">
        <!-- Section: CORE ENGINES -->
        <div>
          <div class="px-1 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-slate-400">
            <span>CORE ENGINES</span>
          </div>
          <div class="space-y-1.5">
            <a 
              href="/docs/cli/agent-brain" 
              onclick={() => activeHash = ''}
              class="flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all {pathname === '/docs/cli/agent-brain' && (!activeHash || activeHash === '') ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.12)]' : 'text-slate-300 hover:bg-slate-900 border border-white/[0.06] hover:border-white/10'}"
            >
              <div class="flex items-center gap-2 font-mono">
                <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span class="text-white font-mono text-xs">agent-brain</span>
              </div>
              <span class="text-[11px] font-mono text-cyan-400/80">6 cmds</span>
            </a>

            <a 
              href="/docs/cli/agent-spine" 
              onclick={() => activeHash = ''}
              class="flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all {pathname === '/docs/cli/agent-spine' && (!activeHash || activeHash === '') ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.12)]' : 'text-slate-300 hover:bg-slate-900 border border-white/[0.06] hover:border-white/10'}"
            >
              <div class="flex items-center gap-2 font-mono">
                <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span class="text-slate-300 font-mono text-xs">agent-spine</span>
              </div>
              <span class="text-[11px] font-mono text-indigo-400/70">4 cmds</span>
            </a>
          </div>
        </div>

        <!-- Section: AGENT-BRAIN COMMANDS -->
        <div>
          <div class="px-1 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Brain size={13} class="text-cyan-400" />
            <span>AGENT-BRAIN COMMANDS</span>
          </div>
          <ul class="space-y-1 font-mono text-xs">
            <li>
              <a 
                href="/docs/cli/agent-brain#serve" 
                onclick={() => activeHash = '#serve'}
                class="flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all group {pathname === '/docs/cli/agent-brain' && activeHash === '#serve' ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.12)]' : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'}"
              >
                <span class="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">serve</span> 
                <span class="text-slate-500 font-sans text-[11px] group-hover:text-slate-400 transition-colors">Daemon mode</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/cli/agent-brain#route_task" 
                onclick={() => activeHash = '#route_task'}
                class="flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all group {pathname === '/docs/cli/agent-brain' && activeHash === '#route_task' ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.12)]' : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'}"
              >
                <span class="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">route_task</span> 
                <span class="text-slate-500 font-sans text-[11px] group-hover:text-slate-400 transition-colors">AST routing</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/cli/agent-brain#doctor" 
                onclick={() => activeHash = '#doctor'}
                class="flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all group {pathname === '/docs/cli/agent-brain' && activeHash === '#doctor' ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.12)]' : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'}"
              >
                <span class="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">doctor</span> 
                <span class="text-slate-500 font-sans text-[11px] group-hover:text-slate-400 transition-colors">Diagnostics</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/cli/agent-brain#index" 
                onclick={() => activeHash = '#index'}
                class="flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all group {pathname === '/docs/cli/agent-brain' && activeHash === '#index' ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.12)]' : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'}"
              >
                <span class="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">index</span> 
                <span class="text-slate-500 font-sans text-[11px] group-hover:text-slate-400 transition-colors">HNSW vectors</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/cli/agent-brain#package" 
                onclick={() => activeHash = '#package'}
                class="flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all group {pathname === '/docs/cli/agent-brain' && activeHash === '#package' ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.12)]' : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'}"
              >
                <span class="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">registry</span> 
                <span class="text-slate-500 font-sans text-[11px] group-hover:text-slate-400 transition-colors">MCP bindings</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/cli/agent-brain#stats" 
                onclick={() => activeHash = '#stats'}
                class="flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all group {pathname === '/docs/cli/agent-brain' && activeHash === '#stats' ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.12)]' : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'}"
              >
                <span class="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">stats</span> 
                <span class="text-slate-500 font-sans text-[11px] group-hover:text-slate-400 transition-colors">Token telemetry</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Section: AGENT-SPINE COMMANDS -->
        <div>
          <div class="px-1 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Workflow size={13} class="text-indigo-400" />
            <span>AGENT-SPINE COMMANDS</span>
          </div>
          <ul class="space-y-1 font-mono text-xs">
            <li>
              <a 
                href="/docs/cli/agent-spine#run" 
                onclick={() => activeHash = '#run'}
                class="flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all group {pathname === '/docs/cli/agent-spine' && activeHash === '#run' ? 'bg-indigo-950/50 text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.12)]' : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'}"
              >
                <span class="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">run</span> 
                <span class="text-slate-500 font-sans text-[11px] group-hover:text-slate-400 transition-colors">Execute DAG</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/cli/agent-spine#validate" 
                onclick={() => activeHash = '#validate'}
                class="flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all group {pathname === '/docs/cli/agent-spine' && activeHash === '#validate' ? 'bg-indigo-950/50 text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.12)]' : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'}"
              >
                <span class="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">validate</span> 
                <span class="text-slate-500 font-sans text-[11px] group-hover:text-slate-400 transition-colors">Invariants</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/cli/agent-spine#init" 
                onclick={() => activeHash = '#init'}
                class="flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all group {pathname === '/docs/cli/agent-spine' && activeHash === '#init' ? 'bg-indigo-950/50 text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.12)]' : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'}"
              >
                <span class="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">init</span> 
                <span class="text-slate-500 font-sans text-[11px] group-hover:text-slate-400 transition-colors">Scaffold YAML</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/cli/agent-spine#status" 
                onclick={() => activeHash = '#status'}
                class="flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all group {pathname === '/docs/cli/agent-spine' && activeHash === '#status' ? 'bg-indigo-950/50 text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.12)]' : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'}"
              >
                <span class="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">status</span> 
                <span class="text-slate-500 font-sans text-[11px] group-hover:text-slate-400 transition-colors">Sealed audits</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Strict Dual-Engine Invariant Footer -->
        <div class="pt-5 border-t border-white/[0.08] text-slate-400 text-xs">
          <span class="text-slate-300 font-medium block mb-1">Dual-Engine Invariant</span>
          <p class="text-slate-400 leading-relaxed text-[11px]">Strict bifurcation: cognitive routing (<span class="text-cyan-400 font-mono">brain</span>) and deterministic state execution (<span class="text-indigo-400 font-mono">spine</span>).</p>
        </div>
      </div>

    {:else}
      <!-- Documentation Mode: Clean Navigation Tree without Redundant Top Container -->
      <div class="space-y-6">
        <!-- Section: GETTING STARTED -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Getting Started</span>
          </div>
          <ul class="space-y-1">
            <li>
              <a 
                href="/docs" 
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs' ? 'bg-gradient-to-r from-indigo-500/15 to-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400 shadow-[inset_0_0_12px_rgba(6,182,212,0.08)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'}"
              >
                <Book size={14} class="text-cyan-400" />
                <span>Introduction & Overview</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/installation" 
                class="flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs/installation' ? 'bg-gradient-to-r from-indigo-500/15 to-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400 shadow-[inset_0_0_12px_rgba(6,182,212,0.08)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'}"
              >
                <div class="flex items-center gap-2">
                  <span class="text-slate-500 font-mono">⚡</span>
                  <span>Quickstart Execution</span>
                </div>
                <span class="text-[10px] font-mono text-slate-500">2 min</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/architecture" 
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs/architecture' ? 'bg-gradient-to-r from-indigo-500/15 to-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400 shadow-[inset_0_0_12px_rgba(6,182,212,0.08)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'}"
              >
                <Layers size={14} class="text-indigo-400" />
                <span>CLI Runtime & Doctor</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Section: CORE ARCHITECTURE -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Core Architecture</span>
          </div>
          <ul class="space-y-2">
            <li>
              <a 
                href="/docs/memory" 
                class="group flex flex-col p-2.5 rounded-xl border transition-all {pathname === '/docs/memory' ? 'border-cyan-500/50 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-white/[0.08] bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-900/70'}"
              >
                <div class="flex items-center gap-2 text-cyan-400 font-mono font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>agent-brain</span>
                </div>
                <p class="text-[10px] text-slate-400 mt-1 pl-3.5 leading-relaxed">
                  Token-bounded MCP router, durable vector memory, multi-host rule gates.
                </p>
              </a>
            </li>
            <li>
              <a 
                href="/docs/workflows" 
                class="group flex flex-col p-2.5 rounded-xl border transition-all {pathname === '/docs/workflows' ? 'border-indigo-500/50 bg-indigo-950/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-white/[0.08] bg-slate-900/40 hover:border-indigo-500/40 hover:bg-slate-900/70'}"
              >
                <div class="flex items-center gap-2 text-indigo-400 font-mono font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  <span>agent-spine</span>
                </div>
                <p class="text-[10px] text-slate-400 mt-1 pl-3.5 leading-relaxed">
                  Declarative YAML DAGs, milestone approval gates, zero-human-block execution.
                </p>
              </a>
            </li>
          </ul>
        </div>

        <!-- Section: AGSTACK SDLC -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>AGSTACK SDLC</span>
          </div>
          <ul class="space-y-1">
            <li>
              <a href="/workflows" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all">
                <Layers size={14} class="text-cyan-400" />
                <span>agstack Mode & Matrix</span>
              </a>
            </li>
            <li>
              <a href="/workflows" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all">
                <Book size={14} class="text-slate-400" />
                <span>Minimalist Entrepreneurship</span>
              </a>
            </li>
            <li>
              <a href="/workflows" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all">
                <span class="text-yellow-400 font-mono">★</span>
                <span>Garry Tan gstack Review Engine</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Section: VERIFICATION & INVARIANTS -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Verification & Invariants</span>
          </div>
          <ul class="space-y-1">
            <li>
              <a href="/#spec" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all font-mono text-[11px]">
                <span class="text-cyan-400 font-bold">.verify/</span>
                <span>Deterministic Harness</span>
              </a>
            </li>
            <li>
              <a href="/#spec" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all">
                <span class="text-emerald-400 font-mono">🛡</span>
                <span>Boundary Isolation Protocol</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Quick docs feedback helper -->
        <div class="pt-6 border-t border-white/[0.06] text-slate-400">
          <div class="flex items-center gap-2">
            <span class="text-indigo-400 font-mono">ℹ</span>
            <span class="text-[11px]">Strict dual-engine invariant applied.</span>
          </div>
        </div>
      </div>
    {/if}

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
        <span class="text-cyan-400 font-medium">
          {pathname.endsWith('/agent-brain') ? 'agent-brain CLI' : pathname.endsWith('/agent-spine') ? 'agent-spine CLI' : pathname.endsWith('/cli') ? 'CLI Reference Manual' : pathname.endsWith('/architecture') ? 'Dual-Engine Architecture' : pathname.endsWith('/installation') ? 'Installation' : 'Introduction & Overview'}
        </span>
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
