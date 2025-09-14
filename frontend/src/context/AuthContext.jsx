import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); // To check initial auth status

    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    // Set the token for all future axios requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    // Fetch the user profile to verify the token is valid
                    const response = await axios.get('http://localhost:5000/api/users/profile');
                    setUser(response.data);
                } catch (error) {
                    console.error("Invalid token:", error);
                    // If token is invalid, clear it
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    delete axios.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };
        validateToken();
    }, [token]);

    const loginAction = (data) => {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
    };

    const logoutAction = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const authContextValue = {
        user,
        token,
        loading,
        login: loginAction,
        logout: logoutAction,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Create a custom hook for easy access to the context
export const useAuth = () => {
    return useContext(AuthContext);
};