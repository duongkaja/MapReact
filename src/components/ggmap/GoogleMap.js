import React, { useEffect } from "react";

const GoogleMap = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCeyk0DO66Ltlnx3UxB5ONEFweZ00uRMeI&callback=initMap";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  window.initMap = function () {
    new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 15.557018118480753, lng: 107.84641987555096 },
      zoom: 5.8,
    });
  };

  return <div id="map" style={{ height: "100vh", width: "80vw" }} />;
};

export default GoogleMap;
