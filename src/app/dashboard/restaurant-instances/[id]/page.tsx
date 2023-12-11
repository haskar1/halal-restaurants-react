import prisma from "@/lib/prisma";
import callAPI_GET from "@/utils/callAPI_GET";
import { RestaurantInstanceInterface } from "@/lib/modelsInterfaces";

export const dynamicParams = true;

export async function generateStaticParams() {
  const restaurantInstances = await prisma.restaurantInstance.findMany();
  return restaurantInstances.map((restaurantInstance) => ({
    id: restaurantInstance.id.toString(),
  }));
}

export default async function RestaurantInstanceList({
  params,
}: {
  params: { id: string };
}) {
  const restaurantInstance: RestaurantInstanceInterface = await callAPI_GET(
    `restaurant-instances/${params.id}`
  );

  return (
    <>
      {restaurantInstance ? (
        <div>
          <h1 className="text-3xl pb-8">
            {restaurantInstance.restaurant.name}
          </h1>

          {/* Restaurant's Cuisines */}
          {restaurantInstance.restaurant.cuisines.length > 1 ? (
            <p>
              Cuisines:{" "}
              {restaurantInstance.restaurant.cuisines.map((cuisine, index) => (
                <span key={cuisine.id}>
                  {cuisine.name}
                  {index < restaurantInstance.restaurant.cuisines.length - 1 &&
                    ", "}
                </span>
              ))}
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

          <p>Address: {restaurantInstance.address}</p>

          {restaurantInstance.rating && (
            <p>Rating: {restaurantInstance.rating}</p>
          )}

          <p>Price: {restaurantInstance.price}</p>

          {restaurantInstance.restaurant.summary && (
            <p>Summary: {restaurantInstance.restaurant.summary}</p>
          )}
        </div>
      ) : (
        <h1>Restaurant Instance Not Found</h1>
      )}
    </>
  );
}
