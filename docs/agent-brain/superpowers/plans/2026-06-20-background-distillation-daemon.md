# Background Distillation Daemon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `brain_gc` MCP tool in agent-brain and the `agent-heart` background daemon for scheduled compression/dedup.

**Architecture:** agent-heart is a thin Rust daemon with a cron scheduler and MCP server. It spawns agent-brain via stdio and calls the `brain_gc` tool on schedule or on-demand. All GC/dedup logic lives in agent-brain's new `gc.rs` module.

**Tech Stack:** Rust, `rmcp` (MCP), `tokio-cron-scheduler`, `serde`/`serde_yaml`, `clap`, `tracing`

---

### Task 1: agent-brain — gc.rs module

**Files:**
- Create: `agent-brain/src/gc.rs`
- Modify: `agent-brain/src/lib.rs` (add `pub mod gc;`)
- Test: via cargo check

- [ ] **Create gc.rs with GcStats struct and core functions**

```rust
use anyhow::Result;
use serde::Serialize;
use std::collections::HashMap;

#[derive(Debug, Default, Serialize)]
pub struct GcStats {
    pub facts_deduped: u64,
    pub facts_removed: u64,
    pub index_items_deduped: u64,
    pub index_items_removed: u64,
    pub bytes_reclaimed: u64,
}

pub fn run_gc(
    store: &crate::db::store::BrainStore,
    min_confidence: f64,
    max_age_days: u64,
) -> Result<GcStats> {
    let mut stats = GcStats::default();

    stats.facts_deduped = dedup_facts(store)?;
    stats.index_items_deduped = dedup_indexed_items(store)?;
    stats.facts_removed = prune_low_confidence(store, min_confidence)?;
    stats.index_items_removed = prune_stale_index(store)?;

    let before = db_file_size(store)?;
    store.checkpoint_wal()?;
    let after = db_file_size(store)?;
    stats.bytes_reclaimed = before.saturating_sub(after);

    Ok(stats)
}

fn dedup_facts(store: &crate::db::store::BrainStore) -> Result<u64> {
    let rows = store.list_facts(10_000)?;
    let mut by_topic: HashMap<String, Vec<serde_json::Value>> = HashMap::new();
    for row in &rows {
        let topic = row.get("topic").and_then(|v| v.as_str()).unwrap_or("").to_string();
        by_topic.entry(topic).or_default().push(row.clone());
    }

    let mut count = 0u64;
    for (_topic, group) in &by_topic {
        for i in 0..group.len() {
            for j in (i + 1)..group.len() {
                let a_text = group[i].get("content").and_then(|v| v.as_str()).unwrap_or("");
                let b_text = group[j].get("content").and_then(|v| v.as_str()).unwrap_or("");
                let a_id = group[i].get("id").and_then(|v| v.as_str()).unwrap_or("");
                let b_id = group[j].get("id").and_then(|v| v.as_str()).unwrap_or("");
                if a_text == b_text && !a_id.is_empty() && !b_id.is_empty() {
                    if let Some(store) = Some(store) {
                        // Invalidate the older one (first encountered is kept)
                        // We invalidate the one with higher sort order (j)
                        let _ = store.invalidate_fact(b_id);
                        count += 1;
                    }
                }
            }
        }
    }
    Ok(count)
}

fn dedup_indexed_items(store: &crate::db::store::BrainStore) -> Result<u64> {
    use crate::embed::cosine_similarity;
    use std::collections::HashMap;

    let items = store.load_searchable_items()?;
    let mut by_topic: HashMap<String, Vec<crate::db::store::SearchRow>> = HashMap::new();
    for item in &items {
        if let Some(ref emb) = item.embedding {
            by_topic.entry(item.topic.clone()).or_default().push(item.clone());
        }
    }

    let mut count = 0u64;
    for (_topic, group) in &by_topic {
        for i in 0..group.len() {
            for j in (i + 1)..group.len() {
                if let (Some(ref a_emb), Some(ref b_emb)) = (&group[i].embedding, &group[j].embedding) {
                    if cosine_similarity(a_emb, b_emb) > 0.95 {
                        let source = &group[j].source_path;
                        let _ = store.delete_indexed_items_under_prefix(source);
                        count += 1;
                    }
                }
            }
        }
    }
    Ok(count)
}

fn prune_low_confidence(store: &crate::db::store::BrainStore, min_confidence: f64) -> Result<u64> {
    let rows = store.list_facts(10_000)?;
    let mut count = 0u64;
    for row in &rows {
        let conf = row.get("confidence").and_then(|v| v.as_f64()).unwrap_or(1.0);
        let id = row.get("id").and_then(|v| v.as_str()).unwrap_or("");
        if conf < min_confidence && !id.is_empty() {
            let _ = store.invalidate_fact(id);
            count += 1;
        }
    }
    Ok(count)
}

fn prune_stale_index(store: &crate::db::store::BrainStore) -> Result<u64> {
    let items = store.load_searchable_items()?;
    let mut count = 0u64;
    for item in &items {
        if !std::path::Path::new(&item.source_path).exists() {
            let _ = store.delete_indexed_items_under_prefix(&item.source_path);
            count += 1;
        }
    }
    Ok(count)
}

fn db_file_size(store: &crate::db::store::BrainStore) -> Result<u64> {
    // Read the db_path from meta or use a best-effort approach
    // store doesn't expose db_path directly, so we query via pragma
    let conn = store.with_conn(|c| {
        let path: String = c.query_row("PRAGMA database_list", [], |row| row.get(2))?;
        Ok(path)
    })?;
    Ok(std::fs::metadata(&conn).map(|m| m.len()).unwrap_or(0))
}
```

