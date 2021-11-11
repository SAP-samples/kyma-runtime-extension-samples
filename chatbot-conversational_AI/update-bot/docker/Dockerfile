FROM node:alpine3.13

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY ../app/package*.json ./

RUN npm install

# Bundle app source
COPY ../app ./

EXPOSE 3000

CMD [ "npm", "start" ]