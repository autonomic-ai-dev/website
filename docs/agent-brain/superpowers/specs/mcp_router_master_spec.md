# Master Specification & Roadmap: agent-brain

---

## PART 1: Core Router Specification

# Universal Local Context Engine (MCP Router) — Technical Specification

**Version:** 0.3  
**Status:** Draft

## 1. Overview

### North star

Build a **fast MCP server** that makes any host agent perform tasks efficiently by **automatically surfacing the right agents, skills, rules, and memory** — already defined on the machine — under a strict token budget.

The problem today: agents have hundreds of skills, dozens of agent definitions, project rules, and session memory scattered across paths. They either load too much (waste tokens, slow turns) or too little (wrong patterns, repeated mistakes). This router fixes that with one sub-50ms call per turn.

### What the agent gets in one call

```text
User message + CWD
       │
       ▼
  route_task  (< 50 ms)
       │
       ├── recommended_agents  → "use code-reviewer for this PR diff"
       ├── recommended_skills  → "load react-testing, mcp-server-patterns"
       ├── applicable_rules    → project conventions, CLAUDE.md excerpts
       └── relevant_memory     → cross-session facts for this repo
```

### Design goals

| Goal | How |
|------|-----|
| **Fast** | p95 < 50 ms retrieval; turn cache for back-to-back messages (< 5 ms hit) |
| **Efficient** | Hard token cap; return names + rationale first, not full file bodies |
| **Complete** | Index **all** agent, skill, and rule sources on the machine (see §2) |
| **Zero-touch** | Agent calls `route_task` each turn; memory writes at task end only |
| **Local-first** | Embeddings and storage on-device; no cloud for core operation |

### Phase 1 scope (build this first)

Ship a single Rust binary (`agent-brain serve`) with:

1. Index rules, skills, **agents**, and memory from all configured paths
2. **`route_task`** — primary MCP tool; returns ranked agents + skills + rules + memory
3. **`store_memory`** — persist durable facts at task completion
4. Turn cache + eval suite proving speed and retrieval quality

Everything else (sync, federation, automation, visibility CLI) is **Phase 2+** — see **Part 2** of this document and `../VERSIONING.md` for the release roadmap.

**Non-goals (Phase 1):**

- Background transcript listener
- Remote/cloud sync
- Upstream MCP federation
- Replacing host rule systems — this router **discovers and routes** to them

---

## 2. Ecosystem Integration

The router indexes **every agent, skill, and rule** already on the machine. No duplication — read-only sync from source paths.

| Source | Default path | Indexed as |
|--------|--------------|------------|
| Router rules | `~/.agent_brain/rules/` | `rule` |
| Router skills | `~/.agent_brain/skills/` | `skill` |
| Router agents | `~/.agent_brain/agents/` | `agent` |
| Cursor rules | `.cursor/rules/` (walk up to repo root) | `rule` |
| Cursor skills | `~/.cursor/skills-cursor/`, `.cursor/skills/` | `skill` |
| Cursor plugin agents | `~/.cursor/plugins/**/agents/*.md` | `agent` |
| Claude / ECC agents | `~/.claude/agents/`, `~/.codex/agents/` | `agent` |
| Claude / ECC skills | `~/.claude/skills/`, `~/.codex/skills/` | `skill` |
| Project docs | `CLAUDE.md`, `AGENTS.md`, `.cursorrules` | `rule` |
| Project agents | `.cursor/agents/`, `.claude/agents/` (in repo) | `agent` |

**Indexing rules per type:**

| Type | What gets embedded | Metadata extracted |
|------|-------------------|-------------------|
| `agent` | Name + description + first 500 chars of body | `name`, `specialty`, `source_path` |
| `skill` | SKILL.md frontmatter description + title | `name`, `triggers`, `source_path` |
| `rule` | Rule body or .mdc content | `scope`, `globs`, `source_path` |
| `memory` | Atomic fact text | `topic`, `scope`, `scope_key` |

**Sync behavior:**

- Files are hashed (SHA-256); re-index only on content change.
- Each indexed item carries `source_path`, `source_type`, `item_type`, and `scope` (see §4).
- Users opt in to additional paths via `~/.agent_brain/config.toml`.
- Target: index ≥ 500 items (typical dev machine) in < 2 s on warm start.

## 3. Directory Structure

```text
~/.agent_brain/
├── config.toml              # User settings, source paths, token limits
├── rules/                   # Optional local rules (same format as Cursor .mdc)
├── skills/                  # Optional local skills (SKILL.md trees)
├── agents/                  # Optional local agent definitions (*.md)
├── data/
│   ├── brain.db             # SQLite: facts, embeddings metadata, index state
│   └── vectors.bin          # Serialized flat embedding index (see §5.3)
├── logs/
│   └── router.log           # Debug logs; never writes full chat transcripts
└── export/                  # User-initiated memory export (JSON)
```

**Storage model (single source of truth):**

- **`brain.db`** (SQLite via `rusqlite`) stores all atomic facts, document chunks, file hashes, scopes, and embedding row IDs.
- **`vectors.bin`** stores the numeric embedding matrix aligned by row ID with `brain.db`. Rebuilt from DB on corruption or version mismatch.

There is no separate `atomic_facts.json` in the hot path. JSON export is available only via the `export_memory` tool for user backup/inspection.

---

## 4. Data Model

### 4.1 Fact schema (`facts` table)

```sql
CREATE TABLE facts (
  id            TEXT PRIMARY KEY,  -- UUID v4
  topic         TEXT NOT NULL,     -- short label, e.g. "jest-config"
  fact          TEXT NOT NULL,     -- <= 50 words, enforced at write
  scope         TEXT NOT NULL,     -- 'global' | 'project' | 'repo'
  scope_key     TEXT,              -- repo root path or project id; NULL for global
  source        TEXT NOT NULL,     -- 'agent' | 'import' | 'user'
  confidence    REAL DEFAULT 1.0,  -- 0.0–1.0; agent-written defaults to 0.9
  created_at    INTEGER NOT NULL,  -- Unix ms
  updated_at    INTEGER NOT NULL,
  last_used_at  INTEGER,           -- updated on successful retrieval
  expires_at    INTEGER,           -- optional TTL; NULL = no expiry
  content_hash  TEXT NOT NULL,     -- SHA-256 of normalized fact text (dedup)
  superseded_by TEXT,              -- FK to facts.id when replaced
  UNIQUE(content_hash, scope, scope_key)
);
```

### 4.2 Scope rules

| Scope | `scope_key` | Use when |
|-------|-------------|----------|
| `global` | `NULL` | Language preferences, universal conventions |
| `project` | absolute path to repo root | Stack, test runner, deployment target |
| `repo` | same as project (v1); future: monorepo subpath | Package-specific facts within a monorepo |

Retrieval always prefers **narrower scope first** (repo/project over global) when scores are within 0.05 cosine similarity.

### 4.3 Deduplication

On `store_memory`:

1. Normalize text (lowercase, collapse whitespace, strip punctuation for hash only).
2. If `(content_hash, scope, scope_key)` exists → no-op, return existing `id`.
3. If same `topic` + `scope` + `scope_key` with different hash → mark old row `superseded_by = new_id` (latest wins).

### 4.4 Conflict handling

Conflicts are not merged automatically beyond supersession by topic. Example:

- Old: `topic=testing, fact=Use Jest for unit tests`
- New: `topic=testing, fact=Use Vitest; Jest deprecated in this repo`

The new fact supersedes the old. Both remain in DB for audit; only non-superseded rows are retrieved.

### 4.5 Decay and TTL

- Default TTL: **90 days** for `source=agent` facts; no TTL for `source=user` or imported rules/skills.
- Retrieval score includes recency: `recency_boost = 1.0 + 0.1 * (days_since_used < 7)`.
- Expired rows are excluded from search; a nightly compaction job deletes expired rows older than 30 days.

### 4.6 Prohibited content (hard reject)

`store_memory` **must reject** writes containing:

- API keys, tokens, passwords, private keys, connection strings with credentials
- Social security numbers, credit card numbers, or other obvious PII patterns
- File paths under `~/.ssh/`, `*.pem`, `*.key`, `.env` values

Rejected writes return error code `-32001` with a generic message (no echo of the secret).

---

## 5. Protocol & Interfaces

### 5.1 Transport

| Mode | v1 | Notes |
|------|----|-------|
| `stdio` | **Required** | Primary integration for Cursor, Claude Code, etc. |
| Streamable HTTP | Optional | Same JSON-RPC surface; not required for v1 |

Implements MCP lifecycle: `initialize` → `tools/list` → `tools/call`.

### 5.2 Startup behavior

1. Load `config.toml`; create dirs if missing.
2. Open `brain.db`; run migrations if schema version changed.
3. Sync source paths (§2); hash-compare files; enqueue re-embed for changed files.
4. Load `vectors.bin`; if missing, corrupt, or schema mismatch → rebuild from `brain.db`.
5. Ready to serve within **2 s** on warm start (10k indexed chunks); cold embed rebuild may take longer (logged, not blocking reads of cached index).

**File watching (v1):** poll source directories every 30 s; v2 may use `notify` crate for instant re-index.

### 5.3 Vector index format (`vectors.bin`)

```text
Header (32 bytes):
  magic:     [4]  b"ABVI"
  version:   u32  1
  dim:       u32  384          # all-MiniLM-L6-v2
  count:     u32
  reserved:  [16]

Body:
  float32[count * dim]   # row i maps to brain.db embedding row id i
```

Rebuild is always possible from SQLite embedding rows; the file is a performance cache only.

---

## 6. Tools (MCP)

### 6.1 `route_task` (primary — call every turn)

The main entry point. Given a user message and workspace context, returns the **best agents, skills, rules, and memory** for the task — fast enough to run on every turn without noticeable chat lag.

**Latency targets:**

| Path | p95 | When |
|------|-----|------|
| Cache hit | < 5 ms | Same CWD, phase, open files, similar message within 60 s |
| Cache miss | < 50 ms | Full embed + hybrid search (≤ 10k indexed items) |

