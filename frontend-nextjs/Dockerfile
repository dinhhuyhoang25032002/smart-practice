FROM node:20-alpine AS base
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci  --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY .env.production ./
EXPOSE 3000
CMD ["npm", "start"]