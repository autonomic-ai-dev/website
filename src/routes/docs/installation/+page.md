---
title: Installation & Deployment
---

# Installation & Deployment

The Autonomic AI Ecosystem distributes pre-compiled, Developer ID–notarized binaries for **macOS (Apple Silicon M-Series)** and **Linux (x86_64 / aarch64)**.

---

## 1. Homebrew (macOS — Recommended)

The fastest and most reliable way to install and maintain the entire organ cluster on macOS is via the official Homebrew tap:

```bash
# 1. Tap the official Autonomic formula registry
brew tap autonomic-ai-dev/tap

# 2. Install the full cluster suite (all 11 organs + CLI)
brew install autonomic-stack

# Or install individual organ daemons independently:
brew install agent-body
brew install agent-brain
brew install agent-spine
brew install agent-muscle
brew install agent-immune
brew install agent-heart
brew install agent-nerves
brew install agent-mouth
brew install agent-eyes
brew install agent-tui
```

---

# 2. Automated Bootstrap Script (macOS & Linux)

For headless CI runners or Linux systems without Homebrew, use the automated installer:

```bash
curl -fsSL https://raw.githubusercontent.com/autonomic-ai-dev/agent-body/master/scripts/install-all-organs.sh | bash
```

#### Dynamic Patch Resolution
The installer aligns with the ecosystem baseline (defaulting to `v1.0.0-beta.3`) while dynamically discovering compatible patch releases per organ (e.g. automatically pulling `v1.0.0-beta.3.1` for `agent-brain` without requiring an ecosystem-wide major bump).

This installer:
1. Detects host operating system and target architecture (`darwin-arm64`, `linux-x86_64`, `linux-aarch64`).
2. Queries the GitHub Releases API to resolve the newest compatible patch release per organ for the current baseline.
3. Downloads notarized release archives from GitHub Releases.
4. Installs binaries into `~/.local/bin/` (ensuring permissions and `PATH`).
5. On macOS, automatically clears Gatekeeper quarantine flags (`xattr -dr com.apple.quarantine ~/.local/bin/agent-*`).
6. Validates installation integrity via `autonomic doctor --quick`.
7. Bootstraps integration packages using `agent-brain package add @supervisor` and `agent-brain package add @starter`.

---

## 3. Workspace Initialization & Launch

Once installed, initialize your local environment and boot the cluster:

```bash
# 1. Scaffold ~/.autonomic/ configuration and data directories
autonomic init

# 2. Run system doctor to verify environment, ports, and permissions
autonomic doctor

# 3. Boot the cluster as background daemons
autonomic start

# 4. Inspect running organ matrix
autonomic status
```

---

## 4. Building from Source

To compile from source using modern Rust (1.82+):

```bash
# Clone the repository
git clone https://github.com/autonomic-ai-dev/autonomic-ai-dev.git
cd autonomic-ai-dev

# Build all organs in release mode
cargo build --release --workspace

# Copy binaries to your system PATH
cp target/release/agent-* ~/.local/bin/
```