**Input schema:**

```json
{
  "type": "object",
  "required": ["user_message"],
  "properties": {
    "user_message": {
      "type": "string",
      "description": "The user's latest message or inferred sub-task."
    },
    "current_working_directory": {
      "type": "string",
      "description": "Absolute path to CWD; used for scope and workspace probing."
    },
    "open_files": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Optional; improves routing accuracy."
    },
    "max_tokens": {
      "type": "integer",
      "minimum": 100,
      "maximum": 1500,
      "default": 500,
      "description": "Hard cap on total response size."
    },
    "limits": {
      "type": "object",
      "properties": {
        "agents":  { "type": "integer", "default": 2, "maximum": 3 },
        "skills":  { "type": "integer", "default": 3, "maximum": 5 },
        "rules":   { "type": "integer", "default": 5, "maximum": 10 },
        "memory":  { "type": "integer", "default": 5, "maximum": 10 }
      }
    }
  }
}
```

**Output:**

```json
{
  "recommended_agents": [
    {
      "name": "code-reviewer",
      "path": "~/.claude/agents/code-reviewer.md",
      "rationale": "User asked for PR review; agent specializes in diff analysis.",
      "score": 0.91
    }
  ],
  "recommended_skills": [
    {
      "name": "react-testing",
      "path": "~/.cursor/skills-cursor/react-testing/SKILL.md",
      "rationale": "Task involves failing component tests.",
      "score": 0.84
    }
  ],
  "applicable_rules": [
    {
      "topic": "vitest-conventions",
      "text": "This repo uses Vitest, not Jest. Config in vitest.config.ts.",
      "source_path": ".cursor/rules/testing.mdc",
      "score": 0.87
    }
  ],
  "relevant_memory": [
    {
      "topic": "api-mock-pattern",
      "text": "Use MSW for API mocks in this project.",
      "score": 0.79
    }
  ],
  "must_apply": [
    { "topic": "no-jest", "text": "Do not use Jest in this repo." }
  ],
  "recommended_phase": "debugging",
  "tokens_used": 412,
  "tokens_budget": 500,
  "cache_hit": false,
  "latency_ms": 38,
  "log_id": "uuid"
}
```

**Host integration (any MCP client):**

1. Call `route_task` **before** sending the user message to the model.
2. Load full agent/skill files only for top recommendations (via host-native mechanisms).
3. Inject `applicable_rules`, `relevant_memory`, and `must_apply` into context.
4. If a specialist agent is recommended, delegate via host subagent/task API.

**Turn cache (in-memory, LRU 64 entries):**

- **Key:** `(scope_key, phase, open_files_fingerprint, query_fingerprint)`
- **Invalidation:** `store_memory`, re-index, sync import
- Config: `config.toml` → `[cache] turn_ttl_secs = 60`

---

### 6.2 `get_context`

Retrieve ranked, token-bounded context for the current task. Lower-level than `route_task`; use when you need a single flat list instead of typed sections.

**Input schema:**

```json
{
  "type": "object",
  "required": ["task_description"],
  "properties": {
    "task_description": {
      "type": "string",
      "description": "The user's request or inferred sub-task."
    },
    "current_working_directory": {
      "type": "string",
      "description": "Absolute path to CWD; used for scope and workspace probing."
    },
    "max_tokens": {
      "type": "integer",
      "minimum": 50,
      "maximum": 1000,
      "default": 300,
      "description": "Hard cap on returned payload size (estimated via tiktoken cl100k_base)."
    },
    "include_types": {
      "type": "array",
      "items": { "enum": ["rule", "skill", "agent", "memory"] },
      "default": ["rule", "skill", "agent", "memory"]
    }
  }
}
```

**Output:** JSON string (compact, no markdown wrappers):

```json
{
  "items": [
    {
      "type": "memory",
      "topic": "vitest-setup",
      "text": "This repo uses Vitest; config in vitest.config.ts.",
      "score": 0.87,
      "scope": "project",
      "source_path": null
    },
    {
      "type": "agent",
      "topic": "code-reviewer",
      "text": "Reviews PR diffs for correctness, security, and test coverage.",
      "score": 0.91,
      "scope": "global",
      "source_path": "~/.claude/agents/code-reviewer.md"
    },
    {
      "type": "skill",
      "topic": "react-testing",
      "text": "Use React Testing Library; MSW for network mocks.",
      "score": 0.82,
      "scope": "global",
      "source_path": "~/.cursor/skills-cursor/react-testing/SKILL.md"
    }
  ],
  "tokens_used": 287,
  "tokens_budget": 300,
  "truncated": true
}
```

**Errors:**

| Code | Condition |
|------|-----------|
| `-32602` | Invalid arguments |
| `-32000` | Embedding model failed to load |
| `-32002` | Index empty; returns `{ "items": [], "hint": "No indexed context for this workspace." }` (not a hard error) |

---

### 6.3 `store_memory`

Persist a compact fact. Intended for agent-initiated capture at task completion — not on every turn.

**Input schema:**

```json
{
  "type": "object",
  "required": ["topic", "fact"],
  "properties": {
    "topic": {
      "type": "string",
      "maxLength": 64,
      "description": "Short stable label for dedup/supersession."
    },
    "fact": {
      "type": "string",
      "maxLength": 400,
      "description": "Factual statement; <= 50 words enforced server-side."
    },
    "scope": {
      "enum": ["global", "project", "repo"],
      "default": "project"
    },
    "confidence": {
      "type": "number",
      "minimum": 0.0,
      "maximum": 1.0,
      "default": 0.9
    }
  }
}
```

**Agent guidance (included in tool description):**

> Call once when a task concludes with a durable outcome (bug root cause, project convention, resolved decision). Do not call for transient state. Do not store secrets. Prefer `scope=project` unless the fact applies everywhere.

**Output:**

```json
{ "id": "uuid", "stored": true, "deduplicated": false }
```

**Token cost note:** Tool calls consume model output tokens (typically 30–80 tokens per call). Limit calls to **at most one per completed task** to keep overhead low.

**Errors:**

| Code | Condition |
|------|-----------|
| `-32001` | Prohibited content detected |
| `-32602` | Fact exceeds 50 words or invalid args |

---

### 6.4 `list_memory` (user control)

**Input:** optional `scope`, `scope_key`, `limit` (default 50).

**Output:** array of non-superseded facts with metadata. For transparency and debugging.

---

### 6.5 `delete_memory`

**Input:** `id` (UUID) or `topic` + `scope` + `scope_key`.

**Output:** `{ "deleted": 1 }`. Hard delete; no soft-delete in v1.

---

### 6.6 `export_memory`

**Input:** optional `scope`, `format` (`json` only in v1).

**Output:** path to written file under `~/.agent_brain/export/`.

---

## 7. Decision Engine

### 7.1 Tier 1 — Workspace probing

Before embedding search, infer tags from the workspace rooted at `current_working_directory`:

| Signal | Tags added |
|--------|------------|
| `package.json` | `node`, `npm`/`pnpm`/`yarn`, frameworks detected from deps |
| `pyproject.toml`, `requirements.txt` | `python`, framework (django, fastapi, etc.) |
| `Cargo.toml` | `rust` |
| `go.mod` | `go` |
| `pom.xml`, `build.gradle` | `java`, `kotlin` |
| `Gemfile` | `ruby` |
| `composer.json` | `php` |
| Open / recently modified files (if provided by host) | language + domain tags |

Tags boost retrieval scores by **+0.15** for items whose `topic` or indexed metadata matches.

### 7.2 Tier 2 — Hybrid retrieval

1. **Embed** the query: `task_description` + inferred tags (single string).
2. **Cosine similarity** against all non-superseded, non-expired vectors.
3. **Keyword pass:** BM25 over `topic` + `fact` text (via SQLite FTS5 shadow table).
4. **Combined score:**

```text
score = 0.7 * cosine_sim
      + 0.2 * bm25_normalized
      + 0.1 * recency_boost
      + tag_boost
      + scope_boost   # +0.1 if scope matches CWD repo root
```

5. Sort descending; partition into typed buckets (`agent`, `skill`, `rule`, `memory`).
6. Apply per-type limits (from `route_task.limits` or defaults); serialize as compact JSON.
7. Update `last_used_at` for included fact rows.

**Agent routing boost:** When query contains review/debug/build/plan keywords, boost matching `agent` items by +0.10 (e.g. "review" → agents with review/test/security in name or description).

### 7.3 Token estimation

Use `tiktoken` (`cl100k_base`) for counting. If crate unavailable, fallback: `chars / 4` with 10% safety margin.

---

## 8. Autonomous Memory Capture

### 8.1 v1 — Agent tool calls (sole write path)

Memory writes in v1 come **only** from `store_memory` tool calls initiated by the host agent. The tool description and host system prompt instruct:

- Call **once per completed task** with durable outcomes.
- Never store secrets or transient debugging steps.
- Default to `scope=project`.

Users can disable autonomous capture in `config.toml`:

```toml
[memory]
auto_capture_enabled = true   # host may still call tool; this gates server acceptance
require_user_scope = false    # if true, only scope=project/repo accepted from agent
```

### 8.2 v2 — Background listener (deferred)

A optional local small model (e.g. Llama 3 8B) may passively extract facts from a local transcript stream. **Not in v1** to avoid duplicate writes and undefined merge behavior.

When implemented (v2), merge policy will be:

1. Listener proposes facts → staging table with `confidence`.
2. Facts promoted to `facts` only if no existing row within 0.95 cosine similarity.
3. Agent-written facts always supersede listener facts on same `topic` + `scope`.

---

## 9. Privacy & User Control

Users are not required to manage memory manually, but always retain control:

| Action | Mechanism |
|--------|-----------|
| View stored facts | `list_memory` tool or `export_memory` |
| Delete a fact | `delete_memory` tool |
| Disable auto capture | `config.toml` → `auto_capture_enabled = false` |
| Clear all project memory | `delete_memory` with scope filter (batch) |
| Inspect what was injected | `route_task` response includes `log_id`; debug log records item IDs |

