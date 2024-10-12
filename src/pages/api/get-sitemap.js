import { sql } from "@vercel/postgres";

export default async function handler(request, response) {
  try {
    const [res1, res2] = await Promise.all([
      sql`
        SELECT city, COUNT(*) FROM restaurants GROUP BY city ORDER BY city;   
      `,
      sql`
        SELECT slug, updated_at, hide_restaurant FROM restaurants WHERE hide_restaurant = false;
      `,
    ]);

    if (!res1.rows[0]) {
      throw new Error("No locations found");
    }

    if (!res2.rows[0]) {
      throw new Error("No restaurants found");
    }

    const countPerLocation = res1.rows.map((row) => {
      return {
        location: row.city,
        count: row.count,
      };
    });

    const allRestaurantsSitemap = res2.rows.map((row) => {
      return {
        url: `https://www.whoishalal.com/restaurants/${row.slug}`,
        lastModified: row.updated_at,
        changeFrequency: "monthly",
        priority: 0.9,
      };
    });

    return response.status(200).json({
      restaurantCount: allRestaurantsSitemap.length,
      totalNumberOfLocations: countPerLocation.length,
      countPerLocation,
      allRestaurantsSitemap,
    });
  } catch (error) {
    console.error(
      "Error fetching restaurants or locations:",
      error.response?.data?.message || error.message
    );
    return response.status(500).json({ error });
  }
}
