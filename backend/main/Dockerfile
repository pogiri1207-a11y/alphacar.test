FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY main/package.json ./main/
RUN npm install -g @nestjs/cli && npm install --legacy-peer-deps
COPY . .
# 🚀 main은 ioredis 등이 필요하므로 의존성 설치를 확실히 합니다.
RUN cd main && NODE_OPTIONS="--max-old-space-size=4096" nest build 

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/main/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/main/package.json ./package.json
CMD ["node", "dist/main"]
