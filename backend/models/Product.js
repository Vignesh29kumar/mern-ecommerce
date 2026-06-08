const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    rate: {
      type: Number,
      required: [true, 'Rate is required'],
      min: [0, 'Rate must be positive'],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    clothType: {
      type: String,
      required: [true, 'Cloth type is required'],
      enum: ['shirt', 'pant', 'dress', 'jacket', 'shoes', 'accessories', 'other'],
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Virtual: discounted price
productSchema.virtual('finalPrice').get(function () {
  return this.rate - (this.rate * this.discount) / 100;
});

module.exports = mongoose.model('Product', productSchema);
