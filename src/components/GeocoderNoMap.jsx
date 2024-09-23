"use client";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GeocoderNoMap() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const geocoder = new MapboxGeocoder({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_GEOCODER,
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
    });

    setIsLoading(false);
  }, []);

  return (
    <>
      <input
        placeholder="Loading..."
        className={
          !isLoading ? "hidden" : "w-[19.375rem] h-[36px] rounded text-center"
        }
      ></input>
      <div id="geocoder" className={isLoading && "hidden"}></div>
    </>
  );
}
