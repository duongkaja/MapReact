import React from "react";
// import { layer, Map as OLMap, Layers } from "react-openlayers";
import "./App.css";
import Menu from "./components/menu/Menu";
// import MapWrapper from "./components/OpenLayers/MapWrapper";
import GoogleMap from "./components/ggmap/GoogleMap";
function App() {
  return (
    <div className="App">
      <div style={{ display: "flex" }}>
        <Menu />
        <GoogleMap />
        {/* <MapWrapper /> */}
      </div>
    </div>
  );
}

export default App;
