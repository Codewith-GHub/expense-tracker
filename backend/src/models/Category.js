const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [40, 'Category name cannot exceed 40 characters'],
    },
    type: {
      type: String,
      required: true,
      enum: {
        values: ['income', 'expense'],
        message: '{VALUE} is not a valid category type',
      },
    },
    color: {
      type: String,
      default: '#888780',
      match: [/^#([0-9A-Fa-f]{6})$/, 'Color must be a valid hex code'],
    },
  },
  { timestamps: true }
);

// Prevent the same user from creating two categories with the same name
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);