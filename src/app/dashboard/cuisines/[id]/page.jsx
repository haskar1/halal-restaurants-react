import getCuisine from "@/utils/get-cuisine";

export const dynamicParams = true;
export const fetchCache = "force-no-store";

// export async function generateStaticParams() {
//   const cuisines = await getCuisines();

//   if (cuisines && cuisines.length > 0) {
//     return cuisines.map((cuisine) => ({
//       id: cuisine.id.toString(),
//     }));
//   }
// }

export default async function CuisineList({ params }) {
  const cuisine = await getCuisine(params.id);

  return (
    <>
      {cuisine ? (
        <div>
          <h1 className="text-3xl pb-8">{cuisine.cuisine_name} Restaurants</h1>

          {/* Cuisine's restaurants */}
          {cuisine.restaurants.length > 0 ? (
            <ul className="flex flex-wrap gap-8">
              {cuisine.restaurants.map((restaurant) => (
                <li
                  key={restaurant.restaurant_id}
                  className="w-[90%] max-w-[20rem] border-[3px] border-solid border-[#b9ae8c] rounded-lg p-8"
                >
                  <a
                    href={`/dashboard/restaurants/${encodeURIComponent(
                      restaurant.restaurant_id.toString()
                    )}`}
                  >
                    <p className="text-2xl pb-6">
                      {restaurant.restaurant_name}
                    </p>
                    {restaurant.restaurant_address && (
                      <p>Address: {restaurant.restaurant_address}</p>
                    )}
                  </a>
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
