const express = require("express");
const router = express.Router();

const RestaurantsController = require("../controllers/restaurants.controller");

// GET /api/restaurants?search=&category=
router.get("/", RestaurantsController.getRestaurants);

// GET /api/restaurants/:id
router.get("/:id", RestaurantsController.getRestaurant);

// GET /api/restaurants/:id/menu
router.get("/:id/menu", RestaurantsController.getRestaurantMenu);

module.exports = router;
