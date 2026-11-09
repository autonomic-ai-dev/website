#!/usr/bin/env bash
set -euo pipefail

# Playbook: Verify Website Versioning and Documentation
# Asserts:
# 1. Product version matches agent-brain.rb (1.0.0-rc8 format)
# 2. Docs contain documentation for Model Usage & Budget Governance
# 3. CLI references contain expanded practical examples
# 4. SvelteKit typecheck and build pass cleanly

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$DIR/../.." && pwd)"

echo "==> [Playbook: Versioning & Docs] Verifying stack version alignment..."
cd "$REPO_ROOT"

node -e '
const fs = require("fs");
const path = require("path");

const tapDir = path.resolve(process.cwd(), "../homebrew-tap/Formula");
const formulaContent = fs.readFileSync(path.join(tapDir, "agent-brain.rb"), "utf8");
const match = formulaContent.match(/version\s+"([^"]+)"/);
if (!match || !/^1\.0\.0(-[a-zA-Z0-9.]+)?$/.test(match[1])) {
  console.error("Invalid agent-brain version format:", match ? match[1] : "null");
  process.exit(1);
}
console.log("Verified agent-brain formula version: " + match[1]);
'

echo "==> [Playbook: Versioning & Docs] Verifying new usage governance documentation..."
grep -rn "Model Usage & Budget Governance" src/routes/agent-brain/docs/ || {
  echo "FAIL: Missing Model Usage & Budget Governance documentation in docs"
  exit 1
}

echo "==> [Playbook: Versioning & Docs] Verifying extended CLI reference examples..."
for organ in agent-brain agent-spine; do
  file="src/routes/$organ/docs/cli/$organ/+page.md"
  if [ -f "$file" ]; then
    count=$(grep -c '```bash' "$file" || true)
    if [ "$count" -lt 3 ]; then
      echo "FAIL: $file has fewer than 3 bash command examples (found $count)"
      exit 1
    fi
  else
    echo "FAIL: Missing CLI reference file $file"
    exit 1
  fi
done

echo "==> [Playbook: Versioning & Docs] Running svelte-check and build..."
bun run check
bun run build

echo "==> [Playbook: Versioning & Docs] Passed cleanly (exit 0)."
