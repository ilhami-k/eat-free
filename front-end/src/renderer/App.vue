<template>
  <div class="container">
    <h1>🍽️ Eat Free - Full API Test</h1>
    
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="['tab-button', { active: activeTab === tab }]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Users Tab -->
    <div v-show="activeTab === 'Users'" class="tab-content">
      <div class="test-section">
        <h2>👤 Users</h2>
        <div class="form-group">
          <h3>Create User</h3>
          <label>Name:</label>
          <input v-model="newUser.name" placeholder="Enter user name" class="input" />
          <label>Email:</label>
          <input v-model="newUser.email" placeholder="Enter email address" class="input" />
          <button @click="createUser" :disabled="loading.createUser" class="btn-primary">
            {{ loading.createUser ? 'Creating...' : 'Create User' }}
          </button>
        </div>
        <button @click="fetchUsers" :disabled="loading.users" class="btn-primary">
          {{ loading.users ? 'Loading...' : 'Fetch Users' }}
        </button>
        <div v-if="error.users" class="error">{{ error.users }}</div>
        <div v-if="success.users" class="success">{{ success.users }}</div>
        <div v-if="users.length > 0" class="data-display">
          <h3>Users List:</h3>
          <ul>
            <li v-for="user in users" :key="user.id" class="list-item">
              <div class="item-content">
                <strong>{{ user.name }}</strong> ({{ user.email }})
                <br>
                <small>ID: {{ user.id }}</small>
              </div>
              <div class="item-actions">
                <button @click="deleteUser(user.id)" class="btn-danger" :disabled="loading.delete">Delete</button>
              </div>
            </li>
          </ul>
        </div>
        <div v-else-if="!loading.users" class="no-data">No users found</div>
      </div>
    </div>

    <!-- Recipes Tab -->
    <div v-show="activeTab === 'Recipes'" class="tab-content">
      <div class="test-section">
        <h2>🍳 Recipes</h2>
        <div class="form-group">
          <h3>Create Recipe</h3>
          <label>Recipe Name:</label>
          <input v-model="newRecipe.name" placeholder="Enter recipe name" class="input" />
          <label>User ID:</label>
          <input v-model.number="newRecipe.user_id" placeholder="Enter user ID" type="number" class="input" />
          <label>Servings:</label>
          <input v-model.number="newRecipe.servings" placeholder="Number of servings" type="number" class="input" />
          <label>Kcal per Serving:</label>
          <input v-model.number="newRecipe.kcal_per_serving" placeholder="Calories per serving" type="number" step="0.01" class="input" />
          <label>Protein (g):</label>
          <input v-model.number="newRecipe.protein_g_per_serving" placeholder="Protein in grams" type="number" step="0.01" class="input" />
          <label>Carbs (g):</label>
          <input v-model.number="newRecipe.carbs_g_per_serving" placeholder="Carbs in grams" type="number" step="0.01" class="input" />
          <label>Fat (g):</label>
          <input v-model.number="newRecipe.fat_g_per_serving" placeholder="Fat in grams" type="number" step="0.01" class="input" />
          <button @click="createRecipe" :disabled="loading.createRecipe" class="btn-primary">
            {{ loading.createRecipe ? 'Creating...' : 'Create Recipe' }}
          </button>
        </div>
        <button @click="fetchRecipes" :disabled="loading.recipes" class="btn-primary">
          {{ loading.recipes ? 'Loading...' : 'Fetch Recipes' }}
        </button>
        <div v-if="error.recipes" class="error">{{ error.recipes }}</div>
        <div v-if="success.recipes" class="success">{{ success.recipes }}</div>
        <div v-if="recipes.length > 0" class="data-display">
          <h3>Recipes List:</h3>
          <ul>
            <li v-for="recipe in recipes" :key="recipe.id" class="list-item">
              <div class="item-content">
                <strong>{{ recipe.name }}</strong>
                <br>
                <small>Servings: {{ recipe.servings }} | Kcal: {{ recipe.kcal_per_serving }} | Protein: {{ recipe.protein_g_per_serving }}g</small>
              </div>
              <div class="item-actions">
                <button @click="deleteRecipe(recipe.id)" class="btn-danger" :disabled="loading.delete">Delete</button>
              </div>
            </li>
          </ul>
        </div>
        <div v-else-if="!loading.recipes" class="no-data">No recipes found</div>
      </div>
    </div>

    <!-- Ingredients Tab -->
    <div v-show="activeTab === 'Ingredients'" class="tab-content">
      <div class="test-section">
        <h2>🥗 Ingredients</h2>
        <div class="form-group">
          <h3>Create Ingredient</h3>
          <label>Name:</label>
          <input v-model="newIngredient.name" placeholder="Enter ingredient name" class="input" />
          <label>Kcal per 100g:</label>
          <input v-model.number="newIngredient.kcal_per_100g" type="number" step="0.01" class="input" />
          <label>Protein (g) per 100g:</label>
          <input v-model.number="newIngredient.protein_g_per_100g" type="number" step="0.01" class="input" />
          <label>Carbs (g) per 100g:</label>
          <input v-model.number="newIngredient.carbs_g_per_100g" type="number" step="0.01" class="input" />
          <label>Fat (g) per 100g:</label>
          <input v-model.number="newIngredient.fat_g_per_100g" type="number" step="0.01" class="input" />
          <button @click="createIngredient" :disabled="loading.createIngredient" class="btn-primary">
            {{ loading.createIngredient ? 'Creating...' : 'Create Ingredient' }}
          </button>
        </div>
        <button @click="fetchIngredients" :disabled="loading.ingredients" class="btn-primary">
          {{ loading.ingredients ? 'Loading...' : 'Fetch Ingredients' }}
        </button>
        <div v-if="error.ingredients" class="error">{{ error.ingredients }}</div>
        <div v-if="success.ingredients" class="success">{{ success.ingredients }}</div>
        <div v-if="ingredients.length > 0" class="data-display">
          <h3>Ingredients List:</h3>
          <ul>
            <li v-for="ingredient in ingredients" :key="ingredient.id" class="list-item">
              <div class="item-content">
                <strong>{{ ingredient.name }}</strong>
                <br>
                <small>Kcal: {{ ingredient.kcal_per_100g }} | Protein: {{ ingredient.protein_g_per_100g }}g | Carbs: {{ ingredient.carbs_g_per_100g }}g | Fat: {{ ingredient.fat_g_per_100g }}g</small>
              </div>
              <div class="item-actions">
                <button @click="deleteIngredient(ingredient.id)" class="btn-danger" :disabled="loading.delete">Delete</button>
              </div>
            </li>
          </ul>
        </div>
        <div v-else-if="!loading.ingredients" class="no-data">No ingredients found</div>
      </div>
    </div>

    <!-- Journal Tab -->
    <div v-show="activeTab === 'Journal'" class="tab-content">
      <div class="test-section">
        <h2>📓 Food Journal</h2>
        <div class="form-group">
          <h3>Log Meal</h3>
          <label>User ID:</label>
          <input v-model.number="newJournal.user_id" placeholder="Enter user ID" type="number" class="input" />
          <label>Recipe ID:</label>
          <input v-model.number="newJournal.recipe_id" placeholder="Enter recipe ID" type="number" class="input" />
          <label>Servings Eaten:</label>
          <input v-model.number="newJournal.servings_eaten" type="number" step="0.01" class="input" />
          <label>Kcal:</label>
          <input v-model.number="newJournal.kcal" type="number" step="0.01" class="input" />
          <label>Protein (g):</label>
          <input v-model.number="newJournal.protein_g" type="number" step="0.01" class="input" />
          <label>Carbs (g):</label>
          <input v-model.number="newJournal.carbs_g" type="number" step="0.01" class="input" />
          <label>Fat (g):</label>
          <input v-model.number="newJournal.fat_g" type="number" step="0.01" class="input" />
          <button @click="createJournalEntry" :disabled="loading.createJournal" class="btn-primary">
            {{ loading.createJournal ? 'Logging...' : 'Log Entry' }}
          </button>
        </div>
        <label>User ID to fetch:</label>
        <input v-model.number="journalUserId" placeholder="Enter user ID" type="number" class="input" />
        <button @click="fetchJournal" :disabled="loading.journal" class="btn-primary">
          {{ loading.journal ? 'Loading...' : 'Fetch Journal' }}
        </button>
        <div v-if="error.journal" class="error">{{ error.journal }}</div>
        <div v-if="success.journal" class="success">{{ success.journal }}</div>
        <div v-if="journalEntries.length > 0" class="data-display">
          <h3>Journal Entries:</h3>
          <ul>
            <li v-for="entry in journalEntries" :key="entry.id" class="list-item">
              <div class="item-content">
                <strong>{{ entry.recipe?.name || 'Unknown Recipe' }}</strong>
                <br>
                <small>Servings: {{ entry.servings_eaten }} | Kcal: {{ entry.kcal }} | Protein: {{ entry.protein_g }}g | Logged: {{ new Date(entry.logged_at).toLocaleDateString() }}</small>
              </div>
              <div class="item-actions">
                <button @click="deleteJournalEntry(entry.id)" class="btn-danger" :disabled="loading.delete">Delete</button>
              </div>
            </li>
          </ul>
        </div>
        <div v-else-if="!loading.journal" class="no-data">No journal entries found</div>
      </div>
    </div>

    <!-- Saved Recipes Tab -->
    <div v-show="activeTab === 'Saved Recipes'" class="tab-content">
      <div class="test-section">
        <h2>⭐ Saved Recipes</h2>
        <div class="form-group">
          <h3>Save Recipe</h3>
          <label>User ID:</label>
          <input v-model.number="newSavedRecipe.user_id" placeholder="Enter user ID" type="number" class="input" />
          <label>Recipe Name:</label>
          <input v-model="newSavedRecipe.name" placeholder="Enter saved recipe name" class="input" />
          <label>Recipe ID:</label>
          <input v-model.number="newSavedRecipe.recipe_id" placeholder="Enter recipe ID" type="number" class="input" />
          <label>Default Servings:</label>
          <input v-model.number="newSavedRecipe.default_servings" type="number" step="0.01" class="input" />
          <button @click="createSavedRecipe" :disabled="loading.createSavedRecipe" class="btn-primary">
            {{ loading.createSavedRecipe ? 'Saving...' : 'Save Recipe' }}
          </button>
        </div>
        <label>User ID to fetch:</label>
        <input v-model.number="savedRecipeUserId" placeholder="Enter user ID" type="number" class="input" />
        <button @click="fetchSavedRecipes" :disabled="loading.savedRecipes" class="btn-primary">
          {{ loading.savedRecipes ? 'Loading...' : 'Fetch Saved Recipes' }}
        </button>
        <div v-if="error.savedRecipes" class="error">{{ error.savedRecipes }}</div>
        <div v-if="success.savedRecipes" class="success">{{ success.savedRecipes }}</div>
        <div v-if="savedRecipes.length > 0" class="data-display">
          <h3>Saved Recipes:</h3>
          <ul>
            <li v-for="saved in savedRecipes" :key="saved.id" class="list-item">
              <div class="item-content">
                <strong>{{ saved.name }}</strong>
                <br>
                <small>Default Servings: {{ saved.default_servings }} | Recipe: {{ saved.recipe?.name || 'Unknown' }}</small>
              </div>
              <div class="item-actions">
                <button @click="deleteSavedRecipe(saved.id)" class="btn-danger" :disabled="loading.delete">Delete</button>
              </div>
            </li>
          </ul>
        </div>
        <div v-else-if="!loading.savedRecipes" class="no-data">No saved recipes found</div>
      </div>
    </div>

    <!-- Inventory Tab -->
    <div v-show="activeTab === 'Inventory'" class="tab-content">
      <div class="test-section">
        <h2>📦 Inventory</h2>
        <div class="form-group">
          <h3>Create Inventory</h3>
          <label>User ID:</label>
          <input v-model.number="newInventory.user_id" placeholder="Enter user ID" type="number" class="input" />
          <button @click="createInventory" :disabled="loading.createInventory" class="btn-primary">
            {{ loading.createInventory ? 'Creating...' : 'Create Inventory' }}
          </button>
        </div>
        <div class="form-group">
          <h3>Add Ingredient to Inventory</h3>
          <label>Inventory ID:</label>
          <input v-model.number="newInventoryIngredient.inventory_id" placeholder="Enter inventory ID" type="number" class="input" />
          <label>Ingredient ID:</label>
          <input v-model.number="newInventoryIngredient.ingredient_id" placeholder="Enter ingredient ID" type="number" class="input" />
          <label>Quantity (grams):</label>
          <input v-model.number="newInventoryIngredient.qty_grams" placeholder="Enter quantity in grams" type="number" step="0.01" class="input" />
          <button @click="addIngredientToInventory" :disabled="loading.createInventory" class="btn-primary">
            Add Ingredient to Inventory
          </button>
        </div>
        <label>User ID to fetch:</label>
        <input v-model.number="inventoryUserId" placeholder="Enter user ID" type="number" class="input" />
        <button @click="fetchInventoriesByUser" :disabled="loading.inventory" class="btn-primary">
          {{ loading.inventory ? 'Loading...' : 'Fetch User Inventory' }}
        </button>
        <div v-if="error.inventory" class="error">{{ error.inventory }}</div>
        <div v-if="success.inventory" class="success">{{ success.inventory }}</div>
        <div v-if="inventories.length > 0" class="data-display">
          <h3>Inventories:</h3>
          <ul>
            <li v-for="inventory in inventories" :key="inventory.id" class="list-item">
              <div class="item-content">
                <strong>Inventory ID: {{ inventory.id }}</strong>
                <br>
                <small v-if="inventory.inventory_ingredient && inventory.inventory_ingredient.length">
                  Ingredients: {{ inventory.inventory_ingredient.length }}
                </small>
                <small v-else>No ingredients</small>
              </div>
              <div class="item-actions">
                <button @click="deleteInventory(inventory.id)" class="btn-danger" :disabled="loading.delete">Delete</button>
              </div>
            </li>
          </ul>
        </div>
        <div v-else-if="!loading.inventory" class="no-data">No inventories found</div>
      </div>
    </div>

    <!-- Meal Plans Tab -->
    <div v-show="activeTab === 'Meal Plans'" class="tab-content">
      <div class="test-section">
        <h2>📅 Meal Plans</h2>
        <div class="form-group">
          <h3>Create Meal Plan</h3>
          <label>User ID:</label>
          <input v-model.number="newMealPlan.user_id" placeholder="Enter user ID" type="number" class="input" />
          <label>Week Start Date:</label>
          <input v-model="newMealPlan.week_start_date" type="date" class="input" />
          <button @click="createMealPlan" :disabled="loading.createMealPlan" class="btn-primary">
            {{ loading.createMealPlan ? 'Creating...' : 'Create Meal Plan' }}
          </button>
        </div>
        <div class="form-group">
          <h3>Add Recipe to Meal Plan</h3>
          <label>Plan ID:</label>
          <input v-model.number="newMealPlanRecipe.plan_id" placeholder="Enter plan ID" type="number" class="input" />
          <label>Recipe ID:</label>
          <input v-model.number="newMealPlanRecipe.recipe_id" placeholder="Enter recipe ID" type="number" class="input" />
          <label>Date:</label>
          <input v-model="newMealPlanRecipe.date" type="date" class="input" />
          <label>Meal Type:</label>
          <select v-model="newMealPlanRecipe.meal_type" class="input">
            <option>BREAKFAST</option>
            <option>LUNCH</option>
            <option>DINNER</option>
            <option>SNACK</option>
          </select>
          <label>Planned Servings:</label>
          <input v-model.number="newMealPlanRecipe.planned_servings" placeholder="Number of servings" type="number" step="0.01" class="input" />
          <button @click="addRecipeToMealPlan" :disabled="loading.createMealPlan" class="btn-primary">
            Add Recipe to Meal Plan
          </button>
        </div>
        <label>User ID to fetch:</label>
        <input v-model.number="mealPlanUserId" placeholder="Enter user ID" type="number" class="input" />
        <button @click="fetchMealPlansByUser" :disabled="loading.mealPlans" class="btn-primary">
          {{ loading.mealPlans ? 'Loading...' : 'Fetch User Meal Plans' }}
        </button>
        <div v-if="error.mealPlans" class="error">{{ error.mealPlans }}</div>
        <div v-if="success.mealPlans" class="success">{{ success.mealPlans }}</div>
        <div v-if="mealPlans.length > 0" class="data-display">
          <h3>Meal Plans:</h3>
          <ul>
            <li v-for="plan in mealPlans" :key="plan.id" class="list-item">
              <div class="item-content">
                <strong>Week of {{ new Date(plan.week_start_date).toLocaleDateString() }}</strong>
                <br>
                <small v-if="plan.meal_plan_recipe && plan.meal_plan_recipe.length">
                  Recipes: {{ plan.meal_plan_recipe.length }}
                </small>
                <small v-else>No recipes planned</small>
              </div>
              <div class="item-actions">
                <button @click="deleteMealPlan(plan.id)" class="btn-danger" :disabled="loading.delete">Delete</button>
              </div>
            </li>
          </ul>
        </div>
        <div v-else-if="!loading.mealPlans" class="no-data">No meal plans found</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Tabs
