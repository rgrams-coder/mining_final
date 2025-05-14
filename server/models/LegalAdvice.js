const mongoose = require('mongoose');

const LegalAdviceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true, 
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
    enum: ['Pending', 'In Progress', 'Responded', 'Closed'],
    default: 'Pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  response: {
    type: String, // Text response from legal advisor
  },
  respondedAt: {
    type: Date,
  },
  adminNotes: {
    type: String, // Internal notes for admins/advisors
  }
});

module.exports = mongoose.model('LegalAdvice', LegalAdviceSchema);