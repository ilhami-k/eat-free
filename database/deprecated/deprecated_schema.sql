-- ============================
--  Database & Tables (MySQL 8+)
--  NOTE: Triggers are now in routines.sql (created AFTER procedures).
-- ============================

CREATE DATABASE IF NOT EXISTS eat_free
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
USE eat_free;

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION,ERROR_FOR_DIVISION_BY_ZERO,NO_ZERO_DATE,NO_ZERO_IN_DATE';

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS User (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  email         VARCHAR(255) NOT NULL UNIQUE,
  name          VARCHAR(120) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- INGREDIENTS (global catalog) ----------
CREATE TABLE IF NOT EXISTS Ingredients (
  id                           BIGINT PRIMARY KEY AUTO_INCREMENT,
  name                         VARCHAR(255) NOT NULL UNIQUE,
  kcal_per_100g                DECIMAL(8,2)  NOT NULL DEFAULT 0,
  protein_g_per_100g           DECIMAL(8,2)  NOT NULL DEFAULT 0,
  carbs_g_per_100g             DECIMAL(8,2)  NOT NULL DEFAULT 0,
  fat_g_per_100g               DECIMAL(8,2)  NOT NULL DEFAULT 0,
  created_at                   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- RECIPES ----------
-- user_id is NULL => global/admin recipe
CREATE TABLE IF NOT EXISTS Recipe (
  id                           BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id                      BIGINT NULL,
  name                         VARCHAR(255) NOT NULL,
  servings                     DECIMAL(6,2) NOT NULL DEFAULT 1.00,

  -- cached per-serving nutrition (denormalized for speed)
  kcal_per_serving             DECIMAL(10,2) NOT NULL DEFAULT 0,
  protein_g_per_serving        DECIMAL(10,2) NOT NULL DEFAULT 0,
  carbs_g_per_serving          DECIMAL(10,2) NOT NULL DEFAULT 0,
  fat_g_per_serving            DECIMAL(10,2) NOT NULL DEFAULT 0,

  created_at                   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_recipe_user
    FOREIGN KEY (user_id) REFERENCES User(id)
    ON DELETE SET NULL,
  CONSTRAINT chk_servings_positive CHECK (servings > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Lines of a recipe: quantities stored in grams
CREATE TABLE IF NOT EXISTS Recipe_Ingredients (
  recipe_id        BIGINT NOT NULL,
  ingredient_id    BIGINT NOT NULL,
  qty_grams        DECIMAL(12,3) NOT NULL CHECK (qty_grams >= 0),
  notes            VARCHAR(255) NULL,

  PRIMARY KEY (recipe_id, ingredient_id),
  CONSTRAINT fk_recipe_ing_recipe  FOREIGN KEY (recipe_id)   REFERENCES Recipe(id)     ON DELETE CASCADE,
  CONSTRAINT fk_recipe_ing_ingredient     FOREIGN KEY (ingredient_id) REFERENCES Ingredients(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- INVENTORY ----------
CREATE TABLE IF NOT EXISTS Inventory (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id       BIGINT NOT NULL UNIQUE,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventory_user FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- current stock per ingredient
CREATE TABLE IF NOT EXISTS Inventory_Ingredient (
  inventory_id   BIGINT NOT NULL,
  ingredient_id   BIGINT NOT NULL,
  qty_grams       DECIMAL(14,3) NOT NULL DEFAULT 0,

  PRIMARY KEY (inventory_id, ingredient_id),
  CONSTRAINT fk_inventory_ingredient_inventory  FOREIGN KEY (inventory_id) REFERENCES Inventory(id)  ON DELETE CASCADE,
  CONSTRAINT fk_inventory_ingredient_ingredient  FOREIGN KEY (ingredient_id) REFERENCES Ingredients(id) ON DELETE RESTRICT,
  CONSTRAINT chk_qty_non_negative CHECK (qty_grams >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- WEEKLY MEAL PLANS ----------
CREATE TABLE IF NOT EXISTS Meal_Plan (
  id               BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id          BIGINT NOT NULL,
  week_start_date  DATE   NOT NULL,     -- normalized to MONDAY in trigger (routines.sql)
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_user_week (user_id, week_start_date),
  CONSTRAINT fk_meal_plan_user FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Planned items inside a plan
CREATE TABLE IF NOT EXISTS Meal_Plan_Recipe (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  plan_id         BIGINT NOT NULL,
  date            DATE   NOT NULL,  -- actual day (Mon–Sun) in that week
  meal_type       ENUM('breakfast','lunch','dinner','snack') NOT NULL,
  recipe_id       BIGINT NOT NULL,
  planned_servings DECIMAL(6,2) NOT NULL DEFAULT 1.00,

  KEY k_plan_day (plan_id, date, meal_type),
  CONSTRAINT fk_meal_plan_recipe_plan   FOREIGN KEY (plan_id)   REFERENCES Meal_Plan(id) ON DELETE CASCADE,
  CONSTRAINT fk_meal_plan_recipe_recipe FOREIGN KEY (recipe_id) REFERENCES Recipe(id)    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- JOURNAL (logged meals) ----------
CREATE TABLE IF NOT EXISTS Journal (
  id             BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id        BIGINT NOT NULL,
  recipe_id      BIGINT NOT NULL,
  servings_eaten DECIMAL(6,2) NOT NULL DEFAULT 1.00,
  logged_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- snapshot nutrition at log time
  kcal           DECIMAL(12,2) NOT NULL,
  protein_g      DECIMAL(12,2) NOT NULL,
  carbs_g        DECIMAL(12,2) NOT NULL,
  fat_g          DECIMAL(12,2) NOT NULL,

  KEY k_journal_user_time (user_id, logged_at),
  CONSTRAINT fk_journal_user   FOREIGN KEY (user_id)   REFERENCES User(id) ON DELETE CASCADE,
  CONSTRAINT fk_journal_recipe FOREIGN KEY (recipe_id) REFERENCES Recipe(id)    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- OPTIONAL: SAVED MEALS ----------
CREATE TABLE IF NOT EXISTS Saved_Recipe (
  id             BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id        BIGINT NOT NULL,
  name           VARCHAR(255) NOT NULL,
  recipe_id      BIGINT NOT NULL,
  default_servings DECIMAL(6,2) NOT NULL DEFAULT 1.00,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_saved_recipe_user   FOREIGN KEY (user_id)  REFERENCES User(id) ON DELETE CASCADE,
  CONSTRAINT fk_saved_recipe_recipe FOREIGN KEY (recipe_id) REFERENCES Recipe(id)    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
