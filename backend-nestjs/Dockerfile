FROM node:20-alpine AS base

# ---------- Stage: Install Dependencies ----------
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---------- Stage: Build ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- Stage: Production ----------
FROM base AS production
WORKDIR /app

# Chỉ copy những thứ cần thiết
COPY package*.json ./
COPY ./khoa-hoc ./khoa-hoc
COPY ./bai-hoc ./bai-hoc
COPY ./tai-len ./tai-len
RUN npm ci --omit=dev
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY .env.production.local ./

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main"]
