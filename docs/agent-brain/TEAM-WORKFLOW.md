# Team workflow — shared agent constraints

How a staff engineer standardizes agent-brain for a team without per-developer copy-paste.

## Roles

| Role | Responsibility |
|------|----------------|
| **Platform / staff** | Chooses skill packs, repo rules, memory conventions, sync policy |
| **Developers** | `install --global`, `add @alias`, use Agent mode (hooks enforce routing) |
| **CI (optional)** | `agent-brain proofs --ci` or a custom golden suite on the team skill pack |

## 1. Pick the team skill pack

```bash
agent-brain registry list
agent-brain add @nextjs    # or @ecc, @rust, @starter
```

Document the chosen alias in the repo README:

```markdown
## Agent setup
curl .../install.sh | bash -s -- --global --with-starter
agent-brain add @nextjs
```

## 2. Repo-scoped rules (optional)

Commit project rules under `.cursor/rules/` as usual. agent-brain indexes them on bootstrap and ranks them per turn — they do not need to be pasted into every chat.

For package-only teams, a repo can ship **`agent-brain.yaml`** in a dedicated config repo; today the supported path is **`agent-brain add owner/repo`** plus standard skill paths in that repo.

## 3. Shared durable memory (git sync)

When the team agrees on a convention (“Vitest not Jest”, “API errors use `ProblemDetails`”):

1. Agent calls `store_memory` at task end (MCP rule enforces this)
2. Platform enables **git sync** for `~/.agent_brain/` bundles

```bash
agent-brain sync git init
# commit ~/.agent_brain/export/ or configured bundle path — see USAGE.md
```

Second machine:

```bash
agent-brain sync git pull
```

Use **encrypted cloud sync** (`AGENT_BRAIN_SYNC_KEY`) if git is not appropriate for memory contents.

## 4. Governance — promote operator loop

Facts can be staged before becoming skills:

```bash
agent-brain promote list
agent-brain promote approve <staging-id>
agent-brain promote reject <staging-id>
```

Staff reviews staging queue weekly; approved skills land under `~/.agent_brain/skills/` or package paths.

## 5. Verify routing on your stack

After changing the team pack, spot-check:

```bash
agent-brain briefing
agent-brain proofs --ci
```

Add repo-specific golden queries if you maintain a custom eval suite.

## 6. Onboarding checklist (copy for new hires)

- [ ] `install.sh --global --with-starter`
- [ ] Restart Cursor · enable agent-brain MCP
- [ ] `agent-brain add @<team-alias>`
- [ ] `agent-brain doctor --fix`
- [ ] Confirm hooks: first agent turn should call `route_task` before Shell/Read
- [ ] `agent-brain briefing` shows token savings line

## Anti-patterns

| Don't | Do instead |
|-------|------------|
| Paste 200 rules into one `.cursorrules` | Install package + let router rank |
| Disable hooks to “go faster” | Fix MCP with `doctor --fix` |
| Share API keys in memory facts | Store conventions only; no secrets in `store_memory` |
| Expect routing without indexing | Run `agent-brain index` after adding packages |

See also: [USAGE.md](USAGE.md) · [registry/README.md](registry/README.md) · [architecture/12-routing-accuracy.md](architecture/12-routing-accuracy.md)
