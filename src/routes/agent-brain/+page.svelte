<script lang="ts">
	import ProductPage from '#lib/components/ProductPage.svelte';
</script>

<svelte:head>
	<title>agent-brain — context engine and MCP server for coding agents</title>
	<meta
		name="description"
		content="agent-brain routes context to AI coding agents, gates their tools, and records verify runs as receipts. Installs on its own with Homebrew."
	/>
</svelte:head>

<ProductPage
	name="agent-brain"
	tagline="agent-brain · 1.0.0-rc8"
	headline="Context for coding agents, routed and checked."
	subline="A local MCP server that tells an agent which skills and rules apply to a task, blocks tools until the agent has routed, and keeps a receipt for every verify run."
	install="brew install autonomic-ai-dev/tap/agent-brain"
	features={[
		{
			title: 'Route before acting',
			body: 'route_task returns the skills, rules and traps that match the task, within a fixed token budget. Other agent-brain tools stay blocked until the agent has routed.'
		},
		{
			title: 'Gates, not instructions',
			body: 'In hosts with hooks, the route gate and bash gate check the agent before it acts. In hosts without hooks, the protection is the agent following the instructions.'
		},
		{
			title: 'Receipts you can check',
			body: 'agent-brain verify records each command with its exit code and the commit it ran against. verify receipt reports PASSED, FAILED or NOT VERIFIED.'
		}
	]}
	steps={[
		{ label: 'Install the binary', command: 'brew install autonomic-ai-dev/tap/agent-brain' },
		{ label: 'Register it with your coding hosts', command: 'agent-brain install' },
		{ label: 'Check the installed hosts', command: 'agent-brain doctor' },
		{ label: 'Run a verify command and read its receipt', command: 'agent-brain verify -- cargo test\nagent-brain verify receipt' }
	]}
	limits={[
		'VS Code (GitHub Copilot) and Claude Desktop have no hooks, so the gates do not run there.',
		'Cursor needs one manual step: the installer prints the rule file path and you paste it into Cursor settings.',
		'Claude Code and Codex do not run new hooks until you trust them.',
		'Codex has install and configuration tests but no end-to-end test that runs its hooks.',
		'The dashboard reports measured counts and labelled estimates. It does not measure whether routed context made an agent finish a task better.'
	]}
	docsHref="https://autonomic-ai.dev/docs/cli/agent-brain"
	otherHref="https://agent-spine.autonomic-ai.dev"
	otherName="agent-spine →"
/>
