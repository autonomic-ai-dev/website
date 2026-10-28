<script lang="ts">
  import { ArrowLeft, Calendar, User } from "lucide-svelte";
  let { data } = $props();

  const articleSchema = $derived({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": data.metadata.title,
    "description": data.metadata.excerpt,
    "datePublished": data.metadata.date,
    "dateModified": data.metadata.date,
    "mainEntityOfPage": `https://autonomic-ai.dev/blog/${data.metadata.slug}`,
    "author": {
      "@type": "Person",
      "name": data.metadata.author || "Autonomic AI Team"
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
        "name": "Dispatches",
        "item": "https://autonomic-ai.dev/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": data.metadata.title,
        "item": `https://autonomic-ai.dev/blog/${data.metadata.slug}`
      }
    ]
  });
</script>

<svelte:head>
  <title>{data.metadata.title} — Autonomic AI Dispatches</title>
  <meta name="description" content={data.metadata.excerpt} />
  <link rel="canonical" href={`https://autonomic-ai.dev/blog/${data.metadata.slug}`} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={`${data.metadata.title} — Autonomic AI Dispatches`} />
  <meta property="og:description" content={data.metadata.excerpt} />
  <meta property="og:url" content={`https://autonomic-ai.dev/blog/${data.metadata.slug}`} />
  <meta property="article:published_time" content={data.metadata.date} />
  <meta property="article:section" content={data.metadata.category} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`${data.metadata.title} — Autonomic AI Dispatches`} />
  <meta name="twitter:description" content={data.metadata.excerpt} />
  {@html `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`}
</svelte:head>

<main class="pt-8 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
  
  <a href="/blog" class="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white mb-8 transition-colors">
    <ArrowLeft size={14} />
    <span>← Back to Dispatches</span>
  </a>

  <article class="prose max-w-none">
    <div class="not-prose mb-10 pb-6 border-b border-white/[0.08]">
      <div class="flex items-center gap-3 mb-4 flex-wrap">
        <span class="px-2.5 py-0.5 rounded bg-white/[0.04] text-neutral-300 border border-white/10 text-[10px] font-mono font-medium uppercase">
          {data.metadata.category}
        </span>
        <div class="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
          <Calendar size={13} class="text-neutral-500" />
          <span>{data.metadata.date}</span>
        </div>
        {#if data.metadata.author}
          <span class="text-neutral-600 font-mono text-xs">|</span>
          <div class="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
            <User size={13} class="text-neutral-500" />
            <span>{data.metadata.author}</span>
          </div>
        {/if}
      </div>
      <h1 class="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-sans leading-tight">
        {data.metadata.title}
      </h1>
    </div>

    {#if data.component}
      <div class="bg-neutral-950 border border-white/10 rounded-xl p-8 md:p-10 shadow-2xl">
        <data.component />
      </div>
    {/if}
  </article>
</main>
