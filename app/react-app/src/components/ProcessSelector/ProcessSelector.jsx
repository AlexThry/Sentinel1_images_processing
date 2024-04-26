import {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {ProcessDataContext} from "../ProcessDataProvider/ProcessDataProvider.jsx";

function ProcessSelector({setImagePack}) {

    const {downloaded, setDownloaded, previewPolygon, setPreviewPolygon} = useContext(ProcessDataContext)
    const [downloadedLoaded, setDownloadedLoaded] = useState(false)

    function transformCoordinates(coordString) {
        let coordArray = coordString.split(',');

        let pairsArray = [];
        for (let i = 0; i < coordArray.length; i += 2) {
            let pair = [coordArray[i], coordArray[i + 1]];
            pairsArray.push(pair);
        }

        return pairsArray; // Retourne [[x1,y1], [x2,y2], [x3,y3]]
    }

    useEffect(() => {
        fetchDownloaded(setDownloaded, setDownloadedLoaded)
    }, [])


    const handleRadioChange = (event) => {
        let coordinates = transformCoordinates(event.target.value)
        setPreviewPolygon(coordinates)
        setImagePack(event.target.dataset.image)
    }

    return (
        <>
            {!downloadedLoaded && (
                <span className={"loading loading-spinner loading-lg"}></span>
            )}
            {downloadedLoaded && downloaded.length == 0 && (
                <h1 className={"py-4 text-xl font-bold text-center"}>Veuillez télécharger des images</h1>
            )}
            {downloadedLoaded && (
                <>
                    <h1 className={"text-2xl font-bold mb-4"}>Choix des données à traiter</h1>
                    <div className="overflow-x-auto max-h-80 overflow-y-scroll">
                        <table className={"table"}>
                            <thead>
                            <tr>
                                <td>Téléchargé le</td>
                                <td>Taille</td>
                                <td>Infos</td>
                                <td></td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                Object.keys(downloaded).map((key, index) => {
                                    let date = downloaded[key]["date"]
                                    let nbImages = Object.keys(downloaded[key]).length - 1
                                    let polygone = downloaded[key]["polygon"]
                                    return (
                                        <tr key={index}>
                                            <td>{date}</td>
                                            <td>{nbImages}</td>
                                            <td><Link to={`${index}`} className={"hover:text-blue-500 hover:underline"}>Voir
                                                plus -&gt;</Link></td>
                                            <td><input type="radio" name={"selection"} className={"radio"} value={polygone}
                                                       onChange={handleRadioChange} data-image={downloaded[key]["folder"]}/></td>
                                        </tr>
                                    )
                                })

                            }
                            </tbody>
                        </table>

                    </div>
                </>
                )
            }

        </>
    )

}

export default ProcessSelector;

async function fetchDownloaded(setDownloaded, setDownloadedLoaded) {
    const url = "http://localhost:8080/downloaded";

    await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            setDownloaded(data)
            setDownloadedLoaded(true)
        })
}