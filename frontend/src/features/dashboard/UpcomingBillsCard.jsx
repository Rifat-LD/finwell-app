import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';

// Helper component for a single bill item
const BillItem = ({bill}) => {

    // Helper to format the large date circle
    const formatDateCircle = (dateString) => {
        const date = new Date(dateString + 'T00:00:00');
        const options = {month: 'short', day: 'numeric'};
        const [month, day] = date.toLocaleDateString('en-US', options).split(' ');

        // Add suffix to day (1st, 2nd, 3rd, 4th...)
        let dayWithSuffix = day;
        if (day.endsWith('1') && !day.endsWith('11')) dayWithSuffix += 'th'; // Note: Design shows 'th' for all, so we simplify.
        else if (day.endsWith('2') && !day.endsWith('12')) dayWithSuffix += 'th';
        else if (day.endsWith('3') && !day.endsWith('13')) dayWithSuffix += 'th';
        else dayWithSuffix += 'th';

        return {month, day: dayWithSuffix};
    };

    const {month, day} = formatDateCircle(bill.due_date);

    // --- STYLES FOR A SINGLE BILL ITEM ---
    const itemStyle = {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#485360', // Bluish-gray from design
        borderRadius: '20px',
        padding: '0.5rem',
        marginBottom: '0.5rem',
    };
    const circleStyle = {
        backgroundColor: '#ADFF2F', color: 'black', borderRadius: '50%',
        width: '60px', height: '60px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', flexShrink: 0,
    };
    const dateMonthStyle = {fontSize: '0.9rem'};
    const dateDayStyle = {fontSize: '0.9rem', lineHeight: 1.1};
    const amountCircleStyle = {...circleStyle, width: '60px', height: '60px', fontSize: '1rem'};
    const textContentStyle = {flex: 1, marginLeft: '0.5rem'};

    return (
        <div style={itemStyle}>
            <div style={circleStyle}>
                <span style={dateMonthStyle}>{month}.</span>
                <span style={dateDayStyle}>{day}</span>
            </div>
            <div style={textContentStyle}>
                <p style={{margin: 0, fontWeight: 'bold', fontSize: '1.1rem'}}>{bill.name}</p>
                <p style={{margin: '0.25rem 0', fontSize: '0.9rem', color: '#B0B0B0'}}>
                    {bill.name} - {bill.recurrence.charAt(0).toUpperCase() + bill.recurrence.slice(1)}
                </p>
                {bill.last_paid_date && (
                    <p style={{margin: 0, fontSize: '0.8rem', color: '#909090'}}>
                        Last Paid - {new Date(bill.last_paid_date + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                    </p>
                )}
            </div>
            <div style={amountCircleStyle}>
                ${new Intl.NumberFormat().format(bill.amount)}
            </div>
        </div>
    );
};


// Main Card Component
const UpcomingBillsCard = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [period, setPeriod] = useState('monthly'); // State for the filter
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const {token} = useAuth();

    useEffect(() => {
        const fetchBills = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            setLoading(true); // Set loading true on each fetch
            try {
                // Append the period to the API request
                const response = await axios.get(`http://localhost:5000/api/bills/upcoming?period=${period}`);
                setBills(response.data);
            } catch (err) {
                setError('Failed to fetch bills');
            } finally {
                setLoading(false);
            }
        };
        fetchBills();
    }, [token, period]); // Re-run the effect when the 'period' state changes

    // --- STYLES ---
    const cardStyle = {backgroundColor: '#2C2C2E', borderRadius: '20px', padding: '0.8rem', color: 'white'};
    const headerStyle = {display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'};
    const titleStyle = {fontFamily: 'serif', fontSize: '1.5rem', margin: 0, color: '#FFFFFF'};
    const dropdownArrowStyle = {fontSize: '2rem', cursor: 'pointer', transform: 'scaleY(0.6)'};

    const renderContent = () => {
        if (loading) return <p>Loading bills...</p>;
        if (error) return <p style={{color: '#FF6B6B'}}>{error}</p>;
        if (bills.length === 0) return <p>No upcoming bills for this period. You're all caught up!</p>;

        // We will only show the first 2 bills on the dashboard to keep it clean, as per the design.
        return bills.map(bill => <BillItem key={bill.id} bill={bill} />);
    };

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
        setIsDropdownOpen(false); // Close the dropdown after selection
    };

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <h3 style={titleStyle}>Upcoming Bills</h3>
                {/* --- START: Dropdown Menu Logic --- */}
                <div style={{position: 'relative'}}>
    <span
        style={dropdownArrowStyle}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle visibility on click
    >
        &#x25BC;
    </span>

                    {isDropdownOpen && (
                        <div style={{
                            position: 'absolute', top: '100%', right: 0, backgroundColor: '#3a3a3c',
                            borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 10, width: '140px', // Increased width
                        }}>
                            <a onClick={() => handlePeriodChange('next7days')} style={{ display: 'block', padding: '0.75rem 1rem', cursor: 'pointer', textDecoration: 'none', color: 'white' }}>Next 7 Days</a>
                            <a onClick={() => handlePeriodChange('next30days')} style={{ display: 'block', padding: '0.75rem 1rem', cursor: 'pointer', textDecoration: 'none', color: 'white' }}>Next 30 Days</a>
                            <a onClick={() => handlePeriodChange('thisquarter')} style={{ display: 'block', padding: '0.75rem 1rem', cursor: 'pointer', textDecoration: 'none', color: 'white' }}>Next 3 Months</a>
                            <a onClick={() => handlePeriodChange('all')} style={{ display: 'block', padding: '0.75rem 1rem', cursor: 'pointer', textDecoration: 'none', color: 'white' }}>All Upcoming</a>
                        </div>
                        /*<div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            backgroundColor: '#3a3a3c',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            zIndex: 10,
                            width: '120px',
                        }}>
                            <a onClick={() => handlePeriodChange('weekly')} style={{
                                display: 'block',
                                padding: '0.75rem 1rem',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                color: 'white'
                            }}>Weekly</a>
                            <a onClick={() => handlePeriodChange('monthly')} style={{
                                display: 'block',
                                padding: '0.75rem 1rem',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                color: 'white'
                            }}>Monthly</a>
                            <a onClick={() => handlePeriodChange('yearly')} style={{
                                display: 'block',
                                padding: '0.75rem 1rem',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                color: 'white'
                            }}>Yearly</a>
                        </div>*/
                    )}
                </div>
                {/* --- END: Dropdown Menu Logic --- */}
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default UpcomingBillsCard;