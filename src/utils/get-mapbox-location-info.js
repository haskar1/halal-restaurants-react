"use server";

import { headers } from "next/headers";

export default async function getMapboxLocationInfo(location) {
  try {
    let locationInfo;
    let locationRestaurantsGeoJSON;

    // Fetch location properties (coordinates) from Mapbox API
    const locationResponse = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${location}&proximity=ip&access_token=${process.env.MAPBOX_GEOCODER}`
    );
    const locationJson = await locationResponse.json();
    locationInfo = locationJson.features[0];

    const bbox = locationInfo?.properties?.bbox
      ? JSON.stringify(locationInfo?.properties?.bbox)
      : null;
    const mapCenterLat = locationInfo?.properties?.coordinates.latitude
      ? JSON.stringify(locationInfo?.properties?.coordinates.latitude)
      : null;
    const mapCenterLon = locationInfo?.properties?.coordinates.longitude
      ? JSON.stringify(locationInfo?.properties?.coordinates.longitude)
      : null;

    // Fetch location's restaurants from database
    if (mapCenterLat && mapCenterLon) {
      // const restaurantResponse = await fetch(
      //   `https://whoishalal.com/api/get-map-restaurants?latitude=${mapCenterLat}&longitude=${mapCenterLon}&limit=100`
      // );
      // const restaurantJson = await restaurantResponse.json();
      const host = headers().get("host");
      const protocol =
        process?.env.NODE_ENV === "development" ? "http" : "https";
      let res = await fetch(
        `${protocol}://${host}/api/get-map-restaurants?bbox=${bbox}&latitude=${mapCenterLat}&longitude=${mapCenterLon}&limit=${JSON.stringify(
          50
        )}`
      );
      const restaurantJson = await res.json();
      locationRestaurantsGeoJSON = restaurantJson.geoJsonData;
    }

    return { locationRestaurantsGeoJSON, locationInfo };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { locationRestaurantsGeoJSON: null, locationInfo: null };
  }
}
