export type ProductId = 'tekmor' | 'thesmos';

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
	headlineMuted: string;
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
	hasBlog: boolean;
};

export const MAIN_ORIGIN = 'https://autonomic-ai.dev';

const PRODUCT_HOSTS: Record<string, ProductId> = {
	'tekmor.autonomic-ai.dev': 'tekmor',
	'tekmor.localhost': 'tekmor',
	'thesmos.autonomic-ai.dev': 'thesmos',
	'thesmos.localhost': 'thesmos'
};

export const products: Record<ProductId, Product> = {
	tekmor: {
		id: 'tekmor',
		hasBlog: false,
		name: 'tekmor',
		origin: 'https://tekmor.autonomic-ai.dev',
		version: '1.0.0',
		tagline: 'Proof eval for coding agents',
		announce: {
			text: 'tekmor 1.0.0 is out.',
			label: 'Read the release notes',
			href: 'https://github.com/autonomic-ai-dev/tekmor/releases/tag/v1.0.0'
		},
		badge: 'v1.0.0 · Runs locally · No model calls',
		headline: 'Your agent says the tests pass.',
		headlineMuted: 'Check the receipt.',
		subline:
			'tekmor runs the checks your project allows, records each result against the commit and code it ran on, and writes a receipt. A stop gate blocks a turn that claims a pass without one. It makes no model calls and opens no network connection on its own.',
		install: 'brew install autonomic-ai-dev/tap/tekmor',
		chips: ['Allowlisted commands only', 'Receipts tied to the code', 'Stop gate on unverified claims'],
		showcase: {
			title: 'zsh · my-project',
			prompt: false,
			lines: [
				'$ tekmor verify -- sh check.sh',
				'tests: 3 passed',
				'  recorded: exit 0, source cli',
				'',
				'$ tekmor verify receipt',
				'Verify receipt: PASSED',
				'  command:   sh check.sh',
				'  exit code: 0'
			]
		},
		features: [
			{
				icon: 'terminal',
				title: 'Allowlisted commands only',
				body: 'tekmor verify runs only the commands listed in .verify/verify.toml. Anything else is refused and not recorded as a pass.',
				command: 'tekmor verify -- <cmd>'
			},
			{
				icon: 'receipt',
				title: 'Receipts tied to the tree',
				body: 'Each run is stored with the commit and a hash of the code that ran. Changing a file that counts toward the tree makes an earlier pass stale.',
				command: 'tekmor verify receipt'
			},
			{
				icon: 'shield',
				title: 'A stop gate for claims',
				body: 'tekmor install adds a Stop hook to Claude Code. A turn that says the tests pass, without a PASSED receipt for the current code, is blocked.',
				command: 'tekmor install'
			},
			{
				icon: 'check',
				title: 'Flaky runs do not count',
				body: 'tekmor verify --repeat N runs a command N times on one tree. If the runs disagree, the command is marked flaky and is not proof.',
				command: 'tekmor verify --repeat 3 -- <cmd>'
			}
		],
		loop: [
			{
				icon: 'terminal',
				title: 'Install',
				body: 'Install the binary, then register the gates in Claude Code.',
				command: 'tekmor install'
			},
			{
				icon: 'check',
				title: 'Allow',
				body: 'Create .verify/ with an allowlist. Add the commands your team trusts to verify.toml.',
				command: 'tekmor verify init'
			},
			{
				icon: 'play',
				title: 'Run',
				body: 'Run the allowed commands. Each result is recorded with the commit and code it ran on.',
				command: 'tekmor verify -- .verify/run.sh'
			},
			{
				icon: 'receipt',
				title: 'Read the receipt',
				body: 'The receipt says PASSED, FAILED or NOT VERIFIED for the current code. Only PASSED is proof.',
				command: 'tekmor verify receipt'
			}
		],
		hosts: [
			{ name: 'Claude Code', hooks: true, note: 'The stop gate and bash gate are added by tekmor install.' },
			{ name: 'Other shells and CI', hooks: false, note: 'Receipts work from any shell. Gates need host hooks.' }
		],
		facts: [
			{ value: '0', label: 'model calls made by tekmor' },
			{ value: '1', label: 'network path, used only for an extension install' },
			{ value: 'PASSED', label: 'the only receipt verdict that counts as proof' }
		],
		limits: [
			'A session that can read the review key can sign a review. The Keychain blocks the shell path, not the Read tool.',
			'The claim check is a pattern match on the last assistant message. It can miss a claim worded differently.',
			'Runs recorded before 1.0.0 are not valid receipts after upgrade, because the tree hash covers more files. Run the checks again.',
			'The published binary is for arm64 macOS only.'
		],
		finalCta: {
			headline: 'Allow one command. Read its receipt.',
			subline: 'Start with the command your team already trusts. Check the receipt for the current code before you believe the claim.'
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
				section: 'Reference',
				links: [
					{ label: 'CLI', href: '/docs/cli' },
					{ label: 'Verification and receipts', href: '/docs/verification' },
					{ label: 'Known limits', href: '/docs/limits' }
				]
			}
		]
	},
	thesmos: {
		id: 'thesmos',
		hasBlog: true,
		name: 'thesmos',
		origin: 'https://thesmos.autonomic-ai.dev',
		version: '1.0.0-rc3',
		tagline: 'Deterministic YAML workflows',
		announce: {
			text: 'thesmos 1.0.0-rc3 is in private beta.',
			label: 'Read the approval gate notes',
			href: '/blog/spine-approval-gates-snapshots-replay'
		},
		badge: 'v1.0.0-rc3 · Private beta · Runs locally',
		headline: 'Your agent says the tests passed.',
		headlineMuted: 'Show the snapshot.',
		subline:
			'thesmos runs a workflow of verify, agent and approval steps. It writes a snapshot after every step, so a finished run is a record you can read, not a summary you have to trust. In this release the command is still named agent-spine.',
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
				command: 'agent-spine init --with universal-developer'
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
				links: [
					{ label: 'Overview', href: '/docs' },
					{ label: 'Installation', href: '/docs/installation' }
				]
			},
			{
				section: 'Concepts',
				links: [
					{ label: 'Workflows and node kinds', href: '/docs/workflows' },
					{ label: 'Design decisions', href: '/docs/decisions' }
				]
			},
			{
				section: 'Reference',
				links: [
					{ label: 'agent-spine CLI', href: '/docs/cli/agent-spine' },
					{ label: 'Troubleshooting', href: '/docs/troubleshooting' }
				]
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

export const mainProducts: MainProduct[] = [
	{ ...products.tekmor, docs: `${products.tekmor.origin}/docs` },
	{
		...products.thesmos,
		docs: `${products.thesmos.origin}/docs`,
		blog: `${products.thesmos.origin}/blog`
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
