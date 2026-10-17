# agent-mouth Roadmap

## ✅ Completed Features
- **Generic Webhook Translator:** Pushing metrics via HTTP.
- **Spine JSON Summarizer:** Translating JSON execution graphs into Slack updates.

## ⏳ Active Backlog (Pending)

### 1. The Standalone Evolution (Human-Centric Tooling)
- [x] **Log Summarizer CLI:** `cat logs.txt | agent-mouth summarize` bullet-points errors locally (OpenAI/Anthropic optional, heuristic fallback).

### 2. The Integrated Evolution (The Global Workspace)
- [x] **Global Workspace Migration:** Transition all localized configs to read from `~/.autonomic/config.toml`.

### v1.0.0 Ecosystem Convergence (Parity with `agent-brain`)
- [ ] **Local Stream Summarization:** Run local, quantized LLMs via `candle` to ingest raw JetStream logs and autonomously output bulleted summaries offline.
- [ ] **Bi-Directional AST Validation:** Natively cross-reference human Slack approvals against `agent-brain`'s AST security rules before ACKing to `agent-spine`.
