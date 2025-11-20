-- Fix Recipe Nutrition Values
-- This script recalculates nutrition for all existing recipes

-- Call the recalculation procedure for each recipe
CALL recalc_recipe_cache(1);  -- Grilled Chicken with Rice
CALL recalc_recipe_cache(2);  -- Oatmeal with Banana  
CALL recalc_recipe_cache(3);  -- Salmon Salad
-- Add more recipe IDs as needed

-- Or recalculate ALL recipes at once:
DELIMITER $$
CREATE PROCEDURE recalc_all_recipes()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE recipe_id_var BIGINT;
  DECLARE cur CURSOR FOR SELECT id FROM Recipe;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur;

  read_loop: LOOP
    FETCH cur INTO recipe_id_var;
    IF done THEN
      LEAVE read_loop;
    END IF;
    CALL recalc_recipe_cache(recipe_id_var);
  END LOOP;

  CLOSE cur;
END$$
DELIMITER ;

-- Run it
CALL recalc_all_recipes();

-- Verify the results
SELECT 
  id,
  name,
  servings,
  kcal_per_serving,
  protein_g_per_serving,
  carbs_g_per_serving,
  fat_g_per_serving
FROM Recipe
ORDER BY id;
