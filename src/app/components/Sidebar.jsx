import { useEffect, useRef, useState } from "react";
import CustomTypehead from "./CustomTypehead";
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
  bottomSheetSnapped,
  mapBounds,
  mobileSidebarBottomSheetIsSnapping,
  snapPoint,
}) {
  // Bottom modal drawer open state. useEffect to open it smoothly on mount
  const [open, setOpen] = useState(false);
  const sheetRef = useRef();
  const snapPointsRef = useRef([]);

  useEffect(() => {
    setOpen(true);
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

  // Only render the bottom modal sheet on mobile
  if (useMediaQuery("(max-width:767px)")) {
    return (
      <div className="sidebar">
        <BottomSheet
          ref={sheetRef}
          open={open}
          blocking={false}
          snapPoints={({ minHeight, maxHeight, headerHeight }) => {
            const snapPoints = [minHeight, maxHeight * 0.5, headerHeight];
            snapPointsRef.current = snapPoints;
            return snapPoints;
          }}
          onSpringStart={() => {
            const transitionFrom = sheetRef.current.height;
            mobileSidebarBottomSheetIsSnapping.current = true;

            requestAnimationFrame(() => {
              if (transitionFrom === sheetRef.current.height) return;

              if (
                sheetRef.current.height === Math.round(snapPointsRef.current[2])
              ) {
                snapPoint.current = 2;

                map.current.fitBounds([
                  [mapBounds.current._sw.lng, mapBounds.current._sw.lat],
                  [mapBounds.current._ne.lng, mapBounds.current._ne.lat],
                ]);
              }

              if (
                sheetRef.current.height ===
                  Math.round(snapPointsRef.current[0]) ||
                sheetRef.current.height === Math.round(snapPointsRef.current[1])
              ) {
                snapPoint.current = 1;

                const newMapBounds = {
                  ...mapBounds.current,
                };

                const south = newMapBounds._sw.lat;
                const west = newMapBounds._sw.lng;
                const north = newMapBounds._ne.lat;
                const east = newMapBounds._ne.lng;

                const newSouth = south - (north - south);

                map.current.fitBounds([
                  [west, newSouth],
                  [east, north],
                ]);
              }

              bottomSheetSnapped.current = true;
            });
          }}
          onSpringEnd={() => {
            mobileSidebarBottomSheetIsSnapping.current = false;
          }}
          defaultSnap={({ snapPoints }) => snapPoints[1]}
          expandOnContentDrag={true}
          header={
            <CustomTypehead
              map={map}
              lat={lat}
              lon={lon}
              showPopup={showPopup}
              setSearchResults={setSearchResults}
              searchedRestaurantSelected={searchedRestaurantSelected}
            />
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
      </div>
    );
  }

  // Tablet and desktop sidebar
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
