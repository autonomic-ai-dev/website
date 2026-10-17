# Brain-Spine Ecosystem Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 6 phases of brain-spine ecosystem features: shared crate, dynamic routing, prompt hydration, evolution loop, brain standalone gaps, spine standalone gaps.

**Architecture:** agent-body workspace gains a `core` crate with shared types. agent-brain extends with workflow indexing, AST parsing, distillation, auto-wire. agent-spine extends with wake-on-call, sandbox execution, enriched trajectory logging.

**Tech Stack:** Rust 2024, tokio, tree-sitter, bollard, serde, SQLite

---

## Phase 0: agent-body-core + Wake-On-Call

Bumps: agent-body v0.1.0, agent-brain v0.25.0, agent-spine v0.10.0

### Task 0.1: Create agent-body workspace and core crate

**Files:**
- Create: `agent-body/Cargo.toml`
- Create: `agent-body/core/Cargo.toml`
- Create: `agent-body/core/src/lib.rs`
- Create: `agent-body/core/src/provenance.rs`
- Create: `agent-body/core/src/execution.rs`
- Create: `agent-body/core/src/context.rs`
- Create: `agent-body/core/src/error.rs`

- [ ] **Step 1: Create workspace Cargo.toml**

```toml
# agent-body/Cargo.toml
[workspace]
members = ["core"]
resolver = "2"
```

- [ ] **Step 2: Create core crate Cargo.toml**

```toml
# agent-body/core/Cargo.toml
[package]
name = "agent-body-core"
version = "0.1.0"
edition = "2024"

[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
uuid = { version = "1", features = ["v7", "serde"] }
thiserror = "2"
```

- [ ] **Step 3: Create provenance.rs**

```rust
// agent-body/core/src/provenance.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BrainProvenance {
    pub context_id: String,
    pub route_confidence: f64,
    pub skills_used: Vec<String>,
    pub agents_loaded: Vec<String>,
}

impl BrainProvenance {
    pub fn new(context_id: String, route_confidence: f64) -> Self {
        Self {
            context_id,
            route_confidence,
            skills_used: Vec::new(),
            agents_loaded: Vec::new(),
        }
    }
}
```

- [ ] **Step 4: Create execution.rs**

```rust
// agent-body/core/src/execution.rs
use serde::{Deserialize, Serialize};
use std::fmt;
use uuid::Uuid;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct ExecutionId(Uuid);

impl ExecutionId {
    pub fn new() -> Self {
        Self(Uuid::now_v7())
    }
}

impl Default for ExecutionId {
    fn default() -> Self {
        Self::new()
    }
}

impl fmt::Display for ExecutionId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl From<Uuid> for ExecutionId {
    fn from(u: Uuid) -> Self {
        Self(u)
    }
}

impl From<ExecutionId> for Uuid {
    fn from(id: ExecutionId) -> Self {
        id.0
    }
}
```

- [ ] **Step 5: Create context.rs**

```rust
// agent-body/core/src/context.rs
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RouteLimits {
    pub agents: usize,
    pub memory: usize,
    pub rules: usize,
    pub skills: usize,
}

impl Default for RouteLimits {
    fn default() -> Self {
        Self {
            agents: 2,
            memory: 5,
            rules: 5,
            skills: 3,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScoredItem {
    pub score: f64,
    pub content: String,
    pub metadata: Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContextBundle {
    pub rules: Vec<ScoredItem>,
    pub skills: Vec<ScoredItem>,
    pub agents: Vec<ScoredItem>,
    pub bash_allowed_patterns: Vec<String>,
    pub bash_blocked_patterns: Vec<String>,
    pub provenance: Option<crate::provenance::BrainProvenance>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WorkflowTriggerKind {
    Rule(String),
    Skill(String),
    Agent(String),
    Memory(String, String),
    TriggerWorkflow(WorkflowTrigger),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowTrigger {
    pub workflow_path: String,
    pub workflow_name: String,
    pub context_payload: Option<Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TaskKind {
    Unknown,
    Feature,
    Bugfix,
    Refactor,
    Review,
    Security,
    Database,
    Test,
}
```

- [ ] **Step 6: Create error.rs**

```rust
// agent-body/core/src/error.rs
use thiserror::Error;

#[derive(Debug, Error)]
pub enum CoreError {
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
    #[error("UUID error: {0}")]
    Uuid(#[from] uuid::Error),
}
```

- [ ] **Step 7: Create lib.rs**

```rust
// agent-body/core/src/lib.rs
pub mod provenance;
pub mod execution;
pub mod context;
pub mod error;

pub use provenance::BrainProvenance;
pub use execution::ExecutionId;
pub use context::{
    ContextBundle, RouteLimits, ScoredItem, TaskKind, WorkflowTrigger,
    WorkflowTriggerKind,
};
pub use error::CoreError;
```

- [ ] **Step 8: Verify it compiles**

Run: `cd agent-body && cargo build`
Expected: clean build with no warnings

- [ ] **Step 9: Commit**

```bash
git -C agent-body add -A && git -C agent-body commit -m "feat: initial workspace with agent-body-core crate"
```

### Task 0.2: Add agent-body-core dependency to agent-brain

**Files:**
- Modify: `agent-brain/agent-brain/Cargo.toml`

- [ ] **Step 1: Add dependency**

```toml
# agent-brain/agent-brain/Cargo.toml
[dependencies]
agent-body-core = { git = "https://github.com/autonomic-ai-dev/agent-body" }
```

- [ ] **Step 2: Verify build**

Run: `cd agent-brain && cargo check`
Expected: clean build

