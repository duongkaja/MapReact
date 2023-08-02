import React, { useState, useEffect, useRef } from "react";
import { Menu } from "antd";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Overlay from "ol/Overlay.js";
import { defaults as defaultInteractions } from "olgm/interaction.js";
import { transform } from "ol/proj.js";
import { Tile as TileLayer } from "ol/layer.js";
import XYZ from "ol/source/XYZ";
import Draw from "ol/interaction/Draw";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Stroke, Style } from "ol/style";
import "./GoogleMap.css";

const GoogleMap = () => {
  const [drawEnabled, setDrawEnabled] = useState(false);
  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = new Map({
        interactions: defaultInteractions({
          altShiftDragRotate: false,
          pinchRotate: false,
        }),
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
            }),
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

      // Create an overlay to display the length of the drawn line
      const overlayElement = document.createElement("div");
      overlayElement.className = "overlay";
      const overlay = new Overlay({
        element: overlayElement,
        positioning: "bottom-center",
      });
      map.addOverlay(overlay);
      overlayRef.current = overlay;

      mapRef.current = map;
      // Create a vector layer to display the drawn features
      const vectorLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
          stroke: new Stroke({
            color: "#ff0000",
            width: 2,
          }),
        }),
      });
      // Add the vector layer to the map
      map.addLayer(vectorLayer);
      // Create a Draw interaction to draw lines on the map
      const draw = new Draw({
        type: "LineString",
        source: vectorLayer.getSource(),
      });
      // Listen for the drawend event to calculate the length of the drawn line
      draw.on("drawend", (event) => {
        const feature = event.feature;
        const geometry = feature.getGeometry();
        const lengthInMeters = geometry.getLength();
        console.log(`Length of drawn line: ${lengthInMeters} meters`);
      });
      drawRef.current = draw;

      // Listen for pointermove events on the map to display the length of the drawn line
      map.on("pointermove", (event) => {
        if (event.dragging) {
          return;
        }
        const pixel = map.getEventPixel(event.originalEvent);
        const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);
        if (feature) {
          const geometry = feature.getGeometry();
          if (geometry.getType() === "LineString") {
            const lengthInMeters = geometry.getLength();
            const lengthInKilometers = lengthInMeters / 1000;
            overlayElement.innerHTML = `${lengthInKilometers.toFixed(2)} km`;
            overlay.setPosition(event.coordinate);
          }
        } else {
          overlay.setPosition(undefined);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (drawEnabled) {
      mapRef.current.addInteraction(drawRef.current);
    } else {
      mapRef.current.removeInteraction(drawRef.current);
    }
  }, [drawEnabled]);

  return (
    <>
      <div id="map" style={{ height: "100vh", width: "100vw" }}>
        <style>
          {`
            .ol-zoom, .ol-rotate-reset {
              display: none !important;
            }
            
            .overlay {
              background-color: white;
              border-radius: 4px;
              padding: 4px 8px;
              opacity: 0.8;
            }
          `}
        </style>
        <Menu mode="horizontal" className="menu">
          <Menu.Item key="draw" onClick={() => setDrawEnabled(!drawEnabled)}>
            {drawEnabled ? "Hủy vẽ" : "Nhấp để vẽ"}
          </Menu.Item>
        </Menu>
      </div>
    </>
  );
};

export default GoogleMap;
