import React from "react";
import { layer, Map as OLMap, Layers } from "react-openlayers";
import "./App.css";
import Menu from "./components/menu/Menu";
import GoogleMap from "./components/ggmap/GoogleMap";
function App() {
  return (
    <div className="App">
      <div style={{ display: "flex" }}>
        <Menu />
        <GoogleMap />
        {/* <OLMap
          view={{
            projection: "EPSG:4326",
            center: [107.84641987555096, 15.557018118480753],
            zoom: 5.8,
          }}
          style={{ height: "100vh", width: "80vw" }}
        >
          <Layers>
            <layer.Tile></layer.Tile>
          </Layers>
        </OLMap> */}
      </div>
    </div>
  );
}

export default App;
