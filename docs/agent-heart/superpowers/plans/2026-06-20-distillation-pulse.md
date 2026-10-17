# Distillation Pulse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `agent-brain distill clusters` command that finds groups of semantically similar indexed items via cosine similarity, creates summary facts, and supersedes originals. Wire `agent-heart distill` to call it as subprocess.

**Architecture:** Extend existing `distill.rs` module in agent-brain with a clustering algorithm (load indexed_items with embeddings, group by topic, pairwise cosine comparison, union-find clustering, store+supersede). Add subprocess call in agent-heart's BrainHandle.

**Tech Stack:** Rust, agent-brain's existing `embed::cosine`, `bytes_to_f32`, `store_fact`, `invalidate_fact`, `load_searchable_items`.

---

### Task 1: Add `ClusterStats` and `cluster_and_summarize()` to agent-brain distill.rs

**Files:**
- Modify: `agent-brain/agent-brain/src/distill.rs`

- [ ] **Add ClusterStats struct and function signature**

Add to `distill.rs`, after existing `DistilledArch`:

```rust
pub struct ClusterStats {
    pub clusters_found: usize,
    pub items_clustered: usize,
    pub facts_created: usize,
    pub items_superseded: usize,
    pub dry_run: bool,
    pub threshold: f64,
}

pub fn cluster_and_summarize(
    store: &crate::db::store::BrainStore,
    threshold: f64,
    dry_run: bool,
) -> Result<ClusterStats> {
    // ... implementation in next step
}
```

- [ ] **Implement cluster_and_summarize body**

Replace the function body with:

```rust
pub fn cluster_and_summarize(
    store: &crate::db::store::BrainStore,
    threshold: f64,
    dry_run: bool,
) -> Result<ClusterStats> {
    use std::collections::HashMap;

    let items = store.load_searchable_items()?;
    let mut by_topic: HashMap<String, Vec<(usize, &crate::db::store::SearchRow)>> = HashMap::new();

    for (idx, item) in items.iter().enumerate() {
        if item.embedding.is_none() {
            continue;
        }
        by_topic.entry(item.topic.clone()).or_default().push((idx, item));
    }

    let mut clusters_found = 0usize;
    let mut items_clustered = 0usize;
    let mut facts_created = 0usize;
    let mut items_superseded = 0usize;

    for (_topic, group) in &by_topic {
        if group.len() < 2 {
            continue;
        }

        let embeds: Vec<Vec<f32>> = group
            .iter()
            .map(|(_, item)| crate::db::store::bytes_to_f32(item.embedding.as_ref().unwrap()))
            .collect();

        let n = group.len();
        let mut parent: Vec<usize> = (0..n).collect();

        fn find(parent: &mut [usize], x: usize) -> usize {
            if parent[x] != x {
                parent[x] = find(parent, parent[x]);
            }
            parent[x]
        }
        fn union(parent: &mut [usize], a: usize, b: usize) {
            let ra = find(parent, a);
            let rb = find(parent, b);
            if ra != rb {
                parent[ra] = rb;
            }
        }

        for i in 0..n {
            for j in (i + 1)..n {
                let sim = crate::embed::cosine(&embeds[i], &embeds[j]);
                if sim >= threshold {
                    union(&mut parent, i, j);
                }
            }
        }

        let mut cluster_map: HashMap<usize, Vec<usize>> = HashMap::new();
        for i in 0..n {
            let root = find(&mut parent, i);
            cluster_map.entry(root).or_default().push(i);
        }

        for (_root, members) in &cluster_map {
            if members.len() < 2 {
                continue;
            }
            clusters_found += 1;
            items_clustered += members.len();

            if dry_run {
                continue;
            }

            let member_rows: Vec<&crate::db::store::SearchRow> =
                members.iter().map(|&i| group[i].1).collect();

            let combined: Vec<&str> = member_rows
                .iter()
                .map(|r| r.text.as_str())
                .filter(|t| !t.is_empty())
                .collect();
            let combined_text = if combined.is_empty() {
                "auto-merged cluster".to_string()
            } else if combined.len() == 1 {
                combined[0].to_string()
            } else {
                combined.join("; ")
            };

            let max_conf = member_rows
                .iter()
                .filter_map(|r| {
                    let topic = &r.topic;
                    let facts = store.list_facts(1).ok()?;
                    let matching: Vec<&serde_json::Value> = facts
                        .iter()
                        .filter(|f| f.get("topic").and_then(|v| v.as_str()) == Some(topic.as_str()))
                        .collect();
                    matching
                        .first()
                        .and_then(|f| f.get("confidence").and_then(|v| v.as_f64()))
                })
                .fold(0.95f64, |acc, c| acc.max(c));

            let result = store.store_fact(
                &member_rows[0].topic,
                &combined_text,
                &member_rows[0].scope,
                member_rows[0].scope_key.as_deref(),
                max_conf.max(0.95),
                None,
                None,
                None,
                None,
            );

            match result {
                Ok(meta) => {
                    facts_created += 1;
                    for row in &member_rows {
                        if store.invalidate_fact(&row.id).is_ok() {
                            items_superseded += 1;
                        }
                    }
                }
                Err(e) => {
                    tracing::warn!("Failed to store cluster fact: {}", e);
                }
            }
        }
    }

    Ok(ClusterStats {
        clusters_found,
        items_clustered,
        facts_created,
        items_superseded,
        dry_run,
        threshold,
    })
}
```

