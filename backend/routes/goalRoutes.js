const express = require('express');
const router = express.Router();
const { getGoals } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file will be protected
router.use(protect);

// GET /api/goals - Fetch all goals for the logged-in user
router.get('/', getGoals);

// We will add POST, PUT, DELETE routes here later

module.exports = router;