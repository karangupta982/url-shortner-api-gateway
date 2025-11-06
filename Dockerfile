# Use official Node LTS
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies (layer caching)
COPY package*.json ./
RUN npm ci --production && npm cache clean --force

# Copy source
COPY . .

# Expose the gateway port (default 5000)
EXPOSE 5000

# Create and use non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["node", "src/server.js"]
