-- ============================
--  Testing Inner Joins & Functions
--  Verify database integrity and all relationships work correctly
-- ============================

USE eat_free;

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ============================================
--  SECTION 1: TEST USERS & BASIC SELECTS
-- ============================================

-- Test 1.1: Verify all users exist
SELECT '1.1 All Users' AS test_name;
SELECT id, email, name, created_at FROM Utilisateur ORDER BY id;

-- Test 1.2: Verify inventory was auto-created for all users
SELECT '1.2 Inventory Auto-Created for Users' AS test_name;
SELECT i.id, i.user_id, u.email, u.name
FROM Inventaire i
JOIN Utilisateur u ON u.id = i.user_id
ORDER BY i.id;

-- ============================================
--  SECTION 2: TEST INGREDIENTS
-- ============================================

-- Test 2.1: Verify ingredients were inserted
SELECT '2.1 Global Ingredients Count' AS test_name;
SELECT COUNT(*) AS ingredient_count FROM Ingredients;

-- Test 2.2: Show all ingredients with nutrition values
SELECT '2.2 All Ingredients' AS test_name;
SELECT id, name, kcal_per_100g, protein_g_per_100g, carbs_g_per_100g, fat_g_per_100g
FROM Ingredients
ORDER BY id;

-- Test 2.3: Find high-calorie ingredients
SELECT '2.3 High-Calorie Ingredients (>400 kcal/100g)' AS test_name;
SELECT id, name, kcal_per_100g
FROM Ingredients
WHERE kcal_per_100g > 400
ORDER BY kcal_per_100g DESC;

-- ============================================
--  SECTION 3: TEST RECIPES & INNER JOINS
-- ============================================

-- Test 3.1: All recipes (global and user-specific)
SELECT '3.1 All Recipes with User Info' AS test_name;
SELECT r.id, r.name, COALESCE(u.name, 'GLOBAL') AS owner,
       r.servings, r.kcal_per_serving, r.protein_g_per_serving, r.carbs_g_per_serving, r.fat_g_per_serving
FROM Recette r
LEFT JOIN Utilisateur u ON u.id = r.user_id
ORDER BY r.user_id DESC, r.id;

-- Test 3.2: Recipe composition (ingredients_recette inner join)
SELECT '3.2 Recipe Composition - All Recipes with Ingredients' AS test_name;
SELECT r.id AS recipe_id, r.name AS recipe_name, i.id AS ingredient_id, i.name AS ingredient_name,
       ir.qty_grams, i.kcal_per_100g,
       (i.kcal_per_100g * ir.qty_grams / 100) AS ingredient_kcal,
       ir.notes
FROM Recette r
INNER JOIN Ingredients_Recette ir ON ir.recipe_id = r.id
INNER JOIN Ingredients i ON i.id = ir.ingredient_id
ORDER BY r.id, i.name;

-- Test 3.3: Verify recipe cache was calculated correctly
SELECT '3.3 Recipe Cache Validation' AS test_name;
SELECT r.id, r.name, r.servings,
       r.kcal_per_serving, r.protein_g_per_serving, r.carbs_g_per_serving, r.fat_g_per_serving,
       -- Calculate expected totals
       ROUND(SUM((ing.kcal_per_100g * ir.qty_grams) / 100) / r.servings, 2) AS calc_kcal_per_serving,
       ROUND(SUM((ing.protein_g_per_100g * ir.qty_grams) / 100) / r.servings, 2) AS calc_protein_per_serving,
       ROUND(SUM((ing.carbs_g_per_100g * ir.qty_grams) / 100) / r.servings, 2) AS calc_carbs_per_serving,
       ROUND(SUM((ing.fat_g_per_100g * ir.qty_grams) / 100) / r.servings, 2) AS calc_fat_per_serving
FROM Recette r
LEFT JOIN Ingredients_Recette ir ON ir.recipe_id = r.id
LEFT JOIN Ingredients ing ON ing.id = ir.ingredient_id
GROUP BY r.id
ORDER BY r.id;

