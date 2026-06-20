<script lang="ts">
  import { Brain, Heart, Activity, GitBranch, ShieldAlert, Cpu, Layers } from "lucide-svelte";

  const agents = [
    {
      name: "Agent Brain",
      icon: Brain,
      color: "from-indigo-500 to-purple-500",
      description: "The core intelligence. Handles reasoning, planning, memory, and orchestration of the entire ecosystem.",
      link: "https://github.com/autonomic-ai-dev/agent-brain",
      span: "md:col-span-2 md:row-span-2"
    },
    {
      name: "Agent Nerves",
      icon: GitBranch,
      color: "from-emerald-500 to-teal-500",
      description: "Fast reflex and routing. Connects signals across agents with low latency.",
      link: "https://github.com/autonomic-ai-dev/agent-nerves",
      span: "col-span-1"
    },
    {
      name: "Agent Heart",
      icon: Heart,
      color: "from-rose-500 to-pink-500",
      description: "System vitality. Monitors agent health, heartbeats, and self-healing.",
      link: "https://github.com/autonomic-ai-dev/agent-heart",
      span: "col-span-1"
    },
    {
      name: "Agent Muscle",
      icon: Activity,
      color: "from-orange-500 to-amber-500",
      description: "Heavy lifting. Executes massive parallel tasks, builds, and intensive compute.",
      link: "https://github.com/autonomic-ai-dev/agent-muscle",
      span: "col-span-1"
    },
    {
      name: "Agent Immune",
      icon: ShieldAlert,
      color: "from-blue-500 to-cyan-500",
      description: "Security and defense. Analyzes threats and enforces safety protocols.",
      link: "https://github.com/autonomic-ai-dev/agent-immune",
      span: "col-span-1"
    },
    {
      name: "Agent Spine",
      icon: Layers,
      color: "from-slate-500 to-slate-400",
      description: "Structural integrity. Manages base protocols and physical infrastructure.",
      link: "https://github.com/autonomic-ai-dev/agent-spine",
      span: "col-span-1"
    },
    {
      name: "Agent Eyes",
      icon: Cpu,
      color: "from-yellow-400 to-orange-400",
      description: "Perception and vision. Analyzes visual data and UI elements.",
      link: "https://github.com/autonomic-ai-dev/agent-eyes",
      span: "col-span-1"
    }
  ];
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

  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">
    {#each agents as agent}
      <a 
        href={agent.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        class="glass-card p-8 flex flex-col justify-between group relative overflow-hidden {agent.span}"
      >
        <!-- Background Gradient Hover -->
        <div class="absolute inset-0 bg-gradient-to-br {agent.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
        
        <div>
          <div class="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
            {@const Icon = agent.icon}
            <Icon class="text-white" size={24} />
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">{agent.name}</h3>
          <p class="text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-3 md:line-clamp-none">{agent.description}</p>
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
      class="glass-card p-8 flex flex-col justify-between group relative overflow-hidden md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border-brand-500/30"
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
