export type ProductId = 'agent-brain' | 'agent-spine';

export type NavLink = { label: string; href: string };

export type Product = {
	id: ProductId;
	name: string;
	origin: string;
	tagline: string;
	headline: string;
	subline: string;
	install: string;
	features: { title: string; body: string }[];
	steps: { label: string; command: string }[];
	limits: string[];
	docsNav: { section: string; links: NavLink[] }[];
};

export const products: Record<ProductId, Product> = {
	'agent-brain': {
		id: 'agent-brain',
		name: 'agent-brain',
		origin: 'https://agent-brain.autonomic-ai.dev',
		tagline: 'Context engine and MCP server',
		headline: 'Context for coding agents, routed and checked.',
		subline:
			'A local MCP server that tells an agent which skills and rules apply to a task, blocks tools until the agent has routed, and keeps a receipt for every verify run.',
		install: 'brew install autonomic-ai-dev/tap/agent-brain',
		features: [
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
		],
		steps: [
			{ label: 'Install the binary', command: 'brew install autonomic-ai-dev/tap/agent-brain' },
			{ label: 'Register it with your coding hosts', command: 'agent-brain install' },
			{ label: 'Check the installed hosts', command: 'agent-brain doctor' },
			{ label: 'Run a verify command and read its receipt', command: 'agent-brain verify -- cargo test\nagent-brain verify receipt' }
		],
		limits: [
			'VS Code (GitHub Copilot) and Claude Desktop have no hooks, so the gates do not run there.',
			'Cursor needs one manual step: the installer prints the rule file path and you paste it into Cursor settings.',
			'Claude Code and Codex do not run new hooks until you trust them.',
			'Codex has install and configuration tests but no end-to-end test that runs its hooks.',
			'The dashboard reports measured counts and labelled estimates. It does not measure whether routed context made an agent finish a task better.'
		],
		docsNav: [
			{
				section: 'Start',
				links: [
					{ label: 'Overview', href: '/docs' },
					{ label: 'Installation', href: '/docs/installation' }
				]
			},
			{
				section: 'Concepts',
				links: [
					{ label: 'Architecture', href: '/docs/architecture' },
					{ label: 'Memory', href: '/docs/memory' },
					{ label: 'Verification', href: '/docs/verification' },
					{ label: 'Invariants', href: '/docs/invariants' }
				]
			},
			{
				section: 'Packages',
				links: [
					{ label: 'agstack', href: '/docs/agstack' },
					{ label: 'gstack', href: '/docs/gstack' },
					{ label: 'Minimalist entrepreneur', href: '/docs/minimalist-entrepreneur' }
				]
			},
			{
				section: 'Reference',
				links: [
					{ label: 'CLI overview', href: '/docs/cli' },
					{ label: 'agent-brain CLI', href: '/docs/cli/agent-brain' }
				]
			}
		]
	},
	'agent-spine': {
		id: 'agent-spine',
		name: 'agent-spine',
		origin: 'https://agent-spine.autonomic-ai.dev',
		tagline: 'Deterministic YAML workflows',
		headline: 'Workflows for coding agents, with snapshots you can read.',
		subline:
			'Describe a multi-step job as a YAML file of named nodes and edges. agent-spine runs it, writes a snapshot after each step, and lets you inspect the run afterwards.',
		install: 'brew install autonomic-ai-dev/tap/agent-spine',
		features: [
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
		],
		steps: [
			{ label: 'Install the binary', command: 'brew install autonomic-ai-dev/tap/agent-spine' },
			{ label: 'Scaffold a built-in workflow', command: 'agent-spine init --with @bugfix' },
			{ label: 'Check the file', command: 'agent-spine validate bugfix.yaml' },
			{
				label: 'Run it, then read the history',
				command: "agent-spine run bugfix.yaml -p '{\"ticket\": \"BUG-42\"}'\nagent-spine inspect <EXECUTION_ID>"
			}
		],
		limits: [
			'Approval gates auto-approve by default. A gate in the YAML does not pause a run unless auto-approve is turned off.',
			'Nothing in the released command line approves a waiting gate. A process has to set approved: true in the payload.',
			'SpeculativeFork passes its payload through unchanged. It does not create worktrees or pick a winner yet.',
			'replay does not run steps again. To re-run a workflow, start a new execution.',
			'Snapshots record the outcome the executor saw. A command that changed something outside the repository is not captured.'
		],
		docsNav: [
			{
				section: 'Start',
				links: [{ label: 'Overview', href: '/docs' }]
			},
			{
				section: 'Concepts',
				links: [{ label: 'Workflows and node kinds', href: '/docs/workflows' }]
			},
			{
				section: 'Reference',
				links: [{ label: 'agent-spine CLI', href: '/docs/cli/agent-spine' }]
			}
		]
	}
};
