#어떤 이미지를 사용할지
FROM node:alpine AS development

WORKDIR /usr/src/app

#PNPM설치하기
RUN npm i -g pnpm

#package.json 복사해오기
COPY package*.json ./

#pnpm-lock.yaml
COPY pnpm-lock.yaml ./

# Dependencies 설치
RUN pnpm i

#나머지 파일/폴더 복사해오기
COPY . .

#커맨드 실행
CMD ["pnpm", "run", "start:dev:user"]