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
        // Step 1: Authenticate the user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            return res.status(400).json({ error: authError.message });
        }

        if (!authData.user) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        // Step 2: Fetch the user's profile from our public.profiles table
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, occupation')
            .eq('id', authData.user.id) // Get profile where id matches the logged-in user's id
            .single(); // We expect only one result

        if (profileError) {
            // This might happen if the trigger failed for some reason
            return res.status(500).json({ error: 'Could not fetch user profile.' });
        }

        // Step 3: Combine auth and profile data into a single response
        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                full_name: profileData.full_name, // From profiles table
                occupation: profileData.occupation, // From profiles table
            },
            token: authData.session.access_token,
        });

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
    // The `protect` middleware gives us `req.user`, which is the auth user object.
    // We use its ID to fetch the corresponding profile.
    try {
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, occupation')
            .eq('id', req.user.id)
            .single();

        if (profileError) {
            return res.status(404).json({ error: 'User profile not found.' });
        }

        // Combine auth info with profile info for a complete response
        const userProfile = {
            id: req.user.id,
            email: req.user.email,
            ...profileData
        };

        res.status(200).json(userProfile);

    } catch (error) {
        res.status(500).json({ error: 'Server error fetching profile.' });
    }
};


// Add the new function to the exports
module.exports = {
    registerUser,
    loginUser,
    getUserProfile, // <-- Add this
};