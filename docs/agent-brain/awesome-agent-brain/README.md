# awesome-agent-brain (community registry)

Curated **third-party skill packs** for [`agent-brain`](https://github.com/autonomic-ai-dev/agent-brain). The embedded registry (`agent-brain registry list`) stays small; this list is for community additions.

> **Publish this directory as its own GitHub repo** `awesome-agent-brain` when ready. Until then, PRs can propose entries here.

## Official aliases (in binary)

| Alias | Packages |
|-------|----------|
| `@starter` | vercel-labs/skills, vercel-labs/agent-skills |
| `@nextjs` | vercel-labs/agent-skills |
| `@ecc` | affaan-m/everything-claude-code |
| `@rust` | affaan-m/everything-claude-code |

## Community packages (template)

Add rows via PR. Each entry must include a working `owner/repo` and one-line description.

| Name | Source | Description | Maintainer |
|------|--------|-------------|------------|
| _example_ | `your-org/your-skills` | Short stack-specific skills | @you |

### Submission requirements

1. **Public GitHub repo** with skills under standard paths (`skills/`, `.cursor/rules/`, etc.)
2. **README** explaining install: `agent-brain add owner/repo`
3. **No secrets** in sample rules or skills
4. Optional: golden eval cases if you maintain a routing suite

### Promoting to `@alias`

High-quality, widely used packages may be promoted into [`agent-brain/registry/packages.json`](../../agent-brain/registry/packages.json) by maintainers. Community list entries remain even after promotion.

## Related

- [Registry docs](../registry/README.md)
- [Before/after blog](../blog/before-and-after-agent-brain.md)
- [Team workflow](../TEAM-WORKFLOW.md)
