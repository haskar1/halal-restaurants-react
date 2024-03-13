// import callAPI_GET from "@/utils/callAPI_GET";
import getRestaurant from "@/utils/get-restaurant";

export const dynamicParams = true;
export const fetchCache = "force-no-store";

// export async function generateStaticParams() {
//   const restaurants = await getRestaurants();

//   if (restaurants && restaurants.length > 0) {
//     return restaurants.map((restaurant) => ({
//       id: restaurant.id,
//     }));
//   }
// }

export default async function RestaurantList({ params }) {
  const restaurant = await getRestaurant(params.id);

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
          ) : null}

          {/* Restaurant's Summary
          {restaurant.summary && <p>Summary: {restaurant.summary}</p>} */}

          {restaurant.address && <p>Address: {restaurant.address}</p>}
          {restaurant.rating && <p>Rating: {restaurant.rating}</p>}
          {restaurant.price && <p>Price: {restaurant.price}</p>}
        </div>
      ) : (
        <h1>Restaurant Not Found</h1>
      )}
    </>
  );
}
