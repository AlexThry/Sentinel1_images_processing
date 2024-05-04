import asf_search as asf
import argparse
import os
import json
from shapely.geometry import shape
import sys
from datetime import date
from datetime import datetime



if __name__ == "__main__":
    # Créer l'objet ArgumentParser
    parser = argparse.ArgumentParser(description='Télécharge des images Sentinel-1 sur ASF.')

    parser.add_argument('--selected', type=str, help="liste des index des images à télécharger")
    parser.add_argument('--login', type=str, help='Login pour l\'authentification')
    parser.add_argument('--password', type=str, help='Password pour l\'authentification')

     # Parser les arguments
    args = parser.parse_args()

    # Read the JSON file
    with open("./data/search_data_output/output.json", 'r') as f:
        images = dict(json.load(f))


    image_list = {"features": []}
    selected = list(args.selected)[1:-1]
    selected = [int(element) for element in selected if element != ","]

    for i in selected:
        image_list["features"].append(images["features"][i])

    now = datetime.now()
    formatted_now = now.strftime("%Y-%m-%d_%H-%M-%S")

    folder_name = f"{shape(image_list['features'][0]['geometry'])};{formatted_now}"
    dir_path = f"./data/asf_set/{folder_name}"
    os.makedirs(dir_path, exist_ok=True)


    # Créer la session
    try:
        session = asf.ASFSession().auth_with_creds(username=args.login, password=args.password)
    except:
        print("error,Erreur lors de la connexion")
        sys.exit(1)

    image_urls = []

    jsonData = {"folder": folder_name, "date": s    tr(date.today()), "images": {}, "polygon": image_list["features"][0]["geometry"]["coordinates"]}

    for i in range(len(image_list["features"])):

        # Extract url
        image = image_list["features"][i]
        jsonData["images"][i] = image
        image_url = image["properties"]["url"]
        image_urls.append(image_url)

    with open(dir_path + "/info.json", 'w') as f:
        json.dump(jsonData, f)


    print(image_urls)

    try:
        asf.download_urls(urls=image_urls, session=session, path = dir_path)
    except:
        print("error,Erreur lors du téléchargement")
        sys.exit(1)


    print("Les images ont été téléchargés avec succès.")