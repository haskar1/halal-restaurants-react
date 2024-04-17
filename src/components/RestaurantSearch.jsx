import {
  AsyncTypeahead,
  ClearButton,
  Highlighter,
} from "react-bootstrap-typeahead";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import { useState } from "react";

// Searchbar that searches the database for restaurants
export default function RestaurantSearch({
  map,
  showPopup,
  setSearchResults,
  searchedRestaurantSelected,
  lat,
  lon,
  bottomSheetRef,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [GeoJSON, setGeoJSON] = useState({});
  const [inputExists, setInputExists] = useState(false);

  function flyToRestaurant(restaurant) {
    map.current.easeTo({
      center: [restaurant.longitude, restaurant.latitude],
      zoom: 15,
    });
  }

  return (
    <div className="typeahead-container">
      <AsyncTypeahead
        id="typeahead-result-list"
        placeholder="Search Restaurants"
        isLoading={isLoading}
        useCache={false}
        labelKey={(option) => `${option.name}`}
        onInputChange={(text) => {
          if (text === "") {
            setInputExists(false);
            return;
          }

          if (!inputExists) {
            setInputExists(true);
          }
        }}
        // onFocus={() => {
        //   bottomSheetRef.current.snapTo(({ maxHeight }) => maxHeight);
        // }}
        onSearch={(query) => {
          const mapCenter = map.current.getCenter();

          setIsLoading(true);
          fetch(
            `/api/get-searchbar-restaurants?q=${JSON.stringify(
              query
            )}&userLat=${lat}&userLon=${lon}&mapCenterLat=${
              mapCenter.lat
            }&mapCenterLon=${mapCenter.lng}`
          )
            .then((res) => res.json())
            .then((data) => {
              const json = data.geoJsonData;
              const restaurants = json.features.map(
                (feature) => feature.properties
              );
              setOptions(restaurants);

              if (!GeoJSON.type) {
                setGeoJSON(json); // First call to set GeoJSON
                setIsLoading(false);
                return;
              }

              let newGeoJsonFeatures = GeoJSON.features.slice();

              // Checks if newly searched restaurant(s) already exist in GeoJSON
              Object.entries(json)[1][1].forEach((feature) => {
                let itemAlreadyExists = false;
                Object.entries(GeoJSON)[1][1].forEach((GeoJsonFeature) => {
                  if (feature.properties.id === GeoJsonFeature.properties.id) {
                    itemAlreadyExists = true;
                    return;
                  }
                });
                if (!itemAlreadyExists) {
                  newGeoJsonFeatures.push(feature);
                }
              });

              // Adds restaurant(s) to GeoJSON if they're not already in there
              if (newGeoJsonFeatures !== GeoJSON.features) {
                setGeoJSON({
                  ...GeoJSON,
                  features: newGeoJsonFeatures,
                });
              }

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
          if (selected.length > 0) {
            const updatedFeatures = GeoJSON.features.filter(
              (feature) => feature.properties.id === selected[0].id
            );

            const updatedGeoJSON = {
              ...GeoJSON,
              features: updatedFeatures,
            };

            map.current.getSource("restaurants").setData(updatedGeoJSON);
            setSearchResults(updatedGeoJSON);
            flyToRestaurant(selected[0]);
            showPopup(selected[0]);
            searchedRestaurantSelected.current = true;
          }
        }}
        renderMenuItemChildren={(option, props) => (
          <div key={option.id}>
            <Highlighter search={props.text}>{option.name}</Highlighter>
            {" - "}
            {option.address}
          </div>
        )}
      >
        {({ onClear }) => (
          <div className="rbt-aux">
            {inputExists && <ClearButton onClick={onClear} />}
          </div>
        )}
      </AsyncTypeahead>
    </div>
  );
}
