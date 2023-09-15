FROM node:lts-alpine3.16

# Set env VERSION
ENV VERSION 1.0.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY chatbot-conversational_AI/update-bot/app/package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY chatbot-conversational_AI/update-bot/app .


CMD [ "npm", "start" ]

