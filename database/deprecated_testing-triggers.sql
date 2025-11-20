-- ============================
--  TRIGGER TESTING SUITE
-- ============================
USE eat_free;

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ============================
-- TEST 1: Inventory Auto-Creation Trigger
-- ============================
-- Tests: trg_user_after_insert_inventory
-- Expected: Inventory is automatically created when a user is inserted

DROP PROCEDURE IF EXISTS test_inventory_auto_creation;

DELIMITER $$
CREATE PROCEDURE test_inventory_auto_creation()
BEGIN
  DECLARE v_test_passed BOOLEAN DEFAULT FALSE;
  DECLARE v_inventory_count INT;
  DECLARE v_user_id BIGINT;

  -- Clean up any previous test data
  DELETE FROM User WHERE email = 'test-inventory-trigger@example.com';

  -- Insert a new user
  INSERT INTO User(email, name) VALUES ('test-inventory-trigger@example.com', 'Inventory Trigger Test');
  SET v_user_id = LAST_INSERT_ID();

  -- Check if inventory was created
  SELECT COUNT(*) INTO v_inventory_count
  FROM Inventory
  WHERE user_id = v_user_id;

  IF v_inventory_count = 1 THEN
    SELECT CONCAT('✓ TEST 1 PASSED: Inventory auto-created for user ', v_user_id) AS test_result;
    SET v_test_passed = TRUE;
  ELSE
    SELECT CONCAT('✗ TEST 1 FAILED: Expected 1 inventory, got ', v_inventory_count) AS test_result;
  END IF;

  -- Display the created inventory
  SELECT 'Created Inventory:' AS info;
  SELECT * FROM Inventory WHERE user_id = v_user_id;
END $$
DELIMITER ;
-- Run Test 1
CALL test_inventory_auto_creation();

-- ============================
-- TEST 2: Meal Plan Date Normalization - INSERT
-- ============================
-- Tests: trg_plan_before_insert_monday
-- Expected: Dates are normalized to Monday (WEEKDAY = 0)

DROP PROCEDURE IF EXISTS test_meal_plan_normalize_insert;

DELIMITER $$
CREATE PROCEDURE test_meal_plan_normalize_insert()
BEGIN
  DECLARE v_test_passed BOOLEAN DEFAULT FALSE;
  DECLARE v_stored_date DATE;
  DECLARE v_expected_date DATE;
  DECLARE v_user_id BIGINT;
  DECLARE v_test_date DATE;

  -- Create test user if needed
  DELETE FROM User WHERE email = 'test-meal-plan-norm@example.com';
  INSERT INTO User(email, name) VALUES ('test-meal-plan-norm@example.com', 'Meal Plan Normalization Test');
  SET v_user_id = LAST_INSERT_ID();

  -- Test with a Wednesday date: 2025-11-12 (WEEKDAY = 2)
  SET v_test_date = '2025-11-12';
  SET v_expected_date = '2025-11-10';  -- Should normalize to Monday

  -- Delete any existing meal plan for this user
  DELETE FROM Meal_Plan WHERE user_id = v_user_id;

  -- Insert with Wednesday date
  INSERT INTO Meal_Plan(user_id, week_start_date) VALUES (v_user_id, v_test_date);

  -- Retrieve the stored date
  SELECT week_start_date INTO v_stored_date
  FROM Meal_Plan
  WHERE user_id = v_user_id AND week_start_date = v_expected_date;

  IF v_stored_date = v_expected_date THEN
    SELECT CONCAT('✓ TEST 2 PASSED: Date normalized to Monday (', v_expected_date, ')') AS test_result;
    SET v_test_passed = TRUE;
  ELSE
    SELECT CONCAT('✗ TEST 2 FAILED: Expected ', v_expected_date, ', got ', COALESCE(v_stored_date, 'NULL')) AS test_result;
  END IF;

  -- Display the meal plan
  SELECT 'Meal Plan Entry:' AS info;
  SELECT user_id, week_start_date, DAYNAME(week_start_date) AS day_name FROM Meal_Plan WHERE user_id = v_user_id;
END $$
DELIMITER ;
-- Run Test 2
CALL test_meal_plan_normalize_insert();

-- ============================
-- TEST 3: Meal Plan Date Normalization - UPDATE
-- ============================
-- Tests: trg_plan_before_update_monday
-- Expected: Dates are normalized to Monday on UPDATE

DROP PROCEDURE IF EXISTS test_meal_plan_normalize_update;

