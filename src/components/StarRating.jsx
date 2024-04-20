import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

export default function StarRating({ rating }) {
  if (!rating) return null;

  return (
    <div className="flex flex-wrap gap-2 h-fit">
      <Typography component="legend" fontSize={"1.1rem"}>
        {rating}
      </Typography>
      <Rating
        name="rating-read-only"
        value={rating}
        defaultValue={0}
        precision={0.1}
        readOnly
      />
    </div>
  );
}
