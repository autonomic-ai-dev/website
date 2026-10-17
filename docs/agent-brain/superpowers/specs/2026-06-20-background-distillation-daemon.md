# Background Distillation Daemon (agent-heart)

## Problem

agent-brain's memory vector index accumulates overlapping, stale, and low-confidence facts over time, degrading retrieval quality. The roadmap calls for a background daemon (`agent-heart`) to periodically compress and deduplicate the vector store.

## Approach

**Thin scheduler (Option A).** agent-heart runs as a lightweight cron daemon and calls agent-brain for all compression/dedup logic. The brain owns its SQLite schema and vector format — heart only triggers operations and reports results.

## Architecture

```
agent-heart serve
  ├── cron scheduler loop (tokio timer)
  │    └── on tick → MCP call (`brain_gc`)
  └── MCP server
       └── `heart_trigger_gc` tool → calls brain_gc → returns stats
```

agent-heart spawns agent-brain as a child process in `serve` mode, connected via MCP stdio. Optionally configurable to point at an already-running brain via TCP.

## Components

### agent-heart (new Rust project)

**Config** (`~/.config/agent-heart/config.yaml`):
```yaml
schedule:
  cron: "0 3 * * *"    # daily at 3am
  enabled: true
brain:
  mcp_mode: stdio       # stdio | tcp
  mcp_url: null         # required if tcp mode
  binary_path: /usr/local/bin/agent-brain
logging:
  level: info
  file: null
```

**CLI commands:**
- `agent-heart serve` — start daemon (MCP server + cron loop)
- `agent-heart gc` — one-shot GC, run and exit
- `agent-heart status` — check if daemon is running, last GC timestamp

**MCP tools (serve mode):**
- `heart_trigger_gc {} → {ok, stats}` — on-demand GC
- `heart_status {} → {running, last_gc, next_gc}` — daemon health

**Scheduler:** Uses `tokio-cron-scheduler` crate. Parses cron expression from config, sleeps until next tick, fires brain_gc, logs result.

### agent-brain additions

**New MCP tool:** `brain_gc`
- Parameters: `min_confidence` (f64, default 0.3), `max_age_days` (u64, default 90)
- Operations:
  1. **Fact dedup**: Query active facts, group by topic. For exact/near-exact content matches within the same topic, mark the older fact as invalid (`invalid_at = now`). Also check `fact_lineage` for synthesized facts whose source facts were invalidated.
  2. **Index dedup**: Query indexed items with embeddings, group by topic. Compare cosine similarity within each group. For pairs above threshold (default 0.95), remove the older item.
  3. **Low-confidence prune**: Set `invalid_at` for facts below `min_confidence`.
  4. **Stale index prune**: Remove indexed items whose source path no longer exists.
  5. **SQLite VACUUM**: Reclaim space after deletions.
- Returns stats: `{facts_deduped: u64, facts_removed: u64, index_items_removed: u64, bytes_reclaimed: u64}`

**Existing components leveraged:**
- `distill.rs` — ARCHITECTURE.md generation (not part of GC pipeline but related)
- `store.rs` — `store_fact` already deduplicates on insert (inline). New scan-based dedup is complementary (catches cross-session overlaps).
- `store.rs` — `fact_lineage` table can be queried to find synthesized facts whose source facts were invalidated.

## Data Flow

```
1. Cron tick (or CLI/MCP trigger)
2. agent-heart spawns `agent-brain serve` (if not running)
3. MCP call: `brain_gc(min_confidence: 0.3, max_age_days: 90)`
4. agent-brain:
   a. Loads all active facts + indexed items with embeddings
   b. Groups by topic → text hash dedup (facts) + cosine similarity dedup (indexed items)
   c. Marks old duplicate facts as invalid
   d. Removes duplicate indexed items
   e. Prunes low-confidence facts
   f. Prunes stale indexed items
   g. VACUUM
   h. Returns stats
5. agent-heart logs stats, reports via MCP response
6. If agent-heart spawned brain, shuts it down after timeout
```

## Scheduling

- Cron expression in config (default `0 3 * * *` = daily 3am)
- On-demand trigger via MCP tool (used by agent-spine for pre-run GC)
- CLI one-shot (`agent-heart gc`)
- Runs are idempotent — no state is tracked across runs beyond the GC timestamp

## Success Criteria

- Covers the roadmap item: "Expose hooks for agent-heart to trigger nightly cron jobs that compress and deduplicate agent-brain vectors"
- Dedup scan catches at least obvious duplicates (same topic, >0.95 cosine similarity)
- GC runs in <30s for typical fact counts (<10k facts)
- Agent-heart correctly manages brain lifecycle (spawn on demand, shut down when idle)
- Both cron and on-demand trigger paths work
