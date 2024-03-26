import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export default function SearchResultsFilters({
  showDistance,
  setShowDistance,
  showDistanceBtnIsDisabled,
}) {
  return (
    <FormGroup>
      {!showDistanceBtnIsDisabled && (
        <FormControlLabel
          // class p-2 is tailwind padding 0.5rem
          className="p-2 text-black"
          control={
            <Switch
              checked={showDistance}
              onChange={() => setShowDistance(!showDistance)}
            />
          }
          label="Show Distance"
        />
      )}
    </FormGroup>
  );
}
