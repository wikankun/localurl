# Multi-stage Dockerfile for LocalURL
# Stage 1: Build stage (if needed in future)
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files (if we add build tools later)
# COPY package*.json ./
# RUN npm ci --only=production

# Stage 2: Production stage
FROM nginx:alpine AS production

# Install required packages
RUN apk add --no-cache \
    python3 \
    py3-pip \
    && pip3 install http-server

# Create app directory
WORKDIR /app

# Copy application files
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S localurl -u 1001

# Change ownership of app directory
RUN chown -R localurl:nodejs /app

# Switch to non-root user
USER localurl

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8000/ || exit 1

# Start the application
CMD ["python3", "-m", "http.server", "8000"]