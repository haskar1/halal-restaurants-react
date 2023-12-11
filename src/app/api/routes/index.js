const express = require("express");
const router = express.Router();
const { PrismaClient } = require("../../../../node_modules/@prisma/client");

const prisma = new PrismaClient();

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

module.exports = router;
