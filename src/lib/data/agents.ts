import { Brain, Heart, Cpu, Shield, Layers, Eye, MessageSquare, Server, Radio } from "lucide-svelte";

export interface AgentData {
  id: string;
  name: string;
  icon: any;
  color: string;
  cloudNativeRole: string;
  description: string;
  longDescription: string;
  githubLink: string;
  span: string;
  features: string[];
}

export const agents: AgentData[] = [
  {
    id: "body",
    name: "Agent Body",
    icon: Server,
    color: "from-slate-500 to-slate-700",
    cloudNativeRole: "Control plane",
    description: "Agent OS — supervises daemons, unified config, and health.",
    longDescription: "Agent Body acts as the master process supervisor for the Autonomic AI ecosystem. It daemonizes the other organs, monitors their process health, intercepts and unifies their logs, and handles automatic restarts if an organ crashes due to an out-of-memory error.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-body",
    span: "col-span-1",
    features: ["Process Supervision", "Daemonization", "Log Unification", "Self-Healing Restarts"]
  },
  {
    id: "brain",
    name: "Agent Brain",
    icon: Brain,
    color: "from-indigo-500 to-purple-500",
    cloudNativeRole: "Memory store",
    description: "Durable context, skills, and MCP routing.",
    longDescription: "Agent Brain is the memory and routing substrate. It solves context bloat by storing facts in a temporal SQLite knowledge graph and using filterable HNSW vector search to instantly retrieve relevant rules and context. It also acts as the MCP router for standard AI editors.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-brain",
    span: "md:col-span-2 md:row-span-2",
    features: ["Knowledge Graph", "HNSW Vector Retrieval", "MCP Router", "Temporal Memory"]
  },
  {
    id: "spine",
    name: "Agent Spine",
    icon: Layers,
    color: "from-slate-500 to-slate-400",
    cloudNativeRole: "Workflow engine",
    description: "Deterministic DAG workflows with snapshots and HITL gates.",
    longDescription: "Agent Spine enforces structured execution through YAML-defined DAG pipelines. It ensures that every step in an AI workflow is deterministic, replayable, and isolated. It supports parallel fan-out, immutable state snapshots, and human-in-the-loop approval gates.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-spine",
    span: "col-span-1",
    features: ["DAG Workflows", "Immutable Snapshots", "Error Handling", "Approval Gates"]
  },
  {
    id: "heart",
    name: "Agent Heart",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    cloudNativeRole: "Controller / GC",
    description: "Token budgets, scheduled GC, and background maintenance.",
    longDescription: "Agent Heart acts as the financial governor and garbage collector of the ecosystem. It strictly enforces token budgets to prevent runaway LLM costs, and runs periodic CRON routines to deduplicate facts, vacuum vector indexes, and clear expired memories.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-heart",
    span: "col-span-1",
    features: ["Token Budgeting", "Garbage Collection", "CRON Maintenance", "Storage Vacuuming"]
  },
  {
    id: "nerves",
    name: "Agent Nerves",
    icon: Radio,
    color: "from-emerald-500 to-teal-500",
    cloudNativeRole: "Service mesh",
    description: "NATS JetStream agent mesh and event routing.",
    longDescription: "Agent Nerves acts as the high-speed, decentralized communication bus between all organs. It manages a local NATS JetStream server, allowing organs to publish state changes and subscribe to relevant events with guaranteed at-least-once durable delivery.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-nerves",
    span: "col-span-1",
    features: ["NATS JetStream", "Pub/Sub Architecture", "Durable Subscriptions", "WASM Event Filters"]
  },
  {
    id: "muscle",
    name: "Agent Muscle",
    icon: Cpu,
    color: "from-orange-500 to-amber-500",
    cloudNativeRole: "Execution runtime",
    description: "Sandboxed commands, JSON contracts, and training jobs.",
    longDescription: "Agent Muscle handles physical actuation on the host machine. It executes shell commands enforcing strict JSON output schemas to prevent parsing errors. It also orchestrates local LoRA fine-tuning jobs using pluggable backends like Apple MLX or Candle.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-muscle",
    span: "col-span-1",
    features: ["JSON Output Contracts", "Shell Execution", "LoRA Fine-Tuning", "Dataset Validation"]
  },
  {
    id: "immune",
    name: "Agent Immune",
    icon: Shield,
    color: "from-blue-500 to-cyan-500",
    cloudNativeRole: "Admission / policy",
    description: "OSV scanning, sandbox execution, and memory audits.",
    longDescription: "Agent Immune protects the ecosystem with three-layer defense: it queries OSV databases for dependency vulnerabilities, enforces seccomp or Firecracker isolation for untrusted LLM code, and audits post-execution memory logs for OOM violations.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-immune",
    span: "col-span-1",
    features: ["OSV Dependency Scanning", "Seccomp Sandboxing", "Firecracker MicroVMs", "Memory Auditing"]
  },
  {
    id: "eyes",
    name: "Agent Eyes",
    icon: Eye,
    color: "from-yellow-400 to-orange-400",
    cloudNativeRole: "Observability",
    description: "DOM index, capture, pixel diff, and visual QA.",
    longDescription: "Agent Eyes allows the ecosystem to reason about visual state. It parses UI layouts into DOM indexes, captures Playwright screenshots, computes structural pixel diffs via SSIM, and runs native, local LLaVA vision-language inference to identify visual regressions.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-eyes",
    span: "col-span-1",
    features: ["DOM Indexing", "SSIM Pixel Diffs", "Local LLaVA VLM", "Playwright Automation"]
  },
  {
    id: "mouth",
    name: "Agent Mouth",
    icon: MessageSquare,
    color: "from-teal-400 to-emerald-400",
    cloudNativeRole: "Ingress / gateway",
    description: "AST validation, webhooks, approvals, and log summarization.",
    longDescription: "Agent Mouth routes outbound signals. When an organ triggers a critical event (like a security alert or deployment success), Mouth translates it into semantic payloads for configured webhooks (Slack, Discord). It can also synthesize dense JSON logs into human-readable summaries.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-mouth",
    span: "col-span-1",
    features: ["Webhook Routing", "Log Summarization", "Notification Delivery", "Semantic Formatting"]
  }
];
