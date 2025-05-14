const mongoose = require('mongoose');

const MiningPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true, // Keep username for easier querying from frontend if needed
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  filePath: {
    type: String, // Path to the uploaded file
  },
  fileName: {
    type: String, // Original name of the uploaded file
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Rejected'],
    default: 'Pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  // Optional: Add fields for admin responses or feedback
  adminNotes: {
    type: String,
  },
  respondedAt: {
    type: Date,
  }
});

module.exports = mongoose.model('MiningPlan', MiningPlanSchema);