const express = require('express');
const router = express.Router();
const { getExpenseSummary } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getExpenseSummary);


module.exports = router;