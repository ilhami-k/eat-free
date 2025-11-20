-- ============================
--  Expanded Seeding Data for eat-free
--  3 Users, ~60 Ingredients, 15 Recipes
-- ============================

USE eat_free;

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION,ERROR_FOR_DIVISION_BY_ZERO,NO_ZERO_DATE,NO_ZERO_IN_DATE';

-- Optional: Clean start for seeding (uncomment if needed)
-- DELETE FROM Journal; DELETE FROM Meal_Plan_Recipe; DELETE FROM Meal_Plan;
-- DELETE FROM Inventory_Ingredient; DELETE FROM Recipe_Ingredients;
-- DELETE FROM Recipe; DELETE FROM Ingredients; DELETE FROM User;

-- ============================================
--  1. INSERT USERS (Limit: 3)
-- ============================================

INSERT INTO User (email, name, created_at) VALUES
('chef@eatfree.app', 'Gordon R.', CURRENT_TIMESTAMP),
('baker@eatfree.app', 'Julia C.', CURRENT_TIMESTAMP),
('student@eatfree.app', 'College Kid', CURRENT_TIMESTAMP);

-- ============================================
--  2. INSERT INGREDIENTS (Global Catalog)
-- ============================================

INSERT INTO Ingredients (name, kcal_per_100g, protein_g_per_100g, carbs_g_per_100g, fat_g_per_100g) VALUES
-- -- MEAT & SEAFOOD --
('Chicken Breast (Raw)', 120, 23.0, 0.0, 2.5),       -- 1
('Ground Beef 80/20 (Raw)', 254, 17.0, 0.0, 20.0),   -- 2
('Salmon Fillet (Raw)', 208, 20.0, 0.0, 13.0),       -- 3
('Bacon (Raw)', 541, 37.0, 1.4, 42.0),               -- 4
('Tuna (Canned in Water)', 116, 26.0, 0.0, 1.0),     -- 5
('Turkey Breast (Raw)', 135, 24.0, 0.0, 3.0),        -- 6

-- -- DAIRY & EGGS --
('Eggs (Large)', 143, 12.6, 0.7, 9.5),               -- 7
('Greek Yogurt (Plain)', 59, 10.0, 3.6, 0.4),        -- 8
('Milk (Whole)', 61, 3.2, 4.8, 3.3),                 -- 9
('Cheddar Cheese', 403, 25.0, 1.3, 33.0),            -- 10
('Mozzarella Cheese', 280, 28.0, 3.1, 17.0),         -- 11
('Parmesan Cheese', 431, 38.0, 4.1, 29.0),           -- 12
('Butter', 717, 0.9, 0.1, 81.0),                     -- 13
('Heavy Cream', 340, 2.8, 2.7, 36.0),                -- 14

-- -- GRAINS & STARCHES --
('Basmati Rice (Dry)', 365, 7.1, 77.0, 1.0),         -- 15
('Spaghetti (Dry)', 371, 13.0, 75.0, 1.5),           -- 16
('Oats (Rolled)', 379, 13.0, 68.0, 6.0),             -- 17
('Potato (Raw)', 77, 2.0, 17.5, 0.1),                -- 18
('Sweet Potato (Raw)', 86, 1.6, 20.0, 0.1),          -- 19
('White Bread (Slice)', 265, 9.0, 49.0, 3.2),        -- 20
('Tortilla (Flour)', 300, 8.0, 52.0, 7.0),           -- 21
('Quinoa (Dry)', 368, 14.0, 64.0, 6.0),              -- 22
('All-Purpose Flour', 364, 10.0, 76.0, 1.0),         -- 23

-- -- VEGETABLES --
('Broccoli', 34, 2.8, 6.6, 0.4),                     -- 24
('Spinach', 23, 2.9, 3.6, 0.4),                      -- 25
('Carrot', 41, 0.9, 9.6, 0.2),                       -- 26
('Onion (Yellow)', 40, 1.1, 9.3, 0.1),               -- 27
('Garlic', 149, 6.4, 33.0, 0.5),                     -- 28
('Bell Pepper (Red)', 31, 1.0, 6.0, 0.3),            -- 29
('Tomato (Fresh)', 18, 0.9, 3.9, 0.2),               -- 30
('Lettuce (Romaine)', 17, 1.2, 3.3, 0.3),            -- 31
('Cucumber', 15, 0.7, 3.6, 0.1),                     -- 32
('Zucchini', 17, 1.2, 3.1, 0.3),                     -- 33
('Avocado', 160, 2.0, 8.5, 14.7),                    -- 34
('Mushrooms', 22, 3.1, 3.3, 0.3),                    -- 35
('Green Beans', 31, 1.8, 7.0, 0.2),                  -- 36
('Cauliflower', 25, 1.9, 5.0, 0.3),                  -- 37

