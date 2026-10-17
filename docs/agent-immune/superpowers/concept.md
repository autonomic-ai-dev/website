# agent-immune: Core Architecture & Concept

agent-immune is a dependency fuzzing and vulnerability scanning daemon. It parses project manifest files and queries the OSV.dev database to identify known vulnerabilities.

## 1. Manifest Parser (v0.1.0)

Supports Cargo.toml and package.json. Extracts dependency name, version, and ecosystem.

## 2. OSV.dev Client (v0.1.0)

For each dependency, sends a query to `api.osv.dev/v1/query` with the package name, ecosystem, and version. Returns matching vulnerability IDs, summaries, and severity scores.

## Roadmap

| Feature | Status |
|---------|--------|
| Manifest parser (Cargo.toml, package.json) | ✅ v0.1.0 |
| OSV.dev vulnerability query | ✅ v0.1.0 |
| CLI with scan/serve/status | ✅ v0.1.0 |
| Firecracker microVM sandbox | 🔜 Future |
| Automated watch mode | 🔜 Future |
