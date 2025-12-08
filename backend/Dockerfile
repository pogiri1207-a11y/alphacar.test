# 1. 빌드 단계 (Node 버전을 20으로 올림!)
FROM node:20-alpine AS builder
ARG APP_NAME

WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# ★ [핵심 수정] NestJS CLI를 전역으로 강제 설치 (에러 방지)
RUN npm install -g @nestjs/cli

# 소스 복사
COPY . .

# 이제 npx 없이 그냥 nest 명령어로 빌드 (CLI를 설치했으니까)
RUN nest build ${APP_NAME}

# 2. 실행 단계 (여기도 Node 20으로 올려야 함!)
FROM node:20-alpine
ARG APP_NAME

WORKDIR /app
COPY package*.json ./

# 프로덕션 의존성 설치
RUN npm install --production

# 빌드 결과물 가져오기
COPY --from=builder /app/dist/apps/${APP_NAME} ./dist

EXPOSE 3000-4000
CMD ["node", "dist/main"]
