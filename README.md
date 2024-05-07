# Sentinel1 Image Processing Application

## Description

This application is a web application that allows users to process Sentinel-1 phases images. It simplifies the process of downloading, processing and visualizing Sentinel-1 images compared to using ASF website for downloading and SNAP for processing / visualizing.


## Installation

### Requirements

Clone the repository and install the required packages in the `app/express-app` folder and in the `app/react-app` folder.

```bash
git clone https://github.com/AlexThry/Sentinel1_images_processing.git
cd Sentinel1_images_processing/app/express-app
npm install
cd ../react-app
npm install
```

You will also need Python 3.11.5 installed on your machine.
You can download it [here](https://www.python.org/downloads/release/python-3115/).

### Launch the application

To launch the application, you will need to run the following commands in the `app/express-app` folder and in the `app/react-app` folder (using different terminals).

```bash 
cd Sentinel1_images_processing/app/express-app
node app.js
```

```bash
cd Sentinel1_images_processing/app/react-app
npm run dev
```
At this point, the application should be running on `http://localhost:5173/`.

## Usage

When the application is running, go to `http://localhost:5173/` to have more information !
Or just read [this](https://github.com/AlexThry/Sentinel1_images_processing/tree/main/app/react-app) readme file.