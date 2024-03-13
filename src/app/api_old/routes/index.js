const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/search", async (req, res) => {
  try {
    const bounds = JSON.parse(req.query.bounds); // Parse the viewport bounds from the request query
    const lat = req.query.lat;
    const lon = req.query.lon;

    // Query the database to retrieve restaurants within the specified bounds
    const query = `
            SELECT id, name, address, address_url, latitude, longitude, ROUND((ST_DistanceSphere(ST_MakePoint(${lon}, ${lat}), location) * 0.000621371192)::NUMERIC, 1) AS distance
            FROM restaurants 
            WHERE ST_Within(location, ST_MakeEnvelope(${bounds._sw.lng}, ${bounds._sw.lat}, ${bounds._ne.lng}, ${bounds._ne.lat}, 4326))
            ORDER BY distance
        `;

    const result = await db.query(query);
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

    res.json(geoJsonData); // Send the GeoJSON data to the client
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Search bar
router.get("/search/searchbar", async (req, res) => {
  try {
    const query = req.query.q;
    const lat = req.query.lat;
    const lon = req.query.lon;

    const result = await db.query(
      `SELECT id, name, address, address_url, latitude, longitude, ROUND((ST_DistanceSphere(ST_MakePoint(${lon}, ${lat}), location) * 0.000621371192)::NUMERIC, 1) AS distance
       FROM restaurants 
       WHERE name ILIKE '%${query}%' 
       LIMIT 10
      `
    );
    // res.send(result);

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

    res.json(geoJsonData); // Send the GeoJSON data to the client
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

/* GET cuisines list */
router.get("/cuisines", async (req, res, next) => {
  const result = await db.query("SELECT * FROM cuisines");

  if (!result.rows[0]) {
    return res.status(404).json({ error: "No cuisines found" });
  }

  const cuisines = result.rows;
  res.json(cuisines);
});

/* GET specific cuisine */
router.get("/cuisines/:id", async (req, res, next) => {
  const cuisineId = req.params.id;

  const [cuisineNameResult, restaurantResult] = await Promise.all([
    db.query(
      `SELECT name AS cuisine_name FROM cuisines WHERE id = ${cuisineId}`
    ),
    db.query(
      `
        SELECT
          r.id AS restaurant_id,
          r.name AS restaurant_name,
          r.address AS restaurant_address
        FROM
          restaurants r
        INNER JOIN
          restaurant_cuisines rc ON r.id = rc.restaurant_id
        WHERE
          rc.cuisine_id = ${cuisineId}
      `
    ),
  ]);

  if (!cuisineNameResult.rows[0]) {
    return res.status(404).json({ error: "Cuisine not found" });
  }

  const cuisineName = cuisineNameResult.rows[0]?.cuisine_name;
  const restaurants = restaurantResult.rows;

  const cuisine = {
    cuisine_name: cuisineName,
    restaurants: restaurants,
  };

  res.json(cuisine);
});

/* POST new cuisine */
router.post("/cuisines/create", async (req, res, next) => {
  const result = await db.query(`
    INSERT INTO cuisines (name)
    VALUES ('${req.body.name}')
    RETURNING id;
  `);
  const newCuisineId = result.rows[0].id;
  res.json({ id: newCuisineId });
});

/* GET restaurants list */
router.get("/restaurants", async (req, res, next) => {
  const query = `
      SELECT
        r.id AS restaurant_id,
        r.name AS restaurant_name,
        r.address AS restaurant_address,
        STRING_AGG(c.id || ':' || c.name, ', ') AS cuisines
      FROM
        restaurants r
      LEFT JOIN
        restaurant_cuisines rc ON r.id = rc.restaurant_id
      LEFT JOIN
        cuisines c ON rc.cuisine_id = c.id
      GROUP BY
        r.id, r.name, r.address
    `;

  const result = await db.query(query);

  if (!result.rows[0]) {
    return res.status(404).json({ error: "No restaurants found" });
  }

  const restaurants = result.rows.map((row) => {
    let cuisinesArray = [];

    if (row.cuisines) {
      // Split the concatenated string of cuisines into an array of objects
      cuisinesArray = row.cuisines.split(", ").map((cuisine) => {
        const [id, name] = cuisine.split(":");
        return { id: parseInt(id), name: name };
      });
    }

    // Return the restaurant object with cuisines as an array of objects
    return {
      restaurant_id: row.restaurant_id,
      restaurant_name: row.restaurant_name,
      restaurant_address: row.restaurant_address,
      cuisines: cuisinesArray,
    };
  });

  res.json(restaurants);
});

/* GET specific restaurant */
router.get("/restaurants/:id", async (req, res, next) => {
  const restaurantId = req.params.id;

  const query = `
      SELECT
        r.*,
        STRING_AGG(c.id || ':' || c.name, ', ') AS cuisines
      FROM
        restaurants r
      LEFT JOIN
        restaurant_cuisines rc ON r.id = rc.restaurant_id
      LEFT JOIN
        cuisines c ON rc.cuisine_id = c.id
      WHERE
        r.id = ${restaurantId}
      GROUP BY
        r.id
    `;

  const result = await db.query(query);
  const restaurant = result.rows[0];

  if (!restaurant) {
    return res.status(404).json({ error: "Restaurant not found" });
  }

  let cuisinesArray = [];

  if (restaurant.cuisines) {
    // Split the concatenated string of cuisines into an array of objects
    cuisinesArray = restaurant.cuisines.split(", ").map((cuisine) => {
      const [id, name] = cuisine.split(":");
      return { id: parseInt(id), name: name };
    });
  }

  // Assign the array of cuisines to the restaurant object
  restaurant.cuisines = cuisinesArray;

  res.json(restaurant);
});

/* POST new restaurant */
router.post("/restaurants/create", async (req, res, next) => {
  const result = await db.query(`
    INSERT INTO restaurants (name, restaurant_tag)
    VALUES ('${req.body.name}', '${req.body.restaurant_tag}')
    RETURNING id;
  `);
  const newRestaurantId = result.rows[0].id;
  res.json({ id: newRestaurantId });
});

module.exports = router;
