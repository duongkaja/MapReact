import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Dropdown,
  Layout,
  Menu,
  Space,
  Col,
  Row,
  Tabs,
  Drawer,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import "./GoogleMap.css";
import { primaryLogo } from "../../asset/images";
import Map from "ol/Map.js";
import { EditDrawLine, createDrawType } from "../utils/Interactions";
import { mapLayer, vectorLayer } from "../utils/Layers";
import { view } from "../utils/view";
import { useMediaQuery } from "react-responsive";
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
const pointerMoveHandler = function (evt) {
  if (evt.dragging) {
    return;
  }
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
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 991px)" });
  const [collapsed, setCollapsed] = useState(false);
  const [drawEnabled, setDrawEnabled] = useState(false);
  const [drawType, setDrawType] = useState("LineString");
  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const { Header, Content, Sider } = Layout;
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
    setCollapsed(false);
  };
  const onClose = () => {
    setOpen(false);
  };

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

  const tabiItems = [
    {
      key: "1",
      label: `Lớp bản đồ`,
      children: `Content of Tab Pane 1`,
    },
    {
      key: "2",
      label: `Chú giải`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: "3",
      label: `Thuộc tính`,
      children: `Content of Tab Pane 3`,
    },
    {
      key: "4",
      label: `Kết quả`,
      children: `Content of Tab Pane 4`,
    },
  ];

  const removeInteraction = () => {
    mapRef.current.removeInteraction(drawRef.current);
  };

  console.log(drawType);
  return (
    <>
      <Layout>
        {/* Screen tablet */}
        {!isTabletOrMobile && (
          <Sider
            theme="light"
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={298}
            className="sidebar"
          >
            {!collapsed && (
              <img
                src={primaryLogo.logo}
                className="primary-logo"
                alt="logo-awater"
              />
            )}
            <Tabs defaultActiveKey="1" items={tabiItems} />
          </Sider>
        )}
        <Layout className="site-layout">
          <Header className="header-top position-relative">
            <Row>
              {isTabletOrMobile && (
                <Col>
                  <MenuOutlined
                    onClick={showDrawer}
                    className="custom-menu-icon"
                    style={{ fontSize: 20 }}
                  />
                  {/* show option menu */}
                  <Drawer
                    placement="left"
                    width={400}
                    onClose={onClose}
                    open={open}
                  >
                    {/* <SidebarMenu
                      onCloseDrawer={onClose}
                      isTabletOrMobile={isTabletOrMobile}
                    /> */}
                  </Drawer>
                </Col>
              )}
              {!isTabletOrMobile && (
                <Col>
                  <Button
                    type="text"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                      fontSize: "16px",
                      width: 60,
                      height: 60,
                    }}
                  />
                </Col>
              )}
              <Col>
                <Menu mode="horizontal" className="menu">
                  <Menu.Item
                    key="1"
                    onClick={() => setDrawEnabled(!drawEnabled)}
                  >
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
                </Menu>
              </Col>
            </Row>
          </Header>
          <Content>
            <div
              className="map"
              id="map"
              style={{ height: "calc(100vh - 64px)" }}
            ></div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export { GoogleMap };
