const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (req, res) => res.json({ ok: true }));

  // Routes
  app.use("/api/restaurants", require("./routes/restaurants.routes"));
  app.use("/api/auth", require("./routes/auth.routes"));
  app.use("/api/cart", require("./routes/cart.routes"));
  app.use("/api/orders", require("./routes/orders.routes"));
  app.use("/api/restaurant", require("./routes/restaurant.routes"));
  app.use("/api/admin", require("./routes/admin.routes"));

  // Error handler (last)
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
