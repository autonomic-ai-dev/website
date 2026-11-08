<script lang="ts">
  import { Copy, Check } from "lucide-svelte";

  type Entry = { name: string; description: string; command: string };

  const workflows: Entry[] = [
    { name: "@bugfix", description: "Reproduce → isolate → fix → verify loop", command: "agent-spine init --with @bugfix" },
    { name: "@feature", description: "Context & intent → domain model → 4-H2 contract → implement → verify → security gate → review gate", command: "agent-spine init --with @feature" },
    { name: "@gstack", description: "YC office hours → autoplan → eng review → design review → CEO review gate → QA lead", command: "agent-spine init --with @gstack" },
    { name: "@mcp-health-check", description: "agent-brain doctor, skill_search probe, and route_task routing verify", command: "agent-spine init --with @mcp-health-check" },
    { name: "@minimalist-entrepreneur", description: "Community discovery → problem validation → build minimal MVP → customer signoff gate → processize & scale", command: "agent-spine init --with @minimalist-entrepreneur" },
    { name: "@release-notes", description: "Tag diff → changelog → review gate", command: "agent-spine init --with @release-notes" },
    { name: "@stacked-pr", description: "Rebase stacked branches → resolve conflicts → verify", command: "agent-spine init --with @stacked-pr" }
  ];

  const packages: Entry[] = [
    { name: "@agstack", description: "agstack (Abhiuday Gupta Stack): engineering process, playbooks, strict verification (.verify/), immutability, and zero comment slop", command: "agent-brain package add @agstack" },
    { name: "@matt-skills", description: "Matt Pocock skills for real engineers: design, TDD, specs, review, triage", command: "agent-brain package add @matt-skills" },
    { name: "@minimalist-entrepreneur", description: "The Minimalist Entrepreneur skills (Sahil Lavingia): community, validation, processize, MVP, first customers, pricing, marketing, growth, culture", command: "agent-brain package add @minimalist-entrepreneur" },
    { name: "@gstack", description: "Garry Tan gstack: YC office hours, CEO review, eng review, design review, devex review, autoplan, QA lead", command: "agent-brain package add @gstack" },
    { name: "@nextjs", description: "Vercel React, Next.js, and React Native agent skills", command: "agent-brain package add @nextjs" },
    { name: "@claude-skills", description: "Jeff Allan curated Claude skills library", command: "agent-brain package add @claude-skills" },
    { name: "@ecc", description: "Everything Claude Code: large curated skill library", command: "agent-brain package add @ecc" },
    { name: "@rust", description: "Rust patterns, testing, and review (via ECC)", command: "agent-brain package add @rust" },
    { name: "@official", description: "Official skill repos: awesome-copilot, anthropics/skills, azure-skills", command: "agent-brain package add @official" },
    { name: "@starter", description: "Lightweight onboarding: Matt Pocock skills and Vercel React patterns", command: "agent-brain package add @starter" }
  ];

  let copied = $state<string | null>(null);

  async function copy(command: string) {
    try {
      await navigator.clipboard.writeText(command);
      copied = command;
      setTimeout(() => (copied = null), 1500);
    } catch {
      copied = null;
    }
  }
</script>

<svelte:head>
  <title>Registry · Autonomic AI</title>
</svelte:head>

<section class="max-w-5xl mx-auto px-6 pt-32 pb-24">
  <p class="font-mono text-xs uppercase tracking-wider text-neutral-500 mb-3">Registry</p>
  <h1 class="font-headline text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">Workflows and packages</h1>
  <p class="text-neutral-400 max-w-3xl mb-4">
    These are the entries in the agent-brain registry repository, with the descriptions it publishes. Install a workflow with agent-spine and a package with agent-brain. Each command is listed below its entry.
  </p>
  <p class="text-neutral-500 text-sm max-w-3xl mb-12">
    This page does not show run times, checksums, certifications or quality scores. We don't measure or publish those yet, so the page doesn't claim them.
  </p>

  <h2 class="font-mono text-xs uppercase tracking-wider text-neutral-500 mb-4">Workflows (agent-spine)</h2>
  <ul class="grid gap-3 mb-12">
    {#each workflows as item (item.name)}
      <li class="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p class="font-mono text-white font-medium">{item.name}</p>
            <p class="text-neutral-400 text-sm mt-1">{item.description}</p>
          </div>
          <button type="button" onclick={() => copy(item.command)} class="inline-flex items-center gap-2 font-mono text-xs text-neutral-300 border border-white/10 rounded-lg px-3 py-2 hover:border-white/25">
            {#if copied === item.command}<Check size={14} />{:else}<Copy size={14} />{/if}
            <span>{item.command}</span>
          </button>
        </div>
      </li>
    {/each}
  </ul>

  <h2 class="font-mono text-xs uppercase tracking-wider text-neutral-500 mb-4">Packages (agent-brain)</h2>
  <ul class="grid gap-3">
    {#each packages as item (item.name)}
      <li class="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p class="font-mono text-white font-medium">{item.name}</p>
            <p class="text-neutral-400 text-sm mt-1">{item.description}</p>
          </div>
          <button type="button" onclick={() => copy(item.command)} class="inline-flex items-center gap-2 font-mono text-xs text-neutral-300 border border-white/10 rounded-lg px-3 py-2 hover:border-white/25">
            {#if copied === item.command}<Check size={14} />{:else}<Copy size={14} />{/if}
            <span>{item.command}</span>
          </button>
        </div>
      </li>
    {/each}
  </ul>
</section>
