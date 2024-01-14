import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function Map() {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div>
      <Map defaultPosition={[51.505, -0.09]} zoom={13} />
    </div>
  );
}
