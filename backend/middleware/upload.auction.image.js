const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadFolder = path.join(__dirname, '..', 'uploads', 'auctions');
        // Create the folder if it doesn't exist
        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, { recursive: true });
        }
        cb(null, uploadFolder); // Set the destination folder
    },
    filename: (req, file, cb) => {
        // Generate a unique filename using auction_name and timestamp
        const auctionName = req.body.auction_name || 'default';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname); // Get file extension
        cb(null, `${auctionName.replace(/\s+/g, '_')}_${timestamp}${ext}`);
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only JPEG, PNG, and JPG files are allowed'), false);
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
}).single('auction_img'); // Accept only one file with the name 'auction_img'

// Middleware function
const uploadAuctionImage = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }

        // If a file is uploaded, generate the full URL and attach it to the request
        if (req.file) {
            const fullUrl = `/uploads/auctions/${req.file.filename}`;
            req.auction_img_url = fullUrl; // Attach the full image URL to the request object
            res.locals.auction_img_url = fullUrl;
        }

        next(); // Proceed to the next middleware or controller
    });
};

module.exports = uploadAuctionImage;