// import dynamic from "next/dynamic";
// import { useMemo } from "react";
import getMapboxLocationInfo from "@/utils/get-mapbox-location-info";
import SearchResultsList from "@/components/SearchResultsList";
import styles from "./styles.module.css";
import "@/stylesheets/map.scss";

// export const metadata = {
// title: "Best Halal Restaurants in [location]",
// };

export const dynamicParams = true;
export const fetchCache = "force-no-store";

export default async function Location({ params }) {
  const location = await getMapboxLocationInfo(params.location);

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
      {location && (
        <h1 className={styles.title}>
          Best Halal Restaurants in {location.locationInfo.properties?.name}
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
