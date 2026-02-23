const { dbGet, dbAll, dbRun } = require("../utils/sqlite");

async function createOrder(db, {
  customerId,
  restaurantId,
  subtotalCents,
  taxCents,
  totalCents,
  deliveryName,
  deliveryAddress,
  deliveryNotes,
}) {
  const sql = `
    INSERT INTO orders (
      customer_id, restaurant_id, status,
      subtotal_cents, tax_cents, total_cents,
      payment_simulated, delivery_name, delivery_address, delivery_notes
    )
    VALUES (?, ?, 'PLACED', ?, ?, ?, 1, ?, ?, ?)
  `;

  const result = await dbRun(db, sql, [
    customerId,
    restaurantId,
    subtotalCents,
    taxCents,
    totalCents,
    deliveryName || null,
    deliveryAddress || null,
    deliveryNotes || null,
  ]);

  return result.lastID;
}

async function addOrderItem(db, {
  orderId,
  menuItemId,
  itemName,
  priceCents,
  quantity,
  lineTotalCents,
}) {
  const sql = `
    INSERT INTO order_items (
      order_id, menu_item_id, item_name, price_cents, quantity, line_total_cents
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await dbRun(db, sql, [orderId, menuItemId, itemName, priceCents, quantity, lineTotalCents]);
}

async function getOrderById(db, orderId) {
  return dbGet(db, "SELECT * FROM orders WHERE id = ?", [orderId]);
}

async function getOrderItems(db, orderId) {
  return dbAll(
    db,
    `
    SELECT id, menu_item_id, item_name, price_cents, quantity, line_total_cents
    FROM order_items
    WHERE order_id = ?
    ORDER BY id ASC
    `,
    [orderId]
  );
}

async function listOrdersForCustomer(db, customerId) {
  return dbAll(
    db,
    `
    SELECT id, restaurant_id, status, total_cents, created_at
    FROM orders
    WHERE customer_id = ?
    ORDER BY created_at DESC
    `,
    [customerId]
  );
}

async function listOrdersForRestaurant(db, restaurantId) {
  return dbAll(
    db,
    `
    SELECT id, customer_id, status, total_cents, created_at
    FROM orders
    WHERE restaurant_id = ?
    ORDER BY created_at DESC
    `,
    [restaurantId]
  );
}

async function updateOrderStatus(db, orderId, status) {
  await dbRun(db, "UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
}

module.exports = {
  createOrder,
  addOrderItem,
  getOrderById,
  getOrderItems,
  listOrdersForCustomer,
  listOrdersForRestaurant,
  updateOrderStatus,
};