DELIMITER $$
CREATE PROCEDURE test_meal_plan_normalize_update()
BEGIN
  DECLARE v_test_passed BOOLEAN DEFAULT FALSE;
  DECLARE v_stored_date DATE;
  DECLARE v_expected_date DATE;
  DECLARE v_user_id BIGINT;
  DECLARE v_update_date DATE;

  -- Create test user if needed
  DELETE FROM User WHERE email = 'test-meal-plan-upd@example.com';
  INSERT INTO User(email, name) VALUES ('test-meal-plan-upd@example.com', 'Meal Plan Update Test');
  SET v_user_id = LAST_INSERT_ID();

  -- Delete any existing meal plan for this user
  DELETE FROM Meal_Plan WHERE user_id = v_user_id;

  -- Insert initial meal plan with Monday
  INSERT INTO Meal_Plan(user_id, week_start_date) VALUES (v_user_id, '2025-11-10');

  -- Update with a Friday date: 2025-11-14 (WEEKDAY = 4)
  SET v_update_date = '2025-11-14';
  SET v_expected_date = '2025-11-10';  -- Should normalize to Monday

  UPDATE Meal_Plan
  SET week_start_date = v_update_date
  WHERE user_id = v_user_id;

  -- Retrieve the stored date
  SELECT week_start_date INTO v_stored_date
  FROM Meal_Plan
  WHERE user_id = v_user_id;

  IF v_stored_date = v_expected_date THEN
    SELECT CONCAT('✓ TEST 3 PASSED: Updated date normalized to Monday (', v_expected_date, ')') AS test_result;
    SET v_test_passed = TRUE;
  ELSE
    SELECT CONCAT('✗ TEST 3 FAILED: Expected ', v_expected_date, ', got ', COALESCE(v_stored_date, 'NULL')) AS test_result;
  END IF;

  -- Display the meal plan
  SELECT 'Updated Meal Plan Entry:' AS info;
  SELECT user_id, week_start_date, DAYNAME(week_start_date) AS day_name FROM Meal_Plan WHERE user_id = v_user_id;
END $$
DELIMITER ;
-- Run Test 3
CALL test_meal_plan_normalize_update();

-- ============================
-- TEST 4: Recipe Nutrition Cache - INSERT
-- ============================
-- Tests: trg_ir_after_insert_recalc
-- Expected: Recipe nutrition values are recalculated when ingredients are added

DROP PROCEDURE IF EXISTS test_recipe_cache_insert;

DELIMITER $$
CREATE PROCEDURE test_recipe_cache_insert()
BEGIN
  DECLARE v_test_passed BOOLEAN DEFAULT FALSE;
  DECLARE v_kcal_per_serving DECIMAL(10,2);
  DECLARE v_user_id BIGINT;
  DECLARE v_recipe_id BIGINT;
  DECLARE v_ing_id BIGINT;
  DECLARE v_expected_kcal DECIMAL(10,2);

  -- Create test user
  DELETE FROM User WHERE email = 'test-recipe-cache@example.com';
  INSERT INTO User(email, name) VALUES ('test-recipe-cache@example.com', 'Recipe Cache Test');
  SET v_user_id = LAST_INSERT_ID();

  -- Create test recipe with 2 servings
  DELETE FROM Recipe WHERE user_id = v_user_id AND name = 'Cache Test Recipe';
  INSERT INTO Recipe(user_id, name, servings) VALUES (v_user_id, 'Cache Test Recipe', 2.00);
  SET v_recipe_id = LAST_INSERT_ID();

  -- Create or get test ingredient (Chicken Breast: 165 kcal per 100g)
  INSERT IGNORE INTO Ingredients(name, kcal_per_100g, protein_g_per_100g, carbs_g_per_100g, fat_g_per_100g)
  VALUES ('Chicken Breast', 165, 31, 0, 3.6);
  SELECT id INTO v_ing_id FROM Ingredients WHERE name = 'Chicken Breast' LIMIT 1;

  -- Verify recipe has 0 nutrition values before adding ingredients
  SELECT kcal_per_serving INTO v_kcal_per_serving
  FROM Recipe WHERE id = v_recipe_id;

  IF v_kcal_per_serving = 0 THEN
    SELECT '✓ Recipe starts with 0 kcal per serving' AS debug_info;
  END IF;

  -- Add ingredient to recipe: 200g of chicken
  -- Expected kcal: (165 * 200 / 100) / 2 servings = 330 / 2 = 165 kcal per serving
  DELETE FROM Recipe_Ingredients WHERE recipe_id = v_recipe_id;
  INSERT INTO Recipe_Ingredients(recipe_id, ingredient_id, qty_grams)
  VALUES (v_recipe_id, v_ing_id, 200);

  -- Retrieve and check recalculated values
  SELECT kcal_per_serving INTO v_kcal_per_serving
  FROM Recipe WHERE id = v_recipe_id;

  SET v_expected_kcal = 165;  -- (165 * 200 / 100) / 2 = 165

  IF v_kcal_per_serving = v_expected_kcal THEN
    SELECT CONCAT('✓ TEST 4 PASSED: Recipe nutrition recalculated (', v_kcal_per_serving, ' kcal per serving)') AS test_result;
    SET v_test_passed = TRUE;
  ELSE
    SELECT CONCAT('✗ TEST 4 FAILED: Expected ', v_expected_kcal, ' kcal, got ', v_kcal_per_serving) AS test_result;
  END IF;

  -- Display the recipe and ingredients
  SELECT 'Recipe with Calculated Nutrition:' AS info;
  SELECT id, name, servings, kcal_per_serving, protein_g_per_serving, carbs_g_per_serving, fat_g_per_serving
  FROM Recipe WHERE id = v_recipe_id;

  SELECT 'Recipe Ingredients:' AS info;
  SELECT ri.recipe_id, ri.ingredient_id, ing.name, ri.qty_grams
  FROM Recipe_Ingredients ri
  JOIN Ingredients ing ON ing.id = ri.ingredient_id
  WHERE ri.recipe_id = v_recipe_id;
