import { mapLayer, vectorLayer } from "../utils/Layers";
import Draw from "ol/interaction/Draw";

export const pointerMoveEvent = (map, overlayElement, overlay) => {
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
};

export const createDrawType = (drawType) => {
  const draw = new Draw({
    type: drawType,
    source: vectorLayer.getSource(),
  });
  return draw;
};

export const drawEndEvent = (draw) => {
  draw.on("drawend", (event) => {
    const feature = event.feature;
    const geometry = feature.getGeometry();
    const lengthInMeters = geometry.getLength();
    console.log(`Length of drawn line: ${lengthInMeters} meters`);
  });
};
