import os
from tqdm import tqdm
import argparse
import cv2
import rioxarray
import numpy as np

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='separtes the 3 channels on a tif image and it gives back 3 pngs (one for each channel)')

    parser.add_argument('--pathTif', help='Absolute Path to tif image.', required=True)
    parser.add_argument('--outputPathPng', help='Absolute Path to directory where the files .png will be saved after the process', required=True)

    args = parser.parse_args()

    f = os.path.basename(args.pathTif)

    im = rioxarray.open_rasterio(args.pathTif).data

    im1 = im[0]
    mean1 = im1.mean()
    std1 = im1.std()
    im1 = np.clip(im1, mean1 - 3 * std1, mean1 + 3 * std1)
    im_normalized1 = (im1 - np.min(im1)) / (np.max(im1) - np.min(im1))
    im_scaled1 = (255 * im_normalized1).astype(np.uint8)
    print(args.outputPathPng + f.replace(".tif", "_VH.png"))
    cv2.imwrite(args.outputPathPng + "/" + f.replace(".tif", "_i.png"), im_scaled1)

    im2 = im[1]
    mean2 = im2.mean()
    std2 = im2.std()
    im2 = np.clip(im2, mean2 - 3 * std2, mean2 + 3 * std2)
    im_normalized2 = (im2 - np.min(im2)) / (np.max(im2) - np.min(im2))
    im_scaled2 = (255 * im_normalized2).astype(np.uint8)
    cv2.imwrite(args.outputPathPng + "/" + f.replace(".tif", "_q.png"), im_scaled2)

    
    im3 = im[2]
    mean2 = im3.mean()
    std2 = im3.std()
    im3 = np.clip(im3, mean2 - 3 * std2, mean2 + 3 * std2)
    im_normalized2 = (im3 - np.min(im3)) / (np.max(im3) - np.min(im3))
    im_scaled2 = (255 * im_normalized2).astype(np.uint8)
    cv2.imwrite(args.outputPathPng + "/" + f.replace(".tif", "_coh.png"), im_scaled2)