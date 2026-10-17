# Released

This file tracks every released version of agent-spine and the planned feature roadmap for upcoming releases.

## Conventions

```text
v0.1  — Foundational: engine, state, YAML, CLI
v0.2  — Install: single-command setup
v0.3  — Supervisor: HITL, hooks, retry policies
v0.4  — Context: agent-brain per-node routing, enrichment
v0.5  — Execution: fork/join, conditional routing, dynamic branches
v0.6  — Observability: Web UI, WebSocket streaming, OTel spans
v0.7  — Production: Postgres, Redis, cancellation, leases
v0.8  — Workflows: built-in workflow library (universal-developer, etc.)
v0.9  — Scale: model escalation, multi-agent debate, sandbox
v0.10 — Polish: self-update, benchmark harness, ecosystem installer
```

---

## [0.3.0] — 2026-06-19

### Added
- **CLI `doctor`**: Diagnoses common setup issues (rustc, protoc, bun, agent-brain, config, workflow validation)
- **Supervisor Events**: `WorkflowEvent` broadcast channel — emits on node start/complete/fail/approval and workflow done/fail
- **gRPC WatchEvents**: Server-streaming RPC for real-time event subscription
- **IDE Briefing**: `PendingTask` returns `node_kind`, `description`, `workflow_name`; new `GetPendingTaskDetail` RPC
- **RetryPolicy Validation**: YAML parse-time enforcement of `max_attempts > 0` and `backoff_ms > 0`

### Changed
- **Supervisor::delegate()**: Extended signature with node metadata; emits lifecycle events
- **Proto**: New RPCs (`WatchEvents`, `GetPendingTaskDetail`), enhanced messages

---

## [0.2.0] — 2026-06-19

### Added
- **install.sh**: Single-command `curl | bash` installer that auto-detects OS/arch and pulls the correct binary from GitHub releases
- **opencode config**: Project-level MCP configuration for agent-brain integration

### Changed
- **README**: Install path replaced with one-liner at the top

---

## [0.1.0] — 2026-06-19

### Added
- **Stateful Execution Engine**: Deterministic DAG graph traversal with support for cyclic execution loops and state machines
- **YAML Workflow Schema**: `WorkflowDefinition` with nodes, edges, kinds (Agent, Checkpoint, Verify, ApprovalGate), and validation
- **Immutable Snapshots**: Append-only `StateSnapshot` with parent-linked sequence — every transition is auditable
- **Parallel Fan-out/Fan-in**: Concurrent branch execution via edge topology; `JoinSet`-based merging at join nodes
- **LocalAgent**: Auto-resolves Agent/Checkpoint/ApprovalGate nodes without external hooks — background tokio task
- **ApprovalGate**: Human-in-the-loop pause/resume; reject blocks execution with error
- **Exponential Backoff Retries**: Configurable per-node retry policy with hard limits
- **ConfidenceRouter**: Escalates after N consecutive failures (threshold-based routing)
- **State Stores**: `InMemoryStateStore` (dev), `FileStateStore` (JSONL), `SqliteStateStore` (persistent)
- **BrainRouter**: Lazy-connect MCP bridge to agent-brain with graceful fallback to ConfidenceRouter; payload enrichment, trajectory logging
- **McpBridge**: JSON-RPC 2.0 client over child-process stdio — handshake, tool calls, server request handling
- **`brain` CLI**: `health`, `route`, `status` subcommands for agent-brain interaction
- **gRPC Dashboard API**: `DashboardService` + `SupervisorService` with gRPC-Web + CORS
- **Init Command**: `agent-spine init` generates config, prerequisites check, example workflow
- **CLI Commands**: `run`, `validate`, `inspect`, `replay`, `init`, `serve`, `brain`
- **CI/CD Pipeline**: GitHub Actions with `pipeline-compose` for lint, test, build, cross-platform release

### Changed
- **Executor::run()**: Enriches agent/checkpoint payloads via BrainRouter; logs trajectories at init/complete/node milestones

---

## [0.4.0] — 2026-06-19

