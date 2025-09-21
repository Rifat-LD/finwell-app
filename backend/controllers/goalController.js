const supabase = require('../config/supabaseClient');

/**
 * @desc    Get all savings goals for a user
 * @route   GET /api/goals
 * @access  Private
 */
const getGoals = async (req, res) => {
    try {
        // The user's ID is available from our `protect` middleware
        const userId = req.user.id;

        // Fetch all goals where the user_id matches
        const { data, error } = await supabase
            .from('goals')
            .select('*') // Select all columns for now
            .eq('user_id', userId)
            .order('created_at', { ascending: true }); // Show oldest goals first

        if (error) {
            throw error;
        }

        res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching goals:', error.message);
        res.status(500).json({ error: 'Server error fetching goals' });
    }
};

// We will add createGoal, updateGoal, deleteGoal functions here later
module.exports = {
    getGoals,
};