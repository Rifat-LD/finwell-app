import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    // While we're checking if the token is valid, show a loading message
    // This prevents a "flash" of the login page before redirecting.
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#121212',
                color: 'white'
            }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    // If the token check is done and there is a user, render the child route (e.g., Dashboard).
    // The <Outlet /> component is a placeholder for the actual page component.
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;