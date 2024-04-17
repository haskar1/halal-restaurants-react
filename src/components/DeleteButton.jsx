"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function DeleteButton(props) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // If you're deleting a cuisine but it has associated restaurants,
  // you must delete the restaurants first before deleting the cuisine.
  if (props.category === "Cuisine" && props.cuisineRestaurants?.length > 0) {
    return (
      <>
        <Button
          onClick={handleOpen}
          variant="outlined"
          startIcon={<DeleteIcon />}
          color="error"
        >
          {`Delete ${props.category}`}
        </Button>

        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Alert variant="outlined" severity="error">
              Cuisine cannot be deleted because it has associated restaurant(s).
              Please delete the restaurant(s) before deleting the cuisine.
            </Alert>
            <Button
              onClick={handleClose}
              variant="contained"
              className="relative left-[50%] !mt-[2rem] translate-x-[-50%]"
            >
              Ok
            </Button>
          </Box>
        </Modal>
      </>
    );
  }

  // props.category is 'Restaurant', or 'Cuisine' with no associated restaurants.
  // Restaurants don't reference anything else so you can always delete them,
  // and cuisines with no associated restaurants can always be deleted as well.
  else
    return (
      <>
        <div>
          <Button
            onClick={handleOpen}
            variant="outlined"
            startIcon={<DeleteIcon />}
            color="error"
          >
            {`Delete ${props.category}`}
          </Button>

          <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
              <div>
                <p>
                  <b>{`Are you sure you want to delete this ${props.category}?`}</b>
                </p>
                <Stack direction="row" spacing={2} className="!mt-[1rem]">
                  <Button
                    onClick={() => {
                      props.onClick(props.args);
                    }}
                    variant="contained"
                  >
                    Yes
                  </Button>
                  <Button onClick={handleClose} variant="contained">
                    No
                  </Button>
                </Stack>
              </div>
            </Box>
          </Modal>
        </div>
      </>
    );
}