**Logging policy:** `router.log` records retrieval counts, latency, and fact IDs — never user prompts or full chat transcripts.

---

## 10. Recommended Rust Stack

| Crate | Purpose |
|-------|---------|
| `tokio` | Async runtime |
| `rmcp` or `mcp-sdk-rs` | MCP server (stdio transport) |
| `fastembed` | Local `all-MiniLM-L6-v2` embeddings |
| `rusqlite` + `rusqlite_migration` | Facts, FTS5, metadata (WAL mode) |
| `tiktoken-rs` | Token counting |
| `serde`, `serde_json` | Serialization |
| `sha2` | Content hashing |
| `tracing`, `tracing-subscriber` | Structured logging |
| `keyring` | OS keychain for upstream secrets (v1.2) |
| `tree-sitter` + grammars | Tier 0 free AST index (v2.4) |
| `notify` | File watching (v2) |

**First-run:** `fastembed` downloads the embedding model (~80 MB) on first use. Offline installs can pre-seed via `config.toml` → `embedding_model_path`.

---

## 11. Operational Concerns

| Concern | Behavior |
|---------|----------|
| Cold start | Serve reads from last good `vectors.bin`; rebuild embeddings in background |
| Index corruption | Detect via magic/version mismatch; rebuild from SQLite |
| Monorepo | v1: scope to repo root; v2: subpath scopes per `packages/*` |
| Multi-workspace | Each `get_context` call is stateless; scope derived from CWD |
| Multi-agent concurrency | WAL mode + single write queue; reads bypass queue (see extensions §16.5) |
| Resource usage | Target < 150 MB RAM at idle; < 1 CPU core during embed batch |
| Upgrades | Schema migrations in `brain.db`; `vectors.bin` version bump triggers rebuild |

---

## 12. Success Criteria & Eval Plan

### 12.1 Performance targets

| Metric | Target |
|--------|--------|
| `route_task` p95 latency (10k items, warm index, cache miss) | < 50 ms |
| `route_task` p95 latency (cache hit) | < 5 ms |
| Startup to ready (warm, no re-embed) | < 2 s |
| Returned payload size | ≤ `max_tokens` (hard guarantee) |
| Secret leakage in stored facts | 0 (regex + reject suite) |

### 12.2 Retrieval quality

Maintain a fixed eval set (`eval/queries.jsonl`) of at least 50 `(cwd, query, expected[])` tuples where `expected` names the correct agent, skill, or rule topic. Release gate:

- **Recall@3 ≥ 0.85** — expected agent/skill/rule appears in top 3 of its type.
- **Agent routing accuracy ≥ 0.80** — correct specialist agent in top 1 for delegation queries.
- **Token budget compliance = 100%** on all eval queries.
- **Cache hit rate ≥ 30%** on simulated back-to-back turns (same CWD/phase/files).

Run eval in CI on every release tag.

### 12.3 Regression tests

- Dedup: identical fact twice → one row.
- Supersession: same topic new fact → old row superseded.
- Scope preference: project fact ranks above global when scores are close.
- Reject: API-key-shaped strings → `-32001`.
- Truncation: 500 candidate matches → output ≤ `max_tokens`.

---

## 13. Architecture Diagram

```text
┌──────────────── Host Agent (any MCP client) ──────────────────────┐
│  Every turn: route_task → load top agents/skills → execute task  │
│  Task end:   store_memory for durable outcomes                    │
└────────────┬───────────────────────────────┬─────────────────────┘
             │ stdio MCP                     │
             ▼                               │
┌──────────────────────── MCP Router (Rust) ─┴─────────────────────┐
│  ┌─────────────┐   ┌──────────────┐   ┌─────────────────────┐  │
│  │ Sync Layer  │──▶│ brain.db     │◀──│ store_memory        │  │
│  │ agents,     │   │ (facts, FTS, │   │ list/delete/export  │  │
│  │ skills,     │   │  metadata)   │   └─────────────────────┘  │
│  │ rules       │   └──────┬───────┘                            │
│  └─────────────┘          │                                     │
│  ┌─────────────┐   ┌──────▼───────┐   ┌─────────────────────┐  │
│  │ Turn Cache  │◀─▶│ Decision     │──▶│ route_task          │  │
│  │ (LRU, 64)   │   │ Engine       │   │ agents+skills+rules │  │
│  └─────────────┘   └──────┬───────┘   └─────────────────────┘  │
│  ┌─────────────┐          │                                     │
│  │ Workspace   │──────────┘                                     │
│  │ Prober      │          ┌──────────────┐                      │
│  └─────────────┘          │ fastembed +  │                      │
│                           │ vectors.bin  │                      │
│                           └──────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 14. Revision History

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | — | Initial draft |
| 0.2 | — | Unified storage model; full tool schemas; memory policies; privacy controls; eval plan; v1/v2 scope split; ecosystem integration |
| 0.3 | 2026-06-15 | Refocus on fast task routing; `route_task` primary tool; agent indexing; turn cache; Phase 1 scope |


---

## PART 2: Extensions Design

# MCP Router Extensions — Design Document

**Date:** 2026-06-15  
**Status:** Approved (Phase 2+)  
**Builds on:** `mcp_router_spec.md` v0.3  
**Architecture:** Approach 1 — Fat Router (single `agent-brain` binary, modular internals)

> **Version policy:** Release order and version numbers are defined in **`../VERSIONING.md`** (source of truth). Legacy labels in section headings below (e.g. "v1.1", "v1.4") describe module names; see VERSIONING.md for the mapping to 0.x releases.

> **Phase 1 (build first)** is defined in `mcp_router_spec.md` v0.3: a fast MCP that indexes all agents, skills, and rules, exposes `route_task` (< 50 ms), and persists memory via `store_memory`. This document covers **Phase 2+** enhancements layered on top once Phase 1 ships.

---

## 1. Goals & Priorities

Extensions layered on the Phase 1 router, ordered by priority:

| Priority | Layer | Goal |
|----------|-------|------|
| 1 | Context Intelligence | Refine routing: phases, negative memory, feedback loop |
| 2 | Sync & Portability | Personal multi-machine sync; extensible to team/org |
| 3 | Operator Visibility | Inspect what was injected and why |
| 4 | Platform / Federation | Route to upstream MCP servers |
| 5 | Automation | Promote facts to skills; session digests |
| 6 | Graph Intelligence | Local entity/relationship graph; semantic contradiction resolution |
| 7 | Graphify orchestration | Auto-sync codebase knowledge graph into `brain.db` |

**Note:** Phase 1 `route_task` already returns `recommended_agents`, `recommended_skills`, `applicable_rules`, and `relevant_memory`. Phase 2 intelligence adds phase-aware ranking, `must_apply` negatives, and `report_context_useful` — it does not replace `route_task`.

Phase 1 already handles **topic-level** supersession and sync conflict logging. Graph Intelligence (v2.5) adds **entity-linked** contradiction resolution. Graphify orchestration (v2.4) adds **codebase structure** from `graphify-out/graph.json` — a separate concern from session memory (see §10.1).

### Constraints

- **Host-agnostic:** MCP tools only (stdio). No Cursor/Claude-specific hooks in core design.
- **Local-first:** Embeddings, storage, retrieval on-device.
- **Token-budgeted:** Every tool response respects `max_tokens` hard caps from base spec.
- **Sync (v1):** Manual (S1), Git (S2), and encrypted cloud blob (S3) — all supported.
- **Team (future):** Design for personal sync (C1) now; schema ready for C2/C3 without migration.

### Failure modes addressed (Context Intelligence)

| ID | Problem | Primary fix |
|----|---------|-------------|
| A1 | Agent ignores project conventions | Negative memory, convention confidence boost |
| A2 | Wrong skills/rules loaded | `get_skills_for_task`, capped skill payloads |
| A3 | Context fetched too late | `route_task` at start of every turn |
| A4 | Facts not applied at right moment | Phase tags, `apply_when` matching |

---

## 2. Architecture Overview

Single Rust binary: **`agent-brain`**

```text
agent-brain
├── serve          # MCP stdio server (default)
├── sync git       # S2 git push/pull
├── sync cloud     # S3 encrypted blob push/pull
├── export/import  # S1 manual bundle
└── inspect        # Visibility CLI

Internal modules:
├── router/        # MCP protocol, tool handlers
├── intelligence/  # Phase ranking, prepare_turn, skill routing
├── sync/          # Bundle export/import, git, cloud encryption
├── observability/ # Retrieval log, explain, eval
├── federation/    # Upstream MCP client, route_to_mcp
├── ingestion/     # Doc/URL ingest pipeline (v2.3)
├── graph/         # Entity graph, contradiction resolution (v2.5)
└── graphify/      # graphify CLI orchestration + code graph ingest (v2.4)
```

```text
┌────────────── Any MCP Host ──────────────┐
│  Convention: call route_task first         │
└──────────────────┬───────────────────────┘
                   │ stdio MCP
┌──────────────────▼───────────────────────┐
│              agent-brain                  │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ Intelligence│  │ Sync (S1/S2/S3)  │  │
│  │ route_task  │  │ bundle + merge   │  │
│  │ phase rank  │  └──────────────────┘  │
│  └──────┬──────┘                         │
│         │         ┌──────────────────┐  │
│         ├────────▶│ brain.db +       │  │
│         │         │ vectors.bin      │  │
│         │         └──────────────────┘  │
│  ┌──────▼──────┐  ┌──────────────────┐  │
│  │ Observability│  │ Federation       │  │
│  │ retrieval_log│  │ route_to_mcp     │  │
│  └─────────────┘  └────────┬─────────┘  │
└────────────────────────────┼────────────┘
                             │ MCP client
                    ┌────────▼────────┐
                    │ Upstream MCPs   │
                    │ (github, etc.)  │
                    └─────────────────┘
