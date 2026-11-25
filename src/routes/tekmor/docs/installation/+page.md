---
title: 'Install tekmor: Homebrew, Cargo, source build, and hook setup'
description: 'Install tekmor as a standalone binary on macOS or any platform with Rust. Covers Homebrew tap, crates.io, source compilation, and Claude Code hook registration.'
canonical: https://tekmor.autonomic-ai.dev/docs/installation
product: tekmor
group: Start
---

# Install tekmor: Homebrew, Cargo, source build, and hook setup

> Install tekmor as a standalone binary on macOS or any platform with Rust. Covers Homebrew tap, crates.io, source compilation, and Claude Code hook registration.

`tekmor` ships as a single compiled binary. The published binary is arm64 macOS; `cargo install` builds on any platform supported by Rust.

## Requirements

| Surface             | Requirement                  | Details                                                  |
| :------------------ | :--------------------------- | :------------------------------------------------------- |
| **Homebrew binary** | macOS (Apple Silicon, arm64) | Published via `autonomic-ai-dev/tap`                     |
| **Cargo install**   | Rust toolchain               | Standard crates.io build                                 |
| **Source build**    | Rust toolchain, Git          | `cargo build --release -p tekmor`                        |
| **Git repository**  | Git                          | Receipts bind to the HEAD commit and uncommitted changes |

---

## Unified Installation

### macOS (Apple Silicon — Recommended)

```bash
brew install autonomic-ai-dev/tap/tekmor
```

Verify the binary is installed:

```bash
tekmor --version
# Output: 2.0.0
```

To update when a new version is released:

```bash
brew update && brew upgrade tekmor
tekmor install   # hooks embed the binary path; re-run after upgrading
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

## Host Integration

| Agent / Host             | Command                             |  Protection Mode  | Behavior                                                                              |
| :----------------------- | :---------------------------------- | :---------------: | :------------------------------------------------------------------------------------ |
| **Claude Code**          | `tekmor install`                    | **Active Gates**  | Registers `Stop` and `PreToolUse` (matcher `Bash`) hooks in `.claude/settings.json`.  |
| **Claude Code (Global)** | `tekmor install --global`           | **Active Gates**  | Writes machine-wide hooks to `~/.claude/settings.json`.                               |
| **Other agents**         | Call `tekmor verify` from any shell | **Receipts only** | Runs and receipts work anywhere; their gates need host hooks tekmor does not install. |
| **GitHub Actions CI**    | `.github/workflows/receipt.yml`     |   **CI Check**    | Reruns the allowlisted checks and publishes the receipt in the job summary.           |

---

## What `tekmor install` Configures

Running `tekmor install` writes two hook entries into `.claude/settings.json` (or `~/.claude/settings.json` with `--global`):

```json
{
	"hooks": {
		"PreToolUse": [
			{
				"hooks": [
					{
						"command": "'/opt/homebrew/bin/tekmor' bash-gate",
						"timeout": 30,
						"type": "command"
					}
				],
				"matcher": "Bash"
			}
		],
		"Stop": [
			{
				"hooks": [
					{
						"command": "'/opt/homebrew/bin/tekmor' stop-gate",
						"timeout": 660,
						"type": "command"
					}
				]
			}
		]
	}
}
```

- **Stop Hook (`tekmor stop-gate`)**: Fires before Claude Code returns control to the user. A turn that changed code or claims a pass without a `PASSED` receipt for the current code is blocked.
- **Bash Gate (`tekmor bash-gate`)**: Fires before the agent executes a shell command. Blocks or warns on risky commands, and nudges a bare allowlisted command toward `tekmor verify`.
- **Commit Gate (`tekmor commit-gate`)**: A PreToolUse hook that refuses commits that skip git hooks.

> **Important**: The registered hooks record the absolute path of the `tekmor` binary. If you move, upgrade, or rebuild the binary, run `tekmor install` again to update the paths.

---

## Initialize Verification in Your Repository

From the root of any git repository:

```bash
tekmor verify init
```

Output:

```
Initialized verification suite in /path/to/repo/.verify
```

`tekmor` detects your repository tooling and writes `.verify/verify.toml`. A Rust repository gets:

```toml
[verify]
commands = [
  "cargo test",
  "cargo clippy",
  "cargo check",
  ".verify/run.sh ...",
]

[verify.default]
command = ["cargo", "test"]
timeout_secs = 300
```

---

## Diagnostics with `tekmor doctor`

Run `tekmor doctor` to check the setup the gates depend on—hooks, git, the allowlist, the store and feature-map drift:

```bash
tekmor doctor
```

Output:

```
ok   hooks      /Users/you/.claude/settings.json runs /opt/homebrew/bin/tekmor
ok   hooks      /Users/you/.claude/settings.json runs /opt/homebrew/bin/tekmor
ok   git        repository /path/to/repo
ok   git        HEAD 2a424911d7015dc3f08987aaf8fe39f7cca3bacd
ok   allowlist  `sh -c true` resolves to `sh`
ok   allowlist  `cargo test` resolves to `cargo`
ok   store      writable /Users/you/.autonomic/memory/data/brain.db
ok   drift      feature maps match the code and the allowlist
```

---

## Removing tekmor

There is no `tekmor uninstall` command. To remove tekmor:

1. Delete the `stop-gate` and `bash-gate` hook entries from `.claude/settings.json` (and `~/.claude/settings.json` if you installed with `--global`).
2. Remove the binary: `brew uninstall tekmor`, or `cargo uninstall tekmor` if installed via Cargo.
3. Optionally delete `.verify/` in your repository to remove the allowlist and stored artifacts.

## Next Step

- Read [Verification and Receipts](verification) to understand how receipts bind to the commit and code hash.
