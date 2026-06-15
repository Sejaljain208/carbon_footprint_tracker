const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Transport', 'Energy', 'Diet', 'Other'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      default: 'kg',
    },
    emission: {
      type: Number,
      required: true, // CO2e in kg
    },
    source: {
      type: String,
      enum: ['manual', 'ai_analyzed'],
      default: 'manual',
    },
    aiAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    completed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