```

**Dependency on base spec:** All extensions assume v0.3 Phase 1 core (`route_task`, `store_memory`, hybrid retrieval, scoped facts, eval suite) is implemented first.

---

## 3. Context Intelligence Layer (v1.1)

### 3.1 Phase 2 enhancements to `route_task`

Phase 1 ships `route_task` in the base spec. Phase 2 adds the following without renaming the tool:

**New optional input:**

```json
"phase": {
  "enum": ["planning", "implementing", "debugging", "reviewing", "unknown"],
  "default": "unknown"
}
```

**New output fields** (added to existing `route_task` response):

- `must_apply` — 1–3 items the agent must acknowledge (negative memory, strong `apply_when` matches)
- `warnings` — e.g. conflicting global/project facts

**Turn cache:** Defined in base spec §6.1; Phase 2 adds `report_context_useful` feedback to adjust cache weighting.

### 3.1.1 `prepare_turn` (deprecated alias)

`prepare_turn` is a **deprecated alias** for `route_task` in Phase 2. New integrations should call `route_task` only. The alias exists for backward compatibility during migration.

### 3.1.2 Latency budget & turn cache

Because `route_task` runs on **every user turn**, it is on the critical path for chat responsiveness. Targets (also in base spec §6.1):

| Path | p95 latency | Notes |
|------|-------------|-------|
| **Cache hit** | < 5 ms | Return pre-built payload from in-memory cache |
| **Cache miss** | < 50 ms | Full embed + hybrid search (10k chunks, warm index) |
| **Cold index rebuild** | Non-blocking | Serve stale cache or empty context; rebuild in background |

**In-memory turn cache (fast path):**

- **Key:** `(scope_key, phase, open_files_fingerprint, query_fingerprint)`
  - `scope_key` — repo root derived from CWD
  - `phase` — inferred or explicit
  - `open_files_fingerprint` — sorted hash of open file paths (empty if none)
  - `query_fingerprint` — first 128 chars of normalized `user_message`, hashed
- **Value:** Serialized `prepare_turn` output + `index_version` at time of cache
- **TTL:** 60 s default; configurable via `config.toml` → `[cache] turn_ttl_secs`
- **Max entries:** 64 (LRU eviction)

**Cache hit conditions (all must hold):**

1. Key match
2. Entry age < TTL
3. `index_version` unchanged (bumps on re-index, `store_memory`, sync import)

**Invalidation triggers:**

- `store_memory` or `import_memory` completes
- Source file sync detects content hash change
- Manual `agent-brain cache clear`

**Response metadata on cache hit:**

```json
{ "cache_hit": true, "latency_ms": 2 }
```

On miss: `{ "cache_hit": false, "latency_ms": 38 }` — logged to `retrieval_log` for observability.

v1.1 release gate adds: `route_task` p95 < 50 ms on eval set with ≥ 30% cache hit rate on simulated back-to-back turns (same CWD, phase, files).

### 3.2 Phase-aware retrieval

**`get_context` extension:** optional `phase` argument:

```json
"phase": {
  "enum": ["planning", "implementing", "debugging", "reviewing", "unknown"],
  "default": "unknown"
}
```

**Index-time:** infer phase tags from rule/skill/fact content (regex + keyword heuristics).

**Score adjustment:**

```text
phase_boost = 0.12 if item.phase_tags contains query.phase else 0.0
```

Added to combined score from base spec §7.2.

### 3.3 Negative memory

**Schema extension (`facts` table):**

```sql
ALTER TABLE facts ADD COLUMN polarity TEXT DEFAULT 'positive';
-- 'positive' | 'negative'
```

Negative facts represent prohibitions: "Do not use Jest", "Never commit .env".

Retrieval always includes matching negative facts in `must_apply` when score > 0.6, even if token budget is tight (reserved slot: up to 50 tokens for negatives).

### 3.4 `apply_when` conditions

**Schema extension:**

```sql
ALTER TABLE facts ADD COLUMN apply_when TEXT;
-- JSON array, e.g. ["phase:debugging", "tag:react", "path:src/components/**"]
```

**Runtime matching:**

| Pattern | Match condition |
|---------|-----------------|
| `phase:*` | Query phase equals suffix |
| `tag:*` | Workspace probe tag present |
| `path:*` | Glob matches any `open_files` entry or CWD-relative path |

**Score adjustment:** `apply_boost = 0.15` when any condition matches.

### 3.5 `get_skills_for_task` tool (optional — prefer `route_task`)

Returns skill **names and one-line rationale only** — not full SKILL.md bodies. In Phase 1, use `route_task.recommended_skills` instead. This tool remains for hosts that want skills-only routing without agents/rules.

**Input:** `task_description`, `current_working_directory`, `limit` (default 3, max 5)

**Output:**

```json
{
  "skills": [
    {
      "name": "react-testing",
      "path": "~/.cursor/skills-cursor/react-testing/SKILL.md",
      "rationale": "Task involves component test failures.",
      "score": 0.84
    }
  ],
  "tokens_used": 45
}
```

Agent reads full skill content only for top 1–2 via host-native skill loading. Caps skill routing payload at 150 tokens.

### 3.6 `report_context_useful` tool

Closes the feedback loop without host hooks.

**Input:**

```json
{
  "item_ids": ["uuid", "..."],
  "useful": true,
  "reason": "optional short string"
}
```

**Effect:**

- `useful=true` → increment weight multiplier (cap 1.5), update `last_used_at`
- `useful=false` → decrement multiplier (floor 0.5), accelerate TTL decay

### 3.7 Convention confidence boost

Facts with `source=user` or `confidence >= 0.95` receive `+0.08` score boost over agent-written facts of equal similarity.

---

## 4. Sync & Portability Layer (v1.2)

### 4.1 Sync bundle format

All sync modes (S1, S2, S3) operate on a **bundle**, never a live `brain.db`:

```text
sync-bundle/
├── manifest.json
├── facts.jsonl
├── vectors.bin          # optional
└── manifest.sig         # present when encrypted
```

**`manifest.json`:**

```json
{
  "schema_version": 1,
  "device_id": "uuid-stable-per-machine",
  "exported_at": 1718448000000,
  "fact_count": 142,
  "includes_vectors": false,
  "checksums": {
    "facts.jsonl": "sha256:...",
    "vectors.bin": "sha256:..."
  }
}
```

### 4.2 S1 — Manual export/import

| Surface | Command / tool |
|---------|----------------|
| MCP | `export_memory`, `import_memory` (new) |
| CLI | `agent-brain export`, `agent-brain import <path>` |

**`import_memory` input:** `bundle_path`, `merge_policy` (`newer_wins` | `keep_local` | `keep_remote`, default `newer_wins`)

**Output:** `{ "imported": 12, "deduplicated": 5, "conflicts_resolved": 2 }`

### 4.3 S2 — Git sync

```bash
agent-brain sync git init      # init repo at ~/.agent_brain/sync/
agent-brain sync git push      # export bundle → commit → push
agent-brain sync git pull      # pull → import → rebuild index
```

**Config:**

```toml
[sync.git]
remote = "git@github.com:user/agent-brain-private.git"
branch = "main"
include_vectors = false   # default; rebuild on pull
auto_push = false       # if true, push after each store_memory (not recommended)
```

**Conflict policy (deterministic):**

1. Identical `(content_hash, scope, scope_key)` → skip
2. Same `topic` + scope, different content → newer `updated_at` wins; loser gets `superseded_by`
3. Equal timestamps → lexicographically larger `device_id` wins

**Conflict audit:** Every auto-resolved overwrite (rules 2 and 3) is appended to `conflict_log` before the loser is superseded. The winning fact is kept live; the loser is recoverable from the log (see §4.3.1). Applies to S1 import, S2 git pull, and S3 cloud pull equally.

### 4.3.1 `conflict_log` table

Preserves overwritten facts so a critical rule dropped by `newer_wins` can be inspected or restored.

```sql
CREATE TABLE conflict_log (
  id              TEXT PRIMARY KEY,
  timestamp       INTEGER NOT NULL,
  sync_source     TEXT NOT NULL,   -- 'git' | 'cloud' | 'manual_import'
  topic           TEXT NOT NULL,
  scope           TEXT NOT NULL,
  scope_key       TEXT,
  loser_id        TEXT NOT NULL,   -- fact id that was superseded
  loser_fact      TEXT NOT NULL,   -- snapshot of fact text at resolution time
  winner_id       TEXT NOT NULL,
  winner_fact     TEXT NOT NULL,
  resolution      TEXT NOT NULL,   -- 'newer_updated_at' | 'device_id_tiebreak'
  restored        BOOLEAN DEFAULT FALSE
);
```

**Retention:** 90 days default; user can restore via CLI before expiry.

**CLI:**

```bash
agent-brain inspect conflicts --last 20
agent-brain sync restore <conflict_log_id>   # re-promotes loser; marks restored=true
```

**MCP `sync_status` extension:**

```json
{
  "unresolved_conflicts": 2,
  "recent_conflicts": [
    {
      "id": "uuid",
      "topic": "test-runner",
      "loser_fact": "Always use Jest for unit tests.",
      "winner_fact": "Use Vitest; Jest deprecated in this repo.",
      "sync_source": "git",
      "timestamp": 1718448000000
    }
  ]
}
```

`recent_conflicts` capped at 5 entries, most recent first.

### 4.4 S3 — Encrypted cloud blob

```bash
agent-brain sync cloud push
agent-brain sync cloud pull
```

**Config:**

```toml
[sync.cloud]
provider = "s3"              # or "rclone" for iCloud/Drive
bucket = "my-brain-backup"
key = "brain-sync.tar.zst.age"
encrypt = true
encryption_key_env = "AGENT_BRAIN_SYNC_KEY"   # or OS keychain reference
```

Single encrypted artifact. No plaintext facts in cloud storage.

### 4.5 Team/org extensibility (C4)

Add nullable columns in v1 migration (unused until team features):

```sql
ALTER TABLE facts ADD COLUMN team_id TEXT;
ALTER TABLE facts ADD COLUMN visibility TEXT DEFAULT 'private';
-- visibility: 'private' | 'team' | 'org'
```

Sync manifest schema v2 will add optional `team_id` filter on import. v1 importers ignore these fields.

### 4.6 MCP tool: `sync_status`

**Output:**

```json
{
  "device_id": "uuid",
  "last_export_at": 1718448000000,
  "last_import_at": 1718350000000,
  "unresolved_conflicts": 2,
  "recent_conflicts": [],
  "git": { "remote": "...", "last_push": "...", "last_pull": "..." },
  "cloud": { "last_push": "...", "last_pull": "..." }
}
```

`recent_conflicts` shape defined in §4.3.1. Git/cloud push/pull remain CLI-only (credentials, long-running).

### 4.7 Cross-machine secret management

Sync bundles **never** contain secret values. Upstream MCP credentials stay on each machine in the OS keychain.

**Sync bundle contains:** secret *references* only:

```json
{
  "secret_refs": [
    { "name": "GITHUB_TOKEN", "used_by": "upstream_mcp.github" },
    { "name": "DATABASE_URL", "used_by": "upstream_mcp.postgres" }
  ]
}
```

**Local storage:** `keyring` crate → macOS Keychain, Windows Credential Manager, Linux Secret Service.

**New machine flow:**

1. User runs `agent-brain sync git pull` (or cloud pull).
2. Server detects missing keychain entries → prints one-time prompt:

```text
Missing secrets for upstream MCP: GITHUB_TOKEN, DATABASE_URL
Run: agent-brain secrets setup
```

3. `agent-brain secrets setup` — interactive TUI, one entry per missing secret, stored in keychain.
4. Subsequent syncs never re-prompt unless new upstream added.

**Runtime resolution:** `config.toml` env values like `${GITHUB_TOKEN}` resolve from keychain first, then process env, then fail with actionable error.

**MCP tool: `secrets_status`**

```json
{
  "configured": ["GITHUB_TOKEN"],
  "missing": ["DATABASE_URL"],
  "stored_in": "keychain"
}
```

See §16.4 for full spec.

---

## 5. Operator Visibility Layer (v1.3)

### 5.1 Retrieval audit log

```sql
CREATE TABLE retrieval_log (
  id             TEXT PRIMARY KEY,
  timestamp      INTEGER NOT NULL,
  query_hash     TEXT NOT NULL,
  phase          TEXT,
  items_returned TEXT NOT NULL,   -- JSON: [{id, type, score, breakdown}]
  tokens_used    INTEGER NOT NULL,
  truncated      BOOLEAN NOT NULL
);
```

**Privacy:** User prompt text is never stored. Only SHA-256 hash of normalized query string.

Retention: 30 days rolling; configurable via `config.toml`.

### 5.2 MCP tool: `explain_last_context`

**Input:** optional `log_id` (defaults to most recent)

**Output:**

```json
{
  "log_id": "uuid",
  "query_hash": "abc123",
  "phase": "debugging",
  "items": [
    {
      "id": "uuid",
      "topic": "vitest-setup",
      "type": "memory",
      "score": 0.87,
      "breakdown": {
        "cosine": 0.72,
        "bm25": 0.08,
        "phase_boost": 0.12,
        "scope_boost": 0.10,
        "apply_boost": 0.0,
        "confidence_boost": 0.0
      }
    }
  ],
  "tokens_used": 287,
  "truncated": true
}
```

### 5.3 CLI: `agent-brain inspect`

| Command | Purpose |
|---------|---------|
| `inspect log --last N` | Recent retrieval log entries |
| `inspect fact <topic>` | Provenance, supersession chain, use count |
| `inspect conflicts --last N` | Sync auto-resolution audit trail; shows loser/winner snapshots |
| `inspect graph <entity>` | Entity subgraph and linked facts (v2.5) |
| `inspect eval` | Run eval set; print Recall@3 and token compliance |

Web dashboard deferred to v2 optional sidecar.

---

## 6. Platform / Federation Layer (v1.4)

### 6.1 Upstream MCP registry

```toml
[[upstream_mcp]]
name = "github"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]
env = { GITHUB_TOKEN = "${GITHUB_TOKEN}" }

