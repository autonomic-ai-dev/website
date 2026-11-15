export type ProductId = 'agent-spine';

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
	'agent-spine.autonomic-ai.dev': 'agent-spine',
	'agent-spine.localhost': 'agent-spine'
};

export const products: Record<ProductId, Product> = {
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
			{ name: 'Agent', body: 'Runs an agent step with the context its node provides.' },
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
				links: [{ label: 'Workflows and node kinds', href: '/docs/workflows' },
					{ label: 'Design decisions', href: '/docs/decisions' }]
			},
			{
				section: 'Reference',
				links: [{ label: 'agent-spine CLI', href: '/docs/cli/agent-spine' },
					{ label: 'MCP tools', href: '/docs/mcp-tools' },
					{ label: 'Troubleshooting', href: '/docs/troubleshooting' }]
			}
		]
	}
};

export type MainProduct = {
	id: string;
	name: string;
	origin: string;
	version: string;
	tagline: string;
	subline: string;
	install: string;
	showcase: { title: string; lines: string[]; prompt: boolean };
	docs?: string;
	blog?: string;
};

export const tekmor: MainProduct = {
	id: 'tekmor',
	name: 'tekmor',
	origin: 'https://github.com/autonomic-ai-dev/tekmor',
	version: '1.0.0',
	tagline: 'Proof eval for coding agents',
	subline:
		'tekmor runs the checks your project allows, records each result against the commit and code it ran on, and writes a receipt. A stop gate blocks a turn that claims a pass without one. It makes no model calls and opens no network connection on its own.',
	install: 'brew install autonomic-ai-dev/tap/tekmor',
	showcase: {
		title: 'zsh',
		prompt: true,
		lines: [
			'brew install autonomic-ai-dev/tap/tekmor',
			'tekmor install',
			'tekmor verify init',
			'tekmor verify -- .verify/run.sh',
			'tekmor verify receipt'
		]
	},
	docs: 'https://github.com/autonomic-ai-dev/tekmor#readme'
};

export const mainProducts: MainProduct[] = [
	tekmor,
	{
		...products['agent-spine'],
		docs: `${products['agent-spine'].origin}/docs`,
		blog: `${products['agent-spine'].origin}/blog`
	}
];

export function productForHost(hostname: string): Product | undefined {
	const id = PRODUCT_HOSTS[hostname];
	return id ? products[id] : undefined;
}

export function productPath(product: Product, pathname: string): string {
	const prefix = `/${product.id}`;
	const stripped = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;
	return stripped.replace(/\/+$/, '') || '/';
}
