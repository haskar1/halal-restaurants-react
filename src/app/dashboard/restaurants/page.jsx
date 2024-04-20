"use client";

import { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import "@/stylesheets/restaurants-list-async.css";
import Link from "next/link";

export const fetchCache = "force-no-store";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadingMsg, setLoadingMsg] = useState("Loading...");

  useEffect(() => {
    setIsLoadingMore(true);
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
    fetchRestaurants();

    document.body.classList.add("no-overflow");
    return () => {
      document.body.classList.remove("no-overflow");
    };
  }, []);

  function fetchRestaurants() {
    fetch(`/api/get-restaurants?pageNumber=${pageNumber}`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.error) {
          setLoadingMsg("No restaurants found");
          setHasMoreItems(false);
          return;
        }
        if (!json.restaurants) {
          setHasMoreItems(false);
          return;
        }
        setRestaurants((prevRestaurants) => {
          if (!prevRestaurants) {
            return [...json.restaurants];
          } else {
            return [...prevRestaurants, ...json.restaurants];
          }
        });
        setIsLoadingMore(false);
      })
      .catch((error) => {
        console.error("Error fetching restaurants: ", error);
      });
  }

  function isItemLoaded(index) {
    return !!restaurants[index];
  }

  function loadMoreItems(startIndex, stopIndex) {
    if (!isLoadingMore && hasMoreItems) {
      setIsLoadingMore(true);
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
      fetchRestaurants();
    }
  }

  return (
    <div className="restaurants-container">
      {restaurants ? (
        <div className="h-full">
          {/* <h1 className="text-3xl pb-8">Restaurant List</h1> */}
          <AutoSizer>
            {({ height, width }) => (
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={restaurants.length + (hasMoreItems ? 1 : 0)}
                loadMoreItems={loadMoreItems}
              >
                {({ onItemsRendered, ref }) => (
                  <List
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                    itemCount={restaurants.length + (hasMoreItems ? 1 : 0)}
                    itemSize={80}
                    height={height}
                    width={width}
                  >
                    {({ index, style }) => {
                      if (!isItemLoaded(index)) {
                        return <div style={style}>Loading...</div>;
                      }

                      const restaurant = restaurants[index];

                      return (
                        <div style={style}>
                          <Link
                            href={`/dashboard/restaurants/${restaurant.slug}`}
                          >
                            <div className="p-0 m-0">
                              <p className="p-0 m-0 truncate">
                                <b>{restaurant.restaurant_name}</b>
                              </p>

                              {restaurant.restaurant_address && (
                                <p className="p-0 m-0 truncate">
                                  {restaurant.restaurant_address}
                                </p>
                              )}
                            </div>
                          </Link>
                        </div>
                      );
                    }}
                  </List>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        </div>
      ) : (
        <p>{loadingMsg}</p>
      )}
    </div>
  );
}
