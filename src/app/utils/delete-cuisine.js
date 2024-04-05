"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function deleteCuisine(id) {
  try {
    revalidatePath("/dashboard/cuisines");

    const cuisineHasRestaurants = await sql`
      SELECT * FROM restaurant_cuisines
      WHERE cuisine_id = ${id};
    `;

    if (cuisineHasRestaurants.rowCount > 0) {
      throw new Error(
        "Cuisine has associated restaurant(s). Must first delete restaurants before deleting cuisine."
      );
    }

    const result = await sql`
      DELETE FROM cuisines
      WHERE id = ${id}
      RETURNING *;
    `;

    console.log("deleting: ", result);

    if (result.rowCount === 0) {
      throw new Error("Cuisine not found");
    }

    revalidatePath("/dashboard/cuisines");
    redirect("/dashboard/cuisines");
  } catch (error) {
    console.error("Error deleting cuisine: ", error);
    throw error; // Re-throw the error to propagate it to the caller
  }
}