-- -- FRUITS --
('Banana', 89, 1.1, 22.8, 0.3),                      -- 38
('Apple', 52, 0.3, 14.0, 0.2),                       -- 39
('Blueberries', 57, 0.7, 14.5, 0.3),                 -- 40
('Strawberries', 32, 0.7, 7.7, 0.3),                 -- 41
('Lemon', 29, 1.1, 9.0, 0.3),                        -- 42

-- -- PANTRY & CONDIMENTS --
('Olive Oil', 884, 0.0, 0.0, 100.0),                 -- 43
('Soy Sauce', 53, 8.0, 4.9, 0.6),                    -- 44
('Honey', 304, 0.3, 82.0, 0.0),                      -- 45
('Peanut Butter', 588, 25.0, 20.0, 50.0),            -- 46
('Sugar', 387, 0.0, 100.0, 0.0),                     -- 47
('Tomato Paste', 82, 4.3, 19.0, 0.5),                -- 48
('Mayonnaise', 680, 1.0, 1.0, 75.0),                 -- 49
('Mustard', 66, 4.4, 5.0, 3.4),                      -- 50
('Walnuts', 654, 15.0, 14.0, 65.0),                  -- 51
('Almonds', 579, 21.0, 22.0, 49.0),                  -- 52
('Chocolate Chips', 479, 4.0, 65.0, 24.0),           -- 53
('Protein Powder (Whey)', 370, 80.0, 6.0, 3.0),      -- 54
('Tofu (Firm)', 144, 17.0, 3.0, 8.0);                -- 55

-- ============================================
--  3. INSERT RECIPES (Global)
--  (Macros calculated via triggers in routines.sql)
-- ============================================

-- 1. Classic Chicken & Rice
INSERT INTO Recipe (name, servings) VALUES ('Grilled Chicken & Rice', 1);
SET @r1 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r1, 1, 200, 'Chicken Breast'),
(@r1, 15, 80, 'Dry Basmati Rice'),
(@r1, 24, 100, 'Broccoli'),
(@r1, 43, 10, 'Olive Oil');

-- 2. Spaghetti Carbonara (Simplified)
INSERT INTO Recipe (name, servings) VALUES ('Spaghetti Carbonara', 2);
SET @r2 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r2, 16, 200, 'Dry Pasta'),
(@r2, 4, 100, 'Bacon'),
(@r2, 7, 100, '2 Eggs'),
(@r2, 12, 40, 'Parmesan Cheese');

-- 3. Berry Protein Smoothie
INSERT INTO Recipe (name, servings) VALUES ('Berry Protein Smoothie', 1);
SET @r3 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r3, 54, 30, 'Whey Protein Scoop'),
(@r3, 40, 80, 'Blueberries'),
(@r3, 41, 50, 'Strawberries'),
(@r3, 9, 250, 'Milk'),
(@r3, 38, 100, 'Banana');

-- 4. Beef Tacos
INSERT INTO Recipe (name, servings) VALUES ('Beef Tacos', 3);
SET @r4 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r4, 21, 180, '3 Flour Tortillas'),
(@r4, 2, 300, 'Ground Beef'),
(@r4, 10, 50, 'Cheddar Cheese'),
(@r4, 31, 50, 'Shredded Lettuce'),
(@r4, 48, 20, 'Tomato Paste for sauce');

-- 5. Avocado Toast with Egg
INSERT INTO Recipe (name, servings) VALUES ('Avocado Toast & Egg', 1);
SET @r5 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r5, 20, 80, '2 slices bread'),
(@r5, 34, 80, 'Half avocado'),
(@r5, 7, 50, '1 Egg'),
(@r5, 43, 5, 'Oil');

-- 6. Tofu Stir Fry (Vegetarian)
INSERT INTO Recipe (name, servings) VALUES ('Tofu Veggie Stir Fry', 2);
SET @r6 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r6, 55, 400, 'Firm Tofu'),
(@r6, 15, 150, 'Rice'),
(@r6, 29, 100, 'Bell Pepper'),
(@r6, 35, 100, 'Mushrooms'),
(@r6, 44, 30, 'Soy Sauce'),
(@r6, 28, 10, 'Garlic');

-- 7. Oatmeal Bowl
INSERT INTO Recipe (name, servings) VALUES ('Morning Oats', 1);
SET @r7 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r7, 17, 60, 'Rolled Oats'),
(@r7, 9, 150, 'Milk'),
(@r7, 45, 15, 'Honey'),
(@r7, 51, 20, 'Walnuts');

-- 8. Tuna Salad Sandwich
INSERT INTO Recipe (name, servings) VALUES ('Tuna Mayo Sandwich', 1);
SET @r8 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r8, 20, 80, 'Bread'),
(@r8, 5, 120, 'Canned Tuna'),
(@r8, 49, 15, 'Mayonnaise'),
(@r8, 32, 30, 'Cucumber slices');

