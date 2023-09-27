FROM node:lts-alpine3.16

# Set env VERSION
ENV VERSION 1.0.0

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY app/package*.json ./

RUN npm install

# Bundle app source
COPY app ./

EXPOSE 3000

CMD [ "npm", "start" ]