**Theme:** Context Routing — wire agent-brain into every node

### Added
- **Per-Node BrainRouter**: Every agent/checkpoint node calls `agent-brain` route_task before execution, not just at run start
- **Context Provenance**: Snapshot metadata records `context_id`, `route_confidence`, `skills_used`, `agents_loaded` from each brain round-trip — injected as `_brain_provenance` in snapshot payloads
- **BrainProvenance**: New struct with structured provenance fields replacing raw `_brain` injection
- **Outcome Feedback**: After node completion, call `store_trajectory` on agent-brain with outcome (success/failure) and `task_kind` for learning loop
- **Payload Limits**: `SnapshotConfig` with `max_payload_bytes` — oversize payloads produce `PayloadTooLarge` error
- **Secrets Redaction**: `SnapshotConfig.secrets_redact` — configurable field name patterns (defaults: api_key, token, password, secret, private_key, authorization) stripped from state snapshots at write time
- **`--brain` CLI flag**: `agent-spine run --brain` enables agent-brain routing and enrichment
- **SnapshotConfig**: New public struct on executor for payload limits and secrets redaction
- **`payload_mut()` accessor**: Added to `StateSnapshot` for in-place redaction before persist

### Changed
- **enrich_from_brain**: Now uses `BrainProvenance` struct instead of raw `RouteTaskResponse`; provenance stored as `_brain_provenance` key
- **log_trajectory**: Passes `task_kind` parameter for richer learning loop metadata
- **Executors**: `prepare_and_append_snapshot` applies redaction + size check before persisting

### Exit criteria
- Every node execution includes a brain routing round-trip
- Snapshot inspection shows brain provenance for each transition
- Trajectories logged to brain.db for all execution milestones

---

## [0.5.0] — 2026-06-19

**Theme:** Dynamic Execution — conditional branches and explicit parallelism

### Added
- **Fork/Join Node Kinds**: `Fork` fans out to N parallel paths; `Join` collects all results with barrier semantics before proceeding (explicit Map-Reduce, not just edge topology)
- **Conditional Edges**: `WorkflowEdge.condition` field — expression like `state.task_type == "frontend"` evaluated against current payload at routing time; edges where condition is false are skipped
- **Condition Evaluator**: New `condition` module with expression parser supporting `<`, `>`, `<=`, `>=`, `==`, `!=` operators on dot-path fields
- **Meta-Router**: Pre-execution workflow selection via agent-brain — `agent-spine run --meta "build a frontend feature"` queries brain to select the appropriate YAML
- **Router Node Kind**: New `NodeKind::Router` — delegates to LLM agent to inject state variables used in conditional edge expressions
- **Join Barrier Tracking**: Executor pre-computes incoming edge counts for Join nodes; only proceeds when all Fork branches have reached the Join
- **Fork/Join test suite**: `test_fork_join_barrier`, `test_fork_join_with_multi_level_branches`, `test_conditional_edge_skips_branch` integration tests

### Changed
- **Phase 2 execution match**: Fork and Join nodes are pass-through (no agent delegation); Router delegates to supervisor like Agent
- **Phase 5 routing**: Evaluates edge conditions before brain routing; tracks Join barrier completion before scheduling Join
- **init workflow**: Example now includes Fork/Join pattern for parallel review branches
- **Condition unit tests**: 6 tests covering numeric comparisons, string equality, boolean inequality, missing fields, nested paths

### Exit criteria
- workflow with explicit `Fork` → parallel paths → `Join` executes correctly
- Conditional edges skip branches where predicate is false
- `Meta-Router` dispatches to specialized workflow YAML based on intent

---

## [0.6] — Planned

**Theme:** Observability — live dashboard and distributed tracing

### Features
- **Live WebSocket Stream**: Executor pushes real-time node transitions to connected dashboard clients (replaces polling)
- **Wire Executor into `serve`**: `agent-spine serve` loads YAML, starts execution, persists to configured state store, exposes live DAG state
- **OpenTelemetry Spans**: Export spans for every state transition and node execution via `tracing-opentelemetry` (OTLP/gRPC to Jaeger, Datadog, etc.)
- **Visual DAG**: Dashboard renders live-updating graph with colored nodes (running, completed, failed, waiting-approval)

