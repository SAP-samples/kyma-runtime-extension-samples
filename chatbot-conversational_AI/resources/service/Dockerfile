# Use the capui5tools for the first stage build
FROM {your-docker-account}/capui5tools as capbuild
#Base version
ENV VERSION 1.0.0
# Create app directory, in which the CAP service is built
WORKDIR /app
# Copy source
COPY components .
# build app
RUN ["cds", "build"]

# Use the Node version that matches the version you have installed locally
FROM node:16-slim
# Set to production to connect to HANA Cloud
ENV NODE_ENV=production
# Create app directory, in which the CAP service is built
WORKDIR /usr/src/app
# Copy source and service
COPY --from=capbuild /app/gen/srv .
# Install app dependencies
RUN npm install
# expose the port which is opened by CDS by default
EXPOSE 4004
# Run as node user
USER node
# Run the cap-service
CMD [ "npm", "start" ]

# ------------
