# agent-immune Roadmap

## ✅ Completed Features
- **OSV Scanner Framework:** Core scanner implementation.

## ⏳ Active Backlog (Pending)

### 1. The Standalone Evolution (Human-Centric Tooling)
- [x] **Sandbox Execution CLI:** `agent-immune sandbox run script.sh` with optional `--allow-network`.

### 2. The Integrated Evolution (The Global Workspace)
- [x] **Global Workspace Migration:** Transition all localized configs to read from `~/.autonomic/config.toml`.

### 3. The Decoupled Evolution (True Asynchrony)
- [x] **Zero-Trust Orchestration:** `agent-immune serve` consumes `autonomic.execute.sandbox` and publishes `autonomic.execute.result` (MVP isolated subprocess).
- [x] **Network Egress Blackholes:** Linux `unshare -n` network namespace isolation during sandbox execution (`network_blackhole` config + `sandbox run` CLI).

### 4. The Autonomous Evolution (Self-Improvement)
- [x] **Memory Leak Verification:** `agent-immune verify-memory script.sh` samples RSS and blocks runaway growth before dataset commits. Automatically verify no memory leaks exist before allowing an execution trajectory to be committed to the fine-tuning dataset.

### v1.0.0 Ecosystem Convergence (Parity with `agent-brain`)
- [ ] **Native Firecracker Orchestration:** Natively spawn 150ms boot-time microVMs via Unix Domain Sockets without relying on Docker.
- [ ] **Seccomp-BPF Policies:** Generate strict, immutable kernel-level sandboxing profiles for the execution environment.
