---
title: agent-brain CLI Reference
---

# `agent-brain` CLI Reference

`agent-brain` is the local context, memory, and MCP router for the Autonomic ecosystem. It features an embedded SQLite vector database with HNSW indexing, an upstream Model Context Protocol (MCP) tool gateway, curated skill package management, and turn-by-turn prompt routing.

---

## Synopsis

```bash
agent-brain [OPTIONS] <COMMAND>
```

When invoked without subcommands, `agent-brain` defaults to launching the stdio MCP server for agent hosts.

---

## Global Options

| Flag | Short | Type | Description |
| :--- | :--- | :--- | :--- |
| `--help` | `-h` | Boolean | Display command syntax, available subcommands, or help for a specific command. |
| `--version` | `-V` | Boolean | Print the installed `agent-brain` version and exit. |

---

## Command Groups

```mermaid
flowchart LR
    Root["agent-brain"] --> Common["Common"]
    Root --> Pkg["Packages & MCP"]
    Root --> Config["Configuration"]
    Root --> Memory["Memory & Sync"]
    Root --> Ops["Operations"]
    Root --> Extras["Extras (Advanced)"]

    Common --> serve["serve · install · doctor · briefing"]
    Pkg --> package["package add/list/update/remove\nmcp add/list/sync/test\nregistry list/sync"]
    Config --> config["config init/show · mode · secrets"]
    Memory --> sync["sync git/cloud · export/import · gc"]
    Ops --> ops["stats · dashboard · inspect · learn · verify"]
    Extras --> extras["graphify · distill · dataset · eval · grpc"]

    classDef default fill:#0d0d0d,stroke:rgba(255,255,255,0.2),stroke-width:1px,color:#f4f4f5;
```

---

## Common Commands

### `serve`

Start the MCP server over standard input/output (`stdio`).

```bash
agent-brain serve
```

> [!NOTE]
> Agent hosts (Cursor, Claude Desktop, Antigravity) launch `agent-brain serve` automatically. Manual execution is typically reserved for debugging via the MCP Inspector.

---

### `install`

Configure MCP connections and editor hooks for supported agent hosts.

```bash
agent-brain install [OPTIONS]
```

#### Options

| Flag | Type | Description |
| :--- | :--- | :--- |
| `--global` | Boolean | Install into global/user editor directories instead of workspace level. |
| `--reload` | Boolean | Refresh Cursor MCP entry signature after updating the binary. |
| `--claude-desktop` | Boolean | Configure Claude Desktop (`claude_desktop_config.json`). |
| `--vscode` | Boolean | Configure VS Code (`.vscode/mcp.json`). |
| `--claude-code` | Boolean | Configure Claude Code CLI (`~/.claude.json`). |
| `--opencode` | Boolean | Configure OpenCode (`opencode.json`). |
| `--codex` | Boolean | Configure Codex (`config.toml` + `hooks.json`). |
| `--gemini` | Boolean | Configure Gemini CLI (`settings.json`). |
| `--antigravity` | Boolean | Configure Google Antigravity (`mcp_config.json`). |
| `--all` | Boolean | Install across all detected editor platforms simultaneously. |
| `--starter` | Boolean | Automatically install the `@starter` skill pack during setup. |

#### Examples

```bash
# Global configuration across all supported editors
agent-brain install --all --global

# Install with starter skills for Cursor
agent-brain install --global --starter
```

---

### `doctor`

Audit local installation, binary codesigning, MCP client configurations, and upstream tool schemas.

```bash
agent-brain doctor [OPTIONS]
```

#### Options

| Flag | Type | Description |
| :--- | :--- | :--- |
| `--fix` | Boolean | Re-sign macOS binary, align `mcp.json`, and regenerate hook symlinks. |
| `--mcp` | Boolean | Audit the `agent-body` gateway schemas and execute a `tools/list` probe, if an agent-body gateway is configured. |

---

### `briefing`

Print the last human-readable routing summary (`~/.agent_brain/logs/last-route.md`).

```bash
agent-brain briefing
```

