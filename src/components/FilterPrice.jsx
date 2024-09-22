"use client";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import styles from "../app/best-halal-restaurants/[location]/styles.module.css";

export default function FilterPrice({
  prices,
  selectedPrices,
  setSelectedPrices,
}) {
  const handleChange = (e, price) => {
    let updatedSelectedPrices;
    if (e.target.checked) {
      updatedSelectedPrices = [...selectedPrices, price];
    } else {
      updatedSelectedPrices = selectedPrices.filter((p) => p !== price);
    }
    setSelectedPrices(updatedSelectedPrices);
  };

  return (
    <>
      {prices?.length > 0 && (
        <div className={styles.filter_category}>
          <p className={styles.filter_category_title}>Price</p>
          <FormGroup className="py-2 gap-8 md:gap-3">
            {prices.map((price) => (
              <FormControlLabel
                key={price}
                control={
                  <Checkbox
                    checked={selectedPrices.includes(price)} // Sync checkbox state with selected prices
                    onChange={(e) => handleChange(e, price)}
                  />
                }
                label={price}
                className="text-lg"
              />
            ))}
          </FormGroup>
        </div>
      )}
    </>
  );
}
