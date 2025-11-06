/**
 * Inventory Repository
 * 
 * All operations related to user inventory management.
 */

import prisma from '../prisma/client';

/**
 * Create inventory for a user (usually done via trigger on user creation)
 */
export async function create(userId: bigint) {
  return prisma.inventaire.create({
    data: {
      userId,
    },
  });
}

/**
 * Get inventory by ID
 */
export async function getById(id: bigint) {
  return prisma.inventaire.findUnique({
    where: { id },
  });
}

/**
 * Get inventory for a user
 */
export async function getByUserId(userId: bigint) {
  return prisma.inventaire.findUnique({
    where: { userId },
  });
}

/**
 * Get inventory with all ingredients
 */
export async function getWithIngredients(inventaireId: bigint) {
  return prisma.inventaire.findUnique({
    where: { id: inventaireId },
    include: {
      ingredientInventaire: {
        include: {
          ingredient: true,
        },
        orderBy: { ingredient: { name: 'asc' } },
      },
    },
  });
}

/**
 * Get all inventories
 */
export async function getAll() {
  return prisma.inventaire.findMany({
    include: {
      utilisateur: true,
    },
  });
}

/**
 * Delete inventory
 */
export async function deleteInventory(id: bigint) {
  return prisma.inventaire.delete({
    where: { id },
  });
}

/**
 * Add ingredient to inventory or update quantity
 */
export async function addOrUpdateIngredient(inventaireId: bigint, ingredientId: bigint, qtyGrams: number) {
  return prisma.inventaireIngredient.upsert({
    where: {
      inventaireId_ingredientId: {
        inventaireId,
        ingredientId,
      },
    },
    create: {
      inventaireId,
      ingredientId,
      qtyGrams,
    },
    update: {
      qtyGrams,
    },
  });
}

/**
 * Increase ingredient quantity in inventory
 */
export async function increaseIngredient(inventaireId: bigint, ingredientId: bigint, qtyGrams: number) {
  return prisma.inventaireIngredient.update({
    where: {
      inventaireId_ingredientId: {
        inventaireId,
        ingredientId,
      },
    },
    data: {
      qtyGrams: {
        increment: qtyGrams,
      },
    },
  });
}

/**
 * Decrease ingredient quantity in inventory
 */
export async function decreaseIngredient(inventaireId: bigint, ingredientId: bigint, qtyGrams: number) {
  return prisma.inventaireIngredient.update({
    where: {
      inventaireId_ingredientId: {
        inventaireId,
        ingredientId,
      },
    },
    data: {
      qtyGrams: {
        decrement: qtyGrams,
      },
    },
  });
}

/**
 * Remove ingredient from inventory
 */
export async function removeIngredient(inventaireId: bigint, ingredientId: bigint) {
  return prisma.inventaireIngredient.delete({
    where: {
      inventaireId_ingredientId: {
        inventaireId,
        ingredientId,
      },
    },
  });
}

/**
 * Get ingredient quantity in inventory
 */
export async function getIngredientQty(inventaireId: bigint, ingredientId: bigint) {
  return prisma.inventaireIngredient.findUnique({
    where: {
      inventaireId_ingredientId: {
        inventaireId,
        ingredientId,
      },
    },
  });
}

/**
 * Get total inventory value (in kcal)
 */
export async function getTotalValue(inventaireId: bigint) {
  const inventory = await prisma.inventaire.findUnique({
    where: { id: inventaireId },
    include: {
      ingredientInventaire: {
        include: {
          ingredient: true,
        },
      },
    },
  });

  if (!inventory) return null;

  const totalKcal = inventory.ingredientInventaire.reduce((sum, item) => {
    const kcal = (item.ingredient.kcalPer100g * item.qtyGrams) / 100;
    return sum + kcal;
  }, 0);

  return {
    inventoryId: inventaireId,
    totalGrams: inventory.ingredientInventaire.reduce((sum, item) => sum + item.qtyGrams, 0),
    totalKcal: Math.round(totalKcal * 100) / 100,
    ingredientCount: inventory.ingredientInventaire.length,
  };
}

/**
 * Check if user can make a recipe with current inventory
 */
export async function canMakeRecipe(inventaireId: bigint, recipeId: bigint) {
  const recipe = await prisma.recette.findUnique({
    where: { id: recipeId },
    include: {
      ingredientsRecette: true,
    },
  });

  if (!recipe) return false;

  const inventory = await prisma.inventaire.findUnique({
    where: { id: inventaireId },
    include: {
      ingredientInventaire: true,
    },
  });

  if (!inventory) return false;

  // Check if all ingredients have sufficient quantity
  for (const ingredientRecipe of recipe.ingredientsRecette) {
    const inventoryItem = inventory.ingredientInventaire.find(
      (item) => item.ingredientId === ingredientRecipe.ingredientId
    );

    if (!inventoryItem || inventoryItem.qtyGrams < ingredientRecipe.qtyGrams) {
      return false;
    }
  }

  return true;
}

/**
 * Clear all ingredients from inventory
 */
export async function clearInventory(inventaireId: bigint) {
  return prisma.inventaireIngredient.deleteMany({
    where: { inventaireId },
  });
}
