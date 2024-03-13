// import callAPI_GET from "@/utils/callAPI_GET";
import getRestaurants from "@/utils/get-restaurants";

export const fetchCache = "force-no-store";

export default async function RestaurantList() {
  const restaurants = await getRestaurants();

  return (
    <>
      <h1 className="text-3xl pb-8">Restaurant List</h1>
      <ul className="flex flex-wrap gap-8">
        {restaurants && restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <li
              key={restaurant.restaurant_id}
              className="w-[90%] max-w-[20rem] border-[3px] border-solid border-[#b9ae8c] rounded-lg p-8"
            >
              <a
                href={`/dashboard/restaurants/${encodeURIComponent(
                  restaurant.restaurant_id.toString()
                )}`}
              >
                <h2 className="text-2xl pb-6">{restaurant.restaurant_name}</h2>

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

                {restaurant.restaurant_address && (
                  <p>{restaurant.restaurant_address}</p>
                )}
              </a>
            </li>
          ))
        ) : (
          <li>No restaurants found.</li>
        )}
      </ul>
    </>
  );
}
