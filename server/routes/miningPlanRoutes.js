const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Assuming auth middleware
const { 
    submitMiningPlan,
    getUserMiningPlans,
    getMiningPlanById,
    updateMiningPlanStatus,
    getAllMiningPlans 
} = require('../controllers/miningPlanController');
const upload = require('../middleware/upload'); // Middleware for file uploads

// @route   POST /api/mining-plan/submit
// @desc    Submit a new mining plan query
// @access  Private
router.post('/submit', protect, upload.single('file'), submitMiningPlan);

// @route   GET /api/mining-plan/queries/:username
// @desc    Get all mining plan queries for a specific user
// @access  Private
router.get('/queries/:username', protect, getUserMiningPlans);

// @route   GET /api/mining-plan/all
// @desc    Get all mining plan queries (Admin only)
// @access  Private (Admin)
router.get('/all', protect, getAllMiningPlans);

// @route   GET /api/mining-plan/:id
// @desc    Get a single mining plan query by ID
// @access  Private
router.get('/:id', protect, getMiningPlanById);

// @route   PUT /api/mining-plan/:id/status
// @desc    Update mining plan status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', protect, updateMiningPlanStatus);

module.exports = router;