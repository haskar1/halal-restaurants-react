import { sql } from "@vercel/postgres";

export default async function handler(request, response) {
  const latitude = request.query.latitude;
  const longitude = request.query.longitude;
  const limit = request.query.limit;

  try {
    let result;

    if (latitude && longitude) {
      // Select all restaurants within 30 mile radius of user and sort results by highest rating to lowest rating. Return 8 highest rated results.
      // If there are less than 8 restaurants in 30 mile radius, then keep searching nearest restaurants within max radius of 75 miles until you reach total 8 results.
      // In that case, the results within 30 mile radius are sorted by rating, and the remaining nearest restaurants are sorted by distance.
      result = await sql`
        WITH within_radius AS (
          SELECT
            r.id AS restaurant_id,
            r.name AS restaurant_name,
            r.latitude AS latitude,
            r.longitude AS longitude,
            r.slug AS slug,
            r.address AS restaurant_address,
            r.address_url AS restaurant_address_url,
            r.cover_photo_url AS restaurant_cover_photo_url,
            r.rating AS restaurant_rating,
            r.halal_description AS restaurant_halal_description,
            r.restaurant_summary AS restaurant_summary,
            r.price AS restaurant_price,
            r.halal_status AS restaurant_halal_status,
            r.alcohol_served AS restaurant_alcohol_served,
            r.pork_served AS restaurant_pork_served,
            r.slaughter_method AS restaurant_slaughter_method,
            ROUND((ST_DistanceSphere(ST_MakePoint(${longitude}, ${latitude}), r.location) * 0.000621371192)::NUMERIC, 1) AS distance,
            STRING_AGG(c.id || ':' || c.name || ':' || c.tag_color, ', ') AS cuisines
          FROM
            restaurants r
          LEFT JOIN
            restaurant_cuisines rc ON r.id = rc.restaurant_id
          LEFT JOIN
            cuisines c ON rc.cuisine_id = c.id
          WHERE
            -- Only restaurants within 30 mile radius
            ROUND((ST_DistanceSphere(ST_MakePoint(${longitude}, ${latitude}), r.location) * 0.000621371192)::NUMERIC, 1) <= 30
          GROUP BY
            r.id, r.name, r.address, r.cover_photo_url, r.rating
          ORDER BY
            NULLIF(r.rating, 'NaN') DESC
          NULLS LAST
          LIMIT ${limit}
        ),
        nearest_restaurants AS (
          SELECT
            r.id AS restaurant_id,
            r.name AS restaurant_name,
            r.latitude AS latitude,
            r.longitude AS longitude,
            r.slug AS slug,
            r.address AS restaurant_address,
            r.address_url AS restaurant_address_url,
            r.cover_photo_url AS restaurant_cover_photo_url,
            r.rating AS restaurant_rating,
            r.halal_description AS restaurant_halal_description,
            r.restaurant_summary AS restaurant_summary,
            r.price AS restaurant_price,
            r.halal_status AS restaurant_halal_status,
            r.alcohol_served AS restaurant_alcohol_served,
            r.pork_served AS restaurant_pork_served,
            r.slaughter_method AS restaurant_slaughter_method,
            ROUND((ST_DistanceSphere(ST_MakePoint(${longitude}, ${latitude}), r.location) * 0.000621371192)::NUMERIC, 1) AS distance,
            STRING_AGG(c.id || ':' || c.name || ':' || c.tag_color, ', ') AS cuisines
          FROM
            restaurants r
          LEFT JOIN
            restaurant_cuisines rc ON r.id = rc.restaurant_id
          LEFT JOIN
            cuisines c ON rc.cuisine_id = c.id
          WHERE
            NOT EXISTS (
              SELECT 1
              FROM within_radius wr
              WHERE wr.restaurant_id = r.id
            )
          GROUP BY
            r.id, r.name, r.address, r.cover_photo_url, r.rating
          HAVING
            -- Only restaurants within max 75 mile radius
            ROUND((ST_DistanceSphere(ST_MakePoint(${longitude}, ${latitude}), r.location) * 0.000621371192)::NUMERIC, 1) <= 75
          ORDER BY
            distance
          -- LIMIT 3
        ),
        combined_results AS (
          SELECT *, 'within_radius' AS source
          FROM within_radius
          UNION
          SELECT *, 'nearest_restaurants' AS source
          FROM nearest_restaurants
          WHERE (SELECT COUNT(*) FROM within_radius) < 1
        )
        SELECT *
        FROM combined_results
        ORDER BY
          source DESC, -- Ensure within_radius results come first
          CASE WHEN source = 'within_radius' THEN NULLIF(restaurant_rating, 'NaN') END DESC,
          CASE WHEN source = 'nearest_restaurants' THEN distance END ASC
        NULLS LAST
        LIMIT ${limit};
      `;
    } else {
      result = await sql`
        SELECT
          r.id AS restaurant_id,
          r.name AS restaurant_name,
          r.latitude AS latitude,
          r.longitude AS longitude,
          r.slug AS slug,
          r.address AS restaurant_address,
          r.address_url AS restaurant_address_url,
          r.cover_photo_url AS restaurant_cover_photo_url,
          r.rating AS restaurant_rating,
          r.halal_description AS restaurant_halal_description,
          r.restaurant_summary AS restaurant_summary,
          r.price AS restaurant_price,
          r.halal_status AS restaurant_halal_status,
          r.alcohol_served AS restaurant_alcohol_served,
          r.pork_served AS restaurant_pork_served,
          r.slaughter_method AS restaurant_slaughter_method,
          STRING_AGG(c.id || ':' || c.name || ':' || c.tag_color, ', ') AS cuisines
        FROM
          restaurants r
        LEFT JOIN
          restaurant_cuisines rc ON r.id = rc.restaurant_id
        LEFT JOIN
          cuisines c ON rc.cuisine_id = c.id
        GROUP BY
          r.id, r.name, r.address
        ORDER BY
          NULLIF(r.rating, 'NaN') DESC
        NULLS LAST
        LIMIT ${limit};
      `;
    }

    // if (!result.rows[0]) {
    //   throw new Error("No restaurants found");
    // }

    const restaurants = result.rows.map((row) => {
      let cuisinesArray = [];

      if (row.cuisines) {
        // Split the concatenated string of cuisines into an array of objects
        cuisinesArray = row.cuisines.split(", ").map((cuisine) => {
          const [id, name, tag_color] = cuisine.split(":");
          return { id: id, name: name, tag_color: tag_color };
        });
      }

      // Return the restaurant object with cuisines as an array of objects. Old way?
      return {
        restaurant_id: row.restaurant_id,
        slug: row.slug,
        restaurant_name: row.restaurant_name,
        restaurant_address: row.restaurant_address,
        restaurant_cover_photo_url: row.restaurant_cover_photo_url,
        restaurant_rating: row.restaurant_rating,
        cuisines: cuisinesArray,
      };
    });

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
            address: row.restaurant_address,
            address_url: row.restaurant_address_url,
            latitude: row.latitude,
            longitude: row.longitude,
            cover_photo_url: row.restaurant_cover_photo_url,
            rating: row.restaurant_rating,
            distance: row.distance,
            nearestToMapCenter: row.nearestToMapCenter,
            cuisines: cuisinesArray,
            halal_description: row.restaurant_halal_description,
            summary: row.restaurant_summary,
            price: row.restaurant_price,
            halal_status: row.restaurant_halal_status,
            alcohol_served: row.restaurant_alcohol_served,
            pork_served: row.restaurant_pork_served,
            slaughter_method: row.restaurant_slaughter_method,
          },
        };
      }),
    };

    return response.status(200).json({ restaurants, geoJsonData });
  } catch (error) {
    console.error(
      "Error fetching restaurants:",
      error.response?.data?.message || error.message
    );
    return response.status(500).json({ error });
  }
}
