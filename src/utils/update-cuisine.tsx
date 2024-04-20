"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";

export default async function updateCuisine(
  prevState: any,
  formData: FormData
) {
  const schema = z.object({
    id: z.string().trim().min(1, { message: "Cuisine id missing or invalid." }),
    name: z
      .string()
      .trim()
      .min(1, { message: "Cuisine name cannot be empty." }),
    tag_color: z.string().trim(),
  });

  const parse = schema.safeParse({
    id: formData.get("id"),
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
  const id = data.id;
  let redirectPath = "";

  try {
    revalidatePath("/");
    const updatedCuisine = await sql`
        UPDATE cuisines
        SET name = ${data.name}, tag_color = ${data.tag_color}
        WHERE id = ${id};
      `;
    redirectPath = `/dashboard/cuisines/${id}`;
  } catch (e) {
    return { message: `Failed to update cuisine. ${e}` };
  } finally {
    if (redirectPath) redirect(redirectPath);
  }
}
