const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the storage directory for uploads
const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Files will be saved in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Create a unique filename: fieldname-timestamp.extension
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// File filter to allow only certain file types (optional)
const fileFilter = (req, file, cb) => {
  // Example: Allow only images and PDFs
  // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
  //   cb(null, true);
  // } else {
  //   cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'), false);
  // }
  // For now, accept all files. Add specific filters as needed.
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB file size limit (adjust as needed)
  },
  fileFilter: fileFilter
});

module.exports = upload;