const tabs = ['Users', 'Recipes', 'Ingredients', 'Journal', 'Saved Recipes', 'Inventory', 'Meal Plans'];
const activeTab = ref('Users');

// Data states
const users = ref([]);
const recipes = ref([]);
const ingredients = ref([]);
const journalEntries = ref([]);
const savedRecipes = ref([]);
const inventories = ref([]);
const mealPlans = ref([]);

const loading = ref({
  users: false,
  recipes: false,
  ingredients: false,
  journal: false,
  savedRecipes: false,
  inventory: false,
  mealPlans: false,
  createUser: false,
  createRecipe: false,
  createIngredient: false,
  createJournal: false,
  createSavedRecipe: false,
  createInventory: false,
  createMealPlan: false,
  delete: false,
});

const error = ref({
  users: '',
  recipes: '',
  ingredients: '',
  journal: '',
  savedRecipes: '',
  inventory: '',
  mealPlans: '',
});

const success = ref({
  users: '',
  recipes: '',
  ingredients: '',
  journal: '',
  savedRecipes: '',
  inventory: '',
  mealPlans: '',
});

// Form states
const newUser = ref({ name: '', email: '' });
const newRecipe = ref({ name: '', user_id: null, servings: 1, kcal_per_serving: 0, protein_g_per_serving: 0, carbs_g_per_serving: 0, fat_g_per_serving: 0 });
const newIngredient = ref({ name: '', kcal_per_100g: 0, protein_g_per_100g: 0, carbs_g_per_100g: 0, fat_g_per_100g: 0 });
const newJournal = ref({ user_id: null, recipe_id: null, servings_eaten: 1, kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });
const newSavedRecipe = ref({ user_id: null, name: '', recipe_id: null, default_servings: 1 });
const newInventory = ref({ user_id: null });
const newInventoryIngredient = ref({ inventory_id: null, ingredient_id: null, qty_grams: 0 });
const newMealPlan = ref({ user_id: null, week_start_date: new Date().toISOString().split('T')[0] });
const newMealPlanRecipe = ref({ plan_id: null, recipe_id: null, date: new Date().toISOString().split('T')[0], meal_type: 'BREAKFAST', planned_servings: 1 });
const journalUserId = ref(null);
const savedRecipeUserId = ref(null);
const inventoryUserId = ref(null);
const mealPlanUserId = ref(null);

