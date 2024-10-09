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
    const geocoder = new MapboxGeocoder({
      accessToken:
        "pk.eyJ1IjoiaGFza2FyMSIsImEiOiJjbTFpc2Vwdjcwc2swMmlwcWp5dHM2cmE0In0.MsAukE4s3Pej1eq0F9Utjg",
      types: "country,region,postcode,district,place,locality,neighborhood",
      placeholder: "Search a location",
    });

    // document.querySelector("#geocoder").textContent = "";
    geocoder.addTo("#geocoder");

    geocoder.on("result", (e) => {
      const location = e.result?.place_name
        .toLowerCase()
        .replace(/,?\s+/g, "-")
        .replace(/,/g, "-");

      router.push(`/best-halal-restaurants/${location}`);

      setIsLocationLoading(true);
    });

    setIsPageLoading(false);
  }, []);

  return (
    <>
      <input
        placeholder="Loading..."
        className={
          !isPageLoading
            ? "hidden"
            : "w-[19.375rem] h-[36px] rounded text-center"
        }
      ></input>
      <div id="geocoder" className={isPageLoading && "hidden"}>
        {isLocationLoading && (
          <CircularProgress
            size="1.5rem"
            disableShrink
            className="absolute z-10 right-3"
          />
        )}
      </div>
    </>
  );
}
