const supabase = require('../config/supabaseClient');

/**
 * @desc    Get upcoming bills for a user
 * @route   GET /api/bills/upcoming
 * @access  Private
 */
const getUpcomingBills = async (req, res) => {
    try {
        const userId = req.user.id;
        // Default to 'next30days' which is the most common use case
        const period = req.query.period || 'next30days';

        const today = new Date();
        const startDate = new Date(today);
        let endDate;

        // Updated switch statement with more useful, non-redundant periods
        switch (period) {
            case 'next7days':
                endDate = new Date(today);
                endDate.setDate(today.getDate() + 7);
                break;
            case 'thisquarter':
                // Renaming this logic to "Next 3 Months" for clarity and utility
                endDate = new Date(today);
                endDate.setMonth(today.getMonth() + 3);
                break;
            case 'all':
                // For 'all', we don't need an end date filter
                endDate = null;
                break;
            case 'next30days':
            default:
                endDate = new Date(today);
                endDate.setDate(today.getDate() + 30);
                break;
        }

        const startDateString = startDate.toISOString().split('T')[0];

        let query = supabase
            .from('bills')
            .select('*')
            .eq('user_id', userId)
            .gte('due_date', startDateString);

        // Only add the end date filter if it's not 'all'
        if (endDate) {
            const endDateString = endDate.toISOString().split('T')[0];
            query = query.lte('due_date', endDateString);
        }

        // Finalize the query
        const { data, error } = await query.order('due_date', { ascending: true });

        if (error) {
            throw error;
        }

        res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching upcoming bills:', error.message);
        res.status(500).json({ error: 'Server error fetching upcoming bills' });
    }
};

module.exports = {
    getUpcomingBills,
};