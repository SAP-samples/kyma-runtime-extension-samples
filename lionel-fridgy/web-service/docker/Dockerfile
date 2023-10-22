# build environment
FROM node:current-slim as build
WORKDIR /app
COPY lionel-fridgy/web-service/package.json ./
RUN npm install
COPY lionel-fridgy/web-service .
RUN npm run-script build

# production environment
FROM nginx:alpine

# Set env VERSION
ENV VERSION 1.0.0

COPY --from=build /app/dist /usr/share/nginx/html
