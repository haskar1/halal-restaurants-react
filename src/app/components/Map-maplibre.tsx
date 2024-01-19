"use client";

import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import "@maptiler/geocoding-control/style.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "../stylesheets/map.css";
import { AsyncTypeahead, Menu, MenuItem } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

const restaurants = [
  {
    name: "Tasty Halal Food Truck",
    address: "9825 Chapel Hill Rd, Morrisville, NC 27560",
    googleMapURL: "https://maps.app.goo.gl/DhC1oDgq9sXiVpiYA",
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

export default async function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapController, setMapController] = useState();
  const [lng] = useState(-78.78171007890153);
  const [lat] = useState(35.79141875623884);
  const [zoom] = useState(14);
  const [API_KEY] = useState("IoNQmmCT49OcLZzu6Xp6");

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom,
    });

    restaurantMarkers(restaurants);

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    setMapController(createMapLibreGlMapController(map.current, maplibregl));
  }, [API_KEY, lng, lat, zoom]);

  function restaurantMarkers(restaurants) {
    return restaurants.map((restaurant) => {
      new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([restaurant.longitude, restaurant.latitude])
        .setPopup(
          new maplibregl.Popup({ closeButton: false }).setHTML(
            `<h2>${restaurant.name}</h2>
             ${
               restaurant.address && restaurant.googleMapURL
                 ? `<a href=${restaurant.googleMapURL} target="_blank">${restaurant.address}</a>`
                 : ""
             }
            `
          )
        )
        .addTo(map.current);
    });
  }

  // function DatabaseSearchBar() {
  //   const [databaseSearchBarText, setDatabaseSearchBarText] = useState("");
  //   const [searchResults, setSearchResults] = useState([]);

  //   async function handleSearchDatabase(e) {
  //     setDatabaseSearchBarText(e.target.value);

  //     if (e.target.value.trim() === "") return setSearchResults([]);

  //     try {
  //       const databaseSearchResponse = await callAPI_GET(
  //         `search?q=${e.target.value}`
  //       );
  //       const results = databaseSearchResponse.rows;

  //       if (results.length > 0) {
  //         let newResultsArr = results.map((result) => {
  //           return result.name;
  //         });
  //         setSearchResults(newResultsArr);
  //         console.log(newResultsArr);
  //       } else {
  //         setSearchResults([]);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   function ResultsList() {
  //     return (
  //       <div className="results-list">
  //         <ul>
  //           {searchResults.map((result) => {
  //             return <li>{result}</li>;
  //           })}
  //         </ul>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="absolute top-[50px] left-[10px] text-black">
  //       <div className="data-searchbar">
  //         <form onSubmit={(e) => e.preventDefault}>
  //           <input
  //             title="restaurant search bar"
  //             type="text"
  //             onChange={handleSearchDatabase}
  //             value={databaseSearchBarText}
  //           ></input>
  //         </form>
  //       </div>
  //       {searchResults.length > 0 && <ResultsList />}
  //     </div>
  //   );
  // }

  function CustomTypehead() {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);

    return (
      <AsyncTypeahead
        id="typehead-result-list"
        className="text-black top-[100px] left-[10px]"
        isLoading={isLoading}
        labelKey={(option) => `${option.name}`}
        onSearch={(query) => {
          setIsLoading(true);
          fetch(`http://localhost:9000/search?q=${query}`)
            .then((resp) => resp.json())
            .then((json) => {
              setOptions(json.rows);
              setIsLoading(false);
            });
        }}
        options={options}
        renderMenu={(results) => {
          return (
            <Menu id="typehead-menu">
              {results.map((result, index) => (
                <MenuItem
                  key={result.name}
                  onClick={() => {
                    map.current.jumpTo({
                      center: [result.longitude, result.latitude],
                    });
                  }}
                  option={result}
                  position={index}
                >
                  {result.name}
                </MenuItem>
              ))}
            </Menu>
          );
        }}
      />
    );
  }

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
      <div className="geocoding">
        <GeocodingControl apiKey={API_KEY} mapController={mapController} />
      </div>
      {/* <DatabaseSearchBar /> */}
      <CustomTypehead />
    </div>
  );
}
