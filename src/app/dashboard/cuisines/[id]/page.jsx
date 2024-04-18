"use client";

import DeleteButton from "@/components/DeleteButton";
import UpdateButton from "@/components/UpdateButton";
import deleteCuisine from "@/utils/delete-cuisine";
import { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import "@/stylesheets/restaurants-list-async.css";
import Link from "next/link";

export const dynamicParams = true;
export const fetchCache = "force-no-store";

export default function CuisineList({ params }) {
  const id = params.id;
  const [cuisine, setCuisine] = useState(null);
  const [cuisineRestaurants, setCuisineRestaurants] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadingMsg, setLoadingMsg] = useState("Loading...");

  useEffect(() => {
    fetch(`/api/get-cuisine?id=${id}`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.error) {
          setLoadingMsg("Cuisine not found");
          return;
        }
        setCuisine(json.cuisine);
      })
      .catch((error) => {
        console.error("Error fetching cuisine: ", error);
      });
  }, []);

  useEffect(() => {
    setIsLoadingMore(true);
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
    fetchCuisineRestaurants();
  }, []);

  function fetchCuisineRestaurants() {
    fetch(`/api/get-cuisine-restaurants?id=${id}&pageNumber=${pageNumber}`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (!json.cuisine_restaurants) {
          setHasMoreItems(false);
          return;
        }
        setCuisineRestaurants((prevCuisineRestaurants) => {
          if (!prevCuisineRestaurants) {
            return [...json.cuisine_restaurants];
          } else {
            return [...prevCuisineRestaurants, ...json.cuisine_restaurants];
          }
        });
        setIsLoadingMore(false);
      })
      .catch((error) => {
        console.error("Error fetching cuisine's restaurants: ", error);
      });
  }

  function isItemLoaded(index) {
    return !!cuisineRestaurants[index];
  }

  function loadMoreItems(startIndex, stopIndex) {
    if (!isLoadingMore && hasMoreItems) {
      setIsLoadingMore(true);
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
      fetchCuisineRestaurants();
    }
  }

  return (
    <>
      {cuisine ? (
        <div className="cuisine-restaurants-container">
          <h1 className="text-3xl pb-8">{cuisine.name} Restaurants</h1>
          {cuisineRestaurants ? (
            <div className="h-full">
              <AutoSizer>
                {({ height, width }) => (
                  <InfiniteLoader
                    isItemLoaded={isItemLoaded}
                    itemCount={
                      cuisineRestaurants.length + (hasMoreItems ? 1 : 0)
                    }
                    loadMoreItems={loadMoreItems}
                  >
                    {({ onItemsRendered, ref }) => (
                      <List
                        onItemsRendered={onItemsRendered}
                        ref={ref}
                        itemCount={
                          cuisineRestaurants.length + (hasMoreItems ? 1 : 0)
                        }
                        itemSize={80}
                        height={height}
                        width={width}
                      >
                        {({ index, style }) => {
                          if (!isItemLoaded(index)) {
                            return <div style={style}>Loading...</div>;
                          }

                          const restaurant = cuisineRestaurants[index];

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
            <p>There are no restaurants with this cuisine yet.</p>
          )}

          <div className="flex flex-wrap gap-[1rem] pt-8 absolute top-[80vh]">
            <UpdateButton
              href={`/dashboard/cuisines/${id}/update`}
              text="Update Cuisine"
            />

            <DeleteButton
              onClick={deleteCuisine}
              args={cuisine.id}
              category="Cuisine"
              cuisineRestaurants={cuisineRestaurants}
            />
          </div>
        </div>
      ) : (
        <p>{loadingMsg}</p>
      )}
    </>
  );
}
