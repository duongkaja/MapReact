import { vectorLayer } from "../utils/Layers";
import Draw from "ol/interaction/Draw";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import { LineString, Polygon } from "ol/geom.js";
import { formatArea, formatLength } from "./utils";
import { Modify } from "ol/interaction.js";
import { unByKey } from "ol/Observable.js";
import Overlay from "ol/Overlay.js";

let listener;
let sketch; // Currently drawn feature. @type {import("../src/ol/Feature.js").default}
let measureTooltipElement; // The measure tooltip element.
let measureTooltip; // Overlay to show the measurement.

export const createDrawType = (drawType) => {
  const draw = new Draw({
    type: drawType,
    source: vectorLayer.getSource(),
    style: new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
      stroke: new Stroke({
        color: "red",
        lineDash: [10, 10],
        width: 2,
      }),
      //* circle follow the mouse
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.7)",
        }),
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
      }),
    }),
  });
  return draw;
};

/**
 * edit line after drawed
 * @param {*} source from the source Vector
 * @returns modify object
 */
export const EditDrawLine = (source) => {
  const modify = new Modify({ source: source });
  return modify;
};

export const drawStartEvent = (draw) => {
  draw.on("drawstart", function (evt) {
    // set sketch
    sketch = evt.feature;

    /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
    let tooltipCoord = evt.coordinate;

    listener = sketch.getGeometry().on("change", function (evt) {
      const geom = evt.target;
      let output;
      if (geom instanceof Polygon) {
        output = formatArea(geom);
        tooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (geom instanceof LineString) {
        output = formatLength(geom);
        tooltipCoord = geom.getLastCoordinate();
      }
      measureTooltipElement.innerHTML = output;
      // console.log(output);
      measureTooltip.setPosition(tooltipCoord);
    });
  });
};

export const drawEndEvent = (draw, map) => {
  draw.on("drawend", function () {
    measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
    measureTooltip.setOffset([0, -7]);
    // unset sketch
    sketch = null;
    // unset tooltip so that a new one can be created
    measureTooltipElement = null;
    createMeasureTooltip(map);
    unByKey(listener);
  });
};

export const createMeasureTooltip = (map) => {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement("div");
  measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
  measureTooltip = new Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: "bottom-center",
    stopEvent: false,
    insertFirst: false,
  });
  map.addOverlay(measureTooltip);
}


export const Interactions = () => {
  return (
    <div>Interactions</div>
  )
}
