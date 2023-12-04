import prisma from "@/lib/prisma";

export async function getLocation({ params }: { params: { id: string } }) {
  const location = await prisma.location.findUnique({
    where: {
      id: params.id,
    },
    include: {
      restaurantInstances: {
        include: {
          restaurant: {
            include: {
              cuisines: {},
            },
          },
        },
      },
    },
  });

  return location;
}
