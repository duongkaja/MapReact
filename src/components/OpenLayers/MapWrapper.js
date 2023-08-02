import React, { useState, useRef, useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

function MapWrapper(props) {
  // set intial state - used to track references to OpenLayers
  // objects for use in hooks, event handlers, etc.
  const [map, setMap] = useState();
  // get ref to div element - OpenLayers will render into this div
  const mapElement = useRef();

  // initialize map on first render
  useEffect(() => {
    // create map
    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          }),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    // save map reference to state
    setMap(initialMap);
  }, []);

  return (
    <div
      ref={mapElement}
      className="map-container"
      style={{ height: "100vh", width: "90vw" }}
    ></div>
  );
}

export default MapWrapper;
