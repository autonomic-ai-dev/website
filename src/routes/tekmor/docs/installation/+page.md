---
title: "Install tekmor: Homebrew, Cargo, source build, and hook matrix"
description: "Install tekmor as a standalone binary on macOS, Linux, or CI. Covers Homebrew tap, crates.io, source compilation, Claude Code hook registration, and host support matrix."
canonical: https://tekmor.autonomic-ai.dev/docs/installation
product: tekmor
group: Start
---

# Install tekmor: Homebrew, Cargo, source build, and hook matrix

> Install tekmor as a standalone binary on macOS, Linux, or CI. Covers Homebrew tap, crates.io, source compilation, Claude Code hook registration, and host support matrix.

`tekmor` ships as a single compiled binary with zero external runtime dependencies. Pre-built binaries cover macOS on Apple Silicon (arm64). Source builds work on any platform supported by Rust.

## Requirements

| Surface | Requirement | Details |
| :--- | :--- | :--- |
| **Homebrew binary** | macOS 13+ (Apple Silicon) | Published via `autonomic-ai-dev/tap` |
| **Cargo install** | Rust 1.80+ | Standard crates.io build |
| **Source build** | Rust 1.80+, Git | `cargo build --release -p tekmor` |
| **Git repository** | Git 2.30+ | Required for tree SHA calculation and receipt signing |

---

## Unified Installation

### macOS (Apple Silicon — Recommended)

```bash
brew tap autonomic-ai-dev/tap
brew install tekmor
```

Verify the binary is installed:

```bash
tekmor --version
# Output: tekmor 1.0.0
```

To update when a new version is released:

```bash
brew update && brew upgrade tekmor
```

### crates.io (Any Platform)

```bash
cargo install tekmor
```

### Compile from Source

```bash
git clone https://github.com/autonomic-ai-dev/tekmor.git
cd tekmor
cargo build --release -p tekmor
cp target/release/tekmor /usr/local/bin/
```

---

## Host Integration Matrix

`tekmor` integrates directly into coding agents to intercept tool calls and block unverified turn completions.

| Agent / Host | Command | Protection Mode | Behavior |
| :--- | :--- | :---: | :--- |
| **Claude Code** | `tekmor install` | **Active Gates** | Registers `Stop` gate and `PreToolUse` bash gate in `.claude/settings.json`. |
| **Claude Code (Global)** | `tekmor install --global` | **Active Gates** | Configures machine-wide hooks in `~/.claude/settings.json`. |
| **Cursor** | `tekmor install --cursor` | **Instructions + CLI** | Generates `.cursorrules` with allowlist constraints; receipts checked via terminal. |
| **Codex CLI** | `tekmor install --codex` | **Instructions + CLI** | Wires session startup prompt to enforce `tekmor verify`. |
| **Gemini CLI** | `tekmor install --gemini` | **Instructions + CLI** | Generates extension rule configuration. |
| **GitHub Actions CI** | Included in `.github/workflows/receipt.yml` | **CI Hard Gate** | Executes in clean room; blocks PR merges without a passing receipt. |

---

## What `tekmor install` Configures

Running `tekmor install` edits `.claude/settings.json` (or `~/.claude/settings.json` with `--global`) to register two native hooks:

```json
{
  "hooks": {
    "Stop": [
      {
        "command": "/opt/homebrew/bin/tekmor stop-gate"
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "/opt/homebrew/bin/tekmor bash-gate"
      }
    ]
  }
}
```

- **Stop Hook (`tekmor stop-gate`)**: Fires before Claude Code returns control to the user. If the assistant claims tests passed, but `.verify/receipt.json` lacks a `PASSED` receipt for the current tree SHA, the turn is blocked.
- **Bash Gate (`tekmor bash-gate`)**: Fires before the agent executes a shell command. It verifies that the candidate command is declared in `.verify/verify.toml`.

> **Important**: The registered hooks record the absolute path of the `tekmor` binary. If you move, upgrade, or rebuild the binary, run `tekmor install` again to update the paths.

---

## Initialize Verification in Your Repository

From the root of any git repository:

```bash
tekmor verify init
```

This generates `.verify/verify.toml`. `tekmor` auto-detects your repository tooling and populates initial trusted commands:

```toml
[verify]
version = "1.0.0"
timeout_seconds = 60

[[commands]]
name = "test"
run = "cargo test --all-features"
flaky_repeat = 3

[[commands]]
name = "lint"
run = "cargo clippy -- -D warnings"
```

---

## Diagnostics with `tekmor doctor`

Run `tekmor doctor` to verify your environment setup:

```bash
tekmor doctor
```

Output:
```
✔ tekmor binary: /opt/homebrew/bin/tekmor (v1.0.0)
✔ Git repository detected: branch 'main' (commit a8f3b12)
✔ .verify/ directory exists with valid verify.toml
✔ Claude Code hooks registered in .claude/settings.json
✔ Zero network listeners active
```

---

## Uninstalling tekmor

To remove `tekmor` and its registered hooks:

```bash
tekmor uninstall          # Removes hooks from .claude/settings.json
brew uninstall tekmor     # Removes the binary via Homebrew
rm -rf .verify/           # Optional: removes repository verification config and receipts
```

## Next Step

- Read [Verification and Receipts](verification) to understand cryptographic tree hashing and proof verdicts.
