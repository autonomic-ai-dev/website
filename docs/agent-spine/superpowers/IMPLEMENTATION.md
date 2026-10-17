# Superpower Orchestrator — Implementation Plan

## Objective

Build a local-first, stateful execution engine that coordinates native IDE agents through declarative workflows while preserving every state transition for inspection, replay, and intervention.

## Initial Architecture

The first implementation uses a modular Rust application:

- `domain`: immutable workflow, node, transition, execution, and snapshot types.
- `state`: append-only state persistence and replay contracts.
- `engine`: deterministic graph scheduling and node lifecycle management.
- `adapters`: IDE hooks, model providers, `agent-brain`, compilers, and linters.
- `supervisor`: retry limits, confidence routing, HITL checkpoints, and escalation.
- `cli`: workflow validation, execution, inspection, replay, and resume commands.

Core logic depends on traits rather than concrete infrastructure. SQLite is the intended first durable state adapter; the skeleton starts with an in-memory adapter to stabilize contracts.

## Delivery Phases

### Phase 1 — Executable Core

- Define versioned workflow schemas.
- Parse and validate YAML workflow definitions.
- Implement deterministic DAG execution.
- Persist immutable snapshots and edge transitions.
- Add `run`, `validate`, `inspect`, and `replay` CLI commands.

Exit criteria: a sample workflow executes locally and can be replayed to any transition.

### Phase 2 — Native IDE Supervision

- Define a stable supervisor hook protocol over JSON Lines.
- Add Claude Code and Cursor adapters.
- Stream node status and structured intervention requests.
- Support pause, approve, reject, retry, and resume operations.

Exit criteria: a developer can observe and intervene without leaving the IDE agent flow.

### Phase 3 — Agent-Brain Integration

- Route each node through `agent-brain` before execution.
- Record context IDs and token budgets in snapshot metadata.
- Feed outcome usefulness back to the context router.
- Prevent secrets and oversized payloads from entering persisted state.

Exit criteria: every node receives scoped context with traceable provenance.

### Phase 4 — Inference Scaling and Verification

- Add configurable candidate generation and self-consistency voting.
- Add implementer/reviewer debate policies.
- Add bounded tree-search policies for narrow tasks.
- Implement compiler, test, lint, and schema verification loops.
- Add confidence routing after bounded repeated failures.

Exit criteria: scaling policies remain bounded, observable, and reproducible.

### Phase 5 — Production Hardening

- Add SQLite event storage, migrations, and crash recovery.
- Add cancellation, leases, idempotency, and concurrency limits.
- Add OpenTelemetry-compatible traces and local visualization.
- Add redaction policies, signed audit records, and plugin capability controls.

Exit criteria: interrupted executions resume safely and all external actions are auditable.

## Key Invariants

1. State snapshots are immutable and append-only.
2. Every transition references its parent snapshot.
3. Workflow and state schemas are explicitly versioned.
4. Retries, debates, and searches have hard execution and token limits.
5. External effects use idempotency keys and are recorded before acknowledgement.
6. Human approval is required for configured high-impact transitions.
7. Provider-specific behavior remains behind adapter traits.

## First Public Milestone

The first milestone should prove one narrow path:

1. Load a YAML workflow.
2. Validate nodes, edges, and typed input/output schemas.
3. Execute shell-free mock agent nodes.
4. Persist each state transition to SQLite.
5. Inspect execution history from the CLI.
6. Replay from a selected snapshot into a new execution branch.

This deliberately excludes MCTS, frontier escalation, and full IDE integrations until the deterministic state model is stable.

## Related docs

- [Repository audit](./AUDIT.md) — phase progress, gaps, risks, and next-phase architecture roadmap

