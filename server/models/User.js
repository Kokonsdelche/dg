const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'نام الزامی است'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'نام خانوادگی الزامی است'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'ایمیل الزامی است'],
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'شماره تلفن الزامی است'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'رمز عبور الزامی است'],
    minlength: 6
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'ایران' }
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 