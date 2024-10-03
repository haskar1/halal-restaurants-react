// import dynamic from "next/dynamic";
// import { useMemo } from "react";
import getMapboxLocationInfo from "@/utils/get-mapbox-location-info";
import SearchResultsList from "@/components/SearchResultsList";
import styles from "./styles.module.css";
import "@/stylesheets/map.scss";

export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function generateMetadata({ params }) {
  const location = await getMapboxLocationInfo(params.location);
  const locationName = location.locationInfo?.properties.name;

  // Location found
  if (locationName) {
    return {
      title: `Best Halal Restaurants in ${locationName}`,
    };
  }

  // Location not found

  return {
    title: `Location Not Found`,
  };
}

export default async function Location({ params }) {
  const location = await getMapboxLocationInfo(params.location);
  const locationName = location.locationInfo?.properties.name;

  // const Map = useMemo(
  //   () =>
  //     dynamic(() => import("@/components/Map-maplibre"), {
  //       loading: () => <p className="p-8">Loading Map...</p>,
  //       ssr: true,
  //     }),
  //   []
  // );

  return (
    <>
      {locationName ? (
        <h1 className={styles.title}>
          Best Halal Restaurants in {locationName}
        </h1>
      ) : (
        <h1 className="container flex justify-center items-center h-[calc(100vh-64px)]">
          Location Not Found
        </h1>
      )}
      <div className="container">
        <SearchResultsList
          locationInfo={location.locationInfo}
          searchResults={location.locationRestaurantsGeoJSON}
        />
      </div>
    </>
  );
}
