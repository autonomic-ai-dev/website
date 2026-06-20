---
title: Installation
---

# Installation

Getting the Autonomic AI Ecosystem running on your local machine or server requires setting up the core agents and the message broker.

## Prerequisites

- Node.js v20+
- Bun
- Docker (for Agent Muscle)
- A GitHub API Token

## Step 1: Clone the Core Agents

You will need to clone all the active agents in the ecosystem into a single working directory:

```bash
mkdir autonomic-ai && cd autonomic-ai
git clone https://github.com/autonomic-ai-dev/agent-brain.git
git clone https://github.com/autonomic-ai-dev/agent-nerves.git
git clone https://github.com/autonomic-ai-dev/agent-muscle.git
```

## Step 2: Install Dependencies

For each agent, navigate to its directory and install the dependencies using Bun:

```bash
cd agent-brain
bun install
```

## Step 3: Configure Environment Variables

Create a `.env` file in each agent's directory. Refer to the `.env.example` file provided in each repository.

```env
GITHUB_TOKEN=your_github_token
OPENAI_API_KEY=your_openai_key
NERVES_URL=ws://localhost:3000
```

## Step 4: Boot the Ecosystem

Always start **Agent Nerves** first, as it acts as the central message bus.

```bash
# In terminal 1
cd agent-nerves && bun run dev

# In terminal 2
cd agent-brain && bun run dev

# In terminal 3
cd agent-muscle && bun run dev
```
