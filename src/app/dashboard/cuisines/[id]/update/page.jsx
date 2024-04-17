"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import updateCuisine from "@/utils/update-cuisine";
import SubmitButton from "@/components/SubmitButton";

export const fetchCache = "force-no-store";

export default function UpdateCuisineForm({ params }) {
  const id = params.id;
  const [state, formAction] = useFormState(updateCuisine, null);
  const [cuisine, setCuisine] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/get-cuisine?id=${id}`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setCuisine(json.cuisine);
      })
      .catch((error) => {
        console.error("Error fetching cuisine: ", error);
      });
  }, []);

  useEffect(() => {
    // If submitted data failed validation, make submit button clickable again
    if (state?.message) {
      setIsSubmitting(false);
    }
  }, [state]);

  return (
    <>
      {cuisine ? (
        <>
          <h1 className="mb-[3rem]">Update Cuisine</h1>
          <form
            action={formAction}
            onSubmit={() => setIsSubmitting(true)}
            className="grid max-w-[30rem]"
          >
            <input type="hidden" name="id" defaultValue={id} />

            <label htmlFor="cuisine">Type of Cuisine:</label>
            <input
              type="text"
              id="cuisine"
              name="name"
              defaultValue={cuisine.name} // Pre-fill with existing cuisine name
              placeholder="Arab, American, Indian, etc."
              className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
              required
            />

            <SubmitButton isSubmitting={isSubmitting} />
            {state?.message && <p className="text-red-600">{state.message}</p>}
          </form>
        </>
      ) : (
        <p>Loading cuisine...</p>
      )}
    </>
  );
}
