"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createRestaurant } from "@/utils/create-restaurant";

export const fetchCache = "force-no-store";

function SubmitButton({ isSubmitting }) {
  let className = "border-[3px] border-solid border-[#b9ae8c] rounded-lg p-2";

  if (isSubmitting) {
    className += " opacity-70";
  }

  return (
    <button type="submit" disabled={isSubmitting} className={className}>
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
}

export default function CreateRestaurantForm() {
  const [state, formAction] = useFormState(createRestaurant, null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Redirect to newly created restaurant after form submission
    if (state?.id) {
      router.push(`/dashboard/restaurants/${state.id}`);
    }
    // If submitted data failed validation, make submit button clickable again
    if (state?.message) {
      setIsSubmitting(false);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      onSubmit={() => setIsSubmitting(true)}
      className="grid gap-4"
    >
      <label htmlFor="restaurant_name">Restaurant Name:</label>
      <input
        type="text"
        id="restaurant_name"
        name="name"
        className="text-black pl-2 border border-solid border-black rounded"
        min="1"
        required
      />
      <label htmlFor="restaurant_tag">Restaurant Tag:</label>
      <input
        type="text"
        id="restaurant_tag"
        name="restaurant_tag"
        className="text-black pl-2 border border-solid border-black rounded"
        min="1"
        required
      />
      <SubmitButton isSubmitting={isSubmitting} />
      {state?.message && <p className="text-red-600">{state.message}</p>}
    </form>
  );
}
