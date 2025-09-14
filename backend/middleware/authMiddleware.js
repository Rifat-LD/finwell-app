const supabase = require('../config/supabaseClient');

const protect = async (req, res, next) => {
    let token;

    // Check if the 'Authorization' header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (e.g., "Bearer eyJhbGciOi...")
            token = req.headers.authorization.split(' ')[1];

            // Ask Supabase to verify the token (JWT)
            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error) {
                // This will catch invalid tokens, expired tokens, etc.
                return res.status(401).json({ error: 'Not authorized, token failed' });
            }

            if (user) {
                // If the token is valid, Supabase returns the user object.
                // We attach this user object to the request `req` object.
                // Now, any subsequent route handler can access `req.user`.
                req.user = user;
                next(); // Proceed to the next function in the middleware chain
            } else {
                return res.status(401).json({ error: 'Not authorized, no user found for this token' });
            }

        } catch (error) {
            console.error(error);
            return res.status(401).json({ error: 'Not authorized, token processing error' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }
};

module.exports = { protect };