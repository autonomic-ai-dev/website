# Agent Spine — Repository Audit

Audit date: 2026-06-18. Compared against the [implementation plan](./IMPLEMENTATION.md) and the next-phase architecture roadmap.

## Phase progress

| Phase | Goal | Status | Notes |
|-------|------|--------|-------|
| **1 — Executable Core** | YAML, DAG execution, snapshots, CLI | **~70%** | Engine + stores + tests exist; CLI lacks `run`/`replay`/`inspect` |
| **2 — Native IDE Supervision** | Supervisor hook protocol, pause/resume | **~60%** | gRPC supervisor works; no JSONL hook protocol or IDE-specific adapters |
| **3 — Agent-Brain Integration** | Route nodes through agent-brain | **0%** | Not started |
| **4 — Inference Scaling** | Debate, voting, verification loops | **~15%** | `ConfidenceRouter` + `Verify` node kind only |
| **5 — Production Hardening** | Migrations, OTel, leases, redaction | **~25%** | SQLite store + tracing; no OTel, cancellation, or idempotency keys |

## Roadmap feature assessment

| Feature | Current state | Gap |
|---------|---------------|-----|
| **Parallel fan-out / fan-in** | Working in `executor.rs` via edge topology | No explicit fork/join node kinds; payload merge is shallow JSON merge |
| **Production state stores** | SQLite + JSONL file store | Postgres (`sqlx` JSONB) and Redis adapters missing |
| **Human-in-the-loop wait states** | `ApprovalGate` + supervisor resume | 30s supervisor timeout; no webhook/event on suspend; not indefinite wait |
| **Observability / tracing** | `tracing` instrumentation on key paths | No `tracing-opentelemetry`; no Jaeger/Datadog export |
| **Retries with backoff** | Hardcoded 3 retries, exponential backoff in executor | Not declarative in workflow YAML; failures still recorded per retry attempt in supervisor path |
| **Live dashboard** | Svelte + gRPC-Web dashboard exists | Polling-based; no WebSocket stream; executor not connected to server |

## Strengths

- Clean trait boundaries (`WorkflowState`, supervisor delegation)
- Immutable snapshot model with sequence enforcement across all stores
- Parallel execution tests cover linear, fan-out/fan-in, approval gates, and router escalation
- gRPC API surface is stable and dashboard-ready
- CI matches the `agent-brain` repo pattern (`pipeline-compose`, stage builds, cross-platform matrix)

## Risks and gaps

1. **`serve` does not run workflows** — the dashboard can list history and resume tasks, but nothing starts an `Executor` from the server process today.
2. **Duplicate gRPC layer** — `server.rs` duplicates supervisor handlers already in `api.rs` and is unused.
3. **No sample workflows** — no checked-in YAML under `examples/` for onboarding.
4. **Supervisor timeout** — 30-second default conflicts with true HITL “wait indefinitely” semantics.
5. **Escalation is advisory** — router sets `escalation_required` in payload but does not invoke a frontier provider.

## Recommended next steps

Priority order for the highest capability boost:

1. **Wire executor into `serve`** — load YAML, start execution, persist to SQLite, expose live state to dashboard.
2. **CLI `run` / `inspect` / `replay`** — complete Phase 1 exit criteria.
3. **Formalize HITL** — indefinite wait on `ApprovalGate`, webhook/gRPC event on suspend, configurable timeout elsewhere.
4. **Declarative `RetryPolicy`** on `WorkflowNode` in YAML.
5. **OpenTelemetry** — export spans for state transitions and node execution.
6. **Postgres adapter** — when concurrent workflow volume exceeds SQLite comfort zone.

## Architecture roadmap (next phase)

After analyzing the current implementation — stateful execution engine, confidence router, gRPC supervisor, file/in-memory/SQLite state stores, and YAML workflow definitions — the foundation is robust. It addresses LangChain/CrewAI boilerplate bloat and local cyclical state-machine execution pain points.

To move from a robust local IDE hook toward an enterprise-grade multi-agent orchestrator:

### 1. Parallel execution and fan-out / fan-in

Currently the orchestrator traverses the state machine with parallel levels via edge topology. Real-world workflows often need explicit Map-Reduce patterns.

**Implementation path:** extend `NodeKind` and `WorkflowEdge` for parallel forks; spawn `tokio` tasks per branch and collect outputs via channels before converging.

### 2. Production-grade state stores

`FileStateStore` (JSONL) is strong for time-travel debugging locally; hundreds of concurrent workflows need atomic persistence at scale.

**Implementation path:** `PostgresStateStore` via `sqlx` JSONB; `RedisStateStore` for ephemeral high-concurrency tracking.

### 3. Human-in-the-loop (HITL) wait states

The gRPC supervisor pauses on breakpoints and escalation. Formalize this in the workflow definition.

**Implementation path:** `ApprovalGate` suspends indefinitely; fire webhook or gRPC event; wait for `supervisor.resume()` with human payload override.

### 4. Built-in observability and distributed tracing

When cycles fail, tracing explains why.

**Implementation path:** integrate `tracing-opentelemetry`; emit spans for every state transition and node execution (Jaeger, Datadog, etc.).

### 5. Built-in retries with exponential backoff

Before hard escalation via `ConfidenceRouter`, handle flaky LLM API calls natively.

**Implementation path:** `RetryPolicy` (max attempts, backoff) on `WorkflowNode`; executor retries transient failures without bloating state history.

### 6. Live dashboard

Beyond gRPC-only supervision, embed a lightweight web server for real-time DAG visualization.

**Implementation path:** axum HTTP alongside gRPC; WebSocket stream of active DAG execution and payload diffs (dashboard today uses polling).

**Recommended immediate focus:** parallel execution (explicit fork/join) or formal HITL wait states — highest capability boost per effort.
