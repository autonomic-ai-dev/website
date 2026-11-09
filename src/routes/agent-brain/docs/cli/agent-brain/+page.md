---
title: agent-brain CLI reference
---

# agent-brain CLI reference

Every command below is printed by the `agent-brain` binary. Each block is the output of `agent-brain COMMAND --help` for release 1.0.0-rc8, so flags and examples match what you see in your terminal. For a short list, see the [CLI overview](/docs/cli).

## Common workflows

Install, connect your editors, and check the install:

```bash
brew tap autonomic-ai-dev/tap
brew install agent-brain
agent-brain install --global
agent-brain doctor
```

Record a verify run for the current commit, then read the receipt. Exit status is 0 only when the receipt says PASSED:

```bash
agent-brain verify -- cargo test
agent-brain verify receipt --markdown
```

Add a skill package and check what is installed:

```bash
agent-brain package add @matt-skills
agent-brain package list
```

Read the last route summary and the local metrics:

```bash
agent-brain briefing
agent-brain stats --days 7
```

---

### agent-brain serve

```text
Usage:  agent-brain serve

Start the MCP server on stdio.

Cursor (and other hosts) launch this automatically after install —
you usually do not run serve yourself.

```

### agent-brain install

```text
Usage:  agent-brain install [OPTIONS]

Configure MCP + hooks for an editor host.

Options:
      --global              User/global scope (where supported)
      --reload              Refresh Cursor MCP entry after install
      --claude-desktop      Claude Desktop MCP config
      --vscode              VS Code mcp.json (workspace or --global)
      --claude-code         Claude Code .mcp.json / ~/.claude.json
      --opencode            OpenCode opencode.json
      --codex               Codex config.toml + hooks.json
      --gemini              Gemini CLI settings.json
      --antigravity         Antigravity mcp_config.json
      --all                 All of the above (user/global scope)
      --starter             Also install the @starter pack

Examples:
  agent-brain install --global
  agent-brain install --all --global
  agent-brain install --claude-code --global

```

### agent-brain doctor

```text
Usage:  agent-brain doctor [OPTIONS]

Check MCP install, binary, hooks, and codesign.

Options:
      --fix       Re-sign binary (macOS), align mcp.json, refresh hooks

```

### agent-brain package

```text
Usage:  agent-brain package COMMAND [OPTIONS]

Manage installed skill and prompt packages.

Commands:
  add <source> [--ref <git_ref>] [--no-index]
                    Install a package (@alias, owner/repo, or GitHub URL)
  list              List all installed packages and their local paths
  update [name]     Update one package, or all if name omitted
  remove <name>     Remove an installed package and purge indexed items

Examples:
  agent-brain package add @matt-skills
  agent-brain package add anthropics/skills
  agent-brain package list
  agent-brain package remove matt-skills

```

### agent-brain mcp

```text
Usage:  agent-brain mcp COMMAND [OPTIONS]

Manage upstream MCP servers, dynamic tool indexing, and schemas.

Commands:
  list                          List registered MCP servers, statuses, and tool counts
  add <name> -- <cmd> [args...] Register a new upstream MCP server and index its tools
  remove <name>                 Remove a registered MCP server and purge its tools
  sync                          Re-query all servers and refresh vector tool catalog
  test <name>                   Probe connection and list available tool schemas

Examples:
  agent-brain mcp add github -- npx -y @modelcontextprotocol/server-github
  agent-brain mcp add postgres --env=DATABASE_URL=postgres://... -- npx -y @modelcontextprotocol/server-postgres
  agent-brain mcp list
  agent-brain mcp test github
  agent-brain mcp sync

```

### agent-brain index

```text
Usage:  agent-brain index [OPTIONS]

Reindex skills, rules, and memory from installed packages + home.

Options:
  -c, --changed-only   Skip files whose mtime is unchanged
      --no-ast         Skip AST symbol extraction

```

### agent-brain briefing

```text
Usage:  agent-brain briefing

Print the last human-readable route summary
(~/.agent_brain/logs/last-route.md).

```

### agent-brain onboarding

```text
Usage:  agent-brain onboarding

Print the USP tagline and a 5-minute getting-started checklist.

```

### agent-brain version

```text
Usage:  agent-brain version
        agent-brain --version

Print the installed agent-brain version.

```

### agent-brain config

```text
Usage:  agent-brain config COMMAND

Commands:
  init    Write ~/.agent_brain/config.yaml defaults
  show    Print the active config file path / contents

```

### agent-brain mode

```text
Usage:  agent-brain mode COMMAND

Commands:
  paths                 List mode files per host
  show                  Print the mode snippet (markdown)
  install [--global]    Install mode files for all hosts

```

