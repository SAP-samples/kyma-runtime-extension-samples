# Use the official Node.js image with alpine as the base image
FROM node:alpine

# Set environment variable
ENV VERSION 1.0.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY chatbot-conversational_AI/bot-observer-tool/app/package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY chatbot-conversational_AI/bot-observer-tool/app .

# Expose port 3000 for the app to listen on
EXPOSE 3000

# Define the command to start your application
CMD ["npm", "start"]