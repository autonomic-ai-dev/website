# Versioning & roadmap

agent-brain uses [Semantic Versioning](https://semver.org/). Pre-1.0, **minor** bumps (0.x) mark user-visible capability layers; **patch** bumps are fixes and small additions within a layer.

**Source of truth for release order:** this file.  
**Detailed specs:** `specs/mcp_router_master_spec.md` (Part 1 = core router, Part 2 = extension modules, Part 3 = summary index).

**Priority layers** (from extensions design — *why* order matters):

| Priority | Layer | Goal |
|----------|-------|------|
| 1 | Context intelligence | Better routing: phases, negatives, feedback, `apply_when` |
| 2 | Sync & portability | Multi-machine memory without corrupting live `brain.db` |
| 3 | Operator visibility | Inspect what was injected and why |
| 4 | Platform / federation | Route to upstream MCP servers |
| 5 | Automation | Promote facts → skills; digests; memory GC |
| 6 | Graph intelligence | Local entity/relationship memory graph |
| 7 | Graphify orchestration | Codebase structure graph → `brain.db` |

---

## Shipped

### v0.3.x — Foundation & core routing

| Area | Delivered |
|------|-----------|
| **Router** | `route_task`, `store_memory`, BM25 + ONNX embeddings, turn cache, write queue |
| **Indexing** | Agents, skills, rules from Cursor / Claude / Codex / project paths |
| **Packages** | `agent-brain add`, list/update/remove |
| **Ops** | `install --global` (Cursor), auto-update, macOS codesign, doctor/briefing |
| **Bridge** | Legacy session snippet ingest (replaced by digests in 0.4) |

### v0.4.0 — Context intelligence & visibility (priority 1 + 3)

| Area | Delivered |
|------|-----------|
| **Intelligence** | `phase`, `polarity` → `must_apply`, phase boost, `report_context_useful` |
| **Visibility** | `retrieval_log`, `explain_last_context`, `inspect` CLI, route briefing |
| **Sessions** | Structured session digests (default); legacy ingest opt-in |
| **Schema** | v2: `conflict_log`, `facts.polarity`, context weights |

### v0.5.0 — Conditions & manual sync (priority 1 + 2 partial)

| Area | Delivered |
|------|-----------|
| **Intelligence** | `apply_when`, convention boost, `warnings` in `route_task` |
| **Sync S1** | Bundle export/import, MCP `import_memory`, merge policies |
| **Schema** | v3: `facts.apply_when` |

### v0.6.0 — Git sync (priority 2 partial)

| Area | Delivered |
|------|-----------|
| **Sync S2** | `sync git init\|clone\|push\|pull\|status`, bundle at `~/.agent_brain/sync/` |
| **Sync ops** | `sync restore`, `sync status`, `sync.git.auto_push` |
| **Cloud stub** | `sync.cloud` config schema; `cloud push\|pull` deferred |
| **Schema** | v4: `conflict_log.restored`, `sync_source` on import |

### v0.6.1 — Operator UX polish (pre-1.0 hardening)

| Area | Delivered |
|------|-----------|
| **Gate resilience** | Grace period after failed `route_task`; stale gate timeout |
| **Routing quality** | Low-signal memory penalties; expanded phase inference |
| **Visibility** | Richer briefing one-liner; MCP log level default `info` |

**Deferred:** multi-host installers (v0.9), automated memory GC (v0.10).

### v0.7.0 — Cloud sync (Sync S3) · priority 2 complete

| Area | Delivered |
|------|-----------|
| **Sync S3** | `sync cloud push\|pull`, age-encrypted artifact, S3/R2/MinIO via opendal; `provider=local` for tests |
| **Secrets** | `secret_refs` table + bundle JSON; `secrets status\|setup\|add`; keychain + env fallback |
| **Status** | `sync status` cloud `last_push` / `last_pull` / `artifact_present` |
| **Auto-push** | `sync.cloud.auto_push` after `store_memory` when enabled |
| **Schema** | v5: `secret_refs` |

---

### v0.7.3 — Session sources · priority 5 adjunct

**Theme:** Digest past conversations from Cursor, Codex, Gemini, and OpenCode — one fact per session.

| Area | Delivered |
|------|-----------|
| **Gemini** | `USER_INPUT` JSONL under `~/.gemini/**/transcript.jsonl` |
| **OpenCode** | SQLite `message` + `part` tables |
| **Topics** | Per-session `session-digest-{source}-{slug}` |
| **CLI** | `sessions ingest`, `sessions status` |

---

### v0.7.2 — Write queue + CLI MCP allowlist

| Area | Delivered |
|------|-----------|
| **Write queue** | Import + sync pulls serialized through `Engine` |
| **Install** | `permissions.json` merges `agent-brain:*` |

---

### v0.7.1 — MCP resilience

| Area | Delivered |
|------|-----------|
| **Scoped gate** | `AGENT_BRAIN_ROUTE_GATE_SCOPE=brain_mcp` |
| **Offline mode** | Cooldown after MCP disconnect |
| **Install** | `--reload`, `serve_meta.json`, stale `doctor` |

### v0.8.0 — Upstream MCP federation · priority 4

| Area | Delivered |
|------|-----------|
| **Registry** | `upstream_mcp` in config.yaml |
| **Tools** | `route_to_mcp`, `suggested_tools` in `route_task` |
| **Index** | Upstream tool catalog on bootstrap |
| **Truncation** | Semantic JSON/text trim for upstream responses |
| **Logging** | `retrieval_log` phase `upstream_call` |

### v0.9.0 — Multi-host editors · priority 4 adjunct

| Area | Delivered |
|------|-----------|
| **Installers** | `--claude-desktop`, `--vscode`, `--claude-code`, `--all` |
| **Docs** | `docs/host-integration.md` |
| **Claude Code** | `~/.claude.json` / `.mcp.json` + rule template |
| **Hook matrix** | Documented Cursor hooks vs rule-only hosts |

---

## Planned — pre-1.0

Each version has a **theme**, **exit criteria**, and a **feature checklist**. Spec section refs point to Part 2 of the master spec.

### v0.10 — Automation & memory lifecycle · priority 5

**Theme:** Turn durable facts into skills; prune stale memory safely.

| Feature | Spec | Notes |
|---------|------|-------|
| `promote_to_skill` MCP tool | §7.1 | Stage SKILL.md drafts; user approval required |
| `agent-brain promote approve\|reject` | §7.1 | Move staging → `~/.agent_brain/skills/` |
| Memory GC | §16.3 | `facts_archive`; low-confidence / expired cleanup |
| Weekly digest CLI | §7.2 | `agent-brain digest --weekly` from retrieval_log |
| `agent-brain eval --ci` | §7.3 | Recall@3 ≥ 0.85 gate for CI |
| Sync bundle v2 (optional) | §4.5 | `team_id` / `visibility` columns reserved; importers ignore until team features |

**Exit criteria:** Promotion never writes skills without explicit approve; GC never deletes `must_apply` negatives without flag.

---

### v0.11 — Doc ingestion · priority 5 adjunct

**Theme:** Index external docs as rules — off the hot path.

| Feature | Spec | Notes |
|---------|------|-------|
| `learn_from_url` MCP tool | §8.1 | Fetch, chunk, embed as `rule` items |
| Domain allowlist | §8.2 | `[ingestion]` config; robots.txt respect |
| Rate limits | §8.2 | Off hot path; never blocks `route_task` |

**Exit criteria:** Ingest 5-page doc site; chunks appear in routing for scoped project.

---

### v0.12 — Local graph constraints · routing at scale

**Theme:** Lightweight dependency graph for skills/rules — not full entity memory yet.

| Feature | Spec | Notes |
|---------|------|-------|
| Adjacency tables | Part 3 / README | SQLite edges: skill → depends_on → rule/skill |
| `must_apply` expansion | §9 (subset) | Traverse edges when primary skill matches |
| Multi-repo package deps | §6 / packages | Resolve cross-package “always use with X” |
| `query_codebase` stub prep | §10 | Interface for later Graphify integration |

**Exit criteria:** Installing skill A auto-boosts dependency rule B in `route_task` without embedding similarity alone.

---

### v0.13 — Scalable local vector search · ANN index

**Theme:** Sub-50ms routing at 10k+ indexed items.

| Feature | Spec | Notes |
|---------|------|-------|
| ANN index | README §Storage | **sqlite-vec** or **LanceDB** (evaluate both; ship one) |
| Hybrid pipeline | Part 1 §7 | BM25 filter → ANN rerank (replace brute-force dot product on large sets) |
| Cold corpus partition | README | Docs/tickets in separate index; not merged into per-turn 500-token budget |
| Benchmark suite | Part 1 §12 | p95 latency at 1k / 5k / 10k items documented |

**Exit criteria:** p95 `route_task` < 50 ms at 10k items on reference hardware; fallback to brute-force for small indexes.

---

### v0.14 — Graphify orchestration · priority 7

**Theme:** Codebase structure graph (calls, modules) orchestrated by agent-brain.

| Feature | Spec | Notes |
|---------|------|-------|
| `agent-brain graphify enable\|disable\|status` | §10.3 | Per-repo opt-in |
| Git hook ingest | §10.4 | Post-commit → `graph.json` → `brain.db` |
| `trigger_deep_analysis` | §10.5 | Agent-initiated semantic graphify run |
| `graphify_job_status` | §10.5 | Async job queue |
| `query_codebase` MCP tool | §10 | Subgraph queries via graphify CLI |
| `code_graph_*` tables | §11 migration 8 | Nodes, edges, jobs |
| Tiered indexing / token budgets | §16.2 | Refuse oversized autonomous jobs |

**Exit criteria:** Commit triggers incremental ingest; `route_task` surfaces god-nodes for enabled repo.

---

### v0.15 — Graph intelligence · priority 6

**Theme:** Memory entity/relationship graph (decisions, not code structure).

| Feature | Spec | Notes |
|---------|------|-------|
| `entities` / `relationships` tables | §9.3 | Local — no Neo4j / external graph DB |
| `store_memory` entities/relations | §9.5 | Structured agent input + rule-based extraction |
| Entity contradiction resolution | §9.6 | Complements topic-level supersession |
| `related_entities` in `route_task` | §9.7 | Token-capped output |
| Graph in sync bundle | §9.3 | Export/import with `facts.jsonl` |
| Async enrich queue (optional) | §9.4 | Local LLM path 3 — config-gated, off hot path |

**Exit criteria:** “Auth uses Postgres” vs “Auth uses MySQL” resolves via entity graph; sync round-trip preserves entities.

---

### v1.0 — General availability

**Theme:** Stable contracts, production hardening, operator tooling.

| Feature | Spec | Notes |
|---------|------|-------|
| Schema freeze | §11 | Facts, conflicts, sync bundle v2 documented + migration policy |
| `agent-brain dashboard` | Part 3 | Memory, packages, sync, latency analytics CLI |
| Production hardening | §16 | Write queue, truncation, GC, secrets — checklist complete |
| Multi-host regression CI | §13 | Cursor + Claude Desktop + VS Code smoke tests |
| Published benchmarks | Part 1 §12 | Recall@3, p95 latency, token budget compliance |
| Web dashboard | §5 | **Deferred** — optional sidecar post-1.0 |

**Exit criteria:** No breaking MCP tool changes without migration doc; eval suite green in CI; install docs for three hosts.

---

## Post-1.0 — ecosystem (not versioned yet)

Ideas from Part 3 “Beyond v1.0” — product bets, not committed releases:

| Idea | Description |
|------|-------------|
| **Visual memory manager** | IDE extension to browse/edit memory graph and routing explanations |
| **CI/CD review enforcer** | GitHub Actions: PR diff → `route_task` → rule/memory compliance |
| **Enterprise bridges** | Notion / Confluence / Slack → team memory import |
| **Federated multi-agent hub** | Dispatch tasks across local agent fleet |
| **Skill marketplace** | Curated package registry for routing workflows |
| **Team/org sync** | Shared memory with `team_id`, visibility, manifest v2 filters (§4.5 C4) |
| **Web dashboard sidecar** | Optional local web UI for analytics |

---

## Legacy spec labels → current versions

Part 2 of the master spec uses historical labels (v1.1, v1.2, …). Mapping to current plan:

| Legacy label | Part 2 § | Ship target |
|--------------|----------|-------------|
| v1.1 Intelligence | §3 | **0.4–0.5** ✅ |
| v1.3 Visibility | §5 | **0.4** ✅ |
| v1.2 Sync (S1/S2/S3) | §4 | **0.5–0.7** (S3 → 0.7) |
| v1.4 Federation | §6 | **0.8** |
| v2.0 Automation | §7 | **0.10** |
| v2.3 Doc ingestion | §8 | **0.11** |
| v2.4 Graphify | §10 | **0.14** |
| v2.5 Graph intelligence | §9 | **0.15** |
| Multi-host | §13 | **0.9** |
| ANN / vector scale | README | **0.13** |
| Graph routing constraints | Part 3 (old 0.8) | **0.12** |

---

## When we bump versions

| Bump | When |
|------|------|
| **Patch** (0.6.x) | Bug fixes, perf, docs; no new MCP tools or migrations |
| **Minor** (0.x.0) | New tools, sync modes, schema migrations, host installers |
| **1.0.0** | MCP surface stable; migration path documented; GA checklist done |

---

## Revision history

| Date | Change |
|------|--------|
| 2026-06-16 | Rewrote roadmap: shipped 0.3–0.6, planned 0.7–1.0 with editors, ANN, graph; superseded 0.3.x-only policy |
