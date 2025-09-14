import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

const LoginPage = () => {
    const navigate = useNavigate();

    // State for the form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for loading and error messages
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent page from reloading on form submission
        setError(''); // Clear previous errors
        setLoading(true);

        try {
            // Make the API call to our backend's login endpoint
            const response = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password,
            });

            // On success, the backend sends back user data and a token
            console.log('Login successful:', response.data);

            // TODO in a future step:
            // 1. Save the token (response.data.token) to local storage
            // 2. Save user data to a global state (Context or Redux)
            // 3. Redirect to the dashboard
            alert('Login successful! Check the console for your data.');
            // navigate('/dashboard'); // We will enable this later

        } catch (err) {
            // If the API call fails, the backend sends an error message
            const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
            setError(errorMessage);
            console.error('Login error:', err.response);
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    // --- STYLES --- (No changes to styles)
    const inputStyles = {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '50px',
        padding: '15px 25px',
        width: '100%',
        color: 'white',
        fontSize: '1.1rem',
        marginBottom: '1.5rem',
        boxSizing: 'border-box',
        backdropFilter: 'blur(10px)',
    };

    const buttonStyles = {
        backgroundColor: '#ADFF2F',
        color: 'black',
        border: 'none',
        borderRadius: '50px',
        padding: '15px 30px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box',
        marginTop: '1rem',
        boxShadow: '0 4px 15px rgba(173, 255, 47, 0.4)',
        //opacity: loading ? 0.7 : 1, // Dim the button when loading
    };

    const linkStyles = {
        color: '#ADFF2F',
        cursor: 'pointer',
        textDecoration: 'none',
        fontWeight: 'normal',
    };

    return (
        <AuthLayout>
            <form onSubmit={handleLogin} style={{ width: '400px', textAlign: 'center', margin: '4.1rem 0 0 0' }}>
                <input
                    type="email"
                    placeholder="Email Address"
                    style={inputStyles}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update email state
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    style={inputStyles}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Update password state
                    required
                />

                {/* Display error message if there is one */}
                {error && <p style={{ color: '#FF6B6B', marginTop: '-1rem', marginBottom: '1rem' }}>{error}</p>}

                <button type="submit" style={buttonStyles} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p style={{ marginTop: '1rem', color: '#BDBDBD', fontSize: '1.2rem' }}>
                    <a href="#" style={linkStyles}>Forgot Password?</a>
                </p>
            </form>

            <div style={{ margin: '0rem 0 0 0', textAlign: 'center', color: '#ADFF2F', fontSize: '1.2rem' }}>
                <p>Welcome back 👋</p>
                <p style={{ margin: '-1.5rem 0 0 0', fontSize: '1.2rem', color: '#ADFF2F' }}>Let's get you closer to financial freedom.</p>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;