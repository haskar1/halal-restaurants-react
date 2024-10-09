"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Map from "@/components/Map-maplibre";
import getMapboxLocationInfo from "@/utils/get-mapbox-location-info";
import _ from "lodash";

export default function MapPage() {
  const [locationInfo, setLocationInfo] = useState(
    JSON.parse(sessionStorage.getItem("locationInfo")) || null
  );
  const [filteredRestaurants, setFilteredRestaurants] = useState(
    JSON.parse(sessionStorage.getItem("filteredRestaurants")) || null
  );
  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      const fetchedLocation = await getMapboxLocationInfo(params.location);
      const fetchedLocationInfo = fetchedLocation?.locationInfo;
      const fetchedLocationRestaurants =
        fetchedLocation?.locationRestaurantsGeoJSON;

      if (_.isEqual(fetchedLocationInfo, locationInfo)) return;

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
    fetchData();
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
