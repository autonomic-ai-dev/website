import {
  Brain,
  Layers
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
    id: "brain",
    name: "agent-brain",
    icon: Brain,
    color: "from-indigo-500 to-cyan-500",
    role: "Vector Memory & Router",
    protocol: "shm:0x00FF",
    latency: "<0.8ms",
    version: "v1.0.0-beta.3.11",
    description: "Durable memory substrate, filterable HNSW vector index, and verified recipe routing.",
    longDescription: "Agent Brain is the memory and routing substrate. It solves context bloat by storing facts in a temporal SQLite knowledge graph with HNSW vector retrieval, enforces read gates, and injects battle-tested verified recipes into every agent turn.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-brain",
    span: "col-span-1",
    features: ["HNSW Vector Retrieval", "Verified Recipe Injection", "Temporal SQLite Graph", "MCP Turn Router"]
  },
  {
    id: "spine",
    name: "agent-spine",
    icon: Layers,
    color: "from-slate-500 to-indigo-500",
    role: "Workflow DAG Engine",
    protocol: "unix_sock",
    latency: "<1.2ms",
    version: "v1.0.0-beta.3.9",
    description: "Deterministic DAG orchestrator with immutable execution snapshots and approval gates.",
    longDescription: "Agent Spine enforces structured execution through YAML-defined DAG pipelines. It ensures that every step in an AI workflow is deterministic, replayable, and isolated. It supports parallel fan-out, immutable state snapshots, and human-in-the-loop approval gates.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-spine",
    span: "col-span-1",
    features: ["YAML DAG Workflows", "Immutable Snapshots", "Error Circuit Breaker", "Approval Gates"]
  }
];
