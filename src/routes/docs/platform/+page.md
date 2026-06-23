---
title: Cloud-Native Platform
---

# Kubernetes for AI Agents

Autonomic AI is **cloud-native AI infrastructure** — a local control plane that gives agentic workloads what containers got in 2014: orchestration, durable state, memory, mesh networking, policy, and observability.

## Platform mapping

| K8s primitive | Component | Binary | Role |
|---------------|-----------|--------|------|
| Control plane | body | `autonomic` | Agent OS — lifecycle, config, supervisor |
| PersistentVolumes + ConfigMaps | brain | `agent-brain` | Memory store |
| Jobs / Argo / StatefulSets | spine | `agent-spine` | Workflow engine |
| Service mesh | nerves | `agent-nerves` | Agent mesh (NATS) |
| Admission / policy | immune | `agent-immune` | Zero-trust policy |
| Controller / GC | heart | `agent-heart` | Background controller |
| kubelet / CRI | muscle | `agent-muscle` | Execution runtime |
| Observability | eyes | `agent-eyes` | State extraction |
| Ingress / gateway | mouth | `agent-mouth` | I/O gateway |
| Conformance (Sonobuoy) | benchmarks | `agent-benchmarks` | Ecosystem conformance |

> **Codenames:** *Organ* names are stable internal identifiers in repos and `~/.autonomic/config.toml`. Enterprise docs lead with cloud-native roles above.

Full reference: [agent-body cloud-native-platform.md](https://github.com/autonomic-ai-dev/agent-body/blob/master/docs/cloud-native-platform.md)

## What we are not

- Not a replacement for cluster Kubernetes — we orchestrate **agents**, not pods
- Not a hosted SaaS — data lives under `~/.autonomic/` on your machine
- Not a monolithic Python agent loop — independent Rust daemons with strict interfaces
