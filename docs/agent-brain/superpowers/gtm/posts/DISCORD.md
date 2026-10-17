# Cursor / MCP Discord post (short)

**Channel:** #mcp or #showcase (adjust to server norms)

---

**agent-brain** — local MCP router for large skill libraries

Problem: hundreds of ECC/skills.sh rules → token bloat, agent ignores "use skills first", conventions don't persist.

What it does:
• `route_task` → ~500 tokens of ranked skills/rules/memory per turn  
• **Hooks** → block other tools until routing runs  
• `add @starter` / `@nextjs` → one-command packs  
• `briefing` → token savings vs full index  

**CI proof:** 30/30 Recall@3 on 2000 real skills.sh skills.

```bash
curl -fsSL https://raw.githubusercontent.com/aeswibon/agent-brain/master/scripts/install.sh | bash -s -- --global --with-starter
```

`agent-brain onboarding` after install.

Repo: https://github.com/aeswibon/agent-brain

Feedback welcome — especially which @stack alias to add next.
