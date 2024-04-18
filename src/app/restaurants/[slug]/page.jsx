import getRestaurant from "@/utils/get-restaurant";

export const dynamicParams = true;
export const fetchCache = "force-no-store";

// export const metadata = {
// title: " [RESTAURANT NAME HERE]| Who Is Halal",
// };

export default async function RestaurantList({ params }) {
  const restaurant = await getRestaurant(decodeURIComponent(params.slug));

  return (
    <>
      {restaurant ? (
        <div>
          <h1 className="text-3xl pb-8">{restaurant.name}</h1>

          <div className="pb-8">
            {restaurant.address && <p>Address: {restaurant.address}</p>}
            {restaurant.rating && <p>Rating: {restaurant.rating}</p>}
            {restaurant.price && <p>Price: {restaurant.price}</p>}
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
            ) : null}

            {restaurant.summary && <p>Summary: {restaurant.summary}</p>}
            {restaurant.halal_description && (
              <p>Halal Description: {restaurant.halal_description}</p>
            )}
          </div>
        </div>
      ) : (
        <h1>Restaurant Not Found</h1>
      )}
    </>
  );
}
