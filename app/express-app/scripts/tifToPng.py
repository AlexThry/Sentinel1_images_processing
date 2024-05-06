import os
import argparse
import numpy as np
from PIL import Image
import rioxarray

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Separates the 3 channels on a tif image and gives back 2 pngs (one for each channel)')

    parser.add_argument('--pathTif', help='Absolute Path to tif image.', required=True)

    args = parser.parse_args()

    f = os.path.basename(args.pathTif)
    output_path = os.path.dirname(args.pathTif)

    im = rioxarray.open_rasterio(args.pathTif).data

    im0 = im[0]
    mean0 = im0.mean()
    std0 = im0.std()
    im0 = np.clip(im0, mean0 - 3 * std0, mean0 + 3 * std0)
    im_normalized0 = (im0 - np.min(im0)) / (np.max(im0) - np.min(im0))
    im_scaled0 = (255 * im_normalized0).astype(np.uint8)
    Image.fromarray(im_scaled0).save(output_path + "/" + f.replace(".tif", "_i.png"))

    im1 = im[1]
    mean1 = im1.mean()
    std1 = im1.std()
    im1 = np.clip(im1, mean1 - 3 * std1, mean1 + 3 * std1)
    im_normalized1 = (im1 - np.min(im1)) / (np.max(im1) - np.min(im1))
    im_scaled1 = (255 * im_normalized1).astype(np.uint8)
    Image.fromarray(im_scaled1).save(output_path + "/" + f.replace(".tif", "_q.png"))

    im2 = im[2]
    mean2 = im2.mean()
    std2 = im2.std()
    im2 = np.clip(im2, mean2 - 3 * std2, mean2 + 3 * std2)
    im_normalized2 = (im2 - np.min(im2)) / (np.max(im2) - np.min(im2))
    im_scaled2 = (255 * im_normalized2).astype(np.uint8)
    Image.fromarray(im_scaled2).save(output_path + "/" + f.replace(".tif", "_coh.png"))