// Users
const fetchUsers = async () => {
  loading.value.users = true;
  error.value.users = '';
  try {
    const result = await window.electronService.users.getUsers();
    users.value = result;
  } catch (err) {
    error.value.users = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.users = false;
  }
};

const createUser = async () => {
  if (!newUser.value.name || !newUser.value.email) {
    error.value.users = 'Please fill in all fields';
    return;
  }
  loading.value.createUser = true;
  error.value.users = '';
  success.value.users = '';
  try {
    await window.electronService.users.createUser(newUser.value.email, newUser.value.name);
    success.value.users = 'User created successfully!';
    newUser.value = { name: '', email: '' };
    await fetchUsers();
  } catch (err) {
    error.value.users = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.createUser = false;
  }
};

const deleteUser = async (userId) => {
  if (!confirm('Delete this user?')) return;
  loading.value.delete = true;
  error.value.users = '';
  success.value.users = '';
  try {
    await window.electronService.users.deleteUser(userId);
    success.value.users = 'User deleted!';
    await fetchUsers();
  } catch (err) {
    error.value.users = `Error: ${err.message}`;
  } finally {
    loading.value.delete = false;
  }
};

// Recipes
const fetchRecipes = async () => {
  loading.value.recipes = true;
  error.value.recipes = '';
  try {
    const result = await window.electronService.recipes.getRecipes();
    recipes.value = result;
  } catch (err) {
    error.value.recipes = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.recipes = false;
  }
};

