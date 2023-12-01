import Link from "next/link";
import prisma from "@/lib/prisma";

const restaurants = await prisma.restaurant.findMany({
  include: {
    cuisines: {
      select: {
        id: true,
        name: true,
      },
    },
    locations: {
      select: {
        id: true,
        city: true,
        state: true,
        country: true,
      },
    },
  },
});

export default function RestaurantList() {
  return (
    <>
      <h1 className="text-3xl pb-8">Restaurant List</h1>
      <ul className="grid gap-10 grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <Link
              className="border-[3px] border-solid border-[#b9ae8c] rounded-lg p-8"
              href={`/dashboard/restaurants/${encodeURIComponent(
                restaurant.id.toString()
              )}`}
              key={restaurant.id}
            >
              <li>
                <h2 className="text-2xl pb-6">{restaurant.name}</h2>

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
                  <p>None</p>
                )}

                <p>Summary: {restaurant.summary}</p>
              </li>
            </Link>
          ))
        ) : (
          <li>There are no restaurants.</li>
        )}
      </ul>
    </>
  );
}
