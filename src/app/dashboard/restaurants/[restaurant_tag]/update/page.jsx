"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import updateRestaurant from "@/utils/update-restaurant";
import SubmitButton from "@/components/SubmitButton";

export const fetchCache = "force-no-store";

export default function UpdateRestaurantForm({ params }) {
  const { restaurant_tag } = params;
  const [state, formAction] = useFormState(updateRestaurant, null);
  const [restaurant, setRestaurant] = useState(null);
  const [cuisines, setCuisines] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customErrorMsg, setCustomErrorMsg] = useState("");
  const stateMessageRef = useRef(null);

  useEffect(() => {
    fetch(`/api/get-restaurant?restaurant_tag=${restaurant_tag}`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setRestaurant(json.restaurant);
      })
      .catch((error) => {
        console.error("Error fetching restaurant: ", error);
      });

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

  useEffect(() => {
    // If submitted data failed validation, make submit button clickable again
    if (state?.message) {
      setIsSubmitting(false);
    }
  }, [state]);

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
      {restaurant ? (
        <>
          <h1 className="mb-[3rem]">Update Restaurant</h1>
          <form
            action={formAction}
            onSubmit={() => setIsSubmitting(true)}
            className="grid max-w-[30rem]"
          >
            <input type="hidden" name="id" defaultValue={restaurant.id} />

            <label htmlFor="restaurant_name">Restaurant Name:</label>
            <input
              type="text"
              id="restaurant_name"
              name="name"
              defaultValue={restaurant.name} // Pre-fill with existing restaurant name
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
              min="1"
              required
            />
            <label htmlFor="restaurant_tag">Restaurant Tag:</label>
            <input
              type="text"
              id="restaurant_tag"
              name="restaurant_tag"
              defaultValue={restaurant.restaurant_tag}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
              min="1"
              required
            />
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              defaultValue={restaurant.address}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
              min="1"
              required
            />
            <label htmlFor="address_url">Address URL:</label>
            <input
              type="text"
              id="address_url"
              name="address_url"
              defaultValue={restaurant.address_url}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
              min="1"
              required
            />
            <label htmlFor="latitude">Latitude:</label>
            <input
              type="text"
              id="latitude"
              name="latitude"
              defaultValue={restaurant.latitude}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
              required
            />
            <label htmlFor="longitude">Longitude:</label>
            <input
              type="text"
              id="longitude"
              name="longitude"
              defaultValue={restaurant.longitude}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
              required
            />
            <label htmlFor="restaurant_summary">Restaurant_summary:</label>
            <input
              type="text"
              id="restaurant_summary"
              name="restaurant_summary"
              defaultValue={restaurant.restaurant_summary}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
            />
            <label htmlFor="halal_description">Halal_description:</label>
            <input
              type="text"
              id="halal_description"
              name="halal_description"
              defaultValue={restaurant.halal_description}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
            />
            <label htmlFor="rating">Rating:</label>
            <input
              type="number"
              id="rating"
              name="rating"
              defaultValue={restaurant.rating}
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
              defaultValue={restaurant.price}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
            />
            <label htmlFor="cover_photo_url">Cover_photo_url:</label>
            <input
              type="text"
              id="cover_photo_url"
              name="cover_photo_url"
              defaultValue={restaurant.cover_photo_url}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
            />
            {/* <label htmlFor="other_photos_url">Other_photos_url:</label>
            <input
              type="text"
              id="other_photos_url"
              name="other_photos_url"
              defaultValue={restaurant.other_photos_url}
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
                        id={cuisine.id}
                        name="cuisine"
                        defaultChecked={restaurant.cuisines.some(
                          (c) => c.id === cuisine.id
                        )}
                        value={cuisine.id}
                        onChange={handleCuisineChange}
                      />
                      <label htmlFor={cuisine.id}>&nbsp;{cuisine.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <SubmitButton
              isSubmitting={isSubmitting}
              isError={customErrorMsg}
            />
            {state?.message && (
              <p ref={stateMessageRef} className="text-red-600">
                {state.message}
              </p>
            )}
            {customErrorMsg && <p className="text-red-600">{customErrorMsg}</p>}
          </form>
        </>
      ) : (
        <p>Loading restaurant...</p>
      )}
    </>
  );
}
