<script lang="ts">
	import ProductPage from '#lib/components/ProductPage.svelte';
</script>

<svelte:head>
	<title>agent-spine — deterministic YAML workflows for coding agents</title>
	<meta
		name="description"
		content="agent-spine runs YAML workflows of verify, agent and approval steps, snapshots each step to SQLite, and lets you inspect a finished run. Installs on its own with Homebrew."
	/>
</svelte:head>

<ProductPage
	name="agent-spine"
	tagline="agent-spine · 1.0.0-rc3"
	headline="Workflows for coding agents, with snapshots you can read."
	subline="Describe a multi-step job as a YAML file of named nodes and edges. agent-spine runs it, writes a snapshot after each step, and lets you inspect the run afterwards."
	install="brew install autonomic-ai-dev/tap/agent-spine"
	features={[
		{
			title: 'Verify steps run real commands',
			body: 'A verify node runs its shell command with a timeout and records stdout, stderr and the exit code. A failing verify stops the run unless continue_on_failure is set.'
		},
		{
			title: 'Snapshots, appended not edited',
			body: 'Each step writes a row to the snapshots table in SQLite. Rows are only added, so the history reads as it happened.'
		},
		{
			title: 'Inspect and replay, read-only',
			body: 'agent-spine inspect prints the steps of one execution in order. replay recreates the final state from snapshots without running any step again.'
		}
	]}
	steps={[
		{ label: 'Install the binary', command: 'brew install autonomic-ai-dev/tap/agent-spine' },
		{ label: 'Scaffold a built-in workflow', command: 'agent-spine init --with @bugfix' },
		{ label: 'Check the file', command: 'agent-spine validate bugfix.yaml' },
		{ label: 'Run it, then read the history', command: 'agent-spine run bugfix.yaml -p \'{"ticket": "BUG-42"}\'\nagent-spine inspect <EXECUTION_ID>' }
	]}
	limits={[
		'Approval gates auto-approve by default. A gate in the YAML does not pause a run unless auto-approve is turned off.',
		'Nothing in the released command line approves a waiting gate. A process has to set approved: true in the payload.',
		'SpeculativeFork passes its payload through unchanged. It does not create worktrees or pick a winner yet.',
		'replay does not run steps again. To re-run a workflow, start a new execution.',
		'Snapshots record the outcome the executor saw. A command that changed something outside the repository is not captured.'
	]}
	docsHref="https://autonomic-ai.dev/docs/cli/agent-spine"
	otherHref="https://agent-brain.autonomic-ai.dev"
	otherName="agent-brain →"
/>