const createRecipe = async () => {
  if (!newRecipe.value.name || !newRecipe.value.user_id) {
    error.value.recipes = 'Please fill in required fields';
    return;
  }
  loading.value.createRecipe = true;
  error.value.recipes = '';
  success.value.recipes = '';
  try {
    await window.electronService.recipes.createRecipe({
      name: newRecipe.value.name,
      user_id: BigInt(newRecipe.value.user_id),
      servings: parseFloat(newRecipe.value.servings),
      kcal_per_serving: parseFloat(newRecipe.value.kcal_per_serving),
      protein_g_per_serving: parseFloat(newRecipe.value.protein_g_per_serving),
      carbs_g_per_serving: parseFloat(newRecipe.value.carbs_g_per_serving),
      fat_g_per_serving: parseFloat(newRecipe.value.fat_g_per_serving),
    });
    success.value.recipes = 'Recipe created!';
    newRecipe.value = { name: '', user_id: null, servings: 1, kcal_per_serving: 0, protein_g_per_serving: 0, carbs_g_per_serving: 0, fat_g_per_serving: 0 };
    await fetchRecipes();
  } catch (err) {
    error.value.recipes = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.createRecipe = false;
  }
};

const deleteRecipe = async (recipeId) => {
  if (!confirm('Delete this recipe?')) return;
  loading.value.delete = true;
  error.value.recipes = '';
  success.value.recipes = '';
  try {
    await window.electronService.recipes.deleteRecipe(recipeId);
    success.value.recipes = 'Recipe deleted!';
    await fetchRecipes();
  } catch (err) {
    error.value.recipes = `Error: ${err.message}`;
  } finally {
    loading.value.delete = false;
  }
};

