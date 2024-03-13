// import axios from "axios";
import { sql } from "@vercel/postgres";

export default async function getCuisines() {
  try {
    const result = await sql`SELECT * FROM cuisines;`;

    if (!result.rows[0]) {
      throw new Error("No cuisines found");
    }
    const cuisines = result.rows;

    return cuisines;

    // const response = await axios.get(`http://localhost:9000/${path}`);
    // return response.data;
  } catch (error) {
    console.error(
      "Error fetching cuisines:",
      error.response?.data?.message || error.message
    );
    return;
  }
}
