const supabase = require('../config/supabaseClient');

/**
 * @desc    Get the total balance of all accounts for a user
 * @route   GET /api/accounts/balance
 * @access  Private
 */
const getTotalBalance = async (req, res) => {
    try {
        // The `protect` middleware gives us the user's ID via `req.user.id`
        const userId = req.user.id;

        // Fetch all accounts belonging to this user
        const { data: accounts, error } = await supabase
            .from('accounts')
            .select('balance')
            .eq('user_id', userId);

        if (error) {
            throw error;
        }

        // Calculate the total balance by summing up the balances of all accounts
        const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

        res.status(200).json({ totalBalance });

    } catch (error) {
        console.error('Error fetching total balance:', error.message);
        res.status(500).json({ error: 'Server error fetching total balance' });
    }
};

module.exports = {
    getTotalBalance,
};