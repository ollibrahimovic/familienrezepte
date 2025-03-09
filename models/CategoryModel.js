const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  sorting: { type: Number, default: 0 },
  addedAt: { type: Date, default: Date.now },
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;