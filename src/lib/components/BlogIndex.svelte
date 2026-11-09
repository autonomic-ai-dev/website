<script lang="ts">
  import { ArrowRight, Calendar, ChevronLeft, ChevronRight, User } from "lucide-svelte";
  import type { Product } from "#lib/data/products";
  let { data, product }: { data: any; product: Product } = $props();

  let currentPage = $state(1);
  const postsPerPage = 6;

  let allPosts = $derived(data.posts);
  let totalPages = $derived(Math.ceil(allPosts.length / postsPerPage));
  let paginatedPosts = $derived(allPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage));

  function goTo(page: number) {
    currentPage = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const breadcrumbSchema = $derived({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": product.name, "item": product.origin },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${product.origin}/blog` }
    ]
  });
</script>

<svelte:head>
  <title>Blog — {product.name}</title>
  <meta name="description" content={`Posts about ${product.name}: design decisions, trade-offs and how it is measured.`} />
  <link rel="canonical" href={`${product.origin}/blog`} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={`Blog — ${product.name}`} />
  <meta property="og:url" content={`${product.origin}/blog`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`Blog — ${product.name}`} />
  {@html `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`}
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6">
  <p class="font-mono text-xs uppercase tracking-widest text-zinc-500">Blog</p>
  <h1 class="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{product.name}</h1>
  <p class="mt-4 max-w-2xl text-zinc-400">Design decisions, trade-offs and what we measure, written by the people who build {product.name}.</p>

  <ul class="mt-12 divide-y divide-zinc-900 border-y border-zinc-900">
    {#each paginatedPosts as post (post.slug)}
      <li>
        <a href={`/blog/${post.slug}`} class="group flex items-start justify-between gap-6 py-6">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-500">
              <span class="rounded border border-zinc-800 px-2 py-0.5 uppercase text-zinc-300">{post.category}</span>
              <span class="flex items-center gap-1.5"><Calendar size={12} />{post.date}</span>
              {#if post.author}
                <span class="flex items-center gap-1.5"><User size={12} />{post.author}</span>
              {/if}
            </div>
            <h2 class="mt-3 text-xl font-semibold text-white group-hover:text-zinc-300">{post.title}</h2>
            <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">{post.excerpt}</p>
          </div>
          <ArrowRight size={16} class="mt-2 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
        </a>
      </li>
    {/each}
  </ul>

  {#if totalPages > 1}
    <div class="mt-10 flex items-center justify-between text-sm">
      <button
        onclick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        class="flex items-center gap-2 rounded-md border border-zinc-800 px-3 py-2 text-zinc-300 hover:text-white disabled:opacity-40"
      >
        <ChevronLeft size={16} /> Previous
      </button>
      <span class="text-zinc-500">Page {currentPage} of {totalPages}</span>
      <button
        onclick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        class="flex items-center gap-2 rounded-md border border-zinc-800 px-3 py-2 text-zinc-300 hover:text-white disabled:opacity-40"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  {/if}
</div>
