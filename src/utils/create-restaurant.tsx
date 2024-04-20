// @ts-nocheck
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";

export default async function createRestaurant(
  prevState: any,
  formData: FormData
) {
  const schema = z.object({
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
    name: formData.get("name"),
    slug: formData.get("slug"),
    address: formData.get("address"),
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
    const result = await sql`
      INSERT INTO restaurants (
        name, 
        slug, 
        address, 
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
      )
      VALUES (
        ${data.name}, 
        ${data.slug}, 
        ${data.address}, 
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
      RETURNING *;
    `;

    const newRestaurantId = result.rows[0].id;
    const newRestaurantSlug = result.rows[0].slug;

    data.cuisine.map(async (cuisineId) => {
      await sql`
          INSERT INTO restaurant_cuisines (restaurant_id, cuisine_id)
          VALUES (${newRestaurantId}, ${cuisineId})
        `;
    });

    revalidatePath("/");
    redirectPath = `/dashboard/restaurants/${newRestaurantSlug}`;

    return {
      id: newRestaurantId,
      slug: newRestaurantSlug,
    };
  } catch (error) {
    return { message: `Failed to create restaurant: ${error.message}` };
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}
