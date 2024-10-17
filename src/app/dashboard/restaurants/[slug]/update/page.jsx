"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import updateRestaurant from "@/utils/update-restaurant";
import SubmitButton from "@/components/SubmitButton";
import Autocomplete from "react-google-autocomplete";

export const fetchCache = "force-no-store";

export default function UpdateRestaurantForm({ params }) {
  const slug = params.slug;
  const [state, formAction] = useFormState(updateRestaurant, null);
  const [restaurant, setRestaurant] = useState(null);
  const [cuisines, setCuisines] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customErrorMsg, setCustomErrorMsg] = useState("");
  const [placePhotos, setPlacePhotos] = useState(null);
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

  async function fetchPlacePhotos() {
    const photosRes = await fetch(
      `https://places.googleapis.com/v1/places/${restaurant.place_id}?fields=photos&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const fetchedPlacePhotos = await photosRes.json();
    fetchPhotoURIs(fetchedPlacePhotos);
  }

  async function fetchPhotoURIs(fetchedPlacePhotos) {
    let fetchedPhotosInfo = [];
    await Promise.all(
      fetchedPlacePhotos?.photos.map((photo) =>
        fetch(
          `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=500&skipHttpRedirect=true&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        )
          .then((res) => res.json())
          .then((data) => {
            const author =
              photo.authorAttributions[0]?.displayName || "Unknown Author";
            fetchedPhotosInfo.push({
              photoUri: data.photoUri,
              author: author,
            });
          })
      )
    );
    // Sort by Author
    fetchedPhotosInfo.sort((a, b) =>
      a.author > b.author ? 1 : b.author > a.author ? -1 : 0
    );
    setPlacePhotos(fetchedPhotosInfo);
  }

  async function handleImageClick(photo, imageName) {
    try {
      const photoUri = photo.photoUri;
      const author = photo.author;

      const response = await fetch("/api/upload-photo", {
        method: "POST",
        body: JSON.stringify({ photoUri, imageName }),
      });
      const data = await response.json();
      const message = data.message;
      console.log(message);

      if (response.ok) {
        setRestaurant({
          ...restaurant,
          cover_photo_author: author,
        });
        alert("Image replaced successfully!");
      } else {
        console.error("Replace failed:", result.message);
        alert("Image replacing failed!");
      }
    } catch (error) {
      console.error("Error replacing image:", error);
      alert("An error occurred during replacing.");
    }
  }

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
            className="grid"
          >
            <input type="hidden" name="id" defaultValue={restaurant.id} />

            <label htmlFor="restaurant_name">Restaurant Name:</label>
            <input
              type="text"
              id="restaurant_name"
              name="name"
              defaultValue={restaurant.name}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
              min="1"
              required
            />

            <label htmlFor="slug">Restaurant Slug:</label>
            <input
              type="text"
              id="slug"
              name="slug"
              defaultValue={restaurant.slug}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
              min="1"
              required
            />

            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              defaultValue={restaurant.address}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
              min="1"
              required
            />

            <label htmlFor="city">City/Town/Neighborhood/etc:</label>
            <input
              type="text"
              id="city"
              name="city"
              defaultValue={restaurant.city}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
              min="1"
              required
            />

            <label htmlFor="address_url">Address URL:</label>
            <input
              type="text"
              id="address_url"
              name="address_url"
              defaultValue={restaurant.address_url}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
              min="1"
              required
            />

            <label htmlFor="google_maps_embedded_url">
              Google Maps Embedded URL:
            </label>
            <textarea
              type="text"
              rows="7"
              id="google_maps_embedded_url"
              name="google_maps_embedded_url"
              defaultValue={restaurant.google_maps_embedded_url}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
            />

            <label htmlFor="latitude">Latitude:</label>
            <input
              type="text"
              id="latitude"
              name="latitude"
              defaultValue={restaurant.latitude}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
              required
            />

            <label htmlFor="longitude">Longitude:</label>
            <input
              type="text"
              id="longitude"
              name="longitude"
              defaultValue={restaurant.longitude}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
              required
            />

            <label htmlFor="restaurant_summary">Restaurant Summary:</label>
            <textarea
              id="restaurant_summary"
              name="restaurant_summary"
              rows="10"
              defaultValue={restaurant.restaurant_summary}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
            />

            <label htmlFor="halal_status">Halal Status:</label>
            <select
              id="halal_status"
              name="halal_status"
              defaultValue={restaurant.halal_status}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
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
              rows="7"
              defaultValue={restaurant.halal_description}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
            />

            <label htmlFor="alcohol_served">Alcohol Served?</label>
            <select
              id="alcohol_served"
              name="alcohol_served"
              defaultValue={restaurant.alcohol_served}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
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
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
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
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
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
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
              min="1"
              max="5"
              step="0.1"
            />

            <label htmlFor="price">Price:</label>
            <select
              id="price"
              name="price"
              defaultValue={restaurant.price}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
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
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
            />

            <label htmlFor="website">Website:</label>
            <input
              type="text"
              id="website"
              name="website"
              defaultValue={restaurant.website}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
            />

            {placePhotos?.length > 0 && (
              <div className="w-full flex flex-wrap gap-6 mb-[3rem]">
                {placePhotos.map((photo, index) => (
                  <div key={index}>
                    <img
                      src={photo.photoUri}
                      onClick={() => handleImageClick(photo, `${slug}-photo-1`)}
                      alt={`Photo by ${photo.author}`}
                      className="cursor-pointer"
                    />
                    <p className="max-w-[500px] pb-2">{photo.photoUri}</p>
                    <p className="max-w-[500px]">Author: {photo.author}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-[0.5rem] mb-[1.5rem]">
              <div>
                <label htmlFor="cover_photo_url" className="block">
                  Cover_photo_url:
                </label>
                <input
                  type="text"
                  id="cover_photo_url"
                  name="cover_photo_url"
                  defaultValue={restaurant.cover_photo_url}
                  className="block w-full text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] max-w-[35rem] min-h-10"
                />
              </div>

              {!placePhotos && (
                <button
                  type="button"
                  onClick={() => fetchPlacePhotos()}
                  className="bg-[#136c72] text-white text-lg border-none rounded-lg cursor-pointer max-w-fit px-4 py-1"
                >
                  Change Cover Photo
                </button>
              )}
            </div>

            <label htmlFor="cover_photo_author">Cover Photo Author:</label>
            <input
              type="text"
              id="cover_photo_author"
              name="cover_photo_author"
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
              value={restaurant.cover_photo_author}
              onChange={(e) =>
                setRestaurant({
                  ...restaurant,
                  cover_photo_author: e.target.value,
                })
              }
            />

            <label htmlFor="other_photos_1_url">Other_photos_url:</label>
            <input
              type="text"
              id="other_photos_1_url"
              name="other_photos_url"
              defaultValue={
                restaurant.other_photos_url && restaurant.other_photos_url[0]
              }
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
            />
            <input
              type="text"
              id="other_photos_2_url"
              name="other_photos_url"
              defaultValue={
                restaurant.other_photos_url && restaurant.other_photos_url[1]
              }
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
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

            <div>
              <label htmlFor="restaurant_search">
                Search Google for restaurant (this is only for updating the
                Place ID below):
              </label>
            </div>
            <Autocomplete
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              onPlaceSelected={(place) => {
                setRestaurant({
                  ...restaurant,
                  place_id: place.place_id,
                });
              }}
              options={{
                types: ["establishment"],
              }}
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1rem] w-full max-w-[35rem] min-h-10"
              id="restaurant_search"
            />

            <label htmlFor="place_id">
              Place ID (for Google Place Details API):
            </label>
            <input
              type="text"
              id="place_id"
              name="place_id"
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
              value={restaurant.place_id}
              onChange={(e) =>
                setRestaurant({
                  ...restaurant,
                  place_id: e.target.value,
                })
              }
            />

            <div className="flex gap-2 mb-[1.5rem]">
              <label htmlFor="hide_restaurant">
                Hide restaurant from website
              </label>
              <input
                type="checkbox"
                id="hide_restaurant"
                name="hide_restaurant"
                defaultChecked={restaurant.hide_restaurant}
              />
            </div>

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
