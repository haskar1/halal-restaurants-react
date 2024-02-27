import { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";

export default function SearchResultsList({
  map,
  isMapLoaded,
  lat,
  lon,
  isActive,
  setIsActive,
  clickedOnRestaurant,
  showPopup,
  showDistance,
  showSearchButton,
  setShowSearchButton,
  searchResults,
  setSearchResults,
}) {
  // const [searchResults, setSearchResults] = useState({});

  useEffect(() => {
    if (isMapLoaded.current) {
      map.current.on("load", () => {
        // Add an image to use as a custom marker
        map.current.loadImage(
          "https://maplibre.org/maplibre-gl-js/docs/assets/custom_marker.png",

          (error, image) => {
            if (error) throw error;

            if (!map.current.getImage("custom-marker")) {
              map.current.addImage("custom-marker", image);
            }

            const initialBounds = map.current.getBounds();

            fetch(
              `http://localhost:9000/search?bounds=${JSON.stringify(
                initialBounds
              )}&lat=${lat}&lon=${lon}
              `
            )
              .then((res) => {
                return res.json();
              })
              .then((json) => {
                if (!map.current.getSource("restaurants")) {
                  map.current.addSource("restaurants", {
                    type: "geojson",
                    data: json,
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

                map.current.on("mouseenter", "restaurants", () => {
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

                  // /* If you click on a restaurant marker */
                  if (features && features.length) {
                    clickedOnRestaurant.current = true;
                  } else {
                    clickedOnRestaurant.current = false;
                    return; // Return, otherwise the below consts will throw an error
                  }

                  const id = features[0].properties.id;
                  const name = features[0].properties.name;
                  const coordinates = features[0].geometry.coordinates.slice();
                  const address = features[0].properties.address;
                  const address_url = features[0].properties.address_url;
                  const popups =
                    document.getElementsByClassName("maplibregl-popup");

                  if (popups.length) {
                    [...popups].map((popup) => popup.remove());
                  }

                  map.current.easeTo({ center: coordinates });

                  let popup = new maplibregl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(
                      `${name}<br><a href="${address_url}" target="_blank">Address: ${address}</a>`
                    )
                    .addTo(map.current);

                  setIsActive(id);

                  // clickedOnRestaurant.current check is needed because setIsActive runs first and then popup.on('close') fires,
                  // so if you click on a restaurant marker while another marker was already open, then it runs setIsActive for the new marker,
                  // but then immediately fires the close event for the previous marker and runs setIsActive("").
                  popup.on("close", () => {
                    if (clickedOnRestaurant.current) return;
                    setIsActive("");
                  });

                  // Separate closeButton event because clickedOnRestaurant.current returns 'true' when
                  // you click on the close button because you're not actually clicking on the map.
                  popup._closeButton.onclick = () => {
                    setIsActive("");
                  };

                  // Doesn't work. It's supposed to let you zoom map when mouse is over the popup
                  // popup.on("wheel", (e) => {
                  //   map.current.scrollZoom.wheel(e);
                  // });
                });

                map.current.on("moveend", () => {
                  if (showSearchButton === false) {
                    setShowSearchButton(true);
                  }
                });

                setSearchResults(json);
              })
              .catch((error) => {
                console.error("Error fetching restaurant data:", error);
              });
          }
        );
        isMapLoaded.current = false;
      });
    }
  }, []);

  function flyToStore(currentFeature) {
    map.current.easeTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15,
    });
  }

  return (
    <>
      <div className="search-list">
        <div id="listings" className="listings">
          {searchResults.features &&
            searchResults.features.map((restaurant) => (
              <div
                key={restaurant.properties.id}
                id={restaurant.properties.id}
                className={
                  isActive === restaurant.properties.id ? "item active" : "item"
                }
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
                        showPopup(restaurant.properties);
                      }
                    });
                  }}
                >
                  <span className="text-[#003089]">
                    {restaurant.properties.name}
                  </span>
                  <span>{restaurant.properties.address}</span>
                  {showDistance && (
                    <span>
                      <strong>{restaurant.properties.distance} miles</strong>
                    </span>
                  )}
                </a>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
