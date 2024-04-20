import getRestaurant from "@/utils/get-restaurant";
import Image from "next/image";

export const dynamicParams = true;
export const fetchCache = "force-no-store";

// export const metadata = {
// title: " [RESTAURANT NAME HERE]| Who Is Halal",
// };

export default async function RestaurantPage({ params }) {
  const restaurant = await getRestaurant(decodeURIComponent(params.slug));
  const photosArr = [];

  if (restaurant?.cover_photo_url) {
    photosArr.push(restaurant.cover_photo_url);
  }

  if (restaurant?.other_photos_url?.length > 0) {
    restaurant.other_photos_url.map((photoUrl) => photosArr.push(photoUrl));
  }

  return (
    <>
      {restaurant ? (
        <div>
          <div className="container">
            <div className="grid gap-8 mt-8 mx-auto max-w-2xl">
              {photosArr.length > 0 &&
                photosArr.map((photo_url, index) => (
                  <Image
                    id={`restaurant-photo-${index + 1}`}
                    key={index}
                    src={photo_url}
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
