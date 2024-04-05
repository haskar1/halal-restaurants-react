// @ts-nocheck
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";

export default async function updateRestaurant(
  prevState: any,
  formData: FormData
) {
  const schema = z.object({
    id: z
      .string()
      .trim()
      .min(1, { message: "Restaurant id missing or invalid." }),
    name: z
      .string()
      .trim()
      .min(1, { message: "Restaurant name cannot be empty." }),
    restaurant_tag: z
      .string()
      .trim()
      .min(1, { message: "Restaurant tag cannot be empty." }),
    address: z
      .string()
      .trim()
      .min(1, { message: "Restaurant address cannot be empty." }),
    address_url: z
      .string()
      .trim()
      .min(1, { message: "Restaurant address_url cannot be empty." }),
    latitude: z
      .string()
      .trim()
      .min(1, { message: "Restaurant latitude cannot be empty." }),
    longitude: z
      .string()
      .trim()
      .min(1, { message: "Restaurant longitude cannot be empty." }),
    restaurant_summary: z.string().trim(),
    halal_description: z.string().trim(),
    rating: z
      .union([z.number().positive().min(1).max(5).multipleOf(0.1), z.nan()])
      .optional(),
    price: z.string().trim(),
    cover_photo_url: z.string().trim(),
    // other_photos_url: z.string().trim(),
    cuisine: z
      .array(z.string())
      .min(1, { message: "Please select at least one cuisine." }),
  });

  const parse = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    restaurant_tag: formData.get("restaurant_tag"),
    address: formData.get("address"),
    address_url: formData.get("address_url"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    restaurant_summary: formData.get("restaurant_summary"),
    halal_description: formData.get("halal_description"),
    rating: parseFloat(formData.get("rating")),
    price: formData.get("price"),
    cover_photo_url: formData.get("cover_photo_url"),
    // other_photos_url: formData.get("other_photos_url"),
    cuisine: formData.getAll("cuisine"),
  });

  if (!parse.success) {
    let errorMsg: string = "";
    parse.error.errors.forEach((error) => {
      errorMsg += `${error.message} `;
    });
    return { message: errorMsg };
  }

  const data = parse.data;
  const id = data.id;
  const lat = data.latitude;
  const lon = data.longitude;
  let redirectPath;

  try {
    const result = await sql`
      UPDATE restaurants 
      SET (
        name, 
        restaurant_tag, 
        address, 
        address_url, 
        latitude, 
        longitude, 
        location, 
        restaurant_summary, 
        halal_description,
        rating,
        price,
        cover_photo_url
      ) = (
        ${data.name}, 
        ${data.restaurant_tag}, 
        ${data.address}, 
        ${data.address_url}, 
        ${data.latitude}, 
        ${data.longitude}, 
        ST_GeomFromText('POINT(' || ${lon} || ' ' || ${lat} || ')',4326),
        ${data.restaurant_summary},
        ${data.halal_description},
        ${data.rating},
        ${data.price},
        ${data.cover_photo_url}
      )
      WHERE id = ${id}
      RETURNING *;
    `;

    const updatedRestaurantTag = result.rows[0].restaurant_tag;

    revalidatePath("/");

    // Delete existing records from restaurant_cuisines for the given restaurant ID
    await sql`
      DELETE FROM restaurant_cuisines
      WHERE restaurant_id = ${id};
    `;

    //Insert new records into restaurant_cuisines for the selected cuisines
    data.cuisine.map(async (cuisineId) => {
      await sql`
        INSERT INTO restaurant_cuisines (restaurant_id, cuisine_id)
        VALUES (${id}, ${cuisineId});
      `;
    });

    revalidatePath("/");
    redirectPath = `/dashboard/restaurants/${updatedRestaurantTag}`;

    return {
      id: id,
      restaurant_tag: updatedRestaurantTag,
    };
  } catch (e) {
    return { message: `Failed to update cuisine. ${e}` };
  } finally {
    if (redirectPath) redirect(redirectPath);
  }
}
