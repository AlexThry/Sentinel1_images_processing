import React, { useEffect, useRef, useContext } from 'react';
import {DownloadDataContext} from "../../DataProviders/DowloadDataProvider/DowloadDataProvider.jsx";
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';
import Draw from 'ol/interaction/Draw.js';
import {createBox} from 'ol/interaction/Draw';
import WKT from 'ol/format/WKT';
import {LineString} from "ol/geom.js";
import Feature from "ol/Feature";
import {Stroke, Style} from "ol/style.js";
import {fromLonLat} from "ol/proj"

// eslint-disable-next-line react/prop-types
function AreaSelector({inputClasses, data, dataSetter, inputPolygon}) {
    const mapElement = useRef(null);


    useEffect(() => {
        const source = new VectorSource();
        const vector = new VectorLayer({
            source: source,
        });


        let map = new Map({
            layers: [
                new TileLayer({source: new OSM()}),
                vector
            ],
            view: new View({
                center: [0, 0],
                zoom: 1,
            }),
            target: mapElement.current,
        });

        const draw = new Draw({
            source: source,
            type: 'Circle',
            geometryFunction: createBox(),
        });
        draw.on('drawstart', function() {
            source.clear();
        });



        const wktFormat = new WKT();

        draw.on('drawend', function(event) {
            let geometry = event.feature.getGeometry().clone();
            let transformedGeometry = geometry.transform('EPSG:3857', 'EPSG:4326');
            let coordinates = transformedGeometry.getCoordinates();
            coordinates = coordinates.map(ring => ring.map(coord => [parseFloat(coord[0].toFixed(3)), parseFloat(coord[1].toFixed(3))]));
            transformedGeometry.setCoordinates(coordinates);
            const wktString = wktFormat.writeGeometry(transformedGeometry);
            dataSetter(wktString);
        });

        map.addInteraction(draw);

        if (inputPolygon) {
            const mapPoints = inputPolygon.map(point => fromLonLat(point));

            const lineString = new LineString(mapPoints);
            const sourceRed = new VectorSource();

            const feature = new Feature({
                geometry: lineString
            });

            feature.setStyle(new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 2
                })
            }));

            sourceRed.addFeature(feature);

            const vectorLayer = new VectorLayer({
                source: sourceRed
            });

            map.addLayer(vectorLayer);

            // Calculate the extent of the LineString
            const extent = lineString.getExtent();

            // Adjust the view to fit the extent
            map.getView().fit(extent, { padding: [10, 10, 10, 10] });
        }

        return () => {
            map.setTarget(undefined);
        };
    }, [inputPolygon]);


    return (
        <div ref={mapElement} id="map" className={inputClasses}></div>
    );
}

export default AreaSelector;