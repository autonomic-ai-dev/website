# Superpower Orchestrator: Stateful Workflow Engine

## Overview
While `agent-brain` serves as the token-efficient memory and context router, this new orchestration project acts as the **Stateful Execution Engine**. Its goal is to solve the operational frustrations commonly experienced with frameworks like LangChain, LangGraph, and CrewAI—namely boilerplate bloat, difficult state debugging, and poor native IDE integration.

## Problem Statement
Current multi-agent frameworks often struggle in local production environments:
- **Boilerplate Bloat:** Connecting a simple graph often requires hundreds of lines of complex Python.
- **State Debugging:** When cyclical graphs fail or loop infinitely, developers lack visibility into the corrupted state payload.
- **Terminal-bound UX:** These tools typically run in isolated terminals rather than integrating natively into the developer's IDE agent flow.

## Core Architectural Pillars

### 1. Declarative Workflows
Instead of imperative code, the orchestrator will use a clean, declarative configuration (e.g., YAML or a highly fluent Rust/Python DSL) to define execution graphs. This separates the *logic* of the workflow from the *infrastructure* running it, drastically reducing boilerplate.

### 2. Native IDE Supervisor Hook
Unlike CrewAI which runs an entire team in the terminal, this orchestrator will act as a local supervisor hook. It will seamlessly delegate sub-tasks directly to the native IDE agent (e.g., Cursor or Claude Code), allowing the developer to watch and intervene in the IDE interface they already use.

### 3. Transparent State Management & Time-Travel Debugging
State transitions between nodes will be captured immutably. The orchestrator will provide a localized visualization (or detailed logging output) of the payload at every graph edge, allowing for easy "time-traveling" to see exactly where an agent hallucinated or the state became corrupted.

### 4. Inference-Time Scaling & The 4-Layer Stack
To supercharge local/free models (e.g., DeepSeek-R1-Distill, Qwen2.5-Coder), the Orchestrator will natively support trading inference compute for reasoning depth. The architecture relies on a 4-layer stack to eliminate the typical weaknesses of smaller models:
1. **Information (`agent-brain`):** Injects exact, relevant context to prevent hallucinations.
2. **Structure (Orchestrator):** Breaks large tasks into micro-tasks with rigid, verifiable inputs/outputs.
3. **Reasoning Depth (Inference Scaling):** Enforces mandatory Chain-of-Thought (CoT), self-consistency (majority voting), and MCTS-style tree search on those narrow tasks. A 7B model running 20 inference passes can out-reason a 70B zero-shot pass.
4. **Mechanical Verification:** Employs Process Reward Models (PRMs) or strict compiler/linter loops to catch and correct errors mechanically before surfacing them to the user.

## Symbiosis with `agent-brain`
This project will integrate tightly with `agent-brain`:
- **Orchestrator:** Defines *what* needs to be done and tracks the execution *state*.
- **Agent-Brain:** Decides *which context* to load for each individual step of the execution, keeping the token budget lean at every node.

## Realistic Limitations & The Hybrid Approach
It is crucial to acknowledge what this scaffolding **fixes** vs. what it **cannot fix**:
- **Fixed (Information & Structure Problems):** Hallucinations, context drift mid-task, and mechanical errors. For tasks like implementing against existing interfaces, writing boilerplate, or fixing type errors, this 4-layer stack empowers a free 7B model to punch like a 70B model.
- **Cannot Fix (Deep Intelligence Problems):** Designing complex architectures from ambiguous requirements, or debugging subtle cross-file race conditions. These require genuine, deep reasoning that context injection cannot substitute.

**The Bottom Line:** This Orchestrator does not fully replace frontier models like GPT-4o. Instead, it handles the 80% of routine engineering work locally and for free, reserving expensive frontier models strictly for the 20% of tasks that require true high-level reasoning.

### Bridging the Intelligence Gap
To actively bridge this remaining 20% gap without abandoning the local-first philosophy, the Orchestrator will implement three advanced fallback mechanisms:
1. **Human-in-the-Loop (HITL) Checkpoints:** At high-complexity structural nodes (e.g., "Architecture Design"), the workflow pauses and requests a short, guiding decision from the developer. The local model then translates this manual "deep intelligence" into execution.
2. **Multi-Agent Debate:** For subtle bugs, the Orchestrator can instantiate opposing local personas (e.g., Implementer vs. Skeptical Reviewer) to rigorously critique and refine logic before accepting a state transition, trading inference time for reasoning depth.
3. **Seamless Escalation Routing:** If the local model repeatedly fails the verification loop (e.g., 5 consecutive compiler errors), a Confidence Router catches this ceiling and temporarily escalates that *single sub-task* to a frontier API (like Claude 3.5 Sonnet). Once solved, execution returns to the free local model, keeping total costs near zero.

## Next Steps
> [!IMPORTANT]
> Please review this conceptual outline. Are there specific execution pain points you've faced with your workflows that we should explicitly tackle here? Should this be built primarily in Rust (like `agent-brain`) or Python (to capture the existing LangChain ecosystem)?
