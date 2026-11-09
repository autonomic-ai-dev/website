---
title: Installation & Deployment
---

# Installation & Deployment

agent-brain is a single binary. Homebrew provides a pre-built binary for **macOS (Apple Silicon)**. Building from source works on any platform Rust supports.

---

## 1. Install with Homebrew

```bash
brew tap autonomic-ai-dev/tap
brew install agent-brain
```

Update with:

```bash
brew upgrade agent-brain
```

---

## 2. Connect agent-brain to your editors

```bash
agent-brain install --global   # configure MCP and host hooks for supported editors
agent-brain doctor             # check the install
```

`agent-brain doctor --fix` re-signs the binary on macOS, aligns the MCP configuration, and refreshes the hooks. Restart your editor after installing so it picks up the new MCP server.

---

## 3. Where settings and data live

| Item | Location | Override |
| :--- | :--- | :--- |
| Settings (`config.yaml`) | `~/.autonomic/memory/` | `AGENT_BRAIN_HOME` |
| Database and route logs | `~/.autonomic/memory/` | `AGENT_BRAIN_HOME` |

Routing, memory, verify and the gates run from local files. Auto-update, git sync and cloud sync are controlled in `config.yaml`. Run `agent-brain config show` to see the active values.

---

## 4. Build from source

```bash
git clone git@github.com:autonomic-ai-dev/agent-brain.git
cargo build --release --manifest-path agent-brain/agent-brain/Cargo.toml --bin agent-brain
```

Copy the binary from `target/release/` into a directory on your `PATH`.

The repository is private for now, so you need access to clone it.
