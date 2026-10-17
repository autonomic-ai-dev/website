<script lang="ts">
  import { ArrowLeft, Calendar, User } from "lucide-svelte";
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.metadata.title} - Autonomic AI Dev</title>
  <meta name="description" content={data.metadata.excerpt} />
</svelte:head>

<main class="pt-8 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
  
  <a href="/blog" class="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 mb-8 transition-colors">
    <ArrowLeft size={14} />
    <span>// Back to Dispatches</span>
  </a>

  <article class="prose max-w-none">
    <div class="not-prose mb-10 pb-6 border-b border-white/[0.08]">
      <div class="flex items-center gap-3 mb-4 flex-wrap">
        <span class="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-[10px] font-mono font-semibold uppercase">
          {data.metadata.category}
        </span>
        <div class="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Calendar size={13} class="text-slate-500" />
          <span>{data.metadata.date}</span>
        </div>
        {#if data.metadata.author}
          <span class="text-slate-600 font-mono text-xs">|</span>
          <div class="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <User size={13} class="text-slate-500" />
            <span>{data.metadata.author}</span>
          </div>
        {/if}
      </div>
      <h1 class="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-sans leading-tight">
        {data.metadata.title}
      </h1>
    </div>

    {#if data.component}
      <div class="bg-[#0d1117]/85 border border-white/[0.08] rounded-xl p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <data.component />
      </div>
    {/if}
  </article>
</main>