### agent-brain update

```text
Usage:  agent-brain update [OPTIONS]

Run auto-update (release redirect; API fallback uses GITHUB_TOKEN/GH_TOKEN).

Options:
      --force       Force update even if already current
      --mcp-only    Only refresh MCP / hook wiring

```

### agent-brain secrets

```text
Usage:  agent-brain secrets COMMAND

Keychain secret refs for upstream MCP.

Commands:
  status              Show configured secret refs
  setup               Interactive setup for missing secrets
  add <name> <value>  Store a secret in the keychain

```

### agent-brain export

```text
Usage:  agent-brain export [dir]

Export a sync bundle (manifest + facts.jsonl).
Default dir: ~/.agent_brain/export/

```

### agent-brain import

```text
Usage:  agent-brain import <dir> [--policy POLICY]

Import a sync bundle.

Options:
      --policy POLICY   Conflict policy (default: newer_wins)

```

### agent-brain sync

```text
Usage:  agent-brain sync COMMAND

Git / cloud sync and conflict restore.

Commands:
  status                      Git sync + recent conflicts summary
  restore <conflict-id>       Re-promote a fact from conflict_log
  git init [--remote URL]     Init ~/.agent_brain/sync git repo
  git clone [--remote URL]    Clone sync repo on a second machine
  git push                    Export bundle, commit, push
  git pull                    Pull and import bundle
  git status                  Show git sync repo state
  cloud push|pull             Encrypted cloud sync (S3 / local)

```

### agent-brain sessions

```text
Usage:  agent-brain sessions COMMAND

Commands:
  ingest [--source SRCS] [--legacy]
      Import session digests (cursor,codex,gemini,opencode)
  status
      Discoverable vs stored session digests

Options:
      --source SRCS   Comma-separated sources (default: all known)
      --legacy        Include legacy digest paths

```

### agent-brain bootstrap

```text
Usage:  agent-brain bootstrap [--remote URL] [--skip-install]

Join this device to a shared sync repo. Without --remote, uses sync.git.remote from config.yaml.

```

### agent-brain memory

```text
Usage:  agent-brain memory COMMAND

Commands:
  gc [--apply] [--force] [--stale-days N] [--very-stale-days N]
      Archive stale facts (dry-run by default; pass --apply to write)
  observe
      Run observation pass over recent activity
  extract
      Explain / extract pending traces

See also: agent-brain gc

```

### agent-brain gc

```text
Usage:  agent-brain gc [OPTIONS]

Run DB garbage collection: dedup, prune, vacuum.

Options:
      --min-confidence N   Drop facts below this confidence
      --max-age-days N     Age hint for prune (reserved)

See also: agent-brain memory gc

```

### agent-brain suggest-memory

```text
Usage:  agent-brain suggest-memory [approve|reject]

Show or promote a pending hook anti-pattern suggestion
into store_memory.

Commands:
  (default)   Show pending suggestion
  approve     Commit suggestion as memory
  reject      Discard pending suggestion

```

### agent-brain promote

```text
Usage:  agent-brain promote COMMAND

Skill promotion workflow (human approval required).

Commands:
  list [--status pending|approved|rejected]
  approve <staging-id>
  reject <staging-id>

```

### agent-brain recall

```text
Usage: agent-brain recall [QUERY WORDS] [--tag TAG ...] [--limit N] [--since 30d|12h|90m] [--semantic] [--min-score F] [--json]

Read stored facts. Tags match a fact's topic or any of its tags.
Without a query, facts come back newest first with score null.
With a query, facts sharing a token with it come back scored by token overlap.
With --semantic, the query is embedded and facts are scored by cosine similarity
against their stored embeddings. Use --min-score to keep only close matches
(for repeat checks, for example `recall "<topic>" --tag posted --since 30d --semantic --min-score 0.8`).
Empty results print [] with exit 0. --limit is 1 to 200, default 20.
Conventional tags: voice (writing samples), posted (approved posts), project.
```

### agent-brain remember

```text
Usage: agent-brain remember --text TEXT --tag TAG [--tag TAG ...] [--source SOURCE]

Store one fact. The first tag becomes its topic, and every tag is recorded.
The text is embedded with the same model as MCP writes. Secret-shaped text and
text over 20,000 characters are refused. Text that is already stored returns the
existing id with deduplicated true. There is no word cap for shell writes.
Conventional tags: voice (writing samples), posted (approved posts), project.
```

### agent-brain import-corpus

