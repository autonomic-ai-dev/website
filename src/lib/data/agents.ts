import { Brain, Heart, Activity, GitBranch, ShieldAlert, Cpu, Layers } from "lucide-svelte";

export interface AgentData {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  longDescription: string;
  githubLink: string;
  span: string;
  features: string[];
}

export const agents: AgentData[] = [
  {
    id: "brain",
    name: "Agent Brain",
    icon: Brain,
    color: "from-indigo-500 to-purple-500",
    description: "The core intelligence. Handles reasoning, planning, memory, and orchestration of the entire ecosystem.",
    longDescription: "Agent Brain is the central orchestrator of the Autonomic AI ecosystem. It acts as the cognitive center, receiving inputs from the Perception layer (Agent Eyes), formulating execution plans, and delegating tasks to other specialized agents. It maintains conversational memory and context across sessions.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-brain",
    span: "md:col-span-2 md:row-span-2",
    features: ["LLM Integration", "Task Delegation", "Memory Management", "Execution Planning"]
  },
  {
    id: "nerves",
    name: "Agent Nerves",
    icon: GitBranch,
    color: "from-emerald-500 to-teal-500",
    description: "Fast reflex and routing. Connects signals across agents with low latency.",
    longDescription: "Agent Nerves acts as the high-speed communication bus between all agents in the ecosystem. It uses WebSockets and fast message queues to ensure signals, tasks, and telemetry data are routed to their correct destinations with minimal latency.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-nerves",
    span: "col-span-1",
    features: ["Message Queueing", "Low Latency Routing", "Event Bus", "WebSocket Streams"]
  },
  {
    id: "heart",
    name: "Agent Heart",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    description: "System vitality. Monitors agent health, heartbeats, and self-healing.",
    longDescription: "Agent Heart is responsible for the resilience of the ecosystem. It constantly monitors the heartbeat of all other agents, detects crashes or unresponsiveness, and triggers self-healing protocols to restart or recover failed components automatically.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-heart",
    span: "col-span-1",
    features: ["Health Checks", "Self-Healing", "Crash Recovery", "Uptime Monitoring"]
  },
  {
    id: "muscle",
    name: "Agent Muscle",
    icon: Activity,
    color: "from-orange-500 to-amber-500",
    description: "Heavy lifting. Executes massive parallel tasks, builds, and intensive compute.",
    longDescription: "Agent Muscle handles the 'heavy lifting' of the ecosystem. It spawns secure, isolated environments to run builds, tests, or massive data processing tasks concurrently, returning the results back to the Nerves without blocking the cognitive layer.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-muscle",
    span: "col-span-1",
    features: ["Concurrent Execution", "Isolated Containers", "Build Pipelines", "Heavy Compute"]
  },
  {
    id: "immune",
    name: "Agent Immune",
    icon: ShieldAlert,
    color: "from-blue-500 to-cyan-500",
    description: "Security and defense. Analyzes threats and enforces safety protocols.",
    longDescription: "Agent Immune is the security guard of the Autonomic ecosystem. It analyzes incoming webhooks, pull requests, and external payloads for malicious patterns, enforcing strict safety protocols to ensure the system cannot be compromised.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-immune",
    span: "col-span-1",
    features: ["Threat Detection", "Payload Validation", "Security Analysis", "Access Control"]
  },
  {
    id: "spine",
    name: "Agent Spine",
    icon: Layers,
    color: "from-slate-500 to-slate-400",
    description: "Structural integrity. Manages base protocols and physical infrastructure.",
    longDescription: "Agent Spine handles the foundational protocols and infrastructure provisioning required by the other agents. It ensures that the database, caching layers, and external service connections are robust and correctly configured.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-spine",
    span: "col-span-1",
    features: ["Infrastructure Provisioning", "Base Protocols", "Database Management", "Service Connections"]
  },
  {
    id: "eyes",
    name: "Agent Eyes",
    icon: Cpu,
    color: "from-yellow-400 to-orange-400",
    description: "Perception and vision. Analyzes visual data and UI elements.",
    longDescription: "Agent Eyes acts as the sensory input for the ecosystem. It receives visual data, UI screenshots, and external webhooks (like GitHub events), parses them into structured data, and sends the signals to the Brain for processing.",
    githubLink: "https://github.com/autonomic-ai-dev/agent-eyes",
    span: "col-span-1",
    features: ["Webhook Parsing", "Visual Analysis", "Sensory Input", "Data Structuring"]
  }
];
