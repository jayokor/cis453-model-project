const Users = require("../models/users.model");
const { hashPassword } = require("../utils/password");
const { signToken } = require("../utils/tokens");
const { dbGet, dbRun } = require("../utils/sqlite");

async function createRestaurant(req, res, next) {
  try {
    const db = req.app.locals.db;
    const { name, category, address, lat, lng, image_url, is_enabled = 1 } = req.body;

    if (!name) return res.status(400).json({ error: "name is required" });

    const sql = `
      INSERT INTO restaurants (name, category, address, lat, lng, image_url, is_enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await dbRun(db, sql, [
      name,
      category || null,
      address || null,
      lat ?? null,
      lng ?? null,
      image_url || null,
      is_enabled ? 1 : 0,
    ]);

    const restaurant = await dbGet(db, "SELECT * FROM restaurants WHERE id = ?", [result.lastID]);
    res.status(201).json({ restaurant });
  } catch (err) {
    next(err);
  }
}

async function createRestaurantUser(req, res, next) {
  try {
    const db = req.app.locals.db;
    const { name, email, password, restaurant_id } = req.body;

    if (!name || !email || !password || !restaurant_id) {
      return res
        .status(400)
        .json({ error: "name, email, password, and restaurant_id are required" });
    }

    const existing = await Users.findUserByEmail(db, email);
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await hashPassword(password);
    const userId = await Users.createUser(db, {
      name,
      email,
      passwordHash,
      role: "RESTAURANT",
      restaurantId: Number(restaurant_id),
    });

    const user = await Users.getUserPublicById(db, userId);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/onboard-restaurant
// Body:
// {
//   "restaurant": { "name": "...", "category": "...", "address": "...", "lat": 0, "lng": 0, "image_url": "..." },
//   "user": { "name": "...", "email": "...", "password": "..." }
// }
async function onboardRestaurant(req, res, next) {
  const db = req.app.locals.db;
  const { restaurant, user } = req.body || {};

  if (!restaurant?.name) {
    return res.status(400).json({ error: "restaurant.name is required" });
  }
  if (!user?.name || !user?.email || !user?.password) {
    return res.status(400).json({ error: "user.name, user.email, and user.password are required" });
  }

  try {
    const existing = await Users.findUserByEmail(db, user.email);
    if (existing) return res.status(409).json({ error: "Email already in use" });

    await dbRun(db, "BEGIN");

    const rResult = await dbRun(
      db,
      `
      INSERT INTO restaurants (name, category, address, lat, lng, image_url, is_enabled)
      VALUES (?, ?, ?, ?, ?, ?, 1)
      `,
      [
        restaurant.name,
        restaurant.category || null,
        restaurant.address || null,
        restaurant.lat ?? null,
        restaurant.lng ?? null,
        restaurant.image_url || null,
      ]
    );

    const restaurantId = rResult.lastID;

    const passwordHash = await hashPassword(user.password);
    const userId = await Users.createUser(db, {
      name: user.name,
      email: user.email,
      passwordHash,
      role: "RESTAURANT",
      restaurantId,
    });

    await dbRun(db, "COMMIT");

    const createdRestaurant = await dbGet(db, "SELECT * FROM restaurants WHERE id = ?", [
      restaurantId,
    ]);
    const createdUser = await Users.getUserPublicById(db, userId);

    // nice for demo: immediately usable token
    const token = signToken({ id: createdUser.id, role: createdUser.role, email: createdUser.email });

    return res.status(201).json({ restaurant: createdRestaurant, user: createdUser, token });
  } catch (err) {
    try {
      await dbRun(db, "ROLLBACK");
    } catch (_) {}
    return next(err);
  }
}

module.exports = {
  createRestaurant,
  createRestaurantUser,
  onboardRestaurant,
};