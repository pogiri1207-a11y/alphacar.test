# 1. 빌드 단계 (Node 20)
FROM node:20-alpine AS builder
ARG APP_NAME

WORKDIR /app

# 모든 파일 복사 (이때 /app/aichat/package.json 도 복사됨)
COPY . .

# 글로벌 툴 설치 (Nest CLI 및 타입 오류 방지용 타입 정의)
RUN npm install -g @nestjs/cli @types/node

# --- CRITICAL MSA BUILD LOGIC (핵심 수정) ---
# 1. 해당 앱 폴더로 이동하여
# 2. 해당 앱의 package.json에 명시된 의존성을 설치하고
# 3. 빌드를 실행합니다.
RUN cd ${APP_NAME} && \
    npm install && \
    nest build

# 2. 실행 단계 (최종 이미지)
FROM node:20-alpine
ARG APP_NAME

WORKDIR /app

# [핵심 수정] 런타임에 필요한 파일만 개별 앱 폴더에서 복사
# 1. 컴파일된 빌드 결과물 복사 (build output: /app/aichat/dist)
COPY --from=builder /app/${APP_NAME}/dist ./dist

# 2. 프로덕션 의존성 설치를 위해 해당 앱의 package.json 복사
COPY --from=builder /app/${APP_NAME}/package.json ./
RUN npm install --production

EXPOSE 3000-4000
CMD ["node", "dist/main"]
