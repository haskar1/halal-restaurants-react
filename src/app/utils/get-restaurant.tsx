import { cache } from "react";
import prisma from "@/lib/prisma";

export const getRestaurant = cache(async (id: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: id,
    },
    include: {
      cuisines: true,
      locations: true,
      restaurantInstances: true,
    },
  });
  return restaurant;
});