-- Test 3.4: Global recipes only
SELECT '3.4 Global (Admin) Recipes Only' AS test_name;
SELECT id, name, servings, kcal_per_serving, protein_g_per_serving, carbs_g_per_serving, fat_g_per_serving
FROM Recette
WHERE user_id IS NULL
ORDER BY id;

-- Test 3.5: User-specific recipes
SELECT '3.5 User-Specific Recipes' AS test_name;
SELECT r.id, r.name, u.name AS user_name, r.servings,
       r.kcal_per_serving, r.protein_g_per_serving, r.carbs_g_per_serving, r.fat_g_per_serving
FROM Recette r
JOIN Utilisateur u ON u.id = r.user_id
ORDER BY u.id, r.id;

-- ============================================
--  SECTION 4: TEST INVENTORY & INVENTORY_INGREDIENT
-- ============================================

-- Test 4.1: User inventories with ingredient counts
SELECT '4.1 User Inventories with Ingredient Count' AS test_name;
SELECT i.id, u.name AS user_name, COUNT(ii.ingredient_id) AS ingredient_count, COUNT(ii.ingredient_id) > 0 AS has_stock
FROM Inventaire i
JOIN Utilisateur u ON u.id = i.user_id
LEFT JOIN Inventaire_Ingredient ii ON ii.inventaire_id = i.id
GROUP BY i.id, u.name
ORDER BY i.id;

-- Test 4.2: Inventory contents (full details)
SELECT '4.2 Inventory Contents with Ingredient Details' AS test_name;
SELECT i.id AS inventory_id, u.name AS user_name,
       ing.id AS ingredient_id, ing.name, ii.qty_grams,
       (ii.qty_grams * ing.kcal_per_100g / 100) AS kcal_in_stock
FROM Inventaire i
JOIN Utilisateur u ON u.id = i.user_id
LEFT JOIN Inventaire_Ingredient ii ON ii.inventaire_id = i.id
LEFT JOIN Ingredients ing ON ing.id = ii.ingredient_id
ORDER BY i.id, ing.name;

-- Test 4.3: Total stock value per user (in kcal)
SELECT '4.3 Total Inventory Value per User' AS test_name;
SELECT u.id, u.name,
       COUNT(ii.ingredient_id) AS unique_ingredients,
       COALESCE(SUM(ii.qty_grams), 0) AS total_grams,
       COALESCE(ROUND(SUM(ii.qty_grams * ing.kcal_per_100g / 100), 2), 0) AS total_kcal,
       COALESCE(ROUND(SUM(ii.qty_grams * ing.protein_g_per_100g / 100), 2), 0) AS total_protein_g,
       COALESCE(ROUND(SUM(ii.qty_grams * ing.carbs_g_per_100g / 100), 2), 0) AS total_carbs_g,
       COALESCE(ROUND(SUM(ii.qty_grams * ing.fat_g_per_100g / 100), 2), 0) AS total_fat_g
FROM Utilisateur u
LEFT JOIN Inventaire i ON i.user_id = u.id
LEFT JOIN Inventaire_Ingredient ii ON ii.inventaire_id = i.id
LEFT JOIN Ingredients ing ON ing.id = ii.ingredient_id
GROUP BY u.id, u.name
ORDER BY total_kcal DESC;

-- ============================================
--  SECTION 5: TEST MEAL PLANS
-- ============================================

-- Test 5.1: All meal plans with user info
SELECT '5.1 All Meal Plans' AS test_name;
SELECT p.id, u.name AS user_name, p.week_start_date, p.created_at,
       DATE_ADD(p.week_start_date, INTERVAL 6 DAY) AS week_end_date
FROM PlansRepas p
JOIN Utilisateur u ON u.id = p.user_id
ORDER BY p.week_start_date DESC, u.name;

