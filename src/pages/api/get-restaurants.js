import { sql } from "@vercel/postgres";

export default async function handler(request, response) {
  const pageNumber = request.query.pageNumber;
  const itemsPerPage = 10; // Adjust this as needed
  const offset = (pageNumber - 1) * itemsPerPage;

  try {
    const result = await sql`
      SELECT
        r.id AS restaurant_id,
        r.name AS restaurant_name,
        r.slug AS slug,
        r.address AS restaurant_address,
        STRING_AGG(c.id || ':' || c.name, ', ') AS cuisines
      FROM
        restaurants r
      LEFT JOIN
        restaurant_cuisines rc ON r.id = rc.restaurant_id
      LEFT JOIN
        cuisines c ON rc.cuisine_id = c.id
      GROUP BY
        r.id, r.name, r.address
      ORDER BY
        r.name
      LIMIT ${itemsPerPage} OFFSET ${offset};
    `;

    if (!result.rows[0]) {
      throw new Error("No restaurants found");
    }

    const restaurants = result.rows.map((row) => {
      let cuisinesArray = [];

      if (row.cuisines) {
        // Split the concatenated string of cuisines into an array of objects
        cuisinesArray = row.cuisines.split(", ").map((cuisine) => {
          const [id, name] = cuisine.split(":");
          return { id: parseInt(id), name: name };
        });
      }

      // Return the restaurant object with cuisines as an array of objects
      return {
        restaurant_id: row.restaurant_id,
        slug: row.slug,
        restaurant_name: row.restaurant_name,
        restaurant_address: row.restaurant_address,
        cuisines: cuisinesArray,
      };
    });

    return response.status(200).json({ restaurants });
  } catch (error) {
    console.error(
      "Error fetching restaurants:",
      error.response?.data?.message || error.message
    );
    return response.status(500).json({ error });
  }
}
