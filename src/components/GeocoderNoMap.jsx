"use client";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GeocoderNoMap() {
  const router = useRouter();

  useEffect(() => {
    const geocoder = new MapboxGeocoder({
      accessToken:
        "pk.eyJ1IjoiaGFza2FyMSIsImEiOiJjbHN1ZHNtbXoxMWV2MnJxbnEyeGNrYW5hIn0.CIAJP91YnRMDk-Fc0jeevg",
      types: "country,region,postcode,district,place,locality,neighborhood",
      placeholder: "Search a location",
    });

    document.querySelector("#geocoder").textContent = "";
    geocoder.addTo("#geocoder");

    geocoder.on("result", (e) => {
      const bbox = e.result?.bbox;
      const center = e.result?.center;

      router.push(`/search?bbox=${bbox}&center=${center}`);
    });
  }, []);

  return <div id="geocoder">Loading...</div>;
}
