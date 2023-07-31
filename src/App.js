import { layer, Map, Layers } from "react-openlayers";
import "./App.css";
import Menu from "./components/menu/Menu";
function App() {
  return (
    <div className="App">
      <div style={{ display: "flex" }}>
        <Menu />
        <Map
          view={{
            projection: "EPSG:4326",
            center: [107.84641987555096, 15.557018118480753],
            zoom: 5.5,
          }}
          style={{ height: "100vh", width: "80vw" }}
        >
          <Layers>
            <layer.Tile></layer.Tile>
          </Layers>
        </Map>
      </div>
    </div>
  );
}
export default App;
