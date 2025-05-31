# ============================================================================
# Multi-stage Dockerfile for Markdown to ATS CV Generator
# Optimized for production deployment with clean architecture
# ============================================================================

# Base stage with Node.js runtime (using Node 22+ as requested)
FROM node:22-alpine AS base

# Set metadata
LABEL maintainer="Bima Pangestu <bimapangestu280@gmail.com>"
LABEL description="Professional ATS-friendly CV generator from Markdown"
LABEL version="1.0.0"

# Install system dependencies required for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Create app directory with proper permissions
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# ============================================================================
# Dependencies stage - Install and cache dependencies
# ============================================================================
FROM base AS deps

# Copy package files
COPY package*.json ./

# Install dependencies with clean cache
RUN npm ci --only=production --silent && \
    npm cache clean --force

# ============================================================================
# Builder stage - Prepare application code
# ============================================================================
FROM base AS builder

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci --silent

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p public/uploads && \
    chmod 755 public/uploads

# Remove development files
RUN rm -rf src/**/*.test.js src/**/*.spec.js

# ============================================================================
# Production stage - Final optimized image
# ============================================================================
FROM base AS production

# Set production environment
ENV NODE_ENV=production
ENV PORT=8081

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/template.md ./template.md
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Create uploads directory with proper permissions
RUN mkdir -p public/uploads && \
    chown -R nextjs:nodejs public/uploads && \
    chmod 755 public/uploads

# Switch to non-root user for security
USER nextjs

# Expose application port
EXPOSE 8081

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8081/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["node", "src/server.js"]

# ============================================================================
# Development stage - For development with hot reload
# ============================================================================
FROM base AS development

# Set development environment
ENV NODE_ENV=development
ENV PORT=8081

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install --silent

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p public/uploads && \
    chmod 755 public/uploads

# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 8081

# Start application in development mode
CMD ["npm", "run", "server:dev"]