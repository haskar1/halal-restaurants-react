import RestaurantCardLoading from "@/components/RestaurantCardLoading";
import Link from "next/link";
import Image from "next/image";

export default function SearchResultsList({
  isActive,
  showDistance,
  searchResults,
}) {
  return (
    <div className="search-list">
      {searchResults?.features ? (
        searchResults.features.length > 0 ? (
          <div className="listings">
            {searchResults.features.map((restaurant) => (
              <div
                key={restaurant.properties.id}
                className={
                  isActive === restaurant.properties.id ? "item active" : "item"
                }
              >
                <Link
                  href={`/restaurants/${restaurant.properties.slug}`}
                  target="_blank"
                >
                  {/* <img
                    src={restaurant.properties.cover_photo_url}
                    className="item__cover-photo"
                    width="100%"
                    height="auto"
                  /> */}
                  <Image
                    src={restaurant.properties.cover_photo_url}
                    alt={restaurant.properties.name}
                    className="item__cover-photo"
                    width="250"
                    height="250"
                  />
                  <div className="item__text-container">
                    <span className="text-[#003089]">
                      {restaurant.properties.name}
                    </span>
                    <span>{restaurant.properties.address}</span>
                    {showDistance && (
                      <span>
                        <b>{restaurant.properties.distance} miles</b>
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-black">No restaurants found in this area</p>
        )
      ) : (
        <div className="listings">
          <RestaurantCardLoading />
          <RestaurantCardLoading />
          <RestaurantCardLoading />
          <RestaurantCardLoading />
          <RestaurantCardLoading />
          <RestaurantCardLoading />
        </div>
      )}
    </div>
  );
}
