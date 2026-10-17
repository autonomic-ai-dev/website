# Air-Gapped Installation Guide

For enterprise environments with strict network policies or fully disconnected environments, Autonomic AI can be installed entirely offline. The ecosystem requires zero external network calls after the initial bundle is downloaded.

## Overview

The air-gapped installation requires transferring three components to the disconnected environment:
1. **Organ Binaries** (agent-body, agent-brain, etc.)
2. **Embedding Model** (ONNX format)
3. **NATS Server** (for inter-process communication)

## Pre-Requisites (On an internet-connected machine)

First, download all necessary components on a machine with internet access.

### 1. Download Autonomic Binaries
Download the latest release tarballs for your target OS and architecture from the GitHub releases page for each organ.

```bash
mkdir autonomic-bundle && cd autonomic-bundle

# For Linux x86_64
OS_ARCH="x86_64-unknown-linux-gnu"
# For macOS Apple Silicon
# OS_ARCH="aarch64-apple-darwin"

ORGANS=(
  "agent-body" "agent-brain" "agent-spine" "agent-heart"
  "agent-muscle" "agent-nerves" "agent-eyes" "agent-mouth" "agent-immune"
)

for organ in "${ORGANS[@]}"; do
  wget "https://github.com/autonomic-ai-dev/${organ}/releases/latest/download/${organ}-${OS_ARCH}.tar.gz"
done
```

### 2. Download the Embedding Model
Agent-brain uses `fastembed` which requires an ONNX model. By default, it uses `bge-small-en-v1.5`.

```bash
mkdir -p models/fastembed
# A Python script to download the model into the models/fastembed directory
cat << 'EOF' > download_model.py
import os
from fastembed import TextEmbedding
# Download to the specified cache dir
os.environ["FASTEMBED_CACHE_PATH"] = "./models/fastembed"
model = TextEmbedding("BAAI/bge-small-en-v1.5")
print("Model downloaded successfully.")
EOF

python3 -m pip install fastembed
python3 download_model.py
```

### 3. Download NATS
Download the NATS server binary.

```bash
wget https://github.com/nats-io/nats-server/releases/download/v2.10.14/nats-server-v2.10.14-linux-amd64.zip
unzip nats-server-*.zip
mv nats-server-*/nats-server ./nats-server-bin
```

### 4. Create the Final Tarball
Bundle everything into a single archive.

```bash
cd ..
tar -czvf autonomic-airgapped.tar.gz autonomic-bundle/
```

---

## Installation (On the air-gapped machine)

Transfer `autonomic-airgapped.tar.gz` to the target machine via USB drive, secure file transfer, or cross-domain solution.

### 1. Extract the Bundle
```bash
tar -xzvf autonomic-airgapped.tar.gz
cd autonomic-bundle
```

### 2. Install Binaries
Extract all organ binaries into your local path.

```bash
mkdir -p ~/.local/bin
for tarball in *.tar.gz; do
  tar -xzf "$tarball" -C ~/.local/bin/
done
chmod +x ~/.local/bin/agent-*

# Install NATS
cp nats-server-bin ~/.local/bin/nats-server
chmod +x ~/.local/bin/nats-server

# Ensure PATH is updated
export PATH="$HOME/.local/bin:$PATH"
```

### 3. Setup the Embedding Model
Configure agent-brain to use the offline model cache instead of trying to download it.

```bash
mkdir -p ~/.autonomic/models
cp -r models/fastembed ~/.autonomic/models/

# Tell agent-brain where to find the model cache
echo "export FASTEMBED_CACHE_PATH=$HOME/.autonomic/models/fastembed" >> ~/.bashrc
export FASTEMBED_CACHE_PATH="$HOME/.autonomic/models/fastembed"
```

### 4. Initialize and Start
```bash
autonomic init
autonomic start
```

### 5. Verify the Installation
Run the doctor command to ensure all organs are communicating properly.

```bash
autonomic doctor
```

And test the memory routing (should be instantaneous and not hang trying to download models):
```bash
agent-brain stats
```

## Security & Isolation

Once installed, Autonomic AI operates with 100% data sovereignty.
- **No Telemetry**: No usage metrics are sent externally.
- **No Model APIs**: All routing and execution is local.
- **Sandboxing**: `agent-immune` can still enforce execution constraints inside the air-gapped environment.

If you plan to use local LLM models (e.g. via Ollama), you must also transfer the model weights (`.gguf` files) manually to the disconnected environment.
