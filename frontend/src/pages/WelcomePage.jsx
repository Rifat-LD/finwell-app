import React from 'react';
import AuthLayout from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();

    // --- COLOR PALETTE ---
    // Change these hex codes to match your desired colors
    const colors = {
        primaryGreen: '#ADFF2F', // A bright lime green for main text/links
        buttonBackground: 'linear-gradient(145deg, #ADFF2F, #32CD32)', // Gradient for the button
        buttonBorder: '#ADFF2F',
        textColor: '#FFFFFF',      // For the main title
        subtleTextColor: '#ADFF2F' // For paragraph text
    };

    // --- STYLES OBJECT ---
    const buttonStyles = {
        background: colors.buttonBackground,
        color: 'black', // Text color on the button
        border: `1px solid ${colors.buttonBorder}`,
        borderRadius: '50px',
        padding: '15px 30px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        minWidth: '300px',
        textAlign: 'center',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 15px rgba(173, 255, 47, 0.4)', // Optional: a glow effect
    };

    const linkStyles = {
        color: colors.primaryGreen,
        cursor: 'pointer',
        textDecoration: 'none',
        fontWeight: 'bold'
    };

    return (
        <AuthLayout>
            <div style={{ textAlign: 'center', maxWidth: '550px' /* Increased width for better wrapping */ }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: colors.primaryGreen }}>
                    Welcome to FinWell
                </h1>

                {/* To match the line breaks, we use two separate <p> tags */}
                <p style={{ color: colors.subtleTextColor, fontSize: '1.2rem', lineHeight: '1.6', margin: '1.5rem 0 0 0' }}>
                    Your smart companion for managing money, tracking expenses and building financial freedom.
                </p>

                <p style={{ color: colors.subtleTextColor, fontSize: '1.2rem', lineHeight: '1.6', margin: '1.5rem 0 2rem 0' }}>
                    Stay in control, save smarter, and achieve your goals – all in one place.
                </p>

                <button style={buttonStyles} onClick={() => navigate('/signup')}>
                    Get Started
                </button>

                <p style={{ color: colors.subtleTextColor, fontSize: '1.2rem' }}>
                    Already have an account?{' '}
                    <a style={linkStyles} onClick={() => navigate('/login')}>
                        Login
                    </a>
                </p>
            </div>
        </AuthLayout>
    );
};

export default WelcomePage;