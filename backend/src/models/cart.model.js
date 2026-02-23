const { dbGet, dbAll, dbRun } = require("../utils/sqlite");

async function getOrCreateCartId(db, customerId) {
  let cart = await dbGet(db, "SELECT id FROM carts WHERE customer_id = ?", [customerId]);
  if (cart) return cart.id;

  const created = await dbRun(db, "INSERT INTO carts (customer_id) VALUES (?)", [customerId]);
  return created.lastID;
}

async function getCartItems(db, cartId) {
  const sql = `
    SELECT
      ci.menu_item_id,
      ci.quantity,
      mi.name,
      mi.description,
      mi.price_cents,
      mi.restaurant_id
    FROM cart_items ci
    JOIN menu_items mi ON mi.id = ci.menu_item_id
    WHERE ci.cart_id = ?
    ORDER BY mi.name ASC
  `;
  return dbAll(db, sql, [cartId]);
}

function calculateTotals(items) {
  const subtotal_cents = items.reduce((sum, it) => sum + it.price_cents * it.quantity, 0);
  return { subtotal_cents };
}

async function getMenuItem(db, menuItemId) {
  return dbGet(
    db,
    `SELECT id, restaurant_id, name, price_cents, is_available
     FROM menu_items
     WHERE id = ?`,
    [menuItemId]
  );
}

async function getCartRestaurantId(db, cartId) {
  const row = await dbGet(
    db,
    `
    SELECT mi.restaurant_id AS restaurant_id
    FROM cart_items ci
    JOIN menu_items mi ON mi.id = ci.menu_item_id
    WHERE ci.cart_id = ?
    LIMIT 1
    `,
    [cartId]
  );
  return row ? row.restaurant_id : null;
}

async function upsertCartItem(db, cartId, menuItemId, quantity) {
  // If item exists, update; else insert
  const existing = await dbGet(
    db,
    "SELECT id FROM cart_items WHERE cart_id = ? AND menu_item_id = ?",
    [cartId, menuItemId]
  );

  if (existing) {
    await dbRun(
      db,
      "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND menu_item_id = ?",
      [quantity, cartId, menuItemId]
    );
    return;
  }

  await dbRun(
    db,
    "INSERT INTO cart_items (cart_id, menu_item_id, quantity) VALUES (?, ?, ?)",
    [cartId, menuItemId, quantity]
  );
}

async function removeCartItem(db, cartId, menuItemId) {
  await dbRun(
    db,
    "DELETE FROM cart_items WHERE cart_id = ? AND menu_item_id = ?",
    [cartId, menuItemId]
  );
}

async function clearCart(db, cartId) {
  await dbRun(db, "DELETE FROM cart_items WHERE cart_id = ?", [cartId]);
}

module.exports = {
  getOrCreateCartId,
  getCartItems,
  calculateTotals,
  getMenuItem,
  getCartRestaurantId,
  upsertCartItem,
  removeCartItem,
  clearCart,
};
