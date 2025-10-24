# Base stage with Node.js
FROM node:22-alpine AS base

# Install pnpm
RUN npm install -g pnpm@10.12.3

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Dependencies stage
FROM base AS dependencies

# Copy all package.json files
COPY apps/api/package.json ./apps/api/
COPY apps/admin/package.json ./apps/admin/
COPY apps/website/package.json ./apps/website/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Builder stage for API
FROM base AS api-builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps ./apps
COPY --from=dependencies /app/packages ./packages

# Copy source files
COPY apps/api ./apps/api
COPY packages ./packages

# Build API
WORKDIR /app/apps/api
RUN pnpm build

# API production stage
FROM node:22-alpine AS api

RUN npm install -g pnpm@10.12.3

WORKDIR /app

# Copy built application
COPY --from=api-builder /app/apps/api ./apps/api
COPY --from=dependencies /app/node_modules ./node_modules

WORKDIR /app/apps/api

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

EXPOSE 1337

CMD ["pnpm", "start"]

# Builder stage for Admin
FROM base AS admin-builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps ./apps
COPY --from=dependencies /app/packages ./packages

COPY apps/admin ./apps/admin
COPY packages ./packages

WORKDIR /app/apps/admin
RUN pnpm build

# Admin production stage
FROM node:22-alpine AS admin

RUN npm install -g pnpm@10.12.3

WORKDIR /app

COPY --from=admin-builder /app/apps/admin/.next ./apps/admin/.next
COPY --from=admin-builder /app/apps/admin/public ./apps/admin/public
COPY --from=admin-builder /app/apps/admin/package.json ./apps/admin/
COPY --from=dependencies /app/node_modules ./node_modules

WORKDIR /app/apps/admin

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "start"]

# Builder stage for Website
FROM base AS website-builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps ./apps
COPY --from=dependencies /app/packages ./packages

COPY apps/website ./apps/website
COPY packages ./packages

WORKDIR /app/apps/website
RUN pnpm build

# Website production stage
FROM node:22-alpine AS website

RUN npm install -g pnpm@10.12.3

WORKDIR /app

COPY --from=website-builder /app/apps/website/.next ./apps/website/.next
COPY --from=website-builder /app/apps/website/public ./apps/website/public
COPY --from=website-builder /app/apps/website/package.json ./apps/website/
COPY --from=dependencies /app/node_modules ./node_modules

WORKDIR /app/apps/website

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["pnpm", "start"]
