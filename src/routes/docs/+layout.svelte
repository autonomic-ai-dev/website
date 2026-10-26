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
    Terminal,
    Menu,
    X,
    Shield
  } from "lucide-svelte";

  let { children, data } = $props();
  let pathname = $derived($page.url.pathname);
  let isMobileDocsMenuOpen = $state(false);

  // Determine active section based on URL
  let isCliSection = $derived(pathname.startsWith("/docs/cli"));
  let activeTab = $state<'docs' | 'cli'>('docs');
  let activeHash = $state("");

  interface TocItem {
    id: string;
    text: string;
    level: number;
  }
  let tocItems = $state<TocItem[]>([]);
  let activeTocId = $state<string>("");
  let mainScrollContainer = $state<HTMLElement | null>(null);
  let isScrollingFromClick = false;
  let scrollTimeout: any = null;

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
        if (window.location.hash) {
          const h = window.location.hash.replace('#', '');
          activeTocId = h;
          scrollToHeading(h);
        }
      };
      window.addEventListener("hashchange", handleHashChange);
      return () => {
        window.removeEventListener("hashchange", handleHashChange);
      };
    }
  });

  function extractToc() {
    if (!browser) return;
    const article = document.querySelector("article");
    if (!article) return;

    const headings = article.querySelectorAll("h2, h3");
    const items: TocItem[] = [];

    headings.forEach((heading, idx) => {
      let rawText = heading.textContent?.replace(/^#+\s*/, "").replace(/`/g, "").trim() || "";
      if (!rawText) return;

      const lower = rawText.toLowerCase();
      // Filter out low-level repetitive subheadings
      if (["options", "arguments", "examples", "subcommands", "checks performed", "options for package add"].includes(lower)) {
        return;
      }

      let id = heading.id;
      if (!id) {
        const parentSection = heading.closest("section");
        if (parentSection && parentSection.id && !items.some(i => i.id === parentSection.id)) {
          id = parentSection.id;
          heading.id = id;
        } else {
          id = rawText
            .toLowerCase()
            .replace(/[^a-z0-9_]+/g, "-")
            .replace(/(^-|-$)+/g, "");
          heading.id = id;
        }
      }

      items.push({
        id,
        text: rawText,
        level: heading.tagName.toLowerCase() === "h2" ? 2 : 3
      });
    });

    tocItems = items;
    if (items.length > 0) {
      if (window.location.hash) {
        const target = window.location.hash.replace("#", "");
        if (items.some(i => i.id === target)) {
          activeTocId = target;
          setTimeout(() => scrollToHeading(target), 200);
          return;
        }
      }
      if (!activeTocId) {
        activeTocId = items[0].id;
      }
    }
  }

  function handleScroll() {
    if (!browser || !mainScrollContainer || isScrollingFromClick) return;
    const article = document.querySelector("article");
    if (!article) return;

    const headings = article.querySelectorAll("h2[id], h3[id], section[id]");
    if (headings.length === 0) return;

    const mainRect = mainScrollContainer.getBoundingClientRect();
    let currentActiveId = "";

    for (let i = 0; i < headings.length; i++) {
      const h = headings[i] as HTMLElement;
      if (!tocItems.some(item => item.id === h.id)) continue;

      const rect = h.getBoundingClientRect();
      const offset = rect.top - mainRect.top;
      if (offset <= 140) {
        currentActiveId = h.id;
      } else {
        break;
      }
    }

    if (currentActiveId && currentActiveId !== activeTocId) {
      activeTocId = currentActiveId;
      activeHash = `#${currentActiveId}`;
    }
  }

  function scrollToHeading(id: string) {
    if (!browser || !mainScrollContainer) return;
    const el = document.getElementById(id);
    if (el) {
      isScrollingFromClick = true;
      activeTocId = id;
      activeHash = `#${id}`;
      history.pushState(null, "", `#${id}`);

      const mainRect = mainScrollContainer.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const targetTop = mainScrollContainer.scrollTop + (elRect.top - mainRect.top) - 30;

      mainScrollContainer.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth"
      });

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrollingFromClick = false;
      }, 700);
    }
  }

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
      tick().then(() => {
        renderMermaidDiagrams();
        addCopyButtons();
        extractToc();
        isMobileDocsMenuOpen = false;
        if (mainScrollContainer) {
          mainScrollContainer.scrollTop = 0;
        }
      });
    }
  });

  onMount(() => {
    tick().then(() => {
      renderMermaidDiagrams();
      addCopyButtons();
      extractToc();
    });
  });
