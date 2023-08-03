import React from "react";
import "./App.css";

import { GoogleMap } from "./components/ggmap/GoogleMap";
function App() {
  return (
    <div className="App">
      <div style={{ display: "flex" }}>
        {/* <Menu /> */}
        <GoogleMap />
      </div>
    </div>
  );
}

export default App;
