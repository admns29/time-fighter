import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            toast.success('Logged in successfully!');
            navigate('/');
        } catch (error) {
            toast.error('Login failed: ' + (error.response?.data?.message || 'Invalid credentials'));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-purple-100/20 to-slate-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700">
                <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Welcome Back
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-purple-500 hover:text-purple-400 font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
