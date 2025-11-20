-- ============================
--  Functions, Procedures & Triggers (MySQL 8+)
--  Simplified with INT and FLOAT types
-- ============================
USE eat_free;

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION,ERROR_FOR_DIVISION_BY_ZERO,NO_ZERO_DATE,NO_ZERO_IN_DATE';

DELIMITER $$

-- ============================================
--              PROCEDURES
-- ============================================

-- Recalculate a recipe's per-serving nutrition cache
-- This is called automatically by triggers when recipe ingredients change
DROP PROCEDURE IF EXISTS recalc_recipe_cache $$
CREATE PROCEDURE recalc_recipe_cache(IN p_recipe_id INT)
BEGIN
  DECLARE v_servings FLOAT DEFAULT 1.0;

  SELECT COALESCE(servings, 1.0) INTO v_servings
  FROM Recipe WHERE id = p_recipe_id;

  UPDATE Recipe r
  JOIN (
    SELECT
      ir.recipe_id,
      SUM( (ing.kcal_per_100g      * ir.qty_grams) / 100 ) AS total_kcal,
      SUM( (ing.protein_g_per_100g * ir.qty_grams) / 100 ) AS total_protein,
      SUM( (ing.carbs_g_per_100g   * ir.qty_grams) / 100 ) AS total_carbs,
      SUM( (ing.fat_g_per_100g     * ir.qty_grams) / 100 ) AS total_fat
    FROM Recipe_Ingredients ir
    JOIN Ingredients ing ON ing.id = ir.ingredient_id
    WHERE ir.recipe_id = p_recipe_id
    GROUP BY ir.recipe_id
  ) t ON t.recipe_id = r.id
  SET
    r.kcal_per_serving      = IF(v_servings > 0, t.total_kcal    / v_servings, 0),
    r.protein_g_per_serving = IF(v_servings > 0, t.total_protein / v_servings, 0),
    r.carbs_g_per_serving   = IF(v_servings > 0, t.total_carbs   / v_servings, 0),
    r.fat_g_per_serving     = IF(v_servings > 0, t.total_fat     / v_servings, 0);

  -- If recipe has no ingredients, set all to 0
  UPDATE Recipe
  SET kcal_per_serving=0, protein_g_per_serving=0, carbs_g_per_serving=0, fat_g_per_serving=0
  WHERE id = p_recipe_id
    AND NOT EXISTS (SELECT 1 FROM Recipe_Ingredients WHERE recipe_id = p_recipe_id);
END $$

-- ============================================
--                TRIGGERS
-- ============================================

-- Auto-create an empty inventory when a user is created
DROP TRIGGER IF EXISTS trg_user_after_insert_inventory $$
CREATE TRIGGER trg_user_after_insert_inventory
AFTER INSERT ON User
FOR EACH ROW
BEGIN
  INSERT INTO Inventory(user_id) VALUES (NEW.id);
END $$

-- Normalize Meal_Plan.week_start_date to MONDAY on INSERT
DROP TRIGGER IF EXISTS trg_plan_before_insert_monday $$
CREATE TRIGGER trg_plan_before_insert_monday
BEFORE INSERT ON Meal_Plan
FOR EACH ROW
BEGIN
  SET NEW.week_start_date = DATE_SUB(NEW.week_start_date, INTERVAL WEEKDAY(NEW.week_start_date) DAY);
END $$

-- Normalize Meal_Plan.week_start_date to MONDAY on UPDATE
DROP TRIGGER IF EXISTS trg_plan_before_update_monday $$
CREATE TRIGGER trg_plan_before_update_monday
BEFORE UPDATE ON Meal_Plan
FOR EACH ROW
BEGIN
  SET NEW.week_start_date = DATE_SUB(NEW.week_start_date, INTERVAL WEEKDAY(NEW.week_start_date) DAY);
END $$

-- Keep Recipe nutrition cache up-to-date when ingredients are added
DROP TRIGGER IF EXISTS trg_ir_after_insert_recalc $$
CREATE TRIGGER trg_ir_after_insert_recalc
AFTER INSERT ON Recipe_Ingredients
FOR EACH ROW
BEGIN
  CALL recalc_recipe_cache(NEW.recipe_id);
END $$

-- Keep Recipe nutrition cache up-to-date when ingredients are updated
DROP TRIGGER IF EXISTS trg_ir_after_update_recalc $$
CREATE TRIGGER trg_ir_after_update_recalc
AFTER UPDATE ON Recipe_Ingredients
FOR EACH ROW
BEGIN
  CALL recalc_recipe_cache(NEW.recipe_id);
END $$

-- Keep Recipe nutrition cache up-to-date when ingredients are removed
DROP TRIGGER IF EXISTS trg_ir_after_delete_recalc $$
CREATE TRIGGER trg_ir_after_delete_recalc
AFTER DELETE ON Recipe_Ingredients
FOR EACH ROW
BEGIN
  CALL recalc_recipe_cache(OLD.recipe_id);
END $$

DELIMITER ;
