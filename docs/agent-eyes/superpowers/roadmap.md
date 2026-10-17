# agent-eyes Roadmap

## ✅ Completed Features
- **Pixel Diffing:** Fast headless Playwright pixel-diff testing.
- **Real-Time Ecosystem UI:** Event bus bindings to ingest `agent-nerves` streams.

## ⏳ Active Backlog (Pending)

### 1. The Standalone Evolution (Human-Centric Tooling)
- [x] **Local VLM CLI:** `agent-eyes describe localhost:3000` extracts page structure, headings, links, and framework hints (native VLM deferred to v1.0).

### 2. The Integrated Evolution (The Global Workspace)
- [x] **Global Workspace Migration:** Transition all localized configs to read from `~/.autonomic/config.toml`.

### 4. The Autonomous Evolution (Self-Improvement)
- [x] **Visual UI Verification:** `agent-eyes verify localhost:3000` captures and pixel-diff against baselines in `~/.autonomic/state/eyes/baselines/`. Automatically verify the visual UI is correct before triggering autonomous dataset generation loops.

### v1.0.0 Ecosystem Convergence (Parity with `agent-brain`)
- [ ] **Native Local Vision:** Embed HuggingFace `candle` framework directly to run local VLMs (LLaVA-1.5) natively.
- [ ] **Continuous DOM Indexing:** Maintain a temporal SQLite graph of the web page's DOM tree, tracking exactly when CSS selectors mutate.
