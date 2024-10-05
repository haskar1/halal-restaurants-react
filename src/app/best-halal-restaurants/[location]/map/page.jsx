"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Map from "@/components/Map-maplibre";
import getMapboxLocationInfo from "@/utils/get-mapbox-location-info";

export default function MapPage() {
  const [locationInfo, setLocationInfo] = useState(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState(
    JSON.parse(sessionStorage.getItem("filteredRestaurants")) || null
  );
  const params = useParams();

  // useEffect(() => {
  //   fetch(
  //     `https://api.mapbox.com/search/geocode/v6/forward?q=${location}&proximity=ip&access_token=${process.env.MAPBOX_GEOCODER}`
  //   )
  //     .then((res) => res.json())
  //     .then((locationData) => {
  //       console.log("locationData: ", locationData);
  //       let mapCenterLat;
  //       console.log("mapCenterLat: ", mapCenterLat);

  //       let mapCenterLon;

  //       if (locationData?.features?.length > 0) {
  //         setLocationInfo(locationData?.features[0]);
  //         mapCenterLat =
  //           locationData?.features[0]?.properties?.coordinates.latitude;
  //         mapCenterLon =
  //           locationData?.features[0]?.properties?.coordinates.longitude;
  //         console.log("mapCenterLat: ", mapCenterLat);
  //       }

  //       console.log("mapCenterLat: ", mapCenterLat);

  //       // Fetch location's restaurants from database
  //       if (mapCenterLat && mapCenterLon) {
  //         fetch(
  //           `/api/get-map-restaurants?latitude=${mapCenterLat}&longitude=${mapCenterLon}&limit=100`
  //         )
  //           .then((res) => res.json())
  //           .then((restaurantsData) => {
  //             setFilteredRestaurants(
  //               JSON.parse(sessionStorage.getItem("filteredRestaurants")) ||
  //                 restaurantsData.geoJsonData ||
  //                 null
  //             );
  //           })
  //           .catch((error) => {
  //             console.error("Error fetching data:", error);
  //           });
  //       }
  //     });
  // }, []);

  useEffect(() => {
    async function fetchData() {
      const location = await getMapboxLocationInfo(params.location);
      const locationInfo = location?.locationInfo;
      const locationRestaurants = location?.locationRestaurantsGeoJSON;

      if (locationInfo) setLocationInfo(locationInfo);

      if (locationRestaurants) {
        setFilteredRestaurants(
          JSON.parse(sessionStorage.getItem("filteredRestaurants")) ||
            locationRestaurants ||
            null
        );
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {/* <button onClick={() => router.back()}>Back</button> */}
      {/* Render the map with the passed props */}
      <Map locationInfo={locationInfo} searchResults={filteredRestaurants} />
    </>
  );
}

// import Map from "@/components/Map-maplibre";
// import getMapboxLocationInfo from "@/utils/get-mapbox-location-info";

// export default async function MapPage({ params }) {
//   const location = await getMapboxLocationInfo(params.location);
//   const locationInfo = location?.locationInfo || null;
//   const locationRestaurants = location?.locationRestaurantsGeoJSON || null;
//   const filteredRestaurants =
//     JSON.parse(sessionStorage.getItem("filteredRestaurants")) ||
//     locationRestaurants ||
//     null;

//   return (
//     <>
//       {/* <button onClick={() => router.back()}>Back</button> */}
//       {/* Render the map with the passed props */}
//       <Map locationInfo={locationInfo} searchResults={filteredRestaurants} />
//     </>
//   );
// }
