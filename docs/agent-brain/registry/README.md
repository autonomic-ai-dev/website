# Curated package registry

One-command skill packs via **`agent-brain add @alias`**. Aliases are embedded in the binary from [`agent-brain/registry/packages.json`](../../agent-brain/registry/packages.json).

## Available aliases

| Alias | Description | GitHub packages |
|-------|-------------|-----------------|
| `@matt-skills` / `@mattpocock` | **Default** — Matt Pocock skills (boosted in routing) | `mattpocock/skills` |
| `@starter` | Onboarding pack | `mattpocock/skills`, `vercel-labs/agent-skills` |
| `@nextjs` | React / Next.js | `vercel-labs/agent-skills` |
| `@ecc` | Full ECC library | `affaan-m/everything-claude-code` |
| `@rust` | Rust via ECC | `affaan-m/everything-claude-code` |
| `@coding-policy` | Strict engineering policy (bundled, default bootstrap) | `bundle:coding-policy` — Cursor/Claude/OpenCode/Augment rules |
| `@supervisor` | Execution supervisor (bundled) | `bundle:supervisor` — token-efficient ops + must_apply rule |

List at any time:

```bash
agent-brain registry list
```

## Install with starter pack

```bash
curl -fsSL https://raw.githubusercontent.com/autonomic-ai-dev/agent-brain/master/scripts/install.sh | bash -s -- --global --with-starter
```

Or after install:

```bash
agent-brain add @coding-policy  # engineering policy (no git clone; also via doctor --fix)
agent-brain add @supervisor     # execution supervisor (no git clone)
agent-brain add @matt-skills    # default on doctor --fix / install (recommend_boost 0.35)
agent-brain add @starter
agent-brain add @nextjs
```

Default packages (`"default": true` in `packages.json`) are cloned and indexed automatically on `agent-brain install` and `agent-brain doctor --fix`. Skills under those install paths get an additive `recommend_boost` in `route_task` ranking.

## Adding aliases

1. Edit `agent-brain/registry/packages.json`
2. Rebuild / release agent-brain
3. Document the alias in this file

For community packages, prefer **`docs/awesome-agent-brain/README.md`** (publish as its own GitHub repo when ready).

## Team workflow

1. Staff engineer commits `.agent-brain/` or documents `agent-brain add @nextjs` in repo README
2. Juniors run `agent-brain install --global` + `agent-brain add @nextjs`
3. Optional: `sync git` so `brain.db` bundles match across machines

See [../USAGE.md](../USAGE.md) for sync and hooks.
