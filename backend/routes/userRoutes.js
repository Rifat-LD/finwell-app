const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
// Define the route for user registration
// When a POST request is made to '/register', call the registerUser function
router.post('/register', registerUser);

// Define the route for user login
router.post('/login', loginUser);

router.get('/profile', protect, getUserProfile);

module.exports = router;