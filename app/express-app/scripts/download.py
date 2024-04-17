import asf_search as asf
import argparse
import os
import json
from shapely.geometry import shape




if __name__ == "__main__":    
    # Créer l'objet ArgumentParser
    parser = argparse.ArgumentParser(description='Télécharge des images Sentinel-1 sur ASF.')
    
    parser.add_argument('--jsonFile', type=str, help="Path to the JSON file containing the list of images to download")
    parser.add_argument('--login', type=str, help='Login pour l\'authentification')
    parser.add_argument('--password', type=str, help='Password pour l\'authentification')
    
     # Parser les arguments
    args = parser.parse_args()
    
        # Read the JSON file
    with open(args.jsonFile, 'r') as f:
        image_list = json.load(f)
    
    
    # Define the directory path
    dir_path = "../data/asf_set"
 
    # Créer la session
    session = asf.ASFSession().auth_with_creds(username=args.login, password=args.password)
    for image in image_list["features"]:
         # Extract url
        image_url = image["properties"]["url"]

        asf.download_url(url=image_url, session=session, path = dir_path)
        
        # Extract the geometry from the S1Product
        geometry = image['geometry'] # Replace with actual method
        # Convert the geometry to a shapely polygon
        polygon = shape(geometry)
        timestamp = image["properties"]['processingDate']  # Replace with actual method

        # Create old and new file paths
        old_file_path = os.path.join(dir_path, image["properties"]["fileName"])
        new_file_path = os.path.join(dir_path, f'{timestamp}_{polygon}.zip')
        
        # Replace all spaces in new_file_path with no space
        new_file_path = new_file_path.replace(' ', '')
        new_file_path = new_file_path.replace('\\', '/')
        new_file_path = new_file_path.replace(':', '')
        
        print(new_file_path)
        # Rename the file
        os.rename(old_file_path, new_file_path)
    print("Les images ont été téléchargés avec succés.")