FROM node:alpine3.13

# Set env VERSION
ENV VERSION 1.0.0

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY lionel-fridgy/receiver/app/package*.json ./

RUN npm install

# Bundle app source
COPY lionel-fridgy/receiver/app ./

EXPOSE 3000

CMD [ "npm", "start" ]
