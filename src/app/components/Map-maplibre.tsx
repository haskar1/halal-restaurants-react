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
  const [lon, setLon] = useState(-78.81729);
  const [lat, setLat] = useState(35.81043);
  const [zoom] = useState(14);
  const [API_KEY] = useState("IoNQmmCT49OcLZzu6Xp6");
  const [showDistance, setShowDistance] = useState(false);
  const [showDistanceBtnIsDisabled, setShowDistanceBtnIsDisabled] =
    useState(true);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [searchResults, setSearchResults] = useState({});
  const [isActive, setIsActive] = useState("");
  const isMapLoaded = useRef(false);

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
      fitBoundsOptions: { maxZoom: 14, animate: false },
      showAccuracyCircle: false,
    });

    map.current.addControl(geolocate);

    geolocate.once("geolocate", (e) => {
      const lat = e.coords.latitude;
      const lon = e.coords.longitude;
      setLat(lat);
      setLon(lon);
      fetchStores(lat, lon);

      if (!showDistance) {
        setShowDistance(true);
        setShowDistanceBtnIsDisabled(false);
      }
    });

    map.current.on("load", () => {
      geolocate.trigger();
    });

    isMapLoaded.current = true;
    setMapController(
      createMapLibreGlMapController(map.current, maplibregl, false)
    );
  }, []);

  function fetchStores(currentLat, currentLon) {
    if (isActive !== "") {
      const popups = document.getElementsByClassName("maplibregl-popup");

      if (popups.length) {
        [...popups].map((popup) => popup.remove());
      }

      setIsActive("");
    }

    const bounds = map.current.getBounds();

    // Fetch restaurants dynamically based on the current viewport
    fetch(
      `http://localhost:9000/search?bounds=${JSON.stringify(
        bounds
      )}&lat=${currentLat}&lon=${currentLon}`
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        map.current.getSource("restaurants").setData(json);
        setSearchResults(json);
      })
      .catch((error) => {
        console.error("Error fetching restaurant data:", error);
      });

    setShowSearchButton(false);
  }

  return (
    <div className="map-and-results-container">
      <Sidebar
        map={map}
        isMapLoaded={isMapLoaded}
        lat={lat}
        lon={lon}
        zoom={zoom}
        showDistance={showDistance}
        setShowDistance={setShowDistance}
        showDistanceBtnIsDisabled={showDistanceBtnIsDisabled}
        showSearchButton={showSearchButton}
        setShowSearchButton={setShowSearchButton}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        isActive={isActive}
        setIsActive={setIsActive}
      />

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
                fetchStores(lat, lon);
              }
            }}
          />
        </div>

        {showSearchButton && (
          <button
            type="button"
            className="search-area-btn bg-slate-700"
            onClick={() => {
              fetchStores(lat, lon);
            }}
          >
            Search this area
          </button>
        )}
      </div>
    </div>
  );
}
