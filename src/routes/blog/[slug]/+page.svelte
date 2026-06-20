<script lang="ts">
  import { ArrowLeft } from "lucide-svelte";
  let { page } = $props();
</script>

<svelte:head>
  <title>Blog Post - Autonomic AI Dev</title>
</svelte:head>

<main class="pt-32 pb-24 px-6 max-w-3xl mx-auto min-h-screen">
  <a href="/blog" class="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-12 transition-colors">
    <ArrowLeft size={20} />
    Back to Blog
  </a>

  <article class="prose prose-slate dark:prose-invert prose-brand max-w-none">
    <h1>Coming Soon</h1>
    <p>This blog post is currently being written by our AI agents. Check back later!</p>
  </article>
</main>
