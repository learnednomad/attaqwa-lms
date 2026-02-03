/**
 * Embedding Service
 * Manages vector embeddings for semantic search using pgvector + Ollama.
 * Handles chunking, indexing, and similarity search.
 */

import * as ollamaClient from './ollama-client';
import * as fs from 'fs';
import * as path from 'path';

const CHUNK_SIZE = 500;      // tokens (approx chars/4)
const CHUNK_OVERLAP = 50;    // token overlap between chunks
const CHAR_PER_TOKEN = 4;    // rough estimate
const MAX_CHUNK_CHARS = CHUNK_SIZE * CHAR_PER_TOKEN;
const OVERLAP_CHARS = CHUNK_OVERLAP * CHAR_PER_TOKEN;

// ============================================================================
// Text Chunking
// ============================================================================

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export function chunkText(text: string): string[] {
  const clean = stripHtml(text);
  if (clean.length <= MAX_CHUNK_CHARS) return [clean];

  const chunks: string[] = [];
  let start = 0;

  while (start < clean.length) {
    let end = start + MAX_CHUNK_CHARS;

    // Try to break at sentence boundary
    if (end < clean.length) {
      const sentenceEnd = clean.lastIndexOf('.', end);
      if (sentenceEnd > start + MAX_CHUNK_CHARS / 2) {
        end = sentenceEnd + 1;
      }
    } else {
      end = clean.length;
    }

    chunks.push(clean.slice(start, end).trim());
    start = end - OVERLAP_CHARS; // overlap
    if (start < 0) start = 0;
    if (start >= clean.length) break;
  }

  return chunks.filter((c) => c.length > 20); // skip tiny chunks
}

// ============================================================================
// Database Operations
// ============================================================================

/**
 * Run the embeddings migration on bootstrap.
 */
export async function runMigration(strapi: any): Promise<void> {
  try {
    const sqlPath = path.join(__dirname, 'migrations', 'create-embeddings-table.sql');
    // In production build, the SQL might be at a different relative path
    let sql: string;
    try {
      sql = fs.readFileSync(sqlPath, 'utf-8');
    } catch {
      // Try alternate path for compiled output
      const altPath = path.join(__dirname, '../../src/api/ai/services/migrations/create-embeddings-table.sql');
      sql = fs.readFileSync(altPath, 'utf-8');
    }

    const knex = strapi.db.connection;
    await knex.raw(sql);
    strapi.log.info('Content embeddings table ready');
  } catch (error: any) {
    strapi.log.warn(`Embeddings migration: ${error.message}`);
  }
}

/**
 * Generate embedding and store for a piece of content.
 */
export async function indexContent(
  strapi: any,
  contentType: string,
  contentId: string,
  title: string,
  content: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  if (!ollamaClient.isEnabled()) return;

  const available = await ollamaClient.isAvailable();
  if (!available) {
    strapi.log.warn(`Ollama unavailable, skipping embedding for ${contentType}:${contentId}`);
    return;
  }

  const knex = strapi.db.connection;

  // Delete existing embeddings for this content
  await knex.raw(
    'DELETE FROM content_embeddings WHERE content_type = ? AND content_id = ?',
    [contentType, contentId]
  );

  // Chunk the content
  const chunks = chunkText(content);
  const titleClean = stripHtml(title);

  for (let i = 0; i < chunks.length; i++) {
    try {
      // Prepend title to chunk for better context
      const textToEmbed = `${titleClean}: ${chunks[i]}`;
      const embeddings = await ollamaClient.embed(textToEmbed);

      if (embeddings && embeddings.length > 0) {
        const vector = `[${embeddings[0].join(',')}]`;
        await knex.raw(
          `INSERT INTO content_embeddings (content_type, content_id, title, chunk_text, chunk_index, embedding, metadata)
           VALUES (?, ?, ?, ?, ?, ?::vector, ?::jsonb)`,
          [contentType, contentId, titleClean, chunks[i], i, vector, JSON.stringify(metadata)]
        );
      }
    } catch (error: any) {
      strapi.log.warn(`Failed to embed chunk ${i} for ${contentType}:${contentId}: ${error.message}`);
    }
  }
}

/**
 * Remove embeddings for deleted content.
 */
export async function removeContent(
  strapi: any,
  contentType: string,
  contentId: string
): Promise<void> {
  const knex = strapi.db.connection;
  await knex.raw(
    'DELETE FROM content_embeddings WHERE content_type = ? AND content_id = ?',
    [contentType, contentId]
  );
}

/**
 * Semantic search: find similar content using cosine distance.
 */
