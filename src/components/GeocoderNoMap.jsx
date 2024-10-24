"use client";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

export default function GeocoderNoMap() {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  useEffect(() => {
    if (isPageLoading) {
      setIsPageLoading(false);
    } else {
      const geocoder = new MapboxGeocoder({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_GEOCODER,
        types: "country,region,postcode,district,place,locality,neighborhood",
        placeholder: "Search a location",
      });
      geocoder.addTo("#geocoder");

      geocoder.on("result", (e) => {
        const location = e.result?.place_name
          .toLowerCase()
          .replace(/,?\s+/g, "-")
          .replace(/,/g, "-");

        router.push(`/best-halal-restaurants/${location}`);

        setIsLocationLoading(true);
      });
    }
  }, [isPageLoading]);

  return (
    <>
      {isPageLoading ? (
        <div className="bg-white text-black w-[19.375rem] h-[3.125rem] md:h-[2.25rem] rounded flex items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : (
        <div id="geocoder">
          {isLocationLoading && (
            <CircularProgress
              size="1.5rem"
              disableShrink
              className="absolute z-10 right-3"
            />
          )}
        </div>
      )}
    </>
  );
}
