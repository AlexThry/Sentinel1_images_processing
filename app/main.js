import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';
import Draw from 'ol/interaction/Draw.js';
import {createBox} from 'ol/interaction/Draw';
import WKT from 'ol/format/WKT';

// Créer une source et une couche pour les polygones
const source = new VectorSource();
const vector = new VectorLayer({
  source: source,
});

// Créer une carte
const map = new Map({
  layers: [
    new TileLayer({source: new OSM()}),
    vector  // ajouter la couche de polygones à la carte
  ],
  view: new View({
    center: [0, 0],
    zoom: 4,
  }),
  target: 'map',
});

const draw = new Draw({
  source: source,
  type: 'Circle',
  geometryFunction: createBox(),
});

map.addInteraction(draw);

draw.on('drawstart', function() {
  // Effacer toutes les entités de la source
  source.clear();
});


// Créer un format WKT pour convertir la géométrie en chaîne WKT
const wktFormat = new WKT();

draw.on('drawend', function(event) {
  // Récupérer la géométrie du dessin
  let geometry = event.feature.getGeometry();

  // Transformer la géométrie en coordonnées terrestres
  geometry = geometry.transform('EPSG:3857', 'EPSG:4326');

  // Convertir la géométrie en chaîne WKT
  const wktString = wktFormat.writeGeometry(geometry);

  // Afficher la chaîne WKT
  console.log(wktString);
});