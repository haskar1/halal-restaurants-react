"use client";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import styles from "../app/best-halal-restaurants/[location]/styles.module.css";

export default function FilterCuisines({
  cuisines,
  selectedCuisines,
  setSelectedCuisines,
}) {
  const handleChange = (e, cuisine) => {
    let updatedSelectedCuisines;
    if (e.target.checked) {
      updatedSelectedCuisines = [...selectedCuisines, cuisine];
    } else {
      updatedSelectedCuisines = selectedCuisines.filter((c) => c !== cuisine);
    }
    setSelectedCuisines(updatedSelectedCuisines);
  };

  return (
    <>
      {cuisines.length > 0 && (
        <div className={styles.filter_category}>
          <p className={styles.filter_category_title}>Cuisines</p>
          <FormGroup className="py-2 gap-8 md:gap-3">
            {cuisines.map((cuisine) => (
              <FormControlLabel
                key={cuisine}
                control={
                  <Checkbox
                    checked={selectedCuisines.includes(cuisine)} // Sync checkbox state with selected cuisines
                    onChange={(e) => handleChange(e, cuisine)}
                  />
                }
                label={cuisine}
                className="text-lg"
              />
            ))}
          </FormGroup>
        </div>
      )}
    </>
  );
}
