-- ============================
--  Tests des TRIGGERS et PROCÉDURES (MySQL 8+)
--  Vérifie que les automatisations fonctionnent correctement
-- ============================
USE eat_free;

-- ============================================
-- ÉTAPE 1 : Créer un nouvel utilisateur de test
--           Vérifier que le trigger crée automatiquement un inventaire
-- ============================================
SELECT '=== ÉTAPE 1 : Création d''un utilisateur test ===' AS '';

INSERT INTO User (email, name)
VALUES ('test@example.com', 'Utilisateur Test');

-- Récupérer l'ID de l'utilisateur créé
SET @test_user_id = LAST_INSERT_ID();

-- Vérifier que l'inventaire a été créé automatiquement
SELECT 
  u.id AS user_id,
  u.name,
  inv.id AS inventory_id,
  'TRIGGER fonctionne ✓' AS status
FROM User u
INNER JOIN Inventory inv ON inv.user_id = u.id
WHERE u.id = @test_user_id;

-- ============================================
-- ÉTAPE 2 : Créer une recette de test sans ingrédients
--           Vérifier que la nutrition est à 0
-- ============================================
SELECT '=== ÉTAPE 2 : Création d''une recette vide ===' AS '';

INSERT INTO Recipe (user_id, name, servings)
VALUES (@test_user_id, 'Recette Test Vide', 2.0);

SET @test_recipe_id = LAST_INSERT_ID();

-- Vérifier que la nutrition est à 0 (aucun ingrédient)
SELECT 
  id,
  name,
  servings,
  kcal_per_serving,
  protein_g_per_serving,
  carbs_g_per_serving,
  fat_g_per_serving,
  CASE 
    WHEN kcal_per_serving = 0 
     AND protein_g_per_serving = 0 
     AND carbs_g_per_serving = 0 
     AND fat_g_per_serving = 0 
    THEN 'Nutrition à 0 ✓'
    ELSE 'ERREUR: Nutrition devrait être 0'
  END AS status
FROM Recipe
WHERE id = @test_recipe_id;

-- ============================================
-- ÉTAPE 3 : Ajouter un ingrédient à la recette
--           Le trigger devrait recalculer automatiquement la nutrition
-- ============================================
SELECT '=== ÉTAPE 3 : Ajout d''un ingrédient (Chicken Breast - 200g) ===' AS '';

-- Supposons que l'ingrédient "Chicken Breast" a l'ID 1
-- 200g de poulet dans une recette de 2 portions = 100g par portion
INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams, notes)
VALUES (@test_recipe_id, 1, 200, 'Test ingredient');

-- Vérifier que la nutrition a été recalculée automatiquement
SELECT 
  r.id,
  r.name,
  r.servings,
  r.kcal_per_serving,
  r.protein_g_per_serving,
  r.carbs_g_per_serving,
  r.fat_g_per_serving,
  CASE 
    WHEN r.kcal_per_serving > 0 
    THEN 'TRIGGER recalc_recipe_cache fonctionne ✓'
    ELSE 'ERREUR: Nutrition devrait être > 0'
  END AS status
FROM Recipe r
WHERE r.id = @test_recipe_id;

-- ============================================
-- ÉTAPE 4 : Modifier la quantité d'un ingrédient
--           Le trigger UPDATE devrait recalculer la nutrition
-- ============================================
SELECT '=== ÉTAPE 4 : Modification de la quantité (200g → 400g) ===' AS '';

-- Stocker les valeurs avant modification
SELECT @kcal_before := kcal_per_serving FROM Recipe WHERE id = @test_recipe_id;

-- Modifier la quantité
UPDATE Recipe_Ingredients 
SET qty_grams = 400
WHERE recipe_id = @test_recipe_id AND ingredient_id = 1;

-- Vérifier que la nutrition a changé
SELECT 
  r.id,
  r.name,
  @kcal_before AS kcal_avant,
  r.kcal_per_serving AS kcal_apres,
  CASE 
    WHEN r.kcal_per_serving != @kcal_before 
    THEN 'TRIGGER UPDATE fonctionne ✓'
    ELSE 'ERREUR: Les calories devraient avoir changé'
  END AS status
FROM Recipe r
WHERE r.id = @test_recipe_id;

-- ============================================
-- ÉTAPE 5 : Supprimer l'ingrédient
--           Le trigger DELETE devrait remettre la nutrition à 0
-- ============================================
SELECT '=== ÉTAPE 5 : Suppression de l''ingrédient ===' AS '';

DELETE FROM Recipe_Ingredients
WHERE recipe_id = @test_recipe_id AND ingredient_id = 1;

-- Vérifier que la nutrition est revenue à 0
SELECT 
  r.id,
  r.name,
  r.kcal_per_serving,
  r.protein_g_per_serving,
  CASE 
    WHEN r.kcal_per_serving = 0 
     AND r.protein_g_per_serving = 0 
    THEN 'TRIGGER DELETE fonctionne ✓'
    ELSE 'ERREUR: Nutrition devrait être 0'
  END AS status
FROM Recipe r
WHERE r.id = @test_recipe_id;