-- 9. Pancakes
INSERT INTO Recipe (name, servings) VALUES ('Sunday Pancakes', 2);
SET @r9 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r9, 23, 150, 'Flour'),
(@r9, 9, 200, 'Milk'),
(@r9, 7, 50, 'Egg'),
(@r9, 47, 20, 'Sugar'),
(@r9, 13, 20, 'Butter for cooking');

-- 10. Roasted Salmon & Veggies
INSERT INTO Recipe (name, servings) VALUES ('Roasted Salmon Tray', 2);
SET @r10 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r10, 3, 300, 'Salmon'),
(@r10, 37, 200, 'Cauliflower'),
(@r10, 36, 150, 'Green Beans'),
(@r10, 43, 20, 'Olive Oil'),
(@r10, 42, 30, 'Lemon Juice');

-- 11. Chicken Salad
INSERT INTO Recipe (name, servings) VALUES ('Grilled Chicken Salad', 1);
SET @r11 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r11, 1, 150, 'Chicken Breast'),
(@r11, 31, 100, 'Lettuce'),
(@r11, 30, 80, 'Tomato'),
(@r11, 32, 50, 'Cucumber'),
(@r11, 43, 15, 'Olive Oil dressing');

-- 12. Greek Yogurt Bowl
INSERT INTO Recipe (name, servings) VALUES ('Yogurt & Berries', 1);
SET @r12 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r12, 8, 200, 'Greek Yogurt'),
(@r12, 40, 50, 'Blueberries'),
(@r12, 52, 15, 'Almonds'),
(@r12, 45, 10, 'Honey');

-- 13. Turkey Burger
INSERT INTO Recipe (name, servings) VALUES ('Turkey Burger (No Bun)', 1);
SET @r13 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r13, 6, 150, 'Ground Turkey'),
(@r13, 27, 30, 'Onion'),
(@r13, 7, 25, 'Half egg for binding'),
(@r13, 31, 30, 'Lettuce Wrap');

-- 14. Chocolate Chip Cookies
INSERT INTO Recipe (name, servings) VALUES ('Chewy Chocolate Chip Cookies', 12);
SET @r14 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r14, 23, 250, 'Flour'),
(@r14, 13, 150, 'Butter'),
(@r14, 47, 150, 'Sugar'),
(@r14, 53, 150, 'Chocolate Chips'),
(@r14, 7, 50, 'Egg');

-- 15. Omelette
INSERT INTO Recipe (name, servings) VALUES ('Cheese & Mushroom Omelette', 1);
SET @r15 = LAST_INSERT_ID();
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@r15, 7, 150, '3 Eggs'),
(@r15, 35, 50, 'Mushrooms'),
(@r15, 11, 30, 'Mozzarella'),
(@r15, 13, 10, 'Butter');


-- ============================================
--  4. POPULATE INVENTORY (For all 3 users)
--  Give them a "fully stocked kitchen"
-- ============================================

-- Helper variables for Inventory IDs
SET @i1 = (SELECT id FROM Inventory WHERE user_id = 1);
SET @i2 = (SELECT id FROM Inventory WHERE user_id = 2);
SET @i3 = (SELECT id FROM Inventory WHERE user_id = 3);

-- User 1 (Chef): Has almost everything
INSERT INTO Inventory_Ingredient (inventory_id, ingredient_id, qty_grams)
SELECT @i1, id, 1000 FROM Ingredients WHERE id BETWEEN 1 AND 60;

-- User 2 (Baker): Lots of flour, sugar, dairy
INSERT INTO Inventory_Ingredient (inventory_id, ingredient_id, qty_grams) VALUES
(@i2, 23, 5000), -- Flour
(@i2, 47, 2000), -- Sugar
(@i2, 13, 1000), -- Butter
(@i2, 7, 1000),  -- Eggs
(@i2, 53, 500),  -- Choco chips
(@i2, 9, 2000),  -- Milk
(@i2, 39, 1000); -- Apples

-- User 3 (Student): Basic staples
INSERT INTO Inventory_Ingredient (inventory_id, ingredient_id, qty_grams) VALUES
(@i3, 16, 2000), -- Pasta
(@i3, 15, 2000), -- Rice
(@i3, 2, 1000),  -- Beef
(@i3, 5, 500),   -- Tuna
(@i3, 20, 500),  -- Bread
(@i3, 46, 500),  -- Peanut Butter
(@i3, 48, 200);  -- Tomato Paste

-- ============================================
--  SUMMARY
-- ============================================
-- ✅ 3 Users
-- ✅ ~55 Ingredients
-- ✅ 15 Recipes (Breakfast, Lunch, Dinner, Snacks, Dessert)
-- ✅ Inventory stocked for 3 personas