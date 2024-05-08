"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import updateRestaurant from "@/utils/update-restaurant";
import SubmitButton from "@/components/SubmitButton";

export const fetchCache = "force-no-store";

export default function UpdateRestaurantForm({ params }) {
  const slug = params.slug;
  const [state, formAction] = useFormState(updateRestaurant, null);
  const [restaurant, setRestaurant] = useState(null);
  const [cuisines, setCuisines] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customErrorMsg, setCustomErrorMsg] = useState("");
  const stateMessageRef = useRef(null);

  useEffect(() => {
    fetch(`/api/get-restaurant?slug=${slug}`)
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
          <h1 className="mb-[3rem]">Update {restaurant.name}</h1>
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

            <label htmlFor="slug">Restaurant Slug:</label>
            <input
              type="text"
              id="slug"
              name="slug"
              defaultValue={restaurant.slug}
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

            <label htmlFor="city">City/Town/Neighborhood/etc:</label>
            <input
              type="text"
              id="city"
              name="city"
              defaultValue={restaurant.city}
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

            <label htmlFor="google_maps_embedded_url">
              Google Maps Embedded URL:
            </label>
            <input
              type="text"
              id="google_maps_embedded_url"
              name="google_maps_embedded_url"
              defaultValue={restaurant.google_maps_embedded_url}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
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

            <label htmlFor="restaurant_summary">Restaurant Summary:</label>
            <textarea
              id="restaurant_summary"
              name="restaurant_summary"
              rows="4"
              defaultValue={restaurant.restaurant_summary}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
            />

            <label htmlFor="halal_status">Halal Status:</label>
            <select
              id="halal_status"
              name="halal_status"
              defaultValue={restaurant.halal_status}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
            >
              <option value=""></option>
              <option value="Fully Halal">Fully Halal</option>
              <option value="Partially Halal">Partially Halal</option>
              <option value="Not Halal">Not Halal</option>
            </select>

            <label htmlFor="halal_description">Halal Description:</label>
            <textarea
              id="halal_description"
              name="halal_description"
              rows="4"
              defaultValue={restaurant.halal_description}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
            />

            <label htmlFor="alcohol_served">Alcohol Served?</label>
            <select
              id="alcohol_served"
              name="alcohol_served"
              defaultValue={restaurant.alcohol_served}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
            >
              <option value=""></option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            <label htmlFor="pork_served">Pork Served?</label>
            <select
              id="pork_served"
              name="pork_served"
              defaultValue={restaurant.pork_served}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
            >
              <option value=""></option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            <label htmlFor="slaughter_method">Slaughter Method:</label>
            <select
              id="slaughter_method"
              name="slaughter_method"
              defaultValue={restaurant.slaughter_method}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
            >
              <option value=""></option>
              <option value="Hand Slaughtered">Hand Slaughtered</option>
              <option value="Machine Cut">Machine Cut</option>
            </select>

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
            <select
              id="price"
              name="price"
              defaultValue={restaurant.price}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
            >
              <option value=""></option>
              <option value="$">$</option>
              <option value="$$">$$</option>
              <option value="$$$">$$$</option>
              <option value="$$$$">$$$$</option>
            </select>

            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              defaultValue={restaurant.phone}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
            />

            <label htmlFor="website">Website:</label>
            <input
              type="text"
              id="website"
              name="website"
              defaultValue={restaurant.website}
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

            <label htmlFor="other_photos_1_url">Other_photos_url:</label>
            <input
              type="text"
              id="other_photos_1_url"
              name="other_photos_url"
              defaultValue={
                restaurant.other_photos_url && restaurant.other_photos_url[0]
              }
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
            />
            <input
              type="text"
              id="other_photos_2_url"
              name="other_photos_url"
              defaultValue={
                restaurant.other_photos_url && restaurant.other_photos_url[1]
              }
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
            />

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
