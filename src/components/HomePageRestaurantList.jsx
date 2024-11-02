"use client";

import { useEffect, useState } from "react";
import RestaurantCardLoading from "@/components/RestaurantCardLoading";
import Link from "next/link";
import Image from "next/image";
import CuisineTags from "@/components/CuisineTags";

export default function HomePageRestaurantList({
  userLatitude,
  userLongitude,
  limit,
}) {
  const [popularRestaurants, setPopularRestaurants] = useState(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState(null);
  const [popularRestaurantsLoadingMsg, setPopularRestaurantsLoadingMsg] =
    useState("");
  const [nearbyRestaurantsLoadingMsg, setNearbyRestaurantsLoadingMsg] =
    useState("");

  function fetchPopularRestaurants() {
    fetch(
      `/api/get-popular-restaurants?userLatitude=${userLatitude}&userLongitude=${userLongitude}&limit=${limit}`
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.error) {
          setPopularRestaurantsLoadingMsg("No restaurants found");
          return;
        }
        setPopularRestaurants(json.restaurants);
      })
      .catch((error) => {
        console.error("Error fetching restaurants: ", error);
      });
  }

  function fetchNearbyRestaurants() {
    fetch(
      `/api/get-nearby-restaurants?userLatitude=${userLatitude}&userLongitude=${userLongitude}&limit=${limit}`
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.error) {
          setNearbyRestaurantsLoadingMsg("No restaurants found");
          return;
        }
        setNearbyRestaurants(json.restaurants);
      })
      .catch((error) => {
        console.error("Error fetching restaurants: ", error);
      });
  }

  useEffect(() => {
    fetchPopularRestaurants();
    if (userLatitude && userLongitude) fetchNearbyRestaurants();
  }, []);

  const restaurantLoadingCards = [];
  for (let i = 0; i < 12; i++) {
    restaurantLoadingCards.push(<RestaurantCardLoading key={i} />);
  }

  return (
    <div className="pb-10 sm:pb-20">
      {userLatitude && userLongitude && (
        <div className="homepage__search-list">
          <h2 className="p-4 pb-8 text-[2rem] text-[#23424a]">
            Nearby Restaurants
          </h2>
          {nearbyRestaurantsLoadingMsg ? (
            <div>{nearbyRestaurantsLoadingMsg}</div>
          ) : nearbyRestaurants ? (
            <div className="listings">
              {nearbyRestaurants.map((restaurant) => (
                <Link
                  href={`/restaurants/${restaurant.slug}`}
                  key={restaurant.restaurant_id}
                  className="item"
                >
                  {restaurant.rating && restaurant.rating !== "NaN" && (
                    <div className="item__rating">{restaurant.rating}</div>
                  )}
                  <Image
                    src={restaurant.cover_photo_url}
                    alt={restaurant.restaurant_name}
                    className="item__cover-photo"
                    width="250"
                    height="250"
                  />
                  <div className="item__text-container">
                    <div className="text-[#003089] text-lg font-medium pb-2 leading-[1.3]">
                      {restaurant.restaurant_name}
                    </div>

                    {restaurant.cuisines && (
                      <div className="pb-2">
                        <CuisineTags cuisines={restaurant.cuisines} />{" "}
                      </div>
                    )}

                    <div>{restaurant.address}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="listings">{restaurantLoadingCards}</div>
          )}
        </div>
      )}
      <div className="homepage__search-list">
        <h2 className="p-4 pb-10 text-[2rem] text-[#23424a]">
          Popular Restaurants
        </h2>
        {popularRestaurantsLoadingMsg ? (
          <div>{popularRestaurantsLoadingMsg}</div>
        ) : popularRestaurants ? (
          <div className="listings">
            {popularRestaurants.map((restaurant) => (
              <Link
                href={`/restaurants/${restaurant.slug}`}
                key={restaurant.restaurant_id}
                className="item"
              >
                {restaurant.rating && restaurant.rating !== "NaN" && (
                  <div className="item__rating">{restaurant.rating}</div>
                )}
                <Image
                  src={restaurant.cover_photo_url}
                  alt={restaurant.restaurant_name}
                  className="item__cover-photo"
                  width="250"
                  height="250"
                />
                <div className="item__text-container">
                  <div className="text-[#003089] text-lg font-medium pb-2 leading-[1.3]">
                    {restaurant.restaurant_name}
                  </div>

                  {restaurant.cuisines && (
                    <div className="pb-2">
                      <CuisineTags cuisines={restaurant.cuisines} />{" "}
                    </div>
                  )}

                  <div>{restaurant.address}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="listings">{restaurantLoadingCards}</div>
        )}
      </div>
    </div>
  );
}
