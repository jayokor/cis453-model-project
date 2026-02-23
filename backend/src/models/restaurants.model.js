const { dbAll, dbGet } = require("../utils/sqlite");

async function listRestaurants(db, { search, category } = {}) {
  const where = ["is_enabled = 1"];
  const params = [];

  if (category) {
    where.push("LOWER(category) = LOWER(?)");
    params.push(category);
  }

  if (search) {
    where.push("(LOWER(name) LIKE LOWER(?) OR LOWER(category) LIKE LOWER(?))");
    params.push(`%${search}%`, `%${search}%`);
  }

  const sql = `
    SELECT id, name, category, address, lat, lng, image_url
    FROM restaurants
    WHERE ${where.join(" AND ")}
    ORDER BY name ASC
  `;
  return dbAll(db, sql, params);
}

async function getRestaurantById(db, restaurantId) {
  const sql = `
    SELECT id, name, category, address, lat, lng, image_url, is_enabled
    FROM restaurants
    WHERE id = ?
  `;
  return dbGet(db, sql, [restaurantId]);
}

async function listMenuForRestaurant(db, restaurantId) {
  const sql = `
    SELECT id, restaurant_id, name, description, price_cents, is_available
    FROM menu_items
    WHERE restaurant_id = ? AND is_available = 1
    ORDER BY name ASC
  `;
  return dbAll(db, sql, [restaurantId]);
}

module.exports = { listRestaurants, getRestaurantById, listMenuForRestaurant };
