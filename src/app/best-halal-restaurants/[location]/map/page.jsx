"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Map from "@/components/Map-maplibre";
import getMapboxLocationInfo from "@/utils/get-mapbox-location-info";
import _ from "lodash";

export default function MapPage() {
  const [locationInfo, setLocationInfo] = useState(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState(null);
  const params = useParams();

  useEffect(() => {
    const sessionStorageLocationInfo = JSON.parse(
      sessionStorage.getItem("locationInfo")
    );

    const sessionStorageFilteredRestaurants = JSON.parse(
      sessionStorage.getItem("filteredRestaurants")
    );

    if (!locationInfo && sessionStorageLocationInfo) {
      setLocationInfo(sessionStorageLocationInfo);
    }

    if (!filteredRestaurants && sessionStorageFilteredRestaurants) {
      setFilteredRestaurants(sessionStorageFilteredRestaurants);
    }

    if (params.location) fetchData();

    async function fetchData() {
      const fetchedLocation = await getMapboxLocationInfo(params.location);
      const fetchedLocationInfo = fetchedLocation?.locationInfo;
      const fetchedLocationRestaurants =
        fetchedLocation?.locationRestaurantsGeoJSON;

      if (_.isEqual(fetchedLocationInfo, sessionStorageLocationInfo)) return;

      setLocationInfo(fetchedLocationInfo);
      sessionStorage.setItem(
        "locationInfo",
        JSON.stringify(fetchedLocationInfo)
      );

      setFilteredRestaurants(fetchedLocationRestaurants);
      sessionStorage.setItem(
        "filteredRestaurants",
        JSON.stringify(fetchedLocationRestaurants)
      );

      sessionStorage.setItem("selectedCuisines", JSON.stringify([]));
      sessionStorage.setItem("selectedPrices", JSON.stringify([]));
      sessionStorage.setItem("selectedOthers", JSON.stringify([]));
    }
  }, [params.location]);

  return (
    <>
      <Map
        locationInfo={locationInfo}
        searchResults={filteredRestaurants}
        setSearchResults={setFilteredRestaurants}
      />
    </>
  );
}
