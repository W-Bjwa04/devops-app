# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json ./
RUN npm install --production

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copy public folder if it exists
COPY --from=builder /app/public ./public 2>/dev/null || true

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
