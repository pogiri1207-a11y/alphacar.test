# --- 1단계: 빌드 스테이지 ---
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1. 루트 의존성 설치
COPY package*.json ./
RUN npm install -g @nestjs/cli && \
    npm install --legacy-peer-deps

# 2. search 의존성 설치 (중요!)
# search 폴더의 package.json을 복사해서 설치합니다.
COPY search/package.json ./search/
RUN cd search && npm install --legacy-peer-deps

# 3. 소스 코드 복사
COPY . .

# 4. 빌드 실행
# --verbose 삭제 및 search 폴더에서 빌드 수행
RUN cd search && \
    echo "🚀 Starting nest build for search..." && \
    NODE_OPTIONS="--max-old-space-size=4096" nest build

# --- 2단계: 실행 스테이지 ---
FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache libc6-compat

# 5. 결과물 복사
# search의 결과물을 가져옵니다.
COPY --from=builder /app/search/dist ./dist
COPY --from=builder /app/search/node_modules ./node_modules
COPY --from=builder /app/search/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/main"]
