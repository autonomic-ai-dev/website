<script lang="ts">
  import { BookOpen, Terminal, ShieldAlert, GitBranch } from "lucide-svelte";
  let { children } = $props();
</script>

<div class="flex flex-col md:flex-row min-h-screen pt-24">
  <!-- Docs Sidebar -->
  <aside class="w-full md:w-64 border-r border-slate-200 dark:border-slate-800 p-6 overflow-y-auto hidden md:block shrink-0">
    <div class="mb-8">
      <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Getting Started</h3>
      <ul class="flex flex-col gap-2">
        <li><a href="/docs" class="text-brand-600 dark:text-brand-400 font-medium text-sm flex items-center gap-2"><BookOpen size={16} /> Introduction</a></li>
        <li><a href="/docs/installation" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm flex items-center gap-2"><Terminal size={16} /> Installation</a></li>
      </ul>
    </div>

    <div class="mb-8">
      <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Core Concepts</h3>
      <ul class="flex flex-col gap-2">
        <li><a href="/docs/architecture" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm flex items-center gap-2"><GitBranch size={16} /> Architecture</a></li>
        <li><a href="/docs/security" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm flex items-center gap-2"><ShieldAlert size={16} /> Security</a></li>
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
