"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";

export default async function createCuisine(
  prevState: any,
  formData: FormData
) {
  const schema = z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Cuisine name cannot be empty." }),
    tag_color: z.string().trim(),
  });

  const parse = schema.safeParse({
    name: formData.get("name"),
    tag_color: formData.get("tag_color"),
  });

  if (!parse.success) {
    let errorMsg: string = "";
    parse.error.errors.forEach((error) => {
      errorMsg += `${error.message} `;
    });
    return { message: errorMsg };
  }

  const data = parse.data;
  let redirectPath = "";

  try {
    revalidatePath("/");

    const cuisineExists = await sql`
      SELECT * FROM cuisines WHERE name ILIKE ${data.name};
    `;

    if (cuisineExists.rows[0]) {
      const existingCuisineId = cuisineExists.rows[0].id;
      redirectPath = `/dashboard/cuisines/${existingCuisineId}`;
    } else {
      const newCuisine = await sql`
        INSERT INTO cuisines (name, tag_color)
        VALUES (${data.name}, ${data.tag_color})
        RETURNING id;
      `;

      const newCuisineId = newCuisine.rows[0].id;

      redirectPath = `/dashboard/cuisines/${newCuisineId}`;
    }
  } catch (e) {
    return { message: `Failed to create cuisine. ${e}` };
  } finally {
    if (redirectPath) {
      revalidatePath("/");
      redirect(redirectPath);
    }
  }
}
