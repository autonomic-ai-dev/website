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
  let activeModalSvg = $state<string | null>(null);

  function openDiagramModal(svgHtml: string) {
    activeModalSvg = svgHtml;
  }

  function closeDiagramModal() {
    activeModalSvg = null;
  }

  interface TocItem {
    id: string;
    text: string;
    level: number;
  }
  let tocItems = $state<TocItem[]>([]);
  let activeTocId = $state<string>("");
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

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && activeModalSvg) {
          closeDiagramModal();
        }
      };

      window.addEventListener("hashchange", handleHashChange);
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("hashchange", handleHashChange);
        window.removeEventListener("keydown", handleKeyDown);
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
    if (!browser || isScrollingFromClick) return;
    const article = document.querySelector("article");
    if (!article) return;

    const headings = article.querySelectorAll("h2[id], h3[id], section[id]");
    if (headings.length === 0) return;

    let currentActiveId = "";

    for (let i = 0; i < headings.length; i++) {
      const h = headings[i] as HTMLElement;
      if (!tocItems.some(item => item.id === h.id)) continue;

      const rect = h.getBoundingClientRect();
      if (rect.top <= 140) {
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
    if (!browser) return;
    const el = document.getElementById(id);
    if (el) {
      isScrollingFromClick = true;
      activeTocId = id;
      activeHash = `#${id}`;
      history.pushState(null, "", `#${id}`);

      const headerOffset = 96;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth"
      });

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrollingFromClick = false;
      }, 700);
    }
  }

  function decodeHtmlEntities(str: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

  function sanitizeMermaidCode(str: string): string {
    return str
      .replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.[0-9]+\s*\)/gi, '#404040')
      .replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*1(?:\.0)?\s*\)/gi, '#ffffff')
      .replace(/rgba\([^)]+\)/gi, '#262626');
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
        theme: "base",
        securityLevel: "loose",
        themeVariables: {
          darkMode: true,
          background: "#000000",
          mainBkg: "#09090b",
          nodeBorder: "#333333",
          primaryColor: "#09090b",
          primaryTextColor: "#f4f4f5",
          primaryBorderColor: "#404040",
          lineColor: "#52525b",
          secondaryColor: "#18181b",
          secondaryTextColor: "#d4d4d8",
          secondaryBorderColor: "#333333",
          tertiaryColor: "#18181b",
          edgeLabelBackground: "#09090b",
          clusterBkg: "#050505",
          clusterBorder: "#27272a",
          actorBkg: "#09090b",
          actorBorder: "#404040",
          actorTextColor: "#ffffff",
          actorLineColor: "#3f3f46",
          signalColor: "#71717a",
          signalTextColor: "#e4e4e7",
          labelBoxBkgColor: "#09090b",
          labelBoxBorderColor: "#333333",
          labelTextColor: "#e4e4e7",
          loopTextColor: "#a1a1aa",
          noteBkgColor: "#18181b",
          noteBorderColor: "#333333",
          noteTextColor: "#e4e4e7",
          fontFamily: "Fira Code, JetBrains Mono, monospace",
          fontSize: "12px"
        }
      });

      for (let i = 0; i < blocks.length; i++) {
        const el = blocks[i] as HTMLElement;
        if (el.dataset.mermaidRendered === "true") continue;
        el.dataset.mermaidRendered = "true";

        const rawCode = el.innerText || el.textContent || "";
        const code = sanitizeMermaidCode(decodeHtmlEntities(rawCode).trim());
        if (!code) continue;

        const id = `mermaid-svg-${Date.now()}-${i}`;
        try {
          const { svg } = await mermaid.render(id, code);
          const wrapper = document.createElement("div");
          wrapper.className = "mermaid-diagram-container group relative my-8 p-6 bg-neutral-950/80 border border-white/10 rounded-2xl overflow-x-auto shadow-2xl flex justify-center backdrop-blur-md cursor-zoom-in hover:border-white/25 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all";
          wrapper.title = "Click to enlarge diagram";
          wrapper.innerHTML = `
            ${svg}
            <div class="absolute top-3 right-3 text-[10px] font-mono text-neutral-300 bg-neutral-900/90 px-2.5 py-1 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
              <span class="text-xs">⤢</span>
              <span>Click to enlarge</span>
            </div>
          `;
          wrapper.onclick = () => {
            openDiagramModal(svg);
          };
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
      btn.className = "copy-code-btn absolute top-3 right-3 px-2 py-1 bg-white/[0.04] hover:bg-white/10 text-neutral-400 hover:text-white rounded text-xs font-mono transition flex items-center gap-1 opacity-0 group-hover:opacity-100 border border-white/10 cursor-pointer";
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
        if (browser && !window.location.hash) {
          window.scrollTo(0, 0);
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

    if (browser) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      if (browser) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  });
</script>

<!-- DOCUMENTATION FRAMEWORK: Responsive three-column layout below floating header -->
<div class="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)] bg-transparent text-neutral-300 font-body w-full items-start">
  
  <!-- Mobile Navigation Header Bar -->
  <div class="lg:hidden px-6 py-3 border-b border-white/10 flex justify-between items-center bg-black/90 backdrop-blur-md shrink-0 sticky top-16 z-40 w-full">
    <div class="flex items-center gap-2">
      <span class="text-xs font-mono text-white font-semibold uppercase tracking-wider">{activeTab === 'cli' ? 'CLI REFERENCE' : 'DOCUMENTATION'}</span>
      <ChevronRight size={14} class="text-neutral-500" />
      <span class="text-xs font-mono text-neutral-200 truncate max-w-[180px]">
        {pathname.endsWith('/agent-brain') ? 'agent-brain CLI' : pathname.endsWith('/agent-spine') ? 'agent-spine CLI' : pathname.endsWith('/cli') ? 'CLI Overview' : pathname.endsWith('/agstack') ? 'AGSTACK SDLC' : pathname.endsWith('/minimalist-entrepreneur') ? 'Minimalist Entrepreneur' : pathname.endsWith('/gstack') ? 'gstack Review' : pathname.endsWith('/verification') ? 'Verification' : pathname.endsWith('/invariants') ? 'Invariants' : 'Overview'}
      </span>
    </div>
    <button 
      onclick={() => isMobileDocsMenuOpen = !isMobileDocsMenuOpen}
      class="p-2 bg-neutral-900 border border-white/10 rounded-lg text-white hover:bg-white/10 transition"
      aria-label="Toggle Navigation"
    >
      {#if isMobileDocsMenuOpen} <X size={18} /> {:else} <Menu size={18} /> {/if}
    </button>
  </div>

  <!-- LEFT SIDEBAR: Sticky, independent scroll, page navigation tree -->
  <aside class="{isMobileDocsMenuOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 xl:w-72 shrink-0 sticky top-20 sm:top-24 h-auto lg:h-[calc(100vh-6rem)] self-start overflow-y-auto px-5 py-6 border-b lg:border-b-0 lg:border-r border-white/10 text-xs font-body bg-black/40 backdrop-blur-md z-30">
    
    {#if activeTab === 'cli'}
      <!-- CLI Reference Mode: Page Navigation Only -->
      <div class="space-y-6">
        <!-- Section: CLI REFERENCE -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
            <span>CLI Reference</span>
          </div>
          <ul class="space-y-1">
            <li>
              <a 
                href="/docs/cli" 
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs/cli' ? 'bg-white/[0.08] text-white border-l-2 border-white' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}"
              >
                <Terminal size={14} class="text-neutral-300" />
                <span>CLI Overview</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Section: CORE ENGINES -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
            <span>Dual Engines</span>
          </div>
          <ul class="space-y-2">
            <li>
              <a 
                href="/docs/cli/agent-brain" 
                class="group flex flex-col p-2.5 rounded-xl border transition-all {pathname === '/docs/cli/agent-brain' ? 'border-white/30 bg-white/[0.06] text-white' : 'border-white/10 bg-neutral-950/60 hover:border-white/20 hover:bg-neutral-900/40 text-neutral-400 hover:text-white'}"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 font-mono font-medium text-white">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>agent-brain</span>
                  </div>
                  <span class="text-[10px] font-mono text-neutral-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/10">6 cmds</span>
                </div>
                <p class="text-[10px] text-neutral-400 mt-1 pl-3.5 leading-relaxed">
                  Reasoning, vector memory, AST router, and MCP gateway.
                </p>
              </a>
            </li>
            <li>
              <a 
                href="/docs/cli/agent-spine" 
                class="group flex flex-col p-2.5 rounded-xl border transition-all {pathname === '/docs/cli/agent-spine' ? 'border-white/30 bg-white/[0.06] text-white' : 'border-white/10 bg-neutral-950/60 hover:border-white/20 hover:bg-neutral-900/40 text-neutral-400 hover:text-white'}"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 font-mono font-medium text-white">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    <span>agent-spine</span>
                  </div>
                  <span class="text-[10px] font-mono text-neutral-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/10">4 cmds</span>
                </div>
                <p class="text-[10px] text-neutral-400 mt-1 pl-3.5 leading-relaxed">
                  Deterministic DAG runner, milestone gates, and state replay.
                </p>
              </a>
            </li>
          </ul>
        </div>

        <!-- Strict Dual-Engine Invariant Footer -->
        <div class="pt-5 border-t border-white/10 text-neutral-400 text-xs">
          <span class="text-neutral-300 font-medium block mb-1">Dual-Engine Invariant</span>
          <p class="text-neutral-400 leading-relaxed text-[11px]">Cognitive routing (<span class="text-white font-mono">brain</span>) and deterministic state execution (<span class="text-white font-mono">spine</span>).</p>
        </div>
      </div>

    {:else}
      <!-- Documentation Mode: Navigation Tree -->
      <div class="space-y-6">
        <!-- Section: GETTING STARTED -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
            <span>Getting Started</span>
          </div>
          <ul class="space-y-1">
            <li>
              <a 
                href="/docs" 
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs' ? 'bg-white/[0.08] text-white border-l-2 border-white' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}"
              >
                <Book size={14} class="text-neutral-300" />
                <span>Introduction & Overview</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/installation" 
                class="flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs/installation' ? 'bg-white/[0.08] text-white border-l-2 border-white' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}"
              >
                <div class="flex items-center gap-2">
                  <span class="text-neutral-500 font-mono">⚡</span>
                  <span>Quickstart Execution</span>
                </div>
                <span class="text-[10px] font-mono text-neutral-500">2 min</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/architecture" 
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs/architecture' ? 'bg-white/[0.08] text-white border-l-2 border-white' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}"
              >
                <Layers size={14} class="text-neutral-300" />
                <span>Dual-Engine Topology</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Section: CORE ARCHITECTURE -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
            <span>Core Engines</span>
          </div>
          <ul class="space-y-2">
            <li>
              <a 
                href="/docs/memory" 
                class="group flex flex-col p-2.5 rounded-xl border transition-all {pathname === '/docs/memory' ? 'border-white/30 bg-white/[0.06] text-white' : 'border-white/10 bg-neutral-950/60 hover:border-white/20 hover:bg-neutral-900/40 text-neutral-400 hover:text-white'}"
              >
                <div class="flex items-center gap-2 font-mono font-medium text-white">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>agent-brain Manual</span>
                </div>
                <p class="text-[10px] text-neutral-400 mt-1 pl-3.5 leading-relaxed">
                  Cognitive governor, procedure graph, and token knapsack packing.
                </p>
              </a>
            </li>
            <li>
              <a 
                href="/docs/workflows" 
                class="group flex flex-col p-2.5 rounded-xl border transition-all {pathname === '/docs/workflows' ? 'border-white/30 bg-white/[0.06] text-white' : 'border-white/10 bg-neutral-950/60 hover:border-white/20 hover:bg-neutral-900/40 text-neutral-400 hover:text-white'}"
              >
                <div class="flex items-center gap-2 font-mono font-medium text-white">
                  <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  <span>agent-spine Manual</span>
                </div>
                <p class="text-[10px] text-neutral-400 mt-1 pl-3.5 leading-relaxed">
                  Declarative YAML DAGs, milestone approval gates, zero-human-block execution.
                </p>
              </a>
            </li>
          </ul>
        </div>

        <!-- Section: AGSTACK SDLC -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
            <span>AGSTACK SDLC</span>
          </div>
          <ul class="space-y-1">
            <li>
              <a 
                href="/docs/agstack" 
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs/agstack' ? 'bg-white/[0.08] text-white border-l-2 border-white' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}"
              >
                <Layers size={14} class="text-neutral-300" />
                <span>agstack Mode & Matrix</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/minimalist-entrepreneur" 
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs/minimalist-entrepreneur' ? 'bg-white/[0.08] text-white border-l-2 border-white' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}"
              >
                <Book size={14} class="text-neutral-300" />
                <span>Minimalist Entrepreneurship</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/gstack" 
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs/gstack' ? 'bg-white/[0.08] text-white border-l-2 border-white' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}"
              >
                <span class="text-neutral-400 font-mono">★</span>
                <span>Garry Tan gstack Review Engine</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Section: VERIFICATION & INVARIANTS -->
        <div>
          <div class="px-2 mb-2 text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
            <span>Verification & Invariants</span>
          </div>
          <ul class="space-y-1">
            <li>
              <a 
                href="/docs/invariants" 
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs/invariants' ? 'bg-white/[0.08] text-white border-l-2 border-white' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}"
              >
                <Shield size={14} class="text-neutral-300" />
                <span>The 4 Engineering Invariants</span>
              </a>
            </li>
            <li>
              <a 
                href="/docs/verification" 
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all {pathname === '/docs/verification' ? 'bg-white/[0.08] text-white border-l-2 border-white' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}"
              >
                <span class="text-neutral-300 font-mono text-[11px]">.verify/</span>
                <span class="font-mono text-[11px]">Deterministic Harness</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Footer invariant -->
        <div class="pt-6 border-t border-white/10 text-neutral-400">
          <div class="flex items-center gap-2">
            <span class="text-neutral-400 font-mono">ℹ</span>
            <span class="text-[11px]">Strict dual-engine invariant applied.</span>
          </div>
        </div>
      </div>
    {/if}

  </aside>

  <!-- MAIN DOCUMENTATION CANVAS: Centered article content -->
  <main class="flex-1 min-w-0 px-6 sm:px-10 lg:px-12 py-8 bg-transparent selection:bg-neutral-800 selection:text-white">
    <div class="max-w-4xl mx-auto">
      
      <!-- Breadcrumb Header -->
      <div class="mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
        <nav class="flex items-center gap-2 text-xs font-mono text-neutral-400" aria-label="Breadcrumb">
          <a href={activeTab === 'cli' ? "/docs/cli" : "/docs"} class="hover:text-white transition">
            {activeTab === 'cli' ? 'CLI Reference' : 'Docs'}
          </a>
          <ChevronRight size={12} class="text-neutral-600" />
          <span class="text-white font-medium">
            {pathname.endsWith('/agent-brain') ? 'agent-brain CLI' : pathname.endsWith('/agent-spine') ? 'agent-spine CLI' : pathname.endsWith('/cli') ? 'CLI Reference Manual' : pathname.endsWith('/agstack') ? 'AGSTACK SDLC' : pathname.endsWith('/minimalist-entrepreneur') ? 'Minimalist Entrepreneurship' : pathname.endsWith('/gstack') ? 'Garry Tan gstack Review Engine' : pathname.endsWith('/verification') ? 'Deterministic Verification' : pathname.endsWith('/invariants') ? 'Engineering Invariants' : pathname.endsWith('/architecture') ? 'Dual-Engine Architecture' : pathname.endsWith('/installation') ? 'Installation' : pathname.endsWith('/memory') ? 'Cognitive Governor & Memory' : pathname.endsWith('/workflows') ? 'agent-spine Manual' : 'Introduction & Overview'}
          </span>
        </nav>
        <div class="hidden sm:flex items-center gap-2 text-[11px] font-mono text-neutral-400">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>SPEC {data?.ecosystemVersion || 'v1.0.0-rc2'}</span>
        </div>
      </div>

      <!-- Article Content -->
      <article class="prose prose-invert max-w-none text-neutral-300">
        {@render children()}
      </article>

    </div>
  </main>

  <!-- RIGHT RAIL: Sticky, independent scroll, dynamic heading/command list -->
  <aside class="w-72 xl:w-80 shrink-0 hidden xl:block sticky top-20 sm:top-24 h-auto lg:h-[calc(100vh-6rem)] self-start overflow-y-auto px-6 py-8 border-l border-white/10 text-xs font-body bg-black/40 backdrop-blur-md">
    <div class="space-y-6">
      <div>
        <div class="px-2 mb-3 text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <FileText size={13} class="text-neutral-400" />
            <span>ON THIS PAGE</span>
          </div>
          {#if tocItems.length > 0}
            <span class="text-[10px] font-mono text-neutral-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/10">{tocItems.length}</span>
          {/if}
        </div>

        {#if tocItems.length > 0}
          <ul class="space-y-1 text-neutral-400 text-xs font-body">
            {#each tocItems as item}
              <li class="{item.level === 3 ? 'pl-3 border-l border-white/10 ml-2 my-0.5' : ''}">
                <button
                  type="button"
                  onclick={() => scrollToHeading(item.id)}
                  class="text-left w-full break-words leading-relaxed py-1 px-2 rounded-md transition-all cursor-pointer group flex items-start gap-1.5 {activeTocId === item.id ? 'bg-white/[0.08] text-white font-medium border-l-2 border-white' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}"
                >
                  {#if activeTocId === item.id}
                    <span class="text-white font-mono text-[10px] mt-0.5">›</span>
                  {/if}
                  <span class="flex-1 {item.level === 3 ? 'font-mono text-[11px]' : ''}">{item.text}</span>
                </button>
              </li>
            {/each}
          </ul>
        {:else}
          <div class="text-[11px] text-neutral-500 italic px-2">
            Overview section
          </div>
        {/if}
      </div>

      <div class="pt-6 border-t border-white/10 space-y-3 font-mono text-xs text-neutral-400">
        <a 
          href="https://github.com/autonomic-ai-dev/website" 
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
        <div class="text-[11px] text-neutral-500 pt-2">
          Release {data?.ecosystemVersion || 'v1.0.0-rc2'}
        </div>
      </div>
    </div>
  </aside>

</div>

{#if activeModalSvg}
  <!-- DIAGRAM ZOOM MODAL: Blurred backdrop & enlarged inspection -->
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 md:p-12 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
    role="presentation"
    onclick={(e) => { if (e.target === e.currentTarget) closeDiagramModal(); }}
  >
    <div 
      class="relative max-w-6xl w-full max-h-[88vh] bg-neutral-950 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Zoomed Architecture Diagram"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-4 shrink-0">
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 rounded-full bg-white"></span>
          <span class="font-headline font-bold text-white text-base tracking-wide">Interactive Architecture Diagram</span>
          <span class="text-xs font-mono text-neutral-300 bg-white/[0.04] px-2.5 py-0.5 rounded border border-white/10">Zoomed Inspection</span>
        </div>
        <button 
          class="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-all cursor-pointer"
          onclick={closeDiagramModal}
          aria-label="Close zoomed diagram"
        >
          <X size={20} />
        </button>
      </div>

      <!-- Zoomed Diagram Body -->
      <div class="flex-1 overflow-auto flex items-center justify-center p-4 min-h-[250px] zoomed-diagram-modal-body">
        {@html activeModalSvg}
      </div>

      <!-- Modal Footer -->
      <div class="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs font-mono text-neutral-400 shrink-0">
        <span>Press <kbd class="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-white">ESC</kbd> or click outside to dismiss</span>
        <span class="text-white font-medium">Autonomic AI Engine Specification</span>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(.zoomed-diagram-modal-body svg) {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    max-height: 65vh !important;
    min-height: 250px !important;
  }
</style>