export async function searchSimilar(
  strapi: any,
  query: string,
  options: {
    contentType?: string;
    limit?: number;
  } = {}
): Promise<Array<{
  contentType: string;
  contentId: string;
  title: string;
  snippet: string;
  score: number;
  metadata: any;
}>> {
  const limit = options.limit || 10;

  const available = await ollamaClient.isAvailable();
  if (!available) {
    return [];
  }

  // Generate query embedding
  const embeddings = await ollamaClient.embed(query);
  if (!embeddings || embeddings.length === 0) return [];

  const queryVector = `[${embeddings[0].join(',')}]`;
  const knex = strapi.db.connection;

  let sql = `
    SELECT content_type, content_id, title, chunk_text,
           1 - (embedding <=> ?::vector) as similarity,
           metadata
    FROM content_embeddings
    WHERE embedding IS NOT NULL
  `;
  const params: any[] = [queryVector];

  if (options.contentType) {
    sql += ' AND content_type = ?';
    params.push(options.contentType);
  }

  sql += ' ORDER BY embedding <=> ?::vector LIMIT ?';
  params.push(queryVector, limit);

  const result = await knex.raw(sql, params);
  const rows = result.rows || [];

  return rows.map((row: any) => ({
    contentType: row.content_type,
    contentId: row.content_id,
    title: row.title,
    snippet: row.chunk_text?.slice(0, 200) + (row.chunk_text?.length > 200 ? '...' : ''),
    score: parseFloat(row.similarity) || 0,
    metadata: row.metadata,
  }));
}

/**
 * Hybrid search: combine semantic and keyword results using
 * Reciprocal Rank Fusion (RRF).
 */
export async function hybridSearch(
  strapi: any,
  query: string,
  options: {
    contentType?: string;
    limit?: number;
  } = {}
): Promise<Array<{
  contentType: string;
  contentId: string;
  title: string;
  snippet: string;
  score: number;
  metadata: any;
}>> {
  const limit = options.limit || 10;
  const k = 60; // RRF constant

  // Run semantic and keyword search in parallel
  const [semanticResults, keywordResults] = await Promise.all([
    searchSimilar(strapi, query, { ...options, limit: limit * 2 }),
    keywordSearch(strapi, query, options),
  ]);

  // Build RRF scores
  const scoreMap = new Map<string, {
    contentType: string;
    contentId: string;
    title: string;
    snippet: string;
    score: number;
    metadata: any;
  }>();

  semanticResults.forEach((item, rank) => {
    const key = `${item.contentType}:${item.contentId}`;
    const existing = scoreMap.get(key);
    const rrf = 1 / (k + rank);
    if (existing) {
      existing.score += rrf;
    } else {
      scoreMap.set(key, { ...item, score: rrf });
    }
  });

  keywordResults.forEach((item, rank) => {
    const key = `${item.contentType}:${item.contentId}`;
    const existing = scoreMap.get(key);
    const rrf = 1 / (k + rank);
    if (existing) {
      existing.score += rrf;
    } else {
      scoreMap.set(key, { ...item, score: rrf });
    }
  });

  return Array.from(scoreMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Simple keyword search fallback (used in hybrid search and as degraded mode).
 */
async function keywordSearch(
  strapi: any,
  query: string,
  options: { contentType?: string; limit?: number } = {}
): Promise<Array<{
  contentType: string;
  contentId: string;
  title: string;
  snippet: string;
  score: number;
  metadata: any;
}>> {
  const limit = options.limit || 10;
  const knex = strapi.db.connection;

  let sql = `
    SELECT content_type, content_id, title, chunk_text, metadata
    FROM content_embeddings
    WHERE (title ILIKE ? OR chunk_text ILIKE ?)
  `;
  const searchPattern = `%${query}%`;
  const params: any[] = [searchPattern, searchPattern];

  if (options.contentType) {
    sql += ' AND content_type = ?';
    params.push(options.contentType);
  }

  sql += ' ORDER BY updated_at DESC LIMIT ?';
  params.push(limit);

  const result = await knex.raw(sql, params);
  const rows = result.rows || [];

  return rows.map((row: any, index: number) => ({
    contentType: row.content_type,
    contentId: row.content_id,
    title: row.title,
    snippet: row.chunk_text?.slice(0, 200) + (row.chunk_text?.length > 200 ? '...' : ''),
    score: 1 / (index + 1), // Simple rank-based score
    metadata: row.metadata,
  }));
}

/**
 * Reindex all content (admin operation).
 */
export async function reindexAll(strapi: any): Promise<{ indexed: number; errors: number }> {
  let indexed = 0;
  let errors = 0;

  const contentTypes = [
    { model: 'api::course.course', type: 'course', fields: ['title', 'description'] },
    { model: 'api::lesson.lesson', type: 'lesson', fields: ['title', 'content'] },
    { model: 'api::quiz.quiz', type: 'quiz', fields: ['title', 'description'] },
  ];

  for (const ct of contentTypes) {
    try {
      const items = await strapi.entityService.findMany(ct.model, { limit: 1000 });

      for (const item of items || []) {
        try {
          const content = ct.fields
            .map((f) => item[f] || '')
            .filter(Boolean)
            .join('\n\n');

          if (content.length > 50) {
            await indexContent(
              strapi,
              ct.type,
              String(item.documentId || item.id),
              item.title || '',
              content,
              { subject: item.subject, difficulty: item.difficulty, age_tier: item.age_tier }
            );
            indexed++;
          }
        } catch (err: any) {
          errors++;
          strapi.log.warn(`Reindex error for ${ct.type}:${item.id}: ${err.message}`);
        }
      }
    } catch (err: any) {
      strapi.log.error(`Reindex error for ${ct.model}: ${err.message}`);
    }
  }

  return { indexed, errors };
}
