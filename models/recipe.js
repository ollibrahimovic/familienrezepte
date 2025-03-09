const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: String,
  servings: String,
  description: String,
  ingredients: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  image: String,
  preparationTime: Number,
  addedAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model('Recipe', RecipeSchema);
module.exports = Recipe;