// Ingredients
const fetchIngredients = async () => {
  loading.value.ingredients = true;
  error.value.ingredients = '';
  try {
    const result = await window.electronService.ingredients.getIngredients();
    ingredients.value = result;
  } catch (err) {
    error.value.ingredients = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.ingredients = false;
  }
};

const createIngredient = async () => {
  if (!newIngredient.value.name) {
    error.value.ingredients = 'Please enter ingredient name';
    return;
  }
  loading.value.createIngredient = true;
  error.value.ingredients = '';
  success.value.ingredients = '';
  try {
    await window.electronService.ingredients.createIngredient(
      newIngredient.value.name,
      parseFloat(newIngredient.value.kcal_per_100g),
      parseFloat(newIngredient.value.protein_g_per_100g),
      parseFloat(newIngredient.value.carbs_g_per_100g),
      parseFloat(newIngredient.value.fat_g_per_100g)
    );
    success.value.ingredients = 'Ingredient created!';
    newIngredient.value = { name: '', kcal_per_100g: 0, protein_g_per_100g: 0, carbs_g_per_100g: 0, fat_g_per_100g: 0 };
    await fetchIngredients();
  } catch (err) {
    error.value.ingredients = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.createIngredient = false;
  }
};

const deleteIngredient = async (ingredientId) => {
  if (!confirm('Delete this ingredient?')) return;
  loading.value.delete = true;
  error.value.ingredients = '';
  success.value.ingredients = '';
  try {
    await window.electronService.ingredients.deleteIngredient(ingredientId);
    success.value.ingredients = 'Ingredient deleted!';
    await fetchIngredients();
  } catch (err) {
    error.value.ingredients = `Error: ${err.message}`;
  } finally {
    loading.value.delete = false;
  }
};

