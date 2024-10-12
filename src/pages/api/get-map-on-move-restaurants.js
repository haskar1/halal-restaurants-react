import { sql } from "@vercel/postgres";

export default async function handler(request, response) {
  const limit = request.query.limit;
  const latitude = request.query.latitude;
  const longitude = request.query.longitude;
  const bbox = JSON.parse(request.query.bbox);

  let boundsSWLongitude, boundsSWLatitude, boundsNELongitude, boundsNELatitude;

  if (bbox.length > 0) {
    boundsSWLongitude = bbox[0];
    boundsSWLatitude = bbox[1];
    boundsNELongitude = bbox[2];
    boundsNELatitude = bbox[3];
  }

  try {
    const result = await sql`
      SELECT
        r.id AS restaurant_id,
        r.name AS restaurant_name,
        r.latitude AS latitude,
        r.longitude AS longitude,
        r.slug AS slug,
        r.address AS address,
        r.address_url AS address_url,
        r.cover_photo_url AS cover_photo_url,
        r.rating AS rating,
        r.halal_description AS halal_description,
        r.restaurant_summary AS restaurant_summary,
        r.price AS price,
        r.halal_status AS halal_status,
        r.alcohol_served AS alcohol_served,
        r.pork_served AS pork_served,
        r.slaughter_method AS slaughter_method,
        r.hide_restaurant AS hide_restaurant,
        ROUND((ST_DistanceSphere(ST_MakePoint(${longitude}, ${latitude}), r.location) * 0.000621371192)::NUMERIC, 1) AS distance,
        STRING_AGG(c.id || ':' || c.name || ':' || c.tag_color, ', ') AS cuisines
      FROM
        restaurants r
      LEFT JOIN
        restaurant_cuisines rc ON r.id = rc.restaurant_id
      LEFT JOIN
        cuisines c ON rc.cuisine_id = c.id
      WHERE
        ST_Within(r.location, ST_MakeEnvelope(${boundsSWLongitude}, ${boundsSWLatitude}, ${boundsNELongitude}, ${boundsNELatitude}, 4326))
        AND hide_restaurant = false
      GROUP BY
        r.id, r.name, r.address, r.cover_photo_url, r.rating
      ORDER BY
        NULLIF(r.rating, 'NaN') DESC
      NULLS LAST
      LIMIT ${limit}
    `;

    // Convert data to GeoJSON format for Map (search page). New way.
    const geoJsonData = {
      type: "FeatureCollection",
      features: result.rows.map((row) => {
        let cuisinesArray = [];

        if (row.cuisines) {
          // Split the concatenated string of cuisines into an array of objects
          cuisinesArray = row.cuisines.split(", ").map((cuisine) => {
            const [id, name, tag_color] = cuisine.split(":");
            return { id: id, name: name, tag_color: tag_color };
          });
        }

        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)],
          },
          properties: {
            id: row.restaurant_id,
            name: row.restaurant_name,
            slug: row.slug,
            address: row.address,
            address_url: row.address_url,
            latitude: row.latitude,
            longitude: row.longitude,
            cover_photo_url: row.cover_photo_url,
            rating: row.rating,
            distance: row.distance,
            nearestToMapCenter: row.nearestToMapCenter,
            cuisines: cuisinesArray,
            halal_description: row.halal_description,
            summary: row.restaurant_summary,
            price: row.price,
            halal_status: row.halal_status,
            alcohol_served: row.alcohol_served,
            pork_served: row.pork_served,
            slaughter_method: row.slaughter_method,
          },
        };
      }),
    };

    return response.status(200).json({ geoJsonData });
  } catch (error) {
    console.error(
      "Error fetching restaurants:",
      error.response?.data?.message || error.message
    );
    return response.status(500).json({ error });
  }
}
