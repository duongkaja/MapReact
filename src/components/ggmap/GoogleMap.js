import React, { useEffect } from "react";

const GoogleMap = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCeyk0DO66Ltlnx3UxB5ONEFweZ00uRMeI&libraries=drawing&callback=initMap";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  window.initMap = function () {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 15.557018118480753, lng: 107.84641987555096 },
      zoom: 5.8,
    });

    // Add a drawing manager
    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYLINE,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [window.google.maps.drawing.OverlayType.POLYLINE],
      },
      polylineOptions: {
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      },
    });
    drawingManager.setMap(map);
  };

  return <div id="map" style={{ height: "100vh", width: "80vw" }} />;
};

export default GoogleMap;