[[upstream_mcp]]
name = "postgres"
command = "uvx"
args = ["mcp-server-postgres"]
env = { DATABASE_URL = "${DATABASE_URL}" }
```

At startup: connect to each upstream, call `tools/list`, embed tool name + description into `brain.db` (`upstream_tools` table).

### 6.2 MCP tool: `route_to_mcp`

**Input:**

```json
{
  "upstream_name": "github",
  "tool_name": "search_issues",
  "arguments": { "query": "bug label:vitest" },
  "max_tokens": 500
}
```

**Behavior:**

1. Validate upstream is configured and tool exists.
2. Call upstream via MCP client over stdio.
3. Apply **semantic truncation** to fit `max_tokens` (see §16.1) — never raw string chop.
4. Log call in `retrieval_log` with type `upstream_call`.

**Safety:** Router never auto-executes upstream tools. Agent must call `route_to_mcp` explicitly.

### 6.3 Suggested tools in context

`route_task` and `get_context` may optionally include:

```json
"suggested_tools": [
  {
    "upstream": "github",
    "tool": "search_issues",
    "reason": "Task mentions failing CI on GitHub."
  }
]
```

Capped at 2 suggestions, 80 tokens total.

### 6.4 v1.4 limits

- Max 2 configured upstreams
- No hot reload of upstream config (restart required)
- v2: circuit breakers, upstream health checks, response caching

---

## 7. Automation Layer (v2)

### 7.1 Skill promotion pipeline

**MCP tool: `promote_to_skill`** (agent-initiated)

**Input:** `topic`, `fact_ids[]`, optional `target_name`

**Behavior:**

1. Cluster facts by topic.
2. Generate minimal `SKILL.md` draft.
3. Write to `~/.agent_brain/staging/skills/<name>/SKILL.md`.
4. Return `{ "staging_id": "...", "path": "...", "status": "pending_approval" }`.

**CLI approval:**

```bash
agent-brain promote approve <staging_id>   # moves to ~/.agent_brain/skills/
agent-brain promote reject <staging_id>
```

No autonomous promotion in v1 — user must approve.

### 7.2 Session digest & memory garbage collection (v2)

Weekly CLI (`agent-brain digest --weekly`) clustering recent `retrieval_log` + new facts:

- Conventions learned
- Contradictions resolved
- Low-usefulness items flagged for cleanup
- **GC report:** facts archived/deleted this run (see §16.3)

Optional local model for summarization; falls back to rule-based aggregation.

### 7.4 Autonomous garbage collector (v2)

Runs as part of weekly digest (or `agent-brain gc --dry-run` / `--apply`). Prevents memory rot over multi-year projects. See §16.3 for full algorithm.

### 7.3 CI integration

```bash
agent-brain eval --ci
```

Exits non-zero if Recall@3 < 0.85 or token budget compliance < 100% on eval set from base spec §12.

---

## 8. Doc Ingestion (v2.3)

Separate from Graph Intelligence. Ingests external documentation into the index as rules/skills — no entity extraction required.

### 8.1 MCP tool: `learn_from_url`

**Input:**

```json
{
  "url": "https://docs.example.com/framework/setup",
  "scope": "project",
  "scope_key": "/abs/path/to/repo",
  "max_pages": 5,
  "store_as": "rule"
}
```

**Behavior:**

1. Fetch URL (respect robots.txt; configurable domain allowlist in `config.toml`).
2. Extract main content (readability-style strip nav/ads).
3. Chunk into ≤ 500-token segments; embed and index as `rule` items with `source_path = url`.
4. Return `{ "pages_ingested": 3, "chunks_indexed": 12, "source_url": "..." }`.

**Non-goals:** No automatic `store_memory` facts; no graph extraction. User/agent reviews indexed chunks via `list_memory` / inspect CLI.

### 8.2 Config

```toml
[ingestion]
allowed_domains = ["docs.rs", "vitejs.dev", "react.dev"]
max_fetch_bytes = 5242880   # 5 MB
rate_limit_per_hour = 20
```

Runs off hot path — never blocks `route_task`.

---

## 9. Graph Intelligence (v2.5)

Local alternative to SaaS memory graphs (SuperMemory, Mem0 cloud, Zep). Stores entities and relationships in `brain.db` alongside vector facts — no third-party memory service, no network hop at retrieval time.

### 9.1 Why v2.5 (not Phase 1)

| Factor | Implication |
|--------|-------------|
| **Compute** | Entity extraction needs structured agent input, rule-based parsing, or a local LLM — all add latency or complexity on the write path |
| **Scope** | Phase 1 vector + topic supersession solves ~90% of routing; graph solves the remaining semantic contradictions and relationship queries |
| **Privacy** | Keeping the graph inside `agent-brain` avoids sending proprietary architecture to external memory SaaS |
| **Coupling** | Graph traversal in the same binary as `route_task` enables fast entity-aware boosts without RPC |

### 9.2 What Phase 1 already covers vs what graph adds

| Scenario | Phase 1 / v1.1 | v2.5 Graph |
|----------|----------------|------------|
| Same topic updated | Topic supersession on `store_memory` | Same (unchanged) |
| Sync overwrite | `conflict_log` + newer wins | Same (unchanged) |
| Different topics, same subject ("testing" vs "unit-tests") | Both facts may surface | Entity merge detects shared entity |
| Relationship queries ("what does auth service use?") | Embedding similarity only | Traverse `[Auth] --uses--> [Postgres]` |
| Migration facts ("migrated Jest → Vitest") | Two unrelated facts | Supersede via entity + `replaces` relation |

### 9.3 Schema

```sql
CREATE TABLE entities (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,        -- normalized, e.g. "auth microservice"
  entity_type TEXT,                 -- 'service' | 'tool' | 'framework' | 'pattern' | 'other'
  scope       TEXT NOT NULL,
  scope_key   TEXT,
  created_at  INTEGER NOT NULL,
  UNIQUE(name, entity_type, scope, scope_key)
);

