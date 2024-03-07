import { AsyncTypeahead, Menu, MenuItem } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import { useState } from "react";

// Searchbar that searches the database for restaurants
export default function CustomTypehead({
  map,
  showPopup,
  setSearchResults,
  searchedRestaurantSelected,
  lat,
  lon,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [GeoJSON, setGeoJSON] = useState({});

  return (
    <div className="typeahead-container">
      <AsyncTypeahead
        id="typeahead-result-list"
        placeholder="Search Restaurants"
        isLoading={isLoading}
        labelKey={(option) => `${option.name}`}
        onSearch={(query) => {
          setIsLoading(true);
          fetch(
            `http://localhost:9000/search/searchbar?q=${query}&lat=${lat}&lon=${lon}`
          )
            .then((resp) => resp.json())
            .then((json) => {
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
            showPopup(selected[0]);
            searchedRestaurantSelected.current = true;
          }
        }}
        renderMenu={(results) => {
          return isLoading ? (
            <div>
              <span>Loading...</span>
            </div>
          ) : (
            <Menu id="typeahead-menu" emptyLabel="Restaurant not found">
              {results.map((result, index) => (
                <MenuItem key={index} option={result} position={index}>
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
