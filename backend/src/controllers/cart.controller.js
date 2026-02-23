const Cart = require("../models/cart.model");

async function getCart(req, res, next) {
  try {
    const db = req.app.locals.db;
    const customerId = req.user.id;

    const cartId = await Cart.getOrCreateCartId(db, customerId);
    const items = await Cart.getCartItems(db, cartId);
    const totals = Cart.calculateTotals(items);

    res.json({ cartId, items, totals });
  } catch (err) {
    next(err);
  }
}

async function addItem(req, res, next) {
  try {
    const db = req.app.locals.db;
    const customerId = req.user.id;

    const { menuItemId, quantity } = req.body;
    const mid = Number(menuItemId);
    const qty = Number(quantity);

    if (!Number.isInteger(mid) || !Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ error: "menuItemId and quantity (>0) required" });
    }

    const menuItem = await Cart.getMenuItem(db, mid);
    if (!menuItem || menuItem.is_available !== 1) {
      return res.status(404).json({ error: "Menu item not found or unavailable" });
    }

    const cartId = await Cart.getOrCreateCartId(db, customerId);

    // Enforce single-restaurant cart
    const existingRestaurantId = await Cart.getCartRestaurantId(db, cartId);
    if (existingRestaurantId && existingRestaurantId !== menuItem.restaurant_id) {
      return res.status(409).json({
        error: "Cart can only contain items from one restaurant. Clear cart first.",
        cart_restaurant_id: existingRestaurantId,
        item_restaurant_id: menuItem.restaurant_id,
      });
    }

    await Cart.upsertCartItem(db, cartId, mid, qty);

    const items = await Cart.getCartItems(db, cartId);
    const totals = Cart.calculateTotals(items);
    res.status(201).json({ cartId, items, totals });
  } catch (err) {
    next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const db = req.app.locals.db;
    const customerId = req.user.id;

    const mid = Number(req.params.menuItemId);
    const { quantity } = req.body;
    const qty = Number(quantity);

    if (!Number.isInteger(mid) || !Number.isInteger(qty)) {
      return res.status(400).json({ error: "Invalid menuItemId or quantity" });
    }

    const cartId = await Cart.getOrCreateCartId(db, customerId);

    if (qty <= 0) {
      await Cart.removeCartItem(db, cartId, mid);
    } else {
      const menuItem = await Cart.getMenuItem(db, mid);
      if (!menuItem || menuItem.is_available !== 1) {
        return res.status(404).json({ error: "Menu item not found or unavailable" });
      }
      await Cart.upsertCartItem(db, cartId, mid, qty);
    }

    const items = await Cart.getCartItems(db, cartId);
    const totals = Cart.calculateTotals(items);
    res.json({ cartId, items, totals });
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const db = req.app.locals.db;
    const customerId = req.user.id;

    const mid = Number(req.params.menuItemId);
    if (!Number.isInteger(mid)) {
      return res.status(400).json({ error: "Invalid menuItemId" });
    }

    const cartId = await Cart.getOrCreateCartId(db, customerId);
    await Cart.removeCartItem(db, cartId, mid);

    const items = await Cart.getCartItems(db, cartId);
    const totals = Cart.calculateTotals(items);
    res.json({ cartId, items, totals });
  } catch (err) {
    next(err);
  }
}

async function clear(req, res, next) {
  try {
    const db = req.app.locals.db;
    const customerId = req.user.id;

    const cartId = await Cart.getOrCreateCartId(db, customerId);
    await Cart.clearCart(db, cartId);

    res.json({ cartId, items: [], totals: { subtotal_cents: 0 } });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addItem, updateItem, removeItem, clear };
