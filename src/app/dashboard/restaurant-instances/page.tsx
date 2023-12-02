import Link from "next/link";
import prisma from "@/lib/prisma";

const restaurantInstances = await prisma.restaurantInstance.findMany({
  include: {
    restaurant: {
      include: {
        cuisines: {},
      },
    },
    location: {},
  },
});

export default function RestaurantInstanceList() {
  return (
    <>
      <h1 className="text-3xl pb-8">Restaurant Instance List</h1>
      <ul className="flex flex-wrap gap-8">
        {restaurantInstances.length > 0 ? (
          restaurantInstances.map((restaurantInstance) => (
            <li
              key={restaurantInstance.id}
              className="w-[90%] max-w-[20rem] border-[3px] border-solid border-[#b9ae8c] rounded-lg p-8"
            >
              <Link
                href={`/dashboard/restaurant-instances/${encodeURIComponent(
                  restaurantInstance.id.toString()
                )}`}
              >
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
              </Link>
            </li>
          ))
        ) : (
          <li>There are no restaurants.</li>
        )}
      </ul>
    </>
  );
}
