#!/bin/bash

# Check if script is run as root
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# Update package lists and install curl
apt-get update

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