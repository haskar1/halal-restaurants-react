export default function SearchResultsList({
  isActive,
  showDistance,
  searchResults,
}) {
  return (
    <>
      <div className="search-list">
        {searchResults?.features && searchResults.features.length > 0 ? (
          <div className="listings">
            {searchResults.features.map((restaurant) => (
              <div
                key={restaurant.properties.id}
                className={
                  isActive === restaurant.properties.id ? "item active" : "item"
                }
              >
                <a
                  href={`/dashboard/restaurants/${restaurant.properties.id}`}
                  target="_blank"
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