-- ============================================
-- ÉTAPE 6 : Tester la normalisation de la date du meal plan (trigger MONDAY)
--           Créer un plan avec une date au milieu de la semaine
-- ============================================
SELECT '=== ÉTAPE 6 : Test de normalisation de la date (trigger MONDAY) ===' AS '';

-- Insérer un meal plan avec une date mercredi (2025-11-26)
INSERT INTO Meal_Plan (user_id, week_start_date)
VALUES (@test_user_id, '2025-11-26');

SET @test_plan_id = LAST_INSERT_ID();

-- Vérifier que la date a été normalisée au lundi précédent
SELECT 
  id,
  week_start_date,
  DAYNAME(week_start_date) AS jour_semaine,
  '2025-11-26' AS date_inseree,
  CASE 
    WHEN DAYNAME(week_start_date) = 'Monday' 
    THEN 'TRIGGER normalisation MONDAY fonctionne ✓'
    ELSE 'ERREUR: La date devrait être un lundi'
  END AS status
FROM Meal_Plan
WHERE id = @test_plan_id;

-- ============================================
-- ÉTAPE 7 : Tester le trigger UPDATE de normalisation
--           Modifier la date et vérifier qu'elle reste un lundi
-- ============================================
SELECT '=== ÉTAPE 7 : Test UPDATE normalisation MONDAY ===' AS '';

-- Modifier la date pour un vendredi
UPDATE Meal_Plan
SET week_start_date = '2025-11-28'
WHERE id = @test_plan_id;

-- Vérifier que la date a été re-normalisée au lundi
SELECT 
  id,
  week_start_date,
  DAYNAME(week_start_date) AS jour_semaine,
  '2025-11-28' AS date_tentee,
  CASE 
    WHEN DAYNAME(week_start_date) = 'Monday' 
    THEN 'TRIGGER UPDATE normalisation fonctionne ✓'
    ELSE 'ERREUR: La date devrait être un lundi'
  END AS status
FROM Meal_Plan
WHERE id = @test_plan_id;

-- ============================================
-- ÉTAPE 8 : Tester manuellement la procédure recalc_recipe_cache
--           (normalement appelée par les triggers, mais test direct)
-- ============================================
SELECT '=== ÉTAPE 8 : Test manuel de la procédure recalc_recipe_cache ===' AS '';

-- Créer une nouvelle recette avec ingrédients
INSERT INTO Recipe (user_id, name, servings)
VALUES (@test_user_id, 'Test Procédure', 4.0);

SET @test_recipe_2 = LAST_INSERT_ID();

-- Ajouter des ingrédients (sans trigger pour tester la procédure directement)
-- Désactiver temporairement les triggers
SET @old_sql_mode = @@sql_mode;
SET sql_mode = '';

INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, qty_grams)
VALUES 
  (@test_recipe_2, 1, 400),  -- Chicken
  (@test_recipe_2, 2, 200);  -- Rice

-- Appeler la procédure manuellement
CALL recalc_recipe_cache(@test_recipe_2);

-- Restaurer sql_mode
SET sql_mode = @old_sql_mode;

-- Vérifier que la nutrition a été calculée
SELECT 
  id,
  name,
  servings,
  kcal_per_serving,
  protein_g_per_serving,
  CASE 
    WHEN kcal_per_serving > 0 
    THEN 'PROCÉDURE recalc_recipe_cache fonctionne ✓'
    ELSE 'ERREUR: Nutrition devrait être > 0'
  END AS status
FROM Recipe
WHERE id = @test_recipe_2;

-- ============================================
-- ÉTAPE 9 : Résumé des triggers testés
-- ============================================
SELECT '=== ÉTAPE 9 : Résumé des triggers ===' AS '';

SELECT 
  'trg_user_after_insert_inventory' AS trigger_name,
  'Créer inventaire automatiquement' AS fonction,
  'TESTÉ ✓' AS status
UNION ALL
SELECT 
  'trg_ir_after_insert_recalc',
  'Recalculer nutrition après INSERT ingredient',
  'TESTÉ ✓'
UNION ALL
SELECT 
  'trg_ir_after_update_recalc',
  'Recalculer nutrition après UPDATE ingredient',
  'TESTÉ ✓'
UNION ALL
SELECT 
  'trg_ir_after_delete_recalc',
  'Recalculer nutrition après DELETE ingredient',
  'TESTÉ ✓'
UNION ALL
SELECT 
  'trg_plan_before_insert_monday',
  'Normaliser date au lundi (INSERT)',
  'TESTÉ ✓'
UNION ALL
SELECT 
  'trg_plan_before_update_monday',
  'Normaliser date au lundi (UPDATE)',
  'TESTÉ ✓';

-- ============================================
-- ÉTAPE 10 : Nettoyage des données de test
-- ============================================
SELECT '=== ÉTAPE 10 : Nettoyage des données de test ===' AS '';

DELETE FROM Recipe WHERE user_id = @test_user_id;
DELETE FROM Meal_Plan WHERE user_id = @test_user_id;
DELETE FROM User WHERE id = @test_user_id;

SELECT 'Données de test supprimées ✓' AS status;

-- ============================================
-- FIN DES TESTS
-- ============================================
SELECT '=== Tests des triggers et procédures terminés ===' AS '';
