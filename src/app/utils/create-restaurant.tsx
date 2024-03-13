"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
// import axios from "axios";
import { sql } from "@vercel/postgres";

export async function createRestaurant(prevState: any, formData: FormData) {
  const schema = z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Restaurant name cannot be empty." }),
    restaurant_tag: z
      .string()
      .trim()
      .min(1, { message: "Restaurant tag cannot be empty." }),
  });

  const parse = schema.safeParse({
    name: formData.get("name"),
    restaurant_tag: formData.get("restaurant_tag"),
  });

  if (!parse.success) {
    let errorMsg: string = "";
    parse.error.errors.forEach((error) => {
      errorMsg += `${error.message} `;
    });
    return { message: errorMsg };
  }

  const data = parse.data;

  try {
    // const restaurant = await axios
    //   .post("../api/restaurants/create", {
    //     name: `${data.name}`,
    //     restaurant_tag: `${data.restaurant_tag}`,
    //   })
    //   .then((res) => {
    //     return {
    //       id: res.data.id,
    //     };
    //   });
    const result = await sql`
    INSERT INTO restaurants (name, restaurant_tag)
    VALUES (${data.name}, ${data.restaurant_tag})
    RETURNING id;
  `;
    const newRestaurantId = result.rows[0].id;
    revalidatePath("/");
    return {
      id: newRestaurantId,
    };
  } catch (e) {
    return { message: "Failed to create restaurant" };
  }
}
