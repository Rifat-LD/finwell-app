const supabase = require('../config/supabaseClient');

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res) => {
    // Get email, password, name, and occupation from the request body
    const { email, password, name, occupation } = req.body; // <-- Updated

    // Basic validation, now including occupation
    if (!email || !password || !name || !occupation) { // <-- Updated
        return res.status(400).json({ error: 'Please provide email, password, name, and occupation' });
    }

    try {
        // Use Supabase auth to sign up the user
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                // Store additional user data here
                data: {
                    full_name: name,
                    occupation: occupation, // <-- Added occupation here
                }
            }
        });

        if (error) {
            // If Supabase returns an error, forward it to the client
            return res.status(400).json({ error: error.message });
        }

        // Supabase sends a confirmation email by default. The user object is available on 'data.user'
        if (data.user) {
            res.status(201).json({
                message: 'Registration successful! Please check your email to verify your account.',
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    full_name: data.user.user_metadata.full_name,
                    occupation: data.user.user_metadata.occupation, // <-- Added occupation to response
                }
            });
        } else {
            res.status(400).json({ error: "Could not register user." });
        }

    } catch (error) {
        res.status(500).json({ error: 'Server error during registration' });
    }
};

/**
 * @desc    Authenticate a user (login)
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
        // Use Supabase auth to sign in
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        if (data.user) {
            res.status(200).json({
                message: 'Login successful!',
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    full_name: data.user.user_metadata.full_name,
                    occupation: data.user.user_metadata.occupation, // <-- Added occupation to response
                },
                token: data.session.access_token, // This is the JWT
            });
        } else {
            res.status(400).json({ error: "Invalid credentials." });
        }

    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
    // Because our `protect` middleware ran first,
    // the user object is already attached to the request (`req.user`).
    // We can just send it back.
    res.status(200).json(req.user);
};


// Add the new function to the exports
module.exports = {
    registerUser,
    loginUser,
    getUserProfile, // <-- Add this
};