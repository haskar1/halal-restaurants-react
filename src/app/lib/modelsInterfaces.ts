export interface Restaurant {
  id: string;
  name: string;
  summary?: string;
  locations: Location[];
  cuisines: Cuisine[];
  restaurantInstances: RestaurantInstance[];
}

export interface RestaurantInstance {
  id: string;
  address: string;
  rating?: number;
  price: string;
  restaurantId: string;
  restaurant: Restaurant;
  locationId: string;
  location: Location;
}

export interface Location {
  id: string;
  city: string;
  state?: string;
  country: string;
  restaurants: Restaurant[];
  restaurantInstances: RestaurantInstance[];
}

export interface Cuisine {
  id: string;
  name: string;
  restaurants: Restaurant[];
}
