# Specify the node base image with your desired version node:<version>
FROM node:lts


# Install dependencies and tools
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends --no-install-suggests \
    sudo \
    git \    
    && apt-get autoremove -y \
    && apt-get clean -y

# Create app directory
RUN git clone https://github.com/AlexThry/Sentinel1_images_processing.git /Sentinel1_images_processing



WORKDIR /Sentinel1_images_processing/app/react-app

# Install app dependencies
RUN npm install


# expose the app on port 5173
EXPOSE 3000
# Start your frontend application
CMD [ "npm", "run", "dev"]
