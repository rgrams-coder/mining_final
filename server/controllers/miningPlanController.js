const MiningPlan = require('../models/MiningPlan');
const User = require('../models/User'); // Assuming User model is needed for associating plans with users
const fs = require('fs');
const path = require('path');

// @desc    Submit a new mining plan query
// @route   POST /api/mining-plan/submit
// @access  Private
exports.submitMiningPlan = async (req, res) => {
  try {
    const { title, description, username } = req.body;
    const user = await User.findById(req.user.id); // ID from auth middleware

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure the username from the request matches the authenticated user's username
    // or if an admin is submitting on behalf of a user (requires admin role check - not implemented here)
    if (user.username !== username && !user.isAdmin) { // Assuming an isAdmin field for admin users
        // If not admin and username doesn't match, deny
        // For now, let's assume only users can submit for themselves or username in body is the authenticated user's
        if (user.username !== username) {
             return res.status(403).json({ message: 'Not authorized to submit for this user' });
        }
    }

    let filePath = null;
    let fileName = null;

    if (req.file) {
      // Save file path and original name
      // The path should be relative to a public/uploads directory or similar
      // For simplicity, storing relative path from server root. Adjust as needed.
      filePath = req.file.path; // multer provides path
      fileName = req.file.originalname;
    }

    const newPlan = new MiningPlan({
      user: req.user.id,
      username: username, // Store username for easier frontend queries if needed
      title,
      description,
      filePath,
      fileName,
      // status will default to 'Pending'
    });

    const savedPlan = await newPlan.save();

    res.status(201).json({ 
        message: 'Mining plan query submitted successfully!', 
        query: savedPlan 
    });

  } catch (error) {
    console.error('Error submitting mining plan:', error);
    // If there's a file and an error occurs, attempt to delete the uploaded file
    if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting file after submission error:', err);
        });
    }
    res.status(500).json({ message: 'Server error while submitting mining plan.', error: error.message });
  }
};

// @desc    Get all mining plan queries for a specific user
// @route   GET /api/mining-plan/queries/:username
// @access  Private (User can get their own, Admin can get any)
exports.getUserMiningPlans = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // User can only fetch their own plans unless they are an admin
    if (user.username !== req.params.username && !user.isAdmin) { // Assuming isAdmin field
      return res.status(403).json({ message: 'Not authorized to view these mining plans' });
    }

    const plans = await MiningPlan.find({ username: req.params.username }).sort({ submittedAt: -1 });
    res.json(plans);
  } catch (error) {
    console.error('Error fetching user mining plans:', error);
    res.status(500).json({ message: 'Server error while fetching mining plans.' });
  }
};

// @desc    Get a single mining plan query by ID
// @route   GET /api/mining-plan/:id
// @access  Private (User can get their own, Admin can get any)
exports.getMiningPlanById = async (req, res) => {
    try {
        const plan = await MiningPlan.findById(req.params.id).populate('user', 'name username email');
        if (!plan) {
            return res.status(404).json({ message: 'Mining plan not found' });
        }

        // Check if the logged-in user is the owner of the plan or an admin
        const user = await User.findById(req.user.id);
        if (plan.user._id.toString() !== req.user.id && !user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this mining plan' });
        }

        res.json(plan);
    } catch (error) {
        console.error('Error fetching mining plan by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update mining plan status (Admin only)
// @route   PUT /api/mining-plan/:id/status
// @access  Private (Admin)
exports.updateMiningPlanStatus = async (req, res) => {
    try {
        // First, check if the user is an admin (auth middleware should ideally add user role)
        const adminUser = await User.findById(req.user.id);
        if (!adminUser || !adminUser.isAdmin) { // Assuming an 'isAdmin' field in User model
            return res.status(403).json({ message: 'Not authorized to update status. Admin access required.' });
        }

        const { status, adminNotes } = req.body;
        const plan = await MiningPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Mining plan not found' });
        }

        plan.status = status || plan.status;
        if (adminNotes) plan.adminNotes = adminNotes;
        plan.respondedAt = Date.now(); // Update respondedAt when status changes by admin

        const updatedPlan = await plan.save();
        res.json(updatedPlan);
    } catch (error) {
        console.error('Error updating mining plan status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all mining plan queries (Admin only)
// @route   GET /api/mining-plan/all
// @access  Private (Admin)
exports.getAllMiningPlans = async (req, res) => {
    try {
        const adminUser = await User.findById(req.user.id);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(403).json({ message: 'Not authorized. Admin access required.' });
        }

        const plans = await MiningPlan.find({}).populate('user', 'name username email').sort({ submittedAt: -1 });
        res.json(plans);
    } catch (error) {
        console.error('Error fetching all mining plans:', error);
        res.status(500).json({ message: 'Server error' });
    }
};