<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { Menu, X, ExternalLink, Activity, ArrowRight } from "lucide-svelte";
  import { particles } from "$lib/actions/particles";
  let { children, data } = $props();

  let isMobileMenuOpen = $state(false);

  onMount(() => {
    document.documentElement.classList.add('dark');
  });
</script>

<svelte:head>
  <title>Autonomic AI Dev | Autonomous Agent Ecosystem</title>
  <meta name="description" content="Autonomic AI is an aerospace-grade, bio-digital computing mesh of 11 autonomous organs engineered in Rust with hardware acceleration." />
</svelte:head>

<div class="min-h-screen relative overflow-hidden bg-[#080b10] text-[#f0f6fc] font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
  
  <!-- Neural Particles Background -->
  <canvas use:particles class="fixed inset-0 z-0 pointer-events-none opacity-25"></canvas>

  <!-- Top Avionics Navigation Bar -->
  <nav class="fixed top-0 w-full z-50 bg-[#0d1117]/85 backdrop-blur-xl border-b border-white/[0.08]">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      
      <!-- Brand & Home Link -->
      <a href="/" class="flex items-center gap-3 group cursor-pointer">
        <div class="relative flex items-center justify-center">
          <img src="/logo.png" alt="Autonomic AI Logo" class="w-8 h-8 object-contain rounded-lg border border-cyan-500/30 shadow-[0_0_12px_rgba(0,242,254,0.2)] group-hover:border-cyan-400 transition-colors" />
          <span class="absolute -top-1 -right-1 flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
        </div>
        <div class="flex items-baseline gap-1.5 font-mono">
          <span class="font-bold text-base tracking-tight text-white">AUTONOMIC</span>
          <span class="text-xs text-cyan-400 font-semibold tracking-wider">AI</span>
          <span class="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 hidden sm:inline">{data?.ecosystemVersion || 'v1.0.0-beta.3.1'}</span>
        </div>
      </a>
      
      <!-- Center Desktop Navigation -->
      <div class="hidden md:flex items-center gap-7 text-xs font-mono">
        <a href="/#ecosystem" class="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
          <span>//</span>
          <span>Ecosystem</span>
        </a>
        <a href="/docs" class="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
          <span>//</span>
          <span>Docs</span>
        </a>
        <a href="/docs/cli" class="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
          <span>//</span>
          <span>CLI Reference</span>
        </a>
        <a href="/blog" class="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
          <span>//</span>
          <span>Dispatches</span>
        </a>
      </div>

      <!-- Right Action Controls -->
      <div class="hidden md:flex items-center gap-3">
        <a 
          href="https://github.com/autonomic-ai-dev" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="p-2 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-slate-300 hover:text-white border border-white/10 transition-colors"
          aria-label="GitHub Repositories"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </a>
        <a 
          href="https://agent-ci-dashboard.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-emerald-400 text-[#080b10] hover:shadow-[0_0_16px_rgba(0,242,254,0.4)] transition-all flex items-center gap-2 group"
        >
          <Activity size={13} class="text-[#080b10]" />
          <span>Mission Control</span>
          <ArrowRight size={12} class="group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="flex items-center gap-2 md:hidden">
        <button 
          class="p-2 text-slate-300 hover:text-white bg-[#161b22] border border-white/10 rounded-lg transition-colors"
          onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          {#if isMobileMenuOpen}
            <X size={20} />
          {:else}
            <Menu size={20} />
          {/if}
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Overlay -->
    {#if isMobileMenuOpen}
      <div class="md:hidden bg-[#0d1117] border-b border-white/[0.08] p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-2 font-mono text-sm">
        <a href="/#ecosystem" onclick={() => isMobileMenuOpen = false} class="text-slate-300 hover:text-cyan-400 py-1.5 flex items-center gap-2">
          <span class="text-cyan-500">&gt;</span>
          <span>Ecosystem Organs</span>
        </a>
        <a href="/docs" onclick={() => isMobileMenuOpen = false} class="text-slate-300 hover:text-cyan-400 py-1.5 flex items-center gap-2">
          <span class="text-cyan-500">&gt;</span>
          <span>Documentation</span>
        </a>
        <a href="/docs/cli" onclick={() => isMobileMenuOpen = false} class="text-slate-300 hover:text-cyan-400 py-1.5 flex items-center gap-2">
          <span class="text-cyan-500">&gt;</span>
          <span>CLI Reference</span>
        </a>
        <a href="/blog" onclick={() => isMobileMenuOpen = false} class="text-slate-300 hover:text-cyan-400 py-1.5 flex items-center gap-2">
          <span class="text-cyan-500">&gt;</span>
          <span>Blog Dispatches</span>
        </a>
        <div class="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
          <a 
            href="https://agent-ci-dashboard.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-center bg-gradient-to-r from-cyan-400 to-emerald-400 text-[#080b10] shadow-[0_0_12px_rgba(0,242,254,0.3)]"
          >
            Launch Mission Control
          </a>
          <a 
            href="https://github.com/autonomic-ai-dev" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="px-4 py-2 rounded-lg text-xs font-mono text-center bg-[#161b22] text-slate-300 border border-white/10"
          >
            GitHub Monorepo
          </a>
        </div>
      </div>
    {/if}
  </nav>

  <!-- Main Viewport Content -->
  <main class="relative z-10 pt-16">
    {@render children()}
  </main>
  
  <!-- Avionics Footer -->
  <footer class="relative z-10 bg-[#0d1117]/90 border-t border-white/[0.08] mt-32 py-10 font-mono text-xs">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      
      <div class="flex items-center gap-3">
        <img src="/logo.png" alt="Autonomic AI" class="w-6 h-6 object-contain rounded" />
        <span class="font-bold text-white tracking-wider">AUTONOMIC AI</span>
        <span class="text-slate-600">|</span>
        <span class="text-slate-400 text-[11px]">HOMEOSTATIC RUNTIME</span>
      </div>

      <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b22] border border-white/[0.08] text-[10px] text-slate-400">
        <span class="relative flex h-1.5 w-1.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
        <span class="text-emerald-400 font-semibold">11/11 ORGANS NOMINAL</span>
        <span class="text-slate-600">·</span>
        <span>LATENCY: &lt;0.8ms</span>
      </div>

      <div class="flex items-center gap-6 text-slate-400">
        <a href="/docs" class="hover:text-cyan-400 transition-colors">Docs</a>
        <a href="/docs/cli" class="hover:text-cyan-400 transition-colors">CLI</a>
        <a href="/blog" class="hover:text-cyan-400 transition-colors">Blog</a>
        <a href="https://github.com/autonomic-ai-dev" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors flex items-center gap-1">
          <span>GitHub</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  </footer>
</div>
