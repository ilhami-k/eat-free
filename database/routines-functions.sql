-- ============================
--  Functions, Procedures & Triggers (MySQL 8+)
-- ============================
USE eat_free;

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION,ERROR_FOR_DIVISION_BY_ZERO,NO_ZERO_DATE,NO_ZERO_IN_DATE';

DELIMITER $$

-- 1) Get ISO-week Monday for any date
DROP FUNCTION IF EXISTS week_start_monday $$
CREATE FUNCTION week_start_monday(d DATE)
RETURNS DATE
DETERMINISTIC
RETURN DATE_SUB(d, INTERVAL WEEKDAY(d) DAY) $$

-- 2) Recalculate a recipe's per-serving nutrition cache
DROP PROCEDURE IF EXISTS recalc_recipe_cache $$
CREATE PROCEDURE recalc_recipe_cache(IN p_recipe_id BIGINT)
BEGIN
  DECLARE v_servings DECIMAL(6,2) DEFAULT 1.00;

  SELECT COALESCE(servings, 1.00) INTO v_servings
  FROM Recette WHERE id = p_recipe_id;

  UPDATE Recette r
  JOIN (
    SELECT
      ir.recipe_id,
      SUM( (ing.kcal_per_100g      * ir.qty_grams) / 100 ) AS total_kcal,
      SUM( (ing.protein_g_per_100g * ir.qty_grams) / 100 ) AS total_protein,
      SUM( (ing.carbs_g_per_100g   * ir.qty_grams) / 100 ) AS total_carbs,
      SUM( (ing.fat_g_per_100g     * ir.qty_grams) / 100 ) AS total_fat
    FROM Ingredients_Recette ir
    JOIN Ingredients ing ON ing.id = ir.ingredient_id
    WHERE ir.recipe_id = p_recipe_id
    GROUP BY ir.recipe_id
  ) t ON t.recipe_id = r.id
  SET
    r.kcal_per_serving      = IF(v_servings > 0, t.total_kcal    / v_servings, 0),
    r.protein_g_per_serving = IF(v_servings > 0, t.total_protein / v_servings, 0),
    r.carbs_g_per_serving   = IF(v_servings > 0, t.total_carbs   / v_servings, 0),
    r.fat_g_per_serving     = IF(v_servings > 0, t.total_fat     / v_servings, 0);

  UPDATE Recette
  SET kcal_per_serving=0, protein_g_per_serving=0, carbs_g_per_serving=0, fat_g_per_serving=0
  WHERE id = p_recipe_id
    AND NOT EXISTS (SELECT 1 FROM Ingredients_Recette WHERE recipe_id = p_recipe_id);
END $$

-- 3) Upsert and return the plan id for a given user/date (ISO week)
DROP PROCEDURE IF EXISTS upsert_plan_for_date $$
CREATE PROCEDURE upsert_plan_for_date(
  IN  p_user_id   BIGINT,
  IN  p_any_date  DATE,
  OUT p_plan_id   BIGINT
)
BEGIN
  DECLARE v_week_start DATE;
  SET v_week_start = week_start_monday(p_any_date);

  INSERT INTO PlansRepas(user_id, week_start_date)
  VALUES (p_user_id, v_week_start)
  ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);

  SET p_plan_id = LAST_INSERT_ID();
END $$

