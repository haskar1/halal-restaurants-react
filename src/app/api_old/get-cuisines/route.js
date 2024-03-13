import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const result = await sql`SELECT * FROM cuisines`;

    if (!result.rows[0]) {
      return NextResponse.json({ error: "No cuisines found" }, { status: 500 });
    }

    const cuisines = result.rows;
    return NextResponse.json({ cuisines }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
