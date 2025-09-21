const express = require('express');
const router = express.Router();
const { getTotalBalance } = require('../controllers/accountController');
const { protect } = require('../middleware/authMiddleware');

// This route is protected. Only logged-in users can access it.
router.get('/balance', protect, getTotalBalance);

module.exports = router;