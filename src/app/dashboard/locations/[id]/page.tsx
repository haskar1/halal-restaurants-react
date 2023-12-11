import prisma from "@/lib/prisma";
import { getLocation } from "@/utils/get-location";

export const dynamicParams = true;

export async function generateStaticParams() {
  const locations = await prisma.location.findMany();
  return locations.map((location) => ({
    id: location.id.toString(),
  }));
}

export default async function LocationList({
  params,
}: {
  params: { id: string };
}) {
  const location = await getLocation({ params });

  return (
    <>
      {location ? (
        <div>
          <h1 className="text-3xl pb-8">{location.city}</h1>

          {/* Location's Restaurant Instances */}
          {location.restaurantInstances.length > 0 ? (
            <ul className="flex flex-wrap gap-8">
              {location.restaurantInstances.map((restaurantInstance) => (
                <li
                  key={restaurantInstance.id}
                  className="w-[90%] max-w-[20rem] border-[3px] border-solid border-[#b9ae8c] rounded-lg p-8"
                >
                  <a
                    href={`/dashboard/restaurant-instances/${encodeURIComponent(
                      restaurantInstance.id.toString()
                    )}`}
                  >
                    <p className="text-2xl pb-6">
                      {restaurantInstance.restaurant.name}
                    </p>

                    {/* Restaurant's Cuisines */}
                    {restaurantInstance.restaurant.cuisines.length > 1 ? (
                      <p>
                        Cuisines:{" "}
                        {restaurantInstance.restaurant.cuisines.map(
                          (cuisine, index) => (
                            <span key={cuisine.id}>
                              {cuisine.name}
                              {index <
                                restaurantInstance.restaurant.cuisines.length -
                                  1 && ", "}
                            </span>
                          )
                        )}
                      </p>
                    ) : restaurantInstance.restaurant.cuisines.length === 1 ? (
                      <p>
                        Cuisine:{" "}
                        {restaurantInstance.restaurant.cuisines.map(
                          (cuisine) => (
                            <span key={cuisine.id}>{cuisine.name}</span>
                          )
                        )}
                      </p>
                    ) : (
                      <p>None</p>
                    )}

                    {restaurantInstance.rating && (
                      <p>Rating: {restaurantInstance.rating}</p>
                    )}

                    <p>Price: {restaurantInstance.price}</p>

                    {restaurantInstance.restaurant.summary && (
                      <p>Summary: {restaurantInstance.restaurant.summary}</p>
                    )}

                    <p>Address: {restaurantInstance.address}</p>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>There are no restaurants at this location yet.</p>
          )}
        </div>
      ) : (
        <h1>Location Not Found</h1>
      )}
    </>
  );
}
