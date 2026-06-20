<script lang="ts">
  import { Menu, X, Book, Download, Terminal, Layers, Radio, Brain, Workflow, Shield, Plug, Server, Cpu, Eye, Heart, MessageSquare } from "lucide-svelte";
  import { page } from "$app/stores";
  let { children } = $props();

  let pathname = $derived($page.url.pathname);
  let isMobileDocsMenuOpen = $state(false);

  const linkClass = (path: string) => 
    pathname === path
      ? "text-brand-600 dark:text-brand-400 font-medium"
      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white";
</script>

<div class="flex flex-col md:flex-row min-h-screen pt-24">
  <!-- Mobile Docs Toggle -->
  <div class="md:hidden px-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 sticky top-20 z-40">
    <span class="font-bold text-slate-900 dark:text-white">Docs Navigation</span>
    <button onclick={() => isMobileDocsMenuOpen = !isMobileDocsMenuOpen} class="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm">
      {#if isMobileDocsMenuOpen} <X size={20} class="text-slate-900 dark:text-white" /> {:else} <Menu size={20} class="text-slate-900 dark:text-white" /> {/if}
    </button>
  </div>

  <!-- Docs Sidebar -->
  <aside class="{isMobileDocsMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-6 overflow-y-auto shrink-0 bg-slate-50 dark:bg-slate-950 z-30 relative">
    <div class="mb-8">
      <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Getting Started</h3>
      <ul class="flex flex-col gap-2">
        <li><a href="/docs" onclick={() => isMobileDocsMenuOpen = false} class="{linkClass('/docs')} text-sm flex items-center gap-2"><Book size={16} /> Introduction</a></li>
        <li><a href="/docs/installation" onclick={() => isMobileDocsMenuOpen = false} class="{linkClass('/docs/installation')} text-sm flex items-center gap-2"><Download size={16} /> Installation</a></li>
        <li><a href="/docs/cli" onclick={() => isMobileDocsMenuOpen = false} class="{linkClass('/docs/cli')} text-sm flex items-center gap-2"><Terminal size={16} /> CLI Reference</a></li>
      </ul>
    </div>

    <div class="mb-8">
      <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Core Concepts</h3>
      <ul class="flex flex-col gap-2">
        <li><a href="/docs/architecture" onclick={() => isMobileDocsMenuOpen = false} class="{linkClass('/docs/architecture')} text-sm flex items-center gap-2"><Layers size={16} /> Architecture</a></li>
        <li><a href="/docs/supervision" onclick={() => isMobileDocsMenuOpen = false} class="{linkClass('/docs/supervision')} text-sm flex items-center gap-2"><Server size={16} /> Supervision (Body)</a></li>
        <li><a href="/docs/memory" onclick={() => isMobileDocsMenuOpen = false} class="{linkClass('/docs/memory')} text-sm flex items-center gap-2"><Brain size={16} /> Memory (Brain)</a></li>
        <li><a href="/docs/workflows" onclick={() => isMobileDocsMenuOpen = false} class="{linkClass('/docs/workflows')} text-sm flex items-center gap-2"><Workflow size={16} /> Workflows (Spine)</a></li>
        <li><a href="/docs/maintenance" onclick={() => isMobileDocsMenuOpen = false} class="{linkClass('/docs/maintenance')} text-sm flex items-center gap-2"><Heart size={16} /> Maintenance (Heart)</a></li>
        <li><a href="/docs/event-bus" onclick={() => isMobileDocsMenuOpen = false} class="{linkClass('/docs/event-bus')} text-sm flex items-center gap-2"><Radio size={16} /> Event Bus (Nerves)</a></li>
        <li><a href="/docs/execution" onclick={() => isMobileDocsMenuOpen = false} class="{linkClass('/docs/execution')} text-sm flex items-center gap-2"><Cpu size={16} /> Execution (Muscle)</a></li>
        <li><a href="/docs/security" onclick={() => isMobileDocsMenuOpen = false} class="{linkClass('/docs/security')} text-sm flex items-center gap-2"><Shield size={16} /> Security (Immune)</a></li>
        <li><a href="/docs/visual-qa" onclick={() => isMobileDocsMenuOpen = false} class="{linkClass('/docs/visual-qa')} text-sm flex items-center gap-2"><Eye size={16} /> Visual QA (Eyes)</a></li>
        <li><a href="/docs/communication" onclick={() => isMobileDocsMenuOpen = false} class="{linkClass('/docs/communication')} text-sm flex items-center gap-2"><MessageSquare size={16} /> Communication (Mouth)</a></li>
        <li><a href="/docs/mcp" onclick={() => isMobileDocsMenuOpen = false} class="{linkClass('/docs/mcp')} text-sm flex items-center gap-2"><Plug size={16} /> MCP Integration</a></li>
      </ul>
    </div>
  </aside>

  <!-- Docs Content -->
  <main class="flex-1 p-6 md:p-12 max-w-4xl">
    <article class="prose prose-slate dark:prose-invert prose-brand max-w-none">
      {@render children()}
    </article>
  </main>
</div>
