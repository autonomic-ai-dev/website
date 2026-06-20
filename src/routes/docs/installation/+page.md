---
title: Installation
---

# Installation

Getting the Autonomic AI ecosystem running requires the Rust toolchain and ~50 MB of disk for the 9 organ binaries.

## Prerequisites

- **Rust toolchain** (1.82+): `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- **macOS:** Xcode Command Line Tools: `xcode-select --install`
- **Linux:** `build-essential`, `pkg-config`, `libssl-dev`, `libseccomp-dev`
- **`~/.local/bin` in PATH** (the install script places binaries here)
- **NATS server** (optional — installed automatically by the script) for multi-organ coordination

## Quick Install (macOS / Linux)

The recommended installation method downloads pre-built binaries from GitHub Releases:

```bash
curl -fsSL https://raw.githubusercontent.com/autonomic-ai-dev/agent-body/master/scripts/install-all-organs.sh | bash
```

This script will:

1. Detect your OS and architecture (x86_64 / aarch64)
2. Download the latest release tarballs for all 9 organs from `github.com/autonomic-ai-dev/agent-*/releases`
3. Extract binaries to `~/.local/bin/`
4. Download and configure a local NATS server binary
5. On macOS, handle Gatekeeper via `xattr -dr com.apple.quarantine` and ad-hoc `codesign -s -`
6. Print a summary of installed versions

### Verify

```bash
autonomic --version
# Autonomic AI v0.1.0

autonomic organs
# agent-body     v0.1.0  running
# agent-brain    v0.1.0  running
# agent-spine    v0.1.0  running
# agent-heart    v0.1.0  running
# agent-nerves   v0.1.0  running
# agent-muscle   v0.1.0  stopped
# agent-immune   v0.1.0  running
# agent-eyes     v0.1.0  stopped
# agent-mouth    v0.1.0  stopped
```

## Build from Source

Each organ is a standalone Rust crate. Clone and build individually:

```bash
for organ in body brain spine heart nerves muscle immune eyes mouth; do
    git clone "https://github.com/autonomic-ai-dev/agent-$organ.git"
    cd "agent-$organ"
    cargo build --release
    cp target/release/agent-$organ ~/.local/bin/
    cd ..
done
```

To build the entire ecosystem in one command from the meta-repository:

```bash
git clone https://github.com/autonomic-ai-dev/autonomic-meta.git
cd autonomic-meta
cargo build --release --workspace
```

Build times range from 2–8 minutes depending on your machine (agent-brain with its knowledge-graph dependencies takes the longest).

## Initialize the Workspace

```bash
autonomic init
```

This creates `~/.autonomic/` with the following structure:

```
~/.autonomic/
├── config.toml          # unified configuration, per-organ sections
├── data/
│   ├── brain/           # knowledge graph, skill index, memory store
│   ├── nerves/          # NATS JetStream stream storage
│   └── spine/           # workflow DAG snapshots
├── logs/                # rotation-enabled log files per organ
├── tmp/                 # ephemeral execution artifacts
└── hooks/               # lifecycle hook scripts
```

## Start the System

```bash
autonomic start
```

agent-body launches organs in dependency order: agent-nerves first (event bus), then agent-brain, agent-spine, agent-heart, and the remaining workers. Each process is supervised — if an organ exits unexpectedly, agent-body restarts it with exponential backoff.

### Per-organ Control

```bash
autonomic start agent-muscle    # start a single organ
autonomic stop agent-eyes       # stop a single organ
autonomic status                 # show all organ states
autonomic logs agent-brain       # tail logs for one organ
```

## Troubleshooting & Debugging

If you run into issues during installation or startup, you can diagnose the system using the following steps:

### 1. Check Supervisor Status
The `agent-body` supervisor manages the daemon lifecycles. If `autonomic start` succeeds but an organ fails shortly after, check its status:
```bash
autonomic status
```
This command lists all organs, their PIDs, running status, health check status, and the path to their log files.

### 2. Inspect Daemon Logs
If an organ is marked as unhealthy or stopped, its log file contains the error output. You can find these logs at `~/.autonomic/logs/supervisor/<organ>.log` or by running:
```bash
tail -f ~/.autonomic/logs/supervisor/nats.log
tail -f ~/.autonomic/logs/supervisor/nerves.log
```

### 3. Check NATS Connectivity
The `agent-spine` daemon acts as the event bridge. If the system hangs on startup or during event dispatch, verify that `nats-server` is running locally:
```bash
curl http://127.0.0.1:8222/healthz
```
If NATS is unavailable, organs will eventually time out and fall back to in-memory mode or exit.

### 4. Run Autonomic Doctor
The built-in doctor command validates your environment, directory structures, and organ binaries. It is automatically run during installation, but you can trigger it manually to catch missing dependencies:
```bash
autonomic doctor
```

## Next Steps

- Read the [Architecture](/docs/architecture) guide to understand how the organs communicate.
- Review [Security](/docs/security) for sandboxing and access-control configuration.
