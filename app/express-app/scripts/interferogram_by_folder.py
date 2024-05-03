import argparse
import traceback
import json
import os
import datetime
import sys

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
        return zip_files
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
                # print("final command : \n ------------------ \n" + finalCmd)

                os.system(finalCmd)
#                 os.system(f'python scripts/tifToPng.py --pathTif "{tif_path + "/" + output_name + ".tif"}"')
                os.system(f'python scripts/orthoRect.py --input "{dim_path + "/" + output_name + ".dim"}" --output "{orthoRect_path + "/"}" --extension "{output_name}"')

            except IndexError:
                print("Index out of range. No more pairs to process.")
                break

    except Exception as e:
        traceback.print_exc()
        sys.exit(1)
