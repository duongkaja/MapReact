import { vectorLayer } from "../utils/Layers";
import Draw from "ol/interaction/Draw";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import { LineString, Polygon } from "ol/geom.js";
import { formatArea, formatLength } from "./utils";
import { Modify } from "ol/interaction.js";

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
  return modify
};

export const drawStartEvent = (
  draw,
  sketch,
  measureTooltipElement,
  measureTooltip,
  listener
) => {
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

export const drawEndEvent = (draw) => {
  draw.on("drawend", (event) => {
    const feature = event.feature;
    const geometry = feature.getGeometry();
    const lengthInMeters = geometry.getLength();
    console.log(`Length of drawn line: ${lengthInMeters} meters`);
  });
};
