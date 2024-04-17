import { sql } from "@vercel/postgres";

export default async function getCuisines() {
  try {
    const result = await sql`SELECT * FROM cuisines ORDER BY name;`;

    if (!result.rows[0]) {
      throw new Error("No cuisines found");
    }
    const cuisines = result.rows;
    return cuisines;
  } catch (error) {
    console.error(
      "Error fetching cuisines:",
      error.response?.data?.message || error.message
    );
    return;
  }
}
