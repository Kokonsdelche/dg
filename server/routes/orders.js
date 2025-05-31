const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product || !product.isActive) {
        return res.status(400).json({ 
          message: `محصول ${item.name} یافت نشد یا غیرفعال است` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `موجودی کافی برای محصول ${product.name} وجود ندارد` 
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image: product.images[0]?.url
      });
    }

    // Calculate shipping cost (example: free shipping over 500,000 Toman)
    const shippingCost = totalAmount >= 500000 ? 0 : 30000;
    const finalAmount = totalAmount + shippingCost;

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingCost,
      finalAmount,
      shippingAddress,
      paymentMethod
    });

    await order.save();

    // Update product stock and sold count
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { 
          stock: -item.quantity,
          soldCount: item.quantity
        }
      });
    }

    // Add order to user's order history
    await User.findByIdAndUpdate(userId, {
      $push: { orderHistory: order._id }
    });

    res.status(201).json({
      message: 'سفارش با موفقیت ثبت شد',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        shippingCost: order.shippingCost,
        finalAmount: order.finalAmount,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error) {
    console.error('خطا در ثبت سفارش:', error);
    res.status(500).json({ message: 'خطای سرور در ثبت سفارش' });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments({ user: userId });

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('خطا در دریافت سفارشات:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images')
      .populate('user', 'firstName lastName email phone');

    if (!order) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'دسترسی غیرمجاز' });
    }

    res.json({ order });
  } catch (error) {
    console.error('خطا در دریافت سفارش:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { cancelReason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'دسترسی غیرمجاز' });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        message: 'این سفارش قابل لغو نیست' 
      });
    }

    // Update order status
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = cancelReason;

    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 
          stock: item.quantity,
          soldCount: -item.quantity
        }
      });
    }

    res.json({ 
      message: 'سفارش با موفقیت لغو شد',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        cancelledAt: order.cancelledAt
      }
    });
  } catch (error) {
    console.error('خطا در لغو سفارش:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Track order
router.get('/:id/track', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .select('orderNumber orderStatus statusHistory trackingNumber estimatedDelivery deliveredAt');

    if (!order) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    res.json({
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      statusHistory: order.statusHistory,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      deliveredAt: order.deliveredAt
    });
  } catch (error) {
    console.error('خطا در پیگیری سفارش:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

module.exports = router; 