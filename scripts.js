const usersKey = 'recipeOrganizerUsers';
const currentUserKey = 'currentUser';
const recipesKey = 'recipeOrganizerRecipes';

function getUsers() {
    return JSON.parse(localStorage.getItem(usersKey)) || [];
}

function getCurrentUser() {
    return localStorage.getItem(currentUserKey);
}

function saveUsers(users) {
    localStorage.setItem(usersKey, JSON.stringify(users));
}

function setCurrentUser(username) {
    localStorage.setItem(currentUserKey, username);
}

function getRecipes() {
    return JSON.parse(localStorage.getItem(recipesKey)) || [];
}

function saveRecipes(recipes) {
    localStorage.setItem(recipesKey, JSON.stringify(recipes));
}

function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (!username || !password) {
        alert('Please enter a username and password.');
        return;
    }

    const users = getUsers();
    if (users.find(user => user.username === username)) {
        alert('Username already exists.');
        return;
    }

    users.push({ username, password });
    saveUsers(users);
    alert('Signup successful! Please login.');
    document.getElementById('signup-username').value = '';
    document.getElementById('signup-password').value = '';
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const users = getUsers();
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        alert('Invalid username or password.');
        return;
    }

    setCurrentUser(username);
    document.getElementById('auth').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadRecipes();
}

function logout() {
    localStorage.removeItem(currentUserKey);
    document.getElementById('auth').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
}

function addRecipe() {
    const title = document.getElementById('recipe-title').value;
    const category = document.getElementById('recipe-category').value;
    const instructions = document.getElementById('recipe-instructions').value;

    if (!title || !category || !instructions) {
        alert('Please fill out all fields.');
        return;
    }

    const recipes = getRecipes();
    recipes.push({
        id: Date.now(),
        user: getCurrentUser(),
        title,
        category,
        instructions
    });

    saveRecipes(recipes);
    document.getElementById('recipe-title').value = '';
    document.getElementById('recipe-category').value = '';
    document.getElementById('recipe-instructions').value = '';
    loadRecipes();
}

function deleteRecipe(id) {
    let recipes = getRecipes();
    recipes = recipes.filter(recipe => recipe.id !== id);
    saveRecipes(recipes);
    loadRecipes();
}

function editRecipe(id) {
    const title = prompt('Enter new title:');
    const category = prompt('Enter new category:');
    const instructions = prompt('Enter new instructions:');

    if (!title || !category || !instructions) {
        alert('Please fill out all fields.');
        return;
    }

    const recipes = getRecipes();
    const recipeIndex = recipes.findIndex(recipe => recipe.id === id);
    recipes[recipeIndex] = { ...recipes[recipeIndex], title, category, instructions };
    saveRecipes(recipes);
    loadRecipes();
}

function searchRecipes() {
    const query = document.getElementById('search-query').value.toLowerCase();
    const recipes = getRecipes().filter(recipe => 
        recipe.user === getCurrentUser() && 
        (recipe.title.toLowerCase().includes(query) || 
         recipe.category.toLowerCase().includes(query) ||
         recipe.instructions.toLowerCase().includes(query))
    );
    displayRecipes(recipes);
}

function loadRecipes() {
    const recipes = getRecipes().filter(recipe => recipe.user === getCurrentUser());
    displayRecipes(recipes);
}

function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.className = 'recipe';
        recipeElement.innerHTML = `
            <h4>${recipe.title}</h4>
            <p class="recipe-category">${recipe.category}</p>
            <p>${recipe.instructions}</p>
            <div class="recipe-buttons">
                <button onclick="editRecipe(${recipe.id})">Edit</button>
                <button onclick="deleteRecipe(${recipe.id})">Delete</button>
            </div>
        `;
        recipesContainer.appendChild(recipeElement);
    });
}

window.onload = function() {
    if (getCurrentUser()) {
        document.getElementById('auth').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadRecipes();
    }
}
