---
title: agent-spine installation
---

# agent-spine installation

thesmos ships as one binary, named `agent-spine` in this release. Homebrew provides a pre-built binary for **macOS (Apple Silicon)**. Building from source works on any platform Rust supports.

---

## 1. Install with Homebrew

```bash
brew tap autonomic-ai-dev/tap
brew install agent-spine
```

Update with:

```bash
brew upgrade agent-spine
```

---

## 2. Create the state directory and an example workflow

```bash
agent-spine init
```

`init` creates agent-spine's state directory under `~/.autonomic/state/spine` and writes built-in workflow templates. List them with `agent-spine init --with list`.

---

## 3. Where state and logs live

| Item | Location | Override |
| :--- | :--- | :--- |
| Workflow files | `~/.autonomic/state/spine/` | `agent-spine init --dir` |
| Execution database | `~/.autonomic/logs/spine/state.db` | `--db` on each command |
| Supervisor logs | `~/.autonomic/logs/spine/` | none |

---

## 4. Optional: NATS for workflow events

agent-spine publishes workflow events to NATS only when you set `AUTONOMIC_NATS_URL`. Credentials come from the environment:

```bash
export AUTONOMIC_NATS_URL=nats://127.0.0.1:4222
export AUTONOMIC_NATS_USER=...           # optional
export AUTONOMIC_NATS_PASSWORD=...       # optional
export AUTONOMIC_NATS_TLS=1              # optional; add AUTONOMIC_NATS_CA, _CERT, _KEY as needed
export AUTONOMIC_NATS_INSECURE=1         # optional; skips user and password
```

Without NATS, failed nodes go to a local dead-letter file, `~/.autonomic/state/spine/dlq.jsonl`.

---

## 5. Build from source

```bash
git clone git@github.com:autonomic-ai-dev/thesmos.git
cd thesmos
cargo build --release -p thesmos
```

Copy the binary from `target/release/` into a directory on your `PATH`.
