import Link from "next/link";
import prisma from "@/lib/prisma";

const restaurantInstances = await prisma.restaurantInstance.findMany({
  include: {
    restaurant: {
      include: {
        cuisines: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    location: {
      select: {
        id: true,
        city: true,
        state: true,
        country: true,
      },
    },
  },
});

export default function RestaurantInstanceList() {
  return (
    <>
      <h1 className="text-3xl pb-8">Restaurant Instance List</h1>
      <ul className="grid gap-10 grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]">
        {restaurantInstances.length > 0 ? (
          restaurantInstances.map((restaurantInstance) => (
            <Link
              className="border-[3px] border-solid border-[#b9ae8c] rounded-lg p-8"
              href={`/dashboard/restaurant-instances/${encodeURIComponent(
                restaurantInstance.id.toString()
              )}`}
              key={restaurantInstance.id}
            >
              <li>
                <h2 className="text-2xl pb-6">
                  {restaurantInstance.restaurant.name}
                </h2>

                {restaurantInstance.restaurant.cuisines.length > 1 ? (
                  <p>
                    Cuisines:{" "}
                    {restaurantInstance.restaurant.cuisines.map(
                      (cuisine, index) => (
                        <span key={index}>
                          {cuisine.name}
                          {index <
                            restaurantInstance.restaurant.cuisines.length - 1 &&
                            ", "}
                        </span>
                      )
                    )}
                  </p>
                ) : restaurantInstance.restaurant.cuisines.length === 1 ? (
                  <p>
                    Cuisine:{" "}
                    {restaurantInstance.restaurant.cuisines.map((cuisine) => (
                      <span key={cuisine.id}>{cuisine.name}</span>
                    ))}
                  </p>
                ) : (
                  <p>None</p>
                )}

                <p>
                  Location:{" "}
                  <span key={restaurantInstance.locationId}>
                    {restaurantInstance.location.city + ", "}
                    {restaurantInstance.location.state &&
                      restaurantInstance.location.state + ", "}
                    {restaurantInstance.location.country}
                  </span>
                </p>

                {restaurantInstance.rating && (
                  <p>Rating: {restaurantInstance.rating}</p>
                )}

                <p>Price: {restaurantInstance.price}</p>

                {restaurantInstance.restaurant.summary && (
                  <p>Summary: {restaurantInstance.restaurant.summary}</p>
                )}

                <p>Address: {restaurantInstance.address}</p>
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
