import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpPage = () => {
    const navigate = useNavigate();

    // State for all our form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        occupation: '',
        password: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // A single handler to update our state object
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Frontend Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {
                name: formData.name,
                email: formData.email,
                occupation: formData.occupation,
                password: formData.password,
            });

            setSuccessMessage(response.data.message + " You can now log in.");
            // Optionally, redirect after a few seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Sign up failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // --- STYLES --- (No changes to styles)
    const inputStyles = {
        backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '50px', padding: '15px 25px', width: '100%', color: 'white', fontSize: '1.1rem', marginBottom: '1.5rem', boxSizing: 'border-box', backdropFilter: 'blur(10px)',
    };
    const buttonStyles = {
        backgroundColor: '#ADFF2F', color: 'black', border: 'none', borderRadius: '50px', padding: '15px 30px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', width: '100%', boxSizing: 'border-box', marginTop: '1rem', boxShadow: '0 4px 15px rgba(173, 255, 47, 0.4)', opacity: loading ? 0.7 : 1,
    };
    const linkStyles = {
        color: '#ADFF2F', cursor: 'pointer', textDecoration: 'none', fontWeight: 'bold',
    };

    return (
        <AuthLayout containerStyle={{paddingTop: '21.8vh'}}>
            <form onSubmit={handleSignUp} style={{ width: '400px', textAlign: 'center', margin: '1rem 0 0 0' }}>
                <input type="text" name="name" placeholder="Full Name" style={inputStyles} value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email Address" style={inputStyles} value={formData.email} onChange={handleChange} required />
                <input type="text" name="occupation" placeholder="Occupation" style={inputStyles} value={formData.occupation} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" style={inputStyles} value={formData.password} onChange={handleChange} required />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" style={inputStyles} value={formData.confirmPassword} onChange={handleChange} required />

                {error && <p style={{ color: '#FF6B6B', marginTop: '-1rem', marginBottom: '1rem' }}>{error}</p>}
                {successMessage && <p style={{ color: '#ADFF2F', marginTop: '-1rem', marginBottom: '1rem' }}>{successMessage}</p>}

                <button type="submit" style={buttonStyles} disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
            <div style={{ marginTop: '2rem', textAlign: 'center', color: '#BDBDBD' }}>
                <p>
                    By creating an account you agree to FinWell's<br />
                    <a href="#" style={{...linkStyles, fontWeight: 'normal'}}>Terms of Services and Privacy Policy.</a>
                </p>
                <p style={{ marginTop: '1rem' }}>
                    Have an account?{' '}
                    <a onClick={() => navigate('/login')} style={linkStyles}>
                        Log in
                    </a>
                </p>
            </div>
        </AuthLayout>
    );
};

export default SignUpPage;