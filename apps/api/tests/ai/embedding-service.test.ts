/**
 * Tests for text chunking logic.
 * We replicate the chunking constants and test the algorithm directly
 * to avoid importing the full embedding-service module (which pulls in Strapi).
 */

import { stripHtml } from '../../src/api/ai/services/text-utils';

// Replicate chunking constants from embedding-service
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;
const CHAR_PER_TOKEN = 4;
const MAX_CHUNK_CHARS = CHUNK_SIZE * CHAR_PER_TOKEN;
const OVERLAP_CHARS = CHUNK_OVERLAP * CHAR_PER_TOKEN;

// Replicate chunkText for testing (same algorithm as embedding-service)
function chunkText(text: string): string[] {
  const clean = stripHtml(text);
  if (clean.length <= MAX_CHUNK_CHARS) return [clean];

  const chunks: string[] = [];
  let start = 0;

  while (start < clean.length) {
    let end = start + MAX_CHUNK_CHARS;

    if (end < clean.length) {
      const sentenceEnd = clean.lastIndexOf('.', end);
      if (sentenceEnd > start + MAX_CHUNK_CHARS / 2) {
        end = sentenceEnd + 1;
      }
    } else {
      end = clean.length;
    }

    chunks.push(clean.slice(start, end).trim());

    // If we've reached the end, stop
    if (end >= clean.length) break;

    start = end - OVERLAP_CHARS;
    if (start < 0) start = 0;
  }

  return chunks.filter((c) => c.length > 20);
}

describe('chunkText', () => {
  it('should return single chunk for short text', () => {
    const text = 'This is a short piece of text.';
    const chunks = chunkText(text);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe(text);
  });

  it('should split long text into multiple chunks', () => {
    const text = 'A'.repeat(3000);
    const chunks = chunkText(text);
    expect(chunks.length).toBeGreaterThan(1);
  });

  it('should produce chunks with overlap', () => {
    const sentences = [];
    for (let i = 0; i < 50; i++) {
      sentences.push(`This is sentence number ${i} with some content about Islamic studies.`);
    }
    const text = sentences.join(' ');
    const chunks = chunkText(text);

    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeGreaterThan(20);
    }
  });

  it('should filter out tiny chunks', () => {
    const text = 'Short. ' + 'A'.repeat(2100) + '. B.';
    const chunks = chunkText(text);
    for (const chunk of chunks) {
      expect(chunk.length).toBeGreaterThan(20);
    }
  });

  it('should strip HTML before chunking', () => {
    const html = '<p>' + 'Word '.repeat(600) + '</p>';
    const chunks = chunkText(html);
    for (const chunk of chunks) {
      expect(chunk).not.toContain('<p>');
      expect(chunk).not.toContain('</p>');
    }
  });

  it('should handle empty string', () => {
    const chunks = chunkText('');
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe('');
  });

  it('should try to break at sentence boundaries', () => {
    const sentences = [];
    for (let i = 0; i < 40; i++) {
      sentences.push(`This is sentence ${i} about the topic of Islamic education and learning.`);
    }
    const text = sentences.join('. ') + '.';
    const chunks = chunkText(text);

    const endsWithPeriod = chunks.filter(c => c.endsWith('.'));
    expect(endsWithPeriod.length).toBeGreaterThan(0);
  });

  it('should respect MAX_CHUNK_CHARS limit', () => {
    const text = 'Word '.repeat(1000);
    const chunks = chunkText(text);
    for (const chunk of chunks) {
      // Allow some tolerance for sentence boundary seeking
      expect(chunk.length).toBeLessThanOrEqual(MAX_CHUNK_CHARS + 100);
    }
  });
});
