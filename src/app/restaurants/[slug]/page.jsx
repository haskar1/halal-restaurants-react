import getRestaurant from "@/utils/get-restaurant";
import ImageGallery from "@/components/ImageGallery";
import Alert from "@mui/material/Alert";
import StarRating from "@/components/StarRating";
import CuisineTags from "@/components/CuisineTags";
import MapIcon from "@mui/icons-material/Map";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import "./style.css";

export const dynamicParams = true;
export const fetchCache = "force-no-store";

// export const metadata = {
// title: " [RESTAURANT NAME HERE]| Who Is Halal",
// };

export default async function RestaurantPage({ params }) {
  const restaurant = await getRestaurant(decodeURIComponent(params.slug));

  return (
    <>
      {restaurant ? (
        <div>
          {/* Title and images */}
          <div className="grid pb-16">
            <ImageGallery
              coverPhotoUrl={restaurant.cover_photo_url}
              otherPhotosUrls={restaurant.other_photos_url}
              restaurantName={restaurant.name}
              restaurantSlug={restaurant.slug}
            />
            <div className="restaurant__title container pt-8">
              <h1 className="text-[1.625rem] pb-4">{restaurant.name}</h1>
              <div className="flex flex-wrap gap-4">
                <StarRating rating={restaurant.rating} />
                <CuisineTags cuisines={restaurant.cuisines} />
              </div>
            </div>
          </div>

          {/* About this restaurant */}
          <div className="container">
            <div className="flex flex-wrap justify-between gap-8 pb-8">
              {(restaurant.halal_status ||
                restaurant.halal_description ||
                restaurant.alcohol_served ||
                restaurant.pork_served ||
                restaurant.slaughter_method ||
                restaurant.restaurant_summary) && (
                <div>
                  <div className="flex flex-wrap gap-6 items-center">
                    <h2 className="font-medium">About this restaurant</h2>
                    {restaurant.halal_status && (
                      <Alert
                        severity={
                          restaurant.halal_status === "Fully Halal"
                            ? "success"
                            : restaurant.halal_status === "Partially Halal"
                              ? "warning"
                              : "error"
                        }
                        className="py-1 px-3 w-fit"
                      >
                        {restaurant.halal_status === "Fully Halal"
                          ? "Full Halal Menu"
                          : restaurant.halal_status === "Partially Halal"
                            ? "Partial Halal Menu"
                            : "Not Halal"}
                      </Alert>
                    )}
                  </div>

                  {(restaurant.halal_description ||
                    restaurant.alcohol_served ||
                    restaurant.pork_served ||
                    restaurant.slaughter_method) && (
                    <div className="grid gap-4 pt-10 pb-10">
                      {restaurant.halal_description && (
                        <div>
                          <p className="max-w-xl">
                            <span className="font-semibold">
                              Halal information:
                            </span>{" "}
                            {restaurant.halal_description}
                          </p>
                        </div>
                      )}

                      {(restaurant.alcohol_served ||
                        restaurant.pork_served ||
                        restaurant.slaughter_method) && (
                        <div className="flex flex-wrap gap-4">
                          {restaurant.alcohol_served === "Yes" ? (
                            <p className="border border-solid border-blue text-blue-600 rounded py-1 px-3 w-fit">
                              Serves Alcohol
                            </p>
                          ) : restaurant.alcohol_served === "No" ? (
                            <p className="border border-solid border-green text-green-700 rounded py-1 px-3 w-fit">
                              No Alcohol
                            </p>
                          ) : null}

                          {restaurant.pork_served === "Yes" ? (
                            <p className="border border-solid border-blue text-blue-600 rounded py-1 px-3 w-fit">
                              Serves Pork
                            </p>
                          ) : restaurant.pork_served === "No" ? (
                            <p className="border border-solid border-green text-green-700 rounded py-1 px-3 w-fit">
                              No Pork
                            </p>
                          ) : null}

                          {restaurant.slaughter_method === "Machine Cut" ? (
                            <p className="border border-solid border-blue text-purple-600 rounded py-1 px-3 w-fit">
                              Machine Cut Meat
                            </p>
                          ) : restaurant.slaughter_method ===
                            "Hand Slaughtered" ? (
                            <p className="border border-solid border-green text-green-700 rounded py-1 px-3 w-fit">
                              Hand Slaughtered Meat
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}

                  {restaurant.restaurant_summary && (
                    <div className="restaurant__summary pt-10 pb-5">
                      <p className="pb-4 font-semibold">
                        What kind of food does {restaurant.name} have?
                      </p>
                      <p className="max-w-xl">
                        {restaurant.restaurant_summary}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Location Info */}
              <div className="grid gap-12">
                <div className="restaurant__location-info grid gap-4 py-6 px-4 rounded-xl shadow-lg h-fit">
                  <h3 className="font-medium pb-3 underline underline-offset-[6px]">
                    Location Info
                  </h3>
                  {restaurant.price && (
                    <p>
                      <span>{restaurant.price}</span> out of <span>$$$$</span>
                    </p>
                  )}
                  {restaurant.address && (
                    <a
                      href={restaurant.address_url || "#"}
                      target="_blank"
                      className="flex gap-2 w-fit"
                    >
                      <MapIcon color="primary" />
                      <p>{restaurant.address}</p>
                    </a>
                  )}
                  {restaurant.phone && (
                    <a
                      href={`tel:${restaurant.phone}`}
                      className="flex gap-2 w-fit"
                    >
                      <PhoneIcon color="primary" />
                      <p>{restaurant.phone}</p>
                    </a>
                  )}
                  {restaurant.website && (
                    <a
                      href={restaurant.website}
                      target="_blank"
                      className="flex gap-2 w-fit"
                    >
                      <LanguageIcon color="primary" />
                      <p>Website</p>
                    </a>
                  )}
                </div>

                <div className="restaurant__google-map">
                  <iframe
                    src={restaurant.google_maps_embedded_url}
                    width="400"
                    height="300"
                    style={{ border: 0, width: "100%" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <h1>Restaurant Not Found</h1>
        </div>
      )}
    </>
  );
}
