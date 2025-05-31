const express = require('express');
const Product = require('../models/Product');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products with filters and pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isFeatured
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (isFeatured) filter.isFeatured = isFeatured === 'true';
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-reviews');

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Increment view count for each product if user is viewing
    if (req.user) {
      await Product.updateMany(
        { _id: { $in: products.map(p => p._id) } },
        { $inc: { viewCount: 1 } }
      );
    }

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('خطا در دریافت محصولات:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Get product by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'firstName lastName');

    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }

    // Increment view count
    await Product.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    res.json({ product });
  } catch (error) {
    console.error('خطا در دریافت محصول:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .limit(8)
      .sort({ soldCount: -1 })
      .select('-reviews');

    res.json({ products });
  } catch (error) {
    console.error('خطا در دریافت محصولات ویژه:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json({ categories });
  } catch (error) {
    console.error('خطا در دریافت دسته‌بندی‌ها:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Add product review
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === userId
    );

    if (existingReview) {
      return res.status(400).json({ message: 'شما قبلاً این محصول را نظر داده‌اید' });
    }

    // Add new review
    product.reviews.push({
      user: userId,
      rating,
      comment
    });

    // Calculate new average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.averageRating = totalRating / product.reviews.length;
    product.totalReviews = product.reviews.length;

    await product.save();

    res.status(201).json({ 
      message: 'نظر شما با موفقیت ثبت شد',
      averageRating: product.averageRating,
      totalReviews: product.totalReviews
    });
  } catch (error) {
    console.error('خطا در ثبت نظر:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const products = await Product.find({
      $text: { $search: query },
      isActive: true
    })
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-reviews');

    const total = await Product.countDocuments({
      $text: { $search: query },
      isActive: true
    });

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      query
    });
  } catch (error) {
    console.error('خطا در جستجو:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

module.exports = router; 