// Journal
const fetchJournal = async () => {
  if (!journalUserId.value) {
    error.value.journal = 'Please enter a user ID';
    return;
  }
  loading.value.journal = true;
  error.value.journal = '';
  try {
    const result = await window.electronService.journal.getJournalEntries(BigInt(journalUserId.value));
    journalEntries.value = result;
  } catch (err) {
    error.value.journal = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.journal = false;
  }
};

const createJournalEntry = async () => {
  if (!newJournal.value.user_id || !newJournal.value.recipe_id) {
    error.value.journal = 'Please fill in all required fields';
    return;
  }
  loading.value.createJournal = true;
  error.value.journal = '';
  success.value.journal = '';
  try {
    await window.electronService.journal.createJournalEntry(
      BigInt(newJournal.value.user_id),
      BigInt(newJournal.value.recipe_id),
      parseFloat(newJournal.value.servings_eaten),
      parseFloat(newJournal.value.kcal),
      parseFloat(newJournal.value.protein_g),
      parseFloat(newJournal.value.carbs_g),
      parseFloat(newJournal.value.fat_g)
    );
    success.value.journal = 'Journal entry logged!';
    newJournal.value = { user_id: null, recipe_id: null, servings_eaten: 1, kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };
    if (journalUserId.value) await fetchJournal();
  } catch (err) {
    error.value.journal = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.createJournal = false;
  }
};

const deleteJournalEntry = async (entryId) => {
  if (!confirm('Delete this entry?')) return;
  loading.value.delete = true;
  error.value.journal = '';
  success.value.journal = '';
  try {
    await window.electronService.journal.deleteJournalEntry(entryId);
    success.value.journal = 'Entry deleted!';
    if (journalUserId.value) await fetchJournal();
  } catch (err) {
    error.value.journal = `Error: ${err.message}`;
  } finally {
    loading.value.delete = false;
  }
};

// Saved Recipes
const fetchSavedRecipes = async () => {
  if (!savedRecipeUserId.value) {
    error.value.savedRecipes = 'Please enter a user ID';
    return;
  }
  loading.value.savedRecipes = true;
  error.value.savedRecipes = '';
  try {
    const result = await window.electronService.savedRecipes.getSavedRecipes(BigInt(savedRecipeUserId.value));
    savedRecipes.value = result;
  } catch (err) {
    error.value.savedRecipes = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.savedRecipes = false;
  }
};

