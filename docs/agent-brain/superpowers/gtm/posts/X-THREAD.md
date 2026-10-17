# X thread draft (8 posts)

**Post 1 (hook)**  
Your Cursor agent has 500 skills. It loads… all of them? Or greps and guesses?

agent-brain routes ~500 tokens of the *right* skills per turn — and hooks block tools until routing runs.

Local MCP. No API key. Thread 🧵

**Post 2 (problem)**  
Three failures mode at scale:

• Context bloat → worse reasoning + token burn  
• Soft rules → agent skips your .cursor/rules  
• Amnesia → Vitest on Monday, Jest on Tuesday

**Post 3 (mechanism)**  
route_task (BM25 + embeddings) ranks skills for *this* message under a token budget.

Cursor hooks deny Shell/Read until it succeeds.

Not "please follow the rule." Hard gate.

**Post 4 (proof)**  
We gate CI on routing quality:

30/30 Recall@3 on a 2000-skill real skills.sh index.

Not a toy fixture — committed benchmark in the repo.

**Post 5 (cost angle)**  
briefing shows estimated savings vs loading your full library.

On 2000 skills: ~500 tokens routed vs ~240k naive estimate.

That's the cost/rate-limit story for power users.

**Post 6 (install)**  
One line:

curl -fsSL …/install.sh | bash -s -- --global --with-starter

agent-brain add @nextjs  
agent-brain briefing

**Post 7 (team)**  
Staff engineer picks @nextjs once.

Juniors install — same constraints, git-syncable brain.db.

Playbook in repo: TEAM-WORKFLOW.md

**Post 8 (CTA)**  
github.com/aeswibon/agent-brain

Before/after blog + benchmarks in docs/benchmarks/

What stack should we ship as @django / @go next?
