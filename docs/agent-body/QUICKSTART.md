# ⚡ Quickstart: Prove It Works (30 minutes)

> **For the skeptic.** This guide takes you from zero to measurable proof that
> Autonomic AI makes lightweight local models work better — in under 30 minutes.
>
> No hand-waving. No marketing. Just numbers you can reproduce.

---

## Prerequisites

| Tool | Install | Why |
|---|---|---|
| macOS or Linux | — | Organ binaries are native Rust |
| [Ollama](https://ollama.ai) | `curl -fsSL https://ollama.ai/install.sh \| sh` | Local LLM inference |
| [Docker](https://docs.docker.com/get-docker/) | Download from docker.com | Sandbox execution |

---

## Phase 1: Install the Stack (5 minutes)

```bash
# Install all organ binaries + NATS + brain MCP hooks
curl -fsSL https://raw.githubusercontent.com/autonomic-ai-dev/agent-body/master/scripts/install-all-organs.sh | bash
export PATH="$HOME/.local/bin:$PATH"

# Initialize the shared workspace
autonomic init

# Verify everything is installed
autonomic doctor
```

You should see all 11 organs installed and verified against the `v1.0.0-beta.1` compatibility baseline. If any are missing, the install script
will tell you which `curl` command to run manually.

---

## Phase 2: See the Token Savings (2 minutes)

```bash
# Start the daemons (NATS → nerves → heart)
autonomic start

# Check the brain's index
agent-brain stats --json | python3 -c "
import json, sys
d = json.load(sys.stdin)
idx = d.get('index', {})
print(f\"Index size:     {idx.get('total', 0)} items\")
print(f\"Active memories: {idx.get('memories', 0)}\")
print(f\"Skills:         {idx.get('skills', 0)}\")
print(f\"Rules:          {idx.get('rules', 0)}\")
"

# See what a route_task returns
agent-brain briefing
```

**What you'll see:** agent-brain routes ~500 tokens of precisely relevant
context from your index, instead of loading everything (~120 tokens per item).
On a 2000-item index, that's **99% fewer tokens**.

---

## Phase 3: Before/After Model Comparison (15 minutes)

This is the proof. We run the same 10 coding prompts through a model twice:
once raw (baseline), once with agent-brain context injection (enhanced).

```bash
# Pull a small model
ollama pull qwen2.5-coder:1.5b

# Clone the benchmarks repo
git clone https://github.com/autonomic-ai-dev/agent-benchmarks.git
cd agent-benchmarks

# Build the Docker sandbox for safe code execution
docker build -t autonomic-sandbox:latest -f benchmarks/sandbox/Dockerfile.sandbox benchmarks/sandbox/

# Run the comparison
python3 benchmarks/model_comparison.py \
  --model qwen2.5-coder:1.5b \
  --build-sandbox

# Read the report
cat benchmarks/results_model.md
```

**What you'll see:** A table like this:

| Metric | Baseline | Enhanced | Delta |
|---|---|---|---|
| Keyword Accuracy | ~40% | ~65% | +25% |
| Avg Tokens | ~300 | ~350 | +50 |
| Sandbox Pass | 2/6 | 4/6 | +2 |

The enhanced mode should show higher keyword accuracy because agent-brain
injected project conventions (immutability, error handling, type annotations)
that the model wouldn't know on its own.

---

## Phase 4: Multi-Model Comparison (10 minutes)

Compare across model sizes to see how brain context helps smaller models:

```bash
# Pull additional models
ollama pull qwen2.5-coder:3b
ollama pull qwen2.5-coder:7b

# Run batch comparison
python3 benchmarks/model_comparison.py \
  --models qwen2.5-coder:1.5b,qwen2.5-coder:3b,qwen2.5-coder:7b

# Read the unified report
cat benchmarks/results_model_comparison.md
```

**What you'll see:** A cross-model comparison proving that context injection
has the largest relative impact on smaller models — the structure compensates
for model size.

---

## Phase 5: Architecture Proof (5 minutes)

Verify the three core claims:

```bash
# Prove fault isolation, deterministic execution, and data sovereignty
python3 benchmarks/architecture_bench.py

# Read the results
cat benchmarks/results_architecture.md
```

**What you'll see:** Three validated claims:
- ✅ **Fault Isolation** — killing muscle doesn't crash spine
- ✅ **Deterministic Execution** — spine follows the YAML DAG, not LLM mood
- ✅ **Data Sovereignty** — brain works inside an offline sandbox

---

## Phase 6: Scale Proof (5 minutes)

Prove that monolithic context injection breaks at scale:

```bash
python3 benchmarks/monolith_vs_autonomic.py \
  --index-sizes 100,500,1000,5000,10000 \
  --skip-endurance

cat benchmarks/results_comparison.md
```

**What you'll see:** Monolith exceeds the 128K token limit at ~5000 items.
Autonomic stays at ~500 tokens regardless of index size.

---

## What's Next?

### Integrate with your editor

```bash
# Cursor
agent-brain install --global

# Claude Code
agent-brain install --claude-code --global

# VS Code
agent-brain install --vscode --global

# Gemini CLI / Antigravity
agent-brain install --gemini --global
agent-brain install --antigravity --global

# All of the above
agent-brain install --all --global
```

### Run a workflow

```bash
# Initialize a dev pipeline
agent-spine init --with universal-developer

# Execute it
agent-spine run dev-pipeline.yaml
```

### Store project conventions

When you notice the model doing something wrong, store it as a memory:

```bash
# Via your MCP-connected editor, agent-brain will automatically store
# conventions as you work. Or manually:
agent-brain memory store \
  --topic "immutable-data-patterns" \
  --text "Always return new objects; never mutate in place" \
  --confidence 0.95
```

### Check system health

```bash
autonomic status     # PID table, ports, health
autonomic doctor     # Pre-flight checks
agent-brain doctor   # Brain-specific diagnostics
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `autonomic: command not found` | `export PATH="$HOME/.local/bin:$PATH"` |
| MCP fails in Cursor | `xattr -cr ~/.local/bin/agent-brain && codesign --force --sign - ~/.local/bin/agent-brain` |
| Ollama not running | `ollama serve` in a separate terminal |
| Docker sandbox fails | `docker ps` — ensure Docker daemon is running |
| Brain index empty | `agent-brain index` to force reindex |

---

## Resources

- [agent-body README](../README.md) — Full architecture overview
- [agent-brain USAGE.md](https://github.com/autonomic-ai-dev/agent-brain/blob/master/docs/USAGE.md) — Detailed brain setup
- [Cost Comparison](https://github.com/autonomic-ai-dev/agent-benchmarks/blob/master/benchmarks/cost_comparison.md) — Financial analysis
- [Scorecard](https://github.com/autonomic-ai-dev/agent-benchmarks/blob/master/benchmarks/scorecard.md) — Full ecosystem benchmark
