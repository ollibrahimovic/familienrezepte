const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Recipe = require('./models/recipe'); // Dein Rezeptmodell
const Category = require('./models/category'); // Dein Kategoriemodell
const app = express();

// Middleware einrichten
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// REST-API Endpunkte

// Route, um alle Rezepte einer bestimmten Kategorie abzurufen
app.get('/recipes/category/:categoryId', async (req, res) => {
  try {
    const recipes = await Recipe.find({ category: req.params.categoryId }).populate('category');
    res.json(recipes);  // Alle Rezepte mit der dazugehörigen Kategorie
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Rezepte', error });
  }
});

// Route, um alle Kategorien abzurufen
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find()
    .sort({ sortOrder: 1 })
    .populate('recipes');  // Hier werden die Recipe-IDs mit den vollständigen Recipe-Dokumenten ersetzt

    console.log(categories);
    res.json(categories);  // Alle Kategorien sortiert nach `sortOrder`
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Kategorien', error });
  }
});

// Ein einzelne Category abrufen
app.get('/category/:id', async (req, res) => {
  const cat = await Category.findById(req.params.id)
  .populate('recipes');  // Hier werden die Recipe-IDs mit den vollständigen Recipe-Dokumenten ersetzt

  res.json(cat);
});

// Favoritenstatus umschalten
app.put('/recipes/:id/favorite', async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe) {
      recipe.isFavorite = !recipe.isFavorite;
      await recipe.save();
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  });
 

// Alle Rezepte abrufen
app.get('/recipes', async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

// Ein einzelnes Rezept abrufen
app.get('/recipes/:id', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.json(recipe);
});

// Neues Rezept hinzufügen
app.post('/recipes', async (req, res) => {
  const newRecipe = new Recipe(req.body);
  await newRecipe.save();
  const category = await Category.findById(newRecipe.category);
  category.recipes.push(newRecipe._id);
  category.save();
  res.json(newRecipe);
});

// Rezept aktualisieren
app.put('/recipes/:id', async (req, res) => {
  const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedRecipe);
});

// Rezept löschen
app.delete('/recipes/:id', async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.json({ message: 'Recipe deleted' });
});

// Kategorie löschen
app.delete('/category/:id', async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Recipe deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