CREATE TABLE relationships (
  id            TEXT PRIMARY KEY,
  entity_a_id   TEXT NOT NULL REFERENCES entities(id),
  relation      TEXT NOT NULL,      -- 'uses' | 'depends_on' | 'replaces' | 'owned_by' | 'configures'
  entity_b_id   TEXT NOT NULL REFERENCES entities(id),
  scope         TEXT NOT NULL,
  scope_key     TEXT,
  source_fact_id TEXT REFERENCES facts(id),
  confidence    REAL DEFAULT 1.0,
  created_at    INTEGER NOT NULL,
  superseded_by TEXT,               -- FK to relationships.id when contradicted
  UNIQUE(entity_a_id, relation, entity_b_id, scope, scope_key)
);

CREATE TABLE graph_enrich_queue (
  id          TEXT PRIMARY KEY,
  fact_id     TEXT NOT NULL REFERENCES facts(id),
  status      TEXT NOT NULL,        -- 'pending' | 'processing' | 'done' | 'failed'
  created_at  INTEGER NOT NULL,
  processed_at INTEGER
);
```

Sync bundles (v1.2) export/import `entities` and `relationships` alongside `facts.jsonl`.

### 9.4 Extraction strategies (three paths, ordered by default)

| Priority | Path | When | Hot path? |
|----------|------|------|-----------|
| 1 | **Structured agent input** | Agent provides `entities[]` / `relations[]` on `store_memory` | Yes — synchronous, no LLM |
| 2 | **Rule-based patterns** | Regex for "X uses Y", "migrated from A to B", "replaced X with Y" | Yes — best-effort |
| 3 | **Async local LLM** | `graph_enrich_queue` processed by optional llama.cpp/ORT worker | No — background only |

**Phase 2.5 ships paths 1 and 2.** Path 3 is optional, config-gated:

```toml
[graph]
enabled = true
async_enrich = false              # set true to enable local LLM queue
local_model_path = ""             # required if async_enrich = true
contradiction_auto_resolve = true
```

### 9.5 `store_memory` extensions

**New optional fields:**

```json
{
  "topic": "auth-db",
  "fact": "Auth microservice uses Postgres for session storage.",
  "entities": [
    { "name": "auth microservice", "type": "service" },
    { "name": "Postgres", "type": "tool" }
  ],
  "relations": [
    { "from": "auth microservice", "relation": "uses", "to": "Postgres" }
  ]
}
```

**Write pipeline:**

1. Store fact (existing flow).
2. Upsert entities (normalize names: lowercase, collapse whitespace).
3. Insert relationships linked to `source_fact_id`.
4. Run **entity-linked contradiction check** (§9.6).
5. If `async_enrich = true` and no structured entities provided → enqueue `graph_enrich_queue`.

### 9.6 Entity-linked contradiction resolution

When a new relationship shares `(entity_a, relation, scope, scope_key)` with an existing non-superseded row but `entity_b` differs:

```text
Existing:  [Auth Microservice] --uses--> [MySQL]
New:       [Auth Microservice] --uses--> [Postgres]
```

**Resolution:**

1. Mark old relationship `superseded_by = new_id`.
2. Mark facts that *only* supported the old relationship with `superseded_by` if newer fact has higher `updated_at`.
3. Append entry to `conflict_log` with `resolution = 'entity_contradiction'`.
4. If new relation type is `replaces` (e.g. Vitest replaces Jest), auto-supersede facts mentioning the replaced entity.

Does **not** replace topic-level supersession — both run; graph catches cases topic dedup misses.

### 9.7 `route_task` graph extensions

**New optional input:**

```json
"include_graph": { "type": "boolean", "default": true }
```

**New output section (token-capped at 80 tokens):**

```json
{
  "related_entities": [
    {
      "entity": "auth microservice",
      "relations": [
        { "relation": "uses", "target": "Postgres", "score": 0.9 }
      ]
    }
  ],
  "graph_warnings": [
    "Fact 'Use MySQL for auth' superseded by entity-linked Postgres relationship."
  ]
}
```

**Retrieval boost:** Facts and rules linked to entities mentioned in the query (via FTS entity name match) receive `graph_boost = +0.10`.

**Latency guard:** Graph traversal limited to depth 1, max 5 entities per turn. Traversal runs only on cache miss; results cached with turn cache key.

### 9.8 MCP tool: `query_graph` (optional, debug)

**Input:** `entity_name`, optional `relation`, `depth` (max 2)

**Output:** Subgraph as JSON for inspect/debug. Not for routine agent use — prefer `route_task.related_entities`.

### 9.9 Eval additions (v2.5 release gate)

Add to `eval/queries.jsonl`:

- **Entity recall:** query mentions "auth service" → Postgres relationship in top 3
- **Contradiction resolution:** ingest Jest then Vitest migration → only Vitest surfaces
- **Latency:** `route_task` with graph enabled still p95 < 50 ms (cache miss)

Target: **entity-linked contradiction accuracy ≥ 0.85** on 20-case eval set.

### 9.10 Non-goals (v2.5)

- Full graph query language (SPARQL, Cypher)
- Passive transcript → graph extraction (see base spec background listener)
- URL/doc ingestion (§8 Doc Ingestion — separate module)
- Neo4j or external graph DB
- Sending graph data to SuperMemory / Mem0 / Zep SaaS

---

## 10. Graphify Orchestration (v2.4)

Shift responsibility for running [graphify](https://github.com/safishamsi/graphify) from the user to `agent-brain`. The Rust server **orchestrates** the existing graphify CLI — it does not reimplement extraction, clustering, or graph building.

### 10.1 Two graphs, one router

| Graph | Source | Purpose | Module |
|-------|--------|---------|--------|
| **Codebase graph** | `graphify-out/graph.json` | Structure: calls, modules, communities, god nodes | v2.4 Graphify |
| **Memory graph** | `store_memory` facts | Conventions: "uses Postgres", "Vitest not Jest" | v2.5 Graph Intelligence |

Both feed `route_task`. Codebase graph answers "how does this code work?"; memory graph answers "what did we decide?"

### 10.2 Design principle: orchestrate, don't duplicate

Graphify already ships:

| graphify feature | CLI | agent-brain uses it |
|------------------|-----|---------------------|
| Post-commit AST rebuild | `graphify hook install` | Wrap + trigger ingest |
| Incremental update | `graphify --update` | Background job queue |
| File watch (code-only) | `graphify --watch` | Optional subprocess; prefer hook for zero-process |
| Query subgraph | `graphify query "..."` | On-demand via `query_codebase` tool |
| MCP server | `graphify --mcp` | Optional upstream in v1.4 federation |

agent-brain adds: **job scheduling**, **`graph.json` → `brain.db` ingest**, and **unified `route_task` output**.

### 10.3 Opt-in per repository

Nothing runs until the user (or agent once) enables it:

```bash
agent-brain graphify enable --repo /path/to/project
agent-brain graphify disable --repo /path/to/project
agent-brain graphify status
```

**Config (`config.toml`):**

```toml
[graphify]
enabled = true
graphify_bin = "graphify"
max_concurrent_jobs = 1
semantic_on_deep_analysis = true
# Budget controls — see §16.2
max_llm_files_per_job = 100
max_estimated_tokens = 500_000        # refuse autonomous jobs above this
require_confirm_above_tokens = 100_000  # agent must pass confirm_token
tier0_treesitter = true               # free AST index on enable
```

Writes `~/.agent_brain/graphify/repos.json` tracking enabled repos and last ingest timestamps.

### 10.4 Automation mode 1 — Git hook (recommended, zero-touch for code)

**User experience:** commit code → graph stays in sync → user never runs graphify manually.

**Flow:**

```text
git commit
    │
    ▼
graphify post-commit hook     (graphify hook install — AST-only, no LLM)
    │
    ▼
graphify-out/graph.json updated
    │
    ▼
hook calls: agent-brain graphify ingest --repo $ROOT   (or local socket ping)
    │
    ▼
brain.db code_graph_* tables updated + embeddings refreshed
```

**Implementation:**

1. `agent-brain graphify enable` runs `graphify hook install` in the repo (graphify appends to existing hook if present — do not replace).
2. Hook append line: `agent-brain graphify ingest --repo "$(git rev-parse --show-toplevel)" --trigger git_hook`
3. Ingest parses `graph.json` only — no LLM, typically < 2 s for incremental AST updates.

**Scope limits (inherited from graphify):** hook rebuilds **code files only**. Doc/image changes still require manual or agent-triggered `--update`. Document this in `graphify status` output.

### 10.5 Automation mode 2 — Agent `trigger_deep_analysis`

For unfamiliar codebases or post-refactor navigation — **agent-initiated**, not silent on every turn (semantic extraction costs LLM tokens).

**MCP tool: `trigger_deep_analysis`**

**Input:**

```json
{
  "repo_root": "/abs/path/to/project",
  "mode": "update",
  "reason": "unfamiliar codebase"
}
```

`mode`: `update` (incremental, default) | `full` (full pipeline, only if no `graph.json` exists)

**Output (immediate — async job):**

```json
{
  "job_id": "uuid",
  "status": "queued",
  "estimated_seconds": 120
}
```

**MCP tool: `graphify_job_status`**

```json
{
  "job_id": "uuid",
  "status": "running",
  "progress": "semantic extraction, chunk 2/5"
}
```

**On completion**, job result includes:

```json
{
  "status": "done",
  "god_nodes": ["AuthModule", "SessionStore", "PostgresAdapter"],
  "communities": 12,
  "nodes": 847,
  "edges": 2103,
  "suggested_questions": ["How does auth reach the database?"],
  "graph_path": "/path/to/graphify-out/graph.json"
}
```

**Agent guidance (tool description):**

> Call when navigating an unfamiliar codebase, after a large multi-file refactor, or when `route_task` code context is empty but the task is code-heavy. Do not call on every turn. Prefer `mode=update` when `graph.json` already exists.

**Implementation:** Background worker runs `graphify --update` or full pipeline; on success calls ingest. Max 1 concurrent job globally.

### 10.6 Automation mode 3 — Idle batch update (optional)

Uses idle CPU time when the user steps away — **off by default**.

**Trigger conditions (all must hold):**

1. Repo has `graphify enable`d
2. No MCP requests to `agent-brain` for `idle_minutes` (default 15)
3. ≥ `min_changed_files` (default 10) modified since last graphify run (tracked via manifest or git status)
4. No graphify job currently running

**Action:** Enqueue `graphify --update` + ingest (same job queue as mode 2).

**Config:**

```toml
[graphify.idle]
enabled = false
idle_minutes = 15
min_changed_files = 10
```

**Note:** Graphify's own `graphify --watch` handles real-time code-only rebuilds but requires a persistent process. Idle mode is a lighter alternative when watch is not running. Do not run both watch and idle mode on the same repo.

### 10.7 Ingest pipeline: `graph.json` → `brain.db`

```sql
CREATE TABLE code_graph_nodes (
  id            TEXT PRIMARY KEY,
  repo_root     TEXT NOT NULL,
  graphify_id   TEXT NOT NULL,
  label         TEXT NOT NULL,
  community_id  INTEGER,
  is_god_node   BOOLEAN DEFAULT FALSE,
  source_file   TEXT,
  file_type     TEXT,
  ingested_at   INTEGER NOT NULL,
  UNIQUE(repo_root, graphify_id)
);

