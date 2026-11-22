const express = require('express');
const router = express.Router();
const {
  submitEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  exportEnquiriesCSV,
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth');
const { enquiryLimiter } = require('../middleware/rateLimiter');

// Public route to submit enquiry with rate limit
router.post('/', enquiryLimiter, submitEnquiry);

// Admin protected routes
router.get('/', protect, getEnquiries);
router.get('/export/csv', protect, exportEnquiriesCSV);
router.get('/:id', protect, getEnquiryById);
router.put('/:id', protect, updateEnquiry);
router.delete('/:id', protect, deleteEnquiry);

module.exports = router;
