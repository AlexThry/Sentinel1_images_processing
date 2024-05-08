# Specify the node base image with your desired version node:<version>
FROM node:alpine

# Set the language to English and the character encoding to UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Install dependencies and tools
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    sudo \
    git \
    bash \
    gettext \
    && rm -rf /var/cache/apk/*

# Create app directory
RUN git clone https://github.com/AlexThry/Sentinel1_images_processing.git /Sentinel1_images_processing

WORKDIR /Sentinel1_images_processing/app/react-app

# Install app dependencies
RUN npm install

# expose the app on port 5173
EXPOSE 5173

# Start your frontend application
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0"]