CREATE TABLE code_graph_edges (
  id              TEXT PRIMARY KEY,
  repo_root       TEXT NOT NULL,
  source_id       TEXT NOT NULL,
  target_id       TEXT NOT NULL,
  relation        TEXT NOT NULL,
  confidence      TEXT,           -- EXTRACTED | INFERRED | AMBIGUOUS
  confidence_score REAL,
  ingested_at     INTEGER NOT NULL
);

CREATE TABLE graphify_jobs (
  id          TEXT PRIMARY KEY,
  repo_root   TEXT NOT NULL,
  trigger     TEXT NOT NULL,      -- 'git_hook' | 'agent' | 'idle' | 'manual'
  mode        TEXT NOT NULL,      -- 'update' | 'full' | 'ingest_only'
  status      TEXT NOT NULL,      -- 'queued' | 'running' | 'done' | 'failed'
  started_at  INTEGER,
  finished_at INTEGER,
  error       TEXT,
  result_json TEXT
);
```

**Ingest steps:**

1. Parse `graphify-out/graph.json` + `.graphify_analysis.json` (god nodes, communities).
2. Upsert nodes/edges; prune removed nodes on incremental ingest.
3. Embed god node labels + community names for hybrid retrieval.
4. Bump `index_version` (invalidates turn cache for that repo).

### 10.8 `route_task` integration

When `code_graph_nodes` exist for `current_working_directory` repo root, append token-capped section (max 100 tokens):

```json
{
  "code_context": {
    "god_nodes": ["AuthModule", "SessionStore"],
    "relevant_nodes": [
      { "label": "ValidateToken", "relation": "calls", "target": "SessionStore" }
    ],
    "graph_stale": false,
    "last_ingested_at": 1718448000000
  }
}
```

**Stale detection:** `graph_stale = true` if `graph.json` mtime > last ingest time. Agent may call `trigger_deep_analysis` when stale + code-heavy task.

**MCP tool: `query_codebase`** (on-demand, not every turn)

Wraps `graphify query "<question>" --budget N` against repo's graph. Returns traversal result for deep navigation. Cached 5 min by `(repo_root, query_hash)`.

### 10.9 CLI

```bash
agent-brain graphify enable --repo PATH
agent-brain graphify disable --repo PATH
agent-brain graphify status [--repo PATH]
agent-brain graphify ingest --repo PATH [--trigger manual]
agent-brain graphify run --repo PATH [--update|--full]   # foreground, for debugging
```

### 10.10 Safety & non-goals

**Safety:**

- Never auto-install git hooks without explicit `graphify enable`
- Never run semantic (LLM) extraction on git hook path — AST only
- Graphify jobs never block `route_task` (separate worker thread/process)
- Respect graphify's corpus size gates; agent-brain does not bypass them on full runs

**Non-goals (v2.4):**

- Reimplement graphify extraction, clustering, or visualization
- Replace graphify's MCP server — optionally federate to it in v1.4
- Auto-run full graphify on every file save (too expensive; use hook or idle)
- Merge codebase graph nodes into v2.5 memory `entities` table (keep separate)

### 10.11 Eval additions

- Ingest round-trip: sample `graph.json` → brain.db → god nodes retrievable via `route_task`
- Hook path: simulated commit → ingest completes < 5 s (AST-only fixture)
- `trigger_deep_analysis` does not increase `route_task` p95 latency (jobs off hot path)

### 10.12 Tiered indexing & cold-start budget controls

Prevents autonomous graphify from triggering a costly full-corpus LLM extraction on clone of a 500k-line repo. See §16.2.

**Three tiers:**

| Tier | Engine | Cost | When |
|------|--------|------|------|
| **0** | tree-sitter (in-process) | Free, < 30 s | `graphify enable` — symbols, imports, call graph skeleton |
| **1** | graphify AST | Free | Git hook, incremental code commits |
| **2** | graphify semantic (LLM) | Token spend | `trigger_deep_analysis`, active `open_files` only, or explicit scope |

**Tier 0** populates `code_graph_*` immediately so `route_task` has basic `code_context` on day one without LLM.

**Tier 2 scope limits:**

- Autonomous triggers (idle, hook) **never** run Tier 2.
- `trigger_deep_analysis` defaults to changed files + `open_files` + 1-hop imports — not full repo.
- Full-repo semantic run requires `confirm_token` from `agent-brain graphify estimate --repo PATH`.

**Corpus gates (inherited from graphify + enforced by agent-brain):**

- \> 500 files or \> 2M words → block autonomous full run; suggest subfolder or Tier 0 only.
- Return `{ "blocked": true, "reason": "corpus_too_large", "suggestion": "run on ./src/auth" }`.

---

## 11. Schema migrations summary

All migrations applied in order on startup:

| Version | Changes |
|---------|---------|
| 1 | Base spec `facts`, embeddings, FTS5 |
| 2 | `polarity`, `apply_when`, `team_id`, `visibility` on facts |
| 3 | `retrieval_log` table |
| 4 | `upstream_tools` table |
| 5 | `context_weights` table for `report_context_useful` feedback |
| 6 | `conflict_log` table for sync overwrite audit |
| 7 | `entities`, `relationships`, `graph_enrich_queue` (v2.5) |
| 8 | `code_graph_nodes`, `code_graph_edges`, `graphify_jobs` (v2.4) |
| 9 | `facts_archive`, `secret_refs` (v2.0 GC + v1.2 secrets) |

---

## 12. Build order & release milestones

> **Superseded by `../VERSIONING.md`.** The table below is kept for traceability only. Do not plan releases from this section.

| Legacy label | Original 0.3.x target | **Current target (see VERSIONING.md)** |
|--------------|----------------------|----------------------------------------|
| v0.3 Phase 1 | 0.3.0–0.3.1 | **0.3.x** ✅ |
| v1.1 Intelligence | 0.3.3 | **0.4–0.5** ✅ |
| v1.3 Visibility | 0.3.5 | **0.4** ✅ |
| v1.2 Sync | 0.3.6 | **0.5–0.7** (S3 → **0.7**) |
| v1.4 Federation | 0.3.7 | **0.8** |
| v2.0 Automation | 0.3.4 | **0.10** |
| v2.3 Doc ingestion | 0.3.8 | **0.11** |
| Graph constraints | — | **0.12** |
| ANN vector index | — | **0.13** |
| v2.4 Graphify | 0.3.9 | **0.14** |
| v2.5 Graph intelligence | 0.3.10 | **0.15** |
| Multi-host editors | §13 | **0.9** |
| GA | — | **1.0** |

---

## 13. Host integration guide (H4)

Any MCP client can integrate without host-specific code:

1. **Session start:** Register `agent-brain` as MCP server (stdio).
2. **Every user turn:** Call `route_task` before sending message to model.
3. **Load recommendations:** Use host mechanism to load top 1–2 agents/skills from returned paths.
4. **Inject context:** Append `applicable_rules`, `relevant_memory`, and `must_apply` (Phase 2+) to system or tool context.
5. **Delegate:** If a specialist agent is recommended, invoke via host subagent/task API.
6. **Task end:** Call `store_memory` once for durable outcomes; optionally `report_context_useful` (Phase 2).

Document as `docs/host-integration.md` during v1.1 implementation.

**Graph (v2.5):** Optionally pass `entities` / `relations` on `store_memory` when the agent knows structured relationships. `route_task` surfaces `related_entities` automatically when graph module is enabled.

**Graphify (v2.4):** Run `agent-brain graphify enable` once per repo. Agent calls `trigger_deep_analysis` only for unfamiliar/large-refactor code tasks. Use `query_codebase` for deep graph traversals. Routine commits stay synced via git hook automatically.

---

## 14. Non-goals (this design)

- Background transcript listener (base spec v2)
- Web dashboard (optional v2 sidecar)
- Autonomous skill generation without user approval
- Auto-execution of upstream MCP tools
- CRDT / real-time collaborative sync
- Host-specific hooks (Cursor, Claude Code)
- External memory graph SaaS (SuperMemory, Mem0 cloud, Zep) — replaced by local v2.5 graph module
- Neo4j / dedicated graph database

---

## 16. Production Hardening

Cross-cutting concerns for a bulletproof, multi-agent, multi-machine deployment. These apply across federation, sync, graphify, and memory layers.

### 16.1 Semantic truncation (upstream MCP JSON problem)

**Problem:** Naive string truncation of upstream MCP responses breaks JSON mid-object; the agent fails to parse and crashes.

**Rule:** `route_to_mcp` and any token-bounded upstream response **must** return structurally valid output.

**Algorithm (`truncate_semantic(content, max_tokens)`):**

1. **Detect type:** JSON (parse attempt) → Markdown (heading/list heuristics) → plain text.
2. **JSON array:** Parse; drop items from tail until `token_count(json) <= max_tokens`; re-serialize. Minimum 1 item if any fit.
3. **JSON object:** Strip low-priority keys in order: `body`, `description`, `html_url`, `avatar_url`, `reactions`, `_links`, then truncate long string values, then drop array elements.
4. **Markdown:** Truncate at last complete list item or `##` heading boundary before budget.
5. **Plain text:** Truncate at last complete sentence before budget.
6. **Validate:** Re-parse JSON before return; if invalid, fall back to `{ "truncated": true, "summary": "...", "raw_preview": "..." }` wrapper.
7. **Metadata:** Always include:

