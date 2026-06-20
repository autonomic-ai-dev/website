<script lang="ts">
  import { ArrowLeft, Calendar, User } from "lucide-svelte";
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.metadata.title} - Autonomic AI Dev</title>
  <meta name="description" content={data.metadata.excerpt} />
</svelte:head>

<main class="pt-32 pb-24 px-6 max-w-3xl mx-auto min-h-screen">
  <a href="/blog" class="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-12 transition-colors">
    <ArrowLeft size={20} />
    Back to Blog
  </a>

  <article class="prose prose-slate dark:prose-invert prose-brand max-w-none">
    <div class="not-prose mb-8">
      <div class="flex items-center gap-3 mb-4">
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400">{data.metadata.category}</span>
        <div class="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
          <Calendar size={14} />
          {data.metadata.date}
        </div>
        <div class="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
          <User size={14} />
          {data.metadata.author}
        </div>
      </div>
      <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">{data.metadata.title}</h1>
    </div>

    {#if data.component}
      <data.component />
    {/if}
  </article>
</main>
