# Mini Workshop SNAP



## Getting started

For now no docker file is available, thus please be sure that __python3__ and __SNAP__ are installed on your computer, else you'll not be able to run the tutorial.

Once done, you have to clone the current repository :

```
git clone https://gitlab.in2p3.fr/listic/miniworkshopsnap.git
```

## Download the images

To download the data used in this mini tutorial, you have to :

* Create an account on <https://search.asf.alaska.edu/#/>
* Move to the data project directory : `cd ./miniworkshopsnap/Data/fullData/`
* Download the images : `python3 download-all-2023-05-02_14-05-28.py`

The images used in here are now available in the subfolder `fullData`. All of them are taken from copernicus program and are Sentinel-1 images recorded over the Haute-Savoie region. The parameters of the images are as follows : Ground Range Detected products (GRD), Interferometric Wide Swath (IW), VV+VH polarizations.

## First use of SNAP

This section aims at loading an image in SNAP and crop the given image with classical SNAP tools

* Open SNAP on your computer
* Drag and drop the first image in SNAP window (or use File > Open Product)
* Double click on the name of your image > Same on "Bands" > Same on "Amplitude_VV"

Here is the image we will work on in this section, as it covers an extremely wide region, we first propose to crop the image according to the following geographical coordinates :
- North latitude : 45.984
- West longitude : 6.547
- South latitude : 45.641
- East longitude : 5.471

To do so :
* Click on Raster > Subset...
* Click Geo Coordinates
* Fill the coordinates and then ok

A new image have been generated on the image window starting with "subset_". Open the resulting image to check.
Every SNAP tool can be used this way in order to process SAR, Optical and more images. Enjoy your tests !

## Use of graphs in SNAP

To resulting images can then be processed step by step without being directly saved in your computer.

In order to compute a whole processing chain and save the resulting image, we need the **Graph Processing Tool**.

* Click on the 9th icone from the left in the icone bar
* A new window appear called "Graph Builder"
* Right click on the central part
* Click Add > Raster > Subset
* Link the Read and Subset block, link the Subset and Write block

You have created your first graph, now the bottom part of the window can be used to select the parameters of each block of the graph.

Now you can parameter your graph to get the same image as before and save it localy. 

**<em>/!\ The coordinates should be set using the wkt format which is here : </em>**
**<em>POLYGON((6.547 45.984, 5.471 45.984, 5.471 45.641, 6.547 45.641, 6.547 45.984, 6.547 45.984))</em>**

Before exiting, remember to save your graph !

## Process multiple images at once

Graph builder is far better that simple tools but... we have 5 images to process with the exact same processing chain...

To do so we can use the **Batch Processing Tool**.

* Drag and drop all the images in SNAP 
* Click on the 10th icone
* Drag and drop the images in the "File Name" field
* Load the graph which you have previously saved
* Check the parameters if needed
* Click on run and wait

## What about Pythonization ?

All the previous processing were applied directly on SNAP but if you want to change the parameters of each block of the graph depending on the image, it might be boring to compute a graph for each image. To avoid such issues and to speed up the processing you might want to use the **Graph Processing Tool on Python**.

First of all let's use a more complex graph to be applied on our cropped data. The objective will be to correct the geolocalization of the extracted area through three successive processings : orbit correction, calibration and orthorectification. For the tutorial we will only parameter the input and output file names but you may want to modify other parameters depending on your application ; the steps are the same.

* Open SNAP
* Open the Graph Builder
* Create a graph with 5 blocks : 
*Read -> Apply Orbit File -> Calibration -> Terrain-correction -> Write*
* Choose the parameters and save the graph

Now we will parameter your graph as for now it is only working for a single input image.

* Open your favorite code editor
* Open the graph file
* Find the parameter you want to be variable
* Replace the name by `${name_of_your_variable}`

For this tutorial you have to modify the name of the file read in the `Read` block and the name of the file to be written in the `Write` block. Replace them respectively by `${inputFile}` and `${outputFile}`.

Now switch to Python !

The jupyter notebook file called `tuto_snap.ipynb` ends the tutorial. 

## Now enjoy processing remote sensing images