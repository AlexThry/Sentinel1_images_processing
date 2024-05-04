import Modal from "../Modal/Modal.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import {DownloadDataContext} from "../../DataProviders/DowloadDataProvider/DowloadDataProvider.jsx";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Polygon from 'ol/geom/Polygon';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {fromLonLat} from 'ol/proj';


function DownloadDetails() {
    const {images} = useContext(DownloadDataContext);
    let { id } = useParams();
    const mapElement = useRef(null);

    useEffect(() => {
        let coords = images.features[id].geometry.coordinates["0"]

        let map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                zoom: 13
            }),
        });

        let polygonCoords = [
            fromLonLat(coords[0]),
            fromLonLat(coords[1]),
            fromLonLat(coords[2]),
            fromLonLat(coords[3])
        ];

        let polygon = new Polygon([polygonCoords]);

        let feature = new Feature(polygon);
        let vectorSource = new VectorSource({
            features: [feature]
        });
        var vectorLayer = new VectorLayer({
            source: vectorSource
        });
        map.addLayer(vectorLayer);
        map.getView().fit(polygon.getExtent());
        map.getInteractions().forEach(x => x.setActive(false));

        return () => {
            map.setTarget(undefined);
        }
    }, []);




    return (
        <>
            <Modal>
                <div className={"h-[80vh] w-[60vw] mockup-window border bg-white rounded-2xl shadow-xl relative overflow-hidden"}>
                    <Link to={".."} className={"absolute top-5 left-[1.4rem] h-3 w-3 bg-red-600 rounded-full z-30 hover:bg-red-700"}>

                    </Link>
                    <div className={"px-10 max-h-full overflow-y-scroll"}>
                        <div>
                            <div>
                                <h1 className={"font-bold"}>Aperçu</h1>
                                <div id="map" ref={mapElement} className={"h-[200px] my-4 rounded-lg overflow-hidden shadow"}></div>
                            </div>
                            <div>
                                <h1 className={"font-bold"}>Coordonnées</h1>
                                <table className={"table w-full"}>
                                    <thead>
                                    <tr>
                                        <td></td>
                                        <td className={"text-center"}>Longitude</td>
                                        <td className={"text-center"}>Latitude</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {images.features[id].geometry.coordinates["0"].slice(0, -1).map((coordinate, index) => (
                                        <tr key={index}>
                                            <th>{index}</th>
                                            <td className={"text-center"}>{coordinate[0]}</td>
                                            <td className={"text-center"}>{coordinate[1]}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h1 className={"font-bold"}>Propriétés</h1>
                                <table className={"table max-w-full"}>
                                    <thead>
                                    <tr>
                                        <td className={"text-center"}>Propriété</td>
                                        <td className={"text-center"}>Valeur</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Object.keys(images.features[id].properties).map((property, index) => (
                                        <tr key={index}>
                                            <td className={"text-center"}>{property}</td>
                                            <td className={"text-center max-w-32 break-words"}>{images.features[id].properties[property]}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                            </div>

                        </div>
                    </div>

                </div>

            </Modal>
        </>
    )
}

export default DownloadDetails;