import React, { useState, useEffect, useRef } from "react";
import { Dropdown, Layout, Menu, Space, Button, Drawer, Col, Row } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import "./GoogleMap.css";
import { primaryLogo } from "../../asset/images";
import Map from "ol/Map.js";
import { createDrawType, drawEndEvent } from "../utils/Interactions";
import { mapLayer, vectorLayer } from "../utils/Layers";
import { view } from "../utils/view";
import { useMediaQuery } from "react-responsive";
const { Header, Content, Sider } = Layout;
const GoogleMap = () => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 991px)" });
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
    setCollapsed(false);
  };
  // const [placement, setPlacement] = useState("left");
  const [placement] = useState("left");
  const [collapsed, setCollapsed] = useState(false);
  const onClose = () => {
    setOpen(false);
  };
  const [mapWidth, setMapWidth] = useState("81.9vw");

  useEffect(() => {
    if (collapsed) {
      setMapWidth("100vw");
    } else {
      setMapWidth("81.9vw");
    }
  }, [collapsed]);

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
      <Layout>
        {/* Screen tablet */}
        {!isTabletOrMobile && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={270}
            className="sidebar"
          >
            {!collapsed && (
              <img
                src={primaryLogo.logo}
                className="primary-logo"
                alt="logo-awater"
              />
            )}
            {/* 
              <SidebarMenu /> */}
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
                  />

                  {/* show option menu */}
                  <Drawer
                    placement={placement}
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
                <Menu
                  className="menu"
                  mode="horizontal"
                  style={{ width: "100%" }}
                >
                  <Menu.Item
                    key="1"
                    onClick={() => setDrawEnabled(!drawEnabled)}
                  >
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
              </Col>
            </Row>
          </Header>
          <Content>
            <div
              className="map"
              id="map"
              style={{ height: "89.9vh", width: mapWidth }}
            ></div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export { GoogleMap };
