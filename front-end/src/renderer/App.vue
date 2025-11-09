<template>
  <div class="container">
    <h1>🍽️ Eat Free - API Test</h1>
    
    <!-- Users Section -->
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
              <small>ID: {{ user.id }} | Created: {{ new Date(user.created_at).toLocaleDateString() }}</small>
            </div>
            <div class="item-actions">
              <button @click="deleteUser(user.id)" class="btn-danger" :disabled="loading.delete">Delete</button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else-if="!loading.users" class="no-data">No users found</div>
    </div>

    <!-- Recipes Section -->
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
        <label>Protein (g) per Serving:</label>
        <input v-model.number="newRecipe.protein_g_per_serving" placeholder="Protein in grams" type="number" step="0.01" class="input" />
        <label>Carbs (g) per Serving:</label>
        <input v-model.number="newRecipe.carbs_g_per_serving" placeholder="Carbs in grams" type="number" step="0.01" class="input" />
        <label>Fat (g) per Serving:</label>
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
              <small>
                Servings: {{ recipe.servings }} | Kcal: {{ recipe.kcal_per_serving }} |
                Protein: {{ recipe.protein_g_per_serving }}g | Carbs: {{ recipe.carbs_g_per_serving }}g | Fat: {{ recipe.fat_g_per_serving }}g
              </small>
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
</template>

<script setup>
import { ref, onMounted } from 'vue';

const users = ref([]);
const recipes = ref([]);
const loading = ref({ users: false, recipes: false, createUser: false, createRecipe: false, delete: false });
const error = ref({ users: '', recipes: '' });
const success = ref({ users: '', recipes: '' });

const newUser = ref({ name: '', email: '' });
const newRecipe = ref({ 
  name: '', 
  user_id: null, 
  servings: 1, 
  kcal_per_serving: 0,
  protein_g_per_serving: 0,
  carbs_g_per_serving: 0,
  fat_g_per_serving: 0
});

const fetchUsers = async () => {
  loading.value.users = true;
  error.value.users = '';
  try {
    const result = await window.electronService.users.getUsers();
    users.value = result;
  } catch (err) {
    error.value.users = `Error fetching users: ${err.message}`;
    console.error('Error fetching users:', err);
  } finally {
    loading.value.users = false;
  }
};

const fetchRecipes = async () => {
  loading.value.recipes = true;
  error.value.recipes = '';
  try {
    const result = await window.electronService.recipes.getRecipes();
    recipes.value = result;
  } catch (err) {
    error.value.recipes = `Error fetching recipes: ${err.message}`;
    console.error('Error fetching recipes:', err);
  } finally {
    loading.value.recipes = false;
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
    error.value.users = `Error creating user: ${err.message}`;
    console.error('Error creating user:', err);
  } finally {
    loading.value.createUser = false;
  }
};

const createRecipe = async () => {
  if (!newRecipe.value.name || !newRecipe.value.user_id) {
    error.value.recipes = 'Please fill in name and user ID';
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
    success.value.recipes = 'Recipe created successfully!';
    newRecipe.value = { 
      name: '', 
      user_id: null, 
      servings: 1, 
      kcal_per_serving: 0,
      protein_g_per_serving: 0,
      carbs_g_per_serving: 0,
      fat_g_per_serving: 0
    };
    await fetchRecipes();
  } catch (err) {
    error.value.recipes = `Error creating recipe: ${err.message}`;
    console.error('Error creating recipe:', err);
  } finally {
    loading.value.createRecipe = false;
  }
};

const deleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return;
  
  loading.value.delete = true;
  error.value.users = '';
  success.value.users = '';
  try {
    await window.electronService.users.deleteUser(userId);
    success.value.users = 'User deleted successfully!';
    await fetchUsers();
  } catch (err) {
    error.value.users = `Error deleting user: ${err.message}`;
    console.error('Error deleting user:', err);
  } finally {
    loading.value.delete = false;
  }
};

const deleteRecipe = async (recipeId) => {
  if (!confirm('Are you sure you want to delete this recipe?')) return;
  
  loading.value.delete = true;
  error.value.recipes = '';
  success.value.recipes = '';
  try {
    await window.electronService.recipes.deleteRecipe(recipeId);
    success.value.recipes = 'Recipe deleted successfully!';
    await fetchRecipes();
  } catch (err) {
    error.value.recipes = `Error deleting recipe: ${err.message}`;
    console.error('Error deleting recipe:', err);
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
  max-width: 1000px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
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
}

.item-actions {
  margin-left: 1rem;
}

.no-data {
  color: #999;
  font-style: italic;
  margin-top: 1rem;
}
</style>
