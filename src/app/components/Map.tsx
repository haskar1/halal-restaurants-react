"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LocateControl } from "@/components/LocateControl";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/assets/css/leaflet.css";
import "../stylesheets/leaflet-geosearch.css";
import "leaflet-canvas-marker";
// import L from "leaflet";
// import PixiOverlay from "react-leaflet-pixi-overlay";
// import { renderToString } from "next/dist/compiled/react-dom/cjs/react-dom-server-legacy.browser.development";

const restaurants = [
  {
    name: "Tasty Halal Food Truck",
    latitude: 35.81042856924115,
    longitude: -78.81729356031344,
  },
  {
    name: "Jasmin & Olivz Mediterranean - Weston",
    latitude: 35.814950299182506,
    longitude: -78.82084290855754,
  },
  {
    name: "Meat & Bite",
    latitude: 35.78960191212204,
    longitude: -78.6754356299833,
  },
];

export default function MyMap({ defaultPosition, zoom }) {
  const [currentPosition, setCurrentPosition] = useState(defaultPosition);

  function MapPlaceholder() {
    return (
      <p>
        Map of London.{" "}
        <noscript>You need to enable JavaScript to see this map.</noscript>
      </p>
    );
  }

  function RestaurantMarkers({ restaurants }) {
    return restaurants.map((restaurant) => {
      return (
        <Marker position={[restaurant.latitude, restaurant.longitude]}>
          <Popup>{restaurant.name}</Popup>
        </Marker>
      );
    });
  }

  /*
  // Instead of using markers this uses Canvas with circles so it can handle large data quickly. 
  // Only problem is the circles lag when zooming and panning.

  function LeafletCanvasMarker() {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

      var ciLayer = L.canvasIconLayer({}).addTo(map);

      ciLayer.addOnClickListener(function (e, data) {
        console.log(data);
      });
      ciLayer.addOnHoverListener(function (e, data) {
        console.log(data[0].data._leaflet_id);
      });

      var icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconSize: [20, 18],
        iconAnchor: [10, 9],
      });

      var markers = [];
      for (var i = 0; i < restaurants.length; i++) {
        var marker = L.marker([restaurants[i].latitude, restaurants[i].longitude], {
          icon: icon,
        }).bindPopup(restaurants[i].name);
        markers.push(marker);
      }
      ciLayer.addLayers(markers);
    }, [map]);

    return null;
  }
  */

  function SearchBar() {
    const provider = new OpenStreetMapProvider();

    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
      showMarker: false,
      style: "bar",
    });

    const map = useMap();

    useEffect(() => {
      map.addControl(searchControl);
      return () => map.removeControl(searchControl);
    }, []);

    return null;
  }

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
        attribution='&copy; <a href="https://carto.com/">carto.com</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
        maxZoom={17}
      />
      <RestaurantMarkers restaurants={restaurants} />
      {/* <LeafletCanvasMarker /> */}
      {/* <PixiOverlay markers={markers} /> */}
      <SearchBar />
      <LocateControl
        keepCurrentZoomLevel="true"
        strings={{ title: "Show my current location" }}
        enableHighAccuracy="true"
      />
    </MapContainer>
  );
}
