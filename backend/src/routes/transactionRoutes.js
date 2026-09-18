const express = require('express');
const { body, query } = require('express-validator');
const validate = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require('../controllers/transactionController');

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);

router.post(
  '/',
  [
    body('categoryId').isMongoId().withMessage('Valid categoryId is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
    body('description').optional().isLength({ max: 200 }),
    body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  ],
  validate,
  createTransaction
);

router.get(
  '/',
  [
    query('type').optional().isIn(['income', 'expense']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  getTransactions
);

router.put(
  '/:id',
  [
    body('categoryId').optional().isMongoId(),
    body('amount').optional().isFloat({ gt: 0 }),
    body('description').optional().isLength({ max: 200 }),
    body('date').optional().isISO8601(),
  ],
  validate,
  updateTransaction
);

router.delete('/:id', deleteTransaction);

module.exports = router;