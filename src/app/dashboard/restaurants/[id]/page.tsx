import prisma from "@/lib/prisma";
import callAPI_GET from "@/utils/callAPI_GET";
import { RestaurantInterface } from "@/lib/modelsInterfaces";

export const dynamicParams = true;

export async function generateStaticParams() {
  const restaurants = await prisma.restaurant.findMany();
  return restaurants.map((restaurant) => ({
    id: restaurant.id.toString(),
  }));
}

export default async function RestaurantList({
  params,
}: {
  params: { id: string };
}) {
  const restaurant: RestaurantInterface = await callAPI_GET(
    `restaurants/${params.id}`
  );

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
          {restaurant.summary && <p>Summary: {restaurant.summary}</p>}

          {/* Restaurant's Locations */}
          <h2 className="text-xl py-8">Locations</h2>
          {restaurant.restaurantInstances.length > 0 ? (
            <ul className="flex flex-wrap gap-8">
              {restaurant.restaurantInstances.map((restaurantInstance) => (
                <li
                  key={restaurantInstance.id}
                  className="w-[90%] max-w-[20rem] border-[3px] border-solid border-[#b9ae8c] rounded-lg p-8"
                >
                  <a
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
                    {restaurantInstance.rating && (
                      <p>Rating: {restaurantInstance.rating}</p>
                    )}
                    <p>Price: {restaurantInstance.price}</p>
                  </a>
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
