import React, { useState, useEffect, useRef } from "react";
import { Dropdown, Menu, Space } from "antd";
import Map from "ol/Map.js";
import "./GoogleMap.css";
import { createDrawType, drawEndEvent } from "../utils/Interactions";
import { mapLayer, vectorLayer } from "../utils/Layers";
import { DownOutlined } from "@ant-design/icons";
import { view } from "../utils/view";

const GoogleMap = () => {
  const [drawEnabled, setDrawEnabled] = useState(false);
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

      // Create a Draw type interaction to draw lines on the map
      const draw = createDrawType("LineString");
      drawRef.current = draw;

      // Listen for the drawend event to calculate the length of the drawn line
      drawEndEvent(draw);
    }
  }, []);

  useEffect(() => {
    if (drawEnabled) {
      mapRef.current.addInteraction(drawRef.current);
    } else {
      mapRef.current.removeInteraction(drawRef.current);
    }
  }, [drawEnabled]);

  const items = [
    {
      label: <a href="!#">{`Length, LineString`}</a>,
      key: "0",
    },
    {
      label: <a href="!#">{`Area (Polygon)`}</a>,
      key: "1",
    },
    {
      label: <a href="!#">{`Point`}</a>,
      key: "2",
    },
  ];

  return (
    <>
      <div id="map" style={{ height: "100vh", width: "100vw" }}>
        <Menu mode="horizontal" className="menu">
          <Menu.Item key="1" onClick={() => setDrawEnabled(!drawEnabled)}>
            {drawEnabled ? "Hủy vẽ" : "Nhấp để vẽ"}
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
