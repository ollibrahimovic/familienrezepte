const mongoose = require('mongoose');

// Mongoose Schema für Rezepte
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Der Name der Kategorie ist erforderlich
    unique: true,    // Der Name sollte einzigartig sein
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
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;