import { AsyncTypeahead, Menu, MenuItem } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import { useState } from "react";

// Searchbar that searches the database for restaurants
export default function CustomTypehead({ showPopup }) {
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
          selected.length > 0 && showPopup(selected[0]);
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
                    showPopup(result);
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
