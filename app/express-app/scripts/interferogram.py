import argparse
import traceback
import json
import os

if __name__ == "__main__":    

    xmlGraph = 'xml/interferogram_final.xml'
    outputPathTif = "data/interferometric_image/tif/"
    outputPathDim = "data/interferometric_image/dim/"
    snapExecutablePath = "/Applications/snap/bin/gpt"
    parametersPath = "scripts/parameters.json"
    rawImagesLocation = "data/asf_set/"

    # Créer l'objet ArgumentParser
    parser = argparse.ArgumentParser(description="Etude d'interferografie avec snap.")

    try:
        # Ajouter les arguments
        # parser.add_argument('--parameters', type=str, help="Path vers le dictionaire(json) des parameters pour l'interferogramme")
        parser.add_argument('--outputName', type=str, help="Nom pour l'output de l'image")

        # Parser les arguments
        args = parser.parse_args()
        data_dict = {}
        try:
            # Open the JSON file in read mode
            with open(parametersPath, 'r') as json_file:
                # Load the JSON data into a dictionary
                data_dict = json.load(json_file)
                print("parameters loaded")

        except FileNotFoundError:
            print(f"Error: The file '{parametersPath}' not found.")

        except json.JSONDecodeError as e:
            print(f"Error: JSON decoding failed. {e.msg}")


        data_dict["outputFile1"] = outputPathTif + args.outputName + ".tif"
        data_dict["outputFile2"] = outputPathDim + args.outputName + ".dim"

        paramLine = ""
        data_dict["inputFile1"] = rawImagesLocation + data_dict["inputFile1"]
        data_dict["inputFile2"] = rawImagesLocation + data_dict["inputFile2"]
        print(data_dict)
        for k in data_dict.keys():
            paramLine += f" -P{k}=\"{data_dict[k]}\""


        finalCmd = f"{snapExecutablePath} {xmlGraph} {paramLine}"
        print("final command : \n ------------------ \n" + finalCmd)
        os.system(finalCmd)
        

    except Exception as e:
        traceback.print_exc()