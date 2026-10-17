#!/usr/bin/env bash
set -euo pipefail

# Website Verification Suite Entrypoint
# Runs all verification playbooks for website

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$DIR/.." && pwd)"

echo "==> [website] Starting verification suite..."
cd "$REPO_ROOT"

echo "==> Running Playbook: Versioning and Documentation..."
"$DIR/playbooks/verify_versioning_and_docs.sh"

echo "==> [website] All verification playbooks passed cleanly (exit 0)."
