#!/bin/bash

# Check if script is run as root
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# Update package lists and install curl
apt-get update
apt-get install curl -y

# Install NVM
curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh -o install_nvm.sh
bash install_nvm.sh

export NVM_DIR="$HOME/.nvm"
# This loads nvm
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# This loads nvm bash_completion
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Source the .bashrc file to activate NVM
source ~/.bashrc

# Verify NVM installation
command -v nvm

# Install Node.js version 16.20.2 using NVM
nvm install v16.20.2

# Verify Node.js installation
node -v
npm -v

# Output NVM version and list installed Node.js versions
nvm --version
nvm list

# Install supervisor locally for development
npm install supervisor -g

# install python 3.12
cd /tmp 
wget https://www.python.org/ftp/python/3.12.1/Python-3.12.1.tar.xz 
tar -xf Python-3.12.1.tar.xz 
cd Python-3.12.1
./configure --enable-optimizations
make -j $(4)
make altinstall
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py 
sudo python3.12 get-pip.py 
cd /tmp 
rm -rf Python-3.12.1.tar.xz Python-3.12.1



# Clone the repository
cd ..
git clone https://github.com/AlexThry/Sentinel1_images_processing.git

# Navigate to the project directory
cd /Sentinel1_images_processing/app/express-app && npm install && python3.12 -m venv venv
source ./venv/bin/activate && pip install -r requirements.txt

# give permissions to the folder
chmod -R 777 /Sentinel1_images_processing/app/express-app/xml