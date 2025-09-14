// Import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const supabase = require('./config/supabaseClient');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();
const userRoutes = require('./routes/userRoutes');

// Set the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable the express app to parse JSON formatted request bodies
app.use('/api/users', userRoutes);

// A simple test route to check if the server and supabase connection are working
app.get('/', async (req, res) => {
    try {
        // CORRECT WAY: Use the Supabase auth admin client to list users.
        // This correctly queries the 'auth.users' table.
        // We are just fetching the first user to test the connection.
        const { data: { users }, error } = await supabase.auth.admin.listUsers({
            page: 1,
            perPage: 1,
        });

        if (error) throw error;

        res.status(200).json({
            message: "Welcome to the FinWell API!",
            supabase_connection: "Successful",
            test_user_data: users
        });
    } catch (error) {
        res.status(500).json({
            message: "Welcome to the FinWell API!",
            supabase_connection: "Failed",
            error: error.message
        });
    }
});

// A simple test route to check if the server is running
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the FinWell API!" });
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});