<script lang="ts">
  import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-svelte";
  let { data } = $props();

  let currentPage = $state(1);
  const postsPerPage = 4;
  
  let allPosts = $derived(data.posts);
  let totalPages = $derived(Math.ceil(allPosts.length / postsPerPage));
  let paginatedPosts = $derived(allPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage));

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<svelte:head>
  <title>Blog - Autonomic AI Dev</title>
  <meta name="description" content="Read the latest updates, engineering deep dives, and announcements from the Autonomic AI team." />
</svelte:head>

<main class="pt-32 pb-24 px-6 max-w-5xl mx-auto min-h-screen">
  <div class="mb-16">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
      <span>AUTONOMIC DISPATCHES</span>
    </div>
    <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Engineering Blog</h1>
    <p class="text-lg text-slate-400">Deep dives into self-healing architectures, deterministic DAGs, AST security, and multi-agent coordination.</p>
  </div>

  <div class="grid grid-cols-1 gap-6">
    {#each paginatedPosts as post}
      <a href={`/blog/${post.slug}`} class="bg-[#0d1117] border border-white/10 hover:border-cyan-500/40 rounded-2xl p-7 group flex flex-col md:flex-row gap-6 items-start md:items-center justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-0.5">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{post.category}</span>
            <div class="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Calendar size={13} />
              {post.date}
            </div>
            {#if post.author}
              <span class="text-xs text-slate-500 font-mono">•</span>
              <span class="text-xs text-slate-400 font-mono">{post.author}</span>
            {/if}
          </div>
          <h2 class="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{post.title}</h2>
          <p class="text-slate-300 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
        </div>
        
        <div class="w-11 h-11 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all shrink-0">
          <ArrowRight size={18} class="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </a>
    {/each}
  </div>

  <!-- Pagination Controls -->
  {#if totalPages > 1}
    <div class="mt-16 flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-8">
      <button 
        onclick={prevPage}
        disabled={currentPage === 1}
        class="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
      >
        <ChevronLeft size={18} />
        Previous
      </button>
      
      <span class="text-sm font-medium text-slate-500 dark:text-slate-400">
        Page {currentPage} of {totalPages}
      </span>
      
      <button 
        onclick={nextPage}
        disabled={currentPage === totalPages}
        class="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  {/if}
</main>
