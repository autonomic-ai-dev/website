# Orchestrator contract (agent-brain v0.23+)

This document defines the **programmatic bridge** between `agent-orchestrator` and `agent-brain`. IDE agents continue to use **MCP** (`route_task` over stdio). Orchestrators should use **gRPC** for lower latency, typed contracts, and batch-friendly integration.

## Transport

| Consumer | Transport | Entry point |
|----------|-----------|-------------|
| Cursor / Codex / Claude Code | MCP stdio | `agent-brain serve` |
| agent-orchestrator | **gRPC** | `agent-brain grpc serve --addr 127.0.0.1:7842` |

Proto source: `agent-brain/proto/agent_brain/v1/routing.proto`

Generated Rust package: `agent_brain::grpc::pb`

## Service: `RoutingService`

### `RouteTask`

**Request** (`RouteTaskRequest`):

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `user_message` | string | yes | Node intent / user turn text |
| `current_working_directory` | string | no | Repo or workspace root |
| `open_files` | string[] | no | Active editor paths |
| `max_tokens` | uint32 | no | Default 500 |
| `limits` | `RouteLimits` | no | Per-type caps; zero object = defaults |
| `phase` | string | no | Overrides inferred phase |
| `task_kind` | `TaskKind` enum | no | See below; inferred from message when unset |

**`TaskKind` values:** `implementing`, `verification`, `debugging`, `review`, `architecture`

**Response** (`RouteTaskResponse`):

All existing MCP `route_task` fields, plus:

| Field | Type | Purpose |
|-------|------|---------|
| `task_kind` | `TaskKind` | Resolved kind (explicit or inferred) |
| `route_confidence` | double | 0.0–1.0 retrieval confidence |
| `escalate_recommended` | bool | Orchestrator should pause / HITL when true |
| `context_bundle` | `ContextBundle` | Partitioned payload for workflow nodes |

**`ContextBundle`:**

| Partition | Source |
|-----------|--------|
| `team_rules` | `applicable_rules` |
| `negative_memory` | negative-polarity / anti-pattern memories |
| `skill_docs` | `recommended_skills` |
| `agents` | `recommended_agents` |
| `observations` | `obs/*` synthesized facts |

### `Health`

Returns `{ version, ready }` for orchestrator `doctor` checks.

## Task-kind retrieval policy

When `task_kind` is set (or inferred), agent-brain tightens limits before scoring:

| `task_kind` | Policy |
|-------------|--------|
| `verification` | Fewer agents/skills; more rules; memory cap 3 |
| `architecture` | More agents/skills; memory cap 3 |
| `review` | Moderate agents/skills; rules boosted |
| `debugging` | Memory cap up to 6 |
| `implementing` | Default limits |

## Escalation signal

`escalate_recommended = true` when:

- `route_confidence < 0.45`, or
- `task_kind == verification` and both `relevant_memory` and `applicable_rules` are empty

Orchestrator v0.2 should pause the workflow node and surface HITL when this is set.

### `StoreTrajectory` (MCP)

Record workflow node outcomes for learning loops. **Does not** require `route_task` in the same turn.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `workflow_id` | string | yes | Orchestrator workflow run id |
| `node_id` | string | yes | Workflow node name |
| `outcome` | string | yes | `success`, `failure`, `escalated`, or `skipped` |
| `route_log_id` | string | no | Links to `route_task` `log_id` / `retrieval_log.id` |
| `task_kind` | string | no | Resolved task kind for the node |
| `notes` | string | no | Max 50 words |

Returns `{ trajectory: { id, workflow_id, node_id, outcome, route_log_linked } }`.

When `route_log_id` is set, it must exist in `retrieval_log` (from a prior successful `route_task`).

## MCP parity

MCP `route_task` accepts the same optional `task_kind` string and returns the same bridge fields in JSON. Orchestrator code should prefer gRPC; MCP remains the human/IDE path.

## Versioning

- Orchestrator MUST pin `agent-brain >= 0.23.0` for bridge fields; `>= 0.24.0` for `store_trajectory` and fact lineage.
- Proto package `agent_brain.v1` is stable for v0.23–v0.24; breaking changes bump `v2`.
- Run `agent-brain grpc serve` Health RPC to verify version before workflow execution.

## Example (grpcurl)

```bash
agent-brain grpc serve --addr 127.0.0.1:7842

grpcurl -plaintext -d '{
  "user_message": "verify BEAM proofs pass in CI",
  "task_kind": "TASK_KIND_VERIFICATION",
  "max_tokens": 500
}' 127.0.0.1:7842 agent_brain.v1.RoutingService/RouteTask
```
