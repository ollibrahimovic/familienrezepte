const mongoose = require('mongoose');

// Mongoose Schema für Rezepte
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Der Name der Kategorie ist erforderlich
    unique: true,    // Der Name sollte einzigartig sein
  },
  image: { 
    type: String
  },
  description: {
    type: String,
    required: false, // Eine Beschreibung der Kategorie (optional)
  },
  sortOrder: {
    type: Number,
    default: 0,      // Definiert die Reihenfolge der Kategorien
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Das Erstellungsdatum der Kategorie
  },
  recipes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Recipe'  // Verweis auf das Category-Modell
  },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;