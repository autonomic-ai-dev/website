# Cloud-Native AI Infrastructure

**Autonomic AI is Kubernetes for AI agents** — a local-first control plane that gives agentic workloads what containers got in 2014: orchestration, durable state, memory, mesh networking, policy, and observability.

In 2014, containers existed but were painful to operate until Kubernetes standardized lifecycle, config, storage, and networking. LLM agents today hit the same wall: powerful runtimes with no shared control plane, no durable memory contract, and no conformance story.

Autonomic fills that gap with **specialized daemons** (codenames: *organs*) that communicate over strict interfaces — MCP, HTTP health probes, and NATS JetStream — coordinated from a single workspace at `~/.autonomic/`.

> **Dual-layer naming:** We lead with cloud-native roles in enterprise docs. Binary names (`agent-brain`, …) and config sections (`[brain]`, …) are stable identifiers. *Organ* is an internal codename, not the primary headline.

---

## Platform mapping

| K8s / cloud-native primitive | Codename | Binary | Enterprise pitch |
|------------------------------|----------|--------|------------------|
| Control plane (`kubectl`, apiserver) | body | `autonomic` / `agent-body` | **Agent OS** — lifecycle, health, unified config, supervisor |
| PersistentVolumes + ConfigMaps | brain | `agent-brain` | **Memory store** — durable context, skills, temporal knowledge |
| Jobs / Argo Workflows / StatefulSets | spine | `agent-spine` | **Workflow engine** — DAG, retries, snapshots, HITL |
| Service mesh (Istio / Linkerd) | nerves | `agent-nerves` | **Agent mesh** — NATS JetStream event bus |
| Admission / policy (OPA / Gatekeeper) | immune | `agent-immune` | **Zero-trust policy** — OSV scan, sandbox verify |
| Controller manager / GC | heart | `agent-heart` | **Background controller** — memory GC, token budget gates |
| kubelet / CRI runtime | muscle | `agent-muscle` | **Execution runtime** — sandboxed commands, training jobs |
| Observability (traces + visual state) | eyes | `agent-eyes` | **State extraction** — capture, DOM index, visual QA |
| Ingress / API gateway | mouth | `agent-mouth` | **I/O gateway** — AST validation, Slack approvals, notifications |
| Conformance (Sonobuoy) | benchmarks | `agent-benchmarks` | **Ecosystem conformance** — tiered CI, latency/token SLAs |

---

## What we are (and are not)

**We are:**

- A **local control plane** for autonomous software engineering on your machine
- **Composable daemons** — adopt one component or the full stack
- **Structure beats intelligence** — deterministic workflows + precise retrieval over mega-prompts

**We are not (today):**

- A replacement for cluster Kubernetes — we orchestrate *agents*, not pods
- A hosted SaaS — data stays under `~/.autonomic/` on your hardware
- A monolithic Python agent loop — each daemon is an independent Rust binary

---

## Glossary

| Term | Meaning |
|------|---------|
| **Component / daemon** | Preferred user-facing term (maps to a K8s primitive) |
| **Organ** | Internal codename retained in repos and config section names |
| **Workspace** | `~/.autonomic/` — config, memory, broker, state, logs |
| **Integrated mode** | `autonomic start` — supervised mesh with shared config |
| **Standalone mode** | Run any `agent-*` binary alone with optional unified config |

---

## Further reading

- [Unified config reference](config.full.example.toml)
- [agent-body README](../README.md) — install, supervisor, CLI routing
- [Architecture notes](architecture/README.md) — supervisor boot order and design decisions
