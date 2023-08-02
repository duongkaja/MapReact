import React, { useEffect, useRef } from "react";
import Map from "ol/Map.js";
import View from "ol/View.js";
import OLGoogleMaps from "olgm/OLGoogleMaps.js";
import GoogleLayer from "olgm/layer/Google.js";
import { defaults as defaultInteractions } from "olgm/interaction.js";
import { transform } from "ol/proj.js";
import { OSM, Vector as VectorSource } from "ol/source.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { Draw, Modify, Snap } from "ol/interaction.js";

const GoogleMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      const osmSource = new OSM({
        attributions: [], // Clear default attributions
      });

      const map = new Map({
        // use OL3-Google-Maps recommended default interactions
        interactions: defaultInteractions({
          altShiftDragRotate: false,
          pinchRotate: false,
        }),
        layers: [
          new TileLayer({
            source: osmSource, //*  An OpenStreetMap layer providing the base map tiles
          }),
        ],
        target: "map",
        view: new View({
          center: transform(
            [107.84641987555096, 15.557018118480753],
            "EPSG:4326",
            "EPSG:3857"
          ),
          zoom: 5.8,
        }),
      });

      mapRef.current = map;
    }
  }, []);

  return (
    <div id="map" style={{ height: "100vh", width: "80vw" }}>
      {/* Add custom CSS to hide the zoom buttons and rotate reset button */}
      <style>
        {`
          .ol-zoom, .ol-rotate-reset {
            display: none !important;
          }
        `}
      </style>
    </div>
  );
};

export default GoogleMap;
