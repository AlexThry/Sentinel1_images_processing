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

# give permissions to every us
RUN chmod -R 777 /Sentinel1_images_processing/app/react-app/Readme_assets

WORKDIR /Sentinel1_images_processing/app/react-app

# Install app dependencies
RUN npm install

COPY ../cp/README.md README.md
# expose the app on port 5173
EXPOSE 3000
# Start your frontend application
CMD [ "npm", "run", "dev"]
