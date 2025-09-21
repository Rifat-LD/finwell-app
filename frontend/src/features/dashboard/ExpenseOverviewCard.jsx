import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FaUtensils, FaShoppingCart, FaCar, FaFilm, FaFileInvoiceDollar, FaEllipsisH } from 'react-icons/fa';

// --- Helper Data and Functions ---

// Define colors for the chart segments to match the design's green palette
const COLORS = ['#004d00', '#006400', '#228B22', '#32CD32', '#90EE90', '#98FB98'];

// Map category names to specific icons from the react-icons library
const categoryIcons = {
    'Food': <FaUtensils />,
    'Shopping': <FaShoppingCart />,
    'Transportation': <FaCar />,
    'Entertainment': <FaFilm />,
    'Bills': <FaFileInvoiceDollar />,
    'Others': <FaEllipsisH />,
};



const ExpenseOverviewCard = () => {
    const [summary, setSummary] = useState({ totalSpending: 0, categorySummary: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [period, setPeriod] = useState('weekly');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { token } = useAuth();
    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
        setIsDropdownOpen(false); // Close dropdown after selection
    };

    useEffect(() => {
        const fetchSummary = async () => {
            if (!token) { setLoading(false); return; }
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/transactions/summary?period=${period}`);
                // Sort summary by total amount descending for a cleaner chart
                const sortedSummary = response.data.categorySummary.sort((a, b) => b.total - a.total);
                setSummary({
                    totalSpending: response.data.totalSpending,
                    categorySummary: sortedSummary,
                });
            } catch (err) {
                setError('Failed to fetch expense summary');
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [token, period]);

    // --- STYLES ---
    const cardStyle = { backgroundColor: '#2C2C2E', borderRadius: '20px', padding: '1.5rem 2rem', color: 'white' };
    const headerStyle = { fontFamily: 'serif', fontSize: '1.8rem', margin: '0 0 1.5rem 0' };
    const contentStyle = { display: 'flex', alignItems: 'center', gap: '2rem' };
    const chartContainerStyle = { width: '250px', height: '250px', position: 'relative' };
    const chartCenterTextStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', cursor: 'pointer' };
    const summaryContainerStyle = { flex: 1 };
    const totalSpendingStyle = { textAlign: 'right' };
    const categoryListStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' };
    const categoryItemStyle = { display: 'flex', alignItems: 'center', gap: '0.75rem' };

    // --- RENDER LOGIC ---
    if (loading) return <div style={cardStyle}>Loading Expense Overview...</div>;
    if (error) return <div style={cardStyle}><p style={{color: '#FF6B6B'}}>{error}</p></div>;

    return (
        <div style={cardStyle}>
            <h3 style={headerStyle}>Expense Overview</h3>
            <div style={contentStyle}>
                {/* Left Side: Donut Chart */}
                <div style={chartContainerStyle}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={summary.categorySummary}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                innerRadius={80}
                                outerRadius={110}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="total"
                            >
                                {summary.categorySummary.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div
                        style={chartCenterTextStyle}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown on click
                    >
    <span style={{ fontSize: '1.5rem' }}>
        {period.charAt(0).toUpperCase() + period.slice(1)}
    </span>
                        <span> &#x25BC;</span>

                        {/* --- START: Dropdown Menu --- */}
                        {isDropdownOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '120%', // Position it below the text
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: '#3a3a3c',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                zIndex: 10,
                                width: '120px',
                            }}>
                                <a onClick={() => handlePeriodChange('weekly')} style={{ display: 'block', padding: '0.75rem 1rem', cursor: 'pointer', textDecoration: 'none', color: 'white' }}>Weekly</a>
                                <a onClick={() => handlePeriodChange('monthly')} style={{ display: 'block', padding: '0.75rem 1rem', cursor: 'pointer', textDecoration: 'none', color: 'white' }}>Monthly</a>
                                <a onClick={() => handlePeriodChange('yearly')} style={{ display: 'block', padding: '0.75rem 1rem', cursor: 'pointer', textDecoration: 'none', color: 'white' }}>Yearly</a>
                            </div>
                        )}
                        {/* --- END: Dropdown Menu --- */}
                    </div>
                </div>

                {/* Right Side: Summary */}
                <div style={summaryContainerStyle}>
                    <div style={totalSpendingStyle}>
                        <p style={{ margin: 0, color: '#B0B0B0' }}>Total Spending</p>
                        <p style={{ margin: '0.25rem 0', fontSize: '2.5rem', fontWeight: 'bold' }}>
                            <span style={{ color: '#ADFF2F' }}>$</span>
                            {new Intl.NumberFormat().format(summary.totalSpending)}
                        </p>
                        <hr style={{ border: '1px solid #444' }}/>
                    </div>
                    <div style={categoryListStyle}>
                        {summary.categorySummary.map((item, index) => (
                            <div key={index} style={categoryItemStyle}>
                                <span style={{ color: COLORS[index % COLORS.length], fontSize: '1.5rem' }}>
                                    {categoryIcons[item.category] || <FaEllipsisH />}
                                </span>
                                <div>
                                    <p style={{ margin: 0, color: '#E0E0E0' }}>{item.category}</p>
                                    <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold' }}>${new Intl.NumberFormat().format(item.total)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseOverviewCard;