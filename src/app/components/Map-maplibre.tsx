"use client";

import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import Sidebar from "./Sidebar";
import "@maptiler/geocoding-control/style.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "../stylesheets/map.css";

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapController, setMapController] = useState();
  const [lon] = useState(-78.81729);
  const [lat] = useState(35.81043);
  const [zoom] = useState(14);
  const [API_KEY] = useState("IoNQmmCT49OcLZzu6Xp6");
  const isMapLoaded = useRef(false);
  const showDistance = useRef(false);

  useEffect(() => {
    if (map.current) return; // stops map from initializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
      center: [lon, lat],
      zoom: zoom,
      maxZoom: 17,
      minZoom: 5,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    let geolocate = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    map.current.addControl(geolocate);

    geolocate.on("geolocate", () => {
      if (showDistance.current === false) {
        showDistance.current = true;
      }
    });

    geolocate.on("trackuserlocationstart", () => {
      if (showDistance.current === false) {
        showDistance.current = true;
      }
    });

    isMapLoaded.current = true;
    setMapController(
      createMapLibreGlMapController(map.current, maplibregl, false)
    );
  }, [API_KEY, lon, lat, zoom]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
      <div className="geocoding">
        <GeocodingControl
          apiKey={API_KEY}
          mapController={mapController}
          proximity={[{ type: "map-center" }]}
          placeholder="Search Location (City, Address, etc.)"
          noResultsMessage="Location not found"
          showFullGeometry={false}
          markerOnSelected={false}
          flyTo={false}
          onPick={(e) => {
            // check if e is not null, otherwise bug happens where the map glitches when you search location
            if (e) {
              map.current.jumpTo({ center: e?.center, zoom: 14 });
              showDistance.current = true;
            }
          }}
        />
      </div>
      <Sidebar
        map={map}
        isMapLoaded={isMapLoaded}
        zoom={zoom}
        showDistance={showDistance}
      />
    </div>
  );
}
