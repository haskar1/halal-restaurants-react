import { sql } from "@vercel/postgres";

export async function handler(request, response) {
  try {
    const [cuisineNameResult, restaurantResult] = await Promise.all([
      sql`SELECT name AS cuisine_name FROM cuisines WHERE id = ${cuisineId}`,
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
          rc.cuisine_id = ${cuisineId}
      `,
    ]);

    if (!cuisineNameResult.rows[0]) {
      return response.status(500).json({ error: "Cuisine not found" });
    }

    const cuisineName = cuisineNameResult.rows[0]?.cuisine_name;
    const restaurants = restaurantResult.rows;

    const cuisine = {
      cuisine_name: cuisineName,
      restaurants: restaurants,
    };
    return response.status(200).json({ cuisine });
  } catch (error) {
    return response.status(500).json({ error });
  }
}
