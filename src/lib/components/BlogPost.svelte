<script lang="ts">
  import { onMount } from "svelte";
  import { ChevronLeft, Calendar, Clock, Share2, Check, Terminal, ArrowRight } from "lucide-svelte";
  import { page } from "$app/state";
  import { renderMermaidBlocks } from "#lib/diagrams";
  import type { Product } from "#lib/data/products";

  let { data, product }: { data: any; product: Product } = $props();

  let articleRef: HTMLElement | undefined = $state();
  let copiedLink = $state(false);

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      copiedLink = true;
      setTimeout(() => (copiedLink = false), 2000);
    }
  }

  onMount(() => {
    if (articleRef) {
      renderMermaidBlocks(articleRef);
    }
  });

  $effect(() => {
    if (articleRef && data) {
      renderMermaidBlocks(articleRef);
    }
  });

  const prefix = $derived(page.url.pathname.startsWith(`/${product.id}`) ? `/${product.id}` : '');
  const authorName = $derived(data.metadata.author || "Abhiuday");

  const articleSchema = $derived({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": data.metadata.title,
    "description": data.metadata.excerpt,
    "datePublished": data.metadata.date,
    "dateModified": data.metadata.date,
    "mainEntityOfPage": `${product.origin}/blog/${data.metadata.slug}`,
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "Autonomic AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://autonomic-ai.dev/logo.png"
      }
    }
  });

  const breadcrumbSchema = $derived({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://autonomic-ai.dev"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${product.origin}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": data.metadata.title,
        "item": `${product.origin}/blog/${data.metadata.slug}`
      }
    ]
  });
</script>

<svelte:head>
  <title>{data.metadata.title} — {product.name}</title>
  <meta name="description" content={data.metadata.excerpt} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={`${data.metadata.title} — {product.name}`} />
  <meta property="og:description" content={data.metadata.excerpt} />
  <meta property="og:url" content={`${product.origin}/blog/${data.metadata.slug}`} />
  <meta property="article:published_time" content={data.metadata.date} />
  <meta property="article:section" content={data.metadata.category} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`${data.metadata.title} — {product.name}`} />
  <meta name="twitter:description" content={data.metadata.excerpt} />
  {@html `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`}
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6">
  <!-- Top Action Bar (Anode Parity: Back & Share) -->
  <div class="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-8">
    <a
      href="{prefix}/blog"
      class="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-white transition-colors py-1.5 px-3 rounded-lg bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08]"
    >
      <ChevronLeft size={14} />
      <span>Back to Journal</span>
    </a>

    <button
      type="button"
      onclick={handleShare}
      class="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08]"
    >
      {#if copiedLink}
        <Check size={13} class="text-[#5fd39a]" />
        <span class="text-[#5fd39a]">Copied Link!</span>
      {:else}
        <Share2 size={13} />
        <span>Share Essay</span>
      {/if}
    </button>
  </div>

  <article bind:this={articleRef} class="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white prose-h2:text-2xl prose-h3:text-lg prose-p:leading-relaxed">
    <!-- Article Header (Anode Technical Journal Style) -->
    <div class="not-prose mb-10 pb-8 border-b border-white/[0.08] space-y-5">
      <div class="flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-mono">
        <span class="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-white border border-white/[0.1] font-semibold text-[11px] uppercase">
          {data.metadata.category}
        </span>
        <span class="text-neutral-600">•</span>
        <span class="flex items-center gap-1.5">
          <Calendar size={13} class="text-neutral-500" />
          <span>{data.metadata.date}</span>
        </span>
        <span class="text-neutral-600">•</span>
        <span class="flex items-center gap-1.5">
          <Clock size={13} class="text-neutral-500" />
          <span>{data.metadata.readTime || '4 min read'}</span>
        </span>
      </div>

      <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
        {data.metadata.title}
      </h1>

      {#if data.metadata.excerpt}
        <p class="text-base sm:text-lg text-neutral-400 leading-relaxed font-normal">
          {data.metadata.excerpt}
        </p>
      {/if}

      <!-- Author Card (Anode Parity) -->
      <div class="flex items-center gap-3 pt-3">
        <div class="w-9 h-9 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white font-bold text-xs font-mono">
          {authorName[0]}
        </div>
        <div>
          <div class="text-sm font-semibold text-white">{authorName}</div>
          <div class="text-xs text-neutral-500 font-mono">Core Architect · Autonomic AI</div>
        </div>
      </div>
    </div>

    {#if data.component}
      <div class="bg-neutral-950/70 border border-white/[0.08] rounded-2xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        <data.component />
      </div>
    {/if}
  </article>

  <!-- Bottom Action CTA Card (Anode Parity) -->
  <div class="p-8 rounded-2xl bg-[#090a0d] border border-white/[0.1] mt-12 space-y-4 shadow-xl">
    <h3 class="text-lg font-bold text-white flex items-center gap-2">
      <Terminal size={18} class="text-[#5fd39a]" />
      <span>Deploy {product.name} On Your Codebase</span>
    </h3>
    <p class="text-xs sm:text-sm text-neutral-400 leading-relaxed">
      {product.subline}
    </p>
    <div class="flex flex-wrap items-center gap-3 pt-1">
      <a
        href="{prefix}/docs"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 !text-black font-semibold text-xs font-mono transition-colors shadow-sm"
      >
        <span class="!text-black text-black font-semibold">Read Documentation</span>
        <ArrowRight size={13} class="!text-black text-black" />
      </a>
      <a
        href={product?.repoUrl || (product ? `https://github.com/autonomic-ai-dev/${product.id}` : "https://github.com/autonomic-ai-dev")}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-white transition-colors"
      >
        <span>View on GitHub</span>
      </a>
    </div>
  </div>
</div>
