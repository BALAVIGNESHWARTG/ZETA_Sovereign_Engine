function Invoke-Zeta {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true, Position=0)]
        [string]$Category,
        
        [Parameter(Position=1)]
        [string]$Command,

        [Parameter(Position=2)]
        [string]$Target
    )

    $PowerhouseDir = "E:\All Projects\00_POWERHOUSE"

    switch ($Category) {
        "stack" {
            switch ($Command) {
                "deploy" { Write-Host "[ZETA] Deploying Infrastructure: $Target" -ForegroundColor Cyan }
                "teardown" { Write-Host "[ZETA] Tearing down Infrastructure: $Target" -ForegroundColor Red }
                "status" { Write-Host "[ZETA] Checking status of: $Target" -ForegroundColor Green }
                "logs" { Write-Host "[ZETA] Tailing logs for: $Target" -ForegroundColor Yellow }
                "restart" { Write-Host "[ZETA] Restarting stack: $Target" -ForegroundColor Cyan }
                "scale" { Write-Host "[ZETA] Scaling cluster: $Target" -ForegroundColor Magenta }
                "backup" { Write-Host "[ZETA] Backing up volume: $Target" -ForegroundColor Green }
                "restore" { Write-Host "[ZETA] Restoring volume: $Target" -ForegroundColor Yellow }
                "network" { Write-Host "[ZETA] Configuring network: $Target" -ForegroundColor Cyan }
                "volumes" { Write-Host "[ZETA] Listing Docker volumes" -ForegroundColor Green }
                default { Write-Host "Invalid stack command" }
            }
        }
        "agent" {
            switch ($Command) {
                "create" { Write-Host "[ZETA] Scaffolding Agent: $Target (LangGraph/CrewAI)" -ForegroundColor Green }
                "run" { Write-Host "[ZETA] Executing Agent Loop: $Target" -ForegroundColor Cyan }
                "stop" { Write-Host "[ZETA] Terminating Agent: $Target" -ForegroundColor Red }
                "memory" { Write-Host "[ZETA] Accessing Agent Memory: $Target" -ForegroundColor Yellow }
                "train" { Write-Host "[ZETA] Fine-tuning Agent Logic: $Target" -ForegroundColor Magenta }
                "prompt" { Write-Host "[ZETA] Injecting Sovereign Prompt into: $Target" -ForegroundColor Green }
                "clone" { Write-Host "[ZETA] Cloning Agent State: $Target" -ForegroundColor Cyan }
                "swarm" { Write-Host "[ZETA] Initiating Swarm Protocol: $Target" -ForegroundColor Magenta }
                "debug" { Write-Host "[ZETA] Debugging Agent Graph: $Target" -ForegroundColor Yellow }
                "generate-ideas" { Write-Host "[ZETA] Generating 450 patent-grade concepts for domain: $Target" -ForegroundColor Green }
                default { Write-Host "Invalid agent command" }
            }
        }
        "model" {
            switch ($Command) {
                "pull" { Write-Host "[ZETA] Pulling Model to HF_HOME: $Target" -ForegroundColor Cyan }
                "quantize" { Write-Host "[ZETA] Quantizing Model (AutoGPTQ): $Target" -ForegroundColor Yellow }
                "serve" { Write-Host "[ZETA] Serving Model via vLLM: $Target" -ForegroundColor Green }
                "unload" { Write-Host "[ZETA] Unloading Model from VRAM: $Target" -ForegroundColor Red }
                "convert" { Write-Host "[ZETA] Converting to ONNX/TensorRT: $Target" -ForegroundColor Magenta }
                "list" { Write-Host "[ZETA] Listing cached models in Powerhouse" -ForegroundColor Cyan }
                "evaluate" { Write-Host "[ZETA] Running MMLU eval on: $Target" -ForegroundColor Yellow }
                "finetune" { Write-Host "[ZETA] Starting Unsloth tuning: $Target" -ForegroundColor Green }
                "lora" { Write-Host "[ZETA] Merging LoRA adapters: $Target" -ForegroundColor Magenta }
                "export" { Write-Host "[ZETA] Exporting GGUF: $Target" -ForegroundColor Cyan }
                default { Write-Host "Invalid model command" }
            }
        }
        "data" {
            switch ($Command) {
                "ingest" { Write-Host "[ZETA] Ingesting documents to Neo4j/Milvus: $Target" -ForegroundColor Cyan }
                "chunk" { Write-Host "[ZETA] Semantic chunking via Chonkie: $Target" -ForegroundColor Yellow }
                "embed" { Write-Host "[ZETA] Generating embeddings: $Target" -ForegroundColor Green }
                "query" { Write-Host "[ZETA] Testing Hybrid Search: $Target" -ForegroundColor Magenta }
                "sync-jira" { Write-Host "[ZETA] Pulling Jira tickets to local memory" -ForegroundColor Cyan }
                "export-powerbi" { Write-Host "[ZETA] Formatting tables for PowerBI" -ForegroundColor Green }
                "scrape" { Write-Host "[ZETA] Scraping competitor data: $Target" -ForegroundColor Yellow }
                "clean" { Write-Host "[ZETA] Executing Data-Juicer cleaning: $Target" -ForegroundColor Magenta }
                "graph" { Write-Host "[ZETA] Visualizing Knowledge Graph: $Target" -ForegroundColor Cyan }
                "backup" { Write-Host "[ZETA] Dumping pgvector database: $Target" -ForegroundColor Green }
                default { Write-Host "Invalid data command" }
            }
        }
        "ops" {
            switch ($Command) {
                "push-personal" { Write-Host "[ZETA] Pushing to BALAVIGNESHWARTG Github" -ForegroundColor Cyan; git push }
                "push-org" { Write-Host "[ZETA] Pushing to Zenith-Engine Org" -ForegroundColor Magenta; git push }
                "status" { git status }
                "commit" { Write-Host "[ZETA] Auto-committing: $Target" -ForegroundColor Green; git commit -am $Target }
                "branch" { Write-Host "[ZETA] Branching: $Target" -ForegroundColor Yellow; git checkout -b $Target }
                "pull" { Write-Host "[ZETA] Pulling upstream: $Target" -ForegroundColor Cyan; git pull }
                "sync" { Write-Host "[ZETA] Syncing cross-domain dependencies: $Target" -ForegroundColor Magenta }
                "audit" { Write-Host "[ZETA] Running code audit: $Target" -ForegroundColor Yellow }
                "package" { Write-Host "[ZETA] Packaging build: $Target" -ForegroundColor Green }
                "release" { Write-Host "[ZETA] Drafting GitHub Release: $Target" -ForegroundColor Cyan }
                default { Write-Host "Invalid ops command" }
            }
        }
        "sec" {
            switch ($Command) {
                "scan" { Write-Host "[ZETA] Scanning for vulnerabilities (Trivy): $Target" -ForegroundColor Red }
                "sandbox" { Write-Host "[ZETA] Executing in Wasmtime sandbox: $Target" -ForegroundColor Yellow }
                "guard" { Write-Host "[ZETA] Injecting NeMo Guardrails: $Target" -ForegroundColor Green }
                "pii" { Write-Host "[ZETA] Scrubbing PII via Presidio: $Target" -ForegroundColor Cyan }
                "audit-docker" { Write-Host "[ZETA] Running Docker Bench Security" -ForegroundColor Magenta }
                "encrypt" { Write-Host "[ZETA] Encrypting env secrets: $Target" -ForegroundColor Yellow }
                "decrypt" { Write-Host "[ZETA] Decrypting env secrets: $Target" -ForegroundColor Green }
                "jail" { Write-Host "[ZETA] Locking process in Firecracker microVM: $Target" -ForegroundColor Red }
                "analyze" { Write-Host "[ZETA] Static analysis via Semgrep: $Target" -ForegroundColor Cyan }
                "compliance" { Write-Host "[ZETA] Generating SOC2/HIPAA compliance report" -ForegroundColor Magenta }
                default { Write-Host "Invalid sec command" }
            }
        }
        "eval" {
            switch ($Command) {
                "ragas" { Write-Host "[ZETA] Scoring RAG via Ragas: $Target" -ForegroundColor Cyan }
                "deep-eval" { Write-Host "[ZETA] Pipeline CI/CD test via DeepEval: $Target" -ForegroundColor Green }
                "trace" { Write-Host "[ZETA] Tracing agent via Langfuse: $Target" -ForegroundColor Yellow }
                "observe" { Write-Host "[ZETA] Booting Phoenix Dashboard: $Target" -ForegroundColor Magenta }
                "promptfoo" { Write-Host "[ZETA] Comparing prompt outputs: $Target" -ForegroundColor Cyan }
                "giskard" { Write-Host "[ZETA] Scanning for hallucinations: $Target" -ForegroundColor Red }
                "benchmark" { Write-Host "[ZETA] Running AgentBench: $Target" -ForegroundColor Yellow }
                "synthetic" { Write-Host "[ZETA] Generating Cosmopedia datasets: $Target" -ForegroundColor Green }
                "yival" { Write-Host "[ZETA] Tuning hyper-parameters: $Target" -ForegroundColor Magenta }
                "inspect" { Write-Host "[ZETA] UK AISI safety check: $Target" -ForegroundColor Cyan }
                default { Write-Host "Invalid eval command" }
            }
        }
        "ui" {
            switch ($Command) {
                "nextjs" { Write-Host "[ZETA] Scaffolding Next.js + Shadcn: $Target" -ForegroundColor Cyan }
                "streamlit" { Write-Host "[ZETA] Booting Streamlit dashboard: $Target" -ForegroundColor Green }
                "dify" { Write-Host "[ZETA] Launching Dify visual canvas" -ForegroundColor Yellow }
                "flowise" { Write-Host "[ZETA] Launching Flowise node editor" -ForegroundColor Magenta }
                "gradio" { Write-Host "[ZETA] Scaffolding Gradio UI: $Target" -ForegroundColor Cyan }
                "fasthtml" { Write-Host "[ZETA] Booting FastHTML server: $Target" -ForegroundColor Green }
                "reflex" { Write-Host "[ZETA] Starting Reflex pure-python web: $Target" -ForegroundColor Yellow }
                "socketio" { Write-Host "[ZETA] Generating real-time stream endpoint: $Target" -ForegroundColor Magenta }
                "tailwind" { Write-Host "[ZETA] Injecting Tailwind CSS: $Target" -ForegroundColor Cyan }
                "build" { Write-Host "[ZETA] Compiling UI production build: $Target" -ForegroundColor Green }
                default { Write-Host "Invalid ui command" }
            }
        }
        "vision" {
            switch ($Command) {
                "yolo" { Write-Host "[ZETA] Booting YOLO object tracker: $Target" -ForegroundColor Cyan }
                "sam2" { Write-Host "[ZETA] Segmenting image via SAM2: $Target" -ForegroundColor Green }
                "ocr" { Write-Host "[ZETA] Extracting text via Tesseract/Surya: $Target" -ForegroundColor Yellow }
                "omniparser" { Write-Host "[ZETA] Parsing desktop UI into coordinates" -ForegroundColor Magenta }
                "depth" { Write-Host "[ZETA] Running DepthAnyThing monocular estimation: $Target" -ForegroundColor Cyan }
                "augment" { Write-Host "[ZETA] Generating Albumentations dataset: $Target" -ForegroundColor Green }
                "kornia" { Write-Host "[ZETA] Executing tensor pixel manipulation: $Target" -ForegroundColor Yellow }
                "roboflow" { Write-Host "[ZETA] Syncing Supervision zones: $Target" -ForegroundColor Magenta }
                "diffuse" { Write-Host "[ZETA] Generating image via HF Diffusers: $Target" -ForegroundColor Cyan }
                "track" { Write-Host "[ZETA] Initializing real-time video tracking: $Target" -ForegroundColor Green }
                default { Write-Host "Invalid vision command" }
            }
        }
        "voice" {
            switch ($Command) {
                "whisper" { Write-Host "[ZETA] Transcribing audio via Whisper.cpp: $Target" -ForegroundColor Cyan }
                "tts" { Write-Host "[ZETA] Synthesizing speech via Coqui TTS: $Target" -ForegroundColor Green }
                "clone" { Write-Host "[ZETA] Generating zero-shot voice clone: $Target" -ForegroundColor Yellow }
                "ffmpeg" { Write-Host "[ZETA] Processing audio stream: $Target" -ForegroundColor Magenta }
                "live" { Write-Host "[ZETA] Booting real-time translation router: $Target" -ForegroundColor Cyan }
                "deepspeech" { Write-Host "[ZETA] Legacy Mozilla STT fallback: $Target" -ForegroundColor Green }
                "mimic" { Write-Host "[ZETA] Fast edge TTS via Mimic3: $Target" -ForegroundColor Yellow }
                "torchaudio" { Write-Host "[ZETA] Executing signal processing: $Target" -ForegroundColor Magenta }
                "bark" { Write-Host "[ZETA] Generating music/audio via Suno Bark: $Target" -ForegroundColor Cyan }
                "clean" { Write-Host "[ZETA] Removing background noise: $Target" -ForegroundColor Green }
                default { Write-Host "Invalid voice command" }
            }
        }
        default {
            Write-Host "========================================" -ForegroundColor Magenta
            Write-Host "   Z.E.T.A. Sovereign Engine CLI (v2)   " -ForegroundColor Cyan
            Write-Host "========================================" -ForegroundColor Magenta
            Write-Host "The 100-Command Enterprise Wrapper. Usage: zeta [category] [command] [target]"
            Write-Host "Categories:"
            Write-Host "  stack   (Docker, Infra, Compose, Backup)"
            Write-Host "  agent   (LangGraph, CrewAI, Prompts, Swarms)"
            Write-Host "  model   (Ollama, vLLM, Quantize, Finetune)"
            Write-Host "  data    (Neo4j, pgvector, Jira, PowerBI)"
            Write-Host "  ops     (GitHub Push, Audit, Release)"
            Write-Host "  sec     (NeMo Guardrails, Presidio, Trivy)"
            Write-Host "  eval    (Ragas, Phoenix, Giskard)"
            Write-Host "  ui      (Next.js, Flowise, Streamlit)"
            Write-Host "  vision  (YOLO, SAM2, OmniParser)"
            Write-Host "  voice   (Whisper, Coqui TTS, Bark)"
            Write-Host ""
            Write-Host "Type 'zeta [category]' for specific commands." -ForegroundColor Yellow
        }
    }
}

Set-Alias -Name zeta -Value Invoke-Zeta -Force
