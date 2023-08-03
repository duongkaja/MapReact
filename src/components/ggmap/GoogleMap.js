import React, { useState, useEffect, useRef } from "react";
import { Menu, Layout } from "antd";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Overlay from "ol/Overlay.js";
import { defaults as defaultInteractions } from "olgm/interaction.js";
import { transform } from "ol/proj.js";
import Draw from "ol/interaction/Draw";
import "./GoogleMap.css";
import Menu from "../menu/Menu";
import { drawEndEvent, pointerMoveEvent } from "../utils/Interactions";
import { mapLayer, vectorLayer } from "../utils/Layers";

const { Header, Content, Footer, Sider } = Layout;

let mapData = null;

const GoogleMap = () => {
  const [drawEnabled, setDrawEnabled] = useState(false);
  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const overlayRef = useRef(null);

  mapData = mapRef.current;

  useEffect(() => {
    const tooltipElement = document.createElement("div");
    tooltipElement.className = "overlay";

    const tooltipLayer = new Overlay({
      element: tooltipElement,
      positioning: "bottom-center",
    });

    if (!mapRef.current) {
      const map = new Map({
        interactions: defaultInteractions({
          altShiftDragRotate: false,
          pinchRotate: false,
        }),
        layers: [mapLayer, vectorLayer],
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
      map.addOverlay(tooltipLayer);
      overlayRef.current = tooltipLayer;
      mapRef.current = map;
      // Create a Draw interaction to draw lines on the map
      const draw = new Draw({
        type: "LineString",
        source: vectorLayer.getSource(),
      });
      drawRef.current = draw;
      // Listen for the drawend event to calculate the length of the drawn line
      drawEndEvent(draw);
      // Listen for pointermove events on the map to display the length of the drawn line
      pointerMoveEvent(map, tooltipElement, tooltipLayer);
    }
  }, []);

  useEffect(() => {
    if (drawEnabled) {
      mapRef.current.addInteraction(drawRef.current);
    } else {
      mapRef.current.removeInteraction(drawRef.current);
    }
  }, [drawEnabled]);
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <Layout>
      <Sider>
        <Menu />
      </Sider>
      <Layout>
        <Header>{/* Your header content here */}</Header>
        <Content>
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
              <Menu.Item
                key="draw"
                onClick={() => setDrawEnabled(!drawEnabled)}
              >
                {drawEnabled ? "Hủy vẽ" : "Nhấp để vẽ"}
              </Menu.Item>
              <Menu.Item key="toggle" onClick={handleToggle}>
                {isToggled ? "Ẩn tên" : "Hiển thị tên"}
              </Menu.Item>
            </Menu>
          </div>
        </Content>
        <Footer></Footer>
      </Layout>
    </Layout>
  );
};

export { GoogleMap, mapData };
