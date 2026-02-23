const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/admin.controller");
const { requireAuth } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");

router.use(requireAuth);
router.use(requireRole("ADMIN"));

router.post("/restaurants", AdminController.createRestaurant);
router.post("/restaurant-users", AdminController.createRestaurantUser);
router.post("/onboard-restaurant", AdminController.onboardRestaurant);

module.exports = router;
