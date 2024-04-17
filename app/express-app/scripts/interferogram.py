import argparse
import traceback
import json
import os

if __name__ == "__main__":    

    xmlGraph = './interferogram_final.xml'
    outputPath = "./newSubset/"
    snapExecutablePath = "gpt"
    parametersPath = "./parameters.json"

    # Créer l'objet ArgumentParser
    parser = argparse.ArgumentParser(description="Etude d'interferografie   avec snap.")

    try:
        # Ajouter les arguments
        # parser.add_argument('--parameters', type=str, help="Path vers le dictionaire(json) des parameters pour l'interferogramme")
        parser.add_argument('--outputName', type=str, help="Nom pour l'output de l'image")

        # Parser les arguments
        args = parser.parse_args()
                        
        try:
            # Open the JSON file in read mode
            with open(parametersPath, 'r') as json_file:
                # Load the JSON data into a dictionary
                data_dict = json.load(json_file)

        except FileNotFoundError:
            print(f"Error: The file '{parametersPath}' not found.")

        except json.JSONDecodeError as e:
            print(f"Error: JSON decoding failed. {e.msg}")


        data_dict["outputFile"] = outputPath+args.outputName

        paramLine = ""
        for k in data_dict.keys():
            paramLine += f" -P{k}=\"{data_dict[k]}\""


        finalCmd = f"{snapExecutablePath} {xmlGraph} {paramLine}"
        os.system(f"{snapExecutablePath} {xmlGraph} {paramLine}")
        

    except Exception as e:
        traceback.print_exc()