import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCuisine } from "@/utils/get-cuisine";

export const dynamicParams = true;

export async function generateStaticParams() {
  const cuisines = await prisma.cuisine.findMany();
  return cuisines.map((cuisine) => ({
    id: cuisine.id.toString(),
  }));
}

export default async function CuisineList({
  params,
}: {
  params: { id: string };
}) {
  const cuisine = await getCuisine({ params });

  return (
    <>
      {cuisine ? (
        <div>
          <h1 className="text-3xl pb-8">{cuisine.name} Restaurants</h1>

          {/* Restaurant's Locations */}
          {cuisine.restaurants.length > 0 ? (
            <ul className="flex flex-wrap gap-8">
              {cuisine.restaurants.map((restaurant) => (
                <li
                  key={restaurant.id}
                  className="w-[90%] max-w-[20rem] border-[3px] border-solid border-[#b9ae8c] rounded-lg p-8"
                >
                  <Link
                    href={`/dashboard/restaurants/${encodeURIComponent(
                      restaurant.id.toString()
                    )}`}
                  >
                    <p className="text-2xl pb-6">{restaurant.name}</p>

                    {restaurant.locations.length > 1 ? (
                      <p>
                        Locations:{" "}
                        {restaurant.locations.map((location, index) => (
                          <span key={location.id}>
                            {location.city + ", "}
                            {location.state && location.state + ", "}
                            {location.country}
                            {index < restaurant.locations.length - 1 && " || "}
                          </span>
                        ))}
                      </p>
                    ) : restaurant.locations.length === 1 ? (
                      <p>
                        Location:{" "}
                        {restaurant.locations.map((location) => (
                          <span key={location.id}>
                            {location.city + ", "}
                            {location.state && location.state + ", "}
                            {location.country}
                          </span>
                        ))}
                      </p>
                    ) : (
                      <p>No locations yet</p>
                    )}

                    {restaurant.summary && <p>Summary: {restaurant.summary}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>There are no restaurants with this cuisine yet.</p>
          )}
        </div>
      ) : (
        <h1>Cuisine Not Found</h1>
      )}
    </>
  );
}
