const LegalAdvice = require('../models/LegalAdvice');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// @desc    Submit a new legal advice request
// @route   POST /api/legal-advice/submit
// @access  Private
exports.submitLegalAdvice = async (req, res) => {
  try {
    const { title, description } = req.body;
    const user = await User.findById(req.user.id); // ID from auth middleware

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let filePath = null;
    let fileName = null;

    if (req.file) {
      filePath = req.file.path;
      fileName = req.file.originalname;
    }

    const newAdviceRequest = new LegalAdvice({
      user: req.user.id,
      username: user.username, // Store username from authenticated user
      title,
      description,
      filePath,
      fileName,
    });

    const savedAdvice = await newAdviceRequest.save();
    res.status(201).json({ 
        message: 'Legal advice request submitted successfully!', 
        request: savedAdvice 
    });

  } catch (error) {
    console.error('Error submitting legal advice request:', error);
    if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting file after submission error:', err);
        });
    }
    res.status(500).json({ message: 'Server error while submitting legal advice.', error: error.message });
  }
};

// @desc    Get all legal advice requests for the logged-in user
// @route   GET /api/legal-advice/requests
// @access  Private
exports.getUserLegalAdviceRequests = async (req, res) => {
  try {
    const requests = await LegalAdvice.find({ user: req.user.id }).sort({ submittedAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching user legal advice requests:', error);
    res.status(500).json({ message: 'Server error while fetching legal advice requests.' });
  }
};

// @desc    Get a single legal advice request by ID
// @route   GET /api/legal-advice/:id
// @access  Private (User can get their own, Admin can get any)
exports.getLegalAdviceById = async (req, res) => {
    try {
        const advice = await LegalAdvice.findById(req.params.id).populate('user', 'name username email');
        if (!advice) {
            return res.status(404).json({ message: 'Legal advice request not found' });
        }

        const user = await User.findById(req.user.id);
        if (advice.user._id.toString() !== req.user.id && !user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this request' });
        }

        res.json(advice);
    } catch (error) {
        console.error('Error fetching legal advice by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Respond to a legal advice request (Admin/Advisor only)
// @route   PUT /api/legal-advice/:id/respond
// @access  Private (Admin/Advisor)
exports.respondToLegalAdvice = async (req, res) => {
    try {
        const adminUser = await User.findById(req.user.id);
        if (!adminUser || !adminUser.isAdmin) { // Assuming 'isAdmin' or a specific role for advisors
            return res.status(403).json({ message: 'Not authorized. Admin or Advisor access required.' });
        }

        const { response, status, adminNotes } = req.body;
        const adviceRequest = await LegalAdvice.findById(req.params.id);

        if (!adviceRequest) {
            return res.status(404).json({ message: 'Legal advice request not found' });
        }

        if (response) adviceRequest.response = response;
        if (status) adviceRequest.status = status;
        if (adminNotes) adviceRequest.adminNotes = adminNotes;
        adviceRequest.respondedAt = Date.now();

        const updatedAdvice = await adviceRequest.save();
        res.json(updatedAdvice);
    } catch (error) {
        console.error('Error responding to legal advice:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all legal advice requests (Admin only)
// @route   GET /api/legal-advice/all
// @access  Private (Admin)
exports.getAllLegalAdviceRequests = async (req, res) => {
    try {
        const adminUser = await User.findById(req.user.id);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(403).json({ message: 'Not authorized. Admin access required.' });
        }

        const requests = await LegalAdvice.find({}).populate('user', 'name username email').sort({ submittedAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching all legal advice requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
};