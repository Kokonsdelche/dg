const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'نام محصول الزامی است'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'توضیحات محصول الزامی است']
  },
  price: {
    type: Number,
    required: [true, 'قیمت الزامی است'],
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['شال', 'روسری', 'سایر']
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  colors: [{
    name: String,
    hex: String,
    stock: { type: Number, default: 0 }
  }],
  sizes: [{
    name: String,
    dimensions: String,
    stock: { type: Number, default: 0 }
  }],
  material: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  tags: [String],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ soldCount: -1 });

module.exports = mongoose.model('Product', productSchema); 