- [ ] **Step 3: Commit**

```bash
git -C agent-brain add -A && git -C agent-brain commit -m "chore: add agent-body-core dependency"
```

### Task 0.3: Add agent-body-core dependency to agent-spine

**Files:**
- Modify: `agent-spine/agent-spine/Cargo.toml`

- [ ] **Step 1: Add dependency**

```toml
# agent-spine/agent-spine/Cargo.toml
[dependencies]
agent-body-core = { git = "https://github.com/autonomic-ai-dev/agent-body" }
```

- [ ] **Step 2: Verify build**

Run: `cd agent-spine && cargo check`
Expected: clean build

- [ ] **Step 3: Commit**

```bash
git -C agent-spine add -A && git -C agent-spine commit -m "chore: add agent-body-core dependency"
```

### Task 0.4: Migrate agent-brain to use shared types

**Files:**
- Modify: `agent-brain/agent-brain/src/types.rs`
- Modify: `agent-brain/agent-brain/src/bridge.rs`

- [ ] **Step 1: Replace BrainProvenance in bridge.rs with shared import**

```rust
// agent-brain/agent-brain/src/bridge.rs
// Remove local BrainProvenance struct
// Add at top:
use agent_body_core::BrainProvenance;
```

- [ ] **Step 2: Strip duplicated types from types.rs**

Remove local definitions of: `RouteLimits`, `TaskKind`, `ScoredItem`. Replace with:

```rust
use agent_body_core::{RouteLimits, TaskKind, ScoredItem, WorkflowTriggerKind};
```

- [ ] **Step 3: Verify build**

Run: `cd agent-brain && cargo check`
Expected: clean build

- [ ] **Step 4: Commit**

```bash
git -C agent-brain add -A && git -C agent-brain commit -m "refactor: use shared types from agent-body-core"
```

### Task 0.5: Migrate agent-spine to use shared types

**Files:**
- Modify: `agent-spine/agent-spine/src/brain_router.rs`
- Modify: `agent-spine/agent-spine/src/execution.rs`
- Modify: `agent-spine/agent-spine/src/lib.rs`

- [ ] **Step 1: Replace BrainProvenance in brain_router.rs**

```rust
// agent-spine/agent-spine/src/brain_router.rs
// Remove local BrainProvenance struct
use agent_body_core::BrainProvenance;
```

- [ ] **Step 2: Replace ExecutionId in execution.rs**

```rust
// agent-spine/agent-spine/src/execution.rs
// Remove local ExecutionId struct
use agent_body_core::ExecutionId;
```

- [ ] **Step 3: Verify build**

Run: `cd agent-spine && cargo check`
Expected: clean build

- [ ] **Step 4: Commit**

```bash
git -C agent-spine add -A && git -C agent-spine commit -m "refactor: use shared types from agent-body-core"
```

### Task 0.6: Implement wake-on-call in agent-spine

**Files:**
- Create: `agent-spine/agent-spine/src/wake_on_call.rs`
- Modify: `agent-spine/agent-spine/src/mcp_bridge.rs`

- [ ] **Step 1: Create wake_on_call.rs**

```rust
// agent-spine/agent-spine/src/wake_on_call.rs
use std::path::PathBuf;
use std::process::Stdio;
use tokio::process::Command;
use tracing::{info, warn};

const COMMON_PATHS: &[&str] = &[
    "/usr/local/bin/agent-brain",
    "/usr/local/bin/agent-brain.exe",
];
const PATH_ENV: &str = "BRAIN_PATH";

async fn find_brain() -> Option<PathBuf> {
    // 1. Check BRAIN_PATH env var
    if let Ok(path) = std::env::var(PATH_ENV) {
        let p = PathBuf::from(&path);
        if p.exists() {
            return Some(p);
        }
    }

    // 2. Check common install paths
    for path in COMMON_PATHS {
        let p = PathBuf::from(path);
        if p.exists() {
            return Some(p);
        }
    }

    // 3. Check PATH
    if let Ok(output) = Command::new("which").arg("agent-brain").output().await {
        let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
        if !path.is_empty() {
            return Some(PathBuf::from(path));
        }
    }

    // 4. Check cargo bin
    if let Ok(home) = std::env::var("HOME") {
        let cargo_bin = PathBuf::from(&home).join(".cargo/bin/agent-brain");
        if cargo_bin.exists() {
            return Some(cargo_bin);
        }
    }

    None
}

pub async fn try_spawn_brain() -> Option<std::process::Child> {
    let path = find_brain().await?;
    info!("Found agent-brain at {:?}, spawning...", path);

    match Command::new(&path)
        .arg("serve")
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .kill_on_drop(true)
        .spawn()
    {
        Ok(child) => {
            info!("agent-brain spawned successfully (pid: {})", child.id());
            Some(child.into_std().ok()?)
        }
        Err(e) => {
            warn!("Failed to spawn agent-brain: {}", e);
            None
        }
    }
}

pub async fn wait_for_brain(max_attempts: u32) -> bool {
    for attempt in 0..max_attempts {
        if mcp_port_open().await {
            info!("agent-brain ready after {} attempts", attempt + 1);
            return true;
        }
        tokio::time::sleep(std::time::Duration::from_millis(200)).await;
    }
    false
}

async fn mcp_port_open() -> bool {
    // Check if agent-brain's MCP socket is accepting connections
    // Uses a simple TCP connect check (default MCP port or stdio based)
    // For stdio-based MCP, we check if the process is alive
    #[cfg(unix)]
    {
        let output = std::process::Command::new("pgrep")
            .arg("-x")
            .arg("agent-brain")
            .output()
            .ok()?;
        output.status.success()
    }
    #[cfg(not(unix))]
    {
        true // Windows placeholder
    }
}
```

