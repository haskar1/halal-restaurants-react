"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import createRestaurant from "@/utils/create-restaurant";
import SubmitButton from "@/components/SubmitButton";
import Autocomplete from "react-google-autocomplete";

export const fetchCache = "force-no-store";

export default function CreateRestaurantForm() {
  const [state, formAction] = useFormState(createRestaurant, null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cuisines, setCuisines] = useState([]);
  const [customErrorMsg, setCustomErrorMsg] = useState("");
  const stateMessageRef = useRef(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [slug, setSlug] = useState("");
  const [restaurantSummary, setRestaurantSummary] = useState("");
  const [alcoholServed, setAlcoholServed] = useState("");
  const [priceLevel, setPriceLevel] = useState("");
  const [placePhotos, setPlacePhotos] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  const placeCityTownNeighborhood = placeDetails?.addressComponents.find(
    ({ types }) => types.includes("locality") || types.includes("sublocality")
  ).longText;
  const placeState = placeDetails?.addressComponents.find(({ types }) =>
    types.includes("administrative_area_level_1")
  ).shortText;
  const combinedCityState =
    placeCityTownNeighborhood && placeState
      ? `${placeCityTownNeighborhood}, ${placeState}`
      : "";

  // Slug
  useEffect(() => {
    if (placeDetails) {
      setSlug(
        `${placeDetails.displayName.text
          .toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("'", "")
          .replaceAll("&", "and")}-${placeCityTownNeighborhood
          ?.toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("'", "")
          .replaceAll("&", "and")}-${placeState
          ?.toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("'", "")
          .replaceAll("&", "and")}`
      );
    }
  }, [placeDetails]);

  // Restaurant Summary
  useEffect(() => {
    if (placeDetails) {
      setRestaurantSummary(
        placeDetails?.generativeSummary?.description?.text
          ? `${placeDetails.generativeSummary.description.text.replace(
              /(\r\n|\n|\r)/gm,
              " "
            )}`
          : placeDetails?.generativeSummary?.overview?.text
            ? `${placeDetails.generativeSummary.overview.text.replace(
                /(\r\n|\n|\r)/gm,
                " "
              )}`
            : ""
      );
    }
  }, [placeDetails]);

  // Alcohol Served
  useEffect(() => {
    if (placeDetails) {
      setAlcoholServed(
        placeDetails.servesBeer ||
          placeDetails.servesCocktails ||
          placeDetails.servesWine
          ? "Yes"
          : "No"
      );
    }
  }, [placeDetails]);

  // Price Level
  useEffect(() => {
    if (placeDetails) {
      let priceLevelSymbol;
      switch (placeDetails.priceLevel) {
        case "PRICE_LEVEL_FREE":
          priceLevelSymbol = "$";
          break;
        case "PRICE_LEVEL_INEXPENSIVE":
          priceLevelSymbol = "$";
          break;
        case "PRICE_LEVEL_MODERATE":
          priceLevelSymbol = "$$";
          break;
        case "PRICE_LEVEL_EXPENSIVE":
          priceLevelSymbol = "$$$";
          break;
        case "PRICE_LEVEL_VERY_EXPENSIVE":
          priceLevelSymbol = "$$$$";
          break;
        case "PRICE_LEVEL_UNSPECIFIED":
          priceLevelSymbol = "";
          break;
        default:
          priceLevelSymbol = "";
      }

      setPriceLevel(priceLevelSymbol);
    }
  }, [placeDetails]);

  async function fetchPlaceDetails(place) {
    const placeDetailsResponse = await fetch(
      `https://places.googleapis.com/v1/places/${place.place_id}?fields=id,displayName,photos,addressComponents,servesBeer,servesCocktails,servesWine,formattedAddress,googleMapsUri,location,generativeSummary,rating,userRatingCount,priceLevel,nationalPhoneNumber,websiteUri&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const fetchedPlaceDetails = await placeDetailsResponse.json();
    fetchPhotos(fetchedPlaceDetails);
    setPlaceDetails(fetchedPlaceDetails);
    console.log("placeDetails: ", fetchedPlaceDetails);
  }

  async function fetchPhotos(fetchedPlaceDetails) {
    let fetchedPhotos = [];
    await Promise.all(
      fetchedPlaceDetails?.photos.map((photo) =>
        fetch(
          `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=500&skipHttpRedirect=true&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        )
          .then((res) => res.json())
          .then((data) => {
            const author =
              photo.authorAttributions[0]?.displayName || "Unknown Author";
            fetchedPhotos.push({
              photoUri: data.photoUri,
              author: author,
            });
          })
      )
    );
    // Sort by Author
    fetchedPhotos.sort((a, b) =>
      a.author > b.author ? 1 : b.author > a.author ? -1 : 0
    );
    setPlacePhotos(fetchedPhotos);
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
      const publicUrl = data.publicUrl;
      const message = data.message;
      console.log(message);

      if (response.ok) {
        setCoverPhoto({ photoUri, author, imageName, publicUrl });
        alert("Image uploaded successfully!");
      } else {
        alert("Image upload failed!");
        console.error("Upload failed:", response.status);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred during upload.");
    }
  }

  // If submitted data failed validation, make submit button clickable again
  useEffect(() => {
    if (state?.message) {
      setIsSubmitting(false);
    }
  }, [state]);

  // Displays Cuisine Options
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

      <div>
        <label htmlFor="restaurant_search">Search for any restaurant:</label>
      </div>
      <Autocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        onPlaceSelected={(place) => {
          fetchPlaceDetails(place);
        }}
        options={{
          types: ["establishment"],
        }}
        className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[3rem] w-full max-w-[35rem] min-h-10"
        id="restaurant_search"
      />

      <form
        action={formAction}
        onSubmit={() => setIsSubmitting(true)}
        className="grid"
      >
        <label htmlFor="restaurant_name">Restaurant Name:</label>
        <input
          type="text"
          id="restaurant_name"
          name="name"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          min="1"
          defaultValue={placeDetails?.displayName.text}
          required
        />

        <label htmlFor="slug">Restaurant Slug:</label>
        <input
          type="text"
          id="slug"
          name="slug"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          min="1"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />

        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          min="1"
          defaultValue={placeDetails?.formattedAddress}
          required
        />

        <label htmlFor="city">City/Town/Neighborhood/etc:</label>
        <input
          type="text"
          id="city"
          name="city"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          min="1"
          defaultValue={combinedCityState}
          required
        />

        <label htmlFor="address_url">Address URL:</label>
        <input
          type="text"
          id="address_url"
          name="address_url"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          min="1"
          defaultValue={placeDetails?.googleMapsUri}
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
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          defaultValue={
            placeDetails &&
            `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY}&q=place_id:${placeDetails?.id}`
          }
        />

        <label htmlFor="latitude">Latitude:</label>
        <input
          type="text"
          id="latitude"
          name="latitude"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          defaultValue={placeDetails?.location.latitude.toFixed(6)}
          required
        />

        <label htmlFor="longitude">Longitude:</label>
        <input
          type="text"
          id="longitude"
          name="longitude"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          defaultValue={placeDetails?.location.longitude.toFixed(6)}
          required
        />

        <label htmlFor="restaurant_summary">Restaurant Summary:</label>
        <textarea
          id="restaurant_summary"
          name="restaurant_summary"
          rows="10"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          value={restaurantSummary}
          onChange={(e) => setRestaurantSummary(e.target.value)}
        />

        <label htmlFor="halal_status">Halal Status:</label>
        <select
          id="halal_status"
          name="halal_status"
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
          rows="4"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
        />

        <label htmlFor="alcohol_served">Alcohol Served?</label>
        <select
          id="alcohol_served"
          name="alcohol_served"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          value={alcoholServed}
          onChange={(e) => setAlcoholServed(e.target.value)}
        >
          <option value=""></option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <label htmlFor="pork_served">Pork Served?</label>
        <select
          id="pork_served"
          name="pork_served"
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
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          min="1"
          max="5"
          step="0.1"
          defaultValue={placeDetails?.rating}
        />

        <label htmlFor="price">Price:</label>
        <select
          id="price"
          name="price"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          value={priceLevel}
          onChange={(e) => setPriceLevel(e.target.value)}
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
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          defaultValue={placeDetails?.nationalPhoneNumber}
        />

        <label htmlFor="website">Website:</label>
        <input
          type="text"
          id="website"
          name="website"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          defaultValue={placeDetails?.websiteUri}
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

        <label htmlFor="cover_photo_url">Cover_photo_url:</label>
        <input
          type="text"
          id="cover_photo_url"
          name="cover_photo_url"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          // defaultValue={coverPhoto && coverPhoto.publicUrl}
          defaultValue={
            slug &&
            `https://whoishalal-images.s3.us-east-2.amazonaws.com/${slug}-photo-1.jpeg`
          }
        />
        <label htmlFor="cover_photo_author">Cover Photo Author:</label>
        <input
          type="text"
          id="cover_photo_author"
          name="cover_photo_author"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          defaultValue={coverPhoto?.author}
        />

        <label htmlFor="other_photos_1_url">Other_photos_url:</label>
        <input
          type="text"
          id="other_photos_1_url"
          name="other_photos_url"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
        />
        <input
          type="text"
          id="other_photos_2_url"
          name="other_photos_url"
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

        <label htmlFor="place_id">
          Place ID (for Google Place Details API):
        </label>
        <input
          type="text"
          id="place_id"
          name="place_id"
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem] max-w-[35rem] min-h-10"
          defaultValue={placeDetails?.id}
        />

        <div className="flex gap-2 mb-[1.5rem]">
          <label htmlFor="hide_restaurant">Hide restaurant from website</label>
          <input type="checkbox" id="hide_restaurant" name="hide_restaurant" />
        </div>

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
