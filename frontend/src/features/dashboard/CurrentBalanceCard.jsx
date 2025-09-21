import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Go up two directories

const CurrentBalanceCard = () => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth(); // Get token from context to ensure we are authenticated

    useEffect(() => {
        const fetchBalance = async () => {
            if (!token) {
                setLoading(false);
                setError('Not authenticated');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/accounts/balance');
                setBalance(response.data.totalBalance);
            } catch (err) {
                setError('Failed to fetch balance');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, [token]); // Re-run effect if the token changes

    // --- STYLES ---
    const cardStyle = {
        backgroundColor: '#2C2C2E',
        borderRadius: '20px',
        padding: '1.5rem',
        color: 'white',
        minWidth: '300px',
        textAlign: 'center',
    };

    const titleStyle = {
        color: '#E0E0E0',
        fontSize: '1rem',
        margin: '0 0 1rem 0',
    };

    const balanceStyle = {
        fontSize: '3rem',
        fontWeight: 'bold',
        margin: '0 0 1.5rem 0',
        color: '#ADFF2F',
    };

    const linkStyle = {
        color: '#B0B0B0',
        textDecoration: 'none',
        fontSize: '0.9rem',
    };

    // Conditional Rendering
    if (loading) {
        return <div style={cardStyle}>Loading balance...</div>;
    }

    if (error) {
        return <div style={cardStyle}><p style={{color: '#FF6B6B'}}>{error}</p></div>;
    }

    return (
        <div style={cardStyle}>
            <h3 style={titleStyle}>Current Balance</h3>
            <p style={balanceStyle}>
                ${new Intl.NumberFormat('en-US').format(balance)}
            </p>
            <a href="#" style={linkStyle}>All Accounts &gt;&gt;</a>
        </div>
    );
};

export default CurrentBalanceCard;