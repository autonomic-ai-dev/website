---
title: tekmor installation
---

# tekmor installation

tekmor is one binary. Homebrew provides a pre-built binary for **macOS (Apple Silicon)**. crates.io and building from source work on any platform Rust supports.

## 1. Install

Homebrew:

```bash
brew tap autonomic-ai-dev/tap
brew install tekmor
```

crates.io:

```bash
cargo install tekmor
```

From source:

```bash
git clone https://github.com/autonomic-ai-dev/tekmor
cd tekmor
cargo build --release -p tekmor
```

## 2. Register the gates in Claude Code

```bash
tekmor install            # writes .claude/settings.json in the project
tekmor install --global   # writes ~/.claude/settings.json
```

The hooks record the absolute path of the binary. If you move or rebuild the binary somewhere else, run `tekmor install` again.

## 3. Create an allowlist in your project

```bash
tekmor verify init
```

This creates `.verify/` with a `verify.toml` allowlist. Only the commands listed there can be recorded as proof.
