"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createCuisine } from "@/utils/create-cuisine";

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

export default function CreateCuisineForm() {
  const [state, formAction] = useFormState(createCuisine, null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Redirect to newly created cuisine after form submission
    if (state?.id) {
      router.push(`/dashboard/cuisines/${state.id}`);
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
      <label htmlFor="cuisine">Type of Cuisine:</label>
      <input
        type="text"
        id="cuisine"
        name="name"
        placeholder="Arab, American, Indian, etc."
        className="text-black pl-2 border border-solid border-black rounded"
        min="1"
        max="100"
        required
      />
      <SubmitButton isSubmitting={isSubmitting} />
      {state?.message && <p className="text-red-600">{state.message}</p>}
    </form>
  );
}