- [ ] **Add imports** — ensure the file has the needed imports at the top:

```rust
use anyhow::Result;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::Path;
```

- [ ] **Build check**

Run: `cd agent-brain && cargo check -p agent-brain 2>&1`
Expected: clean build, no warnings

- [ ] **Run tests**

Run: `cd agent-brain && cargo test --release -p agent-brain -- --test-threads=1 2>&1 | tail -20`

### Task 2: Wire `distill clusters` CLI in agent-brain main.rs

**Files:**
- Modify: `agent-brain/agent-brain/src/main.rs`

**Context:** The existing `"distill"` handler (around line 1257) writes ARCHITECTURE.md. We need to sniff for `"clusters"` as the next arg and route to the new function.

- [ ] **Modify the distill handler**

Replace the existing `"distill"` arm:

```rust
"distill" => {
    let is_clusters = args.get(1).map(|s| s.as_str()) == Some("clusters");
    if is_clusters {
        let config = Config::load()?;
        config.ensure_dirs()?;
        let threshold = flag_value(&args, "--threshold")
            .and_then(|v| v.parse::<f64>().ok())
            .unwrap_or(0.95);
        let dry_run = has_flag(&args, "--dry-run");
        let store = agent_brain::db::store::BrainStore::open(&config.db_path)?;
        let stats = agent_brain::distill::cluster_and_summarize(&store, threshold, dry_run)?;
        println!("{}", serde_json::to_string_pretty(&stats)?);
    } else {
        let config = Config::load()?;
        config.ensure_dirs()?;
        let out = flag_value(&args, "--out")
            .map(std::path::PathBuf::from)
            .unwrap_or_else(|| std::path::PathBuf::from("ARCHITECTURE.md"));
        let store = agent_brain::db::store::BrainStore::open(&config.db_path)?;
        let distilled = agent_brain::distill::distill(&store)?;
        agent_brain::distill::write_architecture_md(&distilled, &out)?;
        println!("Architecture written to {}", out.display());
    }
}
```

Check `has_flag` exists in main.rs — search for `fn has_flag`. It should exist from the gc command. If not, define it:

```rust
fn has_flag(args: &[String], flag: &str) -> bool {
    args.iter().any(|a| a == flag)
}
```

- [ ] **Build check**

Run: `cd agent-brain && cargo check -p agent-brain 2>&1`
Expected: clean build

### Task 3: Add `call_distill()` to agent-heart brain_client.rs

