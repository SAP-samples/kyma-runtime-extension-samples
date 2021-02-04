# Use the Node version that matches the version you have installed locally
FROM node:12.18.1
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY app/package*.json ./
RUN npm install
# Bundle app source
COPY app ./
EXPOSE 3000
CMD [ "npm", "start" ]