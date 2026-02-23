PRAGMA foreign_keys = ON;

-- =========================
-- Restaurants (10 Syracuse)
-- =========================
INSERT INTO restaurants (name, category, address, lat, lng, image_url, is_enabled)
VALUES
('Syracuse Halal Gyro', 'Middle Eastern', '477 Westcott St, Syracuse, NY 13210', NULL, NULL, NULL, 1),
('No. 1 Kitchen', 'Chinese', '317 Nottingham Rd, Syracuse, NY 13210', NULL, NULL, NULL, 1),
('Domino''s Pizza', 'Pizza', '329 Nottingham Rd, Syracuse, NY 13210', NULL, NULL, NULL, 1),
('Margarita''s', 'Mexican', '203 Walton St, Syracuse, NY 13202', NULL, NULL, NULL, 1),
('Five Guys', 'Burgers', '727 S Crouse Ave, Syracuse, NY 13210', NULL, NULL, NULL, 1),
('Inka''s', 'Peruvian', '201 S Salina St, Syracuse, NY 13202', NULL, NULL, NULL, 1),
('Mi Casa Grande', 'Latin/Mexican', '1706 Erie Blvd E, Syracuse, NY 13210', NULL, NULL, NULL, 1),
('Pastabilities', 'Italian', '311 S Franklin St, Syracuse, NY 13202', NULL, NULL, NULL, 1),
('Francesca''s', 'Italian', '545 N Salina St, Syracuse, NY 13208', NULL, NULL, NULL, 1),
('Dosa Grill', 'Indian', '4467 E Genesee St, Syracuse, NY 13214', NULL, NULL, NULL, 1);

-- =========================
-- Menu Items (a few each)
-- =========================

-- Syracuse Halal Gyro
INSERT INTO menu_items (restaurant_id, name, price_cents, description, is_available)
VALUES
((SELECT id FROM restaurants WHERE name='Syracuse Halal Gyro'), 'Chicken Gyro', CAST(ROUND(11.99 * 100) AS INTEGER), 'Marinated chicken gyro on pita with toppings + sauce', 1),
((SELECT id FROM restaurants WHERE name='Syracuse Halal Gyro'), 'Lamb Gyro', CAST(ROUND(12.99 * 100) AS INTEGER), 'Freshly sliced lamb gyro on pita with toppings + sauce', 1),
((SELECT id FROM restaurants WHERE name='Syracuse Halal Gyro'), 'Falafel Sandwich', CAST(ROUND(10.99 * 100) AS INTEGER), 'Falafel on pita with lettuce, tomato, cucumber + sauce', 1),
((SELECT id FROM restaurants WHERE name='Syracuse Halal Gyro'), 'Fries', CAST(ROUND(3.00 * 100) AS INTEGER), 'Classic fries', 1);

-- No. 1 Kitchen
INSERT INTO menu_items (restaurant_id, name, price_cents, description, is_available)
VALUES
((SELECT id FROM restaurants WHERE name='No. 1 Kitchen'), 'Chicken Fried Rice', CAST(ROUND(10.55 * 100) AS INTEGER), 'Chicken + rice stir-fried with veggies', 1),
((SELECT id FROM restaurants WHERE name='No. 1 Kitchen'), 'Pork Fried Rice', CAST(ROUND(10.55 * 100) AS INTEGER), 'Pork + rice stir-fried with veggies', 1),
((SELECT id FROM restaurants WHERE name='No. 1 Kitchen'), 'Shrimp Fried Rice', CAST(ROUND(11.55 * 100) AS INTEGER), 'Shrimp + rice stir-fried with veggies', 1),
((SELECT id FROM restaurants WHERE name='No. 1 Kitchen'), 'French Fries', CAST(ROUND(9.55 * 100) AS INTEGER), 'House fries (menu variant)', 1);

