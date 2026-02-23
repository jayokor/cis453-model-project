const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

function ensureDirForDb(dbPath) {
  const dir = path.dirname(dbPath);
  fs.mkdirSync(dir, { recursive: true });
}

function openDb(dbPath) {
  ensureDirForDb(dbPath);
  return new sqlite3.Database(dbPath);
}

function execSqlFile(db, filePath) {
  const sql = fs.readFileSync(filePath, "utf8");
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => (err ? reject(err) : resolve()));
  });
}

function dbGet(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
}

async function isDbEmpty(db) {
  // “Empty” = no rows in core tables. If either has rows, we skip seeding.
  const row = await dbGet(
    db,
    `SELECT
       (SELECT COUNT(*) FROM users) AS users_count,
       (SELECT COUNT(*) FROM restaurants) AS restaurants_count`
  );

  const usersCount = Number(row?.users_count || 0);
  const restaurantsCount = Number(row?.restaurants_count || 0);
  return usersCount + restaurantsCount === 0;
}

async function initDb() {
  const dbPath = process.env.DB_PATH || "./data/app.db";

  // Track whether we're starting from a brand-new DB file.
  const existedBefore = fs.existsSync(dbPath);

  // DEV MODE: reset DB each server start
  if (process.env.RESET_DB_ON_START === "1") {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log(`Deleted DB at ${dbPath} (RESET_DB_ON_START=1)`);
    }
  }

  const isNewFile = !existedBefore || process.env.RESET_DB_ON_START === "1";

  const db = openDb(dbPath);

  // Enforce FK constraints
  await new Promise((resolve, reject) =>
    db.run("PRAGMA foreign_keys = ON;", (err) => (err ? reject(err) : resolve()))
  );

  const schemaPath = path.join(__dirname, "..", "db", "schema.sql");
  const seedPath = path.join(__dirname, "..", "db", "seed_data.sql");

  // Always ensure schema exists
  await execSqlFile(db, schemaPath);

  // Seed only when fresh OR empty
  if (isNewFile || (await isDbEmpty(db))) {
    await execSqlFile(db, seedPath);
    console.log("Database seeded.");
  } else {
    console.log("Database already has data; skipping seed.");
  }

  return db;
}

module.exports = { initDb };