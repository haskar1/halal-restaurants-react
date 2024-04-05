import { sql } from "@vercel/postgres";

export default async function handler(request, response) {
  try {
    const result = await sql`SELECT * FROM cuisines ORDER BY name;`;

    if (!result.rows[0]) {
      throw new Error("No cuisines found");
    }
    const cuisines = result.rows;
    return response.status(200).json({ cuisines });
  } catch (error) {
    return response.status(500).json({ error });
  }
}
