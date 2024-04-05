"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function deleteRestaurant(id) {
  try {
    revalidatePath("/");

    // Delete associated records in restaurant_cuisines table
    await sql`
      DELETE FROM restaurant_cuisines
      WHERE restaurant_id = ${id};
    `;

    // Delete restaurant record
    const result = await sql`
      DELETE FROM restaurants
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.rowCount === 0) {
      throw new Error("Restaurant not found");
    }

    revalidatePath("/dashboard/restaurants");
    redirect("/dashboard/restaurants");
  } catch (error) {
    console.error("Error deleting restaurant: ", error);
    throw error; // Re-throw the error to propagate it to the caller
  }
}