-- Domino's Pizza
INSERT INTO menu_items (restaurant_id, name, price_cents, description, is_available)
VALUES
((SELECT id FROM restaurants WHERE name='Domino''s Pizza'), 'Large Pepperoni Pizza', CAST(ROUND(14.99 * 100) AS INTEGER), 'Classic pepperoni pizza', 1),
((SELECT id FROM restaurants WHERE name='Domino''s Pizza'), 'Cheesy Bread', CAST(ROUND(7.49 * 100) AS INTEGER), 'Baked bread with cheese', 1),
((SELECT id FROM restaurants WHERE name='Domino''s Pizza'), 'Coca-Cola (20oz)', CAST(ROUND(2.49 * 100) AS INTEGER), 'Bottled soda', 1);

-- Margarita's
INSERT INTO menu_items (restaurant_id, name, price_cents, description, is_available)
VALUES
((SELECT id FROM restaurants WHERE name='Margarita''s'), 'Steak Burrito', CAST(ROUND(22.00 * 100) AS INTEGER), 'Steak burrito with rice, beans, salsa', 1),
((SELECT id FROM restaurants WHERE name='Margarita''s'), 'Birria Tacos', CAST(ROUND(23.00 * 100) AS INTEGER), 'Birria tacos with consommé', 1),
((SELECT id FROM restaurants WHERE name='Margarita''s'), 'Chips & Salsa', CAST(ROUND(6.00 * 100) AS INTEGER), 'Chips served with salsa', 1);

-- Five Guys
INSERT INTO menu_items (restaurant_id, name, price_cents, description, is_available)
VALUES
((SELECT id FROM restaurants WHERE name='Five Guys'), 'Hamburger', CAST(ROUND(9.99 * 100) AS INTEGER), 'Fresh beef hamburger (toppings free)', 1),
((SELECT id FROM restaurants WHERE name='Five Guys'), 'Cheeseburger', CAST(ROUND(10.99 * 100) AS INTEGER), 'Fresh beef cheeseburger (toppings free)', 1),
((SELECT id FROM restaurants WHERE name='Five Guys'), 'Regular Fries', CAST(ROUND(4.99 * 100) AS INTEGER), 'Five Guys style fries', 1),
((SELECT id FROM restaurants WHERE name='Five Guys'), 'Milkshake', CAST(ROUND(6.49 * 100) AS INTEGER), 'Custom shake (mix-ins free)', 1);

-- Inka's
INSERT INTO menu_items (restaurant_id, name, price_cents, description, is_available)
VALUES
((SELECT id FROM restaurants WHERE name='Inka''s'), 'Pollo a La Brasa', CAST(ROUND(32.00 * 100) AS INTEGER), 'Peruvian rotisserie chicken', 1),
((SELECT id FROM restaurants WHERE name='Inka''s'), 'Arroz Chaufa', CAST(ROUND(27.00 * 100) AS INTEGER), 'Peruvian-style fried rice', 1),
((SELECT id FROM restaurants WHERE name='Inka''s'), 'Lomo Saltado', CAST(ROUND(46.00 * 100) AS INTEGER), 'Stir-fried beef with fries + rice', 1),
((SELECT id FROM restaurants WHERE name='Inka''s'), 'Anticuchos De Carne', CAST(ROUND(22.00 * 100) AS INTEGER), 'Grilled beef skewers', 1);

-- Mi Casa Grande
INSERT INTO menu_items (restaurant_id, name, price_cents, description, is_available)
VALUES
((SELECT id FROM restaurants WHERE name='Mi Casa Grande'), 'Combo Meal', CAST(ROUND(13.00 * 100) AS INTEGER), 'Popular combo plate', 1),
((SELECT id FROM restaurants WHERE name='Mi Casa Grande'), 'Mofongo', CAST(ROUND(14.00 * 100) AS INTEGER), 'Plantain-based dish (varies by protein)', 1),
((SELECT id FROM restaurants WHERE name='Mi Casa Grande'), 'Tacos al Pastor (4 pcs)', CAST(ROUND(10.00 * 100) AS INTEGER), 'Al pastor tacos', 1);

