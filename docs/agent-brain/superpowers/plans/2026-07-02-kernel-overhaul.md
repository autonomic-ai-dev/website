# Kernel Overhaul (V2) — Implementation Plan

> **For agentic workers:** Implement one phase at a time. Each phase ends with `cargo test`, CHANGELOG + semver bump, and a git commit. Update the phase tracker table when shipping.

**Goal:** Decompose the agent runtime into kernel-style organs — deterministic Rust infrastructure, local embeddings/statistics everywhere, and **only agent-eyes (VLM) + agent-mouth (SLM) call LLM-class models**.

**Architecture:** Eight phased organ upgrades (immune → spine → brain → mouth → muscle → heart → nerves → body) plus a Phase 9+ precision layer. Shared WASM engine lives in `agent-body-core`.

**Tech Stack:** Rust, Wasmtime, blake3, NATS JetStream, SQLite, ONNX/fastembed, MLX/Candle LoRA

**Status:** Phases 1–9 shipped on master. Precision rerank/decompose wired behind config flags (default off) pending Recall@3 eval gate / ONNX.

**Related:** [VERSIONING.md](../VERSIONING.md) (local plan only — not in git)

---

Cross-organ phased rollout: treat the agent runtime as an OS kernel — specialized organs, deterministic Rust infrastructure, and **only agent-eyes (VLM) and agent-mouth (SLM) call LLM-class models**.

## Design principle

| Layer | Organ | Model / mechanism |
|-------|-------|-------------------|
| Perception | agent-eyes | moondream-2B VLM |
| Language output | agent-mouth | smollm2-135M SLM |
| Working memory | agent-brain | all-minilm-l6 embedder |
| Executive planning | agent-spine | pure Rust DAG |
| Safety | agent-immune | WASM + seccomp |
| Execution | agent-muscle | MLX/Candle LoRA |
| Signaling | agent-nerves | NATS event mesh |
| Homeostasis | agent-heart | SQLite p95 + distillation |
| Gateway | agent-body | process supervisor |

## Phase tracker

| Phase | Focus | Crates | Target version | Status |
|-------|-------|--------|----------------|--------|
| **1** | WASM sandbox + fuel metering | agent-body-core, agent-immune | core 0.3.7, immune 0.5.9 | **Done** |
| **2** | Spine CFS critical-path DAG scheduler | agent-spine | 0.18.0 | Planned |
| **3** | Brain SQ8 + RRF + MinHash GC | agent-brain | 0.34.0 | Planned |
| **4** | Mouth local SLM inference | agent-mouth | 0.6.0 | Planned |
| **5** | Muscle trace collector + auto-LoRA | agent-muscle, agent-spine | muscle 0.8.0 | Planned |
| **6** | Heart distillation + WASM fuel budget | agent-heart | 0.8.0 | Planned |
| **7** | Nerves WASM cache + backpressure | agent-nerves, agent-body-core | nerves 0.7.0 | Planned |
| **8** | Body health mesh + MCP hardening | agent-body | 0.6.0 | Planned |
| **9+** | Precision layer (cross-encoder, cascades, PID budget) | multi | per organ | **In progress** (opt-in flags) |

Each phase ends with: `cargo test`, CHANGELOG entry, semver bump, git commit.

---

## Phase 1 — Safety foundation (agent-immune)

**Kernel analogue:** eBPF verifier + `RLIMIT_CPU` + `RLIMIT_AS`

### Deliverables

- [x] `agent-body-core::wasm_engine` — shared Wasmtime engine + blake3 module cache (`wasm` feature)
- [x] `SandboxExecute` / `ExecuteResult` fuel + memory limit fields
- [x] `agent-immune::wasm_sandbox` — fuel metering, memory limiter, wall-clock timeout
- [x] `sandbox.rs` — `backend: "wasm"` routing in `run_isolated`
- [x] `AUTONOMIC_WASM_FUEL` env (default `500_000_000`)
- [x] Tiered execution ladder (AST → WASM → subprocess) — defer to Phase 1.1

### Verification

```bash
cargo test -p agent-immune wasm_sandbox
cargo test -p agent-body-core wasm_engine --features wasm
```

### Commit

- `agent-body`: core 0.3.7, body 0.5.17
- `agent-immune`: 0.5.9, depends on body tag with `wasm` feature

---

## Phase 2 — Spine CFS scheduler

**Kernel analogue:** Linux CFS + critical-path priority

### Deliverables

- [ ] `scheduler.rs` — CPP weights per `NodeKind`, max-heap ready queue
- [ ] Heavy nodes (`Agent`, `Debate`, `Vote`) → dedicated tokio tasks
- [ ] Light nodes (`Verify`, `Hydrate`, `Router`) → crossbeam work-stealing deque
- [ ] `workflow.rs` — `compute_critical_path_weights()` at validate time
- [ ] `runner.rs` — replace FIFO dispatch with `DagScheduler::enqueue_ready`
- [ ] Feed `fuel_consumed` from WASM results into `BudgetGate`

### NodeKind weight map

| NodeKind | Weight (µs) |
|----------|-------------|
| Agent, Debate, Vote | 800_000 |
| Sandbox | 200_000 |
| Verify, Hydrate | 5_000 |
| Router, Checkpoint | 100 |

### Verification

```bash
cargo test -p agent-spine scheduler::tests::critical_path_dispatched_first
cargo test -p agent-spine scheduler::tests::no_thread_starvation
```

---

## Phase 3 — Brain memory precision

