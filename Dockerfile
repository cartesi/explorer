FROM node:14-alpine AS builder

WORKDIR /app

# cache dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# copy application
COPY . .
RUN yarn run build

FROM nginx
COPY --from=builder /app/out /usr/share/nginx/html
