# 1. 빌드 단계 (Node 20)
FROM node:20-alpine AS builder
ARG APP_NAME

WORKDIR /app

# 패키지 파일 복사 및 설치 (공통 의존성)
COPY package*.json ./
RUN npm install

# NestJS CLI 전역 설치
RUN npm install -g @nestjs/cli

# 소스 복사
COPY . .

# ★ [핵심 수정 1] 해당 앱 폴더로 "이동(cd)"해서 빌드합니다!
# (기존: nest build ${APP_NAME} -> 에러남)
# (수정: cd ${APP_NAME} && nest build -> 성공함)
RUN cd ${APP_NAME} && nest build

# 2. 실행 단계
FROM node:20-alpine
ARG APP_NAME

WORKDIR /app
COPY package*.json ./
RUN npm install --production

# ★ [핵심 수정 2] 빌드 결과물 경로가 바뀝니다!
# (기존: /app/dist/apps/${APP_NAME})
# (수정: /app/${APP_NAME}/dist) -> 각 폴더 안에 dist가 생기기 때문
COPY --from=builder /app/${APP_NAME}/dist ./dist

EXPOSE 3000-4000
CMD ["node", "dist/main"]
