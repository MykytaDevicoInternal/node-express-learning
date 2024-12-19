# Build stage
FROM node:lts-alpine AS build

WORKDIR /chat-app

COPY . .

RUN yarn

RUN yarn build

# Production stage
FROM node:lts-alpine as production
WORKDIR /chat-app

COPY package.json .
COPY yarn.lock .

RUN yarn install --immutable --immutable-cache --check-cache

COPY --from=build /chat-app/dist .

# Copy the migrations directory directly
COPY ./migrations ./migrations

EXPOSE 4200
