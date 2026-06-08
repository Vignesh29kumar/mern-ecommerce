const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { productValidation } = require('../validations/productValidation');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, adminOnly, productValidation, createProduct);
router.put('/:id', protect, adminOnly, productValidation, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
