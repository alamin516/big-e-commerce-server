const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
  },
  description: String,
  category: [String],
  tags: [String],
  brands: [String],
  prices: {
    original: {
      type: Number,
      required: [true, 'Original price is required.'],
    },
    discounted: Number,
    discountPercentage: Number,
  },
  colors: [String],
  sizes: [String],
  quantity: {
    type: Number,
    required: [true, 'Quantity is required.'],
  },
  variants: [String],
  reviews: [String],
  ratings: {
    average: Number,
    total: Number,
  },
  image: String,
  saleEndTime: {
    type: Date,
    validate: {
      validator: function(value) {
        return value > Date.now();
      },
      message: 'Sale end time must be in the future.',
    },
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;