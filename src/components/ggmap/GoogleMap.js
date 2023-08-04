import React, { useState, useEffect, useRef } from "react";
import { Button, Dropdown, Menu, Space } from "antd";
import Map from "ol/Map.js";
import "./GoogleMap.css";
import {
  EditDrawLine,
  createDrawType,
  drawEndEvent,
  drawStartEvent,
} from "../utils/Interactions";
import { mapLayer, vectorLayer } from "../utils/Layers";
import { DownOutlined } from "@ant-design/icons";
import { view } from "../utils/view";
import { LineString, Polygon } from "ol/geom.js";
import Overlay from "ol/Overlay.js";
import { unByKey } from "ol/Observable.js";
import { formatArea, formatLength } from "../utils/utils";
import { HighlightOutlined } from "@ant-design/icons";

let sketch; // Currently drawn feature. @type {import("../src/ol/Feature.js").default}
let helpTooltipElement; // The help tooltip element.
let helpTooltip; // Overlay to show the help messages.
let measureTooltipElement; // The measure tooltip element.
let measureTooltip; // Overlay to show the measurement.
const continuePolygonMsg = "Nhấn để tiếp tục vẽ đa giác"; // Message to show when the user is drawing a polygon.
const continueLineMsg = "Nhấn để tiếp tục vẽ"; // Message to show when the user is drawing a line.
/**
 * Handle pointer move.
 * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
 */
const pointerMoveHandler = function (evt) {
  if (evt.dragging) {
    return;
  }
  /** @type {string} */
  let helpMsg = "Nhấn để bắt đầu vẽ";

  if (sketch) {
    const geom = sketch.getGeometry();
    if (geom instanceof Polygon) {
      helpMsg = continuePolygonMsg;
    } else if (geom instanceof LineString) {
      helpMsg = continueLineMsg;
    }
  }

  helpTooltipElement.innerHTML = helpMsg;
  helpTooltip.setPosition(evt.coordinate);

  helpTooltipElement.classList.remove("hidden");
};

const GoogleMap = () => {
  const [drawEnabled, setDrawEnabled] = useState(false);
  const [drawType, setDrawType] = useState("LineString");
  const mapRef = useRef(null);
  const drawRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = new Map({
        layers: [mapLayer, vectorLayer],
        target: "map",
        view: view,
      });
      mapRef.current = map;
    }
    /**
     *! only after user click button draw then the draw object is created
     *! default drawType is lineString
     */
    if (drawEnabled) {
      mapRef.current.on("pointermove", pointerMoveHandler);
      // Create a Draw type interaction to draw lines on the map
      const draw = createDrawType(drawType);
      drawRef.current = draw;

      createMeasureTooltip();
      createHelpTooltip();

      // Listen for the drawend event to calculate the length of the drawn line
      let listener;
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

      draw.on("drawend", function () {
        measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        unByKey(listener);
      });

      console.log(`init map with draw ${drawType}`);
    }
  }, [drawType, drawEnabled]);

  useEffect(() => {
    const source = vectorLayer.getSource();
    const modify = EditDrawLine(source);
    if (drawEnabled) {
      mapRef.current.addInteraction(drawRef.current);
      mapRef.current.addInteraction(modify);
      console.log("draw enabled true");
    }
  }, [drawEnabled, drawType]);

  /**
   * Creates a new help tooltip
   */
  function createHelpTooltip() {
    if (helpTooltipElement) {
      helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement("div");
    helpTooltipElement.className = "ol-tooltip hidden";
    helpTooltip = new Overlay({
      element: helpTooltipElement,
      offset: [15, 0],
      positioning: "center-left",
    });
    mapRef.current.addOverlay(helpTooltip);
  }

  /**
   * Creates a new measure tooltip
   */
  function createMeasureTooltip() {
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
    mapRef.current.addOverlay(measureTooltip);
  }

  const items = [
    {
      label: (
        <span
          onClick={() => {
            removeInteraction(); // remove all the draw type before switch to the new one
            setDrawType("LineString");
          }}
        >{`Length, LineString`}</span>
      ),
      key: "0",
    },
    {
      label: (
        <span
          onClick={() => {
            removeInteraction();
            setDrawType("Polygon");
          }}
        >{`Area (Polygon)`}</span>
      ),
      key: "1",
    },
    {
      label: (
        <span
          onClick={() => {
            removeInteraction();
            setDrawType("Point");
          }}
        >{`Point`}</span>
      ),
      key: "2",
    },
  ];

  const removeInteraction = () => {
    mapRef.current.removeInteraction(drawRef.current);
  };

  console.log(drawType);
  return (
    <>
      <div id="map" style={{ height: "800px", width: "700px", margin: "auto" }}>
        <Menu mode="horizontal" className="menu">
          <Menu.Item key="1" onClick={() => setDrawEnabled(!drawEnabled)}>
            {drawEnabled ? (
              <Button
                icon={<HighlightOutlined />}
                style={{ color: "#1677FF" }}
                onClick={() => {
                  mapRef.current.un("pointermove", pointerMoveHandler);
                  removeInteraction();
                }}
              >
                Hủy vẽ
              </Button>
            ) : (
              <Button icon={<HighlightOutlined />}>Vẽ</Button>
            )}
          </Menu.Item>
          <Menu.Item key="2">
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <a href="!#" onClick={(e) => e.preventDefault()}>
                <Space>
                  Công cụ
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </Menu.Item>
        </Menu>
      </div>
    </>
  );
};

export { GoogleMap };
