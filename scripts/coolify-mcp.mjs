import { spawn, execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function loadDotEnvIfPresent() {
  const candidates = ['.env.local', '.env'];
  for (const fname of candidates) {
    const p = resolve(process.cwd(), fname);
    if (!existsSync(p)) continue;
    try {
      const text = readFileSync(p, 'utf8');
      for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#') || !line.includes('=')) continue;
        const idx = line.indexOf('=');
        const key = line.slice(0, idx).trim();
        let value = line.slice(idx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!(key in process.env)) {
          process.env[key] = value;
        }
      }
    } catch (_) {
      // ignore parse errors
    }
  }
}

loadDotEnvIfPresent();

const baseUrl = process.env.COOLIFY_BASE_URL || process.env.COOLIFY_API_URL || process.env.COOLIFY_URL;
const token = process.env.COOLIFY_TOKEN || process.env.COOLIFY_API_KEY;

if (!baseUrl || !token) {
  console.error(
    'Coolify MCP: Missing credentials. Required: COOLIFY_BASE_URL (or COOLIFY_API_URL/COOLIFY_URL) and COOLIFY_TOKEN (or COOLIFY_API_KEY).'
  );
  process.exit(1);
}

function start(command, args) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: { ...process.env, COOLIFY_BASE_URL: baseUrl, COOLIFY_TOKEN: token },
  });
  child.on('exit', (code) => process.exit(code ?? 0));
  child.on('error', (err) => {
    if (err && err.code === 'ENOENT' && (command === 'coolify-mcp-server' || command === 'mcp-coolify-server')) {
      // Fallback to npx if global binary not found
      start('npx', ['-y', 'coolify-mcp-server']);
    } else {
      console.error('Coolify MCP: failed to start server:', err?.message || err);
      process.exit(1);
    }
  });
}

// Prefer global install (resolved bin), then PATH, then npx
try {
  const prefix = execSync('npm prefix -g', { encoding: 'utf8' }).trim();
  const bin = resolve(prefix, 'bin');
  const isWin = process.platform === 'win32';
  const candidates = [
    resolve(bin, isWin ? 'mcp-coolify-server.cmd' : 'mcp-coolify-server'),
    resolve(bin, isWin ? 'coolify-mcp-server.cmd' : 'coolify-mcp-server')
  ];
  for (const c of candidates) {
    if (existsSync(c)) {
      start(c, []);
      setTimeout(() => {}, 1 << 30);
      break;
    }
  }
  start('mcp-coolify-server', [])
} catch (_) {
  start('coolify-mcp-server', []);
}