- [ ] **Step 2: Integrate wake_on_call into McpBridge::connect()**

In `agent-spine/agent-spine/src/mcp_bridge.rs`, before the initial handshake attempt:

```rust
// In McpBridge::connect() or similar entry point
use crate::wake_on_call;

pub async fn connect() -> Result<Self, BridgeError> {
    // Try initial handshake
    match try_handshake().await {
        Ok(bridge) => return Ok(bridge),
        Err(_) => {
            info!("agent-brain not reachable, attempting wake-on-call...");
        }
    }

    // Try to spawn brain
    let _child = wake_on_call::try_spawn_brain().await;
    let ready = wake_on_call::wait_for_brain(30).await;

    if !ready {
        warn!("agent-brain wake-on-call failed, operating without brain");
        return Err(BridgeError::BrainUnavailable);
    }

    // Retry handshake
    try_handshake().await
}
```

- [ ] **Step 3: Verify build**

Run: `cd agent-spine && cargo check`
Expected: clean build

- [ ] **Step 4: Commit**

```bash
git -C agent-spine add -A && git -C agent-spine commit -m "feat: add wake-on-call for agent-brain"
```

### Task 0.7: Pin agent-body commit references

- [ ] **Step 1: Push agent-body to remote**

```bash
git -C agent-body push origin master
```

- [ ] **Step 2: Update Cargo.lock in agent-brain**

```bash
cd agent-brain && cargo update -p agent-body-core
```

- [ ] **Step 3: Update Cargo.lock in agent-spine**

```bash
cd agent-spine && cargo update -p agent-body-core
```

- [ ] **Step 4: Commit lockfile updates**

```bash
git -C agent-brain commit -m "chore: update agent-body-core lockfile" && git -C agent-spine commit -m "chore: update agent-body-core lockfile"
```

---

## Phase 1: Dynamic Graph Routing

Bumps: agent-brain v0.26.0, agent-spine v0.11.0

### Task 1.1: Add WorkflowTrigger type to agent-body-core

**Files:**
- Modify: `agent-body/core/src/context.rs`

