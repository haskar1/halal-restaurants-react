export default async function getMapboxLocationInfo(location) {
  try {
    let locationInfo;
    let locationRestaurantsGeoJSON;

    // Fetch location properties (coordinates) from Mapbox API
    const locationResponse = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${location}&proximity=ip&access_token=pk.eyJ1IjoiaGFza2FyMSIsImEiOiJjbHN1ZHNtbXoxMWV2MnJxbnEyeGNrYW5hIn0.CIAJP91YnRMDk-Fc0jeevg`
    );
    const locationJson = await locationResponse.json();
    locationInfo = locationJson.features[0];

    const mapCenterLat = locationInfo.properties?.coordinates.latitude;
    const mapCenterLon = locationInfo.properties?.coordinates.longitude;

    // Fetch location's restaurants from database
    if (mapCenterLat && mapCenterLon) {
      const restaurantResponse = await fetch(
        `https://whoishalal.com/api/get-map-restaurants?latitude=${mapCenterLat}&longitude=${mapCenterLon}&limit=100`
      );
      const restaurantJson = await restaurantResponse.json();
      locationRestaurantsGeoJSON = restaurantJson.geoJsonData;
    }

    return { locationRestaurantsGeoJSON, locationInfo };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { locationRestaurantsGeoJSON: undefined, locationInfo: undefined };
  }
}
