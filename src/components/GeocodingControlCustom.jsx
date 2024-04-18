import { GeocodingControl } from "@maptiler/geocoding-control/react";
import "@maptiler/geocoding-control/style.css";

export default function GeocodingControlCustom({
  map,
  mapController,
  fetchStores,
  bottomSheetRef,
  clickedOnRestaurantPopup,
  isMobile,
}) {
  return (
    <div className="geocoding">
      <GeocodingControl
        apiKey={process.env.NEXT_PUBLIC_MAPTILER_API_KEY}
        mapController={mapController}
        proximity={[{ type: "map-center" }]}
        placeholder="Search Location"
        noResultsMessage="Location not found"
        flyTo={false}
        markerOnSelected={false}
        limit={5}
        types={["poi", "address", "municipal_district", "joint_municipality"]}
        excludeTypes={true}
        onPick={(e) => {
          // check if e is not null, otherwise bug happens where the map glitches when you search location
          if (e) {
            const bbox = e.bbox;
            const center = e.center;
            const lat = e.center[1];
            const lon = e.center[0];

            map.current.fitBounds(bbox, { animate: false });
            map.current.jumpTo({ center: center });
            fetchStores(lat, lon);
            clickedOnRestaurantPopup.current = false;
            if (isMobile) {
              bottomSheetRef.current.snapTo(({ headerHeight }) => headerHeight);
            }
          }
        }}
        onResponse={(e) => {
          if (e.featureCollection.features?.length) {
            e.featureCollection.features.forEach((feature) => {
              console.log(feature);
              feature.place_type.forEach((type) => {
                if (
                  type === "municipality" ||
                  type === "agglomerate" ||
                  type === "region"
                ) {
                  feature.properties.place_type_name[0] = "city";
                }
              });
            });
          }
        }}
      />
    </div>
  );
}
