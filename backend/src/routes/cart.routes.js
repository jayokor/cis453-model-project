const express = require("express");
const router = express.Router();

const CartController = require("../controllers/cart.controller");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// GET /api/cart
router.get("/", CartController.getCart);

// POST /api/cart/items { menuItemId, quantity }
router.post("/items", CartController.addItem);

// PATCH /api/cart/items/:menuItemId { quantity }
router.patch("/items/:menuItemId", CartController.updateItem);

// DELETE /api/cart/items/:menuItemId
router.delete("/items/:menuItemId", CartController.removeItem);

// DELETE /api/cart
router.delete("/", CartController.clear);

module.exports = router;