-- 4) Log a meal and (optionally) deduct inventory.
DROP PROCEDURE IF EXISTS log_meal $$
CREATE PROCEDURE log_meal(
  IN p_user_id BIGINT,
  IN p_recipe_id BIGINT,
  IN p_servings_eaten DECIMAL(6,2),
  IN p_logged_at DATETIME,
  IN p_deduct_inventory BOOLEAN
)
BEGIN
  DECLARE v_kcal DECIMAL(12,2);
  DECLARE v_p    DECIMAL(12,2);
  DECLARE v_c    DECIMAL(12,2);
  DECLARE v_f    DECIMAL(12,2);
  DECLARE v_recipe_serv DECIMAL(6,2) DEFAULT 1.00;
  DECLARE v_inv_id BIGINT;

  SELECT kcal_per_serving, protein_g_per_serving, carbs_g_per_serving, fat_g_per_serving, servings
  INTO v_kcal, v_p, v_c, v_f, v_recipe_serv
  FROM Recette WHERE id = p_recipe_id;

  IF p_logged_at IS NULL THEN
    SET p_logged_at = NOW();
  END IF;

  START TRANSACTION;

  INSERT INTO Journal(user_id, recipe_id, servings_eaten, logged_at, kcal, protein_g, carbs_g, fat_g)
  VALUES (
    p_user_id, p_recipe_id, p_servings_eaten, p_logged_at,
    v_kcal * p_servings_eaten,
    v_p    * p_servings_eaten,
    v_c    * p_servings_eaten,
    v_f    * p_servings_eaten
  );

  IF p_deduct_inventory THEN
    SELECT id INTO v_inv_id FROM Inventaire WHERE user_id = p_user_id;

    UPDATE Inventaire_Ingredient ii
    JOIN (
      SELECT ir.ingredient_id,
             SUM(ir.qty_grams * (p_servings_eaten / NULLIF(v_recipe_serv,0))) AS need_grams
      FROM Ingredients_Recette ir
      WHERE ir.recipe_id = p_recipe_id
      GROUP BY ir.ingredient_id
    ) need ON need.ingredient_id = ii.ingredient_id
    SET ii.qty_grams = ii.qty_grams - need.need_grams
    WHERE ii.inventaire_id = v_inv_id;

    INSERT INTO Inventaire_Ingredient (inventaire_id, ingredient_id, qty_grams)
    SELECT v_inv_id, need.ingredient_id, -need.need_grams
    FROM (
      SELECT ir.ingredient_id,
             SUM(ir.qty_grams * (p_servings_eaten / NULLIF(v_recipe_serv,0))) AS need_grams
      FROM Ingredients_Recette ir
      WHERE ir.recipe_id = p_recipe_id
      GROUP BY ir.ingredient_id
    ) need
    LEFT JOIN Inventaire_Ingredient ii
      ON ii.inventaire_id = v_inv_id AND ii.ingredient_id = need.ingredient_id
    WHERE ii.ingredient_id IS NULL;
  END IF;

  COMMIT;
END $$

-- ============================================
--                TRIGGERS
--  (created AFTER procedures to avoid dependency errors)
-- ============================================

-- 1) Auto-create an empty inventory when a user is created
DROP TRIGGER IF EXISTS trg_user_after_insert_inventory $$
CREATE TRIGGER trg_user_after_insert_inventory
AFTER INSERT ON Utilisateur
FOR EACH ROW
BEGIN
  INSERT INTO Inventaire(user_id) VALUES (NEW.id);
END $$

-- 2) Normalize PlansRepas.week_start_date to MONDAY on INSERT/UPDATE
DROP TRIGGER IF EXISTS trg_plan_before_insert_monday $$
CREATE TRIGGER trg_plan_before_insert_monday
BEFORE INSERT ON PlansRepas
FOR EACH ROW
BEGIN
  SET NEW.week_start_date = DATE_SUB(NEW.week_start_date, INTERVAL WEEKDAY(NEW.week_start_date) DAY);
END $$

DROP TRIGGER IF EXISTS trg_plan_before_update_monday $$
CREATE TRIGGER trg_plan_before_update_monday
BEFORE UPDATE ON PlansRepas
FOR EACH ROW
BEGIN
  SET NEW.week_start_date = DATE_SUB(NEW.week_start_date, INTERVAL WEEKDAY(NEW.week_start_date) DAY);
END $$

-- 3) Keep Recette nutrition cache up-to-date whenever recipe lines change
DROP TRIGGER IF EXISTS trg_ir_after_insert_recalc $$
CREATE TRIGGER trg_ir_after_insert_recalc
AFTER INSERT ON Ingredients_Recette
FOR EACH ROW
BEGIN
  CALL recalc_recipe_cache(NEW.recipe_id);
END $$

DROP TRIGGER IF EXISTS trg_ir_after_update_recalc $$
CREATE TRIGGER trg_ir_after_update_recalc
AFTER UPDATE ON Ingredients_Recette
FOR EACH ROW
BEGIN
  CALL recalc_recipe_cache(NEW.recipe_id);
END $$

DROP TRIGGER IF EXISTS trg_ir_after_delete_recalc $$
CREATE TRIGGER trg_ir_after_delete_recalc
AFTER DELETE ON Ingredients_Recette
FOR EACH ROW
BEGIN
  CALL recalc_recipe_cache(OLD.recipe_id);
END $$

DELIMITER ;
