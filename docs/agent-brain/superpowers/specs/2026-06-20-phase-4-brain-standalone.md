# Phase 4: agent-brain Standalone Gaps

**Date:** 2026-06-20
**Bumps:** agent-brain v0.29.0 → v0.31.0

## v0.29.0 — tree-sitter AST Indexing

### Problem

Current indexing is text-chunk based. A function spanning 30 lines gets chunked across two fragments, losing the boundary. Retrieval returns semantically related text but can't guarantee exact symbol boundaries.

### New module

`agent-brain/src/ast_indexer.rs`

### Approach

Use the tree-sitter crate for language-aware parsing.

### Flow

1. On `agent-brain index`, scan all `.rs`, `.ts`, `.py`, `.go`, `.js` files
2. Load corresponding tree-sitter grammar (bundled crates)
3. Parse each file to CST, extract concrete syntax nodes:

| Language | Node kinds |
|----------|-----------|
| Rust | function_item, struct_item, impl_item, trait_item, macro_invocation |
| TypeScript/JS | function_declaration, class_declaration, interface_declaration, method_definition |
| Python | function_definition, class_definition, decorated_definition |
| Go | function_declaration, method_declaration, type_declaration |

4. Store each symbol as indexed_items:
   - item_type: "ast_symbol"
   - content: full source text of the symbol
   - metadata: { symbol_name, symbol_kind, file_path, start_line, end_line, language, doc_comment }
5. FTS5 + metadata fields for hybrid retrieval

### Dependencies added

- tree-sitter
- tree-sitter-rust
- tree-sitter-typescript
- tree-sitter-python
- tree-sitter-go

## v0.30.0 — Automated Distillation to ARCHITECTURE.md

### Problem

Fragmented facts accumulate but user has to manually synthesize the system's understanding of itself.

### New module

`agent-brain/src/distill.rs`

### CLI

```
agent-brain distill [--out ARCHITECTURE.md]
```

### Pipeline

1. Query active facts (invalid_at IS NULL) grouped by topic
2. Score each topic cluster: average confidence x recency weight
3. Order by confidence descending
4. Generate structured markdown:

```markdown
# Architecture — agent-brain v0.30.0

*Auto-generated from 847 active facts. Last updated: 2026-06-20*

## System Overview
- Primary role: local context/memory engine for IDE agents
- Retrieval: hybrid BM25 + HNSW embeddings
- Storage: SQLite (brain.db) with FTS5

## Key Modules
- retrieval.rs — BM25 query expansion, FTS5 scoring (confidence: 0.89, 47 facts)
- mcp/server.rs — MCP tool handlers, 15+ tools (confidence: 0.92, 34 facts)
```

5. Atomic write to ARCHITECTURE.md in workspace root

### Scheduling

Triggered by configurable interval (default daily) via existing background supervisor. Also manually runnable.

## v0.31.0 — Auto-Wire Configs Daemon

### Problem

When agent-brain binary updates (path changes, version upgrade), editor MCP configs don't update. User gets stale configs pointing to old binary.

### New module

`agent-brain/src/autowire.rs`

### Flow

1. Track current binary path in `~/.config/agent-brain/install_meta.json`
2. On every `serve` startup, compare known vs actual binary path
3. If path changed, update:
   - claude_desktop_config.json (Claude Desktop)
   - .cursor/mcp.json (Cursor)
   - .codex/config.toml (Codex)
   - All paths from host_install.rs registry
4. Log which files were patched

### Safety

Compute diff before writing. Only write if brain section actually changed. Backup original to `*.agent-brain.bak`.
