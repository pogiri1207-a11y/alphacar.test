# 1. 빌드 단계 (Node 20)
FROM node:20-alpine AS builder
ARG APP_NAME

WORKDIR /app

# 모든 파일 복사
COPY . .

# 글로벌 툴 설치
RUN npm install -g @nestjs/cli @types/node

# 👇👇👇 [핵심 수정] schemas 폴더가 있다면, 앱의 src 폴더 안으로 복사해라! 👇👇👇
# (main 서비스가 schemas를 찾을 수 있게 해주는 마법의 주문입니다)
RUN [ -d "schemas" ] && cp -r schemas ${APP_NAME}/src/ || true

# --- MSA 빌드 실행 ---
RUN cd ${APP_NAME} && \
    npm install && \
    nest build

# 2. 실행 단계 (최종 이미지)
FROM node:20-alpine
ARG APP_NAME

WORKDIR /app

# 런타임 파일 복사
COPY --from=builder /app/${APP_NAME}/dist ./dist
COPY --from=builder /app/${APP_NAME}/package.json ./

# 프로덕션 의존성 설치
RUN npm install --production

EXPOSE 3000-4000
CMD ["node", "dist/main"]
