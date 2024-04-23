import asf_search as asf
import argparse
import os
import json
from shapely.geometry import shape
import sys


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


    # Define the directory path
    dir_path = "./data/asf_set"

    # Créer la session
    try:
        session = asf.ASFSession().auth_with_creds(username=args.login, password=args.password)
    except:
        print("error,Erreur lors de la connexion")
        sys.exit(1)

    image_urls = []
    for image in image_list["features"]:
        # Extract url
        image_url = image["properties"]["url"]
        image_urls.append(image_url)


    print(image_urls)

    try:
        asf.download_urls(urls=image_urls, session=session, path = dir_path)
    except:
        print("error,Erreur lors du téléchargement")
        sys.exit(1)

    # Extract the geometry from the S1Product
    geometry = image['geometry'] # Replace with actual method
    # Convert the geometry to a shapely polygon
    polygon = shape(geometry)
    timestamp = image["properties"]['processingDate']  # Replace with actual method

    # Create old and new file paths
    old_file_path = os.path.join(dir_path, image["properties"]["fileName"])
    new_file_path = os.path.join(dir_path, f'{timestamp}_{polygon}.zip')

    # Replace all spaces in new_file_path with no space
    new_file_path = new_file_path.replace(' ', '_')
    new_file_path = new_file_path.replace('\\', '/')
    new_file_path = new_file_path.replace(':', '')

    print(new_file_path)
    # Rename the file
    os.rename(old_file_path, new_file_path)
    print("Les images ont été téléchargés avec succès.")