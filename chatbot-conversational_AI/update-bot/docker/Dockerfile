FROM node:lts-alpine3.16

# Set env VERSION
ENV VERSION 1.0.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the application code to the container
COPY chatbot-conversational_AI/update-bot/app .

# Install app dependencies
RUN npm install

CMD [ "npm", "start" ]
