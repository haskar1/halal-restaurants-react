import { useEffect, useRef, useState } from "react";
import RestaurantSearch from "./RestaurantSearch";
import SearchResultsList from "./SearchResultsList";
import maplibregl from "maplibre-gl";
import SearchResultsFilters from "./SearchResultsFilters";
import { useMediaQuery } from "@mui/material";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";

export default function Sidebar({
  map,
  lat,
  lon,
  showDistance,
  setShowDistance,
  showDistanceBtnIsDisabled,
  searchResults,
  setSearchResults,
  isActive,
  setIsActive,
  clickedOnRestaurantPopup,
  searchedRestaurantSelected,
  bottomSheetSnapping,
  bottomSheetRef,
}) {
  const [bottomSheetIsOpen, setBottomSheetIsOpen] = useState(false);
  const snapPointsRef = useRef([]);

  useEffect(() => {
    setBottomSheetIsOpen(true);
  }, []);

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

  // Only render the bottom modal sheet on mobile
  if (useMediaQuery("(max-width:767px)")) {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        open={bottomSheetIsOpen}
        blocking={false}
        //maxHeight is full screen, maxHeight * 0.5 is middle, and headerHeight is bottom of screen (dragged down position)
        snapPoints={({ maxHeight, headerHeight }) => {
          const snapPoints = [maxHeight, maxHeight * 0.5, headerHeight];
          snapPointsRef.current = snapPoints;
          return snapPoints;
        }}
        onSpringStart={() => {
          bottomSheetSnapping.current = true;
        }}
        onSpringEnd={() => {
          bottomSheetSnapping.current = false;
        }}
        defaultSnap={({ snapPoints }) => snapPoints[1]}
        expandOnContentDrag={true}
        header={
          <>
            <RestaurantSearch
              map={map}
              lat={lat}
              lon={lon}
              showPopup={showPopup}
              setSearchResults={setSearchResults}
              searchedRestaurantSelected={searchedRestaurantSelected}
              bottomSheetRef={bottomSheetRef}
            />
            {searchResults?.features && searchResults.features.length > 0 && (
              <div>
                <span>
                  <b>
                    {searchResults.features.length}{" "}
                    {searchResults.features.length === 1 ? "result" : "results"}
                  </b>
                </span>
              </div>
            )}
          </>
        }
      >
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
      </BottomSheet>
    );
  }

  // Tablet and desktop sidebar
  return (
    <div className="sidebar">
      <RestaurantSearch
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
        isActive={isActive}
        showDistance={showDistance}
        searchResults={searchResults}
      />
    </div>
  );
}
