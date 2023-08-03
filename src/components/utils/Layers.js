import { Tile as TileLayer } from "ol/layer.js";
import XYZ from "ol/source/XYZ";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Stroke, Style } from "ol/style";
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
  style: new Style({
    stroke: new Stroke({
      color: "#ff0000",
      width: 4,
    }),
  }),
});

export const tooltipLayer = new Overlay({
  element: tooltipElement,
  positioning: "bottom-center",
});
