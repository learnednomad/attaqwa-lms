-- ============================================================================
-- Content Embeddings Table for Semantic Search
-- Requires pgvector extension. Uses vector(4096) for Mistral embeddings.
-- Idempotent: safe to run multiple times.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS content_embeddings (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL,       -- 'course', 'lesson', 'quiz'
  content_id VARCHAR(255) NOT NULL,        -- Strapi document ID
  title TEXT NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER DEFAULT 0,
  embedding vector(4096),                  -- Mistral 7B embedding dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_embeddings_content
  ON content_embeddings (content_type, content_id);

CREATE INDEX IF NOT EXISTS idx_embeddings_updated
  ON content_embeddings (updated_at DESC);

-- IVFFlat index for approximate nearest neighbor search
-- Note: This index requires at least a few rows to exist before creation.
-- It will be created dynamically by the embedding service after initial indexing.