- [ ] **Step 1: Add WorkflowTrigger variant to context.rs**

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MustApplyKind {
    Rule(String),
    Skill(String),
    Agent(String),
    Memory(String, String),
    TriggerWorkflow(WorkflowTrigger),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowTrigger {
    pub workflow_path: String,
    pub workflow_name: String,
    pub context_payload: Option<serde_json::Value>,
}
```

- [ ] **Step 2: Verify build**

Run: `cd agent-body && cargo build`

- [ ] **Step 3: Commit**

```bash
git -C agent-body commit -am "feat: add WorkflowTrigger types for dynamic routing"
```

### Task 1.2: Workflow indexer in agent-brain

**Files:**
- Create: `agent-brain/agent-brain/src/workflow_indexer.rs`
- Modify: `agent-brain/agent-brain/src/lib.rs`
- Modify: `agent-brain/agent-brain/src/config.rs`

- [ ] **Step 1: Create workflow_indexer.rs**

```rust
// agent-brain/agent-brain/src/workflow_indexer.rs
use anyhow::Result;
use serde::Deserialize;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

#[derive(Debug, Deserialize)]
pub struct WorkflowDef {
    pub name: String,
    pub start_node: String,
    pub nodes: Vec<WorkflowNodeDef>,
}

#[derive(Debug, Deserialize)]
pub struct WorkflowNodeDef {
    pub name: String,
    pub kind: String,
    pub description: Option<String>,
}

pub fn discover_workflows(workflow_dirs: &[PathBuf]) -> Vec<(PathBuf, WorkflowDef)> {
    let mut workflows = Vec::new();
    for dir in workflow_dirs {
        if !dir.exists() {
            continue;
        }
        for entry in WalkDir::new(dir).max_depth(2) {
            let entry = match entry {
                Ok(e) => e,
                Err(_) => continue,
            };
            if entry.path().extension().map_or(true, |e| e != "yaml") {
                continue;
            }
            match parse_workflow(entry.path()) {
                Ok(def) => workflows.push((entry.path().to_path_buf(), def)),
                Err(e) => tracing::warn!("Failed to parse workflow {}: {}", entry.path().display(), e),
            }
        }
    }
    workflows
}

fn parse_workflow(path: &Path) -> Result<WorkflowDef> {
    let content = std::fs::read_to_string(path)?;
    let def: WorkflowDef = serde_yaml::from_str(&content)?;
    Ok(def)
}
```

- [ ] **Step 2: Integrate into index.rs**

During indexing pass, call `workflow_indexer::discover_workflows()` and store each as an `indexed_items` row with `item_type = "workflow"`.

- [ ] **Step 3: Step 3: Verify build**

Run: `cd agent-brain && cargo check`

- [ ] **Step 4: Commit**

```bash
git -C agent-brain commit -am "feat: add workflow YAML indexer"
```

### Task 1.3: Spine auto-trigger from route_task

**Files:**
- Modify: `agent-spine/agent-spine/src/brain_router.rs`

- [ ] **Step 1: Parse TriggerWorkflow from route_task response**

```rust
// In BrainRouter, after route_task call
if let Some(triggers) = response.must_apply.iter().filter_map(|k| {
    if let MustApplyKind::TriggerWorkflow(t) = k {
        Some(t)
    } else {
        None
    }
}).next() {
    info!("Brain triggered workflow: {}", triggers.workflow_name);
    // Submit via WorkflowManager
    let payload = triggers.context_payload.clone().unwrap_or_default();
    let result = workflow_manager.submit(&triggers.workflow_path, payload).await?;
    return Ok(result);
}
```

- [ ] **Step 2: Verify build**

Run: `cd agent-spine && cargo check`

- [ ] **Step 3: Commit**

```bash
git -C agent-spine commit -am "feat: auto-trigger workflows from brain route_task"
```

---

## Phase 2: Subagent Prompt Hydration

Bumps: agent-brain v0.27.0, agent-spine v0.12.0

### Task 2.1: Add get_context_for_node MCP tool

**Files:**
- Create: `agent-brain/agent-brain/src/node_context.rs`
- Modify: `agent-brain/agent-brain/src/mcp/server.rs`
- Modify: `agent-brain/agent-brain/src/lib.rs`

- [ ] **Step 1: Create node_context.rs with node routing logic**

```rust
// agent-brain/agent-brain/src/node_context.rs
use agent_body_core::{ContextBundle, RouteLimits, ScoredItem};
use anyhow::Result;

pub struct NodeContextParams {
    pub node_kind: String,
    pub node_name: String,
    pub node_description: String,
    pub workflow_name: String,
    pub task_description: String,
}

pub fn get_context_for_node(
    store: &crate::db::store::BrainStore,
    params: &NodeContextParams,
    limits: &RouteLimits,
) -> Result<ContextBundle> {
    let query = format!(
        "{} {} {} {} {}",
        params.node_name,
        params.node_description,
        params.workflow_name,
        params.node_kind,
        params.task_description
    );

    let rules = store.search_items("rule", &query, limits.rules)?;
    let skills = store.search_items("skill", &query, limits.skills)?;
    let agents = store.search_items("agent", &query, limits.agents)?;
    let bash_allowed = extract_bash_patterns(&skills, "allowed");
    let bash_blocked = extract_bash_patterns(&skills, "blocked");

    Ok(ContextBundle {
        rules,
        skills,
        agents,
        bash_allowed_patterns: bash_allowed,
        bash_blocked_patterns: bash_blocked,
        provenance: None,
    })
}

fn extract_bash_patterns(skills: &[ScoredItem], kind: &str) -> Vec<String> {
    skills
        .iter()
        .filter_map(|s| {
            s.metadata.get(kind)
                .and_then(|v| v.as_array())
                .map(|arr| {
                    arr.iter()
                        .filter_map(|v| v.as_str().map(String::from))
                        .collect::<Vec<_>>()
                })
        })
        .flatten()
        .collect()
}
```

- [ ] **Step 2: Register as MCP tool in server.rs**

```rust
// In BrainMcp::register_tools()
server.register_tool(
    "get_context_for_node",
    "Fetch specialized rules/skills/agents for a workflow node",
    |params: GetContextForNodeParams| {
        let ctx = get_context_for_node(&store, &params.into(), &RouteLimits::default())?;
        Ok(ctx)
    }
);
```

- [ ] **Step 3: Verify build**

Run: `cd agent-brain && cargo check`

- [ ] **Step 4: Commit**

```bash
git -C agent-brain commit -am "feat: add get_context_for_node MCP tool"
```

### Task 2.2: Spine calls get_context_for_node before execution

**Files:**
- Modify: `agent-spine/agent-spine/src/executor.rs`

- [ ] **Step 1: Add brain context call before agent node spawn**

```rust
// In Executor, Phase 2 (spawn phase), before spawning agent node
if let Some(brain) = &self.brain_router {
    if brain.is_connected() {
        let ctx = brain.get_context_for_node(
            node.kind.to_string(),
            node.name.clone(),
            node.description.clone(),
            self.workflow.name.clone(),
            self.current_task_description(),
        ).await;

        if let Ok(ctx) = ctx {
            payload.insert("_brain_rules".into(), serde_json::to_value(ctx.rules).unwrap_or_default());
            payload.insert("_brain_skills".into(), serde_json::to_value(ctx.skills).unwrap_or_default());
            payload.insert("_bash_blocked_patterns".into(), serde_json::to_value(ctx.bash_blocked_patterns).unwrap_or_default());
        }
    }
}
```

- [ ] **Step 2: Verify build**

Run: `cd agent-spine && cargo check`

- [ ] **Step 3: Commit**

```bash
git -C agent-spine commit -am "feat: hydrate node context from brain before execution"
```

---

## Phase 3: Continuous Evolution Loop

Bumps: agent-brain v0.28.0, agent-spine v0.13.0

### Task 3.1: Enrich trajectory logging in agent-spine

**Files:**
- Modify: `agent-spine/agent-spine/src/executor.rs`
- Modify: `agent-spine/agent-spine/src/brain_router.rs`

- [ ] **Step 1: Add latency, model_used, payload_snapshot to store_trajectory call**

```rust
// In Executor, after node completion
let latency = start_time.elapsed().as_millis() as u64;
let model_used = payload.get("_model").and_then(|v| v.as_str()).unwrap_or("unknown");

brain.store_trajectory(StoreTrajectoryParams {
    workflow_id: self.execution_id.to_string(),
    node_id: node.name.clone(),
    outcome: outcome.to_string(),
    node_kind: node.kind.to_string(),
    model_used: model_used.to_string(),
    latency_ms: latency,
    payload_snapshot: Some(payload.clone()),
    error_message: error.as_ref().map(|e| e.to_string()),
    route_log_id: self.route_log_id.clone(),
}).await;
```

- [ ] **Step 2: Verify build**

Run: `cd agent-spine && cargo check`

- [ ] **Step 3: Commit**

```bash
git -C agent-spine commit -am "feat: enrich trajectory logs with latency, model, payload"
```

### Task 3.2: Dataset compilation in agent-brain

**Files:**
- Create: `agent-brain/agent-brain/src/dataset.rs`
- Modify: `agent-brain/agent-brain/src/main.rs`
- Modify: `agent-brain/agent-brain/src/lib.rs`

- [ ] **Step 1: Create dataset.rs**

```rust
// agent-brain/agent-brain/src/dataset.rs
use agent_body_core::BrainProvenance;
use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub struct DatasetEntry {
    pub instruction: String,
    pub response: String,
    pub workflow_name: String,
    pub node_kind: String,
    pub model: String,
    pub outcome: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub provenance: Option<BrainProvenance>,
}

#[derive(Debug, Default, Serialize)]
pub struct DatasetStats {
    pub total: u64,
    pub successful: u64,
    pub per_workflow: std::collections::HashMap<String, u64>,
    pub per_model: std::collections::HashMap<String, u64>,
    pub date_range: Option<(chrono::DateTime<chrono::Utc>, chrono::DateTime<chrono::Utc>)>,
}

pub fn export_dataset(
    store: &crate::db::store::BrainStore,
    min_confidence: f64,
    only_successful: bool,
) -> Result<Vec<DatasetEntry>> {
    let trajectories = store.query_trajectories(min_confidence, only_successful)?;
    let mut entries = Vec::new();

    for traj in trajectories {
        let instruction = format!(
            "Workflow: {} | Node: {} ({}) | Task: {}",
            traj.workflow_name,
            traj.node_name,
            traj.node_kind,
            traj.task_description.unwrap_or_default(),
        );
        let response = traj
            .payload_snapshot
            .and_then(|p| p.get("result").and_then(|r| r.as_str()))
            .unwrap_or("")
            .to_string();

        entries.push(DatasetEntry {
            instruction,
            response,
            workflow_name: traj.workflow_name,
            node_kind: traj.node_kind,
            model: traj.model_used,
            outcome: traj.outcome,
            timestamp: traj.created_at,
            provenance: None,
        });
    }

    Ok(entries)
}

pub fn compute_stats(entries: &[DatasetEntry]) -> DatasetStats {
    let mut stats = DatasetStats::default();
    stats.total = entries.len() as u64;
    stats.successful = entries.iter().filter(|e| e.outcome == "success").count() as u64;

    for entry in entries {
        *stats.per_workflow.entry(entry.workflow_name.clone()).or_insert(0) += 1;
        *stats.per_model.entry(entry.model.clone()).or_insert(0) += 1;
    }

    if let (Some(first), Some(last)) = (entries.first(), entries.last()) {
        stats.date_range = Some((first.timestamp, last.timestamp));
    }

    stats
}
```

- [ ] **Step 2: Add CLI subcommands to main.rs**

```rust
// In main.rs, add to the CLI enum
#[derive(clap::Subcommand)]
enum Commands {
    /// ...existing commands...
    Dataset(DatasetCommands),
}

#[derive(clap::Subcommand)]
enum DatasetCommands {
    Export {
        #[arg(long, default_value = "dataset.jsonl")]
        out: PathBuf,
        #[arg(long, default_value_t = 0.8)]
        min_confidence: f64,
        #[arg(long, default_value_t = true)]
        only_successful: bool,
    },
    Stats {
        #[arg(long, default_value_t = 0.8)]
        min_confidence: f64,
    },
}
```

- [ ] **Step 3: Verify build and test export**

Run: `cd agent-brain && cargo check`

- [ ] **Step 4: Commit**

```bash
git -C agent-brain commit -am "feat: add dataset export and stats CLI"
```

---

## Phase 4: agent-brain Standalone

Bumps: agent-brain v0.29.0 → v0.31.0

### Task 4.1: tree-sitter AST indexing

**Files:**
- Create: `agent-brain/agent-brain/src/ast_indexer.rs`
- Modify: `agent-brain/agent-brain/Cargo.toml`
- Modify: `agent-brain/agent-brain/src/lib.rs`
- Modify: `agent-brain/agent-brain/src/index.rs`

- [ ] **Step 1: Add tree-sitter dependencies to Cargo.toml**

```toml
tree-sitter = "0.24"
tree-sitter-rust = "0.22"
tree-sitter-typescript = "0.23"
tree-sitter-python = "0.21"
tree-sitter-go = "0.22"
```

- [ ] **Step 2: Create ast_indexer.rs**

```rust
// agent-brain/agent-brain/src/ast_indexer.rs
use anyhow::Result;
use std::path::Path;
use tree_sitter::{Language, Parser};

#[derive(Debug)]
pub struct AstSymbol {
    pub symbol_name: String,
    pub symbol_kind: String,
    pub content: String,
    pub file_path: String,
    pub start_line: usize,
    pub end_line: usize,
    pub language: String,
    pub doc_comment: Option<String>,
}

fn language_for_path(path: &Path) -> Option<(Language, &'static str)> {
    let ext = path.extension()?.to_str()?;
    match ext {
        "rs" => Some((tree_sitter_rust::language(), "rust")),
        "ts" | "tsx" => Some((tree_sitter_typescript::language_typescript(), "typescript")),
        "js" | "jsx" => Some((tree_sitter_typescript::language_javascript(), "javascript")),
        "py" => Some((tree_sitter_python::language(), "python")),
        "go" => Some((tree_sitter_go::language(), "go")),
        _ => None,
    }
}

pub fn index_file(path: &Path) -> Result<Vec<AstSymbol>> {
    let (lang, lang_name) = match language_for_path(path) {
        Some(l) => l,
        None => return Ok(Vec::new()),
    };

    let source = std::fs::read_to_string(path)?;
    let mut parser = Parser::new();
    parser.set_language(lang)?;
    let tree = parser.parse(&source, None).ok_or_else(|| anyhow::anyhow!("Failed to parse"))?;
    let root = tree.root_node();

    let mut symbols = Vec::new();
    extract_symbols(root, &source, path, lang_name, &mut symbols);
    Ok(symbols)
}

fn extract_symbols(
    node: tree_sitter::Node,
    source: &str,
    path: &Path,
    lang: &str,
    symbols: &mut Vec<AstSymbol>,
) {
    let kind = node.kind();
    let is_definition = matches!(kind,
        "function_item" | "struct_item" | "impl_item" | "trait_item"
        | "function_declaration" | "class_declaration" | "interface_declaration"
        | "function_definition" | "class_definition"
        | "method_definition"
    );

    if is_definition {
        let name_node = node.child_by_field_name("name");
        let symbol_name = name_node
            .and_then(|n| source[n.byte_range()].split_whitespace().next())
            .unwrap_or("unnamed")
            .to_string();

        let content = source[node.byte_range()].to_string();
        let doc_comment = extract_doc_comment(node, source);

        symbols.push(AstSymbol {
            symbol_name,
            symbol_kind: kind.to_string(),
            content,
            file_path: path.to_string_lossy().to_string(),
            start_line: node.start_position().row + 1,
            end_line: node.end_position().row + 1,
            language: lang.to_string(),
            doc_comment,
        });
    }

    for child in node.children(&mut node.walk()) {
        extract_symbols(child, source, path, lang, symbols);
    }
}

fn extract_doc_comment(node: tree_sitter::Node, source: &str) -> Option<String> {
    let prev = node.prev_sibling()?;
    let text = source[prev.byte_range()].trim();
    if text.starts_with("///") || text.starts_with("/**") || text.starts_with("//!") {
        Some(text.to_string())
    } else {
        None
    }
}
```

- [ ] **Step 3: Integrate into index.rs indexing pass**

```rust
// In index.rs, add call to ast_indexer after file content scan
let ast_symbols = ast_indexer::index_file(path)?;
for symbol in ast_symbols {
    store.upsert_item(crate::db::store::IndexedItem {
        item_type: "ast_symbol".to_string(),
        content: symbol.content,
        metadata: serde_json::json!({
            "symbol_name": symbol.symbol_name,
            "symbol_kind": symbol.symbol_kind,
            "file_path": symbol.file_path,
            "start_line": symbol.start_line,
            "end_line": symbol.end_line,
            "language": symbol.language,
            "doc_comment": symbol.doc_comment,
        }),
    })?;
}
```

- [ ] **Step 4: Verify build**

Run: `cd agent-brain && cargo check`

- [ ] **Step 5: Commit**

```bash
git -C agent-brain commit -am "feat: add tree-sitter AST indexing"
```

### Task 4.2: Automated distillation to ARCHITECTURE.md

**Files:**
- Create: `agent-brain/agent-brain/src/distill.rs`
- Modify: `agent-brain/agent-brain/src/main.rs`
- Modify: `agent-brain/agent-brain/src/lib.rs`

- [ ] **Step 1: Create distill.rs**

```rust
// agent-brain/agent-brain/src/distill.rs
use anyhow::Result;
use chrono::Utc;
use serde::Serialize;
use std::path::Path;
use std::collections::HashMap;

#[derive(Debug, Serialize)]
pub struct DistilledArch {
    pub title: String,
    pub generated_at: String,
    pub total_facts: usize,
    pub system_overview: Vec<String>,
    pub key_modules: Vec<ModuleSummary>,
    pub decisions: Vec<String>,
}

#[derive(Debug, Serialize)]
pub struct ModuleSummary {
    pub name: String,
    pub description: String,
    pub score: f64,
    pub fact_count: usize,
}

pub fn distill(store: &crate::db::store::BrainStore) -> Result<DistilledArch> {
    let active_facts = store.query_active_facts()?;
    let total_facts = active_facts.len();

    // Group facts by topic
    let mut by_topic: HashMap<String, Vec<&crate::db::store::Fact>> = HashMap::new();
    for fact in &active_facts {
        by_topic.entry(fact.topic.clone()).or_default().push(fact);
    }

    // Score and rank topics
    let mut topic_scores: Vec<(String, f64, usize)> = by_topic
        .into_iter()
        .map(|(topic, facts)| {
            let n = facts.len();
            let avg_conf: f64 = facts.iter().map(|f| f.confidence).sum::<f64>() / n as f64;
            (topic, avg_conf, n)
        })
        .collect();
    topic_scores.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());

    // Build system overview from top facts
    let system_overview = topic_scores
        .iter()
        .take(5)
        .map(|(topic, _, _)| format!("- **{}**: key subsystem", topic))
        .collect();

    // Build key modules
    let key_modules: Vec<ModuleSummary> = topic_scores
        .iter()
        .take(10)
        .map(|(name, score, count)| ModuleSummary {
            name: name.clone(),
            description: format!("Active topic with {} facts", count),
            score: *score,
            fact_count: *count,
        })
        .collect();

    // Decisions
    let decisions = vec![
        "ADD-only memory model (no UPDATE, only invalidation)".to_string(),
        "Bundled SQLite over external Postgres — zero-config, local-first".to_string(),
    ];

    Ok(DistilledArch {
        title: "Architecture — agent-brain".to_string(),
        generated_at: Utc::now().to_rfc3339(),
        total_facts,
        system_overview,
        key_modules,
        decisions,
    })
}

