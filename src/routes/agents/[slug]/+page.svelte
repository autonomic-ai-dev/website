<script lang="ts">
  import { ArrowLeft, Code, CheckCircle2 } from "lucide-svelte";
  
  let { data } = $props();
  let agent = $derived(data.agent);
  let Icon = $derived(agent.icon);
</script>

<svelte:head>
  <title>{agent.name} - Autonomic AI Dev</title>
  <meta name="description" content={agent.description} />
</svelte:head>

<main class="pt-32 pb-24 px-6 max-w-5xl mx-auto">
  <a href="/#ecosystem" class="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-12 transition-colors">
    <ArrowLeft size={20} />
    Back to Ecosystem
  </a>

  <div class="flex flex-col md:flex-row gap-12 items-start">
    <!-- Icon & Title Side -->
    <div class="w-full md:w-1/3 flex flex-col items-start gap-6">
      <div class="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-900 border-4 border-white dark:border-[#0B0F19] shadow-xl flex items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br {agent.color} opacity-20"></div>
        <Icon size={48} class="text-slate-900 dark:text-white relative z-10" />
      </div>
      
      <div>
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">{agent.name}</h1>
        <p class="text-sm font-semibold uppercase tracking-wider text-brand-500 dark:text-brand-400 mb-2">{agent.cloudNativeRole}</p>
        <p class="text-xl text-slate-600 dark:text-slate-300 font-medium">{agent.description}</p>
      </div>
      
      <a 
        href={agent.githubLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        class="mt-4 px-6 py-3 rounded-full font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:scale-105 transition-transform shadow-lg flex items-center gap-3 w-full justify-center md:w-auto"
      >
        <Code size={20} />
        View Source
      </a>
    </div>

    <!-- Content Side -->
    <div class="w-full md:w-2/3 glass-card p-8 md:p-10">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">Architecture & Role</h2>
      
      <p class="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
        {agent.longDescription}
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-6">Core Capabilities</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {#each agent.features as feature}
          <div class="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <CheckCircle2 class="text-brand-500" size={24} />
            <span class="font-medium text-slate-700 dark:text-slate-300">{feature}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>