-- Test 5.2: Meal plan details (planned meals)
SELECT '5.2 Detailed Meal Plan Contents' AS test_name;
SELECT p.id AS plan_id, u.name AS user_name, p.week_start_date,
       pr.date, pr.meal_type,
       r.name AS recipe_name, pr.planned_servings,
       r.kcal_per_serving, pr.planned_servings * r.kcal_per_serving AS meal_kcal
FROM PlansRepas p
JOIN Utilisateur u ON u.id = p.user_id
LEFT JOIN PlansRepas_Recette pr ON pr.plan_id = p.id
LEFT JOIN Recette r ON r.id = pr.recipe_id
ORDER BY p.id, pr.date, FIELD(pr.meal_type, 'breakfast', 'lunch', 'dinner', 'snack');

-- Test 5.3: Daily plan totals
SELECT '5.3 Daily Meal Plan Totals' AS test_name;
SELECT p.id AS plan_id, u.name AS user_name, pr.date,
       COUNT(*) AS meal_count,
       SUM(pr.planned_servings * r.kcal_per_serving) AS day_kcal,
       SUM(pr.planned_servings * r.protein_g_per_serving) AS day_protein_g,
       SUM(pr.planned_servings * r.carbs_g_per_serving) AS day_carbs_g,
       SUM(pr.planned_servings * r.fat_g_per_serving) AS day_fat_g
FROM PlansRepas p
JOIN Utilisateur u ON u.id = p.user_id
LEFT JOIN PlansRepas_Recette pr ON pr.plan_id = p.id
LEFT JOIN Recette r ON r.id = pr.recipe_id
GROUP BY p.id, u.name, pr.date
ORDER BY p.id, pr.date;

-- ============================================
--  SECTION 6: TEST JOURNAL (MEAL LOG)
-- ============================================

-- Test 6.1: All logged meals
SELECT '6.1 All Logged Meals' AS test_name;
SELECT j.id, u.name AS user_name, r.name AS recipe_name, j.servings_eaten,
       j.kcal, j.protein_g, j.carbs_g, j.fat_g, j.logged_at
FROM Journal j
JOIN Utilisateur u ON u.id = j.user_id
JOIN Recette r ON r.id = j.recipe_id
ORDER BY j.logged_at DESC;

-- Test 6.2: Daily nutrition summary
SELECT '6.2 Daily Nutrition Summary' AS test_name;
SELECT DATE(j.logged_at) AS log_date, u.name AS user_name,
       COUNT(*) AS meals_logged,
       SUM(j.kcal) AS total_kcal,
       SUM(j.protein_g) AS total_protein_g,
       SUM(j.carbs_g) AS total_carbs_g,
       SUM(j.fat_g) AS total_fat_g
FROM Journal j
JOIN Utilisateur u ON u.id = j.user_id
GROUP BY DATE(j.logged_at), u.name
ORDER BY log_date DESC, u.name;

-- Test 6.3: User meal history (last 7 days)
SELECT '6.3 User Meal History (Last 7 Days)' AS test_name;
SELECT u.id, u.name,
       COUNT(*) AS meals_logged,
       MIN(j.logged_at) AS first_meal,
       MAX(j.logged_at) AS last_meal,
       ROUND(AVG(j.kcal), 2) AS avg_meal_kcal,
       SUM(j.kcal) AS total_kcal
FROM Utilisateur u
LEFT JOIN Journal j ON j.user_id = u.id AND j.logged_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY u.id, u.name
ORDER BY total_kcal DESC;

-- Test 6.4: Meals logged today
SELECT '6.4 Meals Logged Today' AS test_name;
SELECT u.name, r.name AS recipe, j.servings_eaten,
       j.kcal, j.protein_g, j.carbs_g, j.fat_g,
       TIME(j.logged_at) AS log_time
FROM Journal j
JOIN Utilisateur u ON u.id = j.user_id
JOIN Recette r ON r.id = j.recipe_id
WHERE DATE(j.logged_at) = CURDATE()
ORDER BY j.logged_at;

-- ============================================
--  SECTION 7: TEST SAVED MEALS
-- ============================================

