from operator import ne
import os
import re
import asf_search as asf
import argparse
import traceback
from shapely.geometry import shape
import json



def search_asf(poligon, date_start, date_end):
    results = asf.geo_search(
    intersectsWith=poligon,
    platform=asf.PLATFORM.SENTINEL1A,
    processingLevel=asf.PRODUCT_TYPE.SLC,
    beamSwath='IW',
    flightDirection=asf.FLIGHT_DIRECTION.DESCENDING,
    polarization=asf.POLARIZATION.VV_VH,
    start=date_start,
    end=date_end,)
    return results


if __name__ == "__main__":    
    # Créer l'objet ArgumentParser
    parser = argparse.ArgumentParser(description='Recherche des images Sentinel-1 sur ASF.')
    # Define the directory path
    dir_path = "./Data/asf_set"
    try:
        # Ajouter les arguments
        parser.add_argument('--poligon', type=str, help='Le poligon pour la recherche')
        parser.add_argument('--date_start', type=str, help='La date de début pour la recherche')
        parser.add_argument('--date_end', type=str, help='La date de fin pour la recherche')
        parser.add_argument('--n_max', type=int, help='Le nombre maximum d\'images à télécharger', default=1)
        parser.add_argument('--login', type=str, help='Login pour l\'authentification')
        parser.add_argument('--password', type=str, help='Password pour l\'authentification')

        # Parser les arguments
        args = parser.parse_args()
        
        # Créer la session
        session = asf.ASFSession().auth_with_creds(username=args.login, password=args.password)
        
        result = search_asf(args.poligon, args.date_start, args.date_end)

        
        # download the images
        if len(result) == 0:
            print("Aucune image n'a été trouvée.")
            exit(0)
        if len(result) <= args.n_max:
            result.download(path = "./Data/asf_set", session=session)
            files_to_rename = result
        else:
            result[:args.n_max].download(path = "./Data/asf_set", session=session)
            files_to_rename = result[:args.n_max]
        print("Les images ont été téléchargées avec succès.")
        
        # Loop through all downloaded files
        for file in result:
            # parse json
            json_str = json.loads(str(file))
            # Extract the geometry from the S1Product
            geometry = json_str['geometry'] # Replace with actual method
            # Convert the geometry to a shapely polygon
            polygon = shape(geometry)
            timestamp = json_str["properties"]['processingDate']  # Replace with actual method

            # Create old and new file paths
            old_file_path = os.path.join(dir_path, json_str["properties"]["fileName"])
            new_file_path = os.path.join(dir_path, f'{timestamp}_{polygon}.zip')
            # Replace all spaces in new_file_path with no space
            new_file_path = new_file_path.replace(' ', '')
            
            # Rename the file
            os.rename(old_file_path, new_file_path)

        print("Les images ont été téléchargées avec succès.")
    except Exception as e:
        traceback.print_exc()