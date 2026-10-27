---
title: Cognitive Governor & Procedure Graph (agent-brain)
---

# `agent-brain` — Cognitive Governor & Procedure Graph

`agent-brain` is the local-first cognitive governor, procedure graph, and memory engine for autonomous coding agents. It solves the critical problems of **context window saturation, repeated debugging traps, and rule adherence drift** by actively managing the agent's context under a strict token budget (~500 tokens), backed by an embedded SQLite WAL database (`~/.autonomic/memory/brain.db`), in-memory HNSW vector index, and recursive CTE procedure graph.

```mermaid
sequenceDiagram
    autonumber
    participant Host as "Host Agent (Cursor / Claude / Antigravity)"
    participant Sentry as "route_gate.py & command_policy (Host Guard)"
    participant Governor as "agent-brain (Stdio Proxy & Daemon)"
    participant Graph as "brain.db (SQLite WAL + HNSW + CTE Graph)"

    Host->>Sentry: Invokes MCP / Shell Tool
    Sentry->>Sentry: Checks turn gate & command policy
    alt Pre-Tool Gate Unmet
        Sentry-->>Host: PHYSICAL BLOCK. Forces route_task pre-flight routine
    end
    Host->>Governor: call_tool("route_task", {user_message, cwd, open_files})
    Governor->>Graph: Hybrid RRF (Vector + Lexical + Exact) & Knapsack Packing
    Graph-->>Governor: Top ranked skills + rules + verified recipes (~500 tok)
    Governor-->>Host: Token-budgeted context + must_apply constraints
    Host->>Governor: Executes verified tool / task
    Host->>Governor: agent-brain verify -- <cmd>
    alt Exit 0 (Success)
        Governor->>Graph: Promote procedure edge (procedure_edges) & verified recipe
    alt Non-Zero (Failure)
        Governor->>Graph: Squelch recipe & synthesize TRAP WARNING into must_apply
    end
```

---

## 4 Strategic Pillars

Unlike passive prompt servers or static skill markdown repos, `agent-brain` operates as an active runtime governor:

### 1. Self-Evolving Procedures & Auto-Distillation (The Flight Recorder)
Developers no longer need to manually write `.md` skills for every workflow. When agents explore a codebase, execute commands, patch files, and pass `.verify/run.sh`:
- `agent-brain` automatically captures execution transcripts from Cursor, Claude Code, OpenCode, and Antigravity.
- Passing tool sequences are distilled into state transitions in `procedure_edges` and `workflow_trajectory`.
- On future turns, `recall_procedures` queries the graph via recursive Common Table Expressions (CTEs), surfacing proven execution DAGs rather than generic advice.

### 2. Closed-Loop Negative Reinforcement (Trap Detection & Squelching)
LLMs repeatedly fall into the exact same traps (deprecated flags, slow test commands, broken dependency versions):
- When a command fails during `agent-brain verify` or exits non-zero, its fingerprint is captured into `workflow_trajectory` with status `failure`.
- Broken commands are immediately squelched from few-shot recipe recall.
- Recurrent failure patterns automatically promote into high-priority `TRAP WARNING: DO NOT RUN <X>` directives inside `must_apply`.

### 3. Active Policy Sentry (Host-Level Guardrails)
System prompts and guidelines are routinely ignored by models during long, complex sessions. `agent-brain` enforces physical execution boundaries:
- **Host Pre-Tool Hooks**: `route_gate.py` and `command_policy.rs` physically halt execution if an agent attempts unscouted reads on massive files or invokes dangerous unallowlisted commands (`rm -rf`, `curl | sh`, raw git resets).
- **Tool Scout Guard**: Enforces token-bounded reads (`file_summary`, `read_file_head`, `read_file_tail`, `grep_search`) to prevent context window saturation.

