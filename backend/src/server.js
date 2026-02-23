require("dotenv").config();

const { createApp } = require("./app");
const { initDb } = require("./db");

const PORT = process.env.PORT || 4000;

async function main() {
  const db = await initDb();

  // expose db to routes via app.locals (cleaner than global)
  const app = createApp();
  app.locals.db = db;

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
