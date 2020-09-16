FROM node:14.11.0

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY . .
RUN yarn install && yarn build

ENTRYPOINT ["yarn", "start"]
