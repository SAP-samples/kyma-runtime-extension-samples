# build environment
FROM node:current-slim as build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run-script build

# production environment
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html