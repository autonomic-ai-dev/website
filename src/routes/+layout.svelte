<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  let { children, data } = $props();

  onMount(() => {
    document.documentElement.classList.add('dark');
  });

  const structuredData = $derived({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Autonomic AI",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "macOS Apple Silicon (ARM64)",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "softwareVersion": data?.ecosystemVersion || "v1.0.0-rc2",
        "description": "Autonomous AI agent engineering operating system featuring agent-brain (HNSW vector memory & MCP hub) and agent-spine (deterministic YAML DAG runner)."
      },
      {
        "@type": "Organization",
        "name": "Autonomic AI",
        "url": "https://autonomic-ai.dev",
        "logo": "https://autonomic-ai.dev/logo.png",
        "sameAs": [
          "https://github.com/autonomic-ai-dev/agent-registry",
          "https://autonomic-ai.openstatus.dev"
        ]
      },
      {
        "@type": "WebSite",
        "name": "Autonomic AI",
        "url": "https://autonomic-ai.dev"
      }
    ]
  });
</script>

<svelte:head>
  <title>Autonomic AI — Autonomous AI Agent Operating System & MCP Router</title>
  <meta name="description" content="Autonomic AI is the operating system for autonomous engineering agents. Features agent-brain (HNSW vector memory, turn routing, skill registry) and agent-spine (deterministic YAML DAG runner)." />
  <meta name="keywords" content="autonomous AI agents, AI agent memory, MCP router, agent-brain, agent-spine, agstack, AI engineering OS, deterministic workflows, Model Context Protocol, Rust AI CLI" />
  <meta name="author" content="Autonomic AI Team" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="theme-color" content="#0a0a0c" />
  <link rel="canonical" href="https://autonomic-ai.dev{$page.url.pathname}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://autonomic-ai.dev{$page.url.pathname}" />
  <meta property="og:site_name" content="Autonomic AI" />
  <meta property="og:title" content="Autonomic AI — Autonomous AI Agent Operating System & MCP Router" />
  <meta property="og:description" content="Deterministic DAG workflows, HNSW vector memory, and intelligent MCP routing for AI coding agents." />
  <meta property="og:image" content="https://autonomic-ai.dev/logo.png" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@autonomic_ai" />
  <meta name="twitter:creator" content="@autonomic_ai" />
  <meta name="twitter:title" content="Autonomic AI — Autonomous AI Agent Operating System" />
  <meta name="twitter:description" content="Deterministic DAG workflows, HNSW vector memory, and intelligent MCP routing for AI coding agents." />
  <meta name="twitter:image" content="https://autonomic-ai.dev/logo.png" />

  <!-- Schema.org JSON-LD -->
  {@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<div class="bg-[#0a0a0c] text-slate-100 font-body selection:bg-cyan-500/30 selection:text-cyan-200 antialiased relative min-h-screen overflow-x-hidden">
  
  <!-- Ambient Glow Canvas Layer -->
  <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-cyan-500/10 to-transparent blur-[120px] rounded-full"></div>
    <div class="absolute top-[35%] -left-60 w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full"></div>
    <div class="absolute top-[65%] -right-60 w-[550px] h-[550px] bg-indigo-600/10 blur-[140px] rounded-full"></div>
    <!-- Subtle Grid Overlay -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
  </div>

  <!-- Shared Component: TopNavBar (Floating Island Header) -->
  <header class="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl rounded-full border border-cyan-500/20 shadow-[0_0_25px_rgba(6,182,212,0.15)] bg-slate-950/70 backdrop-blur-xl z-50 transition-all duration-200">
    <div class="flex justify-between items-center px-6 py-3 w-full">
      <!-- Brand Logo + Wordmark & Live Status -->
      <a class="font-headline text-base font-bold tracking-tight text-white flex items-center gap-3 group" href="/">
        <div class="relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-cyan-500/30 p-0.5 bg-slate-900 flex items-center justify-center">
          <img alt="Autonomic AI Logo" class="w-full h-full object-contain" src="/logo.png" />
        </div>
        <span class="tracking-tight text-white font-headline font-bold">Autonomic AI</span>
        <span class="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          {data?.ecosystemVersion || 'v1.0.0-rc2'} Online
        </span>
      </a>

      <!-- Primary Nav Links -->
      <nav class="hidden md:flex items-center gap-7 font-headline text-sm font-medium">
        <a class="transition-colors duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] {$page.url.pathname === '/' ? 'text-cyan-400 font-semibold' : 'text-slate-300'}" href="/#platform">Platform</a>
        <a class="transition-colors duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] {$page.url.pathname.startsWith('/docs/architecture') ? 'text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'text-slate-300'}" href="/docs/architecture">Architecture</a>
        <a class="transition-colors duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] {$page.url.pathname.startsWith('/registry') ? 'text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'text-slate-300'}" href="/registry">Registry</a>
        <a class="transition-colors duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] {$page.url.pathname.startsWith('/docs') && !$page.url.pathname.startsWith('/docs/cli') ? 'text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'text-slate-300'}" href="/docs">Docs</a>
        <a class="transition-colors duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] {$page.url.pathname.startsWith('/docs/cli') ? 'text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'text-slate-300'}" href="/docs/cli">CLI Reference</a>
        <a class="text-emerald-400 font-semibold transition-colors duration-200 hover:text-emerald-300 flex items-center gap-1.5" href="https://autonomic-ai.openstatus.dev" target="_blank" rel="noopener noreferrer">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Status</span>
        </a>
      </nav>

      <!-- Trailing Action: GitHub Monorepo Link -->
      <div class="flex items-center gap-3">
        <a 
          href="https://github.com/autonomic-ai-dev/agent-registry" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all duration-200 active:scale-95"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          <span class="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Main Content Container -->
  <div class="relative z-10 {$page.url.pathname.startsWith('/docs') ? 'pt-0' : 'pt-24 sm:pt-28'}">
    {@render children()}
  </div>

  <!-- Shared Component: Footer (hidden on docs pages because docs has an embedded scrollable footer) -->
  {#if !$page.url.pathname.startsWith('/docs')}
    <footer class="w-full bg-[#06070a] border-t border-white/[0.08] relative z-10 text-xs font-body text-slate-400 mt-20">
      <div class="w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
        <!-- Top Row: Logo, Status Pill, Nav Links -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
          <div class="flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg overflow-hidden ring-1 ring-cyan-500/30 p-0.5 bg-slate-900 flex items-center justify-center">
              <img alt="Autonomic AI Logo" class="w-full h-full object-contain" src="/logo.png" />
            </div>
            <span class="font-headline text-sm font-bold text-white tracking-tight">Autonomic AI</span>
            <a href="https://autonomic-ai.openstatus.dev" target="_blank" rel="noopener noreferrer" class="ml-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 transition">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              All systems operational • OpenStatus
            </a>
          </div>
          <!-- Links -->
          <nav class="flex flex-wrap items-center gap-6 font-mono text-xs">
            <a class="text-slate-400 hover:text-white transition-colors duration-150" href="/docs/architecture">Architecture</a>
            <a class="text-slate-400 hover:text-white transition-colors duration-150" href="/registry">Registry</a>
            <a class="text-slate-400 hover:text-white transition-colors duration-150" href="/#spec">Invariants</a>
            <a class="text-slate-400 hover:text-white transition-colors duration-150" href="/docs">Docs</a>
            <a class="text-slate-400 hover:text-white transition-colors duration-150" href="/docs/cli">CLI Reference</a>
            <a class="text-slate-400 hover:text-white transition-colors duration-150" href="https://autonomic-ai.openstatus.dev" target="_blank" rel="noopener noreferrer">Status</a>
            <a class="text-slate-400 hover:text-white transition-colors duration-150" href="https://github.com/autonomic-ai-dev/agent-registry" target="_blank" rel="noopener noreferrer">GitHub</a>
          </nav>
        </div>
        <!-- Bottom Row -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-500 font-mono text-[11px]">
          <p>© 2026 Autonomic AI. Autonomous Agent Engineering OS ({data?.ecosystemVersion || 'v1.0.0-rc2'}). All systems operational.</p>
          <p class="text-slate-500">Built for agentic precision.</p>
        </div>
      </div>
    </footer>
  {/if}

</div>
