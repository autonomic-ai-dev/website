# agent-brain Roadmap

## 🏗️ Active: Kernel Overhaul (V2)

**Implementation plan:** [plans/2026-07-02-kernel-overhaul.md](plans/2026-07-02-kernel-overhaul.md)

Phased organ upgrades (immune → spine → brain → mouth → muscle → heart → nerves → body). Phase 1 (WASM sandbox) shipped in agent-immune 0.5.9.

## ✅ Completed Features
- **AST-Based Indexing:** Integration with `tree-sitter`.
- **Hybrid Search & SQLite Graph State:** BM25/HNSW embeddings.
- **MCP Server Native:** Native stdio JSONRPC compliance.

## ⏳ Active Backlog (Pending)

### 2. The Integrated Evolution (The Global Workspace)
- [x] **Global Workspace Migration:** Move `brain.db` and log files from localized directories into the global `~/.autonomic/memory/` directory.

### 4. The Autonomous Evolution (Self-Improvement)
- [x] **Automated Trajectory Distillation:** `agent-brain dataset ingest-spine` and `dataset pipeline` convert `~/.autonomic/logs/spine/executions/*.json` into JSONL training datasets. Expand the distillation cron job to intercept successful `agent-spine` JSON execution graphs and convert them into JSONL datasets.
- [x] **Auto-Wire Configs:** `autowire::auto_wire` patches Cursor/Claude MCP manifests on `agent-brain serve` startup. Background daemon that automatically patches IDE extension manifests (Cursor/Claude).
