# Phase 3: Continuous Evolution Loop

**Date:** 2026-06-20
**Bumps:** agent-brain v0.28.0, agent-spine v0.13.0

## Problem

Trajectory logging is one-directional. Spine fires store_trajectory events, brain stores them, nothing happens. Data rots without being used.

## Deliverable A: Enriched trajectory logging

Extend spine's store_trajectory call with richer params:

```rust
pub struct StoreTrajectoryParams {
    pub workflow_id: String,
    pub node_id: String,
    pub outcome: String,
    pub node_kind: String,
    pub model_used: String,
    pub latency_ms: u64,
    pub payload_snapshot: Option<serde_json::Value>,
    pub error_message: Option<String>,
    pub route_log_id: Option<String>,
}
```

Spine derives latency_ms, model_used, and payload_snapshot from existing WorkflowState snapshots.

## Deliverable B: Dataset compilation

### New module

`agent-brain/src/dataset.rs`

### Types

```rust
pub struct DatasetEntry {
    pub instruction: String,
    pub response: String,
    pub workflow_name: String,
    pub node_kind: String,
    pub model: String,
    pub outcome: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub provenance: BrainProvenance,
}
```

### CLI subcommand

```
agent-brain dataset export [--out dataset.jsonl] [--min-confidence 0.8] [--only-successful]
```

### Pipeline

1. Query trajectory table for all completed workflows
2. Cross-reference retrieval_log via route_log_id for original user intent
3. Construct instruction-response pairs:
   - Instruction: context_intent + node description + task_kind
   - Response: model output from payload_snapshot
4. Filter to successful outcomes by default
5. Write JSONL (standard LoRA format for axolotl/unsloth)

### Output format

```jsonl
{"instruction": "Review this code for security vulnerabilities...", "response": "Found 3 issues...", "system": "You are a security reviewer.", "source": "agent-spine:deep-code-review:SecurityReviewer", "model": "claude-sonnet-4-2026-05-15"}
```

## Deliverable C: Dataset statistics

```
agent-brain dataset stats

  Total trajectories: 1,247
  Successful: 1,021 (81.9%)
  Per workflow:
    universal-developer     : 412 entries
    deep-code-review        : 298 entries
  Per model:
    claude-sonnet-4-2026-05 : 612 entries
    gpt-4o                  : 403 entries
```

## Repo changes

| Repo | Change |
|------|--------|
| agent-body-core | No new types |
| agent-brain | New dataset.rs; dataset export/stats CLI; enriched trajectory table |
| agent-spine | Enriched store_trajectory params (latency, model_used, payload_snapshot) |
