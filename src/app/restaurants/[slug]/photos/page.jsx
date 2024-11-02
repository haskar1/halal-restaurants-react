import getRestaurant from "@/utils/get-restaurant";
import Image from "next/image";

export const dynamicParams = true;

// export const metadata = {
// title: " [RESTAURANT NAME HERE]| Who Is Halal",
// };

export default async function RestaurantPage({ params }) {
  const restaurant = await getRestaurant(decodeURIComponent(params.slug));
  const photosArr = [];

  if (restaurant?.other_photos_url?.length > 0) {
    restaurant.other_photos_url.map((photoUrl) => photosArr.push(photoUrl));
  }

  return (
    <>
      {restaurant ? (
        <div>
          <div className="container">
            <div className="grid gap-8 my-16 mx-auto max-w-2xl">
              <div className="cover-photo">
                <Image
                  id={`restaurant-photo-1`}
                  src={restaurant.cover_photo_url}
                  alt={
                    restaurant.cover_photo_author
                      ? `Photo by ${restaurant.cover_photo_author}`
                      : restaurant.name
                  }
                  className="w-full h-auto mb-2"
                  width="400"
                  height="400"
                />
                {restaurant.cover_photo_author && (
                  <p>Photo by {restaurant.cover_photo_author}</p>
                )}
              </div>
              {restaurant.other_photos_url.length > 0 &&
                restaurant.other_photos_url.map((url, index) => (
                  <Image
                    id={`restaurant-photo-${index + 2}`}
                    key={index}
                    src={url}
                    alt={`${restaurant.name} Photo ${index + 1}`}
                    className="w-full h-auto"
                    width="400"
                    height="400"
                  />
                ))}
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