Outputs the exact memory items, verified skills, and prompt additions selected for the most recent user turn.

---

### `onboarding`

Print the getting-started checklist and verification workflow.

```bash
agent-brain onboarding
```

---

## Package & MCP Commands

### `package`

Manage installed skill packs, domain rules, and workflow definitions.

```bash
agent-brain package <COMMAND>
```

#### Subcommands

| Subcommand | Syntax | Description |
| :--- | :--- | :--- |
| `add` | `agent-brain package add <source> [--ref <ref>] [--no-index]` | Install a package from `@alias`, `owner/repo`, or GitHub URL. |
| `list` | `agent-brain package list` | List all installed packages and local filesystem locations. |
| `update` | `agent-brain package update [name]` | Update a single package, or all packages if name is omitted. |
| `remove` | `agent-brain package remove <name>` | Delete an installed package and purge indexed vectors from SQLite. |

#### Options for `package add`

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--ref` | String | `main` | Git branch, tag, or commit hash to check out. |
| `--no-index` | Boolean | `false` | Clone package repository without immediately re-indexing vector embeddings. |

#### Examples

```bash
# Canonical package installation
agent-brain package add @agstack
agent-brain package add @starter
agent-brain package add anthropics/skills --ref v2.0
agent-brain package list
agent-brain package remove starter
```

> [!TIP]
> `agent-brain add <pkg>` is fully supported as a convenient top-level alias for `agent-brain package add`.

---

### `mcp`

Manage external upstream Model Context Protocol (MCP) servers, tool indexing, and schemas directly through `agent-brain`.

```bash
agent-brain mcp <COMMAND>
```

#### Subcommands

| Subcommand | Syntax | Description |
| :--- | :--- | :--- |
| `list` | `agent-brain mcp list` | Display all registered servers, active status, and discovered tool counts. |
| `add` | `agent-brain mcp add <name> [--env KEY=VAL] -- <cmd> [args...]` | Register an external MCP server and index its tools into SQLite. |
| `remove` | `agent-brain mcp remove <name>` | Unregister an upstream MCP server and purge its tools from vector memory. |
| `sync` | `agent-brain mcp sync` | Re-query all registered servers and refresh vector tool embeddings. |
| `test` | `agent-brain mcp test <name>` | Probe stdio connection and print tool schemas with descriptions. |

#### Examples

```bash
# Register GitHub MCP server
agent-brain mcp add github -- npx -y @modelcontextprotocol/server-github

# Register Postgres MCP server with environment variables
agent-brain mcp add postgres --env DATABASE_URL=postgres://localhost:5432/app -- npx -y @modelcontextprotocol/server-postgres

# Register Linear remote MCP server with OAuth proxy
agent-brain mcp add linear -- npx -y mcp-remote https://mcp.linear.app/mcp

# Probe connection and view available tools
agent-brain mcp test github

# Test upstream connectivity and verify argument schema for a specific tool
agent-brain mcp test linear --tool save_issue

# Refresh tool catalog and index tool descriptions into vector memory
agent-brain mcp sync

# Display turn telemetry token usage and prompt cache savings
agent-brain stats --telemetry
```

---

### `registry`

Explore and synchronize curated community `@aliases`.

```bash
agent-brain registry <COMMAND>
```

#### Subcommands

| Subcommand | Syntax | Description |
| :--- | :--- | :--- |
| `list` | `agent-brain registry list [--kind KIND]` | List curated packages, utilities, and workflows (`--kind skill_package\|utility\|workflow`). |
| `sync` | `agent-brain registry sync` | Dynamically pull the central registry (`agent-registry`) into local cache, update package manifests, and automatically index workflows into SQLite. |

#### Examples

```bash
# Sync central registry repository and auto-index workflows into SQLite
agent-brain registry sync

# List all available curated items
agent-brain registry list

# List only available workflows
agent-brain registry list --kind workflow

