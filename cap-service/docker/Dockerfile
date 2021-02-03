# Use the Node version that matches the version you have installed locally
FROM node:12.18.1
# Create app directory, in which the CAP service is built
WORKDIR /usr/src/app
# Install app dependencies
# This will download and install all Node.JS dependencies and put them into the workdir/node_modules
COPY app/package*.json ./
RUN npm install
# Bundle app source
COPY app ./
# expose the port which is opened by CDS by default
EXPOSE 4004
# run the cap-service
CMD [ "npm", "start" ]