### Exit criteria
- Dashboard shows live workflow progress without manual refresh
- OTel spans visible in Jaeger for a sample run
- `serve` can initiate and monitor workflow executions

---

## [0.7] — 2026-06-19

**Theme:** Production State Stores — scale beyond single-node SQLite

### Added
- **PostgresStateStore**: `sqlx::PgPool`-backed store with JSONB column, `UNIQUE(execution_id, sequence)` constraint, GIN index for execution lookups — behind `postgres` feature gate
- **RedisStateStore**: `redis::aio::MultiplexedConnection`-backed store using sorted sets (`ZADD`/`ZRANGE`/`ZCARD`), JSON string values, `Mutex`-guarded connection — behind `redis` feature gate
- **Execution Cancellation**: `CancelToken` wrapping `tokio::sync::watch<bool>`; `setup_signal_handler()` for SIGINT/SIGTERM; checks cancel state per-cycle, saves final snapshot with `cancelled: true`, returns gracefully as `Ok(execution_id)`
- **Idempotency Keys**: `IdempotencyStore` trait with `InMemoryIdempotencyStore` (dev) and `SqliteIdempotencyStore` (persistent); `idempotency_keys` table with `key` as primary key; `check_idempotency()` helper prevents duplicate side-effects on replay
- **Concurrency Limits**: `tokio::sync::Semaphore` in `WorkflowManager`; `--max-concurrency` CLI flag on `serve`; new submissions queue when limit reached

### Changed
- Async state backends (Postgres, Redis) use `block_in_place` + `block_on` to satisfy synchronous `WorkflowState` trait — avoids refactoring all sync store impls
- Redis connection wrapped in `std::sync::Mutex` to satisfy `WorkflowState`'s `&self` methods with mutable Redis access
- Version bumped from `0.6.0` to `0.7.0`

### Exit criteria
- Same workflow runnable against Postgres and SQLite with one config line change
- Ctrl+C during execution saves partial state and resumes from last snapshot
- Concurrent runs capped by configurable limit

---

## [0.8] — 2026-06-19

**Theme:** Workflow Library — ship production-ready YAML pipelines

### Added

- **7 Built-in Workflows** checked into `workflows/` and embedded in the binary:

| Workflow | Nodes | Key Feature |
|----------|-------|-------------|
| `universal-developer.yaml` | Hydrate → Plan → Write → Test+Lint → (loop if fail) → ApprovalGate | General-purpose dev loop |
| `database-migration.yaml` | Analyze Schema → Write SQL → Sandbox DB → Apply → Rollback Test → ApprovalGate | Safe schema changes |
| `security-patcher.yaml` | Audit → Bump Package → Test → (if breaking: Fix Callers → Re-test) → Open PR | Automated CVE response |
| `deep-code-review.yaml` | Fan-out 3 critics (Security, Perf, Style) → Fan-in Aggregator → PR Comments | Parallel code review |
| `brutal-refactor.yaml` | AST Search → Draft Interface → Update Callers → Typecheck Loop → ApprovalGate | Large-scale refactors |
| `system-architect.yaml` | Gather Context → Ideate 3 Architectures → Fan-out Evaluation → Fan-in → ADR → ApprovalGate | System design |
| `root-cause-analysis.yaml` | Hydrate Logs → 3 Hypotheses → Sandbox Reproduction → Identify Root Cause → Post-Mortem | Incident response |

- **Workflow version pinning**: `min_spine_version` field in YAML frontmatter (e.g. `min_spine_version: "0.8.0"`) — validated against running binary at parse time with numeric component comparison
- **`init --with <workflow>`**: Generate a specific built-in workflow instead of the default example; `init --with list` lists available workflows
- **Embedded Workflow Library**: New `workflows` module compiled via `include_str!` — always available without disk files

