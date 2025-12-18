# --- 1단계: 빌드 스테이지 ---
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1. 루트 의존성 설치
COPY package*.json ./
RUN npm install -g @nestjs/cli && \
    npm install --legacy-peer-deps

# 2. aichat 의존성 설치 (중요!)
# aichat 폴더 안에 있는 라이브러리들도 설치합니다.
COPY aichat/package.json ./aichat/
RUN cd aichat && npm install --legacy-peer-deps

# 3. 소스 코드 복사
COPY . .

# 4. 빌드 실행
# --verbose 옵션 제거함 (에러 원인 해결)
RUN cd aichat && \
    echo "🚀 Starting nest build for aichat..." && \
    NODE_OPTIONS="--max-old-space-size=4096" nest build

# --- 2단계: 실행 스테이지 ---
FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache libc6-compat

# 5. 결과물 복사
# aichat의 빌드 결과물을 가져옵니다.
COPY --from=builder /app/aichat/dist ./dist
COPY --from=builder /app/aichat/node_modules ./node_modules
COPY --from=builder /app/aichat/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/main"]
