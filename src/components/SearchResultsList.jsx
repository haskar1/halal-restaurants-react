"use client";

import RestaurantCardLoading from "@/components/RestaurantCardLoading";
import Link from "next/link";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import CuisineTags from "@/components/CuisineTags";

export default function SearchResultsList({
  isActive,
  setIsActive,
  showDistance,
  searchResults,
  showPopup,
  clickedOnRestaurantPopup,
}) {
  const isMobile = useMediaQuery("(max-width:767px)", { noSsr: true });

  return (
    <div className="search-list">
      {searchResults?.features ? (
        searchResults.features.length > 0 ? (
          <div className="listings">
            {isMobile
              ? searchResults.features.map((restaurant) => (
                  <Link
                    href={`/restaurants/${restaurant.properties.slug}`}
                    target="_blank"
                    key={restaurant.properties.id}
                    className={
                      isActive === restaurant.properties.id
                        ? "item active"
                        : "item"
                    }
                  >
                    {restaurant.properties.rating &&
                      restaurant.properties.rating !== "NaN" && (
                        <div className="item__rating">
                          {restaurant.properties.rating}
                        </div>
                      )}
                    <Image
                      src={restaurant.properties.cover_photo_url}
                      alt={restaurant.properties.name}
                      className="item__cover-photo"
                      width="250"
                      height="250"
                    />
                    <div className="item__text-container">
                      <div className="text-[#003089] text-lg font-medium pb-2 leading-[1.3]">
                        {restaurant.properties.name}
                      </div>

                      {restaurant.properties.cuisines && (
                        <div className="pb-2">
                          <CuisineTags
                            cuisines={restaurant.properties.cuisines}
                          />{" "}
                        </div>
                      )}

                      <div>{restaurant.properties.address}</div>

                      {showDistance && (
                        <div>
                          <b>{restaurant.properties.distance} miles</b>
                        </div>
                      )}
                    </div>
                  </Link>
                ))
              : searchResults.features.map((restaurant) => (
                  <Link
                    href={`/restaurants/${restaurant.properties.slug}`}
                    target="_blank"
                    key={restaurant.properties.id}
                    className={
                      isActive === restaurant.properties.id
                        ? "item active"
                        : "item"
                    }
                    onMouseEnter={() => {
                      if (clickedOnRestaurantPopup?.current) return;
                      showPopup(restaurant.properties);
                    }}
                    onMouseLeave={() => {
                      if (clickedOnRestaurantPopup?.current) return;
                      const popups =
                        document.getElementsByClassName("maplibregl-popup");
                      if (popups.length) {
                        [...popups].map((popup) => popup.remove());
                      }
                      setIsActive("");
                    }}
                    onClick={() => {
                      clickedOnRestaurantPopup.current = true;
                      showPopup(restaurant.properties);
                    }}
                  >
                    {restaurant.properties.rating &&
                      restaurant.properties.rating !== "NaN" && (
                        <div className="item__rating">
                          {restaurant.properties.rating}
                        </div>
                      )}

                    <Image
                      src={restaurant.properties.cover_photo_url}
                      alt={restaurant.properties.name}
                      className="item__cover-photo"
                      width="250"
                      height="250"
                    />
                    <div className="item__text-container">
                      <div className="text-[#003089] text-lg font-medium pb-2 leading-[1.3]">
                        {restaurant.properties.name}
                      </div>

                      {restaurant.properties.cuisines && (
                        <div className="pb-2">
                          <CuisineTags
                            cuisines={restaurant.properties.cuisines}
                          />{" "}
                        </div>
                      )}

                      <div>{restaurant.properties.address}</div>

                      {showDistance && (
                        <div>
                          <b>{restaurant.properties.distance} miles</b>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
          </div>
        ) : (
          <p className="search-results-list-message text-black">
            No restaurants found in this area
          </p>
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