- [ ] **Add `invalidate_fact` method to store.rs**

Add to agent-brain/src/db/store.rs:

```rust
pub fn invalidate_fact(&self, fact_id: &str) -> Result<()> {
    let now_ms = chrono::Utc::now().timestamp_millis();
    let sql = "UPDATE facts SET invalid_at = ?1 WHERE id = ?2 AND invalid_at IS NULL";
    self.with_conn(|conn| {
        conn.execute(sql, rusqlite::params![now_ms, fact_id])?;
        Ok(())
    })
}
```

- [ ] **Add `cosine_similarity` to embed.rs if not present**

Check in `agent-brain/src/embed.rs`:

```rust
pub fn cosine_similarity(a: &[f32], b: &[f32]) -> f64 {
    let dot: f32 = a.iter().zip(b.iter()).map(|(x, y)| x * y).sum();
    let na: f32 = a.iter().map(|x| x * x).sum::<f32>().sqrt();
    let nb: f32 = b.iter().map(|x| x * x).sum::<f32>().sqrt();
    (dot / (na * nb + 1e-10)) as f64
}
```

- [ ] **Add `pub mod gc;` to lib.rs**

- [ ] **Build check**

Run: `cd /Volumes/Seagate/developer/personal/autonomic-ai-dev/agent-brain && cargo check 2>&1`

---

### Task 2: agent-brain — brain_gc MCP tool + CLI

**Files:**
- Modify: `agent-brain/src/mcp/server.rs` (add GcParams + tool handler)
- Modify: `agent-brain/src/main.rs` (add `gc` CLI command)

- [ ] **Add GcParams struct and tool handler in server.rs**

```rust
#[derive(Debug, Deserialize, JsonSchema)]
struct GcParams {
    #[serde(default = "default_min_confidence")]
    min_confidence: f64,
    #[serde(default = "default_max_age_days")]
    max_age_days: u64,
}

fn default_min_confidence() -> f64 { 0.3 }
fn default_max_age_days() -> u64 { 90 }

#[tool(description = "Run garbage collection: dedup, prune, vacuum")]
async fn brain_gc(
    &self,
    #[tool(aggr)] params: GcParams,
) -> Result<CallToolResult, McpError> {
    let stats = crate::gc::run_gc(
        &self.engine.store,
        params.min_confidence,
        params.max_age_days,
    )
    .map_err(|e| McpError::with_message(rmcp::model::ErrorCode::InternalError, e.to_string()))?;
    Ok(CallToolResult::success(vec![Content::json(stats)?]))
}
```

- [ ] **Add `gc` CLI command in main.rs**

Find the Commands enum and add:

```rust
Gc {
    #[arg(long, default_value = "0.3")]
    min_confidence: f64,
    #[arg(long, default_value = "90")]
    max_age_days: u64,
},
```

Add match handler:

```rust
Commands::Gc { min_confidence, max_age_days } => {
    let config = agent_brain::config::Config::load()?;
    let store = agent_brain::db::store::BrainStore::open(&config.db_path)?;
    let stats = agent_brain::gc::run_gc(&store, *min_confidence, *max_age_days)?;
    println!("{}", serde_json::to_string_pretty(&stats)?);
}
```

- [ ] **Build check**

Run: `cd /Volumes/Seagate/developer/personal/autonomic-ai-dev/agent-brain && cargo check 2>&1`

---

### Task 3: agent-heart — project scaffolding

