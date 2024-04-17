import { sql } from "@vercel/postgres";

export default async function handler(request, response) {
  const query = JSON.parse(request.query.q);
  const userLat = request.query.userLat;
  const userLon = request.query.userLon;
  const mapCenterLat = request.query.mapCenterLat;
  const mapCenterLon = request.query.mapCenterLon;

  try {
    const result = await sql`
      SELECT id, name, slug, address, address_url, latitude, longitude, cover_photo_url
        ,ROUND((ST_DistanceSphere(ST_MakePoint(${userLon}, ${userLat}), location) * 0.000621371192)::NUMERIC, 1) AS distance
      FROM restaurants
      WHERE name ILIKE '%' || ${query} || '%'
      ORDER BY ROUND(ST_DistanceSphere(ST_MakePoint(${mapCenterLon}, ${mapCenterLat}), location))
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
          slug: row.slug,
          address: row.address,
          address_url: row.address_url,
          latitude: row.latitude,
          longitude: row.longitude,
          cover_photo_url: row.cover_photo_url,
          distance: row.distance,
        },
      })),
    };

    return response.status(200).json({ geoJsonData });
  } catch (error) {
    return response.status(500).json({ error });
  }
}
