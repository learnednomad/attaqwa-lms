#!/usr/bin/env bash
# ============================================================================
# Ollama Setup Script
# Waits for Ollama to be healthy, then pulls the configured model.
# ============================================================================

set -euo pipefail

OLLAMA_BASE_URL="${OLLAMA_BASE_URL:-http://localhost:11434}"
OLLAMA_MODEL="${OLLAMA_MODEL:-mistral:7b-instruct-q4_K_M}"
MAX_RETRIES=30
RETRY_INTERVAL=5

echo "Ollama Setup: Waiting for Ollama at ${OLLAMA_BASE_URL}..."

for i in $(seq 1 "$MAX_RETRIES"); do
  if curl -sf "${OLLAMA_BASE_URL}/api/tags" > /dev/null 2>&1; then
    echo "Ollama is ready."
    break
  fi
  if [ "$i" -eq "$MAX_RETRIES" ]; then
    echo "ERROR: Ollama did not become ready after $((MAX_RETRIES * RETRY_INTERVAL))s"
    exit 1
  fi
  echo "  Attempt ${i}/${MAX_RETRIES} - retrying in ${RETRY_INTERVAL}s..."
  sleep "$RETRY_INTERVAL"
done

# Check if model is already pulled
EXISTING=$(curl -sf "${OLLAMA_BASE_URL}/api/tags" | grep -c "${OLLAMA_MODEL}" || true)
if [ "$EXISTING" -gt 0 ]; then
  echo "Model ${OLLAMA_MODEL} is already available."
else
  echo "Pulling model ${OLLAMA_MODEL}... (this may take several minutes)"
  curl -sf "${OLLAMA_BASE_URL}/api/pull" \
    -d "{\"name\": \"${OLLAMA_MODEL}\"}" \
    --no-buffer | while IFS= read -r line; do
      status=$(echo "$line" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
      if [ -n "$status" ]; then
        echo "  ${status}"
      fi
    done
  echo "Model ${OLLAMA_MODEL} pulled successfully."
fi

echo "Ollama setup complete."
