export type ProductId = 'agent-brain' | 'agent-spine';

export type NavLink = { label: string; href: string };

export type IconName = 'route' | 'shield' | 'receipt' | 'play' | 'database' | 'eye' | 'terminal' | 'check';

export type Step = { icon: IconName; title: string; body: string; command: string };

export type Product = {
	id: ProductId;
	name: string;
	origin: string;
	version: string;
	tagline: string;
	announce: { text: string; label: string; href: string };
	badge: string;
	headline: string;
	subline: string;
	install: string;
	chips: string[];
	showcase: { title: string; lines: string[]; prompt: boolean };
	features: { icon: IconName; title: string; body: string; command: string }[];
	loop: Step[];
	hosts?: { name: string; hooks: boolean; note?: string }[];
	nodeKinds?: { name: string; body: string }[];
	nodeKindsNote?: string;
	facts: { value: string; label: string }[];
	limits: string[];
	finalCta: { headline: string; subline: string };
	docsNav: { section: string; links: NavLink[] }[];
};

export const MAIN_ORIGIN = 'https://autonomic-ai.dev';

const PRODUCT_HOSTS: Record<string, ProductId> = {
	'agent-brain.autonomic-ai.dev': 'agent-brain',
	'agent-spine.autonomic-ai.dev': 'agent-spine',
	'agent-brain.localhost': 'agent-brain',
	'agent-spine.localhost': 'agent-spine'
};

