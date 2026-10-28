<script lang="ts">
  import { ArrowLeft, Code, CheckCircle2, Terminal, Shield, Cpu, Activity, ExternalLink, ArrowRight } from "lucide-svelte";
  
  let { data } = $props();
  let agent = $derived(data.agent);
  let Icon = $derived(agent.icon);

  const organSchema = $derived({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": agent.name,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "macOS Apple Silicon (ARM64)",
    "description": agent.longDescription,
    "url": `https://autonomic-ai.dev/agents/${agent.id}`,
    "softwareVersion": agent.version,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
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
        "name": "Platform",
        "item": "https://autonomic-ai.dev/#platform"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": agent.name,
        "item": `https://autonomic-ai.dev/agents/${agent.id}`
      }
    ]
  });
</script>

<svelte:head>
  <title>{agent.name} — Autonomic AI Organ</title>
  <meta name="description" content={agent.longDescription || agent.description} />
  <link rel="canonical" href={`https://autonomic-ai.dev/agents/${agent.id}`} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={`${agent.name} — Autonomic AI Organ`} />
  <meta property="og:description" content={agent.description} />
  <meta property="og:url" content={`https://autonomic-ai.dev/agents/${agent.id}`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`${agent.name} — Autonomic AI Organ`} />
  <meta name="twitter:description" content={agent.description} />
  {@html `<script type="application/ld+json">${JSON.stringify(organSchema)}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`}
</svelte:head>

<main class="pt-8 pb-24 px-6 max-w-6xl mx-auto min-h-screen">
  
  <!-- Breadcrumb Navigation -->
  <div class="mb-8 flex items-center justify-between border-b border-white/[0.08] pb-4">
    <a href="/#platform" class="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors">
      <ArrowLeft size={14} />
      <span>← Back to Platform</span>
    </a>

    <div class="flex items-center gap-2 text-[10px] font-mono">
      <span class="relative flex h-1.5 w-1.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
      </span>
      <span class="text-emerald-400 font-semibold uppercase">NODE ACTIVE</span>
      <span class="text-neutral-600">|</span>
      <span class="text-neutral-400">LATENCY: {agent.latency}</span>
    </div>
  </div>

  <!-- Organ Header Avionics Banner -->
  <div class="bg-neutral-950 border border-white/10 rounded-xl p-6 md:p-8 mb-8 shadow-2xl relative overflow-hidden">
    <div class="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
      <div class="flex items-center gap-5">
        <div class="w-16 h-16 rounded-xl bg-neutral-900 border border-white/15 flex items-center justify-center shrink-0">
          <Icon size={32} class="text-white" />
        </div>
        
        <div>
          <div class="flex items-center gap-2.5 flex-wrap mb-1.5">
            <h1 class="text-2xl md:text-3xl font-extrabold text-white font-mono tracking-tight">{agent.name}</h1>
            <span class="px-2 py-0.5 rounded bg-white/[0.04] text-neutral-300 border border-white/10 text-[10px] font-mono font-medium uppercase">
              {agent.role}
            </span>
            <span class="px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-white/10 text-[10px] font-mono">
              {agent.version}
            </span>
          </div>
          <p class="text-sm text-neutral-400 font-sans max-w-2xl">{agent.description}</p>
        </div>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <a 
          href={agent.githubLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          class="px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition-all flex items-center gap-2 justify-center w-full md:w-auto"
        >
          <Code size={14} />
          <span>Source Code</span>
          <ExternalLink size={12} class="text-neutral-600" />
        </a>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
    
    <!-- Left Column: Architecture & Role (2 Cols) -->
    <div class="md:col-span-2 space-y-6">
      <div class="bg-neutral-950 border border-white/10 rounded-xl p-6 md:p-8 shadow-xl">
        <div class="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-2">// Architecture & Role</div>
        <h2 class="text-xl font-bold text-white mb-4 font-mono">Subsystem Specification</h2>
        
        <p class="text-sm text-neutral-400 mb-8 leading-relaxed font-sans">
          {agent.longDescription}
        </p>

        <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-4">// Verified Capabilities</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {#each agent.features as feature}
            <div class="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/60 border border-white/10 text-xs font-mono">
              <CheckCircle2 class="text-emerald-400 shrink-0" size={16} />
              <span class="text-neutral-200">{feature}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Quick CLI Reference Banner -->
      <div class="bg-neutral-950 border border-white/10 rounded-xl p-5 font-mono text-xs shadow-xl">
        <div class="flex items-center justify-between mb-3 text-neutral-400 text-[11px]">
          <span class="flex items-center gap-2">
            <Terminal size={14} class="text-white" />
            <span>CLI INVOCATION</span>
          </span>
          <a href={`/docs/cli/${agent.id === 'agent-body' ? 'autonomic' : agent.id}`} class="text-neutral-300 hover:text-white transition-colors flex items-center gap-1 font-semibold">
            <span>Flag-Level Docs</span>
            <ArrowRight size={12} />
          </a>
        </div>
        <div class="p-3 rounded-lg bg-black border border-white/10 text-neutral-200 flex items-center gap-2 overflow-x-auto">
          <span class="text-neutral-500 font-bold select-none">&gt;_</span>
          <code>{agent.id === 'agent-body' ? 'autonomic status' : `${agent.id} --help`}</code>
        </div>
      </div>
    </div>

    <!-- Right Column: Subsystem Metrics & Specs -->
    <div class="space-y-6">
      
      <div class="bg-neutral-950 border border-white/10 rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div class="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-4">// Telemetry Profile</div>
        
        <div class="space-y-4 font-mono text-xs">
          <div class="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span class="text-neutral-400">IPC Protocol</span>
            <span class="text-neutral-200 font-semibold">{agent.protocol}</span>
          </div>

          <div class="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span class="text-neutral-400">Response Latency</span>
            <span class="text-emerald-400 font-semibold">{agent.latency}</span>
          </div>

          <div class="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span class="text-neutral-400">Process Model</span>
            <span class="text-neutral-300">Isolated Daemon</span>
          </div>

          <div class="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span class="text-neutral-400">Runtime Target</span>
            <span class="text-neutral-300">Rust (Metal / CUDA)</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-neutral-400">Release Version</span>
            <span class="text-neutral-300">{agent.version}</span>
          </div>
        </div>
      </div>

      <!-- Quick Docs Action Card -->
      <a 
        href="/docs/architecture" 
        class="block p-5 rounded-xl bg-neutral-950 border border-white/10 hover:border-white/30 transition-all group"
      >
        <div class="text-xs font-mono font-semibold text-white mb-1 flex items-center gap-1.5">
          <Activity size={14} />
          <span>Ecosystem Blueprint</span>
        </div>
        <p class="text-xs text-neutral-400 mb-3 font-sans">Learn how {agent.name} fits with the other Autonomic AI component.</p>
        <div class="text-xs font-mono font-bold text-neutral-300 group-hover:text-white flex items-center gap-1">
          <span>Read Architecture Spec</span>
          <ArrowRight size={12} class="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </a>
    </div>

  </div>
</main>
