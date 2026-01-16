import React, { useState, useEffect, useCallback } from "react";
import TimerCard from "../components/TimerCard";
import SessionTable from "../components/SessionTable";
import { getCurrentSession, getAllSessions } from "../api/sessionApi"; // Add getAllSessions
import CategoryModal from "../components/CategoryModal";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../api/categoryApi";
import Statistics from "../components/Statistics";
import ThemeToggle from "../components/ThemeToggle";
import toast from 'react-hot-toast';

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { logout } = useAuth();
    const [categories, setCategories] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);
    const [loading, setLoading] = useState(true);

    // Memoize fetch functions
    const fetchActiveSession = useCallback(async () => {
        try {
            const session = await getCurrentSession();
            setActiveSession(session);
            await fetchSessions();
            setStatsRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Error fetching current session:', error);
        }
    }, []);

    const fetchSessions = useCallback(async () => {
        try {
            const fetchedSessions = await getAllSessions();
            setSessions(fetchedSessions);
        } catch (error) {
            console.error('Error fetching all sessions:', error);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const fetchedCategories = await getAllCategories();
            if (Array.isArray(fetchedCategories)) {
                setCategories(fetchedCategories);
            } else {
                console.error("Fetched categories is not an array:", fetchedCategories);
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    }, []);

    const handleSaveCategory = useCallback(async (categoryData) => {
        try {
            if (categoryToEdit) {
                await updateCategory(categoryToEdit.id, categoryData);
                toast.success('Category updated successfully!');
            } else {
                await createCategory(categoryData);
                toast.success('Category created successfully!');
            }
            await fetchCategories();
            setIsModalOpen(false);
            setCategoryToEdit(null);
        } catch (error) {
            toast.error('Failed to save category: ' + (error.response?.data?.message || error.message));
        }
    }, [categoryToEdit, fetchCategories]);

    const handleAddCategory = useCallback(() => {
        setCategoryToEdit(null);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setCategoryToEdit(null);
    }, []);

    const handleEditCategory = useCallback((category) => {
        setCategoryToEdit(category);
        setIsModalOpen(true);
    }, []);

    const handleDeleteCategory = useCallback(async (categoryId) => {
        try {
            await deleteCategory(categoryId);
            toast.success('Category deleted successfully!');
            await fetchCategories();
            await fetchActiveSession();
        } catch (error) {
            toast.error('Failed to delete category: ' + (error.response?.data?.message || error.message));
        }
    }, [fetchCategories, fetchActiveSession]);

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            await Promise.all([
                fetchActiveSession(),
                fetchSessions(),
                fetchCategories()
            ]);
            setLoading(false);
        };

        initializeData();
    }, []);

    // loading screen in case data is still loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100/20 to-slate-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Loading Time Fighter...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100/20 to-slate-100 
                        dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 py-8 transition-colors duration-300">
            <div className="text-center mb-12 relative">
                {/* Theme Toggle & Logout - Positioned top right */}
                <div className="absolute top-0 right-0 flex gap-2 m-4">
                    <ThemeToggle />
                    <button
                        onClick={logout}
                        className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-2 rounded-lg 
                                   text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 
                                   transition-colors border border-slate-200 dark:border-slate-700"
                        title="Logout"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                    </button>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 
                                bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 
                                bg-clip-text text-transparent py-2.5">
                    Time Fighter
                </h1>
                <p className="ttext-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl 
                              font-medium leading-relaxed max-w-2xl mx-auto">
                    Track your study sessions across different categories
                </p>
                <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"></div>
            </div>

            {/* Timer Cards Grid */}
            <div className="grid grid-cols-1 max-w-4xl md:grid-cols-2 lg:grid-cols-3 gap-10 p-6 mx-auto lg:max-w-7xl">
                {categories.map((category) => (
                    <TimerCard
                        key={category.id}
                        category={category.name}
                        categoryData={category}
                        activeSession={activeSession}
                        onSessionUpdate={fetchActiveSession}
                        onEditCategory={handleEditCategory}
                        onDeleteCategory={handleDeleteCategory}
                    />
                ))}
            </div>

            {/* Navigation to Pomodoro */}
            <div className="flex justify-center mb-8">
                <a
                    href="/pomodoro"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 dark:bg-slate-800/80 
                             backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl 
                             transform hover:-translate-y-1 transition-all duration-300 group"
                >
                    <span className="text-2xl">🍅</span>
                    <span className="font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent 
                                   group-hover:scale-105 transition-transform">
                        Open Pomodoro Timer
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                        className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </a>
            </div>

            {/* Add Category Card */}
            <div className="flex justify-center mx-6">
                <button
                    onClick={handleAddCategory}
                    aria-label="Add Category"
                    className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-cyan-500 
                                dark:hover:border-cyan-500 p-6 transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50 group"
                >
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 
                                    group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        <span className="text-5xl mb-3">+</span>
                        <span className="text-lg font-semibold">Add Category</span>
                    </div>
                </button>
            </div>

            {/* Category Modal */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveCategory}
                categoryToEdit={categoryToEdit}
            />
            {/* Session History Section */}
            <div className="overflow-x-auto mx-6 mt-8 text-center">
                <SessionTable sessions={sessions} />
            </div>

            {/* Statistics Section */}
            <div className="justify-center p-6 mx-6 mt-12 text-center">
                <Statistics refreshTrigger={statsRefreshTrigger} />
            </div>
        </div>
    );
};

export default Dashboard;