**Files:**
- Modify: `agent-heart/Cargo.toml` (create workspace Cargo.toml)
- Create: `agent-heart/agent-heart/Cargo.toml`
- Create: `agent-heart/agent-heart/src/main.rs`
- Create: `agent-heart/agent-heart/src/lib.rs`
- Create: `agent-heart/agent-heart/src/config.rs`

- [ ] **Create workspace Cargo.toml**

`agent-heart/Cargo.toml`:
```toml
[workspace]
members = ["agent-heart"]
resolver = "2"
```

- [ ] **Create crate Cargo.toml**

`agent-heart/agent-heart/Cargo.toml`:
```toml
[package]
name = "agent-heart"
version = "0.1.0"
edition = "2021"

[dependencies]
anyhow = "1"
chrono = "0.4"
clap = { version = "4", features = ["derive"] }
dirs = "5"
rmcp = { version = "0.1", features = ["server", "client", "transport"] }
schemars = "0.8"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
serde_yaml = "0.9"
tokio = { version = "1", features = ["full"] }
tokio-cron-scheduler = "0.13"
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }
```

- [ ] **Create config.rs**

```rust
use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub schedule: ScheduleConfig,
    pub brain: BrainConfig,
    pub logging: LoggingConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScheduleConfig {
    pub cron: String,
    pub enabled: bool,
}

impl Default for ScheduleConfig {
    fn default() -> Self {
        Self { cron: "0 3 * * *".into(), enabled: true }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BrainConfig {
    pub binary_path: Option<String>,
}

impl Default for BrainConfig {
    fn default() -> Self {
        Self { binary_path: None }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoggingConfig {
    pub level: String,
    pub file: Option<String>,
}

impl Default for LoggingConfig {
    fn default() -> Self {
        Self { level: "info".into(), file: None }
    }
}

impl Config {
    pub fn load() -> Result<Self> {
        let path = config_path();
        if path.exists() {
            let content = std::fs::read_to_string(&path)?;
            Ok(serde_yaml::from_str(&content)?)
        } else {
            let cfg = Config::default();
            if let Some(parent) = path.parent() {
                std::fs::create_dir_all(parent)?;
            }
            std::fs::write(&path, serde_yaml::to_string(&cfg)?)?;
            Ok(cfg)
        }
    }
}

impl Default for Config {
    fn default() -> Self {
        Self {
            schedule: ScheduleConfig::default(),
            brain: BrainConfig::default(),
            logging: LoggingConfig::default(),
        }
    }
}

fn config_path() -> PathBuf {
    let home = std::env::var("HOME").unwrap_or_else(|_| "/tmp".to_string());
    PathBuf::from(&home).join(".config/agent-heart/config.yaml")
}
```

- [ ] **Create main.rs with CLI arg parsing**

```rust
use std::path::PathBuf;
use clap::{Parser, Subcommand};

fn config_path() -> PathBuf {
    let home = std::env::var("HOME").unwrap_or_else(|_| "/tmp".to_string());
    PathBuf::from(&home).join(".config/agent-heart/config.yaml")
}

#[derive(Parser)]
#[command(name = "agent-heart", about = "Background distillation daemon")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Start the daemon (MCP server + cron scheduler)
    Serve,
    /// Run GC once and exit
    Gc,
    /// Show daemon status
    Status,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt().with_env_filter(
        tracing_subscriber::EnvFilter::from_default_env()
    ).init();

    let cli = Cli::parse();
    let config = agent_heart::config::Config::load()?;

    match cli.command {
        Commands::Serve => agent_heart::serve(config).await?,
        Commands::Gc => agent_heart::run_gc_once(config).await?,
        Commands::Status => {
            let state_dir = dirs::state_dir()
                .unwrap_or_else(|| std::path::PathBuf::from("/tmp"))
                .join("agent-heart");
            let last_gc = std::fs::read_to_string(state_dir.join("last_gc.txt"))
                .unwrap_or_else(|_| "never".into());
            println!("agent-heart status");
            println!("  config: {}", config_path().display());
            println!("  schedule: {} (enabled: {})", config.schedule.cron, config.schedule.enabled);
            println!("  last_gc: {}", last_gc);
        },
    }
    Ok(())
}
```

- [ ] **Create lib.rs with module declarations**