export const products: Record<ProductId, Product> = {
	'agent-brain': {
		id: 'agent-brain',
		name: 'agent-brain',
		origin: 'https://agent-brain.autonomic-ai.dev',
		version: '1.0.0-rc8',
		tagline: 'Context engine and MCP server',
		announce: {
			text: 'agent-brain 1.0.0-rc8 is in private beta.',
			label: 'Read the install guide',
			href: '/docs/installation'
		},
		badge: 'v1.0.0-rc8 · Private beta · Runs locally',
		headline: 'Stop your coding agent from skipping your rules.',
		subline:
			'agent-brain picks the skills and rules each task needs, inside a fixed token budget. It holds other tools until the agent has routed, and it writes a receipt for every verify run.',
		install: 'brew install autonomic-ai-dev/tap/agent-brain',
		chips: ['Routing reads local files', 'No telemetry SDK in the crate', 'Receipts tied to commits'],
		showcase: {
			title: 'zsh',
			prompt: true,
			lines: [
				'brew install autonomic-ai-dev/tap/agent-brain',
				'agent-brain install',
				'agent-brain doctor',
				'agent-brain verify -- cargo test',
				'agent-brain verify receipt'
			]
		},
		features: [
			{
				icon: 'route',
				title: 'Route before acting',
				body: 'route_task returns the skills, rules and traps that match the task. Other agent-brain tools stay blocked until the agent has routed.',
				command: 'route_task'
			},
			{
				icon: 'shield',
				title: 'Gates on hosts that support them',
				body: 'A route gate and a bash gate check the agent before it acts. Hosts without hooks rely on the agent following instructions. The docs list which is which.',
				command: 'bash gate · route gate'
			},
			{
				icon: 'receipt',
				title: 'Receipts you can read back',
				body: 'verify records each command with its exit code and the commit it ran against. verify receipt reports PASSED, FAILED or NOT VERIFIED.',
				command: 'agent-brain verify receipt'
			}
		],
		loop: [
			{
				icon: 'route',
				title: 'Route',
				body: 'Ask for context before the task starts. route_task returns the matching skills and rules.',
				command: 'route_task'
			},
			{
				icon: 'shield',
				title: 'Gate',
				body: 'Hosts with hooks block unrouted tools and risky shell commands before they run.',
				command: 'bash gate'
			},
			{
				icon: 'play',
				title: 'Verify',
				body: 'Run your real check through agent-brain verify. The exit code is recorded.',
				command: 'agent-brain verify -- <cmd>'
			},
			{
				icon: 'receipt',
				title: 'Receipt',
				body: 'Read the receipt. It shows PASSED, FAILED or NOT VERIFIED for the commit you ran.',
				command: 'agent-brain verify receipt'
			}
		],
		hosts: [
			{ name: 'Claude Code', hooks: true },
			{ name: 'Cursor', hooks: true, note: 'one manual paste' },
			{ name: 'Codex', hooks: true, note: 'trust hooks once' },
			{ name: 'Gemini CLI', hooks: true },
			{ name: 'Antigravity', hooks: true },
			{ name: 'OpenCode', hooks: true, note: 'plugin' },
			{ name: 'VS Code (Copilot)', hooks: false },
			{ name: 'Claude Desktop', hooks: false }
		],
		facts: [
			{ value: '350 to 700', label: 'tokens per route, set by task kind' },
			{ value: '0', label: 'telemetry SDKs in the crate' },
			{ value: '1', label: 'receipt per verify run, tied to a commit' }
		],
		limits: [
			'VS Code (GitHub Copilot) and Claude Desktop have no hooks, so the gates do not run there.',
			'Cursor needs one manual step. The installer prints the rule file path and you paste it into Cursor settings.',
			'Claude Code and Codex do not run new hooks until you trust them.',
			'Codex has install and configuration tests but no end-to-end test that runs its hooks.',
			'The dashboard reports measured counts and labelled estimates. It does not show whether routed context made an agent finish a task better.'
		],
		finalCta: {
			headline: 'Run one verify command. Then read the receipt.',
			subline: 'agent-brain runs on your machine. Install it, register your hosts, and check the first receipt yourself.'
		},
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
					{ label: 'Invariants', href: '/docs/invariants' },
					{ label: 'How it works', href: '/docs/concepts' }
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
					{ label: 'agent-brain CLI', href: '/docs/cli/agent-brain' },
					{ label: 'MCP tools', href: '/docs/mcp-tools' },
					{ label: 'Configuration', href: '/docs/configuration' },
					{ label: 'Troubleshooting', href: '/docs/troubleshooting' }
				]
			}
		]
	},
	'agent-spine': {
		id: 'agent-spine',
		name: 'agent-spine',
		origin: 'https://agent-spine.autonomic-ai.dev',
		version: '1.0.0-rc3',
		tagline: 'Deterministic YAML workflows',
		announce: {
			text: 'agent-spine 1.0.0-rc3 is in private beta.',
			label: 'Read the approval gate notes',
			href: '/blog/spine-approval-gates-snapshots-replay'
		},
		badge: 'v1.0.0-rc3 · Private beta · Runs locally',
		headline: 'Your agent says the tests passed. Show the snapshot.',
		subline:
			'agent-spine runs a workflow of verify, agent and approval steps. It writes a snapshot after every step, so a finished run is a record you can read, not a summary you have to trust.',
		install: 'brew install autonomic-ai-dev/tap/agent-spine',
		chips: ['Verify steps run real commands', 'Snapshots are append-only', 'Replay runs no steps'],
		showcase: {
			title: 'bugfix.yaml (abridged)',
			prompt: false,
			lines: [
				'name: bugfix_pipeline',
				'version: 1',
				'start_node: reproduce_failure',
				'nodes:',
				'  - name: reproduce_failure',
				'    kind: verify',
				'    command: "cargo test --test reproduce_bug"',
				'  - name: isolate_and_patch',
				'    kind: agent',
				'  - name: verify_fix',
				'    kind: verify',
				'    command: "cargo test --all-features"',
				'  - name: sign_off',
				'    kind: approval_gate',
				'edges:',
				'  - from: reproduce_failure',
				'    to: isolate_and_patch',
				'  - from: isolate_and_patch',
				'    to: verify_fix',
				'  - from: verify_fix',
				'    to: sign_off'
			]
		},
		features: [
			{
				icon: 'play',
				title: 'Verify steps run real commands',
				body: 'A verify node runs its shell command under a timeout and records stdout, stderr and the exit code. A failure halts the run unless the payload sets continue_on_failure.',
				command: 'kind: verify'
			},
			{
				icon: 'database',
				title: 'Snapshots are added, never edited',
				body: 'Each step adds a row to the snapshots table in SQLite. Rows are never updated, so the history reads in the order it happened.',
				command: 'snapshots table · SQLite'
			},
			{
				icon: 'eye',
				title: 'Inspect and replay, read-only',
				body: 'inspect prints one run step by step. replay rebuilds the final state from snapshots and runs no step again.',
				command: 'agent-spine inspect <id>'
			}
		],
		loop: [
			{
				icon: 'terminal',
				title: 'Define',
				body: 'Describe the job as nodes and edges in a YAML file, or scaffold a built-in workflow.',
				command: 'agent-spine init --with @bugfix'
			},
			{
				icon: 'check',
				title: 'Validate',
				body: 'agent-spine validate checks the file before anything runs.',
				command: 'agent-spine validate bugfix.yaml'
			},
			{
				icon: 'play',
				title: 'Run',
				body: 'Verify steps run commands and agent steps do the work. Approval gates pass unless auto-approve is off.',
				command: 'agent-spine run bugfix.yaml'
			},
			{
				icon: 'eye',
				title: 'Inspect',
				body: 'agent-spine inspect prints the run from its snapshots, one step at a time.',
				command: 'agent-spine inspect <EXECUTION_ID>'
			}
		],
		nodeKinds: [
			{ name: 'Agent', body: 'Runs an agent step. With --brain, its context comes from agent-brain.' },
			{ name: 'Verify', body: 'Runs a shell command under a timeout and records its output and exit code.' },
			{ name: 'ApprovalGate', body: 'Passes by default. With auto-approve off, waits for approved: true in the payload.' },
			{ name: 'Fork & Join', body: 'Runs branches in parallel and continues when all of them finish.' },
			{ name: 'Debate', body: 'Alternates between coder and critic agents over several rounds.' },
			{ name: 'Vote', body: 'Runs a prompt several times and picks the best output.' },
			{ name: 'Router', body: 'Computes the variables that conditional edges use.' },
			{ name: 'Checkpoint', body: 'Writes an explicit, append-only state barrier.' }
		],
		nodeKindsNote: 'SpeculativeFork is planned. The released executor passes its payload through unchanged.',
		facts: [
			{ value: '1', label: 'snapshot appended after every step' },
			{ value: '0', label: 'steps re-run by replay' },
			{ value: 'Halt', label: 'on a failed verify, unless the payload allows it' }
		],
		limits: [
			'Approval gates auto-approve by default. A gate in the YAML does not pause a run unless auto-approve is turned off.',
			'Nothing in the released command line approves a waiting gate. A process has to set approved: true in the payload.',
			'SpeculativeFork passes its payload through unchanged. It does not create worktrees or pick a winner yet.',
			'replay does not run steps again. To re-run a workflow, start a new execution.',
			'Snapshots record the outcome the executor saw. A command that changed something outside the repository is not captured.'
		],
		finalCta: {
			headline: 'Scaffold a workflow and run it once.',
			subline: 'Start from a built-in template, validate it, then inspect the snapshots your run leaves behind.'
		},
		docsNav: [
			{
				section: 'Start',
				links: [{ label: 'Overview', href: '/docs' }, { label: 'Installation', href: '/docs/installation' }]
			},
			{
				section: 'Concepts',
				links: [{ label: 'Workflows and node kinds', href: '/docs/workflows' }, { label: 'Using with agent-brain', href: '/docs/with-agent-brain' }]
			},
			{
				section: 'Reference',
				links: [{ label: 'agent-spine CLI', href: '/docs/cli/agent-spine' }]
			}
		]
	}
};

export function productForHost(hostname: string): Product | undefined {
	const id = PRODUCT_HOSTS[hostname];
	return id ? products[id] : undefined;
}

export function productPath(product: Product, pathname: string): string {
	const prefix = `/${product.id}`;
	const stripped = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;
	return stripped.replace(/\/+$/, '') || '/';
}
