import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login after logout
    };

    // --- Basic Styles for Layout ---
    const layoutStyle = {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#1C1C1E', // A slightly lighter dark color for the main area
        color: 'white',
    };

    const sidebarStyle = {
        width: '250px',
        backgroundColor: '#121212', // Darker sidebar
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
    };

    const contentStyle = {
        flex: 1, // Takes up the remaining space
        padding: '2rem',
    };

    const navLinkStyle = {
        color: 'white',
        textDecoration: 'none',
        padding: '1rem',
        margin: '0.5rem 0',
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    };

    return (
        <div style={layoutStyle}>
            <nav style={sidebarStyle}>
                <h2 style={{color: '#ADFF2F', textAlign: 'center'}}>FinWell</h2>
                <div style={{marginTop: '2rem', display: 'flex', flexDirection: 'column'}}>
                    <a href="#" style={{...navLinkStyle, backgroundColor: '#ADFF2F', color: 'black'}}>Dashboard</a>
                    <a href="#" style={navLinkStyle}>Files</a>
                    <a href="#" style={navLinkStyle}>Budget</a>
                    <a href="#" style={navLinkStyle}>Bills</a>
                    <a href="#" style={navLinkStyle}>Report</a>
                    <a href="#" style={navLinkStyle}>My Profile</a>
                </div>
                <div style={{marginTop: 'auto'}}> {/* Pushes logout to the bottom */}
                    <button onClick={handleLogout} style={{...navLinkStyle, width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left'}}>
                        Logout
                    </button>
                </div>
            </nav>

            <main style={contentStyle}>
                <header style={{marginBottom: '2rem'}}>
                    {/* We check if user exists before trying to access its properties */}
                    <h1>Hello, {user ? user.full_name : 'Guest'}...!</h1>
                </header>
                {/* The actual page content (Dashboard, etc.) will be rendered here */}
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;