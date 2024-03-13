import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(cuisineId) {
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
      return NextResponse.json({ error: "Cuisine not found" }, { status: 500 });
    }

    const cuisineName = cuisineNameResult.rows[0]?.cuisine_name;
    const restaurants = restaurantResult.rows;

    const cuisine = {
      cuisine_name: cuisineName,
      restaurants: restaurants,
    };

    return NextResponse.json({ cuisine }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