**Files:**
- Modify: `agent-heart/agent-heart/src/brain_client.rs`

- [ ] **Add `call_distill` method**

After the `call_gc` method:

```rust
pub async fn call_distill(&self, threshold: f64, dry_run: bool) -> Result<Value> {
    let binary = self
        .binary
        .as_ref()
        .ok_or_else(|| anyhow::anyhow!("agent-brain binary not found"))?;

    let mut cmd = Command::new(binary);
    cmd.arg("distill")
        .arg("clusters")
        .arg("--threshold")
        .arg(threshold.to_string());

    if dry_run {
        cmd.arg("--dry-run");
    }

    let child = cmd
        .stdout(Stdio::piped())
        .stderr(Stdio::inherit())
        .spawn()
        .map_err(|e| anyhow::anyhow!("Failed to run agent-brain distill clusters: {}", e))?;

    let output = child.wait_with_output().await?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        anyhow::bail!("agent-brain distill clusters exited with {}: {}", output.status, stderr);
    }

    let stats: Value = serde_json::from_slice(&output.stdout)?;
    Ok(stats)
}
```

Check `Stdio` is imported at the top of the file. If not, add `use std::process::Stdio;`.

- [ ] **Build check**

Run: `cd agent-heart && cargo check -p agent-heart 2>&1`
Expected: clean build

### Task 4: Wire `distill` CLI in agent-heart main.rs and lib.rs

**Files:**
- Modify: `agent-heart/agent-heart/src/main.rs`
- Modify: `agent-heart/agent-heart/src/lib.rs`

- [ ] **Add `run_distill_once` to lib.rs**

After the `run_gc_once` function:

```rust
pub async fn run_distill_once(config: Config) -> Result<()> {
    let handle = brain_client::BrainHandle::start(&config).await?;
    let stats = handle.call_distill(0.95, false).await?;
    println!("{}", serde_json::to_string_pretty(&stats)?);
    handle.shutdown().await;
    Ok(())
}
```

- [ ] **Add `distill` subcommand to main.rs**

Find the CLI enum/struct in main.rs. Add a `Distill` variant:

In the CLI subcommand enum (probably named `Command` or similar), add:

```rust
/// Run one-shot cluster distillation on agent-brain
Distill,
```

- [ ] **Wire the dispatch**

In the main match block, add before or after the `Gc` handler:

```rust
"distill" => {
    let config = config::Config::load()?;
    agent_heart::run_distill_once(config).await?;
}
```

- [ ] **Build check**

Run: `cd agent-heart && cargo check -p agent-heart 2>&1`
Expected: clean build

### Task 5: Format, verify, commit

**Files:**
- Both repos

- [ ] **Format both repos**

Run: `cd agent-brain && cargo fmt && cargo fmt --check`
Run: `cd agent-heart && cargo fmt && cargo fmt --check`

- [ ] **Build both repos**

Run: `cd agent-brain && cargo check -p agent-brain`
Run: `cd agent-heart && cargo check -p agent-heart`

- [ ] **Commit agent-brain**

```bash
git add -A
git commit -m "feat(distill): add cluster analysis for indexed item embeddings

- cluster_and_summarize() loads indexed_items, groups by topic,
  computes pairwise cosine similarity, builds union-find clusters
- Creates summary facts for clusters of >=2 semantically similar items
  (cos > 0.95), supersedes originals via invalidate_fact
- distill clusters CLI: --threshold (default 0.95), --dry-run
- Backward compatible: bare distill still writes ARCHITECTURE.md"
git push
```

- [ ] **Commit agent-heart**

```bash
git add -A
git commit -m "feat(distill): add distill CLI calling agent-brain distill clusters

- BrainHandle::call_distill() runs agent-brain distill clusters
  as subprocess with --threshold and --dry-run
- agent-heart distill CLI command for one-shot cluster distillation
- run_distill_once() in lib.rs for programmatic use"
git push
```
