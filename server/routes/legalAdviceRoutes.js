const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Assuming auth middleware
const { 
    submitLegalAdvice,
    getUserLegalAdviceRequests,
    getLegalAdviceById,
    respondToLegalAdvice,
    getAllLegalAdviceRequests
} = require('../controllers/legalAdviceController');
const upload = require('../middleware/upload'); // Middleware for file uploads

// @route   POST /api/legal-advice/submit
// @desc    Submit a new legal advice request
// @access  Private
router.post('/submit', protect, upload.single('file'), submitLegalAdvice);

// @route   GET /api/legal-advice/requests
// @desc    Get all legal advice requests for the logged-in user
// @access  Private
router.get('/requests', protect, getUserLegalAdviceRequests);

// @route   GET /api/legal-advice/all
// @desc    Get all legal advice requests (Admin only)
// @access  Private (Admin)
router.get('/all', protect, getAllLegalAdviceRequests);

// @route   GET /api/legal-advice/:id
// @desc    Get a single legal advice request by ID
// @access  Private
router.get('/:id', protect, getLegalAdviceById);

// @route   PUT /api/legal-advice/:id/respond
// @desc    Respond to a legal advice request (Admin/Advisor only)
// @access  Private (Admin/Advisor)
router.put('/:id/respond', protect, respondToLegalAdvice);

module.exports = router;