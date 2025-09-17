### Builder stage
FROM node:18-alpine AS builder

WORKDIR /app
# Install dependencies only (including sharp)
COPY package*.json ./
RUN npm ci && npm install sharp
# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--trace-warnings"
# Build the application
RUN npm run build

### Production stage
FROM node:18-alpine AS production
WORKDIR /app
# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=builder /app/tailwind.config.ts ./tailwind.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
ENV NODE_ENV=production
ENV NODE_OPTIONS="--trace-warnings"

EXPOSE 3000

CMD ["npm", "run", "start"]

