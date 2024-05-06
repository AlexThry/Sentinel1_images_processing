import argparse
import traceback
import os

if __name__ == "__main__":    

    xmlGraph = 'xml/OrthorectGraph_final.xml'
    with open("scripts/gpt_path.txt") as f:
        snapExecutablePath = f.read()

    # Créer l'objet ArgumentParser
    parser = argparse.ArgumentParser(description="Ortho rectification avec snap d'un image .dim.")

    try:
        # Ajouter les arguments
        # parser.add_argument('--parameters', type=str, help="Path vers le dictionaire(json) des parameters pour l'interferogramme")
        parser.add_argument('--input', type=str, help="Path pour l'image dim a orthorectifier")
        parser.add_argument('--output', type=str, help="Path pour souvegarder la nouvelle image")
        parser.add_argument('--extension', type=str, help="Nom des bands generes à partir des l'interferogramme")

        # Parser les arguments
        args = parser.parse_args()
        outputPath = args.output


        data_dict = {
            "inputFile": args.input,
            "outputFilePha": outputPath+args.extension+"_phase.tif",
            "outputFileCoh": outputPath+args.extension+"_coh.tif",
            "extension": args.extension
        }
        paramLine = ""
        for k in data_dict.keys():
            paramLine += f" -P{k}=\"{data_dict[k]}\""


        finalCmd = f"{snapExecutablePath} {xmlGraph} {paramLine}"
        os.system(f"{snapExecutablePath} {xmlGraph} {paramLine}")
        

    except Exception as e:
        traceback.print_exc()