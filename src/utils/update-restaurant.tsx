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
    slug: z
      .string()
      .trim()
      .min(1, { message: "Restaurant slug cannot be empty." }),
    address: z
      .string()
      .trim()
      .min(1, { message: "Restaurant address cannot be empty." }),
    city: z
      .string()
      .trim()
      .min(1, { message: "Restaurant city cannot be empty." }),
    address_url: z
      .string()
      .trim()
      .min(1, { message: "Restaurant address_url cannot be empty." }),
    google_maps_embedded_url: z.string().trim(),
    latitude: z
      .string()
      .trim()
      .min(1, { message: "Restaurant latitude cannot be empty." }),
    longitude: z
      .string()
      .trim()
      .min(1, { message: "Restaurant longitude cannot be empty." }),
    restaurant_summary: z.string().trim(),
    halal_status: z.enum(["", "Fully Halal", "Partially Halal", "Not Halal"]),
    halal_description: z.string().trim(),
    alcohol_served: z.enum(["", "Yes", "No"]),
    pork_served: z.enum(["", "Yes", "No"]),
    slaughter_method: z.enum(["", "Hand Slaughtered", "Machine Cut"]),
    rating: z
      .union([z.number().positive().min(1).max(5).multipleOf(0.1), z.nan()])
      .optional(),
    price: z.enum(["", "$", "$$", "$$$", "$$$$"]),
    phone: z.string().trim(),
    website: z.string().trim(),
    cover_photo_url: z.string().trim(),
    other_photos_url: z.array(z.string().trim()),
    cuisine: z
      .array(z.string())
      .min(1, { message: "Please select at least one cuisine." }),
  });

  const parse = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    address: formData.get("address"),
    city: formData.get("city"),
    address_url: formData.get("address_url"),
    google_maps_embedded_url: formData.get("google_maps_embedded_url"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    restaurant_summary: formData.get("restaurant_summary"),
    halal_status: formData.get("halal_status"),
    halal_description: formData.get("halal_description"),
    alcohol_served: formData.get("alcohol_served"),
    pork_served: formData.get("pork_served"),
    slaughter_method: formData.get("slaughter_method"),
    rating: parseFloat(formData.get("rating")),
    price: formData.get("price"),
    phone: formData.get("phone"),
    website: formData.get("website"),
    cover_photo_url: formData.get("cover_photo_url"),
    other_photos_url: formData.getAll("other_photos_url"),
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

  let redirectPath = "";

  if (data.other_photos_url.includes("")) {
    data.other_photos_url = data.other_photos_url.filter((e) => e !== "");
  }

  if (data.rating) {
    data.rating = data.rating.toFixed(1);
  }

  try {
    revalidatePath("/");

    const result = await sql`
      UPDATE restaurants 
      SET (
        name, 
        slug, 
        address, 
        city,
        address_url, 
        google_maps_embedded_url,
        latitude, 
        longitude, 
        location, 
        restaurant_summary, 
        halal_status,
        halal_description,
        alcohol_served,
        pork_served,
        slaughter_method,
        rating,
        price,
        phone,
        website,
        cover_photo_url,
        other_photos_url
      ) = (
        ${data.name}, 
        ${data.slug}, 
        ${data.address}, 
        ${data.city}, 
        ${data.address_url}, 
        ${data.google_maps_embedded_url}, 
        ${data.latitude}, 
        ${data.longitude}, 
        ST_GeomFromText('POINT(' || ${lon} || ' ' || ${lat} || ')',4326),
        ${data.restaurant_summary},
        ${data.halal_status},
        ${data.halal_description},
        ${data.alcohol_served},
        ${data.pork_served},
        ${data.slaughter_method},
        ${data.rating},
        ${data.price},
        ${data.phone},
        ${data.website},
        ${data.cover_photo_url},
        ${data.other_photos_url}
      )
      WHERE id = ${id}
      RETURNING *;
    `;

    const updatedRestaurantSlug = result.rows[0].slug;

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

    redirectPath = `/dashboard/restaurants/${updatedRestaurantSlug}`;

    return {
      id: id,
      slug: updatedRestaurantSlug,
    };
  } catch (e) {
    return { message: `Failed to update cuisine. ${e}` };
  } finally {
    if (redirectPath) redirect(redirectPath);
  }
}
