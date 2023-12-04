import prisma from "@/lib/prisma";

export async function getRestaurant({ params }: { params: { id: string } }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: params.id,
    },
    include: {
      cuisines: {},
      restaurantInstances: {
        include: {
          location: {},
        },
      },
    },
  });

  return restaurant;
}
