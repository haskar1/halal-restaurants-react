import dynamic from "next/dynamic";
import { useMemo } from "react";

export const metadata = {
  title: "Halal Restaurants Map | Who Is Halal",
};

export default function Map() {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map-maplibre"), {
        loading: () => <p className="p-8">Loading Map...</p>,
        ssr: true,
      }),
    []
  );

  return (
    <div>
      <Map />
    </div>
  );
}