pub fn write_architecture_md(distilled: &DistilledArch, path: &Path) -> Result<()> {
    let mut md = String::new();

    md.push_str(&format!("# {}\n\n", distilled.title));
    md.push_str(&format!("*Auto-generated from {} active facts. Last updated: {}*\n\n", distilled.total_facts, distilled.generated_at));
    md.push_str("## System Overview\n\n");
    for line in &distilled.system_overview {
        md.push_str(line);
        md.push('\n');
    }
    md.push_str("\n## Key Modules\n\n");
    for m in &distilled.key_modules {
        md.push_str(&format!("- **{}** — {} (confidence: {:.2}, {} facts)\n", m.name, m.description, m.score, m.fact_count));
    }
    md.push_str("\n## Decisions\n\n");
    for d in &distilled.decisions {
        md.push_str(&format!("- {}\n", d));
    }

    std::fs::write(path, md)?;
    Ok(())
}
```

- [ ] **Step 2: Add CLI subcommand**

```rust
// In main.rs
#[derive(clap::Subcommand)]
enum Commands {
    Distill {
        #[arg(long, default_value = "ARCHITECTURE.md")]
        out: PathBuf,
    },
}

// Handler
Commands::Distill { out } => {
    let store = open_store()?;
    let distilled = distill::distill(&store)?;
    distill::write_architecture_md(&distilled, &out)?;
    println!("Architecture written to {}", out.display());
}
```

- [ ] **Step 3: Verify build and commit**

```bash
cd agent-brain && cargo check
git -C agent-brain commit -am "feat: add automated distillation to ARCHITECTURE.md"
```

### Task 4.3: Auto-wire configs daemon

**Files:**
- Create: `agent-brain/agent-brain/src/autowire.rs`
- Modify: `agent-brain/agent-brain/src/main.rs`

- [ ] **Step 1: Create autowire.rs**

```rust
// agent-brain/agent-brain/src/autowire.rs
use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::{Path, PathBuf};