### 4. Universal Cross-Host Neural Bus
Developers switch between Cursor in the IDE, Claude Code in the terminal, Antigravity in agent loops, and GitHub Actions in CI:
- `agent-brain` runs over a unified background daemon on `~/.autonomic/memory/brain.db` in SQLite WAL mode.
- A fix discovered in Claude Code terminal is instantly available to Cursor.
- A verification pass executed in CI populates `verify_outcomes`, giving local agents immediate access to proven recipes.

---

## Procedure Graph & Recall Pipeline

Procedures are stored as state transitions in `procedure_edges`:

```sql
CREATE TABLE IF NOT EXISTS procedure_edges (
    source_workflow TEXT NOT NULL,
    source_node TEXT NOT NULL,
    target_node TEXT NOT NULL,
    transition_count INTEGER NOT NULL DEFAULT 1,
    last_transition_at INTEGER NOT NULL,
    PRIMARY KEY (source_workflow, source_node, target_node)
);
```

### Recursive CTE Procedure Traversal

When recalling procedures, `agent-brain` executes a multi-hop recursive CTE to discover optimal execution sequences:

```sql
WITH RECURSIVE walk(node_id, depth) AS (
    SELECT ?2, 0
    UNION ALL
    SELECT e.target_node, walk.depth + 1
    FROM procedure_edges e
    JOIN walk ON e.source_node = walk.node_id
    WHERE e.source_workflow = ?1
      AND walk.depth < ?3
)
SELECT DISTINCT node_id FROM walk WHERE depth > 0;
```

### Retrieval Hierarchy (`recall_procedures`)

The recall pipeline combines three tiers of precision:
1. **Tier 1 (Exact Match)**: Exact query match on `node_id` or `workflow_id`.
2. **Tier 2 (FTS5 Lexical Search)**: Full-text indexing over procedure notes and command strings.
3. **Tier 3 (ANN Semantic Fallback)**: In-memory HNSW cosine similarity across procedure embeddings.

Candidate items are scored using success-weighted fusion (`score = base_score + 0.2 * success_rate`), and each result includes its forward execution graph (`next_nodes`).

---

## Token Knapsack Packing & Bounded Reads

To prevent context saturation, `agent-brain` employs a dynamic knapsack algorithm that scales budget by task kind:

| Task Kind | Budget | Focus |
| :--- | :--- | :--- |
| **Verification** | 350 tokens | Exit codes, failing assertion lines, target command |
| **Review** | 550 tokens | Review finding baseline, diff constraints, invariants |
| **Implementing** | 600 tokens | Playbook steps, active skills, verified recipes |
| **Debugging** | 650 tokens | Traps to avoid, related failure patterns, reproduction steps |
| **Architecture** | 700 tokens | Dual-engine topology, persistence boundaries, ADR records |

---

## CLI & MCP Tool Reference

### MCP Tools
| MCP Tool | Arguments | Description |
| :--- | :--- | :--- |
| **`route_task`** | `user_message`, `current_working_directory`, `open_files` | Required pre-flight turn routing under token knapsack budget. |
| **`recall_procedures`** | `query`, `task_kind`, `limit` | Walks the procedure graph to return proven execution DAGs. |
| **`store_memory`** | `topic`, `fact`, `scope`, `confidence` | Commits immutable durable memory (max 50 words). |
| **`file_summary`** | `path` | AST summary of types, functions, and exports (no full read). |
| **`grep_search`** | `query`, `path`, `regex` | Bounded grep search with line-range limits. |
| **`read_file_head`** | `path`, `lines` | Bounded read of first N lines. |
| **`read_file_tail`** | `path`, `lines` | Bounded read of last N lines. |

### CLI Commands
```bash
# Verify a command and record outcome into brain.db
agent-brain verify -- cargo test

# Recall procedure graph for a task
agent-brain recall-procedures "fix compiler error in lib.rs"

# View real-time cognitive governor dashboard (tokens saved, blocks, recipes)
agent-brain dashboard

# Add a package with recursive discovery (nested .claude/skills, .agents/skills)
agent-brain package add nextlevelbuilder/ui-ux-pro-max-skill

# Run diagnostic health check on SQLite WAL and vector embeddings
agent-brain doctor
```