```json
{
  "data": { "...valid payload..." },
  "_truncation": {
    "method": "json_array_tail_drop",
    "items_removed": 47,
    "tokens_used": 487,
    "tokens_budget": 500,
    "valid": true
  }
}
```

**Ship in:** v1.4 (Federation layer) — mandatory, not optional.

### 16.2 Cold-start cost avalanche (tiered indexing)

**Problem:** Cloning a massive repo + autonomous graphify trigger → $50+ LLM extraction.

**Fix:** Tiered indexing (§10.12) + hard budget gates.

**tree-sitter Tier 0 (on `graphify enable`):**

- Crates: `tree-sitter` + language grammars for detected repo languages.
- Extract: function/class/method names, import graph, call edges (best-effort).
- Write directly to `code_graph_*` — no graphify subprocess.
- Target: < 30 s for 500k LOC (structure only, no semantics).

**LLM Tier 2 triggers (explicit only):**

| Trigger | Scope |
|---------|--------|
| `trigger_deep_analysis` | `open_files` + git-changed files + 1-hop imports |
| `trigger_deep_analysis --full` | Full repo — requires `confirm_token` from estimate |
| Manual CLI | User-specified path |

**Budget enforcement:**

```toml
[graphify.budget]
max_llm_files_per_job = 100
max_estimated_tokens = 500_000
require_confirm_above_tokens = 100_000
```

**MCP tool: `graphify_estimate`**

```json
{
  "repo_root": "/path",
  "scope": "open_files",
  "estimated_files": 23,
  "estimated_tokens": 45000,
  "requires_confirm": false
}
```

If `estimated_tokens > require_confirm_above_tokens`, `trigger_deep_analysis` must include `confirm_token` returned by estimate.

### 16.3 Memory garbage collection (memory rot)

**Problem:** Superseded positive facts ("Use Jest") linger alongside negatives ("Do not use Jest"), cluttering search and slowing retrieval.

**Fix:** Autonomous GC during weekly digest (`agent-brain gc`) and on-demand.

**GC rules (apply in order):**

| Rule | Action |
|------|--------|
| R1 | `superseded_by IS NOT NULL` and age > 30 days → **archive** to `facts_archive` |
| R2 | Entity-linked contradiction resolved (v2.5) → archive loser facts immediately |
| R3 | Pair: cosine similarity > 0.92, opposing polarity or contradictory entities → keep newer, archive older |
| R4 | `report_context_useful=false` and weight < 0.5 and `last_used_at` > 90 days ago → archive |
| R5 | Expired TTL facts past grace period (base spec) → **hard delete** |

**Archive vs delete:** Archive keeps JSONL export in `~/.agent_brain/archive/facts/YYYY-MM.jsonl` for recovery. Hard delete only for TTL-expired and user `delete_memory`.

**Schema:**

```sql
CREATE TABLE facts_archive (
  id           TEXT PRIMARY KEY,
  archived_at  INTEGER NOT NULL,
  reason       TEXT NOT NULL,   -- 'superseded' | 'contradiction' | 'low_usefulness' | 'gc_dedup'
  snapshot     TEXT NOT NULL    -- full fact row JSON at archive time
);
```

**Post-GC maintenance:** Rebuild affected embedding rows; compact `vectors.bin` if > 20% rows archived.

**Safety:** `agent-brain gc --dry-run` lists candidates; `--apply` executes. Never auto-delete facts with `source=user`.

### 16.4 Cross-machine secret management

**Problem:** S2/S3 sync can't ship plaintext tokens; manual ENV setup on each machine breaks zero-touch.

**Fix:** Keychain-backed secret vault per machine; sync carries references only (§4.7).

**Implementation:**

- Crate: `keyring` with service name `agent-brain`.
- `brain.db` table `secret_refs(name PRIMARY KEY, used_by, created_at)` — names only, never values.
- Sync bundle includes `secret_refs.json`; import checks keychain for each name.
- Missing → `secrets_status.missing` + CLI `agent-brain secrets setup`.
- Upstream MCP spawn resolves `${VAR}` from keychain at runtime.

**One-time prompt UX:** Exactly once per secret per machine. No re-prompt on subsequent syncs.

**Ship in:** v1.2 (Sync layer).

### 16.5 Multi-agent write queue (SQLite concurrency)

**Problem:** Cursor + background Antigravity agent both call `store_memory` or trigger graphify ingest simultaneously → SQLite lock errors, corrupt `vectors.bin` writes.

**Fix:** Read bypass queue; all writes serialized through async task queue.

**Architecture:**

```text
                    ┌─────────────────┐
  route_task ──────▶│ Read pool       │  WAL mode, immediate
  get_context ─────▶│ (sqlite read)   │
                    └─────────────────┘

  store_memory ────▶┌─────────────────┐
  import_memory ───▶│ Write queue     │──▶ single writer task
  graphify ingest ─▶│ (tokio mpsc)    │    (sequential)
  sync pull ───────▶└─────────────────┘
```

**SQLite config:**

```sql
PRAGMA journal_mode=WAL;
PRAGMA busy_timeout=5000;
PRAGMA synchronous=NORMAL;
```

**Write operations queued:**

- `store_memory`, `import_memory`, `delete_memory`
- Graphify ingest (`code_graph_*` upsert + embedding rebuild)
- Sync pull merge
- GC archive/delete
- Vector index rebuild

**Read operations never queued:** `route_task`, `get_context`, `list_memory`, `explain_last_context`.

**Write acknowledgment:**

```json
{ "id": "uuid", "stored": true, "write_id": "w-uuid", "queued_ms": 2 }
```

Optional poll via `write_status(write_id)` for integration tests; MCP callers treat as synchronous (queue drains in < 100 ms under normal load).

**File locks:** `vectors.bin` writes hold same writer lock as DB — no concurrent ingest + embed rebuild.

**Ship in:** v0.3 Phase 1 core (before multi-agent production use).

### 16.6 Production hardening release matrix

| Concern | Section | Target milestone |
|---------|---------|------------------|
| Write queue + WAL | §16.5 | **v0.3** (Phase 1) |
| Semantic truncation | §16.1 | **v1.4** |
| Keychain secrets | §16.4 | **v1.2** |
| Memory GC | §16.3 | **v2.0** |
| Tiered indexing + budget | §16.2 | **v2.4** |

---

## 15. Revision history

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-15 | Initial approved design |
| 1.1 | 2026-06-15 | Turn cache + latency budget; `conflict_log`; align with base spec v0.3 (`route_task` as primary) |
| 1.2 | 2026-06-15 | §8 Doc Ingestion (v2.3); §9 Graph Intelligence (v2.5); schema migration v7 |
| 1.3 | 2026-06-15 | §10 Graphify Orchestration (v2.4); git hook, trigger_deep_analysis, idle mode; schema migration v8 |
| 1.4 | 2026-06-15 | §16 Production Hardening: semantic truncation, tiered indexing, memory GC, keychain secrets, write queue |
| 1.5 | 2026-06-15 | §12 milestones renumbered to incremental 0.3.x; 0.3.2 session hack shipped |


---

## PART 3: Product roadmap index

**Canonical roadmap:** [`../VERSIONING.md`](../VERSIONING.md) — shipped releases, planned 0.7–1.0 feature checklists, exit criteria, and post-1.0 ideas.

This part summarizes version themes only. Detailed specs remain in **Part 2** (sections §3–§10, §16).

### Shipped (summary)

| Version | Theme |
|---------|--------|
| **0.3.x** | Core router, packages, Cursor install, auto-update |
| **0.4.0** | Intelligence + visibility + session digests |
| **0.5.0** | `apply_when`, warnings, Sync S1 |
| **0.6.0** | Sync S2 git, restore, auto_push, cloud config stub |

### Planned (summary)

| Version | Theme | Priority layer |
|---------|--------|----------------|
| **0.7** | Cloud sync S3 + keychain secret refs | Sync (2) |
| **0.8** | Upstream MCP federation (`route_to_mcp`) | Federation (4) |
| **0.9** | Multi-host: Claude Desktop, VS Code, Claude Code/Codex installers | Host integration |
| **0.10** | Automation: promote-to-skill, memory GC, weekly digest | Automation (5) |
| **0.11** | Doc ingestion (`learn_from_url`) | Automation adjunct |
| **0.12** | Local graph constraints (skill/rule dependency edges) | Routing scale |
| **0.13** | Local ANN vector index (sqlite-vec or LanceDB) | Routing scale |
| **0.14** | Graphify orchestration (codebase graph) | Graphify (7) |
| **0.15** | Graph intelligence (entity/relationship memory) | Graph (6) |
| **1.0** | GA: schema freeze, dashboard CLI, benchmarks, hardening | — |

### Post-1.0 ecosystem ideas

Not scheduled to a version — see VERSIONING.md:

1. Visual memory manager (IDE extension / GUI)
2. CI/CD code review enforcer (GitHub Actions + `route_task`)
3. Enterprise knowledge bridges (Notion, Confluence, Slack)
4. Federated multi-agent orchestrator
5. Skill marketplace / team org sync (C4)

---

### Revision history (Part 3)

| Date | Change |
|------|--------|
| 2026-06-15 | Initial product growth section (0.7–1.0 draft) |
| 2026-06-16 | Replaced with index; full roadmap moved to VERSIONING.md; added 0.9 multi-host, 0.12–0.15 graph/vector split |
