---
title: "tekmor documentation: proof eval, receipts, and stop gates"
description: "Documentation for tekmor, the local-first proof evaluation engine and process stop gate for autonomous coding agents. Enforces allowlisted checks, tree-hashed receipts, and hard process boundaries with 0 model calls."
canonical: https://tekmor.autonomic-ai.dev/docs
product: tekmor
group: Start
---

# tekmor documentation: proof eval, receipts, and stop gates

> Documentation for tekmor, the local-first proof evaluation engine and process stop gate for autonomous coding agents. Enforces allowlisted checks, tree-hashed receipts, and hard process boundaries with 0 model calls.

`tekmor` is a single binary that makes autonomous coding agents follow your repository's rules and show verifiable proof of their work. When an agent like Claude Code or Cursor runs tests, `tekmor` records the exit status and git tree SHA into a tamper-proof cryptographic receipt. A process stop gate physically blocks the agent from completing its turn if it claims the tests pass without a valid receipt for the current code.

```mermaid
flowchart LR
    Init["1. tekmor verify init<br/>Scaffolds .verify/verify.toml allowlist"] --> Run["2. tekmor verify -- &lt;cmd&gt;<br/>Executes allowlisted command under timeout"]
    Run --> Hash["3. Cryptographic Tree Hashing<br/>Calculates SHA of tracked files and commit"]
    Hash --> Receipt["4. .verify/receipt.json<br/>Stores exit code and status (PASSED/FAILED)"]
    Receipt --> Gate["5. Claude Code Stop Gate Hook<br/>Blocks completion if code was modified after run"]
```

## Requirements

| Surface | Requirement | Notes |
| :--- | :--- | :--- |
| **Pre-built binary** | macOS 13+ (Apple Silicon arm64) | Distributed via Homebrew tap |
| **Source build** | Rust 1.80+ / Cargo | Compiles on Linux, macOS (x86_64 / arm64) |
| **Git integration** | Git 2.30+ | Required for tree SHA computation and commit gates |
| **Host environments** | Claude Code, Cursor, Codex, CI | Claude Code supports native stop and bash hooks |

## Quickstart in 30 Seconds

### 1. Install tekmor

```bash
brew tap autonomic-ai-dev/tap
brew install autonomic-ai-dev/tap/tekmor
```

### 2. Connect Claude Code hooks

```bash
tekmor install
```

This registers the Stop gate and Bash gate hooks in `.claude/settings.json`.

### 3. Initialize allowlist

```bash
tekmor verify init
```

This auto-detects your test suite (`cargo test`, `npm test`, `pytest`, `make test`) and creates `.verify/verify.toml`.

### 4. Run an allowlisted check & read receipt

```bash
tekmor verify -- .verify/run.sh
tekmor verify receipt
```

---

## Core Invariants

1. **Zero Model Calls**: `tekmor` never calls an LLM or spends your API tokens. Validation is 100% deterministic local Rust process execution.
2. **Zero Network Telemetry**: Verified 0 network connections opened during verification, hook evaluation, or receipt signing.
3. **Receipts Bound to the Tree**: Every test run is tied to the exact git commit and tree hash. Modifying any tracked file immediately marks previous passes stale.
4. **Hard Stop Gates**: The stop hook parses the agent's turn completion claim. A claim without a `PASSED` receipt is blocked at the process level.

---

## Documentation Guide

### Get Started
- [Installation](installation) — Homebrew tap, crates.io, source build, and per-host hook registration.
- [Verification and Receipts](verification) — Detailed breakdown of verdicts, tree hashing, and CI verification.

### Reference
- [CLI Reference](cli) — Complete flag reference for `verify`, `--repeat`, `receipt`, `ratchet`, `drift`, and `check-checks`.
- [Known Limits](limits) — Explicit engineering boundaries, Keychain scoping, and arm64 architecture support.
