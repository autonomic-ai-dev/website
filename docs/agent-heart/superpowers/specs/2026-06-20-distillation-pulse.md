# Distillation Pulse — Phase 2 Design

## Overview

Extend agent-brain's `distill` command with cluster analysis: find groups of semantically similar indexed items via cosine similarity, create a summary fact per cluster, and supersede the originals. agent-heart calls `agent-brain distill clusters` as a subprocess (same pattern as `gc`).

## Components

### 1. agent-brain: `distill clusters` CLI

**Location:** `agent-brain/src/distill.rs` (extend existing module)

**Command:** `agent-brain distill clusters [--threshold 0.95] [--dry-run]`

**Algorithm:**
1. Load all `indexed_items` that have non-NULL `embedding`
2. Group items by `topic`
3. For each topic with ≥2 items:
   a. Decode embeddings (`bytes_to_f32`)
   b. Compute pairwise cosine similarity for all pairs
   c. Build a union-find cluster: any two items with `cos > threshold` belong to the same cluster
   d. For each cluster with ≥2 items:
      - Combine text content of all cluster members
      - Create a new fact via `store_fact` with: `topic = cluster topic`, `fact = combined text`, `confidence = max(0.95, max member confidence)`, `scope/scope_key` from the cluster
      - Mark each original item's corresponding fact as superseded via `invalidate_fact`
4. Output JSON stats

**Stats output:**
```json
{
  "clusters_found": 5,
  "items_clustered": 12,
  "facts_created": 5,
  "items_superseded": 12,
  "dry_run": false,
  "threshold": 0.95
}
```

**Flags:**
- `--threshold <float>` — cosine similarity threshold (default 0.95)
- `--dry-run` — report what would be done, make no changes

### 2. agent-brain: main.rs wiring

Route `distill` with subcommand dispatch:
- `distill arch` — existing behavior (write ARCHITECTURE.md, `--out` flag)
- `distill clusters` — new cluster distillation
- No subcommand given — default to existing behavior (backward compat)

### 3. agent-heart: `distill` CLI

**Location:** `agent-heart/src/`

**Command:** `agent-heart distill [--threshold 0.95] [--dry-run]`

- Calls `agent-brain distill clusters` as subprocess via `BrainHandle`
- Prints JSON stats to stdout

**New method on BrainHandle:**
```rust
pub async fn call_distill(&self, threshold: f64, dry_run: bool) -> Result<Value>
```

### 4. agent-heart: cron integration (future)

The existing cron job can be extended with a `distill` entry. Deferred to keep Phase 2 scoped to the core algorithm.

## Data Flow

```text
agent-heart distill
  → find agent-brain binary
  → subprocess: agent-brain distill clusters --threshold 0.95
  → agent-brain loads indexed_items with embeddings
  → agent-brain groups by topic, computes pairwise cosine
  → agent-brain builds union-find clusters
  → agent-brain stores summary facts, invalidates originals
  → agent-brain prints JSON stats to stdout
  → agent-heart prints stats
```

## Error Handling

- If agent-brain binary not found: same error as `gc` (clear message)
- If no items with embeddings: `{"clusters_found": 0, ...}` (not an error)
- `invalidate_fact` failure for individual items is logged but non-fatal (partial success)

## Testing

- `cargo test --release -p agent-brain` (existing test suite)
- Manual: `agent-brain distill clusters --dry-run` on a populated brain.db

## Files Changed

| File | Change |
|------|--------|
| agent-brain/src/distill.rs | Add `cluster_and_summarize()` and `ClusterStats` |
| agent-brain/src/main.rs | Add "clusters" subcommand routing |
| agent-heart/src/brain_client.rs | Add `call_distill()` |
| agent-heart/src/main.rs | Add `distill` CLI subcommand |
| agent-heart/src/lib.rs | Add `run_distill_once()` |