### Changed
- `WorkflowDefinition` gains optional `min_spine_version` field with accessor and validation
- `Init` command accepts `--with <name>` flag; writes named workflow to config directory
- Version bumped from `0.7.0` to `0.8.0`

### Exit criteria
- `agent-spine init --with universal-developer` generates a working pipeline
- All 7 workflows validate cleanly

---

## [0.9] — 2026-06-19

**Theme:** Intelligence Scaling — escalation, debate, and sandboxed reasoning

### Added
- **Debate Node Kind**: `NodeKind::Debate` — alternates coder and critic agents in rounds; configurable via `debate_config` (`max_rounds`: 3, `coder_prompt`, `critic_prompt` with good defaults); injects `_node_role: debate_coder` into delegate payload
- **Vote Node Kind**: `NodeKind::Vote` — runs same prompt N times (configurable `count`: 3, `temperature`: 0.7); selects by `majority_vote` (default true) or lowest validation error; injects `_node_role: vote`
- **Sandbox Node Kind**: `NodeKind::Sandbox` — isolated Docker execution node; configurable via `sandbox_config` (`image`: "ubuntu:24.04", `timeout_secs`: 60); injects `_node_role: sandbox` into delegate payload
- **Hydrate Node Kind**: `NodeKind::Hydrate` — pre-execution context gathering (git diff, lint, test output); enriched via brain router but no delegate call (pass-through like Fork/Join)
- **Model Escalation**: `escalation_model` field on any node — after configured retries are exhausted, the executor injects `_escalation_model` into payload and makes one more delegate attempt with a frontier model identifier

### Changed
- `NodeKind` enum grows from 7 to 11 variants: `Debate`, `Vote`, `Sandbox`, `Hydrate`
- `WorkflowNode` gains 4 new fields with accessor methods and YAML serialization
- `DebateConfig`, `VoteConfig`, `SandboxConfig` are public structs with sensible defaults
- Phase 1 brain enrichment now includes all new node kinds
- Phase 2 executor calls delegate for Debate, Vote, Sandbox; Hydrate returns payload unchanged
- Retry loop extended: after `max_retries` exhausted, if `escalation_model` is set, attempts one escalation retry before failing
- `Eq` removed from structs containing `f64` (`VoteConfig`); propagated to `WorkflowDefinition`, `WorkflowNode`, `ValidatedWorkflow`, `RetryPolicy`, `DebateConfig`, `SandboxConfig`
- Version bumped from `0.8.0` to `0.9.0`

### Exit criteria
- Model escalation fires: cheap model → fail → expensive model → success
- Debate workflow: Critic catches bug → Coder fixes → loop exits clean
- Sandbox starts container, agent writes/executes script, container destroyed

---

## [0.10] — Planned

**Theme:** Polish & Ecosystem — self-update, benchmarks, unified install

### Features
- **Self-Update**: `agent-spine update` checks GitHub releases for newer version; downloads and replaces binary between workflow runs
- **Local Benchmark Harness**: Runs standardized task suite against local micro-model (Ollama + phi3/qwen), validates output quality, reports score
- **Ecosystem Installer**: `install.sh` optionally installs both `agent-spine` and `agent-brain` in one invocation
- **Full CLI Completion**: Shell completions for bash, zsh, fish
- **Performance Profiles**: `--profile fast` (optimize for speed, minimal tracing) / `--profile full` (full observability, slower)

### Exit criteria
- `agent-spine update` upgrades binary without manual download
- Benchmark suite runs against local Ollama model and produces a report
- Installer flag installs complete agent ecosystem

---

## Future (unversioned)

Features scoped beyond the current roadmap, tracked for architectural awareness:

- **Kubernetes Execution**: Dispatch heavy nodes (integration tests, migrations) as isolated K8s jobs
- **Structured Output Validation**: JSON Schema output contracts on edges; transition fails if payload doesn't match schema
- **Plugin System**: WASM-based plugins for custom node kinds
- **ADR Generation**: Auto-generate Architecture Decision Records from workflow execution history
- **Multi-Tenant Server**: Authenticated multi-user `serve` with per-user workflow isolation
