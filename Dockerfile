# =============================================================================
# Multi-stage Dockerfile for AttaqwaMasjid LMS Monorepo
# Targets: api, admin, website
# =============================================================================

# ---------------------------------------------------------------------------
# Base: Node.js with pnpm
# ---------------------------------------------------------------------------
FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat dumb-init
RUN npm install -g pnpm@10.12.3

WORKDIR /app

# ---------------------------------------------------------------------------
# Dependencies: Install all workspace dependencies (cached layer)
# ---------------------------------------------------------------------------
FROM base AS dependencies

# Copy only lockfiles and manifests first (cache layer)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy all package.json files explicitly (glob patterns unreliable in COPY)
COPY apps/api/package.json ./apps/api/
COPY apps/admin/package.json ./apps/admin/
COPY apps/website/package.json ./apps/website/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/shared/package.json ./packages/shared/

# Install all dependencies (including dev for building)
RUN pnpm install --frozen-lockfile

# ---------------------------------------------------------------------------
# Source: Copy all source code on top of installed dependencies
# ---------------------------------------------------------------------------
FROM dependencies AS source

# Copy root tsconfig (extended by apps/website/tsconfig.json)
COPY tsconfig.json ./
COPY apps/ ./apps/
COPY packages/ ./packages/

# ===========================================================================
# API (Strapi v5)
# ===========================================================================

FROM source AS api-builder

WORKDIR /app/apps/api
RUN pnpm build

# --- API Production ---
FROM node:22-alpine AS api

RUN apk add --no-cache dumb-init
RUN npm install -g pnpm@10.12.3
RUN addgroup -g 1001 -S nodejs && adduser -S strapi -u 1001

WORKDIR /app

# Copy workspace config for pnpm
COPY --from=dependencies /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json ./
COPY --from=dependencies /app/apps/api/package.json ./apps/api/
COPY --from=dependencies /app/packages/shared-types/package.json ./packages/shared-types/

# Copy node_modules (Strapi requires full monorepo deps at runtime)
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules

# Copy Strapi build output (dist includes compiled config, src, and admin)
COPY --from=api-builder /app/apps/api/dist ./apps/api/dist
COPY --from=source /app/apps/api/src ./apps/api/src
# Use compiled JS config from dist (Strapi production can't load .ts files)
COPY --from=api-builder /app/apps/api/dist/config ./apps/api/config
COPY --from=source /app/packages/shared-types ./packages/shared-types

# Set ownership
RUN chown -R strapi:nodejs /app/apps/api

WORKDIR /app/apps/api

USER strapi

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:1337/_health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["pnpm", "start"]

# ===========================================================================
# Admin (Next.js 15 - standalone)
# ===========================================================================

FROM source AS admin-builder

WORKDIR /app/apps/admin
# Ensure public directory exists (may not exist in all setups)
RUN mkdir -p public
RUN pnpm build

# --- Admin Production ---
FROM node:22-alpine AS admin

RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

WORKDIR /app

# Copy standalone output (self-contained with dependencies)
COPY --from=admin-builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
# Copy static assets and public files
COPY --from=admin-builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=admin-builder --chown=nextjs:nodejs /app/apps/admin/public ./apps/admin/public

USER nextjs

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000 || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "apps/admin/server.js"]

# ===========================================================================
# Website (Next.js 16 - standalone)
# ===========================================================================

FROM source AS website-builder

WORKDIR /app/apps/website
RUN pnpm build

# --- Website Production ---
FROM node:22-alpine AS website

RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

WORKDIR /app

# Copy standalone output (self-contained with dependencies)
COPY --from=website-builder --chown=nextjs:nodejs /app/apps/website/.next/standalone ./
# Copy static assets and public files
COPY --from=website-builder --chown=nextjs:nodejs /app/apps/website/.next/static ./apps/website/.next/static
COPY --from=website-builder --chown=nextjs:nodejs /app/apps/website/public ./apps/website/public

USER nextjs

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3001 || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "apps/website/server.js"]
