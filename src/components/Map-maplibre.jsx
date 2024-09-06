"use client";

import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import MapSidebar from "@/components/MapSidebar";
import { Skeleton, useMediaQuery } from "@mui/material";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@/stylesheets/map.scss";
import { useSearchParams } from "next/navigation";
import { bbox as turfbbox } from "@turf/bbox";

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lon, setLon] = useState(-73.985542);
  const [lat, setLat] = useState(40.757976);
  const zoom = 14;
  // const [showDistance, setShowDistance] = useState(false);
  // const [showDistanceBtnIsDisabled, setShowDistanceBtnIsDisabled] =
  //   useState(true);
  const geoJsonData = useRef({});
  const [searchResults, setSearchResults] = useState({});
  const searchResultsRef = useRef({});
  const [isActive, setIsActive] = useState("");
  const geolocate = useRef(null);
  const clickedOnRestaurantPopup = useRef(false);
  const searchedRestaurantSelected = useRef(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const bottomSheetRef = useRef();
  const bottomSheetSnapping = useRef(false);
  const isMobile = useMediaQuery("(max-width:767px)", { noSsr: true });
  const searchParams = useSearchParams();
  const [searchedLocation, setSearchedLocation] = useState(null);

  useEffect(() => {
    if (map?.current) return; // stops map from initializing more than once

    const location = searchParams.get("location");

    fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${location}&proximity=ip&access_token=pk.eyJ1IjoiaGFza2FyMSIsImEiOiJjbHN1ZHNtbXoxMWV2MnJxbnEyeGNrYW5hIn0.CIAJP91YnRMDk-Fc0jeevg`
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        let bbox = json.features[0].properties?.bbox;
        let mapCenterLat;
        let mapCenterLon;

        if (json.features[0].properties?.coordinates) {
          mapCenterLat = json.features[0].properties?.coordinates.latitude;
          mapCenterLon = json.features[0].properties?.coordinates.longitude;
        } else {
          mapCenterLat = lat;
          mapCenterLon = lon;
        }

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
          bounds: bbox,
          center: [mapCenterLon, mapCenterLat],
          zoom: zoom,
          maxZoom: 17,
          minZoom: 5,
          // attributionControl: false,
        });

        if (map?.current && bbox) {
          map.current.jumpTo({ center: [mapCenterLon, mapCenterLat] });
        }

        map.current.on("load", () => {
          // Add an image to use as a custom marker
          map.current.loadImage(
            "https://maplibre.org/maplibre-gl-js/docs/assets/custom_marker.png",

            (error, image) => {
              if (error) throw error;

              if (!map.current.getImage("custom-marker")) {
                map.current.addImage("custom-marker", image);
              }

              // New way. Searches most popular restaurants within 50 miles of searched location. See api/get-popular-restaurants for more info.
              fetch(
                `/api/get-map-restaurants?latitude=${mapCenterLat}&longitude=${mapCenterLon}&limit=${100}`
              )
                .then((res) => {
                  return res.json();
                })
                .then((json) => {
                  if (json.geoJsonData.features.length) {
                    let bbox2 = turfbbox(json.geoJsonData);
                    map.current.fitBounds(bbox2, { padding: 100 });
                  }

                  if (!map.current.getSource("restaurants")) {
                    map.current.addSource("restaurants", {
                      type: "geojson",
                      data: json.geoJsonData,
                      cluster: true,
                      clusterMaxZoom: 10, // Max zoom to cluster points on
                      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
                    });
                  }

                  let layerAlreadyExists = false;

                  map.current.getStyle().layers.map((layer) => {
                    if (
                      layer.id === "restaurants" ||
                      layer.id === "cluster-count"
                    ) {
                      layerAlreadyExists = true;
                      return;
                    }
                  });

                  if (!layerAlreadyExists) {
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
                        "text-font": [
                          "DIN Offc Pro Medium",
                          "Arial Unicode MS Bold",
                        ],
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
                  }

                  map.current.on("mouseenter", "clusters", () => {
                    map.current.getCanvas().style.cursor = "pointer";
                  });
                  map.current.on("mouseleave", "clusters", () => {
                    map.current.getCanvas().style.cursor = "";
                  });

                  map.current.on("mouseenter", "restaurants", (e) => {
                    map.current.getCanvas().style.cursor = "pointer";
                  });

                  map.current.on("mouseleave", "restaurants", () => {
                    map.current.getCanvas().style.cursor = "";
                  });

                  // Zoom into a cluster on click
                  map.current.on("click", "clusters", (e) => {
                    const features = map.current.queryRenderedFeatures(
                      e.point,
                      {
                        layers: ["clusters"],
                      }
                    );
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

                  // When a restaurant is clicked open a popup with info about it,
                  // and highlight it in the sidebar list
                  map.current.on("click", (e) => {
                    const features = map.current.queryRenderedFeatures(
                      e.point,
                      {
                        layers: ["restaurants"],
                      }
                    );

                    // If you click on a restaurant marker
                    if (features && features.length) {
                      clickedOnRestaurantPopup.current = true;
                    } else {
                      clickedOnRestaurantPopup.current = false;
                      return; // Return, otherwise the below consts will throw an error
                    }

                    const id = features[0].properties.id;
                    const name = features[0].properties.name;
                    const slug = features[0].properties.slug;
                    const coordinates =
                      features[0].geometry.coordinates.slice();
                    const address = features[0].properties.address;
                    const address_url = features[0].properties.address_url;
                    const popups =
                      document.getElementsByClassName("maplibregl-popup");

                    if (popups.length) {
                      [...popups].map((popup) => popup.remove());
                    }

                    // map.current.easeTo({ center: coordinates });

                    let popup = new maplibregl.Popup()
                      .setLngLat(coordinates)
                      .setHTML(
                        `<b>${name}</b><br>
                     <a href="${address_url}" target="_blank">Address: ${address}</a><br><br>
                     <a href="/restaurants/${slug}" target="_blank" style="color:blue !important;">View more info</a>
                    `
                      )
                      .addTo(map.current);

                    setIsActive(id);

                    // clickedOnRestaurantPopup.current check is needed because setIsActive runs first and then popup.on('close') fires,
                    // so if you click on a restaurant marker while another marker was already open, then it runs setIsActive for the new marker,
                    // but then immediately fires the close event for the previous marker and runs setIsActive("").
                    popup.on("close", () => {
                      if (clickedOnRestaurantPopup.current) return;
                      setIsActive("");
                    });

                    // Separate closeButton event because clickedOnRestaurantPopup.current returns 'true' when
                    // you click on the close button because you're not actually clicking on the map.
                    popup._closeButton.onclick = () => {
                      clickedOnRestaurantPopup.current = false;
                      setIsActive("");
                    };

                    popup._container.onwheel = (e) => {
                      map.current.scrollZoom.wheel(e);
                    };
                  });

                  map.current.on("moveend", () => {
                    if (searchedRestaurantSelected.current) {
                      searchedRestaurantSelected.current = false;
                      return;
                    }

                    if (clickedOnRestaurantPopup.current) {
                      return;
                    }
                  });

                  geoJsonData.current = json.geoJsonData;
                  setSearchResults(json.geoJsonData);
                  searchResultsRef.current = json.geoJsonData;
                  // geolocate.current.trigger();
                })
                .catch((error) => {
                  console.error("Error fetching restaurant data:", error);
                });
            }
          );
        });

        map.current.addControl(new maplibregl.NavigationControl(), "top-right");

        geolocate.current = new maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          fitBoundsOptions: { maxZoom: 14, animate: false },
          showAccuracyCircle: false,
          showUserLocation: false,
        });

        map.current.addControl(geolocate.current);

        /**** Not sure if this is needed in the new method. 
              The map currently works without it..

        // Only once because geolocate event randomly fires even if nothing is happening.
        // Only fires on map load
        geolocate.current.once("geolocate", (e) => {
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
        ****/

        /**** Location search bar.
        const geocoder = new MapboxGeocoder({
          accessToken:
          "pk.eyJ1IjoiaGFza2FyMSIsImEiOiJjbHN1ZHNtbXoxMWV2MnJxbnEyeGNrYW5hIn0.CIAJP91YnRMDk-Fc0jeevg",
          types: "country,region,postcode,district,place,locality,neighborhood",
          placeholder: "Search Location",
        });
          
        geocoder.addTo(".map");

        geocoder.on("result", (e) => {
          const bbox = e.result.bbox;
          const center = e.result.center;
          const lat = e.result.center[1];
          const lon = e.result.center[0];

          if (bbox) {
            map.current.fitBounds(bbox, { animate: false });
            map.current.jumpTo({ center: center });
          } else {
            map.current.jumpTo({ center: center, zoom: 14 });
          }
          fetchStores(lat, lon);
          clickedOnRestaurantPopup.current = false;
        });

        geocoder.on("loading", (e) => {
          if (isMobile) {
            bottomSheetRef.current?.snapTo(({ headerHeight }) => headerHeight);
          }
        });

        const geocoderInput = document.querySelector(
          ".mapboxgl-ctrl-geocoder--input"
        );
        const geocoderCloseBtn = document.querySelector(
          ".mapboxgl-ctrl-geocoder--button"
        );
        geocoderInput?.addEventListener("focus", () => {
          if (geocoderInput.value !== "") {
            geocoderCloseBtn.style.display = "block";
          } else {
            geocoderCloseBtn.style.display = "none";
          }
        });
        geocoderInput?.addEventListener("change", () => {
          if (geocoderInput.value !== "") {
            geocoderCloseBtn.style.display = "block";
          } else {
            geocoderCloseBtn.style.display = "none";
          }
        });
        geocoderInput?.addEventListener("blur", () => {
          if (geocoderInput.value !== "") {
            geocoderCloseBtn.style.display = "block";
          } else {
            geocoderCloseBtn.style.display = "none";
          }
        });
        
        // Populate the location search bar with the searched location's name.
        if (location) {
          geocoder.setInput(json.features[0].properties?.full_address);
        }
        ******/

        setSearchedLocation(json.features[0]);
        setIsMapLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching restaurant data:", error);
      });
  }, []);

  /******
  // Update map results on move
  useEffect(() => {
    if (!map?.current || !isMapLoaded) return;
    map.current.off("moveend", delaySearchArea);
    map.current.on("moveend", delaySearchArea);
    return () => {
      map.current.off("moveend", delaySearchArea);
    };
  }, [isMapLoaded]);

  function delaySearchArea() {
    if (bottomSheetSnapping.current) return;

    const timeoutId = setTimeout(() => {
      // Use last known position in case user has physically moved to another location,
      // so it sets lat and lon to actual current position to get accurate distances to restaurants
      if (geolocate.current._lastKnownPosition) {
        const lat = geolocate.current._lastKnownPosition.coords.latitude;
        const lon = geolocate.current._lastKnownPosition.coords.longitude;
        setLat(lat);
        setLon(lon);
        fetchStores(lat, lon);
      } else {
        // User doesn't want to share location, so use the default lat and lon
        fetchStores(lat, lon);
      }
      // When you click on the search area button, the restaurant popup closes if it's open
      clickedOnRestaurantPopup.current = false;
    }, 0); // adjust delay time as needed
    map.current.once("movestart", () => {
      clearTimeout(timeoutId);
    });
  }
  ******/

  function fetchStores(currentLat, currentLon) {
    if (isActive !== "") {
      const popups = document.getElementsByClassName("maplibregl-popup");

      if (popups.length) {
        [...popups].map((popup) => popup.remove());
      }

      setIsActive("");
    }

    const bounds = map.current.getBounds();
    const mapCenter = map.current.getCenter();

    // Fetch restaurants dynamically based on the current viewport
    fetch(
      `/api/get-map-restaurants?bounds=${JSON.stringify(
        bounds
      )}&userLat=${currentLat}&userLon=${currentLon}&mapCenterLat=${
        mapCenter.lat
      }&mapCenterLon=${mapCenter.lng}&limit=${100}`
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        // Save newly fetched restaurants in geoJsonData ref,
        // so it saves all the markers on the map
        const prevRestaurantIds = geoJsonData.current.features?.map(
          (feature) => feature.properties.id
        );
        const newRestaurants = json.geoJsonData.features?.filter(
          (feature) => !prevRestaurantIds?.includes(feature.properties.id)
        );

        if (newRestaurants.length > 0) {
          const newGeoJsonData = {
            ...geoJsonData.current,
            features: [...geoJsonData.current?.features, ...newRestaurants],
          };
          geoJsonData.current = newGeoJsonData;
          map.current.getSource("restaurants").setData(newGeoJsonData);
        }

        // Only the restaurants in the current map bounds will display in search results.
        // If you move the map and the restaurants haven't changed, don't change the search result list.
        // Otherwise, the search result list will keep jumping around based on which restaurant is in the center.
        const prevSearchResultsRestaurantIds =
          searchResultsRef.current?.features.map(
            (feature) => feature.properties.id
          );

        const newSearchResultsRestaurantIds = json.geoJsonData?.features.map(
          (feature) => feature.properties.id
        );

        if (
          prevSearchResultsRestaurantIds.sort().toString() !==
          newSearchResultsRestaurantIds.sort().toString()
        ) {
          searchResultsRef.current = json.geoJsonData;
          setSearchResults(json.geoJsonData);
        }
      })
      .catch((error) => {
        console.error("Error fetching restaurant data:", error);
      });
  }

  function showPopup(restaurant) {
    const id = restaurant.id;
    const name = restaurant.name;
    const coordinates = [restaurant.longitude, restaurant.latitude];
    const address = restaurant.address;
    const address_url = restaurant.address_url;
    const popups = document.getElementsByClassName("maplibregl-popup");

    if (popups.length) {
      [...popups].map((popup) => popup.remove());
    }

    let popup = new maplibregl.Popup()
      .setLngLat(coordinates)
      .setHTML(
        `<b>${name}</b><br>
         <a href="${address_url}" target="_blank">Address: ${address}</a>
        `
      )
      .addTo(map.current);

    // Prevents 'address_url' link inside popup from focusing and having a blue outline on initial load
    popup._content.children[2].blur();

    setIsActive(id);

    // clickedOnRestaurantPopup.current check is needed because setIsActive runs first and then popup.on('close') fires,
    // so if you click on a restaurant marker while another marker was already open, then it runs setIsActive for the new marker,
    // but then immediately fires the close event for the previous marker and runs setIsActive("").
    popup.on("close", () => {
      if (clickedOnRestaurantPopup.current) return;
      setIsActive("");
    });

    // Separate closeButton event because clickedOnRestaurantPopup.current returns 'true' when
    // you click on the close button because you're not actually clicking on the map.
    popup._closeButton.onclick = () => {
      clickedOnRestaurantPopup.current = false;
      setIsActive("");
    };

    popup._container.onwheel = (e) => {
      map.current.scrollZoom.wheel(e);
    };
  }

  return (
    <div className="map-and-sidebar-container">
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
        {!isMapLoaded && (
          <Skeleton
            sx={{
              height: "100vh",
              width: "100%",
              bgcolor: "rgba(246,241,228,0.65)",
              marginTop: "-100vh",
            }}
            variant="rectangular"
          />
        )}
      </div>

      <MapSidebar
        map={map}
        lat={lat}
        lon={lon}
        // showDistance={showDistance}
        // setShowDistance={setShowDistance}
        // showDistanceBtnIsDisabled={showDistanceBtnIsDisabled}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        isActive={isActive}
        setIsActive={setIsActive}
        showPopup={showPopup}
        clickedOnRestaurantPopup={clickedOnRestaurantPopup}
        searchedRestaurantSelected={searchedRestaurantSelected}
        bottomSheetRef={bottomSheetRef}
        bottomSheetSnapping={bottomSheetSnapping}
        searchedLocation={searchedLocation}
      />
    </div>
  );
}
