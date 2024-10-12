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

          <div className="grid gap-4 pb-8 whitespace-pre-line">
            {restaurant.slug && (
              <Link
                href={`/restaurants/${restaurant.slug}`}
                target="_blank"
                className="text-sky-600"
              >
                Client View
              </Link>
            )}

            <p>
              <b>ID:</b> {restaurant.id}
            </p>
            <p>
              <b>Slug:</b> {restaurant.slug}
            </p>

            {restaurant.cuisines?.length > 1 ? (
              <p>
                <b>Cuisines:</b>{" "}
                {restaurant.cuisines.map((cuisine, index) => (
                  <span key={cuisine.id}>
                    {cuisine.name}
                    {index < restaurant.cuisines.length - 1 && ", "}
                  </span>
                ))}
              </p>
            ) : restaurant.cuisines?.length === 1 ? (
              <p>
                <b>Cuisine:</b>{" "}
                {restaurant.cuisines.map((cuisine) => (
                  <span key={cuisine.id}>{cuisine.name}</span>
                ))}
              </p>
            ) : (
              <p>
                <b>Cuisine(s):</b>
              </p>
            )}

            <p>
              <b>Address:</b> {restaurant.address}
            </p>
            <p>
              <b>City/Town/Neighborhood/etc:</b> {restaurant.city}
            </p>
            <p>
              <b>Address URL:</b>{" "}
              <a
                href={restaurant.address_url}
                target="_blank"
                className="text-blue-500"
              >
                {restaurant.address_url}
              </a>
            </p>
            <p>
              <b>Google Maps Embedded URL:</b>{" "}
              {restaurant.google_maps_embedded_url}
            </p>
            <p>
              <b>Latitude:</b> {restaurant.latitude}
            </p>
            <p>
              <b>Longitude:</b> {restaurant.longitude}
            </p>
            <p>
              <b>Location:</b> {restaurant.location}
            </p>
            <p>
              <b>Restaurant Summary:</b> {restaurant.restaurant_summary}
            </p>
            <p>
              <b>Halal Status:</b> {restaurant.halal_status}
            </p>
            <p>
              <b>Halal Description:</b> {restaurant.halal_description}
            </p>
            <p>
              <b>Alcohol Served?</b> {restaurant.alcohol_served}
            </p>
            <p>
              <b>Pork Served?</b> {restaurant.pork_served}
            </p>
            <p>
              <b>Slaughter Method:</b> {restaurant.slaughter_method}
            </p>
            <p>
              <b>Rating:</b> {restaurant.rating}
            </p>
            <p>
              <b>Price:</b> {restaurant.price}
            </p>
            <p>
              <b>Phone:</b> {restaurant.phone}
            </p>
            <p>
              <b>Website:</b>{" "}
              <a
                href={restaurant.website}
                target="_blank"
                className="text-blue-500"
              >
                {restaurant.website}
              </a>
            </p>
            <p>
              <b>Cover Photo URL:</b>{" "}
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
                <b>Other Photos URLs:</b>{" "}
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
                <b>Other Photos URL:</b>{" "}
                <a
                  href={restaurant.other_photos_url[0]}
                  target="_blank"
                  className="text-blue-500"
                >
                  {restaurant.other_photos_url[0]}
                </a>
              </p>
            ) : (
              <p>
                <b>Other Photos URLs:</b>
              </p>
            )}

            <p>
              <b>Created At:</b> {restaurant.created_at.toString()}
            </p>
            <p>
              <b>Updated At:</b> {restaurant.updated_at.toString()}
            </p>
            <p>
              <b>Hide Restaurant From Website?</b>{" "}
              {restaurant.hide_restaurant ? "Yes" : "No"}
            </p>
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
