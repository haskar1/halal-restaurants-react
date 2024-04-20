import getRestaurant from "@/utils/get-restaurant";
import deleteRestaurant from "@/utils/delete-restaurant";
import DeleteButton from "@/components/DeleteButton";
import UpdateButton from "@/components/UpdateButton";
import Link from "next/link";

export const dynamicParams = true;
export const fetchCache = "force-no-store";

export default async function RestaurantList({ params }) {
  const restaurant = await getRestaurant(decodeURIComponent(params.slug));

  return (
    <>
      {restaurant ? (
        <div className="container">
          <h1 className="text-3xl pb-8">{restaurant.name}</h1>

          <div className="grid gap-4 pb-8">
            {restaurant.slug && (
              <Link
                href={`/restaurants/${restaurant.slug}`}
                target="_blank"
                className="text-sky-600"
              >
                Client View
              </Link>
            )}

            <p>ID: {restaurant.id}</p>
            <p>Slug: {restaurant.slug}</p>

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
            ) : (
              <p>Cuisine(s):</p>
            )}

            <p>Address: {restaurant.address}</p>
            <p>
              Address URL:{" "}
              <a
                href={restaurant.address_url}
                target="_blank"
                className="text-blue-500"
              >
                {restaurant.address_url}
              </a>
            </p>
            <p>
              Google Maps Embedded URL: {restaurant.google_maps_embedded_url}
            </p>
            <p>Latitude: {restaurant.latitude}</p>
            <p>Longitude: {restaurant.longitude}</p>
            <p>Location: {restaurant.location}</p>
            <p>Restaurant Summary: {restaurant.restaurant_summary}</p>
            <p>Halal Status: {restaurant.halal_status}</p>
            <p>Halal Description: {restaurant.halal_description}</p>
            <p>Alcohol Served? {restaurant.alcohol_served}</p>
            <p>Pork Served? {restaurant.pork_served}</p>
            <p>Slaughter Method: {restaurant.slaughter_method}</p>
            <p>Rating: {restaurant.rating}</p>
            <p>Price: {restaurant.price}</p>
            <p>Phone: {restaurant.phone}</p>
            <p>
              Website:{" "}
              <a
                href={restaurant.website}
                target="_blank"
                className="text-blue-500"
              >
                {restaurant.website}
              </a>
            </p>
            <p>
              Cover Photo URL:{" "}
              <a
                href={restaurant.cover_photo_url}
                target="_blank"
                className="text-blue-500"
              >
                {restaurant.cover_photo_url}
              </a>
            </p>

            {restaurant.other_photos_url?.length > 1 ? (
              <p>
                Other Photos URLs:{" "}
                {restaurant.other_photos_url.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    className="text-blue-500"
                  >
                    <span>
                      {url}
                      {index < restaurant.other_photos_url.length - 1 && ", "}
                    </span>
                  </a>
                ))}
              </p>
            ) : restaurant.other_photos_url?.length === 1 ? (
              <p>
                Other Photos URL:{" "}
                <a
                  href={restaurant.other_photos_url[0]}
                  target="_blank"
                  className="text-blue-500"
                >
                  {restaurant.other_photos_url[0]}
                </a>
              </p>
            ) : (
              <p>Other Photos URLs:</p>
            )}

            <p>Created At: {restaurant.created_at.toString()}</p>
            <p>Updated At: {restaurant.updated_at.toString()}</p>
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
