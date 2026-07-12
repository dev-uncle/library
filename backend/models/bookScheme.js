const mongoose = require('mongoose')

// defining book collection structure
const bookSchemeStructure = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book Title is Required'],
    trim: true,
  },
  image: {
    type: String, //Image File path stored here
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    required: [true, 'Book Category is Required'],
  },
  available: {
    type: Boolean,
    default: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 0,
  },
  bookFile: {
    type: String,
    default: "",
  },
  featured: {
    type: Boolean,
    default: false,
  },
  language: {
    type: String,
    required: true,
    trim: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  searchCount: {
    type: Number,
    default: 0,
  },
  createdAdded: {
    type: Date,
    default: Date.now(),
  },
})

// Pre-save middleware
// Converting Category to all UPPERCASE and setting availability
bookSchemeStructure.pre('save', function (next) {
  if (this.category) {
    this.category = this.category.toUpperCase()
  }
  if (typeof this.quantity === 'number') {
    this.available = this.quantity > 0
  }
  next()
})

module.exports = mongoose.model('BooksList', bookSchemeStructure)

// Books Properties : id,title,image,author,description,category,available
