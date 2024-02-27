import { useRef, useState } from "react";
import CustomTypehead from "./CustomTypehead";
import SearchResultsList from "./SearchResultsList";
import maplibregl from "maplibre-gl";
import SearchResultsFilters from "./SearchResultsFilters";

export default function Sidebar({
  map,
  isMapLoaded,
  lat,
  lon,
  zoom,
  showDistance,
  setShowDistance,
  showDistanceBtnIsDisabled,
  showSearchButton,
  setShowSearchButton,
  searchResults,
  setSearchResults,
  isActive,
  setIsActive,
}) {
  const clickedOnRestaurant = useRef(false);

  function showPopup(restaurant) {
    const id = restaurant.id;
    const coordinates = [restaurant.longitude, restaurant.latitude];
    const name = restaurant.name;
    const address = restaurant.address;
    const address_url = restaurant.address_url;
    const popups = document.getElementsByClassName("maplibregl-popup");

    clickedOnRestaurant.current = true;

    if (popups.length) {
      [...popups].map((popup) => popup.remove());
    }

    map.current.easeTo({ center: coordinates, zoom: zoom });

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
  }

  return (
    <div className="sidebar">
      <CustomTypehead
        map={map}
        lat={lat}
        lon={lon}
        showPopup={showPopup}
        setSearchResults={setSearchResults}
        isMapLoaded={isMapLoaded}
      />
      <SearchResultsFilters
        showDistance={showDistance}
        setShowDistance={setShowDistance}
        showDistanceBtnIsDisabled={showDistanceBtnIsDisabled}
      />
      <SearchResultsList
        map={map}
        isMapLoaded={isMapLoaded}
        lat={lat}
        lon={lon}
        isActive={isActive}
        setIsActive={setIsActive}
        clickedOnRestaurant={clickedOnRestaurant}
        showPopup={showPopup}
        showDistance={showDistance}
        showSearchButton={showSearchButton}
        setShowSearchButton={setShowSearchButton}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
      />
    </div>
  );
}
