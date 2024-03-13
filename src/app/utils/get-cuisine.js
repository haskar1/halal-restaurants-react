// import axios from "axios";
import { sql } from "@vercel/postgres";

export default async function getCuisine(id) {
  try {
    const [cuisineNameResult, restaurantResult] = await Promise.all([
      sql`SELECT name AS cuisine_name FROM cuisines WHERE id = ${id}`,
      sql`
        SELECT
          r.id AS restaurant_id,
          r.name AS restaurant_name,
          r.address AS restaurant_address
        FROM
          restaurants r
        INNER JOIN
          restaurant_cuisines rc ON r.id = rc.restaurant_id
        WHERE
          rc.cuisine_id = ${id}
      `,
    ]);

    if (!cuisineNameResult.rows[0]) {
      throw new Error("Cuisine not found");
    }

    const cuisineName = cuisineNameResult.rows[0]?.cuisine_name;
    const restaurants = restaurantResult.rows;

    const cuisine = {
      cuisine_name: cuisineName,
      restaurants: restaurants,
    };

    return cuisine;
  } catch (error) {
    console.error(
      "Error fetching cuisine:",
      error.response?.data?.message || error.message
    );
    return;
  }
}
