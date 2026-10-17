# agent-muscle Roadmap

## ✅ Completed Features
- **Remote Dispatch:** Core executor logic for offloading jobs via HTTP.

## ⏳ Active Backlog (Pending)

### 1. The Standalone Evolution (Human-Centric Tooling)
- [x] **Local MLX Finetuning CLI:** `agent-muscle train` wraps mlx_lm LoRA training. Expose a 1-line script interface for local LoRA training (`agent-muscle train`).

### 2. The Integrated Evolution (The Global Workspace)
- [x] **Global Workspace Migration:** Transition all localized configs to read from `~/.autonomic/config.toml`.

### 3. The Decoupled Evolution (True Asynchrony)
- [x] **JetStream Job Consumption:** `agent-muscle serve` consumes `autonomic.compute.job` and publishes `autonomic.compute.result`.

### 4. The Autonomous Evolution (Self-Improvement)
- [x] **Nightly Fine-Tuning Trigger:** Orchestrated by `agent-heart` cron calling `agent-muscle train` on merged spine datasets. Automatically ingest trajectories from `agent-brain` and execute local MLX LoRA training loops overnight.

### v1.0.0 Ecosystem Convergence (Parity with `agent-brain`)
- [ ] **Native Finetuning Pipelines:** Orchestrate LoRA finetuning directly on Apple Silicon/CUDA using Rust's `mlx-rs` or `candle` bindings.
- [ ] **Kubernetes Operator:** Ship as a native Kubernetes Operator dynamically requesting GPU nodes based on incoming JetStream load.
