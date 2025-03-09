const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const Category = require("./models/CategoryModel");
const Recipe  = require("./models/RecipeModel");
const User  = require("./models/UserModel");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
// Verbindung zu MongoDB herstellen
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
;

// Recipe Endpoints
app.post("/recipes", async (req, res) => {
  const recipe = new Recipe(req.body);
  await recipe.save();

  const cat = await Category.findById(recipe.category);
  if(cat) {
    cat.recipes.push(recipe.id);
    await cat.save();
  }
  res.status(201).json(recipe);
});

app.delete("/recipes/:id", async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.put("/recipes/:id", async (req, res) => {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(recipe);
});

app.get("/recipes/:id", async (req, res) => {
  let recipe = await Recipe.findById(req.params.id).populate("category");
  res.json(recipe);
});

app.get("/recipes", async (req, res) => {
  const recipes = await Recipe.find().populate("category");
  res.json(recipes);
});

app.get("/recipes/category/:categoryId", async (req, res) => {
  const recipes = await Recipe.find({ category: req.params.categoryId });
  res.json(recipes);
});

// Category Endpoints
app.post("/categories", async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.status(201).json(category);
});

app.delete("/categories/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.get("/categories", async (req, res) => {
  const categories = await Category.find().sort({ sorting: 1 });
  res.json(categories);
});


app.get("/categories/:id", async (req, res) => {
  let category = await Category.findById(req.params.id).populate("recipes");
  res.json(category);
});

// User Endpoints
app.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

app.get("/users/:userId", async (req, res) => {
  let user = await User.findOne({ userId: req.params.userId }).populate("favorites");
  if (!user) {
    user = new User({ userId: req.params.userId, favorites: [] });
    await user.save();
  }
  res.json(user);
});

app.get("/users/:userId/favorites/:recipeId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).send("User not found");
  var isMyFav = false;
  const index = user.favorites.indexOf(req.params.recipeId);
  if (index === -1) {
    isMyFav = false;
  } else {
    isMyFav = true;
  }
  res.json(isMyFav);
});

app.post("/users/:userId/favorites/:recipeId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).send("User not found");

  const index = user.favorites.indexOf(req.params.recipeId);
  if (index === -1) {
    user.favorites.push(req.params.recipeId);
  } else {
    user.favorites.splice(index, 1);
  }
  await user.save();
  const userRet = await User.findById(req.params.userId).populate("favorites");

  res.json(userRet);
});

app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
