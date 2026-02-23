const express = require("express");
const router = express.Router();

const RestaurantController = require("../controllers/restaurant.controller");
const { requireAuth } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");

router.use(requireAuth);
router.use(requireRole("RESTAURANT"));

// Get orders for this restaurant
router.get("/orders", RestaurantController.listRestaurantOrders);

// Update an order status
router.patch("/orders/:id/status", RestaurantController.updateOrderStatus);

module.exports = router;
