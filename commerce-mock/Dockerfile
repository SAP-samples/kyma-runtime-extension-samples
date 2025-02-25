FROM node:14-alpine as builder

WORKDIR /src
COPY . .

RUN npm install
RUN npm test
RUN npm prune --production

FROM node:14-alpine
RUN apk --no-cache upgrade
ENV NODE_ENV=production
WORKDIR /app
COPY . .
COPY --from=builder /src/node_modules node_modules

EXPOSE 10000
CMD ["npm","start"]