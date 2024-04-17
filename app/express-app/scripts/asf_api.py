import asf_search as asf
import argparse
import traceback



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
        else:
            result[:args.n_max].download(path = "./data/asf_set", session=session)
        
        print("Les images ont été téléchargées avec succès.")

    except Exception as e:
        traceback.print_exc()