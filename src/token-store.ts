
// src/token-store.ts

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ViessmannTokens } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = join(__dirname, '..', 'tokens.json');

/**
 * Zapisuje tokeny do lokalnego pliku tokens.json.
 * Plik jest w .gitignore — nigdy nie trafia do repo.
 */
export function saveTokens(tokens: ViessmannTokens): void {
  writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2), 'utf-8');
  console.log(`[TokenStore] Tokens saved to ${TOKENS_PATH}`);
}

/**
 * Odczytuje tokeny z pliku. Zwraca null jeśli brak.
 */
export function loadTokens(): ViessmannTokens | null {
  if (!existsSync(TOKENS_PATH)) {
    return null;
  }

  try {
    const raw = readFileSync(TOKENS_PATH, 'utf-8');
    return JSON.parse(raw) as ViessmannTokens;
  } catch (error) {
    console.error('[TokenStore] Failed to read tokens:', error);
    return null;
  }
}

/**
 * Sprawdza czy access_token jest wciąż ważny (z 60s marginesem).
 */
export function isTokenValid(tokens: ViessmannTokens): boolean {
  const BUFFER_MS = 60_000; // 60 sekund przed wygaśnięciem
  return Date.now() < tokens.expires_at_ms - BUFFER_MS;
}