# Install the gold-standard agstack engineering package
agent-brain package add @agstack
```

> [!NOTE]
> `agent-brain registry sync` automatically executes vector indexing across all discovered workflow files (`workflows/*.yaml`) without requiring a separate manual indexing command. Packages like `@agstack` are decoupled from binary compilation and downloaded on demand to keep binary sizes minimal.

---

## Configuration Commands

### `config`

Manage the core configuration at `~/.agent_brain/config.yaml`.

```bash
agent-brain config <init|show>
```

- `init`: Generates clean configuration defaults with sensible token limits and paths.
- `show`: Prints active configuration values and file resolution path.

---

### `mode`

Inspect and install editor mode snippets.

```bash
agent-brain mode <paths|show|install> [--global]
```

- `paths`: Output file paths for system prompt injection across editors.
- `show`: Output the Autonomic system prompt rules markdown to stdout.
- `install`: Synchronize system prompt files across all supported IDEs.

---

### `secrets`

Manage macOS Keychain secret references for upstream MCP servers.

```bash
agent-brain secrets <status|setup|add>
```

- `status`: Show configured keychain references without leaking values.
- `setup`: Interactive guided prompt for missing upstream API tokens.
- `add <name> <value>`: Store a secret securely in the OS keychain.

---

## Memory & Synchronization Commands

### `sync`

Distributed context synchronization via Git or encrypted cloud storage.

```bash
agent-brain sync <COMMAND>
```

#### Subcommands

| Subcommand | Description |
| :--- | :--- |
| `status` | Summary of sync state, remote commit, and unresolved conflicts. |
| `restore <conflict_id>` | Re-promote a discarded fact from `conflict_log`. |
| `git init [--remote URL]` | Initialize `~/.agent_brain/sync` local Git repository. |
| `git clone --remote URL` | Clone context repository on a secondary developer machine. |
| `git push` | Export state bundle, commit, and push to remote. |
| `git pull` | Pull remote bundle, merge facts, and re-index vector space. |
| `cloud push\|pull` | Encrypted S3/R2/MinIO cloud sync. |

---

### `memory`

Observe, extract, and maintain the vector knowledge graph.

```bash
agent-brain memory <COMMAND>
```

#### Subcommands

| Subcommand | Options | Description |
| :--- | :--- | :--- |
| `gc` | `[--apply] [--force] [--stale-days N]` | Archive stale, unreferenced memory facts (dry-run by default; `--apply` writes). |
| `observe` | — | Run observation pass over recent turn interactions. |
| `extract` | — | Extract candidate skills and invariant facts from execution traces. |

---

### `suggest-memory`

Review and promote pending hook anti-pattern suggestions into durable memory.

```bash
agent-brain suggest-memory [approve|reject]
```

---

### `promote`

Human approval gate for newly generated skills before inclusion in routing.

```bash
agent-brain promote <list|approve|reject> <staging_id>
```

---

## Memory Facts

Read, write, and import facts from the shell. These commands use the same store as the MCP tools, so a fact written here is visible to every connected host.

### `recall`

Read stored facts, by text, tag, or meaning.

```bash
agent-brain recall [QUERY WORDS] [--tag TAG ...] [--limit N] [--since 30d|12h|90m] [--semantic] [--min-score F] [--json]
```

- Without a query, facts come back newest first with score `null`.
- With a query, facts sharing a token with it are scored by token overlap.
- `--semantic` embeds the query and scores facts by cosine similarity. `--min-score` keeps only close matches.
- Tags match a fact's topic or any of its tags. `--limit` is 1 to 200, default 20. Empty results print `[]` with exit 0.

```bash
agent-brain recall "release notes" --tag posted --since 30d --semantic --min-score 0.8
```

---

### `remember`

Store one fact.

```bash
agent-brain remember --text TEXT --tag TAG [--tag TAG ...] [--source SOURCE]
```

- The first tag becomes the fact's topic, and every tag is recorded.
- Secret-shaped text and text over 20,000 characters are refused.
- Text that is already stored returns the existing id with `deduplicated: true`.

---

### `import-corpus`

Store every paragraph of a folder of Markdown files.

```bash
agent-brain import-corpus DIR --tag TAG [--tag TAG ...]
```

- Paragraphs are split on blank lines. Each fact's source is `FILE#paragraph-N`, so a reviewer can open the original.
- Paragraphs already stored, matched by content hash, are skipped. Running the same import twice creates no new facts.
- Secret-shaped and over-long paragraphs are counted in the report and not stored.

---

## Extensions & Memorable

### `ext`

Install optional subcommands from the agent-registry. Each extension is a separate executable, so the core binary stays small.

```bash
agent-brain ext list
agent-brain ext add <NAME>
agent-brain ext remove <NAME>
```

- `ext add` downloads the build for this platform, checks its SHA-256 against the registry manifest, and installs it under the brain home.
- An installed extension runs as a subcommand, for example `agent-brain bench` after `agent-brain ext add bench`.

---

### `memorable`

Control the opt-in Memorable integration. It is off by default, and nothing leaves the machine until you enable it.

```bash
agent-brain memorable [status | enable [--capture] | capture <trace.json> | disable]
```

- `enable` registers Memorable's read-only MCP server. Run `agent-brain mcp sync` to index it. Traces stay on the machine.
- `enable --capture` also allows `capture`, which sends a session trace to Memorable's extraction service. Capture refuses unless the repository's last `agent-brain verify` passed. Use it only when you accept that trace leaving the machine.
- `disable` turns both off.

---

## Operations & Diagnostics

### `stats`

Local retrieval, turn routing, and vector latency metrics.

```bash
agent-brain stats [OPTIONS]
```

#### Options

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--days` | Integer | `7` | Lookback window in days. |
| `--json` | Boolean | `false` | Output metrics in structured JSON for automation. |

---

### `dashboard`

Generate a local HTML metrics dashboard presenting tokens saved via knapsack packing, dangerous/unscouted blocks, and verified recipes auto-promoted.

```bash
agent-brain dashboard [--days N] [--open]
```

---

### `recall-procedures`

Query the recursive CTE procedure graph to recall proven execution DAGs.

```bash
agent-brain recall-procedures <QUERY> [--task-kind KIND] [--limit N]
```

#### Examples

```bash
agent-brain recall-procedures "reproduce bug" --task-kind debugging
```

---

### `inspect`

Deep inspection of internal SQLite tables, vector retrievals, and facts.

```bash
agent-brain inspect <COMMAND>
```

- `inspect log [--last] [--limit N]`: Inspect turn route decisions and token usage.
- `inspect fact <id>`: View raw JSON attributes and vector embeddings of a stored fact.
- `inspect conflicts [--limit N]`: Inspect superseded memories and conflict logs.

---

### `learn`

Ingest documentation websites into local skills and memory.

```bash
agent-brain learn url <HTTPS_URL> [--topic NAME] [--dry-run]
agent-brain learn allowlist
```

Crawls documentation URLs against the configured `docs.allowed_domains`, extracts markdown content, and generates indexed reference skills.

---

### `verify`

Run an allowlisted verification script and record a trusted outcome into memory.

```bash
agent-brain verify [OPTIONS] -- <COMMAND...>
agent-brain verify init [--dir DIR]
agent-brain verify record --exit CODE [OPTIONS] -- <SUMMARY...>
```

Pass `--save-artifact` to keep the command's full output. It is written to `${AUTONOMIC_HOME:-~/.autonomic}/artifacts/<project>/<report-id>.log`, and the path is printed to stderr. Without the flag, no log is written.

---

## Extras (`--features extras`)

Advanced tools compiled when building with `--features extras`:

| Command | Purpose |
| :--- | :--- |
| `dataset` | Export execution trajectories into JSONL format for LoRA training. |
| `digest` | Generate weekly operator summary digest of agent activity. |
| `eval` | Recall benchmark gates (`Recall@3`, BEAM memory tests). |
| `bench` | Moved out of the core binary. Install with `agent-brain ext add bench`. |
| `distill` | Perform semantic clustering over memory nodes to merge redundant facts. |
| `graphify` | Build codebase entity-relationship graphs from AST symbols. |
| `grpc` | Launch high-performance gRPC orchestrator bridge. |
