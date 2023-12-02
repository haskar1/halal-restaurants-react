import Link from "next/link";
import prisma from "@/lib/prisma";

async function getStaticPaths() {
  const restaurants = await prisma.restaurant.findMany();
  const paths = restaurants.map((restaurant) => ({
    params: { id: restaurant.id.toString() },
  }));

  return { paths, fallback: true };
}

async function getRestaurant({ params }: { params: { id: string } }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: params.id,
    },
    include: {
      cuisines: {
        select: {
          id: true,
          name: true,
        },
      },
      restaurantInstances: {
        include: {
          location: {
            select: {
              city: true,
              state: true,
              country: true,
            },
          },
        },
      },
    },
  });

  return restaurant;
}

export default async function RestaurantList({
  params,
}: {
  params: { id: string };
}) {
  const restaurant = await getRestaurant({ params });

  return (
    <>
      {restaurant ? (
        <div>
          <h1 className="text-3xl pb-8">{restaurant.name}</h1>

          {/* Restaurant's Cuisines */}
          {restaurant.cuisines.length > 1 ? (
            <p>
              Cuisines:{" "}
              {restaurant.cuisines.map((cuisine, index) => (
                <span key={cuisine.id}>
                  {cuisine.name}
                  {index < restaurant.cuisines.length - 1 && ", "}
                </span>
              ))}
            </p>
          ) : restaurant.cuisines.length === 1 ? (
            <p>
              Cuisine:{" "}
              {restaurant.cuisines.map((cuisine) => (
                <span key={cuisine.id}>{cuisine.name}</span>
              ))}
            </p>
          ) : (
            <p>None</p>
          )}

          {/* Restaurant's Summary */}
          <p>Summary: {restaurant.summary}</p>

          {/* Restaurant's Locations */}
          <h2 className="text-xl py-8">Locations</h2>
          {restaurant.restaurantInstances.length > 0 ? (
            <ul className="flex flex-wrap gap-8">
              {restaurant.restaurantInstances.map((restaurantInstance) => (
                <li
                  key={restaurantInstance.id}
                  className="w-[90%] max-w-[20rem] border-[3px] border-solid border-[#b9ae8c] rounded-lg p-8"
                >
                  <Link
                    href={`/dashboard/restaurant-instances/${encodeURIComponent(
                      restaurantInstance.id.toString()
                    )}`}
                  >
                    <p>
                      {restaurantInstance.location.city + ", "}
                      {restaurantInstance.location.state &&
                        restaurantInstance.location.state + ", "}
                      {restaurantInstance.location.country}
                    </p>

                    <p>Address: {restaurantInstance.address}</p>
                    <p>Rating: {restaurantInstance.rating}</p>
                    <p>Price: {restaurantInstance.price}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>There are no locations for this restaurant yet</p>
          )}
        </div>
      ) : (
        <h1>Restaurant Not Found</h1>
      )}
    </>
  );
}