-- Pastabilities
INSERT INTO menu_items (restaurant_id, name, price_cents, description, is_available)
VALUES
((SELECT id FROM restaurants WHERE name='Pastabilities'), 'House Tomato Sauce', CAST(ROUND(18.00 * 100) AS INTEGER), 'House-made tomato sauce (choose pasta)', 1),
((SELECT id FROM restaurants WHERE name='Pastabilities'), 'Alfredo', CAST(ROUND(20.00 * 100) AS INTEGER), 'Alfredo sauce (choose pasta)', 1),
((SELECT id FROM restaurants WHERE name='Pastabilities'), 'Bolognese', CAST(ROUND(25.00 * 100) AS INTEGER), 'Beef + pork bolognese (choose pasta)', 1),
((SELECT id FROM restaurants WHERE name='Pastabilities'), 'Hot Vodka', CAST(ROUND(23.00 * 100) AS INTEGER), 'Spicy hot tomato oil + pink vodka cream', 1),
((SELECT id FROM restaurants WHERE name='Pastabilities'), 'Wicky-Wicky Chicken Riggies', CAST(ROUND(27.00 * 100) AS INTEGER), 'Rigatoni + spicy tomato cream + chicken (or meatball)', 1);

-- Francesca's
INSERT INTO menu_items (restaurant_id, name, price_cents, description, is_available)
VALUES
((SELECT id FROM restaurants WHERE name='Francesca''s'), 'Antipasto Plate (2 people)', CAST(ROUND(34.00 * 100) AS INTEGER), 'Italian cheese + cold cuts + olives', 1),
((SELECT id FROM restaurants WHERE name='Francesca''s'), 'Bruschetta', CAST(ROUND(16.00 * 100) AS INTEGER), 'Toasted bread with toppings', 1),
((SELECT id FROM restaurants WHERE name='Francesca''s'), 'Chicken Marsala', CAST(ROUND(28.00 * 100) AS INTEGER), 'Chicken in marsala wine sauce', 1);

-- Dosa Grill
INSERT INTO menu_items (restaurant_id, name, price_cents, description, is_available)
VALUES
((SELECT id FROM restaurants WHERE name='Dosa Grill'), 'Chicken Tikka Masala', CAST(ROUND(14.95 * 100) AS INTEGER), 'Chicken in creamy spiced sauce', 1),
((SELECT id FROM restaurants WHERE name='Dosa Grill'), 'Chicken Makhani (Butter Chicken)', CAST(ROUND(14.95 * 100) AS INTEGER), 'Butter chicken curry', 1),
((SELECT id FROM restaurants WHERE name='Dosa Grill'), 'Vegetable Samosa', CAST(ROUND(3.95 * 100) AS INTEGER), 'Crispy pastry stuffed with potatoes/peas', 1),
((SELECT id FROM restaurants WHERE name='Dosa Grill'), 'Paani Puri', CAST(ROUND(4.95 * 100) AS INTEGER), 'Crispy puri with flavored water', 1);

-- Admin user (idempotent)
INSERT INTO users (name, email, password_hash, role, restaurant_id, is_active)
VALUES (
  'Admin',
  'admin@example.com',
  '$2a$10$nmvQ3sBYw1e91D55H/TBMODMK/VORYgOcBq5R0VEakdZ4qpprMzaS',
  'ADMIN',
  NULL,
  1
)
ON CONFLICT(email) DO UPDATE SET
  name          = excluded.name,
  password_hash = excluded.password_hash,
  role          = excluded.role,
  restaurant_id = excluded.restaurant_id,
  is_active     = excluded.is_active;

INSERT INTO users (name, email, password_hash, role, restaurant_id, is_active)
VALUES ('Dosa Grill Owner', 'dosa@example.com', '$2b$10$ZkKQs7yFjW1vh0nfELM4X.dECXsyupjMkhCo.7IChmFh3pu1AWux2', 'RESTAURANT', 1, 1);