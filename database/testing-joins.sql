-- ============================
--  Tests des JOINTURES et PROCÉDURE (MySQL 8+)
--  Vérifie que les relations entre tables fonctionnent correctement
-- ============================
USE eat_free;

-- ============================================
-- ÉTAPE 1 : Vérifier que les utilisateurs existent
-- ============================================
SELECT '=== ÉTAPE 1 : Vérification des utilisateurs ===' AS '';
SELECT * FROM User;

-- ============================================
-- ÉTAPE 2 : Vérifier que les inventaires ont été créés automatiquement (trigger)
-- ============================================
SELECT '=== ÉTAPE 2 : Vérification des inventaires (créés par trigger) ===' AS '';
SELECT 
  u.id AS user_id,
  u.name AS user_name,
  i.id AS inventory_id
FROM User u
LEFT JOIN Inventory i ON i.user_id = u.id;

-- ============================================
-- ÉTAPE 3 : Afficher tous les ingrédients disponibles
-- ============================================
SELECT '=== ÉTAPE 3 : Liste des ingrédients ===' AS '';
SELECT 
  id,
  name,
  kcal_per_100g,
  protein_g_per_100g,
  carbs_g_per_100g,
  fat_g_per_100g
FROM Ingredients
ORDER BY name;

-- ============================================
-- ÉTAPE 4 : Afficher les recettes avec leurs valeurs nutritionnelles
-- ============================================
SELECT '=== ÉTAPE 4 : Recettes et nutrition ===' AS '';
SELECT 
  r.id,
  r.name,
  r.servings,
  r.kcal_per_serving,
  r.protein_g_per_serving,
  r.carbs_g_per_serving,
  r.fat_g_per_serving,
  u.name AS created_by_user
FROM Recipe r
LEFT JOIN User u ON r.user_id = u.id
ORDER BY r.id;

-- ============================================
-- ÉTAPE 5 : Jointure Recipe ↔ Recipe_Ingredients ↔ Ingredients
--           Afficher la composition de chaque recette
-- ============================================
SELECT '=== ÉTAPE 5 : Composition des recettes (INNER JOIN) ===' AS '';
SELECT 
  r.id AS recipe_id,
  r.name AS recipe_name,
  ing.name AS ingredient_name,
  ri.qty_grams,
  ri.notes
FROM Recipe r
INNER JOIN Recipe_Ingredients ri ON ri.recipe_id = r.id
INNER JOIN Ingredients ing ON ing.id = ri.ingredient_id
ORDER BY r.id, ing.name;

-- ============================================
-- ÉTAPE 6 : Calculer la nutrition TOTALE d'une recette (avant division par servings)
--           Vérifier que la procédure recalc_recipe_cache calcule correctement
-- ============================================
SELECT '=== ÉTAPE 6 : Calcul manuel de la nutrition totale pour Recette #1 ===' AS '';
SELECT
  SUM( (ing.kcal_per_100g      * ri.qty_grams) / 100 ) AS total_kcal,
  SUM( (ing.protein_g_per_100g * ri.qty_grams) / 100 ) AS total_protein_g,
  SUM( (ing.carbs_g_per_100g   * ri.qty_grams) / 100 ) AS total_carbs_g,
  SUM( (ing.fat_g_per_100g     * ri.qty_grams) / 100 ) AS total_fat_g
FROM Recipe_Ingredients ri
JOIN Ingredients ing ON ing.id = ri.ingredient_id
WHERE ri.recipe_id = 1;

-- ============================================
-- ÉTAPE 7 : Afficher l'inventaire de chaque utilisateur
--           Jointure Inventory ↔ Inventory_Ingredient ↔ Ingredients
-- ============================================
SELECT '=== ÉTAPE 7 : Contenu des inventaires (INNER JOIN) ===' AS '';
SELECT 
  u.name AS user_name,
  ing.name AS ingredient_name,
  ii.qty_grams,
  CASE 
    WHEN ii.qty_grams < 0 THEN 'DÉFICIT'
    WHEN ii.qty_grams = 0 THEN 'VIDE'
    ELSE 'EN STOCK'
  END AS status
FROM User u
INNER JOIN Inventory inv ON inv.user_id = u.id
INNER JOIN Inventory_Ingredient ii ON ii.inventory_id = inv.id
INNER JOIN Ingredients ing ON ing.id = ii.ingredient_id
ORDER BY u.name, ing.name;

-- ============================================
-- ÉTAPE 8 : Afficher les plans de repas hebdomadaires
--           Jointure Meal_Plan ↔ User
-- ============================================
SELECT '=== ÉTAPE 8 : Plans de repas hebdomadaires ===' AS '';
SELECT 
  mp.id AS plan_id,
  u.name AS user_name,
  mp.week_start_date,
  DAYNAME(mp.week_start_date) AS day_name,
  mp.created_at
