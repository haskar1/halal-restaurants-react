import CustomTypehead from "./CustomTypehead";
import SearchResultsList from "./SearchResultsList";
import maplibregl from "maplibre-gl";
import SearchResultsFilters from "./SearchResultsFilters";

export default function Sidebar({
  map,
  lat,
  lon,
  zoom,
  showDistance,
  setShowDistance,
  showDistanceBtnIsDisabled,
  searchResults,
  setSearchResults,
  isActive,
  setIsActive,
  clickedOnRestaurantPopup,
  searchedRestaurantSelected,
}) {
  function showPopup(restaurant) {
    const id = restaurant.id;
    const coordinates = [restaurant.longitude, restaurant.latitude];
    const name = restaurant.name;
    const address = restaurant.address;
    const address_url = restaurant.address_url;
    const popups = document.getElementsByClassName("maplibregl-popup");

    clickedOnRestaurantPopup.current = true;

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
    <div className="sidebar">
      <CustomTypehead
        map={map}
        lat={lat}
        lon={lon}
        showPopup={showPopup}
        setSearchResults={setSearchResults}
        searchedRestaurantSelected={searchedRestaurantSelected}
      />
      <SearchResultsFilters
        showDistance={showDistance}
        setShowDistance={setShowDistance}
        showDistanceBtnIsDisabled={showDistanceBtnIsDisabled}
      />
      <SearchResultsList
        map={map}
        isActive={isActive}
        showPopup={showPopup}
        showDistance={showDistance}
        searchResults={searchResults}
      />
    </div>
  );
}
