# Next-Level Roadmap: agent-brain

Strategic reference for evolving agent-brain from a local router into a context & memory engine.

---

## Philosophy

| Layer | Owner | Role |
|-------|-------|------|
| **Information** | agent-brain | Route ~500 tokens of the right skills/rules/memory per turn |

Hooks (`route_gate.py`) stay a **token gate only** — not a workflow runtime.

---

## V1 status (agent-brain v0.22.0)

### Shipped

- SQLite-native temporal KG (`valid_from` / `invalid_at`, `memory_kg_edges`)
- ADD-only `store_memory` with evolution links
- Multi-signal retrieval (semantic + BM25 + lexical + entity)
- Filterable HNSW (embedded, scope-aware)
- Observation engine (`obs/{topic}` from recurring facts)
- Trace extraction (Mem0-inspired, shell/config heuristics)
- BEAM eval harness (`eval --beam`, in `proofs --ci`)
- Temporal MCP params on `store_memory`

### Architectural decisions (locked)

- **Graph:** Native SQLite node/edge + recursive CTEs — no Kùzu/Indradb (zero-setup, single binary).
- **Integration:** MCP over stdio; orchestrator is MCP *client* of agent-brain.

---

## Context Delegation Strategy

### The Two-Tiered Delegation Strategy (IDE Agent vs agent-spine)

We do not force *every* IDE action through `agent-spine`. Imposing a rigid YAML workflow for a single-line typo fix is an anti-pattern. Instead, `agent-brain` manages context-aware delegation:

- **Tier 1 (Ad-hoc tasks):** For simple edits (e.g., typos, isolated refactors), `agent-brain` allows the IDE agent (Cursor/Claude) to edit files directly based on retrieved conventions.
- **Tier 2 (Complex/Multi-file tasks):** For architectural changes or risky operations, `agent-brain` detects the scope and returns a strict `must_apply` constraint: *"DO NOT edit files directly. You must trigger a workflow via the `agent-spine` CLI."* 
  
In Tier 2, the IDE agent stops being a "coder" and becomes a "Project Manager", formulating the payload, triggering the `agent-spine` execution, and waiting for the orchestrated pipeline to finish.

---

## Phased roadmap

### agent-brain v0.23 — Orchestrator bridge

**Goal:** Stable MCP contract for external orchestrator.

- `route_task` input: optional `task_kind` (`implementing` | `verification` | `debugging` | `review` | `architecture`).
- `route_task` output: `route_confidence`, `escalate_recommended`, `context_bundle`, `recommended_workflows`.
- Per-`task_kind` retrieval policy (tighter limits for verification, etc.).
- Trace extract v2: `why_extracted` metadata, more patterns, `memory extract --explain`.
- BEAM: real-transcript fixtures + `task_scoped` suite.
- **Publish** `docs/orchestrator-contract.md` in agent-brain repo (technical API).

### agent-brain v0.24 — Learning loop

- `store_trajectory` MCP (workflow_id, node_id, outcome, route_log_id link).
- Observation / trace lineage back to source facts.
- BEAM: `escalation_signal`, `task_scoped_verification` suites.

---

## Upcoming Feature: Workflow Registry Integration

We will enhance the `agent-brain` skill registry to automatically discover, index, and route `agent-spine` YAML workflows just like it does with `SKILL.md` files. This allows the context engine to actively recommend specific workflows back to the IDE agent or the orchestrator.

### Proposed Architecture Changes

**1. `types.rs`**
- Add `ItemType::Workflow` to the core enum and implement `parse`/`as_str`.
- Add `workflows: usize` to `RouteLimits` (default 2).
- Create a new `WorkflowRec` struct (identical shape to `SkillRec`).
- Update `RouteTaskResponse` to include `pub recommended_workflows: Vec<WorkflowRec>`.
- Update `ContextBundle` to include `pub workflows: Vec<WorkflowRec>`.

**2. `packages/mod.rs`**
- Update `discover_package_roots` to scan for `"workflows"` and `".agent-spine/workflows"` directories when registering packages.

**3. `index.rs`**
- Update `parse_file` to detect workflow definitions. If a path contains a `workflows` directory and ends with `.yaml` or `.yml`, it will extract the YAML `name` and `description` to build the `topic` and `text` for the indexer. It will return `ItemType::Workflow`.

**4. `engine.rs`**
- Update `RouteBuildState` to track `seen_workflows`.
- Update `build_route_response` and `try_add_route_item` to match `ItemType::Workflow`, format it into a `WorkflowRec`, and append it to the response budget.

---

## Future Evolution Visions

Beyond the immediate roadmap, the following features represent the ultimate evolution of `agent-brain` as an autonomous intelligence layer:

### 1. Trajectory & Fine-Tuning Pipeline
**The Vision:** Once an orchestrator (`agent-spine`) finishes a workflow, it calls `store_trajectory` with the exact transcript of what the agent did and whether it passed the tests.
**The Evolution:** `agent-brain` compiles these successful trajectories into a dataset to fine-tune local models (e.g., Llama 3) specifically on your codebase's patterns, continually raising the baseline intelligence of local agents.

### 2. Proactive Background Indexing
**The Vision:** Currently, `agent-brain` reacts to user prompts.
**The Evolution:** Run a background thread that continuously analyzes `git diffs` and code changes, automatically updating its rules, discovering new architectural patterns, and extracting "implicit" skills without a human ever asking it to.

### 3. Unified Ecosystem Installer
**The Vision:** Installing two separate repositories (`agent-brain` and `agent-spine`) creates friction for new users.
**The Evolution:** Rather than coupling the binaries directly, provide a single universal bash installer (e.g., `curl -sL https://install.agent-ecosystem.sh | bash`) that installs both binaries and automatically bridges them over MCP.

### 4. Auto-Wire IDE Configs
**The Vision:** When `agent-brain` updates, non-Cursor IDEs (like Claude Code and Gemini) often "forget" to use the newest version because their static configuration files are out of sync.
**The Evolution:** Whenever `agent-brain` runs a background update, it should automatically scan the user directory for IDE configuration files (e.g., `claude_desktop_config.json`) and silently patch them so the user never has to manually run `install` or `doctor --fix` to enforce the new routing rules.

### 5. AST-based Understanding (Tree-sitter)
**The Vision:** `agent-brain` currently relies on Vector Embeddings (semantic meaning) and BM25 (keyword matching).
**The Evolution:** Integrate a parser like Tree-sitter. Instead of guessing what code is relevant, `agent-brain` reads the Abstract Syntax Tree. If a user modifies `FunctionX`, it programmatically finds every file that imports `FunctionX` and feeds them to the model automatically.

### 6. Background Memory "Distillation"
**The Vision:** Over time, `agent-brain` collects thousands of tiny, fragmented facts about the codebase.
**The Evolution:** Build a nightly background job that uses a fast, cheap model to "distill" all collected facts into a perfectly formatted, high-signal `ARCHITECTURE_SUMMARY.md`. This dense summary is injected into future prompts, providing a perfect map of the codebase for virtually zero token cost.
