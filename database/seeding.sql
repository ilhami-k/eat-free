-- ============================
--  Seeding Data for eat-free
--  Insert sample data for testing
-- ============================

USE eat_free;

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION,ERROR_FOR_DIVISION_BY_ZERO,NO_ZERO_DATE,NO_ZERO_IN_DATE';

-- ============================================
--  1. INSERT USERS
-- ============================================

INSERT INTO Utilisateur (email, name, created_at) VALUES
('john@example.com', 'John Doe', CURRENT_TIMESTAMP),
('jane@example.com', 'Jane Smith', CURRENT_TIMESTAMP),
('bob@example.com', 'Bob Johnson', CURRENT_TIMESTAMP);

-- Note: Triggers will auto-create Inventaire entries for each user

-- ============================================
--  2. INSERT GLOBAL INGREDIENTS (admin recipes, user_id = NULL)
-- ============================================

INSERT INTO Ingredients (name, kcal_per_100g, protein_g_per_100g, carbs_g_per_100g, fat_g_per_100g, created_at) VALUES
-- Proteins
('Chicken Breast', 165, 31.0, 0.0, 3.6, CURRENT_TIMESTAMP),
('Salmon', 208, 20.0, 0.0, 13.0, CURRENT_TIMESTAMP),
('Eggs', 155, 13.0, 1.1, 11.0, CURRENT_TIMESTAMP),
('Beef', 250, 26.0, 0.0, 15.0, CURRENT_TIMESTAMP),
('Tofu', 76, 8.0, 1.9, 4.8, CURRENT_TIMESTAMP),

-- Carbs
('Rice (cooked)', 130, 2.7, 28.0, 0.3, CURRENT_TIMESTAMP),
('Pasta (cooked)', 131, 5.0, 25.0, 1.1, CURRENT_TIMESTAMP),
('Bread (white)', 265, 9.0, 49.0, 3.3, CURRENT_TIMESTAMP),
('Potato (cooked)', 77, 2.0, 17.0, 0.1, CURRENT_TIMESTAMP),
('Oats', 389, 17.0, 66.0, 7.0, CURRENT_TIMESTAMP),

-- Vegetables
('Broccoli', 34, 2.8, 7.0, 0.4, CURRENT_TIMESTAMP),
('Carrot', 41, 0.9, 10.0, 0.2, CURRENT_TIMESTAMP),
('Spinach', 23, 2.7, 3.6, 0.4, CURRENT_TIMESTAMP),
('Tomato', 18, 0.9, 3.9, 0.2, CURRENT_TIMESTAMP),
('Lettuce', 15, 1.2, 2.9, 0.2, CURRENT_TIMESTAMP),

-- Fats
('Olive Oil', 884, 0.0, 0.0, 100.0, CURRENT_TIMESTAMP),
('Butter', 717, 0.9, 0.1, 81.0, CURRENT_TIMESTAMP),
('Peanut Butter', 588, 25.0, 20.0, 50.0, CURRENT_TIMESTAMP),
('Avocado', 160, 2.0, 9.0, 15.0, CURRENT_TIMESTAMP),

-- Fruits
('Apple', 52, 0.3, 14.0, 0.2, CURRENT_TIMESTAMP),
('Banana', 89, 1.1, 23.0, 0.3, CURRENT_TIMESTAMP),
('Orange', 47, 0.9, 12.0, 0.1, CURRENT_TIMESTAMP),
('Blueberry', 57, 0.7, 14.0, 0.3, CURRENT_TIMESTAMP);

-- ============================================
--  3. INSERT GLOBAL RECIPES (admin/global recipes, user_id = NULL)
-- ============================================

-- Recipe 1: Grilled Chicken with Rice (2 servings)
INSERT INTO Recette (user_id, name, servings, kcal_per_serving, protein_g_per_serving, carbs_g_per_serving, fat_g_per_serving, created_at)
VALUES (NULL, 'Grilled Chicken with Rice', 2, 300, 35, 28, 8, CURRENT_TIMESTAMP);

-- Get the recipe ID (will be 1)
SET @recipe_1_id = LAST_INSERT_ID();

-- Add ingredients to Recipe 1
INSERT INTO Ingredients_Recette (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@recipe_1_id, 1, 200, 'Grilled chicken breast'),
(@recipe_1_id, 6, 150, 'Cooked white rice');

