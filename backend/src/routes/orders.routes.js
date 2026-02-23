const express = require("express");
const router = express.Router();

const OrdersController = require("../controllers/orders.controller");
const { requireAuth } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");

router.use(requireAuth);
router.use(requireRole("CUSTOMER"));

// Place order from cart
router.post("/", OrdersController.placeOrder);

// List my orders
router.get("/", OrdersController.listMyOrders);

// Get one of my orders
router.get("/:id", OrdersController.getMyOrder);

module.exports = router;
