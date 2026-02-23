const Cart = require("../models/cart.model");
const Orders = require("../models/orders.model");

function computeTaxCents(subtotalCents) {
  // MVP: fixed 0% tax OR simple 8% tax. Pick one.
  // We'll use 0% to keep it simple for class model project.
  return 0;
}

async function placeOrder(req, res, next) {
  try {
    const db = req.app.locals.db;
    const customerId = req.user.id;

    const { deliveryName, deliveryAddress, deliveryNotes } = req.body || {};

    const cartId = await Cart.getOrCreateCartId(db, customerId);
    const items = await Cart.getCartItems(db, cartId);

    if (!items.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Enforce single restaurant: all items should match
    const restaurantId = items[0].restaurant_id;
    for (const it of items) {
      if (it.restaurant_id !== restaurantId) {
        return res.status(409).json({ error: "Cart contains multiple restaurants" });
      }
    }

    const subtotalCents = items.reduce((sum, it) => sum + it.price_cents * it.quantity, 0);
    const taxCents = computeTaxCents(subtotalCents);
    const totalCents = subtotalCents + taxCents;

    const orderId = await Orders.createOrder(db, {
      customerId,
      restaurantId,
      subtotalCents,
      taxCents,
      totalCents,
      deliveryName,
      deliveryAddress,
      deliveryNotes,
    });

    for (const it of items) {
      const lineTotalCents = it.price_cents * it.quantity;
      await Orders.addOrderItem(db, {
        orderId,
        menuItemId: it.menu_item_id,
        itemName: it.name,
        priceCents: it.price_cents,
        quantity: it.quantity,
        lineTotalCents,
      });
    }

    // Clear cart after placing order
    await Cart.clearCart(db, cartId);

    const order = await Orders.getOrderById(db, orderId);
    const orderItems = await Orders.getOrderItems(db, orderId);

    res.status(201).json({ order, items: orderItems });
  } catch (err) {
    next(err);
  }
}

async function listMyOrders(req, res, next) {
  try {
    const db = req.app.locals.db;
    const customerId = req.user.id;

    const orders = await Orders.listOrdersForCustomer(db, customerId);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

async function getMyOrder(req, res, next) {
  try {
    const db = req.app.locals.db;
    const customerId = req.user.id;
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId)) {
      return res.status(400).json({ error: "Invalid order id" });
    }

    const order = await Orders.getOrderById(db, orderId);
    if (!order || order.customer_id !== customerId) {
      return res.status(404).json({ error: "Order not found" });
    }

    const items = await Orders.getOrderItems(db, orderId);
    res.json({ order, items });
  } catch (err) {
    next(err);
  }
}

module.exports = { placeOrder, listMyOrders, getMyOrder };