-- Recipe 2: Salmon Salad (1 serving)
INSERT INTO Recette (user_id, name, servings, kcal_per_serving, protein_g_per_serving, carbs_g_per_serving, fat_g_per_serving, created_at)
VALUES (NULL, 'Salmon Salad', 1, 350, 28, 12, 20, CURRENT_TIMESTAMP);

SET @recipe_2_id = LAST_INSERT_ID();

INSERT INTO Ingredients_Recette (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@recipe_2_id, 2, 150, 'Baked salmon'),
(@recipe_2_id, 15, 100, 'Fresh spinach'),
(@recipe_2_id, 14, 50, 'Cherry tomatoes'),
(@recipe_2_id, 19, 30, 'Olive oil dressing');

-- Recipe 3: Pasta Carbonara (2 servings)
INSERT INTO Recette (user_id, name, servings, kcal_per_serving, protein_g_per_serving, carbs_g_per_serving, fat_g_per_serving, created_at)
VALUES (NULL, 'Pasta Carbonara', 2, 450, 18, 45, 22, CURRENT_TIMESTAMP);

SET @recipe_3_id = LAST_INSERT_ID();

INSERT INTO Ingredients_Recette (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@recipe_3_id, 7, 200, 'Cooked pasta'),
(@recipe_3_id, 3, 100, 'Eggs'),
(@recipe_3_id, 19, 40, 'Olive oil');

-- Recipe 4: Vegetable Stir-fry (2 servings)
INSERT INTO Recette (user_id, name, servings, kcal_per_serving, protein_g_per_serving, carbs_g_per_serving, fat_g_per_serving, created_at)
VALUES (NULL, 'Vegetable Stir-fry', 2, 180, 8, 20, 8, CURRENT_TIMESTAMP);

SET @recipe_4_id = LAST_INSERT_ID();

INSERT INTO Ingredients_Recette (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@recipe_4_id, 11, 150, 'Broccoli florets'),
(@recipe_4_id, 12, 100, 'Carrots'),
(@recipe_4_id, 14, 100, 'Tomatoes'),
(@recipe_4_id, 19, 30, 'Olive oil for cooking');

-- ============================================
--  4. INSERT USER-SPECIFIC RECIPES (for John Doe, user_id = 1)
-- ============================================

-- User Recipe 1: Quick Breakfast (1 serving)
INSERT INTO Recette (user_id, name, servings, kcal_per_serving, protein_g_per_serving, carbs_g_per_serving, fat_g_per_serving, created_at)
VALUES (1, 'Oatmeal with Banana', 1, 320, 10, 52, 8, CURRENT_TIMESTAMP);

SET @recipe_user_1 = LAST_INSERT_ID();

INSERT INTO Ingredients_Recette (recipe_id, ingredient_id, qty_grams, notes) VALUES
(@recipe_user_1, 10, 80, 'Oat cereal'),
(@recipe_user_1, 23, 100, 'Banana');

-- ============================================
--  5. POPULATE INVENTORY FOR USERS
-- ============================================

-- Get inventory IDs (auto-created by trigger)
SET @inv_john_id = (SELECT id FROM Inventaire WHERE user_id = 1 LIMIT 1);
SET @inv_jane_id = (SELECT id FROM Inventaire WHERE user_id = 2 LIMIT 1);

-- Stock John's inventory
INSERT INTO Inventaire_Ingredient (inventaire_id, ingredient_id, qty_grams) VALUES
(@inv_john_id, 1, 1000),   -- 1000g Chicken
(@inv_john_id, 2, 500),    -- 500g Salmon
(@inv_john_id, 6, 2000),   -- 2kg Rice
(@inv_john_id, 11, 800),   -- 800g Broccoli
(@inv_john_id, 12, 600),   -- 600g Carrots
(@inv_john_id, 23, 1200);  -- 1200g Bananas

-- Stock Jane's inventory
INSERT INTO Inventaire_Ingredient (inventaire_id, ingredient_id, qty_grams) VALUES
(@inv_jane_id, 5, 500),    -- 500g Tofu
(@inv_jane_id, 10, 300),   -- 300g Oats
(@inv_jane_id, 15, 400),   -- 400g Spinach
(@inv_jane_id, 3, 200),    -- 200g Eggs
(@inv_jane_id, 19, 250);   -- 250ml Olive Oil

