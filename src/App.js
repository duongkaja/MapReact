import { layer, Map, Layers } from "react-openlayers";
import "./App.css";
function App() {
  return (
    <div className="App">
      <Map
        view={{
          projection: "EPSG:4326",
          center: [107.84641987555096, 15.557018118480753],
          zoom: 5,
        }}
        style={{ height: "100vh", width: "100vw" }}
      >
        <Layers>
          <layer.Tile></layer.Tile>
        </Layers>
      </Map>
    </div>
  );
}
export default App;
