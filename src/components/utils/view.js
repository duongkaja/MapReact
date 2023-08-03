import { transform } from "ol/proj.js";
import View from "ol/View.js";

export const view = new View({
  center: transform(
    [107.84641987555096, 15.557018118480753],
    "EPSG:4326",
    "EPSG:3857"
  ),
  zoom: 5.8,
});
