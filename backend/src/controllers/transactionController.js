const asyncHandler = require('../middleware/asyncHandler');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// @desc   Create a transaction
// @route  POST /api/transactions
// @access Private
const createTransaction = asyncHandler(async (req, res) => {
  const { categoryId, amount, description, date } = req.body;

  const category = await Category.findOne({ _id: categoryId, userId: req.user._id });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const transaction = await Transaction.create({
    userId: req.user._id,
    categoryId: category._id,
    type: category.type,
    amount,
    description,
    date,
  });

  res.status(201).json({ success: true, data: transaction });
});

// @desc   Get transactions (filterable, paginated)
// @route  GET /api/transactions
// @access Private
const getTransactions = asyncHandler(async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.type) filter.type = req.query.type;
  if (req.query.categoryId) filter.categoryId = req.query.categoryId;
  if (req.query.startDate || req.query.endDate) {
    filter.date = {};
    if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
    if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate('categoryId', 'name type color')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Transaction.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: transactions.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: transactions,
  });
});

// @desc   Update a transaction
// @route  PUT /api/transactions/:id
// @access Private
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  const { categoryId, amount, description, date } = req.body;

  if (categoryId !== undefined) {
    const category = await Category.findOne({ _id: categoryId, userId: req.user._id });
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    transaction.categoryId = category._id;
    transaction.type = category.type;
  }
  if (amount !== undefined) transaction.amount = amount;
  if (description !== undefined) transaction.description = description;
  if (date !== undefined) transaction.date = date;

  await transaction.save();
  res.status(200).json({ success: true, data: transaction });
});

// @desc   Delete a transaction
// @route  DELETE /api/transactions/:id
// @access Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  await transaction.deleteOne();
  res.status(200).json({ success: true, message: 'Transaction deleted' });
});

// @desc   Dashboard summary — totals + spend by category
// @route  GET /api/transactions/summary
// @access Private
const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const totals = await Transaction.aggregate([
    { $match: { userId } },
    { $group: { _id: '$type', total: { $sum: '$amount' } } },
  ]);

  const income = totals.find((t) => t._id === 'income')?.total || 0;
  const expense = totals.find((t) => t._id === 'expense')?.total || 0;

  const byCategory = await Transaction.aggregate([
    { $match: { userId } },
    { $group: { _id: '$categoryId', total: { $sum: '$amount' } } },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' },
    {
      $project: {
        _id: 0,
        categoryId: '$_id',
        name: '$category.name',
        type: '$category.type',
        color: '$category.color',
        total: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);

  res.status(200).json({
    success: true,
    data: { income, expense, balance: income - expense, byCategory },
  });
});

module.exports = { createTransaction, getTransactions, updateTransaction, deleteTransaction, getSummary };