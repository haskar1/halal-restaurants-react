import { sql } from "@vercel/postgres";

export async function POST(request) {
  try {
    const cuisine = await sql`
    INSERT INTO cuisines (name)
    VALUES ('${request.name}')
    RETURNING id;
  `;
    const newCuisineId = cuisine.rows[0].id;

    return NextResponse.json({ id: newCuisineId }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create cuisine" },
      { status: 500 }
    );
  }
}
