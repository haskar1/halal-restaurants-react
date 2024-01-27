import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function Map() {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map-maplibre"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div>
      <Map />
    </div>
  );
}
