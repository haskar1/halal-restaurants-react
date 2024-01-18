const express = require("express");
const router = express.Router();
const { PrismaClient } = require("../../../../node_modules/@prisma/client");
const prisma = new PrismaClient();
const db = require("../database");

/* Search bar */
router.get("/search", async (req, res) => {
  try {
    const query = req.query.s;
    const result = await db.query(
      `SELECT name FROM restaurants WHERE name ILIKE '${query}%' OR name ILIKE '% ${query}%' LIMIT 10`
    );
    res.send(result);
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
