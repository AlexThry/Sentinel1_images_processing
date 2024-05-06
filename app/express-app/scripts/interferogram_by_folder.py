import argparse
import traceback
import json
import os
import datetime
import sys
import argparse
import numpy as np
from PIL import Image
import rioxarray
import shutil
from datetime import date
import shlex
import subprocess




def convert_date(date_str):
        date_obj = datetime.datetime.strptime(date_str, "%Y%m%d")
        return date_obj.strftime("%d%b%Y")


def generate_txt_name(image1, image2, subwath, polarization):
    try:
        date1 = image1[17:25]
        date2 = image2[17:25]
        formatted_date1 = convert_date(date1)
        formatted_date2 = convert_date(date2)
        output_str = f"{subwath}_{polarization}_{formatted_date1}_{formatted_date2}"
        return output_str
    except IndexError:
        print("Error: Invalid image filenames.")
        sys.exit(1)

def get_zip_files(directory):
    try:
        zip_files = [file for file in os.listdir(directory) if file.endswith(".zip")]
        sorted_list = sorted(zip_files, key=lambda x: x.split('_')[5])
        return sorted_list
    except FileNotFoundError:
        print("Error: Directory not found.")
        sys.exit(1)

def check_and_create_directory(directory):
    try:
        if not os.path.exists(directory):
            os.makedirs(directory)
    except OSError:
        print("Error: Failed to create directory.")
        sys.exit(1)

def get_index_interferogram(name):
     if os.path.exists(outputPathDim):
        files = os.listdir(outputPathDim)
        count = sum(1 for file in files if file.startswith(name))
        return count
     else:
         return 0


if __name__ == "__main__":
    try:
        with open("scripts/gpt_path.txt") as f:
            snapExecutablePath = f.read()

        xmlGraph = 'xml/interferogram_final.xml'
        outputPathTif = "data/interferometric_image/tif/"
        outputPathDim = "data/interferometric_image/dim/"
        outputOrthoRectPath = "data/orthorectification/"
        parametersPath = "scripts/parameters_group.json"
        rawImagesLocation = "data/asf_set/"

        # Créer l'objet ArgumentParser
        parser = argparse.ArgumentParser(description="Etude d'interferografie avec snap.")

        args = parser.parse_args()
        data_dict = {}

        try:
            with open(parametersPath, 'r') as json_file:
                data_dict = json.load(json_file)
                print(data_dict)
                print("Parameters loaded")
        except FileNotFoundError:
            print(f"Error: The file '{parametersPath}' not found.")
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"Error: JSON decoding failed. {e.msg}")
            sys.exit(1)

        folder_name = data_dict["folder"]
        directory_path = rawImagesLocation + folder_name + "/"
        images_list = get_zip_files(directory_path)
        with open(directory_path + "info.json", "r") as f:
            json_folder_info = json.load(f)
        json_folder_info["date"] = str(date.today())
        json_folder_info["polygon"] = data_dict["polygon"]
        json_folder_info["images"] = {"interferometric": {"coh": [], "i": [], "q": [] }, "orthorectification": {"coh": [], "phase": [] } }
        json_folder_info["processName"] = data_dict["processName"]

        index = get_index_interferogram(folder_name)
        folder_name = folder_name + "_" + str(index)
        json_folder_info["folder"] = folder_name

        for image_ind in range(len(images_list)):
            try:
                image1 = images_list[image_ind]
                image2 = images_list[image_ind + 1]

                output_name = generate_txt_name(image1, image2, data_dict["subswath"], "VV")

                tif_path = outputPathTif + folder_name + "/" + output_name
                dim_path = outputPathDim + folder_name + "/" + output_name
                orthoRect_path = outputOrthoRectPath + folder_name + "/" + output_name

                check_and_create_directory(tif_path)
                check_and_create_directory(dim_path)
                check_and_create_directory(orthoRect_path)

                data_dict["outputFile1"] = tif_path + "/" + output_name + ".tif"
                data_dict["outputFile2"] = dim_path + "/" + output_name + ".dim"

                paramLine = ""

                data_dict["inputFile1"] = directory_path + image1
                data_dict["inputFile2"] = directory_path + image2

                for k in data_dict.keys():
                    paramLine += f" -P{k}=\"{data_dict[k]}\""

                finalCmd = f"{snapExecutablePath} {xmlGraph} {paramLine}"
