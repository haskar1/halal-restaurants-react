import prisma from "@/lib/prisma";

export async function getCuisine({ params }: { params: { id: string } }) {
  const cuisine = await prisma.cuisine.findUnique({
    where: {
      id: params.id,
    },
    include: {
      restaurants: {
        include: {
          locations: {},
        },
      },
    },
  });

  return cuisine;
}
