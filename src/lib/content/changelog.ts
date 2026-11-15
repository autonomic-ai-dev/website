export type ChangelogCategory = 'Added' | 'Changed' | 'Fixed' | 'Security' | 'Migration';

export type ChangelogEntry = {
	version: string;
	product: 'thesmos' | 'tekmor';
	productName: string;
	date: string;
	title: string;
	summary: string;
	gitTag?: string;
	codeSnippet?: {
		lang: string;
		title: string;
		code: string;
	};
	sections: {
		category: ChangelogCategory;
		items: string[];
	}[];
};

export const changelogEntries: ChangelogEntry[] = [
	{
		version: '1.0.0-rc3',
		product: 'thesmos',
		productName: 'thesmos (agent-spine)',
		date: '2026-10-28',
		title: 'Active Verify Nodes, Knapsack Injection & Local DLQ Fallback',
		summary: 'Introduced asynchronous command execution in Verify nodes with active timeout monitoring, automated surgical ~500-token cognitive knapsack injection from tekmor route_task, isolated multi-branch speculative execution in temporary git worktrees, and zero-daemon local DLQ fallback.',
		gitTag: 'v1.0.0-rc3',
		codeSnippet: {
			lang: 'yaml',
			title: 'bugfix_pipeline.yaml — Active Verify & Knapsack Configuration',
			code: `nodes:
  - name: reproduce_failure
    kind: verify
    command: "cargo test --test reproduce_bug"
    timeout_secs: 60
    continue_on_failure: false

  - name: isolate_and_patch
    kind: agent
    # Automatically injected with ~500-token _brain_knapsack from tekmor route_task
    retry_policy:
      max_attempts: 2
      backoff_ms: 1000

  - name: speculative_refactor
    kind: speculative_fork
    branches: ["branch_a", "branch_b"]`
		},
		sections: [
			{
				category: 'Added',
				items: [
					'Active Verify Node Execution: NodeKind::Verify executes shell validation commands asynchronously under timeout, capturing stdout, stderr, and exit code, and failing the step if exit code is non-zero (unless continue_on_failure: true).',
					'Cognitive Knapsack Injection: Automatically injects surgical ~500-token _brain_knapsack from agent-brain route_task into Agent node payloads before supervisor delegation, preventing context window pollution.',
					'Zero-Daemon Local DLQ Fallback: Persists dead-letter queue entries to ~/.autonomic/state/spine/dlq.jsonl when an external NATS broker is unavailable or disabled.',
					'Procedure Graph Bi-Directional Transition Sync: Automatically syncs workflow DAG edge transitions into agent-brain Schema v23 procedure graph (procedure_edges) via store_trajectory.',
					'Speculative Worktree Branching: Added NodeKind::SpeculativeFork and SpeculativeWorktreeGuard for isolated multi-branch speculative execution in temporary git worktrees.',
					'Dashboard Time-Travel Debugger & Replay: Enhanced Svelte dashboard with verification status badges, command tag display, and 1-click sequence replay without re-running agent turns.'
				]
			},
			{
				category: 'Fixed',
				items: [
					'Restored resumeTask handler in dashboard Action Center.',
					'Formatted test suites cleanly to satisfy strict CI linter rules and clippy warnings.'
				]
			}
		]
	},
	{
		version: '1.0.0',
		product: 'tekmor',
		productName: 'tekmor',
		date: '2026-10-27',
		title: 'First Stable Release: Cryptographic Tree Receipts & Claude Code Stop Gates',
		summary: 'Initial production release of tekmor. Enforces allowlisted verification checks in .verify/verify.toml, binds results to git tree SHAs, registers native Stop and Bash hooks in Claude Code, eliminates flaky proofs via --repeat N, and introduces baseline ratchets.',
		gitTag: 'v1.0.0',
		codeSnippet: {
			lang: 'json',
			title: '.verify/receipt.json — Cryptographic Tree Receipt Schema',
			code: `{
  "schema": "v1.0.0",
  "command": "cargo test --all-features",
  "exit_code": 0,
  "git_commit": "a8f3b12c4",
  "tree_sha": "4f9a2b8e19c02d7e",
  "verdict": "PASSED",
  "source": "cli",
  "recorded_at": "2026-10-27T14:22:01Z",
  "artifact": ".verify/artifacts/run-a8f3b12c4.log",
  "stale": false
}`
		},
		sections: [
			{
				category: 'Added',
				items: [
					'Allowlisted Verification Engine: tekmor verify -- <cmd> runs only commands explicitly authorized in .verify/verify.toml. Arbitrary or unreviewed commands are refused.',
					'Cryptographic Tree-Hashed Receipts: Stores exit code, commit SHA, and exact tree SHA in .verify/receipt.json. Modifying any tracked source file immediately invalidates past passes as STALE.',
					'Claude Code Stop Gate: tekmor install registers a Stop hook in .claude/settings.json, intercepting turn completions and blocking claims that tests pass without a PASSED receipt for the current tree SHA.',
					'Bash Gate PreToolUse Hook: Intercepts shell execution in Claude Code to terminate unauthorized or dangerous bash invocations.',
					'Flaky Command Detection: tekmor verify --repeat N runs checks N times on one tree; conflicting results are marked FLAKY_DISAGREEMENT and rejected.',
					'Quality Ratchet: tekmor verify ratchet locks baselines for lint warnings and coverage, allowing metrics to improve while preventing regressions.',
					'Repository Drift Auditor: tekmor verify drift reports feature mappings whose code paths or verification commands no longer exist on disk.',
					'Mutation Checker: tekmor verify check-checks tests the test suite against intentionally broken copies in .verify/broken/ to ensure failures are caught.',
					'CI Integration (ADR 0004): Clean-room verification in .github/workflows/receipt.yml publishing verifiable proof directly to $GITHUB_STEP_SUMMARY.'
				]
			},
			{
				category: 'Security',
				items: [
					'0 Model Calls: Entire evaluation engine is 100% deterministic local Rust with zero tokens spent.',
					'0 Network Telemetry: Verified zero network sockets opened during verification or gate execution.'
				]
			}
		]
	},
	{
		version: '1.0.0-rc2',
		product: 'thesmos',
		productName: 'thesmos (agent-spine)',
		date: '2026-10-26',
		title: 'Core Engine Scoping & Dependency Modernization',
		summary: 'Scoped engine to agent-brain and agent-spine, removing legacy Docker runner dependencies and muscle/sandbox nodes in favor of pure agent and verify nodes.',
		gitTag: 'v1.0.0-rc2',
		sections: [
			{
				category: 'Changed',
				items: [
					'Scoped to agent-brain and agent-spine. Removed agent-body-core dependency, muscle and sandbox node kinds, and external Docker runner.',
					'Workflows now use agent nodes for cognitive execution and verify nodes for shell validation.',
					'Upgraded dependencies to rmcp 2.0, schemars 1.0, and async-nats 0.47.'
				]
			},
			{
				category: 'Migration',
				items: [
					'Workflows using muscle_exec or sandbox node kinds must be rewritten to use agent and verify nodes.'
				]
			}
		]
	},
	{
		version: '1.0.0-rc1',
		product: 'thesmos',
		productName: 'thesmos (agent-spine)',
		date: '2026-10-24',
		title: 'Durable Executions, Route Drift Gate & MCP Budget Checks',
		summary: 'Added durable workflow state persistence across process restarts, route drift verification, HTTP routes registry, and token budget enforcement over Model Context Protocol.',
		gitTag: 'v1.0.0-rc1',
		sections: [
			{
				category: 'Added',
				items: [
					'Durable Executions: Workflow resumption from last valid snapshot.',
					'Route drift gate and HTTP routes table validation.',
					'Heart budget check over MCP to prevent runaway token spend.'
				]
			},
			{
				category: 'Fixed',
				items: [
					'A node is cleanly denied when the budget check service is unavailable.'
				]
			}
		]
	},
	{
		version: '1.0.0-beta.3.9',
		product: 'thesmos',
		productName: 'thesmos (agent-spine)',
		date: '2026-10-21',
		title: 'SQLite State Snapshots & macOS CLI Notarization',
		summary: 'Added state.db append-only snapshotting, report of database paths on execution startup, and automated Apple notarization pipeline for binary distributions.',
		gitTag: 'v1.0.0-beta.3.9',
		sections: [
			{
				category: 'Added',
				items: [
					'State database path reporting upon execution start.',
					'macOS CLI notarization step using App Store Connect API keys.'
				]
			}
		]
	},
	{
		version: '1.0.0-beta.3.3',
		product: 'thesmos',
		productName: 'thesmos (agent-spine)',
		date: '2026-10-18',
		title: 'Machine-Enforced Engineering Safety 5-Gate Workflow',
		summary: 'Introduced declarative 5-gate engineering safety pipeline and cleaned tracing subscriber stdio pipes for JSON-RPC MCP clients.',
		gitTag: 'v1.0.0-beta.3.3',
		sections: [
			{
				category: 'Added',
				items: [
					'Declarative 5-gate safety workflow enforcing the mandatory sequence: Understand, Predict Failure, Minimal Diff, Attempt to Break, and Verify with Evidence.',
					'Verification node evaluator support and regression test suites in workflow_definition.rs.'
				]
			},
			{
				category: 'Fixed',
				items: [
					'Tracing Stdio Leakage: Routed tracing subscriber logs explicitly to stderr to maintain clean JSON-RPC stdio pipes.'
				]
			}
		]
	},
	{
		version: '1.0.0-beta.3.2',
		product: 'thesmos',
		productName: 'thesmos (agent-spine)',
		date: '2026-10-18',
		title: 'Workflow Preconditions & Approval Continuation',
		summary: 'Integrated declarative budget headroom checks, automatic soft quota fallback model substitution, and human-in-the-loop approval gate resumption.',
		gitTag: 'v1.0.0-beta.3.2',
		sections: [
			{
				category: 'Added',
				items: [
					'Workflow Preconditions & Approval Continuation: Declarative budget headroom checks and automatic soft quota fallback.',
					'CI Skip Path Optimizations: Enhanced change detection to skip workflow runs when PRs only modify docs or markdown.'
				]
			},
			{
				category: 'Security',
				items: [
					'Upgraded rustls to 0.23.46 and quinn-proto to 0.11.19 resolving security advisories.'
				]
			}
		]
	},
	{
		version: '1.0.0-beta.2',
		product: 'thesmos',
		productName: 'thesmos (agent-spine)',
		date: '2026-10-16',
		title: 'Official Homebrew Tap Formula & Centralized Documentation',
		summary: 'Added brew install autonomic-ai-dev/tap/agent-spine formula and consolidated documentation into the central ecosystem hub.',
		gitTag: 'v1.0.0-beta.2',
		sections: [
			{
				category: 'Added',
				items: [
					'Official Homebrew tap formula support (brew install agent-spine).',
					'Consolidated architecture documentation into centralized ecosystem hub.'
				]
			}
		]
	},
	{
		version: '0.18.0',
		product: 'thesmos',
		productName: 'thesmos (agent-spine)',
		date: '2026-07-02',
		title: 'Critical-Path DAG Scheduler',
		summary: 'Kernel overhaul introducing per-node CPP (Critical Path Priority) scoring and prioritized dispatch with strict concurrency caps.',
		gitTag: 'v0.18.0',
		sections: [
			{
				category: 'Added',
				items: [
					'Critical-Path Scheduler: Computes per-node CPP score and dispatches higher-scoring nodes first to reduce starvation.',
					'Comprehensive scheduler test suites verifying DAG traversal preferences.'
				]
			}
		]
	}
];
