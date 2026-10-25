---
title: Installation & Deployment
---

# Installation & Deployment

Autonomic AI is two components: **agent-brain** and **agent-spine**. Homebrew provides pre-built binaries for **macOS (Apple Silicon)**. Building from source works on any platform Rust supports.

---

## 1. Homebrew (macOS, recommended)

```bash
brew tap autonomic-ai-dev/tap
brew install agent-brain agent-spine
```

Update both with:

```bash
brew upgrade agent-brain agent-spine
```

`agent-spine update` prints this command. It does not download releases itself.

---

## 2. Connect agent-brain to your editors

```bash
agent-brain install --global   # configure MCP and host hooks for supported editors
agent-brain doctor             # check the install
```

`agent-brain doctor --fix` repairs common problems it can detect. Restart your editor after installing so it picks up the new MCP server.

---

## 3. Set up agent-spine

```bash
agent-spine init
```

`init` creates agent-spine's state directory under `~/.autonomic/state/spine` and writes an example workflow.

---

## 4. Where settings and data live

| Item | Location | Override |
| :--- | :--- | :--- |
| agent-brain settings (`config.yaml`) | `~/.autonomic/memory/` | `AGENT_BRAIN_HOME` |
| agent-brain database and route logs | `~/.autonomic/memory/` | `AGENT_BRAIN_HOME` |
| agent-spine state | `~/.autonomic/state/spine/` | none |
| agent-spine execution logs | `~/.autonomic/logs/spine/` | none |

Everything stays on your machine unless you configure a NATS server or a remote model API.

---

## 5. Optional: NATS for agent-spine events

agent-spine publishes workflow events to NATS only if you set `AUTONOMIC_NATS_URL`. Credentials come from the environment:

```bash
export AUTONOMIC_NATS_URL=nats://127.0.0.1:4222
export AUTONOMIC_NATS_USER=...           # optional
export AUTONOMIC_NATS_PASSWORD=...       # optional
export AUTONOMIC_NATS_TLS=1              # optional; add AUTONOMIC_NATS_CA, _CERT, _KEY as needed
export AUTONOMIC_NATS_INSECURE=1         # optional; skips user and password
```

The credentials-file fallback from earlier releases has been removed.

---

## 6. Build from source

The repositories are private for now, so you need access to clone them.

```bash
git clone git@github.com:autonomic-ai-dev/agent-brain.git
cargo build --release --manifest-path agent-brain/agent-brain/Cargo.toml --bin agent-brain

git clone git@github.com:autonomic-ai-dev/agent-spine.git
cargo build --release --manifest-path agent-spine/agent-spine/Cargo.toml
```

Copy the resulting binaries from `target/release/` into a directory on your `PATH`.
