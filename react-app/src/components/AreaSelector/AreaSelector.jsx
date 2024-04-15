import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';
import Draw from 'ol/interaction/Draw.js';
import {createBox} from 'ol/interaction/Draw';
import WKT from 'ol/format/WKT';
import classes from "./AreaSelector.module.scss"

function AreaSelector({inputStyle}) {
    const mapElement = useRef(null); // reference to the div element to render map

    useEffect(() => {
        const source = new VectorSource();
        const vector = new VectorLayer({
            source: source,
        });

        // Create a map
        const map = new Map({
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
            let geometry = event.feature.getGeometry();
            geometry = geometry.transform('EPSG:3857', 'EPSG:4326');
            const wktString = wktFormat.writeGeometry(geometry);
            console.log(wktString);
        });

        map.addInteraction(draw);

        return () => {
            map.setTarget(undefined);
        };
    }, []);
    return (
        <div ref={mapElement} id="map" className={classes.map} style={inputStyle}></div>
    );
}

export default AreaSelector;