import { sql } from "@vercel/postgres";

export default async function handler(request, response) {
  const query = JSON.parse(request.query.q);
  const lat = request.query.lat;
  const lon = request.query.lon;

  try {
    const result = await sql`
      SELECT id, name, address, address_url, latitude, longitude, ROUND((ST_DistanceSphere(ST_MakePoint(${lon}, ${lat}), location) * 0.000621371192)::NUMERIC, 1) AS distance
      FROM restaurants
      WHERE name ILIKE '%' || ${query} || '%'
      LIMIT 10
    `;

    const rows = result.rows;

    // Convert data to GeoJSON format
    const geoJsonData = {
      type: "FeatureCollection",
      features: rows.map((row) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)],
        },
        properties: {
          id: row.id,
          name: row.name,
          address: row.address,
          address_url: row.address_url,
          latitude: row.latitude,
          longitude: row.longitude,
          distance: row.distance,
        },
      })),
    };

    return response.status(200).json({ geoJsonData });
  } catch (error) {
    return response.status(500).json({ error });
  }
}
