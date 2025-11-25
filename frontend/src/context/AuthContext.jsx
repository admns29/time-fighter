import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the context. This is like a global state container for authentication data.
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Wraps the application to provide authentication state (user, token) to all child components.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Initialize token from localStorage so the user stays logged in after refresh
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Effect to restore user session on app load
    useEffect(() => {
        if (token) {
            // In a real app, you would validate the token with the backend here.
            // For this demo, we just assume if a token exists, the user is logged in.
            const username = localStorage.getItem('username');
            setUser({ username });
        }
        setLoading(false); // Finished loading auth state
    }, [token]);

    /**
     * Login function
     * Sends credentials to backend, saves the returned token, and updates state.
     */
    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password
            });
            const { token, username: user } = response.data;

            // Save to localStorage for persistence
            localStorage.setItem('token', token);
            localStorage.setItem('username', user);

            // Update React state
            setToken(token);
            setUser({ username: user });
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    /**
     * Register function
     * Creates a new user account.
     */
    const register = async (username, email, password) => {
        try {
            await axios.post('http://localhost:8080/api/auth/register', {
                username,
                email,
                password
            });
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    /**
     * Logout function
     * Clears local storage and resets state.
     */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        setUser(null);
    };

    return (
        // Expose the auth state and functions to the rest of the app
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily use the AuthContext in other components
export const useAuth = () => useContext(AuthContext);
