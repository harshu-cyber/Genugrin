const express = require('express');
const router = express.Router();
const {
  getAllContent,
  getContentSection,
  updateContentSection,
} = require('../controllers/contentController');
const { protect } = require('../middleware/auth');

router.get('/', getAllContent);
router.get('/:sectionKey', getContentSection);
router.put('/:sectionKey', protect, updateContentSection);

module.exports = router;
