"use client";

import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LocateControl } from "@/components/LocateControl";

function MapPlaceholder() {
  return (
    <p>
      Map of London.{" "}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

export default function MyMap({ defaultPosition, zoom }) {
  const [currentPosition, setCurrentPosition] = useState(defaultPosition);

  /*
  function LocationMarker() {
    return (
      <Marker position={currentPosition}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }
  */

  return (
    <MapContainer
      center={currentPosition}
      zoom={zoom}
      scrollWheelZoom={true}
      placeholder={<MapPlaceholder />}
      style={{ height: "100vh", width: "100%", padding: 0 }}
      whenReady={() => {}}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <LocationMarker /> */}
      <LocateControl
        keepCurrentZoomLevel="true"
        strings={{ title: "Show my current location" }}
        enableHighAccuracy="true"
      />
    </MapContainer>
  );
}
