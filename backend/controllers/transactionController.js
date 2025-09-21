const supabase = require('../config/supabaseClient');

/**
 * @desc    Get expense summary for a given period
 * @route   GET /api/transactions/summary
 * @access  Private
 */

const getExpenseSummary = async (req, res) => {
    try {
        const period = req.query.period || 'weekly';
        // ... (date calculation logic remains the same) ...
        const today = new Date();
        let startDate = new Date(today);
        let endDate = new Date(today);

        switch (period) {
            case 'monthly':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;
            case 'yearly':
                startDate = new Date(today.getFullYear(), 0, 1);
                endDate = new Date(today.getFullYear(), 11, 31);
                break;
            case 'weekly':
            default:
                startDate.setDate(today.getDate() - today.getDay());
                endDate.setDate(startDate.getDate() + 6);
                break;
        }

        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = endDate.toISOString().split('T')[0];

        // The RPC call is the same
        const { data, error } = await supabase.rpc('get_expense_summary', {
            start_date: startDateString,
            end_date: endDateString
        });

        if (error) { throw error; }

        // The data is now a single object, not an array
        res.status(200).json(data);

    } catch (error) {
        console.error(`Error fetching expense summary: ${error.message}`);
        res.status(500).json({ error: 'Server error fetching expense summary' });
    }
};

module.exports = {
    getExpenseSummary,
};