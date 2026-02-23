const Restaurants = require("../models/restaurants.model");

async function getRestaurants(req, res, next) {
  try {
    const db = req.app.locals.db;
    const { search, category } = req.query;

    const restaurants = await Restaurants.listRestaurants(db, { search, category });
    res.json({ restaurants });
  } catch (err) {
    next(err);
  }
}

async function getRestaurant(req, res, next) {
  try {
    const db = req.app.locals.db;
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid restaurant id" });
    }

    const restaurant = await Restaurants.getRestaurantById(db, id);
    if (!restaurant || restaurant.is_enabled !== 1) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json({ restaurant });
  } catch (err) {
    next(err);
  }
}

async function getRestaurantMenu(req, res, next) {
  try {
    const db = req.app.locals.db;
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid restaurant id" });
    }

    const restaurant = await Restaurants.getRestaurantById(db, id);
    if (!restaurant || restaurant.is_enabled !== 1) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const menu = await Restaurants.listMenuForRestaurant(db, id);
    res.json({ restaurantId: id, menu });
  } catch (err) {
    next(err);
  }
}

module.exports = { getRestaurants, getRestaurant, getRestaurantMenu };