```text
Usage: agent-brain import-corpus DIR --tag TAG [--tag TAG ...]

Store each paragraph of every *.md file under DIR. Paragraphs are split on blank
lines, and each fact's source is FILE#paragraph-N. Paragraphs already stored
(by content hash) are skipped. Secret-shaped and over-long paragraphs are
counted in the report and not stored.
```

### agent-brain stats

```text
Usage:  agent-brain stats [OPTIONS]

Local index / routing / latency metrics (not product ROI claims).

Options:
      --days N    Lookback window (default: 7)
      --json      Machine-readable JSON
      --markdown  Shareable summary of measured figures only, for a weekly update

```

### agent-brain dashboard

```text
Usage:  agent-brain dashboard [OPTIONS]

Write a local HTML metrics page (routes, latency, activity).

Options:
      --days N    Lookback window (default: 7)
      --open      Open the HTML file in the default browser

```

### agent-brain inspect

```text
Usage:  agent-brain inspect COMMAND

Commands:
  log [--last] [--limit N]   List retrieval logs (route_task output)
  fact <id>                  Show a stored memory fact
  conflicts [--limit N]      Topic supersession conflict log

```

### agent-brain learn

```text
Usage:  agent-brain learn COMMAND

Ingest allowlisted docs into skills + memory.

Commands:
  url <https-url> [--topic NAME] [--dry-run]
  allowlist | domains
      Show docs.allowed_domains from config

```

### agent-brain log

```text
Usage:  agent-brain log <name> [--follow]
        agent-brain log --list

Print or follow a named log under the agent-brain home.

Options:
      --follow    Tail the log
      --list      List available logs

```

### agent-brain verify

```text
Usage:  agent-brain verify [OPTIONS] -- <cmd> [args...]
        agent-brain verify init [--force] [--dir <DIR>]
        agent-brain verify record --exit N [OPTIONS] -- <cmd summary...>
        agent-brain verify run [--project <DIR>] [--json]
        agent-brain verify receipt [--project <DIR>] [--markdown|--json]

Run an allowlisted verification command and record trusted outcome.

Subcommands:
  init                  Initialize .verify/ directory with verify.toml and run.sh template
  record                Record already-known exit code without executing
  run                   Run the [verify.default] step declared in verify.toml, with its timeout
  receipt               Show whether the current commit and code state passed its verify run.
                        Exit 0 only when PASSED. --markdown prints a block to paste into a PR.

Options:
      --source <SOURCE>    Outcome source: cli (default) or orchestrator (spine/muscle)
      --config <PATH>      Path to config to hash for drift detection
      --scenarios <DIR>    Path to scenario dir (defaults to .verify/ in ancestor)
      --route-log-id <ID>  Route log ID that prompted this verification
      --cause <TAG>        Failure cause tag (defaults to cmd if exit non-zero)
      --force              Overwrite existing .verify files during init
      --dir <DIR>          Target project directory for init (defaults to cwd)

Allowlist:
  Configured in .verify/verify.toml or verify.toml under project root.
  Default fallback matches common test runners (cargo test, pytest, make test, .verify/).

```

### agent-brain report

```text
Usage:  agent-brain report

Print the verify report by source.

```

### agent-brain status

```text
Usage:  agent-brain status

Show brain status for the current directory.

```

### agent-brain rules

```text
Usage:  agent-brain rules [list | add KEY=VALUE... | remove ID | reset]

Command rules for the Bash gate. Run these yourself; agents cannot change rules.

```

### agent-brain ext

```text
Usage:  agent-brain ext [list | add NAME | remove NAME]

Install or remove an extension.

```

### agent-brain memorable

```text
Usage:  agent-brain memorable [status | enable [--capture] | disable | list | capture TRACE.json | capture-transcript ...]

Optional Memorable integration. With --capture, verified sessions are sent to Memorable's extraction service.

```

### agent-brain feature-graph

```text
Usage:  agent-brain feature-graph [DIR]

Print the feature maps as a JSON graph of nodes, sub-features, code
paths, and [[wikilink]] edges. DIR defaults to .verify/features.

```

## Extensions

`agent-brain ext` installs and removes extensions. An extension adds commands that the core binary does not ship on its own.

```text
agent-brain ext list          # show installed extensions
agent-brain ext add NAME      # install an extension by name
agent-brain ext remove NAME   # remove an installed extension
```

The help text names `graphify`, a codebase graph, as installed with `agent-brain ext add graphify`. The bench extension provides `eval`, the recall gates. Commands that reach `https://skills.sh`, such as the `skills-sh` refresh, do so only when you run them. Extensions are listed as network paths in the egress statement, so review that before you install one.
