#!/usr/bin/env python3
"""Local-only MCP integration auditor for agent-brain + Cursor.

PRIVATE DEV TOOL — lives under docs/superpowers/ (gitignored). Do not commit.

Usage:
  python3 docs/superpowers/mcp-audit/audit.py           # audit, fix, log
  python3 docs/superpowers/mcp-audit/audit.py --check   # audit only
  python3 docs/superpowers/mcp-audit/audit.py --full    # include cargo test
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path

REQUIRED_HOOK_EVENTS = (
    "beforeSubmitPrompt",
    "preToolUse",
    "postToolUse",
    "beforeMCPExecution",
    "afterMCPExecution",
)

REQUIRED_HOOK_MARKERS = (
    "mcp_agent-brain_route_task",
    "handle_post_tool_use",
    "try_clear_route_gate",
    "route_response_useful",
)


@dataclass
class AuditIssue:
    id: str
    severity: str
    title: str
    symptom: str
    cause: str
    fix: str
    status: str
    auto_fixable: bool = False
    fixed: bool = False


@dataclass
class AuditRun:
    started_at: str
    repo_root: str
    issues: list[AuditIssue] = field(default_factory=list)
    fixes_applied: list[str] = field(default_factory=list)
    checks_passed: list[str] = field(default_factory=list)

    @property
    def exit_code(self) -> int:
        open_issues = [
            i
            for i in self.issues
            if i.status not in {"fixed", "accepted", "manual"}
        ]
        return 1 if open_issues else 0


def repo_root() -> Path:
    here = Path(__file__).resolve()
    for parent in here.parents:
        if (parent / "agent-brain" / "Cargo.toml").is_file():
            return parent
    raise SystemExit("Could not find repo root (agent-brain/Cargo.toml)")


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_json(path: Path) -> dict | None:
    if not path.is_file():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def next_issue_number(audit_md: Path) -> int:
    if not audit_md.is_file():
        return 1
    nums = [int(m) for m in re.findall(r"^### (\d+)\.", audit_md.read_text(encoding="utf-8"), re.M)]
    return max(nums, default=0) + 1


def append_issue_to_audit_log(audit_md: Path, issue: AuditIssue) -> None:
    block = f"""
### {issue.id}. {issue.title} ({issue.severity})

**Symptom:** {issue.symptom}

**Cause:** {issue.cause}

**Fix:** {issue.fix}

**Status:** {issue.status}{" (auto-fixed this run)" if issue.fixed else ""}

