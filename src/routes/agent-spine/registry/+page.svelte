<script lang="ts">
	import RegistryList from '#lib/components/RegistryList.svelte';

	const workflows = [
		{ name: '@bugfix', description: 'Reproduce → isolate → fix → verify loop', command: 'agent-spine init --with @bugfix' },
		{ name: '@feature', description: 'Context & intent → domain model → 4-H2 contract → implement → verify → security gate → review gate', command: 'agent-spine init --with @feature' },
		{ name: '@gstack', description: 'YC office hours → autoplan → eng review → design review → CEO review gate → QA lead', command: 'agent-spine init --with @gstack' },
		{ name: '@mcp-health-check', description: 'agent-brain doctor, skill_search probe, and route_task routing verify', command: 'agent-spine init --with @mcp-health-check' },
		{ name: '@minimalist-entrepreneur', description: 'Community discovery → problem validation → build minimal MVP → customer signoff gate → processize & scale', command: 'agent-spine init --with @minimalist-entrepreneur' },
		{ name: '@release-notes', description: 'Tag diff → changelog → review gate', command: 'agent-spine init --with @release-notes' },
		{ name: '@stacked-pr', description: 'Rebase stacked branches → resolve conflicts → verify', command: 'agent-spine init --with @stacked-pr' }
	];
</script>

<svelte:head>
	<title>Registry — agent-spine</title>
	<meta name="description" content="Built-in agent-spine workflows you can scaffold with agent-spine init." />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6">
	<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">Registry</p>
	<h1 class="mt-4 text-4xl font-semibold tracking-tight text-white">Workflows</h1>
	<p class="mt-4 max-w-2xl text-zinc-400">Scaffold a workflow with <code class="font-mono text-zinc-200">agent-spine init --with</code>, then run it with <code class="font-mono text-zinc-200">agent-spine run</code>.</p>
	<div class="mt-12">
		<RegistryList entries={workflows} />
	</div>
</div>
