const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  brand: {
    type: String,
    default: "Generic",
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  discountPrice: {
    type: Number,
  },

  category: {
    type: String,
    required: true,
  },

  stock: {
    type: Number,
    required: true,
  },

  imageUrl: {
    type: String,
    required: true,
  },

  images: {
    type: [String],
    default: [],
  },

  rating: {
    type: Number,
    default: 4.5,
  },

  numReviews: {
    type: Number,
    default: 12,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  isBestSeller: {
    type: Boolean,
    default: false,
  },

  isNewArrival: {
    type: Boolean,
    default: false,
  },

  freeDelivery: {
    type: Boolean,
    default: true,
  },

  specifications: [
    {
      name: String,
      value: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);