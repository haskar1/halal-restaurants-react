"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useMediaQuery } from "@mui/material";
import FilterCuisines from "@/components/FilterCuisines";
import FilterPrice from "@/components/FilterPrice";
import FilterOther from "@/components/FilterOther";
import RestaurantCardLoading from "@/components/RestaurantCardLoading";
import Link from "next/link";
import Image from "next/image";
import CuisineTags from "@/components/CuisineTags";
import SearchResultsFilters from "./SearchResultsFilters";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import PlaceIcon from "@mui/icons-material/Place";
import styles from "../app/best-halal-restaurants/[location]/styles.module.css";

export default function SearchResultsList({ locationInfo, searchResults }) {
  const params = useParams();
  const router = useRouter();
  const allRestaurants = searchResults?.features || []; // Original list
  const sessionStoredFilteredRestaurants = JSON.parse(
    sessionStorage.getItem("filteredRestaurants")
  );
  const [filteredRestaurants, setFilteredRestaurants] = useState(
    sessionStoredFilteredRestaurants || searchResults
  );
  const [selectedCuisines, setSelectedCuisines] = useState(
    JSON.parse(sessionStorage.getItem("selectedCuisines")) || []
  );
  const [selectedPrices, setSelectedPrices] = useState(
    JSON.parse(sessionStorage.getItem("selectedPrices")) || []
  );
  const [selectedOthers, setSelectedOthers] = useState(
    JSON.parse(sessionStorage.getItem("selectedOthers")) || []
  );

  // Filters button on mobile
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const handleMobileFiltersOpen = () => setMobileFiltersOpen(true);
  const handleMobileFiltersClose = () => setMobileFiltersOpen(false);
  if (useMediaQuery("(min-width:768px)") && mobileFiltersOpen) {
    handleMobileFiltersClose();
  }

  // Update the filteredRestaurants whenever cuisines or prices or other filters change
  useEffect(() => {
    let updatedRestaurants = allRestaurants;

    // Filter by selected cuisines if any
    if (selectedCuisines.length > 0) {
      updatedRestaurants = updatedRestaurants.filter((restaurant) =>
        restaurant.properties.cuisines.some((cuisine) =>
          selectedCuisines.includes(cuisine.name)
        )
      );
    }

    // Filter by selected prices if any
    if (selectedPrices.length > 0) {
      updatedRestaurants = updatedRestaurants.filter((restaurant) =>
        selectedPrices.includes(restaurant.properties.price)
      );
    }

    // Filter by other options (no alcohol, no pork, hand slaughtered meat) if any
    if (selectedOthers.includes("No Alcohol Served")) {
      updatedRestaurants = updatedRestaurants.filter(
        (restaurant) => restaurant.properties.alcohol_served === "No"
      );
    }

    if (selectedOthers.includes("No Pork Served")) {
      updatedRestaurants = updatedRestaurants.filter(
        (restaurant) => restaurant.properties.pork_served === "No"
      );
    }

    if (selectedOthers.includes("Hand Slaughtered")) {
      updatedRestaurants = updatedRestaurants.filter(
        (restaurant) =>
          restaurant.properties.slaughter_method === "Hand Slaughtered"
      );
    }

    setFilteredRestaurants({
      features: updatedRestaurants,
      type: "FeatureCollection",
    });

    sessionStorage.setItem(
      "filteredRestaurants",
      JSON.stringify({
        features: updatedRestaurants,
        type: "FeatureCollection",
      })
    );
  }, [selectedCuisines, selectedPrices, selectedOthers, allRestaurants]);

  useEffect(() => {
    sessionStorage.setItem("locationInfo", JSON.stringify(locationInfo));
    clearFilters();
  }, [locationInfo]);

  const filtersAreSelected =
    selectedCuisines.length > 0 ||
    selectedPrices.length > 0 ||
    selectedOthers.length > 0;

  function clearFilters() {
    setSelectedCuisines([]); // Reset selected cuisines
    setSelectedPrices([]); // Reset selected prices
    setSelectedOthers([]); // Reset selected other filters
    setFilteredRestaurants(allRestaurants); // Reset the restaurant list to show all restaurants
    sessionStorage.setItem(
      "filteredRestaurants",
      JSON.stringify(allRestaurants)
    );
    sessionStorage.setItem("selectedCuisines", JSON.stringify([]));
    sessionStorage.setItem("selectedPrices", JSON.stringify([]));
    sessionStorage.setItem("selectedOthers", JSON.stringify([]));
  }

  ////// FILTER OPTIONS - DEFINED HERE TO DETERMINE IF FILTERS COMPONENT NEEDS TO BE RENDERED ///////

  //// Cuisines. First, take the list of restaurants and make an array of the cuisine choices, only including unique choices (new Set).
  // Then, filter out the empty string options - if there is no cuisine in the database it shows as "",
  // although all restaurants are required to have a cuisine selected anyway.
  const cuisines = [
    ...new Set(
      allRestaurants.flatMap((restaurant) =>
        restaurant.properties.cuisines.map((cuisine) => cuisine.name)
      )
    ),
  ].filter((cuisine) => cuisine !== "");

  //// Prices. First, take the list of restaurants and make an array of the price choices, only including unique choices (new Set).
  // Then, filter out the empty string options - if there is no price in the database it shows as "".
  const prices = [
    ...new Set(allRestaurants.map((restaurant) => restaurant.properties.price)),
  ].filter((price) => price !== "");

  const others = ["No Alcohol Served", "No Pork Served", "Hand Slaughtered"];

  return (
    <>
      {allRestaurants.length > 0 ? (
        <div>
          <div className={styles.listings_and_filters_container}>
            <div className={styles.filters_map_container}>
              {/* // Map button */}
              <div className={styles.map_btn_container}>
                <Button
                  className={styles.map_btn}
                  onClick={() =>
                    router.push(
                      `/best-halal-restaurants/${params.location}/map`
                    )
                  }
                >
                  Map&nbsp;
                  <PlaceIcon />
                </Button>
              </div>

              {/* // Filters button */}
              {(cuisines.length > 0 ||
                prices.length > 0 ||
                others.length > 0) && (
                <div className={styles.filters_btn_container}>
                  <Button
                    className={styles.filters_btn}
                    onClick={handleMobileFiltersOpen}
                  >
                    Filters&nbsp;
                    {filtersAreSelected ? (
                      `(${
                        selectedCuisines.length +
                        selectedPrices.length +
                        selectedOthers.length
                      })`
                    ) : (
                      <TuneIcon />
                    )}
                  </Button>

                  <Dialog
                    open={mobileFiltersOpen}
                    onClose={handleMobileFiltersClose}
                    scroll="paper"
                    aria-labelledby="filters-title"
                    aria-describedby="filters-content"
                  >
                    <DialogTitle id="filters-title" className="text-2xl">
                      Filters
                      {filtersAreSelected &&
                        ` (${
                          selectedCuisines.length +
                          selectedPrices.length +
                          selectedOthers.length
                        })`}
                    </DialogTitle>
                    <IconButton
                      aria-label="close"
                      onClick={handleMobileFiltersClose}
                      sx={(theme) => ({
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                      })}
                    >
                      <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                      <div id="filters-content" className="grid gap-6 pr-8">
                        <FilterCuisines
                          cuisines={cuisines}
                          selectedCuisines={selectedCuisines}
                          setSelectedCuisines={setSelectedCuisines}
                        />
                        <FilterPrice
                          prices={prices}
                          selectedPrices={selectedPrices}
                          setSelectedPrices={setSelectedPrices}
                        />
                        <FilterOther
                          others={others}
                          selectedOthers={selectedOthers}
                          setSelectedOthers={setSelectedOthers}
                        />
                      </div>
                    </DialogContent>
                    <DialogActions className="flex justify-between">
                      <Button
                        disabled={!filtersAreSelected}
                        color="error"
                        onClick={clearFilters}
                      >
                        Reset
                      </Button>
                      <Button onClick={handleMobileFiltersClose}>Save</Button>
                    </DialogActions>
                  </Dialog>
                </div>
              )}
            </div>

            <div className={styles.restaurant_count}>
              {/* If no filters are selected, show the total number of restaurants found.
                  If filters are selected, show the number of restaurants matching those filters. */}
              {(selectedCuisines.length ||
                selectedPrices.length ||
                selectedOthers.length) &&
              filteredRestaurants.features?.length > 1 ? (
                <p>
                  {filteredRestaurants.features?.length} restaurants match your
                  filters
                </p>
              ) : (selectedCuisines.length ||
                  selectedPrices.length ||
                  selectedOthers.length) &&
                filteredRestaurants.features?.length === 1 ? (
                <p>1 restaurant matches your filters</p>
              ) : (selectedCuisines.length ||
                  selectedPrices.length ||
                  selectedOthers.length) &&
                filteredRestaurants.features?.length === 0 ? (
                <p>No restaurants match your filters</p>
              ) : allRestaurants.length > 1 ? (
                <p>{allRestaurants.length} Restaurants</p>
              ) : allRestaurants.length === 1 ? (
                <p>1 Restaurant</p>
              ) : null}
            </div>

            <SearchResultsFilters
              clearFilters={clearFilters}
              filtersAreSelected={filtersAreSelected}
              cuisines={cuisines}
              selectedCuisines={selectedCuisines}
              setSelectedCuisines={setSelectedCuisines}
              prices={prices}
              selectedPrices={selectedPrices}
              setSelectedPrices={setSelectedPrices}
              others={others}
              selectedOthers={selectedOthers}
              setSelectedOthers={setSelectedOthers}
            />
            {filteredRestaurants.features?.length > 0 && (
              <div className={styles.listings}>
                {filteredRestaurants.features.map((restaurant) => (
                  <Link
                    href={`/restaurants/${restaurant.properties.slug}`}
                    key={restaurant.properties.id}
                    className={styles.item}
                  >
                    <div className="text-black text-2xl font-medium pb-8 leading-[1.3] text-center">
                      {restaurant.properties.name}
                    </div>
                    <div className={styles.img_container}>
                      {restaurant.properties.rating &&
                        restaurant.properties.rating !== "NaN" && (
                          <div className={styles.rating}>
                            {restaurant.properties.rating}
                          </div>
                        )}
                      <Image
                        src={restaurant.properties.cover_photo_url}
                        alt={restaurant.properties.name}
                        className={styles.cover_photo}
                        width="250"
                        height="250"
                      />
                    </div>
                    <div className={styles.text_container}>
                      <div className="grid gap-2 pb-6">
                        <div className="text-[0.9rem]">
                          {restaurant.properties.address}
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center items-center text-[0.9rem]">
                          {restaurant.properties.price && (
                            <p>Price:&nbsp;{restaurant.properties.price}</p>
                          )}
                          {restaurant.properties.halal_status &&
                            restaurant.properties.price && (
                              <span>&middot;</span>
                            )}
                          {restaurant.properties.halal_status && (
                            <p>{restaurant.properties.halal_status}</p>
                          )}
                        </div>

                        {restaurant.properties.cuisines && (
                          <div className={styles.cuisine_tags_container}>
                            <CuisineTags
                              cuisines={restaurant.properties.cuisines}
                            />
                          </div>
                        )}
                      </div>

                      <div className="pb-6">
                        <b>Halal information:</b>{" "}
                        {restaurant.properties.halal_status
                          ? restaurant.properties.halal_status === "Fully Halal"
                            ? `${restaurant.properties.name} is fully halal.`
                            : restaurant.properties.halal_status ===
                                "Partially Halal"
                              ? `${restaurant.properties.name} is partially halal.`
                              : `${restaurant.properties.name} is not halal.`
                          : `It is unknown if ${restaurant.properties.name} is halal.`}{" "}
                        {restaurant.properties.halal_description}
                      </div>

                      {restaurant.properties.summary && (
                        <div>
                          <b>About this restaurant:</b>{" "}
                          {restaurant.properties.summary}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className={styles.message}>No restaurants found in this area</p>
      )}
    </>
  );
}