**Kernel analogue:** zswap (SQ8) + VFS fusion (RRF) + KSMD (MinHash)

### Deliverables

- [ ] `ann.rs` — SQ8 scalar quantization (384 B/vector vs 1.5 KB f32)
- [ ] `retrieval_fusion.rs` — RRF merge BM25 + HNSW (`k = 60`)
- [ ] AST symbol-type boost (×1.5 exact match)
- [ ] `gc.rs` — MinHash LSH dedup (O(n×128) vs O(n²))
- [ ] Cross-encoder rerank top-20 (ONNX, non-LLM) — Phase 3.1
- [ ] Query decomposition for multi-intent turns — Phase 3.1
- [ ] Reb baseline `proofs --ci` golden suites

### Verification

```bash
cargo test -p agent-brain retrieval_fusion::tests::rrf_beats_single_source
cargo bench -p agent-brain -- ann_sq8_vs_f32
cargo bench -p agent-brain -- gc_minhash_vs_exact
```

---

## Phase 4 — Mouth local SLM

**Kernel analogue:** kthreadd (dedicated formatting thread)

### Deliverables

- [ ] `local_inference.rs` — llama.cpp HTTP client + subprocess fallback
- [ ] `summarize.rs` — local SLM first, API second, heuristics last
- [ ] Template fast path for structured outputs (CI summary, approval gate)
- [ ] Hard `max_tokens = 150` cap

### Verification

```bash
cargo test -p agent-mouth local_inference::tests::summarize_without_api_key
```

---

## Phase 5 — Muscle feedback loop

**Kernel analogue:** perf_events continuous sampling

### Deliverables

- [ ] `trace_collector.rs` — NATS `agent.spine.execution.completed` → SQLite `training_traces.db`
- [ ] `finetune/mod.rs` — `run_lora_from_traces()` JSONL export
- [ ] `serve.rs` — 6h poll, auto-LoRA when trace_count > 500
- [ ] Spine publishes `(prompt, completion, reward)` on workflow completion
- [ ] DPO-style preference pairs (workflow success vs retry) — Phase 5.1

### Verification

```bash
cargo test -p agent-muscle trace_collector::tests::traces_accumulate_on_success
cargo test -p agent-muscle finetune::tests::lora_round_from_500_traces
```

---

## Phase 6 — Heart homeostasis

**Kernel analogue:** kswapd + cgroup accounting

### Deliverables

- [ ] `distillation.rs` — weekly HDBSCAN cluster pulse on brain embeddings
- [ ] `token_budget.rs` — WASM fuel p95 + ceiling alongside LLM tokens
- [ ] `wasm_executions` SQLite table (mirror `retrieval_log`)
- [ ] PID throttle (gradual slowdown vs binary freeze) — Phase 6.1
- [ ] Temporal confidence decay on facts — Phase 6.1

### Verification

```bash
cargo test -p agent-heart distillation::tests::cluster_reduces_fact_count
cargo test -p agent-heart token_budget::tests::wasm_fuel_p95_tracking
```

---

## Phase 7 — Nerves mesh hardening

**Kernel analogue:** socket BPF JIT cache + TX queue backpressure

### Deliverables

- [ ] `wasm_filter.rs` — use `agent-body-core::wasm_engine` (no cold Engine per message)
- [ ] `backpressure.rs` — token-bucket JetStream consumer
- [ ] Subject priority classes (RT / BE / IDLE)
- [ ] DOM diff coalescing (16 ms window) — Phase 7.1

### Verification

```bash
cargo test -p agent-nerves backpressure::tests::token_bucket_parks_excess
cargo bench -p agent-nerves -- wasm_filter_cached_vs_cold
```

---

## Phase 8 — Body integration

**Kernel analogue:** watchdog + OOM killer scores

### Deliverables

- [ ] `supervisor.rs` — per-daemon health score 0–100 (latency, restarts, RSS)
- [ ] `GET /organs/health` aggregated endpoint
- [ ] Dependency-ordered boot (nats → brain index ready → spine)
- [ ] Graceful degradation ladder (mouth → raw JSON, eyes → DOM-only)
- [ ] MCP session crash recovery (pool exists; add reconnect + health gating)

### Verification

```bash
cargo test -p agent-body supervisor::tests::health_score_eviction
```

---

## Phase 9+ — Precision layer (accuracy without LLM)

| Enhancement | Organ | Priority |
|-------------|-------|----------|
| Cross-encoder rerank (top-20) | brain | P0 |
| Semantic turn cache L2 (MinHash) | brain | P2 |
| pHash + ROI VLM cascade | eyes | P1 |
| Speculative parallel hydrate | spine | P2 |
| Hot-swap LoRA adapters | muscle | P1 |
| Multi-dimensional budget vector | heart | P1 |

---

## Target benchmarks (post Phase 8)

| Metric | Before | After |
|--------|--------|-------|
| Tokens per turn | ~4,000 | ~150 |
| LLM calls per task | 3–8 | 0–1 |
| WASM cold start | N/A | <1 ms (cached) |
| DAG dispatch | FIFO | Critical path first |
| Fact dedup | O(n²) | O(n × 128) |
| Embedding memory (10k facts) | ~15 MB | ~4 MB (SQ8) |
| Model improvement | Manual | Auto LoRA every 6h |

---

## Shared crate: agent-body-core

Extract cross-organ primitives here to avoid duplication:

| Module | Consumers |
|--------|-----------|
| `wasm_engine` | immune, nerves |
| `nats` payloads | all organs |

Enable with `features = ["wasm"]` on dependent crates.
