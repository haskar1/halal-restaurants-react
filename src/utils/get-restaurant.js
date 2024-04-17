import { sql } from "@vercel/postgres";

export default async function getRestaurant(slug) {
  try {
    const result = await sql`
      SELECT
        r.*,
        STRING_AGG(c.id || ':' || c.name, ', ') AS cuisines
      FROM
        restaurants r
      LEFT JOIN
        restaurant_cuisines rc ON r.id = rc.restaurant_id
      LEFT JOIN
        cuisines c ON rc.cuisine_id = c.id
      WHERE
        r.slug = ${decodeURIComponent(slug)}
      GROUP BY
        r.id
    `;

    const restaurant = result.rows[0];

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    let cuisinesArray = [];
    if (restaurant.cuisines) {
      // Split the concatenated string of cuisines into an array of objects
      cuisinesArray = restaurant.cuisines.split(", ").map((cuisine) => {
        const [id, name] = cuisine.split(":");
        return { id: id, name: name };
      });
    }
    restaurant.cuisines = cuisinesArray;

    if (restaurant.rating === "NaN") {
      restaurant.rating = null;
    }

    return restaurant;
  } catch (error) {
    console.error(
      "Error fetching restaurant:",
      error.response?.data?.message || error.message
    );
    return;
  }
}
