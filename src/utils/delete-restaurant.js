"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import { headers } from "next/headers";

export default async function deleteRestaurant(args) {
  try {
    revalidatePath("/");

    // Delete associated records in restaurant_cuisines table
    await sql`
      DELETE FROM restaurant_cuisines
      WHERE restaurant_id = ${args.id};
    `;

    // Delete restaurant record
    const result = await sql`
      DELETE FROM restaurants
      WHERE id = ${args.id}
      RETURNING *;
    `;

    if (result.rowCount === 0) {
      throw new Error("Restaurant not found");
    }
  } catch (error) {
    console.error("Error deleting restaurant: ", error);
    throw error; // Re-throw the error to propagate it to the caller
  }

  // try {
  //   const host = headers().get("host");
  //   const protocol = process?.env.NODE_ENV === "development" ? "http" : "https";

  //   const response = await fetch(`${protocol}://${host}/api/delete-photos`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ slug: args.slug }),
  //   });

  //   const result = await response.json();
  //   if (response.ok) {
  //     console.log("Delete successful");
  //   } else {
  //     console.error("Delete failed.");
  //   }
  // } catch (error) {
  //   console.error("Error deleting images:", error);
  //   console.log("An error occurred during deleting.");
  // }

  revalidatePath("/dashboard/restaurants");
  redirect("/dashboard/restaurants");
}
