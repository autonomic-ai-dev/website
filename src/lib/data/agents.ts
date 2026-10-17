import {
  Brain,
  Heart,
  Cpu,
  Shield,
  Layers,
  Eye,
  MessageSquare,
  Server,
  Radio,
  Terminal,
  Activity
} from "lucide-svelte";

export interface AgentData {
  id: string;
  name: string;
  icon: any;
  color: string;
  role: string;
  protocol: string;
  latency: string;
  version: string;
  description: string;
  longDescription: string;
  githubLink: string;
  span: string;
  features: string[];
}

export const agents: AgentData[] = [
  {
    id: "body",
    name: "agent-body",
    icon: Server,
    color: "from-slate-500 to-slate-700",
    role: "Supervisor & Catalog Hub",
    protocol: "unix_sock",
    latency: "<0.4ms",
    version: "v1.0.0-beta.3",
    description: "Master daemon supervisor, launchd controller, and unified doctor daemon.",
    longDescription: "Agent Body acts as the master process supervisor for the Autonomic AI ecosystem. It daemonizes the other organs, monitors process health, intercepts and unifies logs, manages macOS launchd plists, and handles automatic self-healing restarts.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-body",
    span: "col-span-1",
    features: ["Process Supervision", "Launchd Daemonization", "Catalog Discovery Hub", "Self-Healing Restarts"]
  },
  {
    id: "brain",
    name: "agent-brain",
    icon: Brain,
    color: "from-indigo-500 to-purple-500",
    role: "Vector Memory & Router",
    protocol: "shm:0x00FF",
    latency: "<0.8ms",
    version: "v1.0.0-beta.3",
    description: "Durable memory substrate, filterable HNSW vector index, and verified recipe routing.",
    longDescription: "Agent Brain is the memory and routing substrate. It solves context bloat by storing facts in a temporal SQLite knowledge graph with HNSW vector retrieval, enforces read gates, and injects battle-tested verified recipes into every agent turn.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-brain",
    span: "md:col-span-2 md:row-span-2",
    features: ["HNSW Vector Retrieval", "Verified Recipe Injection", "Temporal SQLite Graph", "MCP Turn Router"]
  },
  {
    id: "spine",
    name: "agent-spine",
    icon: Layers,
    color: "from-slate-500 to-slate-400",
    role: "Workflow DAG Engine",
    protocol: "unix_sock",
    latency: "<1.2ms",
    version: "v1.0.0-beta.1",
    description: "Deterministic DAG orchestrator with immutable execution snapshots and approval gates.",
    longDescription: "Agent Spine enforces structured execution through YAML-defined DAG pipelines. It ensures that every step in an AI workflow is deterministic, replayable, and isolated. It supports parallel fan-out, immutable state snapshots, and human-in-the-loop approval gates.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-spine",
    span: "col-span-1",
    features: ["YAML DAG Workflows", "Immutable Snapshots", "Error Circuit Breaker", "Approval Gates"]
  },
  {
    id: "heart",
    name: "agent-heart",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    role: "Token Budget & GC",
    protocol: "unix_sock",
    latency: "<0.5ms",
    version: "v1.0.0-beta.3",
    description: "Real-time token budget governor, scheduled memory GC, and cost controller.",
    longDescription: "Agent Heart acts as the financial governor and garbage collector of the ecosystem. It strictly enforces token budgets to prevent runaway LLM costs, and runs periodic CRON routines to deduplicate facts, vacuum vector indexes, and clear expired memories.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-heart",
    span: "col-span-1",
    features: ["Token Budgeting", "Garbage Collection", "CRON Maintenance", "Vector Vacuuming"]
  },
  {
    id: "nerves",
    name: "agent-nerves",
    icon: Radio,
    color: "from-emerald-500 to-teal-500",
    role: "Event Mesh Bridge",
    protocol: "nats:organs.*",
    latency: "<0.2ms",
    version: "v1.0.0-beta.1",
    description: "NATS JetStream agent mesh, high-throughput telemetry, and durable pub/sub.",
    longDescription: "Agent Nerves acts as the high-speed, decentralized communication bus between all organs. It manages a local NATS JetStream server, allowing organs to publish state changes and subscribe to relevant events with guaranteed at-least-once durable delivery.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-nerves",
    span: "col-span-1",
    features: ["NATS JetStream", "Pub/Sub Architecture", "Durable Subscriptions", "Telemetry Stream"]
  },
  {
    id: "muscle",
    name: "agent-muscle",
    icon: Cpu,
    color: "from-orange-500 to-amber-500",
    role: "Sandboxed Actuator",
    protocol: "unix_sock",
    latency: "<2.1ms",
    version: "v1.0.0-beta.2",
    description: "Tree-sitter AST safety guard, sandboxed subprocess runner, and adaptive output slicer.",
    longDescription: "Agent Muscle handles physical actuation on the host machine. It validates shell ASTs before child process execution, enforces Landlock/seccomp sandboxes, compresses voluminous output to bounded 4KB snippets, and orchestrates local Apple MLX / CUDA LoRA training.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-muscle",
    span: "col-span-1",
    features: ["Tree-sitter AST Guard", "Adaptive 4KB Output Slicer", "Sandboxed Subprocess", "MLX/CUDA Training"]
  },
  {
    id: "immune",
    name: "agent-immune",
    icon: Shield,
    color: "from-blue-500 to-cyan-500",
    role: "Vulnerability & Policy",
    protocol: "unix_sock",
    latency: "<3.4ms",
    version: "v1.0.0-beta.1",
    description: "OSV vulnerability database scanning, micro-sandbox verification, and memory safety audits.",
    longDescription: "Agent Immune protects the ecosystem with three-layer defense: it queries OSV databases for dependency vulnerabilities, enforces seccomp or Firecracker isolation for untrusted LLM code, and audits post-execution memory logs for OOM violations.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-immune",
    span: "col-span-1",
    features: ["OSV Dependency Scanning", "Micro-Sandbox Runner", "Memory Leak Audit", "CVE Interception"]
  },
  {
    id: "eyes",
    name: "agent-eyes",
    icon: Eye,
    color: "from-yellow-400 to-orange-400",
    role: "DOM & Visual Audit",
    protocol: "cdp:pipe",
    latency: "<18ms",
    version: "v1.0.0-beta.1",
    description: "Visual screen capture, DOM accessibility indexing, pixel diffing, and VLM captioning.",
    longDescription: "Agent Eyes allows the ecosystem to reason about visual state. It parses UI layouts into DOM indexes, captures Playwright screenshots, computes structural pixel diffs via SSIM, and runs native, local LLaVA vision-language inference to identify visual regressions.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-eyes",
    span: "col-span-1",
    features: ["DOM Tree Indexing", "SSIM Pixel Diffing", "Playwright Capture", "Local VLM Inference"]
  },
  {
    id: "mouth",
    name: "agent-mouth",
    icon: MessageSquare,
    color: "from-teal-400 to-emerald-400",
    role: "Policy & Notifications",
    protocol: "http:webhook",
    latency: "<1.0ms",
    version: "v1.0.0-beta.1",
    description: "AST command validation, Slack/Discord approval gates, and notification dispatch.",
    longDescription: "Agent Mouth routes outbound signals. When an organ triggers a critical event (like a security alert or deployment success), Mouth translates it into semantic payloads for configured webhooks (Slack, Discord). It also enforces human-in-the-loop approval signatures.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-mouth",
    span: "col-span-1",
    features: ["AST Validation", "Slack Approval Gate", "Discord Webhooks", "Semantic Formatting"]
  },
  {
    id: "tui",
    name: "agent-tui",
    icon: Terminal,
    color: "from-cyan-500 to-blue-600",
    role: "Terminal Observability HUD",
    protocol: "tty:ansi",
    latency: "<0.1ms",
    version: "v1.0.0-beta.1",
    description: "High-density Ratatui terminal dashboard, live telemetry visualizer, and DAG monitor.",
    longDescription: "Agent TUI provides an aerospace HUD inside the developer's terminal. Powered by Ratatui, it streams live organ heartbeats, memory usage, token headroom, and real-time DAG step progressions without leaving the command line.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-tui",
    span: "col-span-1",
    features: ["Ratatui Console", "Live DAG Visualizer", "ANSI Log Streamer", "Sub-Millisecond Vitals"]
  },
  {
    id: "ci-dashboard",
    name: "agent-ci-dashboard",
    icon: Activity,
    color: "from-emerald-400 to-cyan-500",
    role: "Mission Control & Releases",
    protocol: "http:sse",
    latency: "<1.5ms",
    version: "v1.0.0-beta.1",
    description: "Real-time CI/CD dashboard, PR checks triage, batch operations, and release management.",
    longDescription: "Agent CI Dashboard is the mission control web interface for the entire autonomic ecosystem. Built with SvelteKit 5 and Tailwind, it surfaces real-time PR check runs, branch synchronization, one-click squash & merge, and pipeline telemetry across all eleven repositories.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-ci-dashboard",
    span: "col-span-1",
    features: ["Differentiated Checks", "Batch PR Operations", "One-Click Squash & Merge", "Terminal Log Inspector"]
  }
];