-- Test 7.1: All saved meals
SELECT '7.1 All Saved Meals' AS test_name;
SELECT sr.id, u.name AS user_name, sr.name AS saved_name, r.name AS recipe_name,
       sr.default_servings, r.kcal_per_serving, sr.created_at
FROM RepasEnregistre sr
JOIN Utilisateur u ON u.id = sr.user_id
JOIN Recette r ON r.id = sr.recipe_id
ORDER BY sr.user_id, sr.name;

-- Test 7.2: Saved meals with computed nutrition
SELECT '7.2 Saved Meals with Default Nutrition' AS test_name;
SELECT sr.id, u.name AS user_name, sr.name,
       r.name AS recipe_name, sr.default_servings,
       ROUND(sr.default_servings * r.kcal_per_serving, 2) AS default_kcal,
       ROUND(sr.default_servings * r.protein_g_per_serving, 2) AS default_protein_g,
       ROUND(sr.default_servings * r.carbs_g_per_serving, 2) AS default_carbs_g,
       ROUND(sr.default_servings * r.fat_g_per_serving, 2) AS default_fat_g
FROM RepasEnregistre sr
JOIN Utilisateur u ON u.id = sr.user_id
JOIN Recette r ON r.id = sr.recipe_id
ORDER BY u.name, sr.name;

-- ============================================
--  SECTION 8: TEST STORED FUNCTIONS & PROCEDURES
-- ============================================

-- Test 8.1: Test week_start_monday function
SELECT '8.1 Week Start Monday Function Test' AS test_name;
SELECT CURDATE() AS today,
       week_start_monday(CURDATE()) AS monday_this_week,
       week_start_monday(DATE_ADD(CURDATE(), INTERVAL 5 DAY)) AS monday_next_week,
       week_start_monday(DATE_SUB(CURDATE(), INTERVAL 10 DAY)) AS monday_2weeks_ago;

-- Test 8.2: Test recalc_recipe_cache (should already be done on insert, verify results)
SELECT '8.2 Recipe Cache Calculation Verification' AS test_name;
SELECT r.id, r.name, r.servings,
       COUNT(ir.ingredient_id) AS ingredient_count,
       ROUND(SUM((i.kcal_per_100g * ir.qty_grams) / 100), 2) AS total_kcal,
       ROUND(SUM((i.kcal_per_100g * ir.qty_grams) / 100) / r.servings, 2) AS kcal_per_serving_calc,
       r.kcal_per_serving AS kcal_per_serving_stored
FROM Recette r
LEFT JOIN Ingredients_Recette ir ON ir.recipe_id = r.id
LEFT JOIN Ingredients i ON i.id = ir.ingredient_id
GROUP BY r.id
HAVING ingredient_count > 0
ORDER BY r.id;

-- ============================================
--  SECTION 9: COMPLEX MULTI-TABLE JOINS
-- ============================================

-- Test 9.1: User complete profile with related data
SELECT '9.1 User Complete Profile' AS test_name;
SELECT
  u.id AS user_id,
  u.email,
  u.name,
  (SELECT COUNT(*) FROM Recette WHERE user_id = u.id) AS user_recipes_count,
  (SELECT COUNT(*) FROM Journal WHERE user_id = u.id) AS meals_logged_count,
  (SELECT COUNT(*) FROM PlansRepas WHERE user_id = u.id) AS meal_plans_count,
  (SELECT COUNT(*) FROM RepasEnregistre WHERE user_id = u.id) AS saved_meals_count,
  (SELECT COALESCE(SUM(qty_grams), 0) FROM Inventaire_Ingredient ii WHERE ii.inventaire_id = i.id) AS inventory_grams,
  u.created_at
FROM Utilisateur u
LEFT JOIN Inventaire i ON i.user_id = u.id
ORDER BY u.id;

