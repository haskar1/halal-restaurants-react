import { sql } from "@vercel/postgres";

export default async function handler(request, response) {
  const bounds = JSON.parse(request.query.bounds); // Parse the viewport bounds from the request query
  const userLat = request.query.userLat;
  const userLon = request.query.userLon;
  const mapCenterLat = request.query.mapCenterLat;
  const mapCenterLon = request.query.mapCenterLon;

  try {
    const result = await sql`
            SELECT id, name, address, address_url, latitude, longitude, cover_photo_url
              ,ROUND((ST_DistanceSphere(ST_MakePoint(${userLon}, ${userLat}), location) * 0.000621371192)::NUMERIC, 1) AS distance
              ,ROUND((ST_DistanceSphere(ST_MakePoint(${mapCenterLon}, ${mapCenterLat}), location) * 0.000621371192)::NUMERIC, 1) AS nearestToMapCenter
            FROM restaurants
            WHERE ST_Within(location, ST_MakeEnvelope(${bounds._sw.lng}, ${bounds._sw.lat}, ${bounds._ne.lng}, ${bounds._ne.lat}, 4326))
            ORDER BY nearestToMapCenter
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
          cover_photo_url: row.cover_photo_url,
          distance: row.distance,
          nearestToMapCenter: row.nearestToMapCenter,
        },
      })),
    };

    return response.status(200).json({ geoJsonData });
  } catch (error) {
    return response.status(500).json({ error });
  }
}
