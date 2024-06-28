FROM node:21-alpine3.19

WORKDIR /user/src/app

COPY package*.json ./

RUN yarn

COPY . .

# RUN npx prisma generate
# RUN npx prisma migrate dev

EXPOSE 3000

# hola