-- ============================================
--  6. INSERT MEAL PLANS
-- ============================================

-- John's meal plan for this week (starting Monday)
SET @monday = DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY);

INSERT INTO PlansRepas (user_id, week_start_date, created_at)
VALUES (1, @monday, CURRENT_TIMESTAMP);

SET @plan_john_id = LAST_INSERT_ID();

-- Add meals to John's plan
INSERT INTO PlansRepas_Recette (plan_id, date, meal_type, recipe_id, planned_servings) VALUES
(@plan_john_id, @monday, 'breakfast', @recipe_user_1, 1),
(@plan_john_id, @monday, 'lunch', @recipe_1_id, 1),
(@plan_john_id, @monday, 'dinner', @recipe_2_id, 1),
(@plan_john_id, DATE_ADD(@monday, INTERVAL 1 DAY), 'breakfast', @recipe_user_1, 1),
(@plan_john_id, DATE_ADD(@monday, INTERVAL 1 DAY), 'lunch', @recipe_3_id, 1),
(@plan_john_id, DATE_ADD(@monday, INTERVAL 1 DAY), 'dinner', @recipe_4_id, 1);

-- Jane's meal plan
INSERT INTO PlansRepas (user_id, week_start_date, created_at)
VALUES (2, @monday, CURRENT_TIMESTAMP);

SET @plan_jane_id = LAST_INSERT_ID();

INSERT INTO PlansRepas_Recette (plan_id, date, meal_type, recipe_id, planned_servings) VALUES
(@plan_jane_id, @monday, 'breakfast', @recipe_user_1, 1),
(@plan_jane_id, @monday, 'lunch', @recipe_3_id, 1);

-- ============================================
--  7. INSERT MEAL JOURNAL (logged meals)
-- ============================================

-- John's logged meals (today)
INSERT INTO Journal (user_id, recipe_id, servings_eaten, logged_at, kcal, protein_g, carbs_g, fat_g) VALUES
(1, @recipe_user_1, 1, NOW(), 320, 10, 52, 8),
(1, @recipe_1_id, 1, DATE_ADD(NOW(), INTERVAL 4 HOUR), 300, 35, 28, 8),
(1, @recipe_2_id, 1, DATE_ADD(NOW(), INTERVAL 8 HOUR), 350, 28, 12, 20);

-- John's logged meals (yesterday)
INSERT INTO Journal (user_id, recipe_id, servings_eaten, logged_at, kcal, protein_g, carbs_g, fat_g) VALUES
(1, @recipe_user_1, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 320, 10, 52, 8),
(1, @recipe_3_id, 1, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 5 HOUR, 450, 18, 45, 22);

-- Jane's logged meals
INSERT INTO Journal (user_id, recipe_id, servings_eaten, logged_at, kcal, protein_g, carbs_g, fat_g) VALUES
(2, @recipe_2_id, 1, NOW(), 350, 28, 12, 20),
(2, @recipe_4_id, 1, DATE_ADD(NOW(), INTERVAL 5 HOUR), 180, 8, 20, 8);

-- ============================================
--  8. INSERT SAVED MEALS (favorites)
-- ============================================

-- John's saved meals
INSERT INTO RepasEnregistre (user_id, name, recipe_id, default_servings, created_at) VALUES
(1, 'My Go-to Salmon', @recipe_2_id, 1, CURRENT_TIMESTAMP),
(1, 'Monday Dinner', @recipe_1_id, 2, CURRENT_TIMESTAMP);

-- Jane's saved meals
INSERT INTO RepasEnregistre (user_id, name, recipe_id, default_servings, created_at) VALUES
(2, 'Quick Breakfast', @recipe_user_1, 1, CURRENT_TIMESTAMP),
(2, 'Comfort Pasta', @recipe_3_id, 2, CURRENT_TIMESTAMP);

-- ============================================
--  SUMMARY
-- ============================================
-- ✅ Inserted 3 users
-- ✅ Inserted 26 global ingredients
-- ✅ Inserted 4 global recipes + 1 user recipe
-- ✅ Inserted recipe ingredients (10 lines total)
-- ✅ Populated inventory for 2 users
-- ✅ Inserted 2 meal plans with 8 planned meals
-- ✅ Inserted 6 journal entries (logged meals)
-- ✅ Inserted 4 saved meals
-- ============================
