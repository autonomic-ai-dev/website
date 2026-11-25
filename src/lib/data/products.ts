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
	faqs?: { q: string; a: string }[];
	finalCta: { headline: string; subline: string };
	docsNav: { section: string; links: NavLink[] }[];
	hasBlog: boolean;
	repoUrl?: string;
	story: { headline: string; chapters: { title: string; body: string; transcript: string[] }[] };
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
		hasBlog: true,
		story: {
			headline: 'An agent says the tests pass. tekmor makes that a receipt.',
			chapters: [
				{
					title: 'The claim is cheap',
					body: 'A coding agent finishes a change and says the tests pass. The tests may have run once, earlier, on different code, and the chat does not show which. tekmor sits in Claude Code. When a turn ends with a pass claim and no receipt for the code on disk, the stop gate blocks the turn and says why.',
					transcript: [
						'$ printf \'{"cwd": "/repo/demo"}\' | tekmor stop-gate',
						'Repo demo is blocked: Verification is missing. Files changed in this repo have no passing run recorded after the last edit.'
					]
				},
				{
					title: 'The receipt is for this code',
					body: 'tekmor runs only the commands listed in .verify/verify.toml. Each result is stored with the commit and a hash of the code that ran. A receipt answers for the code on disk now, not for the last run anyone remembers.',
					transcript: [
						'$ tekmor verify -- sh -c true',
						'$ tekmor verify receipt',
						'Verify receipt: PASSED',
						'  command:   sh -c true',
						'  exit code: 0'
					]
				},
				{
					title: 'One edit makes it stale',
					body: 'Change any file that counts toward the code hash and the old pass stops counting. Documentation files, the artifacts folder, the feature maps and the knowledge base do not count. The allowlist itself does, so editing what the project is allowed to prove also needs a new run.',
					transcript: [
						'$ echo "x" >> check.sh',
						'$ tekmor verify receipt',
						'Verify receipt: NOT VERIFIED',
						'  no verify run recorded for this commit and code state; run `tekmor verify -- <cmd>`'
					]
				},
				{
					title: 'A flaky run is not proof',
					body: 'tekmor verify --repeat N runs one command N times on the same code. If the runs disagree, the command is flaky. The receipt and the stop gate leave flaky commands out, so a lucky pass cannot stand in for a check that fails half the time.',
					transcript: [
						'$ tekmor verify --repeat 3 -- sh flaky.sh',
						'  (three recorded runs, one per line of JSON)'
					]
				},
				{
					title: 'Guardrails around the proof',
					body: 'The allowlist decides what counts as proof. tekmor install adds a stop gate for claims and a bash gate that blocks or warns on risky shell commands. A commit gate refuses commits that skip git hooks. A ratchet stops lint counts from rising. Drift flags feature maps that point at code or checks that no longer exist.',
					transcript: [
						'$ tekmor verify ratchet',
						'no-unwrap-in-binary   0 / baseline 0   ok'
					]
				},
				{
					title: 'What it does not do',
					body: 'A session that can read the review key can sign a review. The claim check is a pattern match on the last assistant message, so it can miss a claim worded differently. Runs recorded by 1.0.0 may not count after the upgrade, because generated output no longer counts toward the code hash. Run the checks again.',
					transcript: []
				}
			]
		},
		name: 'tekmor',
		repoUrl: 'https://github.com/autonomic-ai-dev/tekmor',
		origin: 'https://tekmor.autonomic-ai.dev',
		version: '2.0.0',
		tagline: 'Proof eval for coding agents',
		announce: {
			text: 'tekmor 2.0.0 is out.',
			label: 'Read the release notes',
			href: '/tekmor/changelog'
		},
		badge: 'v2.0.0 · Runs locally · No model calls',
		headline: 'Your agent says the tests pass. Check the receipt.',
		subline:
			'tekmor runs the checks your project allows, records each result against the commit and code it ran on, and writes a receipt. A stop gate blocks a turn that claims a pass without one. It makes no model calls and opens no network connection on its own.',
		install: 'brew install autonomic-ai-dev/tap/tekmor',
		chips: ['Allowlisted commands only', 'Receipts tied to the code', 'Stop gate on unverified claims'],
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
		features: [
			{
				icon: 'terminal',
				title: 'Allowlisted commands only',
				body: 'tekmor verify runs only the commands listed in .verify/verify.toml. Anything else is refused and not recorded as a pass.',
				command: 'tekmor verify -- <cmd>'
			},
			{
				icon: 'receipt',
				title: 'Receipts tied to the code',
				body: 'Each run is stored with the commit and a hash of the code that ran. Changing a file that counts toward the code hash makes an earlier pass stop counting.',
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
				body: 'tekmor verify --repeat N runs a command N times on the same code. If the runs disagree, the command is marked flaky and is not proof.',
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
			{ value: '0', label: 'network connections opened by tekmor' },
			{ value: 'PASSED', label: 'the only receipt verdict that counts as proof' }
		],
		limits: [
			'A receipt proves the allowlisted command exited 0 on this exact code. It does not prove the change is correct.',
			'Only Bash commands are gated. Write and Edit tool calls are not.',
			'.claude/ and Markdown files are not part of the code hash.',
			'A session that can read the review key can sign a review.',
			'The claim check is a pattern match on the last assistant message.',
			'Hooks embed the absolute path of the binary. Run tekmor install again after moving or reinstalling it.',
			'The published binary is for arm64 macOS only.'
		],
		faqs: [
			{
				q: 'How does Tekmor physically block an agent turn in Claude Code?',
				a: 'When you run tekmor install, it registers a Stop hook and a PreToolUse bash gate in .claude/settings.json. When Claude Code attempts to finalize an assistant response, the stop hook executes tekmor stop-gate. If the agent response claims that tests passed or the task is complete, the gate asks for the receipt for the current commit and code. If the verdict is not PASSED, the process exits non-zero, returning a hard blocker message to Claude Code.'
			},
			{
				q: 'What files count toward the code hash?',
				a: 'The code hash is a SHA-256 over the paths and contents of the uncommitted changes reported by git status, untracked files included. Documentation (*.md, *.rst), .verify/artifacts/, .verify/features/, .verify/knowledge-base/, .claude/ and generated output (target/, node_modules/, caches) are excluded. A clean tree hashes empty input.'
			},
			{
				q: 'Does Tekmor run or call an LLM during verification?',
				a: 'No. Tekmor makes exactly 0 model calls and spends 0 API tokens. It is written in 100% deterministic local Rust. Verdicts are decided strictly by process exit codes and the code hash.'
			},
			{
				q: 'How does flaky test detection work with --repeat N?',
				a: 'Running tekmor verify --repeat 3 -- <cmd> executes the allowlisted test command 3 consecutive times against the identical code state. If any run returns a different exit code from the others, the command is marked flaky and does not count toward a PASSED receipt.'
			},
			{
				q: 'How do we prevent developers or CI from accepting forged local receipts?',
				a: 'Under ADR 0004, CI does not trust local receipts produced on developer laptops. The .github/workflows/receipt.yml workflow runs the allowlisted checks on the GitHub Actions runner and publishes the receipt in the job summary as the check "Verified receipt for this change". It blocks merges only if the repository makes that check required in branch protection.'
			}
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
		story: {
			headline: 'An agent improvises. A workflow decides the order, and keeps the record.',
			chapters: [
				{
					title: 'A loop with no record',
					body: 'A prompt loop can take a different path on every run, and it leaves no record of the path it took. thesmos writes the path down before the run starts: named steps, the edges between them, and the checks that must pass.',
					transcript: [
						'name: halt_demo',
						'version: 1',
						'start_node: build',
						'nodes:',
						'  - name: build',
						'    kind: verify',
						'    command: "echo compiling"',
						'  - name: test',
						'    kind: verify',
						'    command: "echo 2 failed >&2; exit 1"',
						'  - name: ship',
						'    kind: verify',
						'    command: "echo shipped"',
						'edges:',
						'  - from: build',
						'    to: test',
						'  - from: test',
						'    to: ship'
					]
				},
				{
					title: 'Checked before anything runs',
					body: 'agent-spine validate parses the file and checks it before any command runs. A file that fails the check does not start a run.',
					transcript: [
						'$ agent-spine validate halt.yaml',
						"validated state-machine workflow 'halt_demo' starting at node: build"
					]
				},
				{
					title: 'A failed check stops the run',
					body: 'A verify node runs its command under a timeout and records the exit code. When the command fails, the run stops with an error, and the steps after it do not run. The ship step in the example never prints.',
					transcript: [
						'$ agent-spine run halt.yaml',
						'Error: command node failed: 2 failed',
						'$ echo $?',
						'1'
					]
				},
				{
					title: 'Every step leaves a row',
					body: 'After each step, thesmos appends a snapshot to SQLite. Rows are only added, so a finished run reads in the order it happened. inspect prints one run from its snapshots.',
					transcript: [
						'$ agent-spine inspect <EXECUTION_ID>',
						'Sequence: 0',
						'Payload: {}',
						'Transition: Initial',
						'---',
						'Sequence: 1',
						'Payload: {'
					]
				},
				{
					title: 'Replay reads the record',
					body: 'replay rebuilds the final state from the snapshots. It runs no agent step and no verify command. To run the workflow again, start a new execution, and the old record stays as it was.',
					transcript: [
						'$ agent-spine replay <EXECUTION_ID>',
						'Replay complete. Final sequence: 1'
					]
				},
				{
					title: 'What it does not do yet',
					body: 'Approval gates pass unless auto-approve is turned off, and nothing in the released command line sets approved: true. SpeculativeFork is planned and passes its payload through unchanged. In this release the command is still named agent-spine, and its --brain and --meta flags depend on the retired agent-brain.',
					transcript: []
				}
			]
		},
		name: 'thesmos',
		repoUrl: 'https://github.com/autonomic-ai-dev/thesmos',
		origin: 'https://thesmos.autonomic-ai.dev',
		version: '1.0.0-rc3',
		tagline: 'Deterministic YAML workflows',
		announce: {
			text: 'thesmos 1.0.0-rc3 is in private beta.',
			label: 'Read the changelog',
			href: '/thesmos/changelog'
		},
		badge: 'v1.0.0-rc3 · Private beta · Runs locally',
		headline: 'Your agent says the tests passed. Show the snapshot.',
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
		faqs: [
			{
				q: 'Why run a declarative YAML DAG instead of a standard prompt loop?',
				a: 'Prompt loops are nondeterministic: an agent improvises different steps each time, can get trapped in repetitive retries, and leaves no verifiable execution trace. In Thesmos, the graph topology, verification checkpoints, and approval barriers are pre-declared in version-controlled YAML. The agent works inside bounded steps; the graph controls transitions.'
			},
			{
				q: 'How do Verify nodes differ from Agent nodes?',
				a: 'Agent nodes invoke cognitive worker models with injected context. Verify nodes run active shell validation commands under strict timeouts without any model in the loop, capturing stdout, stderr, and exit codes. A non-zero exit code halts the workflow immediately unless continue_on_failure: true is set.'
			},
			{
				q: 'What is Cognitive Knapsack Injection?',
				a: 'No. In this release thesmos does not call tekmor. Its agent nodes receive the context in their payload. The --brain flag depends on agent-brain, which has been retired, so do not use it.'
			},
			{
				q: 'How does replay work without spending LLM tokens?',
				a: 'Every node transition appends an immutable point-in-time snapshot to the SQLite database (~/.autonomic/logs/spine/state.db). Running agent-spine replay <EXECUTION_ID> reconstructs the final DAG state by reading the recorded snapshots in sequence. It executes 0 agent turns and makes 0 model calls.'
			},
			{
				q: 'What happens if an external NATS broker is not available?',
				a: 'Thesmos runs entirely local-first. If AUTONOMIC_NATS_URL is unset or unavailable, failed nodes and dead-letter events are automatically written to a zero-daemon local JSONL file at ~/.autonomic/state/spine/dlq.jsonl.'
			}
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
	{
		...products.tekmor,
		docs: `${products.tekmor.origin}/docs`,
		blog: `${products.tekmor.origin}/blog`
	},
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
