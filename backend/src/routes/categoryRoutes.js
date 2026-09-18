const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');

const router = express.Router();

router.use(protect); // every route below requires a valid JWT

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('color').optional().matches(/^#([0-9A-Fa-f]{6})$/).withMessage('Color must be a valid hex code'),
  ],
  validate,
  createCategory
);

router.get('/', getCategories);

router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('type').optional().isIn(['income', 'expense']),
    body('color').optional().matches(/^#([0-9A-Fa-f]{6})$/),
  ],
  validate,
  updateCategory
);

router.delete('/:id', deleteCategory);

module.exports = router;