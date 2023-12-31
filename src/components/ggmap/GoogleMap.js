import React, { useState, useEffect, useRef } from "react";
import { Button, Layout, Col, Row, Tabs, Drawer, Tree, Select } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import "./GoogleMap.css";
import { primaryLogo } from "../../asset/images";
import Map from "ol/Map.js";
import {
  EditDrawLine,
  createDrawType,
  createMeasureTooltip,
  drawEndEvent,
  drawStartEvent,
} from "../utils/Interactions";
import { mapLayer, vectorLayer } from "../utils/Layers";
import { view } from "../utils/view";
import { useMediaQuery } from "react-responsive";
import { HighlightOutlined } from "@ant-design/icons";
import XYZ from "ol/source/XYZ";

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
      // Create a Draw type interaction to draw lines on the map
      const draw = createDrawType(drawType);
      drawRef.current = draw;

      createMeasureTooltip(mapRef.current);

      // Listen for the draw event to calculate the length of the drawn line
      drawStartEvent(draw);
      drawEndEvent(draw, mapRef.current);
    }
  }, [drawType, drawEnabled]);

  useEffect(() => {
    const source = vectorLayer.getSource();
    const modify = EditDrawLine(source);
    if (drawEnabled) {
      mapRef.current.addInteraction(drawRef.current);
      mapRef.current.addInteraction(modify);
    }
  }, [drawEnabled, drawType]);

  ///Lớp nền
  const [baseLayer, setBaseLayer] = useState("google");
  const BaseLayerTree = ({ treeData, onCheck }) => (
    <Tree
      checkable
      defaultExpandedKeys={["0-0-0"]}
      treeData={treeData}
      onCheck={onCheck}
    />
  );

  const handleBaseLayerChange = (checkedKeys, e) => {
    // Lấy khóa của mục được chọn cuối cùng
    const lastCheckedKey = checkedKeys[checkedKeys.length - 1];

    // Xác định lớp nền mới dựa trên khóa của mục được chọn cuối cùng
    let newBaseLayer;
    switch (lastCheckedKey) {
      case "0-0-1":
        newBaseLayer = "hanhChinh";
        break;
      case "0-0-2":
        newBaseLayer = "giaoThong";
        break;
      case "0-0-3":
        newBaseLayer = "google";
        break;
      case "0-0-4":
        newBaseLayer = "veTinh";
        break;
      case "0-0-5":
        newBaseLayer = "khongNen";
        break;
      case "0-0-6":
        newBaseLayer = "DiaDanhGoogle";
        break;
      default:
        newBaseLayer = baseLayer;
    }

    // Cập nhật lớp nền mới
    setBaseLayer(newBaseLayer);

    // Thay đổi nguồn của lớp bản đồ dựa trên lớp nền mới
    switch (newBaseLayer) {
      case "hanhChinh":
        mapLayer.setSource(
          new XYZ({
            url: "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png",
          })
        );
        break;
      case "giaoThong":
        mapLayer.setSource(
          new XYZ({
            url: "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
          })
        );
        break;
      case "google":
        mapLayer.setSource(
          new XYZ({
            url: "http://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
          })
        );
        break;
      case "veTinh":
        mapLayer.setSource(
          new XYZ({
            url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
          })
        );
        break;
      case "khongNen":
        mapLayer.setSource(
          new XYZ({
            url: "https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}",
          })
        );
        break;
      case "DiaDanhGoogle":
        mapLayer.setSource(
          new XYZ({
            url: "http://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
          })
        );
        break;
      default:
        break;
    }
  };

  const tabItems = [
    {
      key: "1",
      label: "Lớp bản đồ",
      children: (
        <BaseLayerTree
          treeData={[
            {
              title: "Lớp nền",
              key: "0-1",
              children: [
                {
                  title: "Hành chính",
                  key: "0-0-1",
                },
                {
                  title: "Giao thông",
                  key: "0-0-2",
                },
                {
                  title: "Google",
                  key: "0-0-3",
                },
                {
                  title: "Vệ tinh",
                  key: "0-0-4",
                },
                {
                  title: "Không nền",
                  key: "0-0-5",
                },
                {
                  title: "Bản đồ địa danh Google",
                  key: "0-0-6",
                },
              ],
            },
          ]}
          onCheck={handleBaseLayerChange}
        />
      ),
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
            <Tabs defaultActiveKey="1" items={tabItems} />
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
                <Row gutter={16}>
                  <Col key="1" onClick={() => setDrawEnabled(!drawEnabled)}>
                    {drawEnabled ? (
                      <Button
                        icon={<HighlightOutlined />}
                        style={{ color: "#1677FF" }}
                        onClick={() => {
                          removeInteraction();
                        }}
                      ></Button>
                    ) : (
                      <Button icon={<HighlightOutlined />}></Button>
                    )}
                  </Col>
                  <Col>
                    <Select
                      style={{ width: 130 }}
                      // showSearch
                      placeholder="Chọn kiểu vẽ"
                      optionFilterProp="children"
                      onChange={(value) => {
                        console.log(`selected ${value}`);
                        removeInteraction();
                        setDrawType(value);
                      }}
                      // onSearch={onSearch}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        {
                          value: "LineString",
                          label: "LineString",
                        },
                        {
                          value: "Polygon",
                          label: "Polygon",
                        },
                        {
                          value: "Point",
                          label: "Point",
                        },
                      ]}
                    />
                  </Col>
                </Row>
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
