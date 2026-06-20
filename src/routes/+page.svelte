<script lang="ts">
  import { Brain, Heart, Activity, GitBranch, ShieldAlert, Cpu, Layers } from "lucide-svelte";
  import { agents } from "$lib/data/agents";
</script>

<!-- Hero Section -->
<section class="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
  <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-500/30 text-sm font-medium text-brand-300 mb-8 animate-float">
    <span class="relative flex h-2 w-2">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
    </span>
    Ecosystem Online & Active
  </div>
  
  <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
    Autonomous systems that <br/>
    <span class="text-gradient">build, heal, and evolve.</span>
  </h1>
  
  <p class="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
    Autonomic AI Dev is a self-governing ecosystem of specialized AI agents working together to orchestrate massive scale software engineering.
  </p>
  
  <div class="flex flex-col sm:flex-row items-center gap-4">
    <a href="#ecosystem" class="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5">
      Explore the Ecosystem
    </a>
    <a href="https://github.com/autonomic-ai-dev" target="_blank" rel="noopener noreferrer" class="px-8 py-4 rounded-full font-bold text-white glass hover:bg-white/10 transition-all border border-white/10 hover:-translate-y-0.5 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      GitHub
    </a>
  </div>
</section>

<!-- Ecosystem Bento Grid -->
<section id="ecosystem" class="py-24 px-6 max-w-7xl mx-auto">
  <div class="mb-16">
    <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">The Neural Architecture</h2>
    <p class="text-slate-400 max-w-2xl">Modeled after biological systems, each agent operates independently yet forms a cohesive, autonomic organism capable of self-healing and complex reasoning.</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
    {#each agents as agent}
      {@const Icon = agent.icon}
      <a 
        href={`/agents/${agent.id}`} 
        class="glass-card p-8 flex flex-col justify-between group relative overflow-hidden h-full {agent.span} animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
        style="animation-delay: {50 * agent.id.length}ms;"
      >
        <!-- Background Gradient Hover -->
        <div class="absolute inset-0 bg-gradient-to-br {agent.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
        
        <div>
          <div class="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
            <Icon class="text-white" size={24} />
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">{agent.name}</h3>
          <p class="text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">{agent.description}</p>
        </div>
        
        <div class="absolute top-8 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 -translate-x-2 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </a>
    {/each}

    <!-- Dashboard CTA Card -->
    <a 
      href="https://agent-ci-dashboard.vercel.app" 
      target="_blank" 
      rel="noopener noreferrer" 
      class="glass-card p-8 flex flex-col justify-between group relative overflow-hidden h-full md:col-span-2 bg-gradient-to-br from-[#0B0F19] to-slate-900 border-brand-500/30 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-300"
    >
      <div class="absolute right-0 top-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl group-hover:bg-brand-500/30 transition-colors"></div>
      <div>
        <h3 class="text-2xl font-bold text-white mb-2 text-gradient">Mission Control</h3>
        <p class="text-slate-300">Real-time CI/CD dashboard. Monitor heartbeats, deployments, and raw logs across the entire ecosystem.</p>
      </div>
      <div class="mt-8 inline-flex items-center gap-2 font-bold text-brand-400 group-hover:text-brand-300">
        Launch Dashboard
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </div>
    </a>
  </div>
</section>

<!-- Features Section -->
<section id="features" class="py-24 px-6 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
  <div class="mb-16 text-center">
    <h2 class="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Built for Autonomy</h2>
    <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">Our agents aren't just scripts. They are continuously running, self-aware services designed for resilience.</p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <!-- Feature 1 -->
    <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
        <Heart size={28} />
      </div>
      <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">Self-Healing Infrastructure</h3>
      <p class="text-slate-600 dark:text-slate-400">Agents monitor each other through heartbeat signals. If an agent goes down, the ecosystem automatically detects the failure and attempts recovery.</p>
    </div>
    <!-- Feature 2 -->
    <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
        <Activity size={28} />
      </div>
      <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">Real-Time Telemetry</h3>
      <p class="text-slate-600 dark:text-slate-400">Stream logs, pipeline states, and system vitals directly to the PWA-enabled Mission Control dashboard via secure WebSockets.</p>
    </div>
    <!-- Feature 3 -->
    <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-6">
        <GitBranch size={28} />
      </div>
      <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">Massive Concurrency</h3>
      <p class="text-slate-600 dark:text-slate-400">Agent Muscle is capable of running dozens of parallel builds, tests, and deployments without bottlenecking the reasoning agents.</p>
    </div>
    <!-- Feature 4 -->
    <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
        <ShieldAlert size={28} />
      </div>
      <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">Secure by Default</h3>
      <p class="text-slate-600 dark:text-slate-400">Strict isolation. Agent Immune analyzes all external inputs and PRs for vulnerabilities before they reach the main nervous system.</p>
    </div>
  </div>
</section>

<!-- Architecture Flow Section -->
<section id="architecture" class="py-24 px-6 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
  <div class="mb-16 text-center">
    <h2 class="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">How It Works</h2>
    <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">A continuous loop of perception, cognition, and execution.</p>
  </div>

  <div class="flex flex-col md:flex-row items-center justify-between relative gap-8 md:gap-4">
    <!-- Connecting Line for Desktop -->
    <div class="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0"></div>

    <!-- Step 1 -->
    <div class="relative z-10 flex flex-col items-center text-center w-full md:w-1/4">
      <div class="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 border-4 border-slate-50 dark:border-[#0B0F19] shadow-xl flex items-center justify-center mb-6 text-yellow-500">
        <Cpu size={32} />
      </div>
      <h4 class="text-xl font-bold text-slate-900 dark:text-white mb-2">1. Perception</h4>
      <p class="text-sm text-slate-600 dark:text-slate-400">Agent Eyes intercepts GitHub Webhooks and visual state.</p>
    </div>

    <!-- Step 2 -->
    <div class="relative z-10 flex flex-col items-center text-center w-full md:w-1/4">
      <div class="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 border-4 border-slate-50 dark:border-[#0B0F19] shadow-xl flex items-center justify-center mb-6 text-indigo-500">
        <Brain size={32} />
      </div>
      <h4 class="text-xl font-bold text-slate-900 dark:text-white mb-2">2. Cognition</h4>
      <p class="text-sm text-slate-600 dark:text-slate-400">Agent Brain forms an execution plan based on the new data.</p>
    </div>

    <!-- Step 3 -->
    <div class="relative z-10 flex flex-col items-center text-center w-full md:w-1/4">
      <div class="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 border-4 border-slate-50 dark:border-[#0B0F19] shadow-xl flex items-center justify-center mb-6 text-teal-500">
        <GitBranch size={32} />
      </div>
      <h4 class="text-xl font-bold text-slate-900 dark:text-white mb-2">3. Routing</h4>
      <p class="text-sm text-slate-600 dark:text-slate-400">Agent Nerves routes the tasks rapidly to the correct worker nodes.</p>
    </div>

    <!-- Step 4 -->
    <div class="relative z-10 flex flex-col items-center text-center w-full md:w-1/4">
      <div class="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 border-4 border-slate-50 dark:border-[#0B0F19] shadow-xl flex items-center justify-center mb-6 text-orange-500">
        <Activity size={32} />
      </div>
      <h4 class="text-xl font-bold text-slate-900 dark:text-white mb-2">4. Execution</h4>
      <p class="text-sm text-slate-600 dark:text-slate-400">Agent Muscle performs the heavy lifting and build tasks.</p>
    </div>
  </div>
</section>

<!-- Bottom CTA -->
<section class="py-32 px-6 relative overflow-hidden">
  <div class="absolute inset-0 bg-brand-600/5 dark:bg-brand-600/10"></div>
  <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-brand-500/20 blur-[100px] rounded-full pointer-events-none"></div>
  
  <div class="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
    <h2 class="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">Ready to launch?</h2>
    <p class="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl">
      The Autonomic Ecosystem is open source. Fork the agents, set up your Mission Control, and let the AI build your software.
    </p>
    
    <a href="https://agent-ci-dashboard.vercel.app" target="_blank" rel="noopener noreferrer" class="px-10 py-5 rounded-full font-bold text-lg text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:scale-105 transition-transform shadow-xl flex items-center gap-3 group">
      Deploy Mission Control
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
    </a>
  </div>
</section>
