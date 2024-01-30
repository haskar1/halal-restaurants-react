"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import maplibregl from "maplibre-gl";
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import "@maptiler/geocoding-control/style.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "../stylesheets/map.css";
import { AsyncTypeahead, Menu, MenuItem } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

export default async function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapController, setMapController] = useState();
  const [lng] = useState(-78.81729);
  const [lat] = useState(35.81043);
  const [zoom] = useState(14);
  const [API_KEY] = useState("IoNQmmCT49OcLZzu6Xp6");
  // const [initialRestaurants, setInitialRestaurants] = useState({});

  useEffect(() => {
    if (map.current) return; // stops map from initializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom,
      maxZoom: 17,
      minZoom: 5,
    });

    map.current.on("load", () => {
      // Add an image to use as a custom marker
      map.current.loadImage(
        "https://maplibre.org/maplibre-gl-js/docs/assets/custom_marker.png",

        (error, image) => {
          if (error) throw error;
          map.current.addImage("custom-marker", image);

          // const bounds = map.current.getBounds();
          // fetch(`http://localhost:9000/search?bounds=${JSON.stringify(bounds)}`)
          //   .then((res) => {
          //     return res.json();
          //   })
          //   .then((json) => {
          // setInitialRestaurants(json);

          map.current.addSource("restaurants", {
            type: "geojson",
            data: {},
            cluster: true,
            clusterMaxZoom: 10, // Max zoom to cluster points on
            clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
          });

          map.current.addLayer({
            id: "clusters",
            type: "circle",
            source: "restaurants",
            filter: ["has", "point_count"],
            paint: {
              // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
              // with three steps to implement three types of circles:
              //   * Blue, 20px circles when point count is less than 100
              //   * Yellow, 30px circles when point count is between 100 and 750
              //   * Pink, 40px circles when point count is greater than or equal to 750
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#51bbd6",
                100,
                "#f1f075",
                750,
                "#f28cb1",
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                20,
                100,
                30,
                750,
                40,
              ],
            },
          });

          map.current.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "restaurants",
            filter: ["has", "point_count"],
            layout: {
              "text-field": ["get", "point_count_abbreviated"],
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 12,
            },
          });

          // Add a symbol layer
          map.current.addLayer({
            id: "restaurants",
            type: "symbol",
            source: "restaurants",
            filter: ["!", ["has", "point_count"]],
            layout: {
              "icon-image": "custom-marker",
              "icon-allow-overlap": true,
            },
          });
          // })
          // .catch((error) => {
          //   console.error(
          //     "Error fetching restaurant data in new bounds:",
          //     error
          //   );
          // });

          // Zoom into a cluster on click
          map.current.on("click", "clusters", (e) => {
            const features = map.current.queryRenderedFeatures(e.point, {
              layers: ["clusters"],
            });
            const clusterId = features[0].properties.cluster_id;
            map.current
              .getSource("restaurants")
              .getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) return;

                map.current.easeTo({
                  center: features[0].geometry.coordinates,
                  zoom: zoom,
                });
              });
          });

          // When a click event occurs on a feature in the unclustered-restaurant layer, open a popup at
          // the location of the feature, with description HTML from its properties.
          map.current.on("click", "restaurants", (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const name = e.features[0].properties.name;
            const address = e.features[0].properties.address;
            const address_url = e.features[0].properties.address_url;

            map.current.easeTo({ center: coordinates });

            new maplibregl.Popup()
              .setLngLat(coordinates)
              .setHTML(
                `${name}<br><a href="${address_url}" target="_blank">Address: ${address}</a>`
              )
              .addTo(map.current);
          });

          map.current.on("mouseenter", "clusters", () => {
            map.current.getCanvas().style.cursor = "pointer";
          });
          map.current.on("mouseleave", "clusters", () => {
            map.current.getCanvas().style.cursor = "";
          });

          map.current.on("mouseenter", "restaurants", () => {
            map.current.getCanvas().style.cursor = "pointer";
          });
          map.current.on("mouseleave", "restaurants", () => {
            map.current.getCanvas().style.cursor = "";
          });
        }
      );
    });

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

  // Searchbar that searches the database for restaurants
  function CustomTypehead() {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);

    return (
      <div className="container">
        <AsyncTypeahead
          id="typehead-result-list"
          isLoading={isLoading}
          labelKey={(option) => `${option.name}`}
          onSearch={(query) => {
            setIsLoading(true);
            fetch(`http://localhost:9000/search/searchbar?q=${query}`)
              .then((resp) => resp.json())
              .then((json) => {
                setOptions(json.rows);
                setIsLoading(false);
              })
              .catch((error) => {
                console.error(
                  "Error fetching restaurant data from searchbar:",
                  error
                );
              });
          }}
          options={options}
          onChange={(selected) => {
            selected.length > 0 && showPopupOnSearch(selected[0]);
          }}
          renderMenu={(results) => {
            return (
              <Menu id="typehead-menu">
                {results.map((result, index) => (
                  <MenuItem
                    key={index}
                    option={result}
                    position={index}
                    onClick={() => {
                      showPopupOnSearch(result);
                    }}
                  >
                    {result.name}
                  </MenuItem>
                ))}
              </Menu>
            );
          }}
        />
      </div>
    );
  }

  function SearchResultsList() {
    const [searchResults, setSearchResults] = useState({});

    useEffect(() => {
      if (!map.current) return;

      map.current.on("load", () => {
        // setSearchResults(initialRestaurants);

        const initialBounds = map.current.getBounds();
        fetch(
          `http://localhost:9000/search?bounds=${JSON.stringify(initialBounds)}`
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
      });

      // Add event listener for moving the map
      map.current.on("moveend", () => {
        // Map hasn't been initialized yet
        if (!map.current.getSource("restaurants")) return;

        // Get the current viewport bounds
        const bounds = map.current.getBounds();

        // Fetch restaurant data dynamically based on the current viewport
        fetch(`http://localhost:9000/search?bounds=${JSON.stringify(bounds)}`)
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
      });
    }, [API_KEY, lng, lat, zoom]);

    return (
      <div className="sidebar">
        <div className="heading bg-slate-800">
          {/* <h1>Our locations</h1> */}
        </div>
        <div id="listings" className="listings">
          {searchResults.features &&
            searchResults.features.map((restaurant) => (
              <div
                key={restaurant.properties.id}
                id={restaurant.properties.id}
                className="item"
              >
                <a
                  href="#"
                  onClick={() => {
                    searchResults.features.map((restaurantOnMap) => {
                      if (
                        restaurantOnMap.properties.id ===
                        restaurant.properties.id
                      ) {
                        flyToStore(restaurant);
                        showPopupOnSearch(restaurant.properties);
                      }
                    });
                  }}
                >
                  <span className="text-[#003089]">
                    {restaurant.properties.name}
                  </span>
                  <span>{restaurant.properties.address}</span>
                  {restaurant.properties.distance && (
                    <div>
                      <strong>${restaurant.properties.distance}</strong>
                    </div>
                  )}
                </a>
              </div>
            ))}
        </div>
      </div>
    );
  }

  function flyToStore(currentFeature) {
    map.current.easeTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15,
    });

    console.log("flew to restaurant");
  }

  function showPopupOnSearch(restaurant) {
    const coordinates = [restaurant.longitude, restaurant.latitude];
    const name = restaurant.name;
    const address = restaurant.address;
    const address_url = restaurant.address_url;
    const popups = document.getElementsByClassName("maplibregl-popup");

    if (popups.length) {
      [...popups].map((popup) => popup.remove());
    }

    map.current.easeTo({ center: coordinates, zoom: zoom });

    new maplibregl.Popup()
      .setLngLat(coordinates)
      .setHTML(
        `${name}<br><a href="${address_url}" target="_blank">Address: ${address}</a>`
      )
      .addTo(map.current);
  }

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
      <div className="geocoding">
        <GeocodingControl apiKey={API_KEY} mapController={mapController} />
      </div>
      <CustomTypehead />
      <SearchResultsList />
    </div>
  );
}
