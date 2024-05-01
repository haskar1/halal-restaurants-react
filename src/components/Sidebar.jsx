import { useEffect, useRef, useState } from "react";
import RestaurantSearch from "./RestaurantSearch";
import SearchResultsList from "./SearchResultsList";
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
  showPopup,
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

  // Only render the bottom modal sheet on mobile
  if (useMediaQuery("(max-width:767px)")) {
    // Make the bottom of the map bounds end at the top of headerHeight (snapPointsRef[2]),
    // so that restaurants will only be fetched in the visible map area.
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
  } else {
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
          setIsActive={setIsActive}
          showDistance={showDistance}
          searchResults={searchResults}
          showPopup={showPopup}
          clickedOnRestaurantPopup={clickedOnRestaurantPopup}
        />
      </div>
    );
  }
}
