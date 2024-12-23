"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import maplibregl from "maplibre-gl";
import MapSidebar from "@/components/MapSidebar";
import { Skeleton } from "@mui/material";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@/stylesheets/map.scss";
import { bbox as turfbbox } from "@turf/bbox";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function Map({ locationInfo, searchResults, setSearchResults }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lon, setLon] = useState(-73.985542);
  const [lat, setLat] = useState(40.757976);
  const zoom = 14;
  // const geoJsonData = useRef({});
  const searchResultsRef = useRef({});
  const [isActive, setIsActive] = useState("");
  const geolocate = useRef(null);
  const clickedOnRestaurantPopup = useRef(false);
  const searchedRestaurantSelected = useRef(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const bottomSheetRef = useRef();
  const bottomSheetSnapping = useRef(false);
  const [showSearchAreaButton, setShowSearchAreaButton] = useState(false);
  const showSearchAreaButtonRef = useRef(false);
  // const [searchedLocation, setSearchedLocation] = useState(
  //   JSON.parse(sessionStorage.getItem("locationInfo")) || null
  // );
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (!locationInfo || !searchResults) return;
    if (map?.current) return; // stops map from initializing more than once
    map.current?.remove();
    map.current = null;

    let bbox = locationInfo?.properties?.bbox;
    let mapCenterLat;
    let mapCenterLon;

    if (locationInfo?.properties?.coordinates) {
      mapCenterLat = locationInfo?.properties?.coordinates.latitude;
      mapCenterLon = locationInfo?.properties?.coordinates.longitude;
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
      minZoom: 3,
      // attributionControl: false,
    });

    // if (map?.current && bbox) {
    //   console.log("jumping..");
    //   map.current.jumpTo({ center: [mapCenterLon, mapCenterLat] });
    // }

    map.current.on("load", () => {
      // Add an image to use as a custom marker
      map.current.loadImage(
        "https://maplibre.org/maplibre-gl-js/docs/assets/custom_marker.png",

        (error, image) => {
          if (error) throw error;

          if (!map.current.getImage("custom-marker")) {
            map.current.addImage("custom-marker", image);
          }

          if (searchResults?.features?.length) {
            let bbox2 = turfbbox(searchResults);
            map.current.fitBounds(
              bbox2,
              { padding: 100 },
              { triggeredByFitBounds: true }
            );
            map.current.on("moveend", (event) => {
              // This is to active the Search Area button. Waits until fitBounds is called, then activates it.
              // Otherwise, the Search Area button would be called automatically when map initializes which we don't want
              if (event.triggeredByFitBounds) {
                setIsMapLoaded(true);
              }
            });

            // map.current.fitBounds(bbox2, { padding: 100 });
          } else {
            // If there are no restaurants found then fitBounds isn't called, so the Search Area button is activated now.
            // Whenever the map is manually moved now, the Search Area button appears
            setIsMapLoaded(true);
          }

          if (map.current.getSource("restaurants")) {
            map.current.getStyle().layers.map((layer) => {
              if (layer.id === "restaurants") {
                map.current.removeLayer("restaurants");
              }
              if (layer.id === "clusters") {
                map.current.removeLayer("clusters");
              }
              if (layer.id === "cluster-count") {
                map.current.removeLayer("cluster-count");
              }
            });

            map.current.removeSource("restaurants");
          }

          map.current.addSource("restaurants", {
            type: "geojson",
            data: searchResults,
            cluster: true,
            clusterMaxZoom: 5, // Max zoom to cluster points on
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
          // }

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

          // When a restaurant is clicked open a popup with info about it,
          // and highlight it in the sidebar list
          map.current.on("click", (e) => {
            const features = map.current.queryRenderedFeatures(e.point, {
              layers: ["restaurants"],
            });

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
            const coordinates = features[0].geometry.coordinates.slice();
            const address = features[0].properties.address;
            const address_url = features[0].properties.address_url;
            const popups = document.getElementsByClassName("maplibregl-popup");

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

          // geoJsonData.current = searchResults;
          searchResultsRef.current = searchResults;
          // geolocate.current.trigger();
          // })
          // .catch((error) => {
          //   console.error("Error fetching restaurant data:", error);
          // });
        }
      );
      // setIsMapLoaded(true);
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

    /**** Location search bar.
        const geocoder = new MapboxGeocoder({
          accessToken: process.env.NEXT_PUBLIC_MAPBOX_GEOCODER,
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
          fetchMapBoundsRestaurants(lat, lon);
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
          geocoder.setInput(locationInfo.properties?.full_address);
        }
        ******/

    // setSearchedLocation(
    //   JSON.parse(sessionStorage.getItem("locationInfo")) || locationInfo
    // );

    return () => {
      map.current.remove();
      map.current = null;
    };
  }, [locationInfo]);
  // }, [locationInfo, searchResults]);

  // Update map results on move
  useEffect(() => {
    if (!map?.current || !isMapLoaded) return;
    map.current.off("moveend", delayShowSearchAreaButton);
    map.current.on("moveend", delayShowSearchAreaButton);
    return () => {
      map?.current?.off("moveend", delayShowSearchAreaButton);
    };
  }, [isMapLoaded, showSearchAreaButton, showSearchAreaButtonRef.current]);

  // function delaySearchArea() {
  //   if (bottomSheetSnapping.current) return;

  //   const timeoutId = setTimeout(() => {
  //     // Use last known position in case user has physically moved to another location,
  //     // so it sets lat and lon to actual current position to get accurate distances to restaurants
  //     if (geolocate.current._lastKnownPosition) {
  //       const lat = geolocate.current._lastKnownPosition.coords.latitude;
  //       const lon = geolocate.current._lastKnownPosition.coords.longitude;
  //       setLat(lat);
  //       setLon(lon);
  //       fetchMapBoundsRestaurants(lat, lon);
  //     } else {
  //       // User doesn't want to share location, so use the default lat and lon
  //       fetchMapBoundsRestaurants(lat, lon);
  //     }
  //     // When you click on the search area button, the restaurant popup closes if it's open
  //     clickedOnRestaurantPopup.current = false;
  //   }, 0); // adjust delay time as needed
  //   map.current.once("movestart", () => {
  //     clearTimeout(timeoutId);
  //   });
  // }

  function fetchMapBoundsRestaurants() {
    if (isActive !== "") {
      const popups = document.getElementsByClassName("maplibregl-popup");

      if (popups.length) {
        [...popups].map((popup) => popup.remove());
      }

      setIsActive("");
    }

    const mapCenter = map.current.getCenter();
    const mapBounds = map.current.getBounds();
    const mapBBOX = [
      mapBounds._sw.lng,
      mapBounds._sw.lat,
      mapBounds._ne.lng,
      mapBounds._ne.lat,
    ];

    // Fetch restaurants dynamically based on the current viewport
    fetch(
      `/api/get-map-on-move-restaurants?bbox=${JSON.stringify(
        mapBBOX
      )}&latitude=${mapCenter.lat}&longitude=${mapCenter.lng}&limit=50`
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        // // Save newly fetched restaurants in geoJsonData ref,
        // // so it saves all the markers on the map
        // const prevRestaurantIds = geoJsonData.current.features?.map(
        //   (feature) => feature.properties.id
        // );
        // const newRestaurants = json.geoJsonData.features?.filter(
        //   (feature) => !prevRestaurantIds?.includes(feature.properties.id)
        // );

        // if (newRestaurants.length > 0) {
        // const newGeoJsonData = {
        //   ...geoJsonData.current,
        //   features: [...geoJsonData.current?.features, ...newRestaurants],
        // };
        // geoJsonData.current = newGeoJsonData;
        // map.current.getSource("restaurants").setData(newGeoJsonData);
        // }

        map.current.getSource("restaurants").setData(json.geoJsonData);

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

    if (showSearchAreaButton) {
      setShowSearchAreaButton(false);
    }
  }

  function delayShowSearchAreaButton() {
    // if (bottomSheetSnapped.current) {
    //   bottomSheetSnapped.current = false;
    //   return;
    // }

    if (!showSearchAreaButton || !showSearchAreaButtonRef.current) {
      const timeoutId = setTimeout(() => {
        setShowSearchAreaButton(true);
        showSearchAreaButtonRef.current = true;
      }, 250);
      map.current.once("movestart", () => {
        clearTimeout(timeoutId);
      });
    }
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
        {/* {!isMapLoaded && (
          <Skeleton
            sx={{
              height: "100vh",
              width: "100%",
              bgcolor: "rgba(246,241,228,0.65)",
              marginTop: "-100vh",
            }}
            variant="rectangular"
          />
        )} */}
        <IconButton
          aria-label="close"
          onClick={() =>
            router.push(`/best-halal-restaurants/${params.location}`)
          }
          sx={(theme) => ({
            position: "absolute",
            zIndex: 1,
            right: 8,
            top: 8,
            color: "black",
            backgroundColor: "white",
          })}
          className="map-close-button"
        >
          <CloseIcon />
        </IconButton>

        {showSearchAreaButton && (
          <button
            type="button"
            className="search-area-btn bg-slate-700"
            onClick={() => {
              fetchMapBoundsRestaurants();
              // When you click on the search area button, the restaurant popup closes if it's open
              clickedOnRestaurantPopup.current = false;
            }}
          >
            Search this area
          </button>
        )}
      </div>

      <MapSidebar
        map={map}
        lat={lat}
        lon={lon}
        searchResults={searchResults}
        isActive={isActive}
        setIsActive={setIsActive}
        showPopup={showPopup}
        clickedOnRestaurantPopup={clickedOnRestaurantPopup}
        searchedRestaurantSelected={searchedRestaurantSelected}
        bottomSheetRef={bottomSheetRef}
        bottomSheetSnapping={bottomSheetSnapping}
        locationInfo={locationInfo}
      />
    </div>
  );
}
