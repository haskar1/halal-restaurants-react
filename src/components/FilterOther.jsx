"use client";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import styles from "../app/best-halal-restaurants/[location]/styles.module.css";

export default function FilterOther({
  others,
  selectedOthers,
  setSelectedOthers,
}) {
  const handleChange = (e, other) => {
    let updatedSelectedOthers;

    if (e.target.checked) {
      updatedSelectedOthers = [...selectedOthers, other];
    } else {
      updatedSelectedOthers = selectedOthers.filter((p) => p !== other);
    }
    setSelectedOthers(updatedSelectedOthers);
    sessionStorage.setItem(
      "selectedOthers",
      JSON.stringify(updatedSelectedOthers)
    );
  };

  return (
    <>
      {others?.length > 0 && (
        <div className={styles.filter_category}>
          <p className={styles.filter_category_title}>Other</p>
          <FormGroup className="py-2 gap-8 md:gap-3">
            {others.map((other) => (
              <FormControlLabel
                key={other}
                control={
                  <Checkbox
                    checked={selectedOthers.includes(other)} // Sync checkbox state with selected others
                    onChange={(e) => handleChange(e, other)}
                  />
                }
                label={other}
                className="text-lg"
              />
            ))}
          </FormGroup>
        </div>
      )}
    </>
  );
}