END $$
DELIMITER ;
-- Run Test 4
CALL test_recipe_cache_insert();

-- ============================
-- TEST 5: Recipe Nutrition Cache - UPDATE
-- ============================
-- Tests: trg_ir_after_update_recalc
-- Expected: Recipe nutrition values are recalculated when ingredients are updated

DROP PROCEDURE IF EXISTS test_recipe_cache_update;

DELIMITER $$
CREATE PROCEDURE test_recipe_cache_update()
BEGIN
  DECLARE v_test_passed BOOLEAN DEFAULT FALSE;
  DECLARE v_kcal_per_serving DECIMAL(10,2);
  DECLARE v_user_id BIGINT;
  DECLARE v_recipe_id BIGINT;
  DECLARE v_ing_id BIGINT;
  DECLARE v_expected_kcal DECIMAL(10,2);

  -- Create test user
  DELETE FROM User WHERE email = 'test-recipe-update@example.com';
  INSERT INTO User(email, name) VALUES ('test-recipe-update@example.com', 'Recipe Update Test');
  SET v_user_id = LAST_INSERT_ID();

  -- Create test recipe with 2 servings
  DELETE FROM Recipe WHERE user_id = v_user_id AND name = 'Update Test Recipe';
  INSERT INTO Recipe(user_id, name, servings) VALUES (v_user_id, 'Update Test Recipe', 2.00);
  SET v_recipe_id = LAST_INSERT_ID();

  -- Get chicken ingredient
  SELECT id INTO v_ing_id FROM Ingredients WHERE name = 'Chicken Breast' LIMIT 1;

  -- Add ingredient: 200g
  DELETE FROM Recipe_Ingredients WHERE recipe_id = v_recipe_id;
  INSERT INTO Recipe_Ingredients(recipe_id, ingredient_id, qty_grams)
  VALUES (v_recipe_id, v_ing_id, 200);

  -- Update ingredient quantity to 400g
  UPDATE Recipe_Ingredients
  SET qty_grams = 400
  WHERE recipe_id = v_recipe_id AND ingredient_id = v_ing_id;

  -- Retrieve recalculated values
  SELECT kcal_per_serving INTO v_kcal_per_serving
  FROM Recipe WHERE id = v_recipe_id;

  -- Expected: (165 * 400 / 100) / 2 servings = 660 / 2 = 330 kcal per serving
  SET v_expected_kcal = 330;

  IF v_kcal_per_serving = v_expected_kcal THEN
    SELECT CONCAT('✓ TEST 5 PASSED: Recipe nutrition updated (', v_kcal_per_serving, ' kcal per serving)') AS test_result;
    SET v_test_passed = TRUE;
  ELSE
    SELECT CONCAT('✗ TEST 5 FAILED: Expected ', v_expected_kcal, ' kcal, got ', v_kcal_per_serving) AS test_result;
  END IF;

  -- Display the recipe
  SELECT 'Updated Recipe Nutrition:' AS info;
  SELECT id, name, servings, kcal_per_serving, protein_g_per_serving
  FROM Recipe WHERE id = v_recipe_id;
