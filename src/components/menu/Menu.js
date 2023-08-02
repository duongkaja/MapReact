import React from "react";
import { Menu } from "antd";

const { SubMenu } = Menu;

function App() {
  return (
    <Menu mode="inline" style={{ width: 310 }}>
      <SubMenu key="sub1" title="Chọn vệ tinh">
        <Menu.Item key="1">Lựa chọn 1</Menu.Item>
        <Menu.Item key="2">Lựa chọn 2</Menu.Item>
        <SubMenu key="sub1-2" title="Chọn chi tiết vị tinh  ">
          <Menu.Item key="3">Lựa chọn 3</Menu.Item>
          <Menu.Item key="4">Lựa chọn 4</Menu.Item>
        </SubMenu>
      </SubMenu>
      <SubMenu key="sub2" title="Chọn khu vực">
        <Menu.Item key="5">Lựa chọn 5</Menu.Item>
        <Menu.Item key="6">Lựa chọn 6</Menu.Item>
      </SubMenu>
    </Menu>
  );
}

export default App;