#[derive(Debug, Serialize, Deserialize)]
pub struct InstallMeta {
    pub binary_path: String,
    pub version: String,
    pub installed_at: String,
}

const INSTALL_META_DIR: &str = ".config/agent-brain";
const INSTALL_META_FILE: &str = "install_meta.json";

fn install_meta_path() -> PathBuf {
    let home = std::env::var("HOME").unwrap_or_else(|_| "/tmp".to_string());
    PathBuf::from(&home).join(INSTALL_META_DIR).join(INSTALL_META_FILE)
}

fn read_meta() -> Result<Option<InstallMeta>> {
    let path = install_meta_path();
    if !path.exists() {
        return Ok(None);
    }
    let content = std::fs::read_to_string(&path)?;
    Ok(Some(serde_json::from_str(&content)?))
}

fn write_meta(meta: &InstallMeta) -> Result<()> {
    let path = install_meta_path();
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)?;
    }
    std::fs::write(&path, serde_json::to_string_pretty(meta)?)?;
    Ok(())
}

#[derive(Debug, Serialize, Deserialize)]
struct McpConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    mcp_servers: Option<HashMap<String, McpServerConfig>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    servers: Option<HashMap<String, McpServerConfig>>,
}

#[derive(Debug, Serialize, Deserialize)]
struct McpServerConfig {
    command: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    args: Option<Vec<String>>,
}

