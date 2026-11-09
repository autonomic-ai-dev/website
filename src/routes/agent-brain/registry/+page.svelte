<script lang="ts">
	import RegistryList from '#lib/components/RegistryList.svelte';

	const packages = [
		{ name: '@agstack', description: 'agstack (Abhiuday Gupta Stack): engineering process, playbooks, strict verification (.verify/), immutability, and zero comment slop', command: 'agent-brain package add @agstack' },
		{ name: '@matt-skills', description: 'Matt Pocock skills for real engineers: design, TDD, specs, review, triage', command: 'agent-brain package add @matt-skills' },
		{ name: '@minimalist-entrepreneur', description: 'The Minimalist Entrepreneur skills (Sahil Lavingia): community, validation, processize, MVP, first customers, pricing, marketing, growth, culture', command: 'agent-brain package add @minimalist-entrepreneur' },
		{ name: '@gstack', description: 'Garry Tan gstack: YC office hours, CEO review, eng review, design review, devex review, autoplan, QA lead', command: 'agent-brain package add @gstack' },
		{ name: '@nextjs', description: 'Vercel React, Next.js, and React Native agent skills', command: 'agent-brain package add @nextjs' },
		{ name: '@claude-skills', description: 'Jeff Allan curated Claude skills library', command: 'agent-brain package add @claude-skills' },
		{ name: '@ecc', description: 'Everything Claude Code: large curated skill library', command: 'agent-brain package add @ecc' },
		{ name: '@rust', description: 'Rust patterns, testing, and review (via ECC)', command: 'agent-brain package add @rust' },
		{ name: '@official', description: 'Official skill repos: awesome-copilot, anthropics/skills, azure-skills', command: 'agent-brain package add @official' },
		{ name: '@starter', description: 'Lightweight onboarding: Matt Pocock skills and Vercel React patterns', command: 'agent-brain package add @starter' }
	];
</script>

<svelte:head>
	<title>Registry — agent-brain</title>
	<meta name="description" content="Skill packages you can add to agent-brain with agent-brain package add." />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6">
	<p class="font-mono text-xs uppercase tracking-widest text-zinc-500">Registry</p>
	<h1 class="mt-4 text-4xl font-semibold tracking-tight text-white">Skill packages</h1>
	<p class="mt-4 max-w-2xl text-zinc-400">Add a package with <code class="font-mono text-zinc-200">agent-brain package add</code>. Each package adds skills that agent-brain can route to a task.</p>
	<div class="mt-12">
		<RegistryList entries={packages} />
	</div>
</div>
