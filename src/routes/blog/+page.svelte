<script lang="ts">
  import { ArrowRight, Calendar, ChevronLeft, ChevronRight, User } from "lucide-svelte";
  let { data } = $props();

  let currentPage = $state(1);
  const postsPerPage = 6;
  
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
  <title>Engineering Dispatches - Autonomic AI Dev</title>
  <meta name="description" content="Technical dispatches, architecture breakdowns, and release postmortems from the Autonomic AI engineering team." />
</svelte:head>

<main class="pt-8 pb-24 px-6 max-w-5xl mx-auto min-h-screen">
  
  <!-- Header Strip -->
  <div class="mb-12 border-b border-white/[0.08] pb-8">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-neutral-300 text-xs font-mono mb-4">
      <span>// TECHNICAL DISPATCHES</span>
    </div>
    <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight font-sans">Engineering Dispatches</h1>
    <p class="text-sm md:text-base text-neutral-400 max-w-2xl font-sans">In-depth technical architecture breakdowns, AST safety invariants, deterministic DAG execution, and cognitive governor postmortems.</p>
  </div>

  <!-- Articles List -->
  <div class="grid grid-cols-1 gap-4">
    {#each paginatedPosts as post}
      <a 
        href={`/blog/${post.slug}`} 
        class="bg-neutral-950 border border-white/10 hover:border-white/25 hover:bg-neutral-900/40 rounded-xl p-6 group flex flex-col md:flex-row gap-5 items-start md:items-center justify-between transition-all duration-200"
      >
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2.5 flex-wrap">
            <span class="px-2 py-0.5 rounded bg-white/[0.04] text-neutral-300 border border-white/10 text-[10px] font-mono font-medium uppercase">
              {post.category}
            </span>
            <div class="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
              <Calendar size={13} class="text-neutral-500" />
              <span>{post.date}</span>
            </div>
            {#if post.author}
              <span class="text-neutral-600 font-mono text-xs">|</span>
              <div class="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                <User size={13} class="text-neutral-500" />
                <span>{post.author}</span>
              </div>
            {/if}
          </div>
          <h2 class="text-lg md:text-xl font-bold text-white mb-1.5 group-hover:text-neutral-200 transition-colors font-sans">{post.title}</h2>
          <p class="text-neutral-400 text-xs leading-relaxed line-clamp-2 font-sans">{post.excerpt}</p>
        </div>
        
        <div class="w-10 h-10 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:bg-white group-hover:text-black transition-all shrink-0">
          <ArrowRight size={16} class="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </a>
    {/each}
  </div>

  <!-- Pagination Controls -->
  {#if totalPages > 1}
    <div class="mt-12 flex items-center justify-between border-t border-white/[0.08] pt-6 font-mono text-xs">
      <button 
        onclick={prevPage}
        disabled={currentPage === 1}
        class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-neutral-950 text-neutral-300 hover:text-white border border-white/10 hover:border-white/20"
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>
      
      <span class="text-neutral-400">
        Page {currentPage} of {totalPages}
      </span>
      
      <button 
        onclick={nextPage}
        disabled={currentPage === totalPages}
        class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-neutral-950 text-neutral-300 hover:text-white border border-white/10 hover:border-white/20"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  {/if}
</main>
