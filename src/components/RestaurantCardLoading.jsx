import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function RestaurantCardLoading() {
  return (
    <div className="restaurant-card-loading">
      <Stack spacing={1}>
        {/* For variants, adjust the size with `width` and `height` */}
        <Skeleton variant="rounded" height={250} />
        {/* For variant="text", adjust the height via font-size */}
        <Skeleton variant="text" sx={{ fontSize: "1rem", width: "100%" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem", width: "70%" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem", width: "70%" }} />
      </Stack>
    </div>
  );
}
