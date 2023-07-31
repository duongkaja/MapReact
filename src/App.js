import React, { useState } from "react";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Draw, Modify } from "ol/interaction";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { layer, Map as OLMap, Layers } from "react-openlayers";
import "./App.css";
import Menu from "./components/menu/Menu";

function App() {
  const [map, setMap] = useState();

  const initializeMap = () => {
    // Create a vector layer to store the drawn features
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: "#ffcc33",
          }),
        }),
      }),
    });

    // Create a map object
    const mapObject = new Map({
      target: map,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    // Add a Draw interaction to the map
    const draw = new Draw({
      source: vectorSource,
      type: "Point",
    });
    mapObject.addInteraction(draw);

    // Add a Modify interaction to the map
    const modify = new Modify({ source: vectorSource });
    mapObject.addInteraction(modify);

    // Create two Point features
    const point1 = new Point([109.120881, 12.016155]);
    const pointFeature1 = new Feature(point1);
    vectorSource.addFeature(pointFeature1);
    console.log(mapObject);
    const point2 = new Point([108.807187, 14.274039]);
    const pointFeature2 = new Feature(point2);
    vectorSource.addFeature(pointFeature2);
  };

  // Call the initializeMap function to activate the drawing and saving features on the map
  initializeMap();

  return (
    <div className="App">
      <div style={{ display: "flex" }}>
        <Menu />
        <OLMap
          view={{
            projection: "EPSG:4326",
            center: [107.84641987555096, 15.557018118480753],
            zoom: 5.8,
          }}
          style={{ height: "100vh", width: "80vw" }}
        >
          <Layers>
            <layer.Tile></layer.Tile>
          </Layers>
        </OLMap>
      </div>
    </div>
  );
}

export default App;
