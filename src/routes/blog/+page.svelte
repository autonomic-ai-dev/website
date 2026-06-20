<script lang="ts">
  import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-svelte";
  
  // Placeholder blog posts
  const allPosts = [
    {
      title: "Autonomic AI Dev 2.0: The Next Generation",
      excerpt: "Announcing major upgrades to our neural architecture, including advanced multi-agent orchestration and dynamic code synthesis.",
      date: "Aug 15, 2026",
      slug: "autonomic-ai-dev-2-0",
      category: "Announcement"
    },
    {
      title: "Agent Nerves: The Routing Engine",
      excerpt: "How we built a blazingly fast message bus that allows our agents to communicate seamlessly in real-time.",
      date: "Jul 28, 2026",
      slug: "agent-nerves-routing-engine",
      category: "Engineering"
    },
    {
      title: "Securing Autonomous Agents with Agent Immune",
      excerpt: "A look at the proactive security measures and static analysis pipelines integrated directly into our AI workflow.",
      date: "Jul 10, 2026",
      slug: "securing-agents-with-immune",
      category: "Security"
    },
    {
      title: "The Vision for Self-Healing Codebases",
      excerpt: "Exploring a future where repositories automatically detect bugs, write patches, and deploy fixes without human intervention.",
      date: "Jun 30, 2026",
      slug: "vision-self-healing-codebases",
      category: "Vision"
    },
    {
      title: "Introducing the Autonomic AI Ecosystem",
      excerpt: "A deep dive into how we built a self-healing, multi-agent architecture using modern AI and web technologies.",
      date: "Jun 20, 2026",
      slug: "introducing-autonomic-ecosystem",
      category: "Engineering"
    },
    {
      title: "How Agent Muscle handles Massive Concurrency",
      excerpt: "Exploring the containerized execution environment that allows Agent Muscle to run dozens of builds in parallel.",
      date: "Jun 15, 2026",
      slug: "agent-muscle-concurrency",
      category: "Deep Dive"
    },
    {
      title: "Building the Mission Control Dashboard",
      excerpt: "Behind the scenes of our real-time, WebSocket-powered CI/CD monitoring interface.",
      date: "Jun 01, 2026",
      slug: "building-mission-control",
      category: "Engineering"
    }
  ];

  let currentPage = $state(1);
  const postsPerPage = 4;
  
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
    <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">Engineering Blog</h1>
    <p class="text-xl text-slate-600 dark:text-slate-400">Updates, deep dives, and announcements from the Autonomic AI team.</p>
  </div>

  <div class="grid grid-cols-1 gap-8">
    {#each paginatedPosts as post}
      <a href={`/blog/${post.slug}`} class="glass-card p-8 group flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400">{post.category}</span>
            <div class="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <Calendar size={14} />
              {post.date}
            </div>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-500 transition-colors">{post.title}</h2>
          <p class="text-slate-600 dark:text-slate-400 line-clamp-2">{post.excerpt}</p>
        </div>
        
        <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-brand-500 group-hover:text-white transition-all">
          <ArrowRight size={20} class="group-hover:translate-x-1 transition-transform" />
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
