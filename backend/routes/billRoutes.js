const express = require('express');
const router = express.Router();
const { getUpcomingBills } = require('../controllers/billController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes in this file
router.use(protect);

// GET /api/bills/upcoming - Fetch upcoming bills
router.get('/upcoming', getUpcomingBills);

module.exports = router;