```rust
pub mod brain_client;
pub mod config;
pub mod mcp_server;
pub mod scheduler;

use anyhow::Result;
use config::Config;

pub async fn serve(_config: Config) -> Result<()> {
    // MCP server and scheduler are started inside `serve`
    // See Task 6 for the full integration
    todo!("Wired in Task 6")
}

pub async fn run_gc_once(config: Config) -> Result<()> {
    let handle = brain_client::BrainHandle::start(&config).await?;
    let stats = handle.call_gc(0.3, 90).await?;
    println!("{}", serde_json::to_string_pretty(&stats)?);
    handle.shutdown().await;
    Ok(())
}
```

- [ ] **Build check**

Run: `cd /Volumes/Seagate/developer/personal/autonomic-ai-dev/agent-heart && cargo check 2>&1`

---

### Task 4: agent-heart — brain_client (MCP client to agent-brain)

**Files:**
- Create: `agent-heart/agent-heart/src/brain_client.rs`

- [ ] **Create brain_client.rs**

```rust
use anyhow::Result;
use serde_json::Value;
use std::path::PathBuf;
use std::process::Stdio;
use tokio::process::Command;
use tracing::info;

use crate::config::Config;

#[derive(Clone)]
pub struct BrainHandle {
    binary: Option<PathBuf>,
}

impl BrainHandle {
    pub async fn start(config: &Config) -> Result<Self> {
        let binary = find_brain_binary(config).await;
        Ok(Self { binary })
    }

    pub async fn call_gc(&self, min_confidence: f64, max_age_days: u64) -> Result<Value> {
        let binary = self.binary.as_ref()
            .ok_or_else(|| anyhow::anyhow!("agent-brain binary not found"))?;

        let mut child = Command::new(binary)
            .arg("gc")
            .arg("--min-confidence")
            .arg(min_confidence.to_string())
            .arg("--max-age-days")
            .arg(max_age_days.to_string())
            .stdout(Stdio::piped())
            .stderr(Stdio::inherit())
            .spawn()
            .map_err(|e| anyhow::anyhow!("Failed to run agent-brain gc: {}", e))?;

        let output = child.wait_with_output().await?;
        let stats: Value = serde_json::from_slice(&output.stdout)?;
        Ok(stats)
    }

    pub async fn shutdown(&self) {
        // Process exits on its own
    }
}

async fn find_brain_binary(config: &Config) -> Option<PathBuf> {
    if let Some(ref path) = config.brain.binary_path {
        let p = PathBuf::from(path);
        if p.exists() { return Some(p); }
    }

    let common = [
        "/usr/local/bin/agent-brain",
        "/opt/homebrew/bin/agent-brain",
    ];
    for path in &common {
        let p = PathBuf::from(path);
        if p.exists() { return Some(p); }
    }

    if let Ok(output) = Command::new("which").arg("agent-brain").output().await {
        let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
        if !path.is_empty() { return Some(PathBuf::from(path)); }
    }

    if let Ok(home) = std::env::var("HOME") {
        for p in [".cargo/bin/agent-brain", ".local/bin/agent-brain"] {
            let pb = PathBuf::from(&home).join(p);
            if pb.exists() { return Some(pb); }
        }
    }
    None
}
```

- [ ] **Build check**

Run: `cd /Volumes/Seagate/developer/personal/autonomic-ai-dev/agent-heart && cargo check 2>&1`

---

### Task 5: agent-heart — scheduler (cron loop)

**Files:**
- Create: `agent-heart/agent-heart/src/scheduler.rs`

- [ ] **Create scheduler.rs**

```rust
use anyhow::Result;
use tokio_cron_scheduler::{Job, JobScheduler};
use tracing::info;

use crate::brain_client::BrainHandle;
use crate::config::Config;

pub async fn start(config: &Config, brain: BrainHandle) -> Result<JobScheduler> {
    let sched = JobScheduler::new().await?;
    let cron_expr = config.schedule.cron.clone();

    let job = Job::new_async(cron_expr.as_str(), move |_uuid, _lock| {
        let brain = brain.clone();
        Box::pin(async move {
            info!("Cron tick: running brain_gc");
            match brain.call_gc(0.3, 90).await {
                Ok(stats) => {
                    info!("GC complete: {}", stats);
                    // Record last GC timestamp
                    let state_dir = dirs::state_dir()
                        .unwrap_or_else(|| std::path::PathBuf::from("/tmp"))
                        .join("agent-heart");
                    std::fs::create_dir_all(&state_dir).ok();
                    let _ = std::fs::write(
                        state_dir.join("last_gc.txt"),
                        chrono::Utc::now().to_rfc3339(),
                    );
                }
                Err(e) => tracing::error!("GC failed: {}", e),
            }
        })
    })?;

    sched.add(job).await?;
    sched.start().await?;
    info!("Scheduler started: cron='{}'", cron_expr);
    Ok(sched)
}
```

