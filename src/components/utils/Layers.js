import { Tile as TileLayer } from "ol/layer.js";
import XYZ from "ol/source/XYZ";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import Overlay from "ol/Overlay.js";

const tooltipElement = document.createElement("div");
tooltipElement.className = "overlay";

export const mapLayer = new TileLayer({
  source: new XYZ({
    url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
  }),
});

export const vectorLayer = new VectorLayer({
  source: new VectorSource(),
  style: {
    "fill-color": "rgba(255, 255, 255, 0.2)",
    "stroke-color": "#FF1616",
    "stroke-width": 2,
    "circle-radius": 7,
    "circle-fill-color": "#1677FF",
  },
});

export const tooltipLayer = new Overlay({
  element: tooltipElement,
  positioning: "bottom-center",
});
