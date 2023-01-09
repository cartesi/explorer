# TODO: NEED TO REVISIT THE DOCKERFILE CREATION USING TURBOREPO
# REFERENCE: https://turbo.build/repo/docs/handbook/deploying-with-docker
FROM node:18-alpine AS deps
# Add dependencies for some yarn installs.
RUN apk add --no-cache git openssh
# Add dependencies for node-gyp.
RUN apk add --no-cache g++ make python3 py3-pip
WORKDIR /deps
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /deps/node_modules ./node_modules
# Copy the application
COPY . .
# Disabling telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1
# script that do a graphql codegen, build nextJS app and generates a HTML version of it.
RUN yarn run export

FROM nginx
COPY --from=builder /app/out /usr/share/nginx/html
VOLUME [ "/usr/share/nginx/html/abi" ]