const createSavedRecipe = async () => {
  if (!newSavedRecipe.value.user_id || !newSavedRecipe.value.name || !newSavedRecipe.value.recipe_id) {
    error.value.savedRecipes = 'Please fill in all required fields';
    return;
  }
  loading.value.createSavedRecipe = true;
  error.value.savedRecipes = '';
  success.value.savedRecipes = '';
  try {
    await window.electronService.savedRecipes.createSavedRecipe(
      BigInt(newSavedRecipe.value.user_id),
      newSavedRecipe.value.name,
      BigInt(newSavedRecipe.value.recipe_id),
      parseFloat(newSavedRecipe.value.default_servings)
    );
    success.value.savedRecipes = 'Recipe saved!';
    newSavedRecipe.value = { user_id: null, name: '', recipe_id: null, default_servings: 1 };
    if (savedRecipeUserId.value) await fetchSavedRecipes();
  } catch (err) {
    error.value.savedRecipes = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.createSavedRecipe = false;
  }
};

const deleteSavedRecipe = async (recipeId) => {
  if (!confirm('Delete this saved recipe?')) return;
  loading.value.delete = true;
  error.value.savedRecipes = '';
  success.value.savedRecipes = '';
  try {
    await window.electronService.savedRecipes.deleteSavedRecipe(recipeId);
    success.value.savedRecipes = 'Saved recipe deleted!';
    if (savedRecipeUserId.value) await fetchSavedRecipes();
  } catch (err) {
    error.value.savedRecipes = `Error: ${err.message}`;
  } finally {
    loading.value.delete = false;
  }
};

// Inventory
const createInventory = async () => {
  if (!newInventory.value.user_id) {
    error.value.inventory = 'Please fill in all fields';
    return;
  }
  loading.value.createInventory = true;
  error.value.inventory = '';
  success.value.inventory = '';
  try {
    // Check if inventory already exists for this user
    const existing = await window.electronService.inventory.getInventoryByUserId(BigInt(newInventory.value.user_id));
    if (existing) {
      success.value.inventory = 'Inventory already exists for this user! Fetching...';
      inventoryUserId.value = newInventory.value.user_id;
      await fetchInventoriesByUser();
      return;
    }
    
    await window.electronService.inventory.createInventory(BigInt(newInventory.value.user_id));
    success.value.inventory = 'Inventory created successfully!';
    inventoryUserId.value = newInventory.value.user_id;
    newInventory.value = { user_id: null };
    await fetchInventoriesByUser();
  } catch (err) {
    error.value.inventory = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.createInventory = false;
  }
};

const fetchInventoriesByUser = async () => {
  if (!inventoryUserId.value) {
    error.value.inventory = 'Please enter a user ID';
    return;
  }
  loading.value.inventory = true;
  error.value.inventory = '';
  try {
    const result = await window.electronService.inventory.getInventoryByUserId(BigInt(inventoryUserId.value));
    inventories.value = result ? [result] : [];
  } catch (err) {
    error.value.inventory = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.inventory = false;
  }
};

const addIngredientToInventory = async () => {
  if (!newInventoryIngredient.value.inventory_id || !newInventoryIngredient.value.ingredient_id) {
    error.value.inventory = 'Please fill in all fields';
    return;
  }
  loading.value.createInventory = true;
  error.value.inventory = '';
  success.value.inventory = '';
  try {
    await window.electronService.inventory.addIngredientToInventory(
      BigInt(newInventoryIngredient.value.inventory_id),
      BigInt(newInventoryIngredient.value.ingredient_id),
      newInventoryIngredient.value.qty_grams
    );
    success.value.inventory = 'Ingredient added to inventory!';
    newInventoryIngredient.value = { inventory_id: null, ingredient_id: null, qty_grams: 0 };
    if (inventoryUserId.value) await fetchInventoriesByUser();
  } catch (err) {
    error.value.inventory = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.createInventory = false;
  }
};

const deleteInventory = async (inventoryId) => {
  if (!confirm('Delete this inventory?')) return;
  loading.value.delete = true;
  error.value.inventory = '';
  success.value.inventory = '';
  try {
    await window.electronService.inventory.deleteInventory(inventoryId);
    success.value.inventory = 'Inventory deleted!';
    if (inventoryUserId.value) await fetchInventoriesByUser();
  } catch (err) {
    error.value.inventory = `Error: ${err.message}`;
  } finally {
    loading.value.delete = false;
  }
};