fn patch_mcp_config(config_path: &Path, new_binary: &str) -> Result<bool> {
    if !config_path.exists() {
        return Ok(false);
    }
    let content = std::fs::read_to_string(config_path)?;
    let mut config: McpConfig = serde_json::from_str(&content)?;

    let mut changed = false;
    let servers = config.mcp_servers.as_mut()
        .or(config.servers.as_mut());

    if let Some(servers) = servers {
        for (_name, server) in servers.iter_mut() {
            if server.command != new_binary {
                tracing::info!("Patching MCP server command: {} -> {}", server.command, new_binary);
                let _ = std::mem::replace(&mut server.command, new_binary.to_string());
                changed = true;
            }
        }
    }

    if changed {
        let backup = config_path.with_extension("agent-brain.bak.json");
        std::fs::copy(config_path, &backup)?;
        std::fs::write(config_path, serde_json::to_string_pretty(&config)?)?;
        tracing::info!("Patched MCP config at {}, backup at {:?}", config_path.display(), backup);
    }

    Ok(changed)
}

const MCP_CONFIG_PATHS: &[&str] = &[
    "claude_desktop_config.json",
    ".cursor/mcp.json",
    ".codex/config.toml",
];

pub fn auto_wire(binary_path: &str, version: &str) -> Result<()> {
    let new_meta = InstallMeta {
        binary_path: binary_path.to_string(),
        version: version.to_string(),
        installed_at: chrono::Utc::now().to_rfc3339(),
    };

    let should_update = match read_meta()? {
        Some(existing) => existing.binary_path != binary_path,
        None => true,
    };

    if !should_update {
        return Ok(());
    }

    let home = std::env::var("HOME")?;
    for rel_path in MCP_CONFIG_PATHS {
        let abs_path = PathBuf::from(&home).join(rel_path);
        patch_mcp_config(&abs_path, binary_path)?;
    }

    write_meta(&new_meta)?;
    tracing::info!("Auto-wire complete: {}", binary_path);
    Ok(())
}
```

- [ ] **Step 2: Hook into serve startup**

```rust
// In main.rs serve command setup
if let Err(e) = autowire::auto_wire(&current_exe, &version) {
    tracing::warn!("Auto-wire failed: {}", e);
}
```

- [ ] **Step 3: Verify build and commit**

```bash
cd agent-brain && cargo check
git -C agent-brain commit -am "feat: add auto-wire configs daemon"
```

---

## Phase 5: agent-spine Standalone

Bumps: agent-spine v0.14.0

### Task 5.1: Docker sandbox execution

**Files:**
- Create: `agent-spine/agent-spine/src/sandbox.rs`
- Modify: `agent-spine/agent-spine/Cargo.toml`
- Modify: `agent-spine/agent-spine/src/executor.rs`
- Modify: `agent-spine/agent-spine/src/lib.rs`

- [ ] **Step 1: Add bollard dependency to Cargo.toml**

```toml
bollard = "0.18"
```

- [ ] **Step 2: Create sandbox.rs**

```rust
// agent-spine/agent-spine/src/sandbox.rs
use anyhow::Result;
use bollard::container::{
    AttachContainerOptions, Config, CreateContainerOptions, RemoveContainerOptions,
    WaitContainerOptions,
};
use bollard::image::CreateImageOptions;
use bollard::Docker;
use futures_util::StreamExt;
use serde_json::Value;
use std::collections::HashMap;
use std::time::Duration;
use tokio::time::timeout;

