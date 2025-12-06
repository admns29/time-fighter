import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';

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
        const initializeAuth = async () => {
            if (token) {
                try {
                    // Validate token with backend
                    const response = await api.get('/api/auth/validate');
                    // If successful, update user state
                    // Note: response.data.username comes from AuthResponse
                    setUser({ username: response.data.username });
                } catch (error) {
                    console.error("Token validation failed", error);
                    // If validation fails, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false); // Finished loading auth state
        };

        initializeAuth();
    }, [token]);

    /**
     * Login function
     * Sends credentials to backend, saves the returned token, and updates state.
     */
    const login = async (username, password) => {
        try {
            const response = await api.post('/api/auth/login', {
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
            await api.post('/api/auth/register', {
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
