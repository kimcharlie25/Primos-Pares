-- Add Primos' Pares Menu Items
-- Migration to populate the database with the complete menu

-- First, ensure categories exist
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('new-products', 'New Products', '🆕', 1, true),
  ('pares', 'Pares', '🍲', 2, true),
  ('combi-meals', 'Combi Meals', '🍱', 3, true),
  ('noodles', 'Noodles', '🍜', 4, true),
  ('log-si', 'Log-Si', '🍳', 5, true),
  ('beverages', 'Beverages', '🥤', 6, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- NEW PRODUCTS
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('TOKWA''T LECHON', 'Crispy lechon with tofu in savory sauce', 109, 'new-products', true, true),
  ('LECHON BULAKDAKAN', 'Premium lechon with crispy chicharon bulaklak', 149, 'new-products', true, true);

-- PARES (All served with rice, soup, and main dish)
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('SUPRIMO PARES', 'Premium beef pares served with rice, soup, and main dish', 209, 'pares', true, true),
  ('MARROW PARES', 'Beef pares with bone marrow, served with rice, soup, and main dish', 195, 'pares', true, true),
  ('BEEF PARES (KLASIK)', 'Classic beef pares served with rice, soup, and main dish', 80, 'pares', false, true),
  ('BULAKLAK PARES (KLASIK)', 'Chicharon bulaklak pares served with rice, soup, and main dish', 80, 'pares', false, true),
  ('ISAW PARES (KLASIK)', 'Grilled isaw pares served with rice, soup, and main dish', 80, 'pares', false, true),
  ('LECHON PARES (KLASIK)', 'Lechon pares served with rice, soup, and main dish', 80, 'pares', false, true);

-- COMBI MEALS (All served with rice)
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('COMBI BULAK', 'Chicharon bulaklak combo served with rice', 125, 'combi-meals', false, true),
  ('COMBI ISAW', 'Grilled isaw combo served with rice', 125, 'combi-meals', false, true),
  ('COMBI LECHON', 'Lechon kawali combo served with rice', 125, 'combi-meals', false, true);

-- NOODLES
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('OBERLOWD KINALAS', 'Overloaded kinalas with extra toppings', 215, 'noodles', true, true),
  ('KINALAS ISPESYAL', 'Special kinalas with premium ingredients', 114, 'noodles', true, true),
  ('REGULAR KINALAS', 'Classic Bicolano kinalas noodle soup', 75, 'noodles', false, true),
  ('PANSIT W/ BEEF', 'Stir-fried noodles with beef', 49, 'noodles', false, true),
  ('PANSIT W/ EGG', 'Stir-fried noodles with egg', 44, 'noodles', false, true),
  ('2 PCS LUMPIA', 'Two pieces of lumpiang shanghai', 20, 'noodles', false, true),
  ('EXTRA EGG', 'Add an extra egg to your dish', 15, 'noodles', false, true);

-- LOG-SI (All meals served with fried rice, egg, and home-made atchara)
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('BU-LUMSI', 'Bulaklak, Lumpiang Shanghai, and Seasoned Vinegar. Served with fried rice, egg, and home-made atchara', 164, 'log-si', true, true),
  ('LU-HANGSI', 'Lumpiang Shanghai, Hungarian, and Seasoned Vinegar. Served with fried rice, egg, and home-made atchara', 164, 'log-si', true, true),
  ('BU-HANGSI', 'Bulaklak, Hungarian, and Seasoned Vinegar. Served with fried rice, egg, and home-made atchara', 164, 'log-si', true, true),
  ('BU-LECHSI', 'Bulaklak, Lechon and Seasoned Vinegar. Served with fried rice, egg, and home-made atchara', 164, 'log-si', true, true),
  ('SPAM-SI', 'Spam drizzled with Cheese Sauce. Served with fried rice, egg, and home-made atchara', 124, 'log-si', false, true),
  ('HANG-SI', 'Hungarian drizzled with cheese and red sauce. Served with fried rice, egg, and home-made atchara', 124, 'log-si', false, true),
  ('BUL-SI', 'Chicharon Bulaklak and Seasoned Vinegar. Served with fried rice, egg, and home-made atchara', 124, 'log-si', false, true),
  ('LECH-SI', 'Lechon Kawali and Lechon Sauce. Served with fried rice, egg, and home-made atchara', 124, 'log-si', false, true),
  ('TAP-SI', 'Beef Tapa and Seasoned Vinegar. Served with fried rice, egg, and home-made atchara', 124, 'log-si', false, true),
  ('LUM-SI', 'Lumpiang Shanghai and Seasoned Vinegar. Served with fried rice, egg, and home-made atchara', 104, 'log-si', false, true),
  ('CHIK-SI', 'Fried Chicken and Gravy. Served with fried rice, egg, and home-made atchara', 129, 'log-si', false, true);

-- BEVERAGES - LATTE / FLOATS
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('OREO LATTE', 'Creamy latte with Oreo bits', 100, 'beverages', true, true),
  ('BISCOFF LATTE', 'Smooth latte with Biscoff cookie flavor', 100, 'beverages', true, true),
  ('UBE OREO LATTE', 'Ube-flavored latte with Oreo bits', 110, 'beverages', true, true),
  ('STRAWBERRY LATTE', 'Refreshing strawberry-flavored latte', 100, 'beverages', false, true),
  ('CHUCKIE FLOAT', 'Chuckie drink with ice cream float', 80, 'beverages', false, true),
  ('COKE FLOAT', 'Classic Coke with ice cream float', 50, 'beverages', false, true);

-- BEVERAGES - COOLERS (2 for P 80, so P 40 each)
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('LYCHEE COOLER', 'Refreshing lychee-flavored cooler drink. Buy 2 for P 80!', 40, 'beverages', false, true),
  ('WATERMELON COOLER', 'Sweet watermelon cooler drink. Buy 2 for P 80!', 40, 'beverages', false, true),
  ('STRAWBERRY COOLER', 'Fresh strawberry cooler drink. Buy 2 for P 80!', 40, 'beverages', false, true),
  ('CALAMANSI COOLER', 'Tangy calamansi cooler drink. Buy 2 for P 80!', 40, 'beverages', false, true),
  ('BLUEBERRY COOLER', 'Sweet blueberry cooler drink. Buy 2 for P 80!', 40, 'beverages', false, true),
  ('BUBBLEGUM COOLER', 'Fun bubblegum-flavored cooler drink. Buy 2 for P 80!', 40, 'beverages', false, true),
  ('HONEY PEACH COOLER', 'Sweet honey peach cooler drink. Buy 2 for P 80!', 40, 'beverages', false, true),
  ('RASPBERRY COOLER', 'Tart raspberry cooler drink. Buy 2 for P 80!', 40, 'beverages', false, true),
  ('GRAPES COOLER', 'Sweet grapes cooler drink. Buy 2 for P 80!', 40, 'beverages', false, true),
  ('LEMON COOLER', 'Zesty lemon cooler drink. Buy 2 for P 80!', 40, 'beverages', false, true),
  ('KIWI COOLER', 'Tropical kiwi cooler drink. Buy 2 for P 80!', 40, 'beverages', false, true);

-- Add UNLI-RICE as an add-on for PARES and LOG-SI items
-- First, get the menu item IDs for pares items
DO $$
DECLARE
  pares_item RECORD;
  logsi_item RECORD;
BEGIN
  -- Add UNLI-RICE add-on to all PARES items
  FOR pares_item IN 
    SELECT id FROM menu_items WHERE category = 'pares'
  LOOP
    INSERT INTO add_ons (menu_item_id, name, price, category)
    VALUES (pares_item.id, 'UNLI-RICE', 35, 'extras');
  END LOOP;

  -- Add UNLI-RICE add-on to all LOG-SI items
  FOR logsi_item IN 
    SELECT id FROM menu_items WHERE category = 'log-si'
  LOOP
    INSERT INTO add_ons (menu_item_id, name, price, category)
    VALUES (logsi_item.id, 'UNLI-RICE', 35, 'extras');
  END LOOP;
END $$;

-- Add side orders as add-ons to noodle items
DO $$
DECLARE
  noodle_item RECORD;
BEGIN
  FOR noodle_item IN 
    SELECT id FROM menu_items 
    WHERE category = 'noodles' 
    AND name NOT IN ('2 PCS LUMPIA', 'EXTRA EGG')
  LOOP
    -- Add lumpia as add-on
    INSERT INTO add_ons (menu_item_id, name, price, category)
    VALUES (noodle_item.id, '2 PCS LUMPIA', 20, 'side-orders');
    
    -- Add egg as add-on
    INSERT INTO add_ons (menu_item_id, name, price, category)
    VALUES (noodle_item.id, 'EXTRA EGG', 15, 'side-orders');
  END LOOP;
END $$;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Primos Pares menu successfully added to database!';
END $$;

