<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { Menu, X } from "lucide-svelte";
  let { children } = $props();

  let isMobileMenuOpen = $state(false);

  onMount(() => {
    // Force dark theme
    document.documentElement.classList.add('dark');
  });
</script>

<svelte:head>
  <title>Autonomic AI Dev | Autonomous Agent Ecosystem</title>
  <meta name="description" content="Autonomic AI Dev builds advanced, self-governing autonomous agents. Explore Brain, Nerves, Heart, Muscle, and the CI dashboard ecosystem." />
</svelte:head>

<div class="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans selection:bg-brand-500/30">
  
  <!-- Animated Background Blobs -->
  <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div class="absolute bg-blob-1 w-[800px] h-[800px] rounded-full bg-brand-600/20 mix-blend-screen animate-pulse-glow" style="animation-delay: 0s;"></div>
    <div class="absolute bg-blob-2 w-[600px] h-[600px] rounded-full bg-accent-600/20 mix-blend-screen animate-pulse-glow" style="animation-delay: 2s;"></div>
    <div class="absolute bg-blob-3 w-[700px] h-[700px] rounded-full bg-indigo-600/20 mix-blend-screen animate-pulse-glow" style="animation-delay: 4s;"></div>
  </div>

  <!-- Navigation -->
  <nav class="fixed top-0 w-full z-50 glass border-b-0 border-white/5">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <a href="/" class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
        <img src="/logo.png" alt="Autonomic AI Logo" class="w-10 h-10 object-contain rounded-xl shadow-lg shadow-brand-500/20" />
        <span class="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Autonomic <span class="text-brand-600 dark:text-brand-300 font-medium">AI</span></span>
      </a>
      
      <div class="hidden md:flex items-center gap-8">
        <a href="/#agents" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Agents</a>
        <a href="/docs" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Docs</a>
        <a href="/blog" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Blog</a>
        <a href="https://agent-ci-dashboard.vercel.app" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all backdrop-blur-md flex items-center gap-2 group">
          <span>Mission Control</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>

      <!-- Mobile Controls -->
      <div class="flex items-center gap-2 md:hidden">
        <button 
          class="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          {#if isMobileMenuOpen}
            <X size={24} />
          {:else}
            <Menu size={24} />
          {/if}
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    {#if isMobileMenuOpen}
      <div class="md:hidden absolute top-20 left-0 w-full glass border-b border-slate-200 dark:border-white/10 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-2">
        <a href="/#agents" onclick={() => isMobileMenuOpen = false} class="text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white">Agents</a>
        <a href="/docs" onclick={() => isMobileMenuOpen = false} class="text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white">Docs</a>
        <a href="/blog" onclick={() => isMobileMenuOpen = false} class="text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white">Blog</a>
        <a href="https://agent-ci-dashboard.vercel.app" target="_blank" rel="noopener noreferrer" class="px-5 py-3 mt-2 rounded-xl text-center font-bold bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-lg">
          Launch Mission Control
        </a>
      </div>
    {/if}
  </nav>

  <!-- Main Content -->
  <main class="relative z-10 pt-20">
    {@render children()}
  </main>
  
  <!-- Footer -->
  <footer class="relative z-10 glass mt-32 border-t border-white/5 py-12">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-2">
        <img src="/logo.png" alt="Autonomic AI Logo" class="w-6 h-6 object-contain" />
        <span class="font-bold text-slate-900 dark:text-white">Autonomic AI Dev</span>
      </div>
      <p class="text-slate-400 text-sm">© {new Date().getFullYear()} Autonomic AI Dev. All rights reserved.</p>
      <div class="flex items-center gap-4">
        <a href="https://github.com/autonomic-ai-dev" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </a>
      </div>
    </div>
  </footer>
</div>
