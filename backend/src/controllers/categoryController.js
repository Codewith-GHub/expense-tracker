const asyncHandler = require('../middleware/asyncHandler');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

// @desc   Create a category
// @route  POST /api/categories
// @access Private
const createCategory = asyncHandler(async (req, res) => {
  const { name, type, color } = req.body;
  const category = await Category.create({ userId: req.user._id, name, type, color });
  res.status(201).json({ success: true, data: category });
});

// @desc   Get all categories for the logged-in user
// @route  GET /api/categories
// @access Private
const getCategories = asyncHandler(async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.type) filter.type = req.query.type;

  const categories = await Category.find(filter).sort({ name: 1 });
  res.status(200).json({ success: true, count: categories.length, data: categories });
});

// @desc   Update a category
// @route  PUT /api/categories/:id
// @access Private
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, userId: req.user._id });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const { name, type, color } = req.body;
  if (name !== undefined) category.name = name;
  if (type !== undefined) category.type = type;
  if (color !== undefined) category.color = color;

  await category.save();
  res.status(200).json({ success: true, data: category });
});

// @desc   Delete a category (blocked if transactions still reference it)
// @route  DELETE /api/categories/:id
// @access Private
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, userId: req.user._id });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const inUse = await Transaction.exists({ categoryId: category._id });
  if (inUse) {
    res.status(400);
    throw new Error('Cannot delete a category that has transactions — delete or reassign those first');
  }

  await category.deleteOne();
  res.status(200).json({ success: true, message: 'Category deleted' });
});

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };