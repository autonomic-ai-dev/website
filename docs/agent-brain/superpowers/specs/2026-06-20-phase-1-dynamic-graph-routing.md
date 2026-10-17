# Phase 1: Dynamic Graph Routing

**Date:** 2026-06-20
**Bumps:** agent-brain v0.26.0, agent-spine v0.11.0

## Problem

No path from vague user intent ("update the database schema") to executing the correct workflow. Brain has semantic understanding but no awareness of spine's available workflows.

## Deliverable A: Brain indexes spine workflows

### New module

`agent-brain/src/workflow_indexer.rs`

### Indexing flow

1. During `agent-brain index`, scan `workflows/*.yaml` in the workspace
2. Parse: name, description, nodes[], start_node
3. Store each workflow as an `indexed_items` row with `item_type = "workflow"`:
   - Metadata: workflow_path, workflow_name, node_count
   - Description text indexed by FTS5 for BM25 matching
4. Add `ItemType::Workflow` variant to agent-body-core

### Config extension

Add `workflow_dirs: Vec<PathBuf>` to config (default: ["workflows"]). Scanned during indexing passes.

## Deliverable B: route_task returns workflow triggers

When BM25/ANN scores a workflow entry as high-confidence:

```
route_task("migrate the database to postgres")
-> ScoredItem { item_type: Workflow, score: 0.89,
    metadata: { workflow_path: "workflows/database-migration.yaml" } }
```

### New types in agent-body-core

```rust
pub enum MustApplyKind {
    Rule(String),
    Skill(String),
    Agent(String),
    Memory(String, String),
    TriggerWorkflow(WorkflowTrigger),
}

pub struct WorkflowTrigger {
    pub workflow_path: String,
    pub workflow_name: String,
    pub context_payload: Option<serde_json::Value>,
}
```

## Deliverable C: Spine auto-starts triggered workflows

### In BrainRouter

1. After route_task call, scan must_apply for TriggerWorkflow entries
2. If found, resolve workflow_path (relative to workspace root or spine workflows/ dir)
3. Call WorkflowManager::submit() with the definition and context_payload
4. Log provenance: _brain_triggered: true, _trigger_confidence: score

### Boundary cases

| Scenario | Behavior |
|----------|----------|
| No match (low confidence) | Normal route_task response, no trigger |
| Multiple workflows match | Return top-3, spine selects first |
| Workflow YAML moved/deleted | Reindex prunes stale entries |
| User explicitly names workflow | BM25 exact match, near-1.0 confidence |
