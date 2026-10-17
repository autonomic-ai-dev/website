# agent-heart Roadmap

## ✅ Completed Features
- **Local API Proxy:** A transparent HTTP proxy that tracks LLM API spend.
- **Spine Execution Gatekeeper:** Intercepts `agent-spine` payloads via HTTP daemon.

## ⏳ Active Backlog (Pending)

### 1. The Standalone Evolution (Human-Centric Tooling)
- [x] **Static Bash Linter CLI:** `agent-heart lint script.sh` via tree-sitter-bash security checks. Expose the `tree-sitter-bash` engine via `agent-heart lint script.sh` for manual CI/CD security checks.

### 4. The Autonomous Evolution (Self-Improvement)
- [x] **Nightly Fine-Tuning Trigger:** Cron at 04:00 runs `agent-brain dataset pipeline` then `agent-muscle train` on merged JSONL.

### 2. The Integrated Evolution (The Global Workspace)
- [x] **Global Workspace Migration:** Transition all localized configs to read from `~/.autonomic/config.toml`.

### v1.0.0 Ecosystem Convergence (Parity with `agent-brain`)
- [x] **Predictive Token Budgeting:** `agent-heart budget` and `/budget/check` read `brain.db` retrieval_log p95 history; freeze runaway routes and publish `heart.budget.frozen` to spine.
