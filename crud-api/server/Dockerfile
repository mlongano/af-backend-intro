# Stage 1: Build
FROM node:18 AS builder

WORKDIR /server

# Copy package files and tsconfig for caching; install consistent dependencies.
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy source files and build
COPY src/ ./src/
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /server

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Set environment variable explicitly if needed in the container
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "dist/index.js"]