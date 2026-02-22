# MiriArt Cloud Run Dockerfile
# GCP Cloud Run 배포용

FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Cloud Run은 PORT 환경변수 자동 주입
ENV NODE_ENV=production
ENV PORT=8080

# GEMINI_API_KEY는 Cloud Run 환경변수 또는 Secret Manager로 주입
# 절대 Dockerfile에 하드코딩하지 마세요

EXPOSE 8080
CMD ["node", "dist/index.js"]
