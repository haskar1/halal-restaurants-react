"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import createCuisine from "@/utils/create-cuisine";
import SubmitButton from "@/components/SubmitButton";

export const fetchCache = "force-no-store";

export default function CreateCuisineForm() {
  const [state, formAction] = useFormState(createCuisine, null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If submitted data failed validation, make submit button clickable again
    if (state?.message) {
      setIsSubmitting(false);
    }
  }, [state]);

  return (
    <>
      <h1 className="mb-[3rem]">Create Cuisine</h1>
      <form
        action={formAction}
        onSubmit={() => setIsSubmitting(true)}
        className="grid max-w-[30rem]"
      >
        <label htmlFor="cuisine">Type of Cuisine:</label>
        <input
          type="text"
          id="cuisine"
          name="name"
          placeholder="Arab, American, Indian, etc."
          className="text-black pl-2 pr-2 border border-solid border-black rounded mt-[0.5rem] mb-[1.5rem]"
          min="1"
          max="100"
          required
        />
        <SubmitButton isSubmitting={isSubmitting} />
        {state?.message && <p className="text-red-600">{state.message}</p>}
      </form>
    </>
  );
}
