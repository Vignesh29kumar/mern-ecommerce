const { body } = require('express-validator');

const productValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('rate')
    .isFloat({ min: 0 })
    .withMessage('Rate must be a positive number'),
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),
  body('clothType')
    .notEmpty()
    .withMessage('Cloth type is required')
    .isIn(['shirt', 'pant', 'dress', 'jacket', 'shoes', 'accessories', 'other'])
    .withMessage('Invalid cloth type'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
];

module.exports = { productValidation };
