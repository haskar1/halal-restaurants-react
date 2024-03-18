export default function SearchResultsList({
  map,
  isActive,
  showPopup,
  showDistance,
  searchResults,
}) {
  function flyToStore(currentFeature) {
    map.current.easeTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15,
    });
  }

  return (
    <>
      <div className="search-list">
        {searchResults.features && searchResults.features.length > 0 ? (
          <>
            <div>
              <span>
                <b>
                  {searchResults.features.length}{" "}
                  {searchResults.features.length === 1 ? "result" : "results"}
                </b>
              </span>
            </div>
            <div className="listings">
              {searchResults.features.map((restaurant) => (
                <div
                  key={restaurant.properties.id}
                  className={
                    isActive === restaurant.properties.id
                      ? "item active"
                      : "item"
                  }
                >
                  <a
                    href="#"
                    onClick={() => {
                      searchResults.features.map((restaurantOnMap) => {
                        if (
                          restaurantOnMap.properties.id ===
                          restaurant.properties.id
                        ) {
                          flyToStore(restaurant);
                          showPopup(restaurant.properties);
                        }
                      });
                    }}
                  >
                    <img
                      src={restaurant.properties.cover_photo_url}
                      className="item__cover-photo"
                      width="100%"
                      height="auto"
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
                  </a>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
            <span className="text-black">
              No restaurants found in this area
            </span>
          </div>
        )}
      </div>
    </>
  );
}
