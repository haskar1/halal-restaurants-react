import { sql } from "@vercel/postgres";

export default async function handler(request, response) {
  const id = request.query.id;

  try {
    const result = await sql`SELECT * FROM cuisines WHERE id = ${id};`;

    console.log("result: ", result);
    if (!result.rows[0]) {
      throw new Error("Cuisine not found");
    }
    const cuisine = result.rows[0];

    return response.status(200).json({ cuisine });
  } catch (error) {
    console.error(
      "Error fetching cuisine:",
      error.response?.data?.message || error.message
    );
    return response.status(500).json({ error });
  }
}
