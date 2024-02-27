const express = require("express");
const router = express.Router();
const { PrismaClient } = require("../../../../node_modules/@prisma/client");
const prisma = new PrismaClient();
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

/* GET specific cuisine */
router.get("/cuisines/:id", async (req, res, next) => {
  const cuisine = await prisma.cuisine.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      restaurants: {
        include: {
          locations: {},
        },
      },
    },
  });
  res.json(cuisine);
});

/* GET cuisines list */
router.get("/cuisines", async (req, res, next) => {
  const cuisines = await prisma.cuisine.findMany();
  res.json(cuisines);
});

/* GET locations list */
router.get("/locations", async (req, res, next) => {
  const locations = await prisma.location.findMany();
  res.json(locations);
});

/* GET specific location */
router.get("/locations/:id", async (req, res, next) => {
  const location = await prisma.location.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      restaurantInstances: {
        include: {
          restaurant: {
            include: {
              cuisines: {},
            },
          },
        },
      },
    },
  });
  res.json(location);
});

/* GET restaurants list */
router.get("/restaurants", async (req, res, next) => {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      cuisines: {},
      locations: {},
    },
  });
  res.json(restaurants);
});

/* GET specific restaurant */
router.get("/restaurants/:id", async (req, res, next) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      cuisines: {},
      restaurantInstances: {
        include: {
          location: {},
        },
      },
    },
  });
  res.json(restaurant);
});

/* GET restaurant instances list */
router.get("/restaurant-instances", async (req, res, next) => {
  const restaurantInstances = await prisma.restaurantInstance.findMany({
    include: {
      restaurant: {
        include: {
          cuisines: {},
        },
      },
      location: {},
    },
  });
  res.json(restaurantInstances);
});

/* GET specific restaurant instance */
router.get("/restaurant-instances/:id", async (req, res, next) => {
  const restaurantInstance = await prisma.restaurantInstance.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      restaurant: {
        include: {
          cuisines: {},
        },
      },
    },
  });
  res.json(restaurantInstance);
});

module.exports = router;