</script>

<!-- FIXED APPLICATION FRAMEWORK: Below fixed header (top-20 sm:top-24 to bottom-0) -->
<div class="fixed inset-x-0 bottom-0 top-20 sm:top-24 flex flex-col lg:flex-row overflow-hidden bg-[#0a0a0c] text-slate-300 font-body">
  
  <!-- Mobile Navigation Header Bar -->
  <div class="lg:hidden px-6 py-3 border-b border-white/[0.08] flex justify-between items-center bg-slate-950 shrink-0 z-40">
    <div class="flex items-center gap-2">
      <span class="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">{activeTab === 'cli' ? 'CLI REFERENCE' : 'DOCUMENTATION'}</span>
      <ChevronRight size={14} class="text-slate-500" />
      <span class="text-xs font-mono text-white truncate max-w-[180px]">
        {pathname.endsWith('/agent-brain') ? 'agent-brain CLI' : pathname.endsWith('/agent-spine') ? 'agent-spine CLI' : pathname.endsWith('/cli') ? 'CLI Overview' : pathname.endsWith('/agstack') ? 'AGSTACK SDLC' : 'Overview'}
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

  <!-- LEFT SIDEBAR: Fixed, independent scroll, page navigation tree -->
  <aside class="{isMobileDocsMenuOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 xl:w-72 shrink-0 h-full overflow-y-auto px-5 py-6 border-b lg:border-b-0 lg:border-r border-white/[0.06] text-xs font-body bg-[#0a0a0c] z-30">
    
    {#if activeTab === 'cli'}
      <!-- CLI Reference Mode: Page Navigation Only (Command headings moved to Right Sidebar) -->
      <div class="space-y-6">
        <!-- Section: CLI REFERENCE -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>CLI Reference</span>
          </div>
          <ul class="space-y-1">
            <li>
              <a 
                href="/docs/cli" 
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs/cli' ? 'bg-gradient-to-r from-indigo-500/15 to-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400 shadow-[inset_0_0_12px_rgba(6,182,212,0.08)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'}"
              >
                <Terminal size={14} class="text-cyan-400" />
                <span>CLI Overview</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Section: CORE ENGINES -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Dual Engines</span>
          </div>
          <ul class="space-y-2">
            <li>
              <a 
                href="/docs/cli/agent-brain" 
                class="group flex flex-col p-2.5 rounded-xl border transition-all {pathname === '/docs/cli/agent-brain' ? 'border-cyan-500/50 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.12)]' : 'border-white/[0.08] bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-900/70'}"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-cyan-400 font-mono font-medium">
                    <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>agent-brain</span>
                  </div>
                  <span class="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/20">6 cmds</span>
                </div>
                <p class="text-[10px] text-slate-400 mt-1 pl-3.5 leading-relaxed">
                  Reasoning, vector memory, AST router, and MCP gateway.
                </p>
              </a>
            </li>
            <li>
              <a 
                href="/docs/cli/agent-spine" 
                class="group flex flex-col p-2.5 rounded-xl border transition-all {pathname === '/docs/cli/agent-spine' ? 'border-indigo-500/50 bg-indigo-950/40 shadow-[0_0_15px_rgba(99,102,241,0.12)]' : 'border-white/[0.08] bg-slate-900/40 hover:border-indigo-500/40 hover:bg-slate-900/70'}"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-indigo-400 font-mono font-medium">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    <span>agent-spine</span>
                  </div>
                  <span class="text-[10px] font-mono text-indigo-400/80 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/20">4 cmds</span>
                </div>
                <p class="text-[10px] text-slate-400 mt-1 pl-3.5 leading-relaxed">
                  Deterministic DAG runner, milestone gates, and state replay.
                </p>
              </a>
            </li>
          </ul>
        </div>

        <!-- Section: DOCUMENTATION HUB -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Documentation Hub</span>
          </div>
          <ul class="space-y-1">
            <li>
              <a href="/docs" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all">
                <Book size={14} class="text-slate-400" />
                <span>Docs Home</span>
              </a>
            </li>
            <li>
              <a href="/docs/architecture" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all">
                <Layers size={14} class="text-indigo-400" />
                <span>Architecture</span>
              </a>
            </li>
            <li>
              <a href="/docs/agstack" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all">
                <Layers size={14} class="text-cyan-400" />
                <span>AGSTACK SDLC</span>
              </a>
            </li>
            <li>
              <a href="/registry" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all">
                <Workflow size={14} class="text-cyan-400" />
                <span>Registry & Workflows</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Strict Dual-Engine Invariant Footer -->
        <div class="pt-5 border-t border-white/[0.08] text-slate-400 text-xs">
          <span class="text-slate-300 font-medium block mb-1">Dual-Engine Invariant</span>
          <p class="text-slate-400 leading-relaxed text-[11px]">Cognitive routing (<span class="text-cyan-400 font-mono">brain</span>) and deterministic state execution (<span class="text-indigo-400 font-mono">spine</span>).</p>
        </div>
      </div>

    {:else}
      <!-- Documentation Mode: Navigation Tree -->
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
                <span>Dual-Engine Topology</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Section: CORE ARCHITECTURE -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Core Engines</span>
          </div>
          <ul class="space-y-2">
            <li>
              <a 
                href="/docs/memory" 
                class="group flex flex-col p-2.5 rounded-xl border transition-all {pathname === '/docs/memory' ? 'border-cyan-500/50 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-white/[0.08] bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-900/70'}"
              >
                <div class="flex items-center gap-2 text-cyan-400 font-mono font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>agent-brain Manual</span>
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
                  <span>agent-spine Manual</span>
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
              <a 
                href="/docs/agstack" 
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs/agstack' ? 'bg-gradient-to-r from-indigo-500/15 to-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400 shadow-[inset_0_0_12px_rgba(6,182,212,0.08)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'}"
              >
                <Layers size={14} class="text-cyan-400" />
                <span>agstack Mode & Matrix</span>
              </a>
            </li>
            <li>
              <a href="/registry" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all">
                <Book size={14} class="text-slate-400" />
                <span>Minimalist Entrepreneurship</span>
              </a>
            </li>
            <li>
              <a href="/registry" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all">
                <span class="text-yellow-400 font-mono">★</span>
                <span>Garry Tan gstack Review Engine</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Section: CLI REFERENCE -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-headline font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>CLI Reference</span>
          </div>
          <ul class="space-y-1">
            <li>
              <a href="/docs/cli" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all">
                <Terminal size={14} class="text-cyan-400" />
                <span>CLI Overview</span>
              </a>
            </li>
            <li>
              <a href="/docs/cli/agent-brain" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all font-mono text-[11px]">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>agent-brain CLI</span>
              </a>
            </li>
            <li>
              <a href="/docs/cli/agent-spine" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all font-mono text-[11px]">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>agent-spine CLI</span>
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
              <a 
                href="/docs/invariants" 
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs/invariants' ? 'bg-gradient-to-r from-indigo-500/15 to-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400 shadow-[inset_0_0_12px_rgba(6,182,212,0.08)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'}"
              >
                <Shield size={14} class="text-cyan-400" />
                <span>The 4 Engineering Invariants</span>
              </a>
            </li>
            <li>
              <a href="/docs/invariants#verification-harness" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all font-mono text-[11px]">
                <span class="text-cyan-400 font-bold">.verify/</span>
                <span>Deterministic Harness</span>
              </a>
            </li>
            <li>
              <a href="/docs/invariants#boundary-discipline" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all">
                <span class="text-emerald-400 font-mono">🛡</span>
                <span>Boundary Isolation Protocol</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Footer invariant -->
        <div class="pt-6 border-t border-white/[0.06] text-slate-400">
          <div class="flex items-center gap-2">
            <span class="text-indigo-400 font-mono">ℹ</span>
            <span class="text-[11px]">Strict dual-engine invariant applied.</span>
          </div>
        </div>
      </div>
    {/if}

  </aside>

  <!-- MAIN DOCUMENTATION CANVAS: The ONLY scrollable element in documentation views -->
  <main 
    bind:this={mainScrollContainer}
    onscroll={handleScroll}
    class="flex-1 h-full overflow-y-auto px-6 sm:px-10 lg:px-12 py-8 bg-[#0a0a0c] selection:bg-cyan-500/20 selection:text-cyan-300"
  >
    <div class="max-w-4xl mx-auto">
      
      <!-- Breadcrumb Header -->
      <div class="mb-6 pb-4 border-b border-white/[0.08] flex items-center justify-between">
        <nav class="flex items-center gap-2 text-xs font-mono text-slate-400" aria-label="Breadcrumb">
          <a href={activeTab === 'cli' ? "/docs/cli" : "/docs"} class="hover:text-cyan-400 transition">
            {activeTab === 'cli' ? 'CLI Reference' : 'Docs'}
          </a>
          <ChevronRight size={12} class="text-slate-600" />
          <span class="text-cyan-400 font-medium">
            {pathname.endsWith('/agent-brain') ? 'agent-brain CLI' : pathname.endsWith('/agent-spine') ? 'agent-spine CLI' : pathname.endsWith('/cli') ? 'CLI Reference Manual' : pathname.endsWith('/agstack') ? 'AGSTACK SDLC' : pathname.endsWith('/invariants') ? 'Engineering Invariants' : pathname.endsWith('/architecture') ? 'Dual-Engine Architecture' : pathname.endsWith('/installation') ? 'Installation' : pathname.endsWith('/memory') ? 'agent-brain Manual' : pathname.endsWith('/workflows') ? 'agent-spine Manual' : 'Introduction & Overview'}
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

      <!-- Embedded Documentation Footer -->
      <footer class="mt-20 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 pb-16">
        <p>© 2026 Autonomic AI. Autonomous Agent Engineering OS ({data?.ecosystemVersion || 'v1.0.0-rc2'}). All systems operational.</p>
        <div class="flex items-center gap-4">
          <a href="/registry" class="hover:text-cyan-400 transition">Registry</a>
          <a href="/docs/invariants" class="hover:text-cyan-400 transition">Invariants</a>
          <a href="/docs/architecture" class="hover:text-cyan-400 transition">Architecture</a>
          <a href="https://autonomic-ai.openstatus.dev" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition">Status</a>
        </div>
      </footer>

    </div>
  </main>

  <!-- RIGHT RAIL: Fixed, independent scroll, dynamic heading/command list -->
  <aside class="w-72 xl:w-80 shrink-0 hidden xl:block h-full overflow-y-auto px-6 py-8 border-l border-white/[0.06] text-xs font-body bg-[#0a0a0c]">
    <div class="space-y-6">
      <div>
        <div class="px-2 mb-3 text-[11px] font-headline font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <FileText size={13} class="text-cyan-400" />
            <span>ON THIS PAGE</span>
          </div>
          {#if tocItems.length > 0}
            <span class="text-[10px] font-mono text-slate-500 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">{tocItems.length}</span>
          {/if}
        </div>

        {#if tocItems.length > 0}
          <ul class="space-y-1 text-slate-400 text-xs font-body">
            {#each tocItems as item}
              <li class="{item.level === 3 ? 'pl-3 border-l border-white/10 ml-2 my-0.5' : ''}">
                <button
                  type="button"
                  onclick={() => scrollToHeading(item.id)}
                  class="text-left w-full break-words leading-relaxed py-1 px-2 rounded-md transition-all cursor-pointer group flex items-start gap-1.5 {activeTocId === item.id ? 'bg-cyan-950/50 text-cyan-300 font-medium border-l-2 border-cyan-400 shadow-[inset_0_0_8px_rgba(6,182,212,0.12)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'}"
                >
                  {#if activeTocId === item.id}
                    <span class="text-cyan-400 font-mono text-[10px] mt-0.5">›</span>
                  {/if}
                  <span class="flex-1 {item.level === 3 ? 'font-mono text-[11px]' : ''}">{item.text}</span>
                </button>
              </li>
            {/each}
          </ul>
        {:else}
          <div class="text-[11px] text-slate-500 italic px-2">
            Overview section
          </div>
        {/if}
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
