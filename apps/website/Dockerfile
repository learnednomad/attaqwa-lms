# Multi-stage Dockerfile for Next.js web application
FROM node:18-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY packages/web/package.json ./packages/web/
COPY packages/shared/package.json ./packages/shared/
COPY turbo.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --frozen-lockfile

# Copy source code
COPY packages/web ./packages/web
COPY packages/shared ./packages/shared

# Ensure the web package can find the root tsconfig.json at the correct relative path
# The web/tsconfig.json extends ../../tsconfig.json, so we need the root tsconfig.json 
# to be accessible from /app/packages/web/ as ../../tsconfig.json

# Development stage
FROM base AS development

# Install development dependencies
RUN npm install -g @next/bundle-analyzer

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Start development server with Turbopack
CMD ["npm", "run", "dev", "--workspace=@attaqwa/web"]

# Build stage
FROM base AS builder

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build shared package first
RUN npm run build --workspace=@attaqwa/shared

# Build the Next.js application
RUN npm run build --workspace=@attaqwa/web

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init curl

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY --from=builder /app/packages/web/package.json ./
COPY --from=builder /app/packages/web/next.config.js ./

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/public ./public

# Create logs directory
RUN mkdir -p /app/logs && chown nextjs:nodejs /app/logs

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Set environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# Start the application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]

# Static export stage (for CDN deployment)
FROM nginx:alpine AS static

# Copy static files
COPY --from=builder /app/packages/web/out /usr/share/nginx/html

# Copy custom nginx configuration
COPY packages/web/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]