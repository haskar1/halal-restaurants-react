"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createCuisine(prevState: any, formData: FormData) {
  const schema = z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Cuisine name cannot be empty." })
      .max(100, { message: "Must be less than 100 characters." }),
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
    const cuisine = await prisma.cuisine.create({
      data: {
        name: `${data.name}`,
      },
    });

    revalidatePath("/");
    return {
      id: cuisine.id,
    };
  } catch (e) {
    return { message: "Failed to create cuisine" };
  }
}