// Meal Plans
const createMealPlan = async () => {
  if (!newMealPlan.value.user_id || !newMealPlan.value.week_start_date) {
    error.value.mealPlans = 'Please fill in all fields';
    return;
  }
  loading.value.createMealPlan = true;
  error.value.mealPlans = '';
  success.value.mealPlans = '';
  try {
    await window.electronService.mealPlans.createMealPlan(
      BigInt(newMealPlan.value.user_id),
      new Date(newMealPlan.value.week_start_date)
    );
    success.value.mealPlans = 'Meal plan created successfully!';
    newMealPlan.value = { user_id: null, week_start_date: new Date().toISOString().split('T')[0] };
    if (mealPlanUserId.value) await fetchMealPlansByUser();
  } catch (err) {
    error.value.mealPlans = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.createMealPlan = false;
  }
};

const fetchMealPlansByUser = async () => {
  if (!mealPlanUserId.value) {
    error.value.mealPlans = 'Please enter a user ID';
    return;
  }
  loading.value.mealPlans = true;
  error.value.mealPlans = '';
  try {
    const result = await window.electronService.mealPlans.getMealPlans(BigInt(mealPlanUserId.value));
    mealPlans.value = result;
  } catch (err) {
    error.value.mealPlans = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.mealPlans = false;
  }
};

const addRecipeToMealPlan = async () => {
  if (!newMealPlanRecipe.value.plan_id || !newMealPlanRecipe.value.recipe_id) {
    error.value.mealPlans = 'Please fill in all fields';
    return;
  }
  loading.value.createMealPlan = true;
  error.value.mealPlans = '';
  success.value.mealPlans = '';
  try {
    await window.electronService.mealPlans.addRecipeToMealPlan(
      BigInt(newMealPlanRecipe.value.plan_id),
      BigInt(newMealPlanRecipe.value.recipe_id),
      new Date(newMealPlanRecipe.value.date),
      newMealPlanRecipe.value.meal_type,
      newMealPlanRecipe.value.planned_servings
    );
    success.value.mealPlans = 'Recipe added to meal plan!';
    newMealPlanRecipe.value = { plan_id: null, recipe_id: null, date: new Date().toISOString().split('T')[0], meal_type: 'BREAKFAST', planned_servings: 1 };
    if (mealPlanUserId.value) await fetchMealPlansByUser();
  } catch (err) {
    error.value.mealPlans = `Error: ${err.message}`;
    console.error('Error:', err);
  } finally {
    loading.value.createMealPlan = false;
  }
};

const deleteMealPlan = async (planId) => {
  if (!confirm('Delete this meal plan?')) return;
  loading.value.delete = true;
  error.value.mealPlans = '';
  success.value.mealPlans = '';
  try {
    await window.electronService.mealPlans.deleteMealPlan(planId);
    success.value.mealPlans = 'Meal plan deleted!';
    if (mealPlanUserId.value) await fetchMealPlansByUser();
  } catch (err) {
    error.value.mealPlans = `Error: ${err.message}`;
  } finally {
    loading.value.delete = false;
  }
};

onMounted(() => {
  console.log('App mounted - electronService:', window.electronService);
});
</script>

<style scoped>
.container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  border-bottom: 2px solid #ddd;
}

.tab-button {
  background: #f0f0f0;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background: #e0e0e0;
}

.tab-button.active {
  background: white;
  border-bottom-color: #007bff;
  color: #007bff;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.test-section {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.test-section h2 {
  color: #555;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.test-section h3 {
  color: #666;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.form-group {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

label {
  display: block;
  margin-top: 0.75rem;
  margin-bottom: 0.35rem;
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.btn-danger:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  color: #d32f2f;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #ffebee;
  border-radius: 4px;
  border-left: 4px solid #d32f2f;
}

.success {
  color: #388e3c;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #e8f5e9;
  border-radius: 4px;
  border-left: 4px solid #388e3c;
}

.data-display {
  margin-top: 1.5rem;
}

.data-display h3 {
  margin-top: 0;
  color: #555;
}

.data-display ul {
  list-style: none;
  padding: 0;
}

.list-item {
  background: white;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 4px;
  border-left: 4px solid #007bff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-content {
  flex: 1;
}

.item-content small {
  color: #666;
  display: block;
  margin-top: 0.5rem;
  word-break: break-word;
}

.item-actions {
  margin-left: 1rem;
  flex-shrink: 0;
}

.no-data {
  color: #999;
  font-style: italic;
  margin-top: 1rem;
}
</style>