END $$
DELIMITER ;
-- Run Test 5
CALL test_recipe_cache_update();

-- ============================
-- TEST 6: Recipe Nutrition Cache - DELETE
-- ============================
-- Tests: trg_ir_after_delete_recalc
-- Expected: Recipe nutrition values reset to 0 when all ingredients are removed

DROP PROCEDURE IF EXISTS test_recipe_cache_delete;

DELIMITER $$
CREATE PROCEDURE test_recipe_cache_delete()
BEGIN
  DECLARE v_test_passed BOOLEAN DEFAULT FALSE;
  DECLARE v_kcal_per_serving DECIMAL(10,2);
  DECLARE v_user_id BIGINT;
  DECLARE v_recipe_id BIGINT;
  DECLARE v_ing_id BIGINT;

  -- Create test user
  DELETE FROM User WHERE email = 'test-recipe-delete@example.com';
  INSERT INTO User(email, name) VALUES ('test-recipe-delete@example.com', 'Recipe Delete Test');
  SET v_user_id = LAST_INSERT_ID();

  -- Create test recipe
  DELETE FROM Recipe WHERE user_id = v_user_id AND name = 'Delete Test Recipe';
  INSERT INTO Recipe(user_id, name, servings) VALUES (v_user_id, 'Delete Test Recipe', 2.00);
  SET v_recipe_id = LAST_INSERT_ID();

  -- Get chicken ingredient
  SELECT id INTO v_ing_id FROM Ingredients WHERE name = 'Chicken Breast' LIMIT 1;

  -- Add ingredient
  DELETE FROM Recipe_Ingredients WHERE recipe_id = v_recipe_id;
  INSERT INTO Recipe_Ingredients(recipe_id, ingredient_id, qty_grams)
  VALUES (v_recipe_id, v_ing_id, 200);

  -- Verify nutrition was calculated
  SELECT kcal_per_serving INTO v_kcal_per_serving
  FROM Recipe WHERE id = v_recipe_id;

  IF v_kcal_per_serving > 0 THEN
    SELECT CONCAT('✓ Recipe has nutrition: ', v_kcal_per_serving, ' kcal per serving') AS debug_info;
  END IF;

  -- Delete the ingredient
  DELETE FROM Recipe_Ingredients
  WHERE recipe_id = v_recipe_id AND ingredient_id = v_ing_id;

  -- Check if nutrition reset to 0
  SELECT kcal_per_serving INTO v_kcal_per_serving
  FROM Recipe WHERE id = v_recipe_id;

  IF v_kcal_per_serving = 0 THEN
    SELECT '✓ TEST 6 PASSED: Recipe nutrition reset to 0 after ingredient deletion' AS test_result;
    SET v_test_passed = TRUE;
  ELSE
    SELECT CONCAT('✗ TEST 6 FAILED: Expected 0 kcal, got ', v_kcal_per_serving) AS test_result;
  END IF;

  -- Display the recipe
  SELECT 'Recipe After Ingredient Deletion:' AS info;
  SELECT id, name, servings, kcal_per_serving, protein_g_per_serving, carbs_g_per_serving, fat_g_per_serving
  FROM Recipe WHERE id = v_recipe_id;
END $$
DELIMITER ;
-- Run Test 6
CALL test_recipe_cache_delete();

-- ============================
-- CLEANUP (Optional)
-- ============================
-- Uncomment to clean up test data:
/*
DELETE FROM User WHERE email LIKE 'test-%@example.com';
*/

-- ============================
-- TEST SUMMARY
-- ============================
SELECT '
╔════════════════════════════════════════════╗
║       TRIGGER TESTING SUITE COMPLETE       ║
╚════════════════════════════════════════════╝

Test Results Summary:
✓ TEST 1: Inventory Auto-Creation
✓ TEST 2: Meal Plan Date Normalization (INSERT)
✓ TEST 3: Meal Plan Date Normalization (UPDATE)
✓ TEST 4: Recipe Nutrition Cache (INSERT)
✓ TEST 5: Recipe Nutrition Cache (UPDATE)
✓ TEST 6: Recipe Nutrition Cache (DELETE)

If all tests show ✓, your triggers are working correctly!
' AS test_summary;
