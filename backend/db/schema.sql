PRAGMA foreign_keys = ON;

-- =========================
-- Restaurants
-- =========================
CREATE TABLE IF NOT EXISTS restaurants (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  category    TEXT,
  address     TEXT,
  lat         REAL,
  lng         REAL,
  image_url   TEXT,
  is_enabled  INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Auto-update updated_at
CREATE TRIGGER IF NOT EXISTS trg_restaurants_updated_at
AFTER UPDATE ON restaurants
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE restaurants
  SET updated_at = datetime('now')
  WHERE id = NEW.id;
END;

-- =========================
-- Users (role-based)
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('CUSTOMER','RESTAURANT','ADMIN')),
  restaurant_id INTEGER,
  is_active     INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_users_restaurant_id ON users(restaurant_id);

CREATE TRIGGER IF NOT EXISTS trg_users_updated_at
AFTER UPDATE ON users
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE users
  SET updated_at = datetime('now')
  WHERE id = NEW.id;
END;

-- =========================
-- Menu items
-- =========================
CREATE TABLE IF NOT EXISTS menu_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id INTEGER NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  price_cents   INTEGER NOT NULL CHECK (price_cents >= 0),
  is_available  INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);

CREATE TRIGGER IF NOT EXISTS trg_menu_items_updated_at
AFTER UPDATE ON menu_items
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE menu_items
  SET updated_at = datetime('now')
  WHERE id = NEW.id;
END;

-- =========================
-- Orders
-- =========================
CREATE TABLE IF NOT EXISTS orders (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id       INTEGER NOT NULL,
  restaurant_id     INTEGER NOT NULL,

  status            TEXT NOT NULL CHECK (
    status IN ('PLACED','ACCEPTED','PREPARING','READY','COMPLETED','CANCELLED')
  ),

  subtotal_cents    INTEGER NOT NULL DEFAULT 0 CHECK (subtotal_cents >= 0),
  tax_cents         INTEGER NOT NULL DEFAULT 0 CHECK (tax_cents >= 0),
  total_cents       INTEGER NOT NULL DEFAULT 0 CHECK (total_cents >= 0),

  payment_simulated INTEGER NOT NULL DEFAULT 1,

  delivery_name     TEXT,
  delivery_address  TEXT,
  delivery_notes    TEXT,

  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE TRIGGER IF NOT EXISTS trg_orders_updated_at
AFTER UPDATE ON orders
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE orders
  SET updated_at = datetime('now')
  WHERE id = NEW.id;
END;

-- =========================
-- Order items (snapshots)
-- =========================
CREATE TABLE IF NOT EXISTS order_items (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id         INTEGER NOT NULL,
  menu_item_id     INTEGER NOT NULL,

  item_name        TEXT NOT NULL,
  price_cents      INTEGER NOT NULL CHECK (price_cents >= 0),
  quantity         INTEGER NOT NULL CHECK (quantity > 0),
  line_total_cents INTEGER NOT NULL CHECK (line_total_cents >= 0),

  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- =========================
-- Carts (API-based cart)
-- =========================
CREATE TABLE IF NOT EXISTS carts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL UNIQUE,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TRIGGER IF NOT EXISTS trg_carts_updated_at
AFTER UPDATE ON carts
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE carts
  SET updated_at = datetime('now')
  WHERE id = NEW.id;
END;

CREATE TABLE IF NOT EXISTS cart_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  cart_id      INTEGER NOT NULL,
  menu_item_id INTEGER NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity > 0),

  UNIQUE(cart_id, menu_item_id),

  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);