FROM node:20-alpine AS base

# Cài pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---------- Stage: Install Dependencies ----------
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- Stage: Build ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# ---------- Stage: Production ----------
FROM base AS production
WORKDIR /app

# Cài pnpm ở stage production
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
COPY ./tai-len ./tai-len

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY .env.production.local ./

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main"]
