import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const SavingsGoalCard = () => {
    const [goal, setGoal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchGoals = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get('http://localhost:5000/api/goals');
                if (response.data && response.data.length > 0) {
                    setGoal(response.data[0]);
                }
            } catch (err) {
                setError('Failed to fetch savings goal');
            } finally {
                setLoading(false);
            }
        };
        fetchGoals();
    }, [token]);

    const percentage = goal ? Math.round((goal.current_amount / goal.target_amount) * 100) : 0;

    // --- NEW STYLES ---
    const cardStyle = {
        backgroundColor: '#2C2C2E', borderRadius: '20px', padding: '1.5rem', color: 'white', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box'
    };
    const headerStyle = {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem',
    };
    const titleStyle = {
        fontSize: '1rem', margin: 0, color: '#E0E0E0',
    };
    const targetAmountStyle = {
        fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#ADFF2F',
    };
    const mainContentStyle = { // For horizontal layout
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around', // Distribute space
        flex: 1, // Allow this section to grow
    };
    const textContentStyle = {
        textAlign: 'center',
    };
    const gaugeContainerStyle = { // Smaller gauge
        width: '100px',
        height: '100px',
    };
    const addGoalStyle = {
        color: '#ADFF2F', textDecoration: 'none', marginTop: '1.5rem',
    };

    // --- RENDER LOGIC ---
    if (loading) {
        return <div style={cardStyle}>Loading savings goal...</div>;
    }
    if (error) {
        return <div style={cardStyle}><p style={{color: '#FF6B6B'}}>{error}</p></div>;
    }
    if (!goal) {
        return (
            <div style={cardStyle}>
                <h3 style={titleStyle}>Savings Goal</h3>
                <p style={{marginTop: '2rem'}}>You haven't set any goals yet.</p>
                <div style={{flex: 1}}></div> {/* Spacer to push link to bottom */}
                <a href="#" style={addGoalStyle}>+ Add a new goal</a>
            </div>
        );
    }

    return (
        <div style={cardStyle}>
            {/* Header section with improved clarity */}
            <div style={headerStyle}>
                <h3 style={titleStyle}>Savings Goal</h3>
                <p style={targetAmountStyle}>
                    Goal: ${new Intl.NumberFormat().format(goal.target_amount)}
                </p>
            </div>

            {/* Main content with horizontal layout */}
            <div style={mainContentStyle}>
                <div style={textContentStyle}>
                    <p style={{margin: '0', color: '#E0E0E0', fontSize: '0.9rem'}}>
                        🏆 Target Achieved
                    </p>
                    <p style={{margin: '0.25rem 0 0 0', fontSize: '1.8rem', fontWeight: 'bold'}}>
                        ${new Intl.NumberFormat().format(goal.current_amount)}
                    </p>
                </div>
                <div style={gaugeContainerStyle}>
                    <CircularProgressbar
                        value={percentage}
                        text={`${percentage}%`}
                        strokeWidth={12} // Thicker stroke
                        styles={buildStyles({
                            textColor: 'white',
                            pathColor: '#ADFF2F',
                            trailColor: 'rgba(255, 255, 255, 0.1)',
                            strokeLinecap: 'butt', // Flat ends like the design
                        })}
                    />
                </div>
            </div>

            {/* Add another goal link */}
            <a href="#" style={addGoalStyle}>+ Add another goal</a>
        </div>
    );
};

export default SavingsGoalCard;