import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Decode token to get username or validate with backend
            // For simplicity, we'll just set the user if token exists
            // In a real app, you'd want to fetch user details
            const username = localStorage.getItem('username');
            setUser({ username });
        }
        setLoading(false);
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password
            });
            const { token, username: user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', user);
            setToken(token);
            setUser({ username: user });
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

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

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