const DEFAULT_IMAGE: &str = "docker.io/library/ubuntu:latest";

#[derive(Debug)]
pub struct SandboxConfig {
    pub image: Option<String>,
    pub timeout_secs: u64,
    pub memory_mb: Option<i64>,
    pub cpu_shares: Option<i64>,
    pub bash_command: String,
    pub workspace_path: String,
}

pub async fn run_in_sandbox(config: &SandboxConfig) -> Result<(String, String)> {
    let docker = Docker::connect_with_local_defaults()?;

    let image = config.image.as_deref().unwrap_or(DEFAULT_IMAGE);

    // Pull image
    let _ = docker
        .create_image(
            Some(CreateImageOptions {
                from_image: image,
                ..Default::default()
            }),
            None,
            None,
        )
        .try_collect::<Vec<_>>()
        .await;

    let container_name = format!("agent-spine-{}", uuid::Uuid::new_v4());

    let mut env = Vec::new();
    if let Some(mem) = config.memory_mb {
        env.push(format!("AGENT_SPINE_MEMORY_MB={}", mem));
    }

    let mut host_config = bollard::container::HostConfig::default();
    host_config.network_mode = Some("none".to_string());
    host_config.readonly_rootfs = Some(true);
    host_config.memory_reservation = config.memory_mb.map(|m| m * 1024 * 1024);
    host_config.cpu_shares = config.cpu_shares;
    host_config.binds = Some(vec![
        format!("{}:/workspace:ro", config.workspace_path),
        "/tmp/agent-spine-output:/output:rw".to_string(),
    ]);

    let create = docker
        .create_container(
            Some(CreateContainerOptions {
                name: container_name.as_str(),
                platform: None,
            }),
            Config {
                image: Some(image),
                cmd: Some(vec!["/bin/bash", "-c", &config.bash_command]),
                env: Some(env),
                host_config: Some(host_config),
                ..Default::default()
            },
        )
        .await?;

    docker.start_container::<String>(&create.id, None).await?;

    // Stream output
    let attach = docker.attach_container(
        &create.id,
        Some(AttachContainerOptions::<String> {
            stdout: true,
            stderr: true,
            stream: true,
            logs: true,
            ..Default::default()
        }),
    );

    let mut stdout = String::new();
    let mut stderr = String::new();

    if let Ok(mut stream) = attach.await {
        while let Some(item) = stream.next().await {
            match item {
                Ok(bollard::container::AttachContainerResults {
                    stdout: Some(out), ..
                }) => stdout.push_str(&out),
                Ok(bollard::container::AttachContainerResults {
                    stderr: Some(err), ..
                }) => stderr.push_str(&err),
                _ => break,
            }
        }
    }

    // Wait with timeout
    let wait_result = timeout(
        Duration::from_secs(config.timeout_secs),
        docker.wait_container::<String>(&create.id, None::<WaitContainerOptions<String>>),
    )
    .await;

    // Cleanup
    let _ = docker
        .remove_container(
            &create.id,
            Some(RemoveContainerOptions {
                force: true,
                ..Default::default()
            }),
        )
        .await;

    match wait_result {
        Ok(Ok(_)) => Ok((stdout, stderr)),
        Ok(Err(e)) => Err(anyhow::anyhow!("Container wait error: {}", e)),
        Err(_) => Err(anyhow::anyhow!("Container timed out after {}s", config.timeout_secs)),
    }
}
```

- [ ] **Step 3: Integrate Sandbox node kind in executor**

In executor.rs, handle NodeKind::Sandbox by calling sandbox::run_in_sandbox instead of passing through.

- [ ] **Step 4: Add --unsafe flag to agent-spine run CLI**

```rust
// In main.rs
#[arg(long, default_value_t = false)]
unsafe: bool,

// Before sandbox execution
if !self.unsafe && docker_unavailable() {
    return Err(anyhow::anyhow!("Docker not found. Use --unsafe to bypass sandbox."));
}
```

- [ ] **Step 5: Verify build**

Run: `cd agent-spine && cargo check`

- [ ] **Step 6: Commit**

```bash
git -C agent-spine commit -am "feat: add Docker sandbox execution for Sandbox nodes"
```