-- Test 9.2: Complex join - Find recipes with all their related data
SELECT '9.2 Recipes with Complete Details' AS test_name;
SELECT
  r.id,
  r.name,
  COALESCE(u.name, 'GLOBAL') AS owner,
  COUNT(ir.ingredient_id) AS ingredient_count,
  COUNT(DISTINCT pr.plan_id) AS used_in_plans,
  COUNT(DISTINCT j.id) AS times_logged,
  r.kcal_per_serving,
  r.protein_g_per_serving,
  r.carbs_g_per_serving,
  r.fat_g_per_serving
FROM Recette r
LEFT JOIN Utilisateur u ON u.id = r.user_id
LEFT JOIN Ingredients_Recette ir ON ir.recipe_id = r.id
LEFT JOIN PlansRepas_Recette pr ON pr.recipe_id = r.id
LEFT JOIN Journal j ON j.recipe_id = r.id
GROUP BY r.id
ORDER BY times_logged DESC, r.name;

-- Test 9.3: Ingredient usage across all recipes
SELECT '9.3 Ingredient Usage in Recipes' AS test_name;
SELECT
  i.id,
  i.name,
  COUNT(DISTINCT ir.recipe_id) AS used_in_recipes,
  SUM(ir.qty_grams) AS total_qty_used,
  COUNT(DISTINCT ii.inventaire_id) AS in_inventories,
  COUNT(DISTINCT j.id) AS in_logged_meals
FROM Ingredients i
LEFT JOIN Ingredients_Recette ir ON ir.ingredient_id = i.id
LEFT JOIN Inventaire_Ingredient ii ON ii.ingredient_id = i.id
LEFT JOIN Journal j ON j.recipe_id IN (SELECT recipe_id FROM Ingredients_Recette WHERE ingredient_id = i.id)
GROUP BY i.id
HAVING used_in_recipes > 0 OR in_inventories > 0
ORDER BY used_in_recipes DESC;

-- Test 9.4: This week's meal plan vs journal (plan vs actual)
SELECT '9.4 This Week: Plan vs Actual (User: John)' AS test_name;
SET @john_id = 1;
SET @week_start = week_start_monday(CURDATE());

SELECT
  DATE(pr.date) AS meal_date,
  DAYNAME(pr.date) AS day_name,
  pr.meal_type,
  r.name AS recipe_name,
  pr.planned_servings AS planned_servings,
  (SELECT COUNT(*) FROM Journal WHERE user_id = @john_id AND recipe_id = r.id AND DATE(logged_at) = pr.date) AS actual_times_logged,
  (SELECT SUM(servings_eaten) FROM Journal WHERE user_id = @john_id AND recipe_id = r.id AND DATE(logged_at) = pr.date) AS actual_servings_eaten,
  ROUND(pr.planned_servings * r.kcal_per_serving, 0) AS planned_kcal,
  (SELECT ROUND(SUM(kcal), 0) FROM Journal WHERE user_id = @john_id AND recipe_id = r.id AND DATE(logged_at) = pr.date) AS actual_kcal
FROM PlansRepas p
LEFT JOIN PlansRepas_Recette pr ON pr.plan_id = p.id
LEFT JOIN Recette r ON r.id = pr.recipe_id
WHERE p.user_id = @john_id AND p.week_start_date = @week_start
ORDER BY pr.date, FIELD(pr.meal_type, 'breakfast', 'lunch', 'dinner', 'snack');

-- ============================================
--  SECTION 10: DATA INTEGRITY CHECKS
-- ============================================

-- Test 10.1: Orphaned records check
SELECT '10.1 Data Integrity - Orphaned Records' AS test_name;

