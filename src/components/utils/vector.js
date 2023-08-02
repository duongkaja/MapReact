import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Stroke, Style } from "ol/style";

export const vectorLayer = new VectorLayer({
  source: new VectorSource(),
  style: new Style({
    stroke: new Stroke({
      color: "#ff0000",
      width: 4,
    }),
  }),
});


// const source = new VectorSource();
// export const vectorLayer = new VectorLayer({
//   source: source,
//   style: {
//     "fill-color": "rgba(255, 255, 255, 0.2)",
//     "stroke-color": "#fd0101",
//     "stroke-width": 3,
//     "circle-radius": 7,
//     "circle-fill-color": "#ffcc33",
//   },
// });

// var source = new VectorSource({wrapX: false});

// // vector is a layer of type Vector, not a source !
// export const vectorLayer = new VectorLayer({
//     source: source
// });