- [ ] **Build check**

Run: `cd /Volumes/Seagate/developer/personal/autonomic-ai-dev/agent-heart && cargo check 2>&1`

---

### Task 6: agent-heart — MCP server (heart_trigger_gc, heart_status)

**Files:**
- Create: `agent-heart/agent-heart/src/mcp_server.rs`

- [ ] **Create mcp_server.rs**

```rust
use std::sync::Arc;
use rmcp::handler::server::router::tool::ToolRouter;
use rmcp::model::{CallToolResult, Content, ServerCapabilities, ServerInfo};
use rmcp::{tool, tool_router, ErrorData as McpError, ServerHandler, ServiceExt};
use schemars::JsonSchema;
use serde::Deserialize;
use tracing::info;

use crate::brain_client::BrainHandle;

#[derive(Clone)]
pub struct HeartMcp {
    brain: BrainHandle,
    tool_router: ToolRouter<Self>,
}

impl HeartMcp {
    pub fn new(brain: BrainHandle) -> Self {
        Self {
            tool_router: Self::tool_router(),
            brain,
        }
    }

    pub async fn run(brain: BrainHandle) -> anyhow::Result<()> {
        let mcp = Self::new(brain);
        let info = ServerInfo {
            protocol_version: Default::default(),
            capabilities: ServerCapabilities::default(),
            server_info: rmcp::model::Implementation {
                name: "agent-heart".into(),
                version: env!("CARGO_PKG_VERSION").into(),
            },
            instructions: Some("Background distillation daemon. Trigger GC or check status.".into()),
        };
        rmcp::transport::stdio::run_server(mcp, info).await?;
        Ok(())
    }
}

#[derive(Debug, Deserialize, JsonSchema)]
struct TriggerGcParams {
    #[serde(default = "default_min_confidence")]
    min_confidence: f64,
    #[serde(default = "default_max_age_days")]
    max_age_days: u64,
}

fn default_min_confidence() -> f64 { 0.3 }
fn default_max_age_days() -> u64 { 90 }

#[tool(description = "Trigger garbage collection on agent-brain")]
async fn heart_trigger_gc(
    &self,
    #[tool(aggr)] params: TriggerGcParams,
) -> Result<CallToolResult, McpError> {
    info!("Received heart_trigger_gc request");
    let stats = self.brain
        .call_gc(params.min_confidence, params.max_age_days)
        .await
        .map_err(|e| McpError::with_message(rmcp::model::ErrorCode::InternalError, e.to_string()))?;
    Ok(CallToolResult::success(vec![Content::json(&stats)?]))
}

#[tool(description = "Show agent-heart daemon status")]
async fn heart_status(&self) -> Result<CallToolResult, McpError> {
    let status = serde_json::json!({
        "status": "running",
        "version": env!("CARGO_PKG_VERSION"),
    });
    Ok(CallToolResult::success(vec![Content::json(&status)?]))
}
```

- [ ] **Replace serve placeholder in lib.rs**

Replace the `serve` placeholder:

```rust
pub async fn serve(config: Config) -> Result<()> {
    let brain_handle = brain_client::BrainHandle::start(&config).await?;

    // Start MCP server in background
    let mcp_brain = brain_handle.clone();
    let mcp_handle = tokio::spawn(async move {
        mcp_server::HeartMcp::run(mcp_brain).await.ok();
    });

    // Start cron scheduler
    if config.schedule.enabled {
        let sched = scheduler::start(&config, brain_handle.clone()).await?;
        tokio::signal::ctrl_c().await?;
        sched.shutdown().await?;
    } else {
        tokio::signal::ctrl_c().await?;
    }

    mcp_handle.abort();
    Ok(())
}
```

- [ ] **Build check**

Run: `cd /Volumes/Seagate/developer/personal/autonomic-ai-dev/agent-heart && cargo check 2>&1`

---

### Task 7: Format, verify, and tag

- [ ] **Format both repos**

```bash
cd /Volumes/Seagate/developer/personal/autonomic-ai-dev/agent-brain && cargo fmt
cd /Volumes/Seagate/developer/personal/autonomic-ai-dev/agent-heart && cargo fmt
```

- [ ] **Final check both repos**

```bash
cd /Volumes/Seagate/developer/personal/autonomic-ai-dev/agent-brain && cargo fmt --check && cargo check
cd /Volumes/Seagate/developer/personal/autonomic-ai-dev/agent-heart && cargo fmt --check && cargo check
```
