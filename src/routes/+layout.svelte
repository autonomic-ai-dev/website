<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Menu, X } from "lucide-svelte";
  import AnimatedBackground from "$lib/components/AnimatedBackground.svelte";
  let { children, data } = $props();

  let isMobileNavOpen = $state(false);

  $effect(() => {
    $page.url.pathname;
    isMobileNavOpen = false;
  });

  onMount(() => {
    document.documentElement.classList.add('dark');
  });

  const normalizedPath = $derived($page.url.pathname === '/' ? '' : $page.url.pathname.replace(/\/+$/, ''));
  const canonicalUrl = $derived(`https://autonomic-ai.dev${normalizedPath || '/'}`);

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
        "softwareVersion": data?.ecosystemVersion || "v1.0.0-rc3",
        "description": "Autonomous AI agent engineering operating system featuring agent-brain (HNSW vector memory & MCP hub) and agent-spine (deterministic YAML DAG runner)."
      },
      {
        "@type": "Organization",
        "name": "Autonomic AI",
        "url": "https://autonomic-ai.dev",
        "logo": "https://autonomic-ai.dev/logo.png",
        "sameAs": [
          "https://github.com/autonomic-ai-dev",
          "https://autonomic-ai.openstatus.dev"
        ]
      },
      {
        "@type": "WebSite",
        "name": "Autonomic AI",
        "url": "https://autonomic-ai.dev",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://autonomic-ai.dev/registry?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
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
  <link rel="canonical" href={canonicalUrl} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
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

<div class="bg-black text-neutral-100 font-body selection:bg-neutral-800 selection:text-white antialiased relative min-h-screen overflow-x-clip">
  
  <!-- Framer Motion-Driven Rich DevEx Atmospheric Background & Neural Mesh -->
  <AnimatedBackground />

  <!-- Shared Component: TopNavBar (Minimalist Island Header) -->
  <header class="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-6xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] bg-black/85 backdrop-blur-xl z-50 transition-all duration-200">
    <div class="flex justify-between items-center px-4 sm:px-6 py-3 w-full">
      <!-- Brand Logo + Wordmark & Live Status -->
      <a class="font-headline text-base font-bold tracking-tight text-white flex items-center gap-2.5 sm:gap-3 group shrink-0" href="/">
        <div class="relative w-7 h-7 rounded-lg overflow-hidden border border-white/15 bg-black p-0.5 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
          <img alt="Autonomic AI Logo" class="w-full h-full object-contain" src="/logo.svg" />
        </div>
        <span class="tracking-tight text-white font-headline font-semibold text-sm whitespace-nowrap shrink-0">Autonomic AI</span>
        <span class="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium text-neutral-300 bg-white/[0.04] border border-white/10 whitespace-nowrap shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span class="whitespace-nowrap">{data?.ecosystemVersion || 'v1.0.0-rc2'}</span>
        </span>
      </a>

      <!-- Primary Nav Links -->
      <nav class="hidden lg:flex items-center gap-6 font-headline text-xs font-medium text-neutral-400">
        <a class="transition-colors duration-150 hover:text-white {$page.url.pathname === '/' ? 'text-white font-semibold' : ''}" href="/#platform">Platform</a>
        <a class="transition-colors duration-150 hover:text-white {$page.url.pathname.startsWith('/docs/architecture') ? 'text-white font-semibold' : ''}" href="/docs/architecture">Architecture</a>
        <a class="transition-colors duration-150 hover:text-white {$page.url.pathname.startsWith('/registry') ? 'text-white font-semibold' : ''}" href="/registry">Registry</a>
        <a class="transition-colors duration-150 hover:text-white {$page.url.pathname.startsWith('/docs') && !$page.url.pathname.startsWith('/docs/cli') ? 'text-white font-semibold' : ''}" href="/docs">Docs</a>
        <a class="transition-colors duration-150 hover:text-white {$page.url.pathname.startsWith('/docs/cli') ? 'text-white font-semibold' : ''}" href="/docs/cli">CLI Reference</a>
        <a class="text-neutral-400 hover:text-emerald-400 transition-colors duration-150 flex items-center gap-1.5" href="https://autonomic-ai.openstatus.dev" target="_blank" rel="noopener noreferrer">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Status</span>
        </a>
      </nav>

      <!-- Trailing Action: GitHub Org Link & Mobile Menu Toggle -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <a 
          href="https://github.com/autonomic-ai-dev" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 text-xs font-mono text-neutral-300 hover:text-white transition-all duration-150 active:scale-95 shrink-0"
          aria-label="GitHub Repository"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          <span class="hidden sm:inline">GitHub</span>
        </a>

        <button 
          type="button"
          onclick={() => isMobileNavOpen = !isMobileNavOpen}
          class="lg:hidden p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 hover:text-white transition cursor-pointer"
          aria-label="Toggle Navigation Menu"
          aria-expanded={isMobileNavOpen}
        >
          {#if isMobileNavOpen}
            <X class="w-4 h-4" />
          {:else}
            <Menu class="w-4 h-4" />
          {/if}
        </button>
      </div>
    </div>

    {#if isMobileNavOpen}
      <div class="lg:hidden px-4 pt-2 pb-4 border-t border-white/10 flex flex-col gap-1 text-sm font-headline bg-black/95 rounded-b-2xl">
        <a 
          onclick={() => isMobileNavOpen = false} 
          class="px-3 py-2 rounded-lg transition-colors {$page.url.pathname === '/' ? 'text-white bg-white/[0.06] font-semibold' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}" 
          href="/#platform"
        >
          Platform
        </a>
        <a 
          onclick={() => isMobileNavOpen = false} 
          class="px-3 py-2 rounded-lg transition-colors {$page.url.pathname.startsWith('/docs/architecture') ? 'text-white bg-white/[0.06] font-semibold' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}" 
          href="/docs/architecture"
        >
          Architecture
        </a>
        <a 
          onclick={() => isMobileNavOpen = false} 
          class="px-3 py-2 rounded-lg transition-colors {$page.url.pathname.startsWith('/registry') ? 'text-white bg-white/[0.06] font-semibold' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}" 
          href="/registry"
        >
          Registry
        </a>
        <a 
          onclick={() => isMobileNavOpen = false} 
          class="px-3 py-2 rounded-lg transition-colors {$page.url.pathname.startsWith('/docs') && !$page.url.pathname.startsWith('/docs/cli') ? 'text-white bg-white/[0.06] font-semibold' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}" 
          href="/docs"
        >
          Docs
        </a>
        <a 
          onclick={() => isMobileNavOpen = false} 
          class="px-3 py-2 rounded-lg transition-colors {$page.url.pathname.startsWith('/docs/cli') ? 'text-white bg-white/[0.06] font-semibold' : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'}" 
          href="/docs/cli"
        >
          CLI Reference
        </a>
        <a 
          onclick={() => isMobileNavOpen = false} 
          class="px-3 py-2 rounded-lg text-neutral-400 hover:text-emerald-400 transition-colors flex items-center justify-between" 
          href="https://autonomic-ai.openstatus.dev" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <span class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Status</span>
          </span>
          <span class="text-xs font-mono text-neutral-500">openstatus.dev</span>
        </a>
      </div>
    {/if}
  </header>

  <!-- Main Content Container -->
  <div class="relative {$page.url.pathname.startsWith('/docs') ? 'pt-20 sm:pt-24' : 'pt-24 sm:pt-28'}">
    {@render children()}
  </div>

  <!-- Shared Component: Footer (Minimalist Pure Black) -->
  <footer class="w-full bg-black border-t border-white/10 relative z-10 text-xs font-body text-neutral-400 mt-24">
    <div class="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col gap-8">
      <!-- Top Row: Logo, Status Pill, Nav Links -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
        <div class="flex items-center gap-3">
          <div class="w-6 h-6 rounded-md overflow-hidden border border-white/15 bg-black p-0.5 flex items-center justify-center">
            <img alt="Autonomic AI Logo" class="w-full h-full object-contain" src="/logo.svg" />
          </div>
          <span class="font-headline text-sm font-semibold text-white tracking-tight">Autonomic AI</span>
          <a href="https://autonomic-ai.openstatus.dev" target="_blank" rel="noopener noreferrer" class="ml-3 inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/[0.03] text-neutral-300 border border-white/10 hover:border-white/20 transition">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            All systems operational
          </a>
        </div>
        <!-- Synchronized Navigation Links matching Header -->
        <nav class="flex flex-wrap items-center gap-6 font-mono text-xs text-neutral-400">
          <a class="hover:text-white transition-colors duration-150" href="/#platform">Platform</a>
          <a class="hover:text-white transition-colors duration-150" href="/docs/architecture">Architecture</a>
          <a class="hover:text-white transition-colors duration-150" href="/registry">Registry</a>
          <a class="hover:text-white transition-colors duration-150" href="/docs">Docs</a>
          <a class="hover:text-white transition-colors duration-150" href="/docs/cli">CLI Reference</a>
          <a class="hover:text-emerald-400 transition-colors duration-150 flex items-center gap-1.5" href="https://autonomic-ai.openstatus.dev" target="_blank" rel="noopener noreferrer">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Status</span>
          </a>
          <a class="hover:text-white transition-colors duration-150" href="https://github.com/autonomic-ai-dev" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
      </div>
      <!-- Bottom Row -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-neutral-500 font-mono text-[11px]">
        <p>© 2026 Autonomic AI. The Cognitive Governor & Procedure Graph for Autonomous Coding Agents ({data?.ecosystemVersion || 'v1.0.0-rc2'}).</p>
        <p class="text-neutral-500">Built for agentic precision.</p>
      </div>
    </div>
  </footer>

</div>
