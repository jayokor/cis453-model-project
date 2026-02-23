const Orders = require("../models/orders.model");
const Users = require("../models/users.model");

const ALLOWED = new Set(["PLACED","ACCEPTED","PREPARING","READY","COMPLETED","CANCELLED"]);

async function listRestaurantOrders(req, res, next) {
  try {
    const db = req.app.locals.db;

    // Restaurant user must be linked to a restaurant_id in users table
    const me = await Users.getUserPublicById(db, req.user.id);
    if (!me || !me.restaurant_id) {
      return res.status(400).json({ error: "Restaurant user is not linked to a restaurant" });
    }

    const orders = await Orders.listOrdersForRestaurant(db, me.restaurant_id);
    res.json({ restaurantId: me.restaurant_id, orders });
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const db = req.app.locals.db;
    const orderId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(orderId)) {
      return res.status(400).json({ error: "Invalid order id" });
    }

    if (!status || !ALLOWED.has(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const me = await Users.getUserPublicById(db, req.user.id);
    if (!me || !me.restaurant_id) {
      return res.status(400).json({ error: "Restaurant user is not linked to a restaurant" });
    }

    const order = await Orders.getOrderById(db, orderId);
    if (!order || order.restaurant_id !== me.restaurant_id) {
      return res.status(404).json({ error: "Order not found" });
    }

    await Orders.updateOrderStatus(db, orderId, status);

    const updated = await Orders.getOrderById(db, orderId);
    res.json({ order: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = { listRestaurantOrders, updateOrderStatus };
