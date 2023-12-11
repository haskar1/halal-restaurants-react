export interface RestaurantInterface {
  id: string;
  name: string;
  summary?: string;
  locations: LocationInterface[];
  cuisines: CuisineInterface[];
  restaurantInstances: RestaurantInstanceInterface[];
}

export interface RestaurantInstanceInterface {
  id: string;
  address: string;
  rating?: number;
  price: string;
  restaurantId: string;
  restaurant: RestaurantInterface;
  locationId: string;
  location: LocationInterface;
}

export interface LocationInterface {
  id: string;
  city: string;
  state?: string;
  country: string;
  restaurants: RestaurantInterface[];
  restaurantInstances: RestaurantInstanceInterface[];
}

export interface CuisineInterface {
  id: string;
  name: string;
  restaurants: RestaurantInterface[];
}
