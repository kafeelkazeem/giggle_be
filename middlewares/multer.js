import multer from 'multer';

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save the original filename
  },
});

// File filter to validate only images
const fileFilter = (req, res, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif/;

  // Check the file extension
  const extname = allowedTypes.test(file.mimetype);

  // Check MIME type
  if (extname) {
    cb(null, true); // Accept the file
  } else {
    res.status(401).json({error: 'Only image files (jpeg, jpg, png, gif) are allowed!'})
    //cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'), false); // Reject the file
  }
};

// Configure Multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit (optional)
  },
});

export default upload;
