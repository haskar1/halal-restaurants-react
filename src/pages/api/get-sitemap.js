import { sql } from "@vercel/postgres";

export default async function handler(request, response) {
  try {
    const result = await sql`
      SELECT slug, updated_at FROM restaurants
    `;

    if (!result.rows[0]) {
      throw new Error("No restaurants found");
    }

    const allRestaurantsSitemap = result.rows.map((row) => {
      return {
        url: `https://www.whoishalal.com/restaurants/${row.slug}`,
        lastModified: row.updated_at,
        changeFrequency: "monthly",
        priority: 0.9,
      };
    });

    return response.status(200).json({
      restaurantCount: allRestaurantsSitemap.length,
      allRestaurantsSitemap,
    });
  } catch (error) {
    console.error(
      "Error fetching restaurants:",
      error.response?.data?.message || error.message
    );
    return response.status(500).json({ error });
  }
}
