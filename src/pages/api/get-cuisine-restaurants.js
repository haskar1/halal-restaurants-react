import { sql } from "@vercel/postgres";

export default async function handler(request, response) {
  const id = request.query.id;
  const pageNumber = request.query.pageNumber;
  const itemsPerPage = 10; // Adjust this as needed
  const offset = (pageNumber - 1) * itemsPerPage;

  try {
    const result = await sql`
        SELECT
          r.id AS restaurant_id,
          r.name AS restaurant_name,
          r.restaurant_tag AS restaurant_tag,
          r.address AS restaurant_address
        FROM
          restaurants r
        INNER JOIN
          restaurant_cuisines rc ON r.id = rc.restaurant_id
        WHERE
          rc.cuisine_id = ${id}
        ORDER BY
          r.name
        LIMIT ${itemsPerPage} OFFSET ${offset};
      `;

    if (!result.rows[0]) {
      throw new Error("No restaurants found");
    }

    const cuisine_restaurants = result.rows;

    return response.status(200).json({ cuisine_restaurants });
  } catch (error) {
    console.error(
      "Error fetching cuisine's restaurants:",
      error.response?.data?.message || error.message
    );
    return response.status(500).json({ error });
  }
}
