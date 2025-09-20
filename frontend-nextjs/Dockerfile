FROM node:20-alpine AS base

# Cài đặt pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---------- Stage: deps ----------
FROM base AS deps
WORKDIR /app

# Copy đúng các file cần thiết để cache tốt
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- Stage: builder ----------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# ---------- Stage: production ----------
FROM base AS production
WORKDIR /app

# Cài lại pnpm trong production
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy file để install lại dependencies
COPY package.json pnpm-lock.yaml ./

# Cài deps production
RUN pnpm install --frozen-lockfile --prod

# Copy các file build từ builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/standalone/server.js ./server.js
COPY .env.production.local ./

EXPOSE 3101

CMD ["node", "server.js"]