#                 os.system(finalCmd)
                finalCmd_list = shlex.split(finalCmd)
                subprocess.run(finalCmd_list, check=True)

                # print("final command : \n ------------------ \n" + finalCmd)

                f = os.path.basename(tif_path + "/" + output_name + ".tif")
                output_path = os.path.dirname(tif_path + "/" + output_name + ".tif")

                im = rioxarray.open_rasterio(tif_path + "/" + output_name + ".tif").data

                im0 = im[0]
                mean0 = im0.mean()
                std0 = im0.std()
                im0 = np.clip(im0, mean0 - 3 * std0, mean0 + 3 * std0)
                im_normalized0 = (im0 - np.min(im0)) / (np.max(im0) - np.min(im0))
                im_scaled0 = (255 * im_normalized0).astype(np.uint8)
                im0Path = output_path + "/" + f.replace(".tif", "_i.png")
                Image.fromarray(im_scaled0).save(im0Path)
                json_folder_info["images"]["interferometric"]["i"].append(im0Path)

                im1 = im[1]
                mean1 = im1.mean()
                std1 = im1.std()
                im1 = np.clip(im1, mean1 - 3 * std1, mean1 + 3 * std1)
                im_normalized1 = (im1 - np.min(im1)) / (np.max(im1) - np.min(im1))
                im_scaled1 = (255 * im_normalized1).astype(np.uint8)
                im1Path = output_path + "/" + f.replace(".tif", "_q.png")
                Image.fromarray(im_scaled1).save(im1Path)
                json_folder_info["images"]["interferometric"]["q"].append(im1Path)


                im2 = im[2]
                mean2 = im2.mean()
                std2 = im2.std()
                im2 = np.clip(im2, mean2 - 3 * std2, mean2 + 3 * std2)
                im_normalized2 = (im2 - np.min(im2)) / (np.max(im2) - np.min(im2))
                im_scaled2 = (255 * im_normalized2).astype(np.uint8)
                im2Path = output_path + "/" + f.replace(".tif", "_coh.png")
                Image.fromarray(im_scaled2).save(im2Path)
                json_folder_info["images"]["interferometric"]["coh"].append(im2Path)



#                 os.system(f'source venv/bin/activate')
#                 os.system(f'python scripts/tifToPng.py --pathTif "{tif_path + "/" + output_name + ".tif"}"')
#                 os.system(f'python scripts/orthoRect.py --input "{dim_path + "/" + output_name + ".dim"}" --output "{orthoRect_path + "/"}" --extension "{output_name}"')
                subprocess.run(["python", "scripts/orthoRect.py", "--input", f"{dim_path}/{output_name}.dim", "--output", f"{orthoRect_path}/", "--extension", f"{output_name}"], check=True)


                im3 = rioxarray.open_rasterio(orthoRect_path + "/" + output_name + "_coh.tif").data[0]
                mean3 = im3.mean()
                std3 = im3.std()
                im3 = np.clip(im3, mean3 - 3 * std3, mean3 + 3 * std3)
                im_normalized3 = (im3 - np.min(im3)) / (np.max(im3) - np.min(im3))
                im_scaled3 = (255 * im_normalized3).astype(np.uint8)
                im3Path = orthoRect_path + "/" + f.replace(".tif", "_coh.png")
                Image.fromarray(im_scaled3).save(im3Path)
                json_folder_info["images"]["orthorectification"]["coh"].append(im3Path)

                im4 = rioxarray.open_rasterio(orthoRect_path + "/" + output_name + "_phase.tif").data[0]
                mean4 = im4.mean()
                std4 = im4.std()
                im4 = np.clip(im4, mean4 - 3 * std4, mean4 + 3 * std4)
                im_normalized4 = (im4 - np.min(im4)) / (np.max(im4) - np.min(im4))
                im_scaled4 = (255 * im_normalized4).astype(np.uint8)
                im4Path = orthoRect_path + "/" + f.replace(".tif", "_phase.png")
                Image.fromarray(im_scaled4).save(im4Path)
                json_folder_info["images"]["orthorectification"]["phase"].append(im4Path)

            except IndexError:
                print("Index out of range. No more pairs to process.")
                break

        with open("./data/interferometric_image/tif/" + folder_name + "/info.json", "w") as f:
            json.dump(json_folder_info, f)
        with open("./data/orthorectification/" + folder_name + "/info.json", "w") as f:
            json.dump(json_folder_info, f)

    except Exception as e:
        traceback.print_exc()
        sys.exit(1)
