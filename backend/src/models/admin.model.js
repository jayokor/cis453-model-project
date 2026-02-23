const { dbGet, dbRun } = require("../utils/sqlite");

async function createRestaurant(db, { name, category, address, lat, lng, image_url }) {
  const sql = `
    INSERT INTO restaurants (name, category, address, lat, lng, image_url, is_enabled)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `;
  const result = await dbRun(db, sql, [
    name,
    category || null,
    address || null,
    lat ?? null,
    lng ?? null,
    image_url || null,
  ]);
  return result.lastID;
}

async function getRestaurantById(db, id) {
  return dbGet(db, "SELECT * FROM restaurants WHERE id = ?", [id]);
}

async function createRestaurantUser(db, { name, email, passwordHash, restaurantId }) {
  const sql = `
    INSERT INTO users (name, email, password_hash, role, restaurant_id, is_active)
    VALUES (?, ?, ?, 'RESTAURANT', ?, 1)
  `;
  const result = await dbRun(db, sql, [name, email, passwordHash, restaurantId]);
  return result.lastID;
}

async function findUserByEmail(db, email) {
  return dbGet(
    db,
    "SELECT id, email FROM users WHERE LOWER(email)=LOWER(?)",
    [email]
  );
}

module.exports = {
  createRestaurant,
  getRestaurantById,
  createRestaurantUser,
  findUserByEmail,
};
