"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import createRestaurant from "@/utils/create-restaurant";
import SubmitButton from "@/components/SubmitButton";

export const fetchCache = "force-no-store";

export default function CreateRestaurantForm() {
  const [state, formAction] = useFormState(createRestaurant, null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cuisines, setCuisines] = useState([]);
  const [customErrorMsg, setCustomErrorMsg] = useState("");
  const stateMessageRef = useRef(null);

  useEffect(() => {
    // If submitted data failed validation, make submit button clickable again
    if (state?.message) {
      setIsSubmitting(false);
    }
  }, [state]);

  useEffect(() => {
    fetch(`/api/get-cuisines`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setCuisines(json.cuisines);
      })
      .catch((error) => {
        console.error("Error fetching cuisines: ", error);
      });
  }, []);

  function handleCuisineChange(e) {
    const checkedCuisines = [
      ...document.querySelectorAll(".cuisines input:checked"),
    ];

    if (checkedCuisines.length === 0) {
      setCustomErrorMsg("Please select at least one cuisine.");
    } else if (checkedCuisines.length > 0 && customErrorMsg !== "") {
      setCustomErrorMsg("");
    }

    if (
      checkedCuisines.length > 0 &&
      state?.message === "Please select at least one cuisine. "
    ) {
      stateMessageRef.current.style.display = "none";
    }
  }

  return (
    <>
      <h1 className="mb-[3rem]">Create Restaurant</h1>
      <form
        action={formAction}
        onSubmit={() => setIsSubmitting(true)}
        className="grid max-w-[30rem]"
      >
        <label htmlFor="restaurant_name">Restaurant Name:</label>
        <input
          type="text"
          id="restaurant_name"
          name="name"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
          min="1"
          required
        />
        <label htmlFor="slug">Restaurant Slug:</label>
        <input
          type="text"
          id="slug"
          name="slug"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
          min="1"
          required
        />
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
          min="1"
          required
        />
        <label htmlFor="address_url">Address URL:</label>
        <input
          type="text"
          id="address_url"
          name="address_url"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
          min="1"
          required
        />
        <label htmlFor="latitude">Latitude:</label>
        <input
          type="text"
          id="latitude"
          name="latitude"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
          required
        />
        <label htmlFor="longitude">Longitude:</label>
        <input
          type="text"
          id="longitude"
          name="longitude"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
          required
        />
        <label htmlFor="restaurant_summary">Restaurant_summary:</label>
        <input
          type="text"
          id="restaurant_summary"
          name="restaurant_summary"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
        />
        <label htmlFor="halal_description">Halal_description:</label>
        <input
          type="text"
          id="halal_description"
          name="halal_description"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
        />
        <label htmlFor="rating">Rating:</label>
        <input
          type="number"
          id="rating"
          name="rating"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
          min="1"
          max="5"
          step="0.1"
        />
        <label htmlFor="price">Price:</label>
        <input
          type="text"
          id="price"
          name="price"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
        />
        <label htmlFor="cover_photo_url">Cover_photo_url:</label>
        <input
          type="text"
          id="cover_photo_url"
          name="cover_photo_url"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
        />
        {/* <label htmlFor="other_photos_url">Other_photos_url:</label>
        <input
          type="text"
          id="other_photos_url"
          name="other_photos_url"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
        /> */}
        {cuisines && cuisines.length > 0 && (
          <div className="cuisines mb-[1.5rem]">
            <label>Cuisine(s):</label>
            <div className="grid gap-[0.5rem] mt-[1rem]">
              {cuisines.map((cuisine) => (
                <div key={cuisine.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`cuisine_${cuisine.name}`}
                    name="cuisine"
                    value={cuisine.id}
                    onChange={handleCuisineChange}
                  />
                  <label htmlFor={`cuisine_${cuisine.name}`}>
                    &nbsp;{cuisine.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <SubmitButton isSubmitting={isSubmitting} isError={customErrorMsg} />
        {state?.message && (
          <p ref={stateMessageRef} className="text-red-600">
            {state.message}
          </p>
        )}
        {customErrorMsg && <p className="text-red-600">{customErrorMsg}</p>}
      </form>
    </>
  );
}
