/**
 * Ollama HTTP Client
 * Low-level client for communicating with Ollama API.
 * Handles streaming NDJSON responses, timeouts, and retries.
 */

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  options?: {
    temperature?: number;
    top_p?: number;
    num_predict?: number;
  };
  stream?: boolean;
}

interface OllamaGenerateResponse {
  model: string;
  response: string;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

interface OllamaEmbedRequest {
  model: string;
  input: string | string[];
}

interface OllamaEmbedResponse {
  model: string;
  embeddings: number[][];
}

interface OllamaTagsResponse {
  models: Array<{
    name: string;
    size: number;
    digest: string;
    modified_at: string;
  }>;
}

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://ollama:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral:7b-instruct-q4_K_M';
const OLLAMA_TIMEOUT_MS = parseInt(process.env.OLLAMA_TIMEOUT_MS || '120000', 10);
const OLLAMA_ENABLED = process.env.OLLAMA_ENABLED !== 'false';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if Ollama is enabled via environment variable.
 */
export function isEnabled(): boolean {
  return OLLAMA_ENABLED;
}

/**
 * Check if the Ollama service is available and responding.
 */
export async function isAvailable(): Promise<boolean> {
  if (!OLLAMA_ENABLED) return false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get health status including loaded models.
 */
export async function getHealth(): Promise<{
  available: boolean;
  enabled: boolean;
  baseUrl: string;
  model: string;
  models: string[];
}> {
  const enabled = isEnabled();
  if (!enabled) {
    return { available: false, enabled: false, baseUrl: OLLAMA_BASE_URL, model: OLLAMA_MODEL, models: [] };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { available: false, enabled: true, baseUrl: OLLAMA_BASE_URL, model: OLLAMA_MODEL, models: [] };
    }

    const data = (await response.json()) as OllamaTagsResponse;
    const models = data.models?.map((m) => m.name) || [];

    return { available: true, enabled: true, baseUrl: OLLAMA_BASE_URL, model: OLLAMA_MODEL, models };
  } catch {
    return { available: false, enabled: true, baseUrl: OLLAMA_BASE_URL, model: OLLAMA_MODEL, models: [] };
  }
}

/**
 * Generate a completion from Ollama (non-streaming).
 * Collects the full NDJSON stream and returns the concatenated response.
 */
export async function generate(
  prompt: string,
  options?: {
    system?: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    model?: string;
  }
): Promise<string> {
  if (!OLLAMA_ENABLED) {
    throw new Error('Ollama is disabled via OLLAMA_ENABLED=false');
  }

  const requestBody: OllamaGenerateRequest = {
    model: options?.model || OLLAMA_MODEL,
    prompt,
    system: options?.system,
    options: {
      temperature: options?.temperature ?? 0.3,
      top_p: options?.topP ?? 0.9,
      num_predict: options?.maxTokens ?? 2048,
    },
    stream: false,
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Ollama API error (${response.status}): ${errorText}`);
      }

      const data = (await response.json()) as OllamaGenerateResponse;
      return data.response;
    } catch (error: any) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }

  throw lastError || new Error('Ollama generation failed after retries');
}

/**
 * Generate embeddings for text using Ollama.
 */
export async function embed(
  text: string | string[],
  model?: string
): Promise<number[][]> {
  if (!OLLAMA_ENABLED) {
    throw new Error('Ollama is disabled via OLLAMA_ENABLED=false');
  }

  const requestBody: OllamaEmbedRequest = {
    model: model || OLLAMA_MODEL,
    input: text,
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

      const response = await fetch(`${OLLAMA_BASE_URL}/api/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Ollama embed error (${response.status}): ${errorText}`);
      }

      const data = (await response.json()) as OllamaEmbedResponse;
      return data.embeddings;
    } catch (error: any) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }

  throw lastError || new Error('Ollama embedding failed after retries');
}
