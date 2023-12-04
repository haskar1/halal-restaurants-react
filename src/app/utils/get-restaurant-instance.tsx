import prisma from "@/lib/prisma";

export async function getRestaurantInstance({
  params,
}: {
  params: { id: string };
}) {
  const restaurantInstance = await prisma.restaurantInstance.findUnique({
    where: {
      id: params.id,
    },
    include: {
      restaurant: {
        include: {
          cuisines: {},
        },
      },
    },
  });

  return restaurantInstance;
}
