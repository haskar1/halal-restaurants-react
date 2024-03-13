"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
// import axios from "axios";
import { sql } from "@vercel/postgres";

export async function createCuisine(prevState: any, formData: FormData) {
  const schema = z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Cuisine name cannot be empty." }),
  });

  const parse = schema.safeParse({
    name: formData.get("name"),
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
    // const cuisine = await axios
    //   .post("http://localhost:9000/cuisines/create", {
    //     name: `${data.name}`,
    //   })
    //   .then((res) => {
    //     return {
    //       id: res.data.id,
    //     };
    //   });
    const cuisine = await sql`
    INSERT INTO cuisines (name)
    VALUES (${data.name})
    RETURNING id;
  `;
    const newCuisineId = cuisine.rows[0].id;
    revalidatePath("/");
    return {
      id: newCuisineId,
    };
  } catch (e) {
    return { message: "Failed to create cuisine" };
  }
}
