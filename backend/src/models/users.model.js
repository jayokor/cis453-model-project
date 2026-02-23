const { dbGet, dbRun } = require("../utils/sqlite");

async function findUserByEmail(db, email) {
  const sql = `
    SELECT id, name, email, password_hash, role, is_active, restaurant_id
    FROM users
    WHERE LOWER(email) = LOWER(?)
  `;
  return dbGet(db, sql, [email]);
}

async function createUser(db, {
  name,
  email,
  passwordHash,
  role = "CUSTOMER",
  restaurantId = null,
}) {
  const sql = `
    INSERT INTO users (name, email, password_hash, role, restaurant_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  const result = await dbRun(db, sql, [name, email, passwordHash, role, restaurantId]);
  return result.lastID;
}

async function getUserPublicById(db, id) {
  const sql = `
    SELECT id, name, email, role, is_active, restaurant_id
    FROM users
    WHERE id = ?
  `;
  return dbGet(db, sql, [id]);
}

module.exports = { findUserByEmail, createUser, getUserPublicById };
