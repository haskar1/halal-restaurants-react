import getRestaurant from "@/utils/get-restaurant";
import deleteRestaurant from "@/utils/delete-restaurant";
import DeleteButton from "@/components/DeleteButton";
import UpdateButton from "@/components/UpdateButton";

export const dynamicParams = true;
export const fetchCache = "force-no-store";

export default async function RestaurantList({ params }) {
  const restaurant = await getRestaurant(decodeURIComponent(params.slug));

  return (
    <>
      {restaurant ? (
        <div>
          <h1 className="text-3xl pb-8">{restaurant.name}</h1>

          <div className="pb-8">
            {restaurant.id && <p>ID: {restaurant.id}</p>}
            {restaurant.slug && <p>Slug: {restaurant.slug}</p>}
            {restaurant.cuisines?.length > 1 ? (
              <p>
                Cuisines:{" "}
                {restaurant.cuisines.map((cuisine, index) => (
                  <span key={cuisine.id}>
                    {cuisine.name}
                    {index < restaurant.cuisines.length - 1 && ", "}
                  </span>
                ))}
              </p>
            ) : restaurant.cuisines?.length === 1 ? (
              <p>
                Cuisine:{" "}
                {restaurant.cuisines.map((cuisine) => (
                  <span key={cuisine.id}>{cuisine.name}</span>
                ))}
              </p>
            ) : null}

            {restaurant.address && <p>Address: {restaurant.address}</p>}
            {restaurant.address_url && (
              <p>Address URL: {restaurant.address_url}</p>
            )}
            {restaurant.latitude && <p>Latitude: {restaurant.latitude}</p>}
            {restaurant.longitude && <p>Longitude: {restaurant.longitude}</p>}
            {restaurant.location && <p>Location: {restaurant.location}</p>}

            {restaurant.restaurant_summary && (
              <p>Restaurant Summary: {restaurant.restaurant_summary}</p>
            )}
            {restaurant.halal_description && (
              <p>Halal Description: {restaurant.halal_description}</p>
            )}
            {restaurant.rating && <p>Rating: {restaurant.rating}</p>}
            {restaurant.price && <p>Price: {restaurant.price}</p>}
            {restaurant.cover_photo_url && (
              <p>Cover Photo URL: {restaurant.cover_photo_url}</p>
            )}
            {restaurant.other_photos_url?.length > 1 ? (
              <p>
                Other Photos URLs:{" "}
                {restaurant.other_photos_url.map((url, index) => (
                  <span key={index}>
                    {url}
                    {index < restaurant.other_photos_url.length - 1 && ", "}
                  </span>
                ))}
              </p>
            ) : restaurant.other_photos_url?.length === 1 ? (
              <p>
                Other Photos URL:{" "}
                {restaurant.other_photos_url.map((url, index) => (
                  <span key={index}>{url}</span>
                ))}
              </p>
            ) : null}

            {restaurant.created_at && (
              <p>Created At: {restaurant.created_at.toString()}</p>
            )}
            {restaurant.updated_at && (
              <p>Updated At: {restaurant.updated_at.toString()}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-[1rem]">
            <UpdateButton
              href={`/dashboard/restaurants/${decodeURIComponent(
                params.slug
              )}/update`}
              text="Update Restaurant"
            />

            <DeleteButton
              onClick={deleteRestaurant}
              args={restaurant.id}
              category="Restaurant"
            />
          </div>
        </div>
      ) : (
        <h1>Restaurant Not Found</h1>
      )}
    </>
  );
}
