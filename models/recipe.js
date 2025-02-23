const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,  // Das Rezept benötigt einen Namen
    trim: true,      // Entfernt führende und abschließende Leerzeichen
  },
  portionsangabe: {
    type: String,    
    trim: true,      // Entfernt führende und abschließende Leerzeichen
  },
  description: {
    type: String,
    required: true,  // Das Rezept benötigt eine Beschreibung
  },
  ingredients: {
    type: [String]
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',  // Verweis auf das Category-Modell
    required: true    
  },
  image: {
    type: String,
    default: 'https://baconmockup.com/150/150',  // Standardbild, falls keines hochgeladen wird
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Das Rezept wird mit dem aktuellen Datum erstellt
  },
  isFavorite: { 
    type: Boolean, 
    default: false 
  }
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;