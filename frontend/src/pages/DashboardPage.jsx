import React from 'react';
import CurrentBalanceCard from '../features/dashboard/CurrentBalanceCard'; // Import the new component
import SavingsGoalCard from "../features/dashboard/SavingsGoalCard";
import UpcomingBillsCard from "../features/dashboard/UpcomingBillsCard";
import ExpenseOverviewCard from '../features/dashboard/ExpenseOverviewCard';

const DashboardPage = () => {
    // Style for the dashboard grid layout
    const dashboardGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Responsive grid
        gap: '2rem',
    };

    return (
        <div>
            {/* We will add the main header (Search bar, etc.) here later */}

            <div style={dashboardGridStyle}>
                <CurrentBalanceCard/>
                <SavingsGoalCard/>
                <UpcomingBillsCard/>
            </div>

            <div style={{marginTop: '2rem', backgroundColor: '#2C2C2E', borderRadius: '20px', padding: '1.5rem'}}>
                <ExpenseOverviewCard/>
            </div>
        </div>
    );
};

export default DashboardPage;