_Auto-audit {datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")}_

---
"""
    if audit_md.is_file():
        text = audit_md.read_text(encoding="utf-8")
        if f"### {issue.id}." in text:
            return
        audit_md.write_text(text.rstrip() + "\n" + block, encoding="utf-8")
    else:
        audit_md.parent.mkdir(parents=True, exist_ok=True)
        audit_md.write_text(
            "# agent-brain MCP integration audit (Cursor)\n\n## Issues found\n" + block,
            encoding="utf-8",
        )


def run_cmd(cmd: list[str], cwd: Path | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)


def find_agent_brain_binary(root: Path) -> Path | None:
    for candidate in (
        root / "target" / "release" / "agent-brain",
        Path.home() / ".local" / "bin" / "agent-brain",
    ):
        if candidate.is_file():
            return candidate
    return None


def install_project_audit_rule(root: Path) -> Path:
    template = Path(__file__).resolve().parent / "templates" / "local-audit.mdc"
    dest_dir = root / ".cursor" / "rules" / "local"
    dest = dest_dir / "audit.mdc"
    if not template.is_file():
        raise SystemExit(f"Missing template: {template}")
    dest_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(template, dest)
    # Remove legacy path if present
    legacy = root / ".cursor" / "rules" / "mcp-local-dev-audit.mdc"
    if legacy.is_file():
        legacy.unlink()
    return dest


def local_audit_rule_path(root: Path) -> Path | None:
    local_dir = root / ".cursor" / "rules" / "local"
    if not local_dir.is_dir():
        return None
    for path in sorted(local_dir.glob("*.mdc")):
        return path
    return None


def check_project_rules(root: Path, run: AuditRun) -> None:
    agent_brain_rule = root / ".cursor" / "rules" / "agent-brain.mdc"
    audit_rule = local_audit_rule_path(root)
    stale_user_rules = Path.home() / ".cursor" / "rules"

    if not agent_brain_rule.is_file():
        run.issues.append(
            AuditIssue(
                id="pending",
                severity="medium",
                title="Project rule agent-brain.mdc missing",
                symptom="Agent may skip route_task without project rule context.",
                cause="`.cursor/rules/agent-brain.mdc` not in workspace.",
                fix="Run `agent-brain install` or `install --global` from this repo.",
                status="open",
                auto_fixable=True,
            )
        )
    else:
        run.checks_passed.append("project_rule_agent_brain")

    if audit_rule is None:
        run.issues.append(
            AuditIssue(
                id="pending",
                severity="low",
                title="Local MCP audit project rule not installed",
                symptom="Dev audit protocol not attached to agent-brain edits.",
                cause="No `.mdc` under `.cursor/rules/local/` (gitignored directory).",
                fix="Run `python3 docs/superpowers/mcp-audit/audit.py --install-rules`.",
                status="open",
                auto_fixable=True,
            )
        )
    else:
        run.checks_passed.append("project_rule_mcp_audit")

    if stale_user_rules.is_dir() and any(stale_user_rules.glob("*.mdc")):
        run.issues.append(
            AuditIssue(
                id="pending",
                severity="low",
                title="Stale rule in ~/.cursor/rules/ (not loaded by Cursor)",
                symptom="Rules in ~/.cursor/rules are ignored; you may think agent-brain rule is active globally.",
                cause="Cursor only loads project `.cursor/rules` and Settings → User Rules.",
                fix="Remove ~/.cursor/rules/*.mdc (auto-fix deletes them). Use project `.cursor/rules/agent-brain.mdc` or Cursor Settings → User Rules.",
                status="open",
                auto_fixable=True,
            )
        )


def check_hook_script(root: Path, run: AuditRun) -> None:
    repo_hook = root / "agent-brain" / "hooks" / "route_gate.py"
    installed = Path.home() / ".cursor" / "hooks" / "agent-brain" / "route_gate.py"
    if not repo_hook.is_file():
        return
    for marker in REQUIRED_HOOK_MARKERS:
        if marker not in repo_hook.read_text(encoding="utf-8"):
            run.issues.append(
                AuditIssue(
                    id="pending",
                    severity="high",
                    title=f"Repo hook missing `{marker}`",
                    symptom="Route gate may not handle current Cursor MCP tool names/events.",
                    cause=f"`route_gate.py` does not contain `{marker}`.",
                    fix=f"Restore hook implementation for `{marker}` in agent-brain/hooks/route_gate.py.",
                    status="open",
                )
            )
        else:
            run.checks_passed.append(f"repo_hook_has:{marker}")

    if installed.is_file() and sha256_file(repo_hook) != sha256_file(installed):
        run.issues.append(
            AuditIssue(
                id="pending",
                severity="medium",
                title="Installed hook out of sync with repo",
                symptom="~/.cursor hook behaves differently than repo copy.",
                cause="`agent-brain install --global` not run after hook edits.",
                fix="Sync `route_gate.py` to ~/.cursor and merge hooks.json.",
                status="open",
                auto_fixable=True,
            )
        )
    elif installed.is_file():
        run.checks_passed.append("installed_hook_matches_repo")
    else:
        run.issues.append(
            AuditIssue(
                id="pending",
                severity="high",
                title="Hook not installed",
                symptom="route_task gate not enforced in Cursor.",
                cause="Missing ~/.cursor/hooks/agent-brain/route_gate.py",
                fix="Run `agent-brain install --global`.",
                status="open",
                auto_fixable=True,
            )
        )


def check_hooks_json(run: AuditRun) -> None:
    hooks_path = Path.home() / ".cursor" / "hooks.json"
    data = read_json(hooks_path)
    if data is None:
        run.issues.append(
            AuditIssue(
                id="pending",
                severity="high",
                title="hooks.json missing or invalid",
                symptom="Cursor hooks not loaded.",
                cause=f"No valid JSON at {hooks_path}",
                fix="Run `agent-brain install --global`.",
                status="open",
                auto_fixable=True,
            )
        )
        return

    hooks = data.get("hooks", {})
    for event in REQUIRED_HOOK_EVENTS:
        entries = hooks.get(event, [])
        has_gate = any(
            "hooks/agent-brain/route_gate.py" in str(e.get("command", ""))
            for e in entries
            if isinstance(e, dict)
        )
        if not has_gate:
            run.issues.append(
                AuditIssue(
                    id="pending",
                    severity="high" if event == "postToolUse" else "medium",
                    title=f"hooks.json missing `{event}` route_gate entry",
                    symptom="Gate may not reset or block correctly each turn.",
                    cause=f"`{event}` has no route_gate.py hook.",
                    fix="Re-run `agent-brain install --global` to merge hook entries.",
                    status="open",
                    auto_fixable=True,
                )
            )
        else:
            run.checks_passed.append(f"hooks_json_has:{event}")


def check_mcp_json(run: AuditRun) -> None:
    mcp_path = Path.home() / ".cursor" / "mcp.json"
    data = read_json(mcp_path)
    if data is None:
        run.issues.append(
            AuditIssue(
                id="pending",
                severity="high",
                title="mcp.json missing or invalid",
                symptom="agent-brain MCP not configured for Cursor.",
                cause=f"No valid JSON at {mcp_path}",
                fix="Run `agent-brain install --global`.",
                status="open",
                auto_fixable=True,
            )
        )
        return

    server = data.get("mcpServers", {}).get("agent-brain")
    if not isinstance(server, dict):
        run.issues.append(
            AuditIssue(
                id="pending",
                severity="high",
                title="agent-brain missing from mcp.json",
                symptom="MCP server not registered.",
                cause="mcpServers.agent-brain not configured.",
                fix="Run `agent-brain install --global`.",
                status="open",
                auto_fixable=True,
            )
        )
        return

    cmd = Path(str(server.get("command", "")))
    if not cmd.is_file():
        run.issues.append(
            AuditIssue(
                id="pending",
                severity="high",
                title="MCP binary path does not exist",
                symptom=f"Cursor cannot start agent-brain (`{cmd}`).",
                cause="mcp.json points to missing binary.",
                fix="Build release binary and run `agent-brain install --global`.",
                status="open",
                auto_fixable=True,
            )
        )
    else:
        run.checks_passed.append("mcp_binary_exists")

    env = server.get("env", {})
    if env.get("AGENT_BRAIN_BOOTSTRAP_BG") != "1":
        run.issues.append(
            AuditIssue(
                id="pending",
                severity="low",
                title="MCP env missing AGENT_BRAIN_BOOTSTRAP_BG=1",
                symptom="Slower MCP enable in Cursor.",
                cause="mcp.json env not set for background bootstrap.",
                fix="Re-run `agent-brain install --global`.",
                status="open",
                auto_fixable=True,
            )
        )


def check_hook_tests(root: Path, run: AuditRun) -> None:
    test_script = root / "agent-brain" / "hooks" / "test_route_gate.py"
    if not test_script.is_file():
        return
    proc = run_cmd([sys.executable, str(test_script)], cwd=test_script.parent)
    if proc.returncode != 0:
        run.issues.append(
            AuditIssue(
                id="pending",
                severity="high",
                title="route_gate unit tests failing",
                symptom="Hook regressions may block or mis-route tools.",
                cause=(proc.stdout + proc.stderr)[-2000:],
                fix="Fix failing cases in agent-brain/hooks/route_gate.py and re-run tests.",
                status="open",
            )
        )
    else:
        run.checks_passed.append("hook_unit_tests")


def check_cargo_tests(root: Path, run: AuditRun) -> None:
    proc = run_cmd(["cargo", "test", "-p", "agent-brain"], cwd=root)
    if proc.returncode != 0:
        run.issues.append(
            AuditIssue(
                id="pending",
                severity="high",
                title="cargo test -p agent-brain failing",
                symptom="MCP/router regressions in Rust code.",
                cause=(proc.stdout + proc.stderr)[-3000:],
                fix="Fix failing Rust tests before shipping MCP changes.",
                status="open",
            )
        )
    else:
        run.checks_passed.append("cargo_tests")


def remove_stale_global_cursor_rules(run: AuditRun) -> None:
    rules_dir = Path.home() / ".cursor" / "rules"
    if not rules_dir.is_dir():
        return
    removed: list[str] = []
    for path in sorted(rules_dir.glob("*.mdc")):
        name = path.name
        path.unlink(missing_ok=True)
        removed.append(name)
    if removed:
        run.fixes_applied.append(
            "removed_stale_global_cursor_rules:" + ",".join(removed)
        )
        try:
            if not any(rules_dir.iterdir()):
                rules_dir.rmdir()
        except OSError:
            pass


def apply_fixes(root: Path, run: AuditRun) -> None:
    if any(
        i.auto_fixable
        and i.status == "open"
        and "Stale rule in ~/.cursor/rules/" in i.title
        for i in run.issues
    ):
        remove_stale_global_cursor_rules(run)

    if not any(i.auto_fixable and i.status == "open" for i in run.issues):
        return

    repo_hook = root / "agent-brain" / "hooks" / "route_gate.py"
    installed_dir = Path.home() / ".cursor" / "hooks" / "agent-brain"
    installed_hook = installed_dir / "route_gate.py"

    if repo_hook.is_file():
        installed_dir.mkdir(parents=True, exist_ok=True)
        installed_hook.write_text(repo_hook.read_text(encoding="utf-8"), encoding="utf-8")
        installed_hook.chmod(0o755)
        run.fixes_applied.append("synced_route_gate_to_cursor")

    binary = find_agent_brain_binary(root)
    if binary is not None:
        proc = run_cmd([str(binary), "install", "--global"], cwd=root)
        if proc.returncode == 0:
            run.fixes_applied.append("ran_agent_brain_install_global")
        else:
            run.issues.append(
                AuditIssue(
                    id="pending",
                    severity="medium",
                    title="install --global failed during auto-fix",
                    symptom="Hooks/MCP config may still be stale.",
                    cause=(proc.stdout + proc.stderr)[-1500:],
                    fix="Run `agent-brain install --global` manually after building.",
                    status="manual",
                )
            )

    for issue in run.issues:
        if issue.auto_fixable and issue.status == "open":
            issue.fixed = True
            issue.status = "fixed"


def assign_issue_ids(run: AuditRun, start: int) -> None:
    n = start
    for issue in run.issues:
        if issue.id == "pending":
            issue.id = str(n)
            n += 1


def main() -> int:
    parser = argparse.ArgumentParser(description="Local MCP dev auditor (gitignored)")
    parser.add_argument("--check", action="store_true", help="Audit only; do not apply fixes")
    parser.add_argument("--full", action="store_true", help="Also run cargo test -p agent-brain")
    parser.add_argument(
        "--install-rules",
        action="store_true",
        help="Install gitignored rule under .cursor/rules/local/ and exit",
    )
    args = parser.parse_args()

    root = repo_root()
    if args.install_rules:
        dest = install_project_audit_rule(root)
        print(f"Installed project rule: {dest}")
        print("See docs/superpowers/mcp-audit/USER-RULES.md for Cursor Settings → User Rules.")
        return 0

    audit_dir = Path(__file__).resolve().parent
    audit_md = audit_dir.parent / "MCP-INTEGRATION-AUDIT.md"
    last_run_path = audit_dir / "last-run.json"

    run = AuditRun(
        started_at=datetime.now(timezone.utc).isoformat(),
        repo_root=str(root),
    )

    check_project_rules(root, run)
    check_hook_script(root, run)
    check_hooks_json(run)
    check_mcp_json(run)
    check_hook_tests(root, run)
    if args.full:
        check_cargo_tests(root, run)

    if not args.check:
        apply_fixes(root, run)
        if any(
            i.auto_fixable
            and i.title.startswith("Project rule agent-brain")
            for i in run.issues
        ):
            binary = find_agent_brain_binary(root)
            if binary is not None:
                run_cmd([str(binary), "install", "--global"], cwd=root)
        if any(
            i.auto_fixable and "audit project rule" in i.title.lower() for i in run.issues
        ):
            install_project_audit_rule(root)
            run.fixes_applied.append("installed_mcp_local_dev_audit_rule")
        if run.fixes_applied:
            check_hooks_json(run)
            check_mcp_json(run)
            check_hook_tests(root, run)

    start_num = next_issue_number(audit_md)
    assign_issue_ids(run, start_num)

    for issue in run.issues:
        append_issue_to_audit_log(audit_md, issue)

    last_run_path.write_text(
        json.dumps(asdict(run), indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"MCP audit — repo: {root}")
    print(f"Checks passed: {len(run.checks_passed)}")
    if run.fixes_applied:
        print(f"Fixes applied: {', '.join(run.fixes_applied)}")
    if run.issues:
        print(f"Issues ({len(run.issues)}):")
        for issue in run.issues:
            mark = "FIXED" if issue.fixed else issue.status.upper()
            print(f"  [{mark}] #{issue.id} {issue.title} ({issue.severity})")
        print(f"Logged to: {audit_md}")
    else:
        print("No issues found.")

    manual = [i for i in run.issues if i.status == "manual" or (not i.fixed and i.status == "open")]
    if manual:
        print("\nManual: restart Cursor after binary/hook updates.")

    return run.exit_code


if __name__ == "__main__":
    sys.exit(main())
