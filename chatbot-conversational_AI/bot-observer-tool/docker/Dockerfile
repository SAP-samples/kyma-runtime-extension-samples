# Use the official Node.js image with alpine as the base image
FROM node:alpine

# Set environment variable
ENV VERSION 1.0.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the application code to the container
COPY chatbot-conversational_AI/bot-observer-tool/app .

# Install app dependencies
RUN npm install

# Expose port 3000 for the app to listen on
EXPOSE 3000

# Define the command to start your application
CMD ["npm", "start"]