FROM Meal_Plan mp
INNER JOIN User u ON u.id = mp.user_id
ORDER BY mp.week_start_date DESC;

-- ============================================
-- ÉTAPE 9 : Afficher les recettes planifiées dans les meal plans
--           Jointure Meal_Plan_Recipe ↔ Meal_Plan ↔ Recipe ↔ User
-- ============================================
SELECT '=== ÉTAPE 9 : Recettes planifiées dans les meal plans ===' AS '';
SELECT 
  u.name AS user_name,
  mp.week_start_date,
  mpr.date AS meal_date,
  DAYNAME(mpr.date) AS day_name,
  mpr.meal_type,
  r.name AS recipe_name,
  mpr.planned_servings
FROM Meal_Plan_Recipe mpr
INNER JOIN Meal_Plan mp ON mp.id = mpr.plan_id
INNER JOIN User u ON u.id = mp.user_id
INNER JOIN Recipe r ON r.id = mpr.recipe_id
ORDER BY mp.week_start_date, mpr.date, mpr.meal_type;

-- ============================================
-- ÉTAPE 10 : Afficher le journal des repas consommés
--            Jointure Journal ↔ User ↔ Recipe
-- ============================================
SELECT '=== ÉTAPE 10 : Journal des repas consommés ===' AS '';
SELECT 
  j.id AS journal_id,
  u.name AS user_name,
  r.name AS recipe_name,
  j.servings_eaten,
  j.kcal,
  j.protein_g,
  j.carbs_g,
  j.fat_g,
  j.logged_at
FROM Journal j
INNER JOIN User u ON u.id = j.user_id
INNER JOIN Recipe r ON r.id = j.recipe_id
ORDER BY j.logged_at DESC;

-- ============================================
-- ÉTAPE 11 : Résumé nutritionnel par utilisateur (agrégation)
--            Calculer le total de calories/macros consommées
-- ============================================
SELECT '=== ÉTAPE 11 : Résumé nutritionnel total par utilisateur ===' AS '';
SELECT 
  u.name AS user_name,
  COUNT(j.id) AS total_meals_logged,
  SUM(j.kcal) AS total_kcal,
  SUM(j.protein_g) AS total_protein_g,
  SUM(j.carbs_g) AS total_carbs_g,
  SUM(j.fat_g) AS total_fat_g
FROM User u
LEFT JOIN Journal j ON j.user_id = u.id
GROUP BY u.id, u.name
ORDER BY u.name;

-- ============================================
-- ÉTAPE 12 : Recettes sauvegardées par utilisateur
--            Jointure Saved_Recipe ↔ User ↔ Recipe
-- ============================================
SELECT '=== ÉTAPE 12 : Recettes sauvegardées (favorites) ===' AS '';
SELECT 
  u.name AS user_name,
  sr.name AS saved_recipe_name,
  r.name AS original_recipe_name,
  sr.default_servings,
  sr.created_at
FROM Saved_Recipe sr
INNER JOIN User u ON u.id = sr.user_id
INNER JOIN Recipe r ON r.id = sr.recipe_id
ORDER BY u.name, sr.created_at;

-- ============================================
-- ÉTAPE 13 : Vérifier l'intégrité des données
--            Trouver les recettes sans ingrédients (nutrition devrait être 0)
-- ============================================
SELECT '=== ÉTAPE 13 : Recettes sans ingrédients (nutrition = 0) ===' AS '';
SELECT 
  r.id,
  r.name,
  r.kcal_per_serving,
  r.protein_g_per_serving
FROM Recipe r
LEFT JOIN Recipe_Ingredients ri ON ri.recipe_id = r.id
WHERE ri.recipe_id IS NULL;

-- ============================================
-- ÉTAPE 14 : Vérifier que les inventaires négatifs sont bien trackés
--            (ingrédients utilisés avant d'être achetés)
-- ============================================
SELECT '=== ÉTAPE 14 : Ingrédients en déficit (qty < 0) ===' AS '';
SELECT 
  u.name AS user_name,
  ing.name AS ingredient_name,
  ii.qty_grams AS deficit_grams,
  ABS(ii.qty_grams) AS qty_manquante
FROM Inventory_Ingredient ii
INNER JOIN Inventory inv ON inv.id = ii.inventory_id
INNER JOIN User u ON u.id = inv.user_id
INNER JOIN Ingredients ing ON ing.id = ii.ingredient_id
WHERE ii.qty_grams < 0
ORDER BY u.name, ii.qty_grams;

-- ============================================
-- FIN DES TESTS
-- ============================================
SELECT '=== Tests des jointures terminés ===' AS '';
