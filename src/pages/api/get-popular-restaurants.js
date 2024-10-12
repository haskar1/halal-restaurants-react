import { sql } from "@vercel/postgres";

export default async function handler(request, response) {
  const userLatitude = request.query.userLatitude;
  const userLongitude = request.query.userLongitude;
  const limit = request.query.limit;

  try {
    let result;

    // if (userLatitude && userLongitude) {
    //   // Select all restaurants within 50 mile radius of user and sort results by highest rating to lowest rating. Return 8 highest rated results.
    //   // If there are less than 8 restaurants in 50 mile radius, then keep searching nearest restaurants beyond radius until you reach total 8 results.
    //   // In that case, the results within 50 mile radius are sorted by rating, and the remaining nearest restaurants are sorted by distance.
    //   result = await sql`
    //     WITH within_radius AS (
    //       SELECT
    //         r.id AS restaurant_id,
    //         r.name AS restaurant_name,
    //         r.slug AS slug,
    //         r.address AS address,
    //         r.cover_photo_url AS cover_photo_url,
    //         r.rating AS rating,
    //         ROUND((ST_DistanceSphere(ST_MakePoint(${userLongitude}, ${userLatitude}), r.location) * 0.000621371192)::NUMERIC, 1) AS distance,
    //         STRING_AGG(c.id || ':' || c.name || ':' || c.tag_color, ', ') AS cuisines
    //       FROM
    //         restaurants r
    //       LEFT JOIN
    //         restaurant_cuisines rc ON r.id = rc.restaurant_id
    //       LEFT JOIN
    //         cuisines c ON rc.cuisine_id = c.id
    //       WHERE
    //         -- Only restaurants within 50 mile radius
    //         ROUND((ST_DistanceSphere(ST_MakePoint(${userLongitude}, ${userLatitude}), r.location) * 0.000621371192)::NUMERIC, 1) <= 50
    //       GROUP BY
    //         r.id, r.id, r.address
    //       ORDER BY
    //         NULLIF(r.rating, 'NaN') DESC
    //       NULLS LAST
    //       LIMIT ${limit}
    //     ),
    //     nearest_restaurants AS (
    //       SELECT
    //         r.id AS restaurant_id,
    //         r.name AS restaurant_name,
    //         r.slug AS slug,
    //         r.address AS address,
    //         r.cover_photo_url AS cover_photo_url,
    //         r.rating AS rating,
    //         ROUND((ST_DistanceSphere(ST_MakePoint(${userLongitude}, ${userLatitude}), r.location) * 0.000621371192)::NUMERIC, 1) AS distance,
    //         STRING_AGG(c.id || ':' || c.name || ':' || c.tag_color, ', ') AS cuisines
    //       FROM
    //         restaurants r
    //       LEFT JOIN
    //         restaurant_cuisines rc ON r.id = rc.restaurant_id
    //       LEFT JOIN
    //         cuisines c ON rc.cuisine_id = c.id
    //       WHERE
    //         NOT EXISTS (
    //           SELECT 1
    //           FROM within_radius wr
    //           WHERE wr.restaurant_id = r.id
    //         )
    //       GROUP BY
    //         r.id, r.id, r.address
    //       ORDER BY
    //         distance
    //       LIMIT ${limit}
    //     ),
    //     combined_results AS (
    //       SELECT *, 'within_radius' AS source
    //       FROM within_radius
    //       UNION
    //       SELECT *, 'nearest_restaurants' AS source
    //       FROM nearest_restaurants
    //       WHERE (SELECT COUNT(*) FROM within_radius) < ${limit}
    //     )
    //     SELECT *
    //     FROM combined_results
    //     ORDER BY
    //       source DESC, -- Ensure within_radius results come first
    //       CASE WHEN source = 'within_radius' THEN NULLIF(rating, 'NaN') END DESC,
    //       CASE WHEN source = 'nearest_restaurants' THEN distance END ASC
    //     NULLS LAST
    //     LIMIT ${limit};
    //   `;
    // } else {
    result = await sql`
        SELECT
          r.id AS restaurant_id,
          r.name AS restaurant_name,
          r.slug AS slug,
          r.address AS address,
          r.cover_photo_url AS cover_photo_url,
          r.rating AS rating,
          r.hide_restaurant AS hide_restaurant,
          STRING_AGG(c.id || ':' || c.name || ':' || c.tag_color, ', ') AS cuisines
        FROM
          restaurants r
        LEFT JOIN
          restaurant_cuisines rc ON r.id = rc.restaurant_id
        LEFT JOIN
          cuisines c ON rc.cuisine_id = c.id
        WHERE hide_restaurant = false
        GROUP BY
          r.id, r.id, r.address
        ORDER BY
          NULLIF(r.rating, 'NaN') DESC
        NULLS LAST
        LIMIT ${limit};
      `;
    // }

    if (!result.rows[0]) {
      throw new Error("No restaurants found");
    }

    const restaurants = result.rows.map((row) => {
      let cuisinesArray = [];

      if (row.cuisines) {
        // Split the concatenated string of cuisines into an array of objects
        cuisinesArray = row.cuisines.split(", ").map((cuisine) => {
          const [id, name, tag_color] = cuisine.split(":");
          return { id: id, name: name, tag_color: tag_color };
        });
      }

      // Return the restaurant object with cuisines as an array of objects
      return {
        restaurant_id: row.restaurant_id,
        slug: row.slug,
        restaurant_name: row.restaurant_name,
        address: row.address,
        cover_photo_url: row.cover_photo_url,
        rating: row.rating,
        cuisines: cuisinesArray,
      };
    });

    return response.status(200).json({ restaurants });
  } catch (error) {
    console.error(
      "Error fetching restaurants:",
      error.response?.data?.message || error.message
    );
    return response.status(500).json({ error });
  }
}