-- Check for journals referencing non-existent users
SELECT 'Journal -> Utilisateur orphans' AS check_type, COUNT(*) AS count
FROM Journal j
WHERE NOT EXISTS (SELECT 1 FROM Utilisateur WHERE id = j.user_id)
UNION ALL
-- Check for journals referencing non-existent recipes
SELECT 'Journal -> Recette orphans', COUNT(*)
FROM Journal j
WHERE NOT EXISTS (SELECT 1 FROM Recette WHERE id = j.recipe_id)
UNION ALL
-- Check for inventory referencing non-existent users
SELECT 'Inventaire -> Utilisateur orphans', COUNT(*)
FROM Inventaire i
WHERE NOT EXISTS (SELECT 1 FROM Utilisateur WHERE id = i.user_id)
UNION ALL
-- Check for inventory_ingredient referencing non-existent inventories
SELECT 'Inventaire_Ingredient -> Inventaire orphans', COUNT(*)
FROM Inventaire_Ingredient ii
WHERE NOT EXISTS (SELECT 1 FROM Inventaire WHERE id = ii.inventaire_id)
UNION ALL
-- Check for inventory_ingredient referencing non-existent ingredients
SELECT 'Inventaire_Ingredient -> Ingredients orphans', COUNT(*)
FROM Inventaire_Ingredient ii
WHERE NOT EXISTS (SELECT 1 FROM Ingredients WHERE id = ii.ingredient_id);

-- Test 10.2: Constraint violations (should all be 0 if data is clean)
SELECT '10.2 Constraint Violations Check' AS test_name;

SELECT 'Negative inventory qty' AS violation_type, COUNT(*) AS count
FROM Inventaire_Ingredient
WHERE qty_grams < 0
UNION ALL
SELECT 'Invalid servings (zero or negative)', COUNT(*)
FROM Recette
WHERE servings <= 0
UNION ALL
SELECT 'Negative qty in recipe', COUNT(*)
FROM Ingredients_Recette
WHERE qty_grams < 0
UNION ALL
SELECT 'Zero or negative servings eaten', COUNT(*)
FROM Journal
WHERE servings_eaten <= 0;

-- Test 10.3: Summary statistics
SELECT '10.3 Database Summary Statistics' AS test_name;
SELECT
  'Utilisateur' AS table_name, COUNT(*) AS record_count FROM Utilisateur
UNION ALL SELECT 'Ingredients', COUNT(*) FROM Ingredients
UNION ALL SELECT 'Recette', COUNT(*) FROM Recette
UNION ALL SELECT 'Ingredients_Recette', COUNT(*) FROM Ingredients_Recette
UNION ALL SELECT 'Inventaire', COUNT(*) FROM Inventaire
UNION ALL SELECT 'Inventaire_Ingredient', COUNT(*) FROM Inventaire_Ingredient
UNION ALL SELECT 'PlansRepas', COUNT(*) FROM PlansRepas
UNION ALL SELECT 'PlansRepas_Recette', COUNT(*) FROM PlansRepas_Recette
UNION ALL SELECT 'Journal', COUNT(*) FROM Journal
UNION ALL SELECT 'RepasEnregistre', COUNT(*) FROM RepasEnregistre
ORDER BY record_count DESC;

-- ============================================
--  SECTION 11: PERFORMANCE & INDEXING CHECKS
-- ============================================

-- Test 11.1: Show indexes on all tables
SELECT '11.1 Index Analysis' AS test_name;
SELECT
  TABLE_NAME,
  INDEX_NAME,
  COLUMN_NAME,
  SEQ_IN_INDEX,
  NON_UNIQUE
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'eat_free'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- Test 11.2: Query examples that should use indexes
SELECT '11.2 Indexed Query Examples (Should be fast)' AS test_name;

-- Example 1: Get user by email (indexed)
SELECT 'Find user by email' AS query_type, COUNT(*) AS result_count
FROM Utilisateur WHERE email = 'john@example.com';

-- Example 2: Get all recipes for a user (indexed)
SELECT 'User recipes', COUNT(*)
FROM Recette WHERE user_id = 1;

-- Example 3: Get journal for user by date range (indexed)
SELECT 'User journal by date', COUNT(*)
FROM Journal WHERE user_id = 1 AND logged_at >= NOW() - INTERVAL 7 DAY;

-- ============================================
--  END OF TESTING SUITE
-- ============================================

SELECT '========================================' AS test_complete;
SELECT 'All tests completed successfully!' AS message;
SELECT 'Review results above for any issues.' AS note;
