import React, { useState, useEffect } from "react";
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

const Dashboard = () => {
    const [categories, setCategories] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);

    const fetchActiveSession = async () => {
        try {
            const session = await getCurrentSession();
            console.log("Fetched current session:", session);
            setActiveSession(session);
            await fetchSessions(); // Refresh sessions when active session updates
            setStatsRefreshTrigger((prev) => prev + 1); // Trigger stats refresh
        } catch (error) {
            console.error("Error fetching current session:", error);
        }
    };

    const fetchSessions = async () => {
        try {
            const fetchedSessions = await getAllSessions();
            console.log("Fetched all sessions:", fetchedSessions);
            setSessions(fetchedSessions); // Update state with fetched sessions
        } catch (error) {
            console.error("Error fetching all sessions:", error);
        }
    };
    const fetchCategories = async () => {
        try {
            const fetchedCategories = await getAllCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleSaveCategory = async (categoryData) => {
        try {
            if (categoryToEdit) {
                // Update existing
                await updateCategory(categoryToEdit.id, categoryData);
            } else {
                // Create new
                await createCategory(categoryData);
            }
            await fetchCategories(); // Refresh list
            setIsModalOpen(false);
            setCategoryToEdit(null);
        } catch (error) {
            alert(
                "Failed to save category: " +
                (error.response?.data?.message || error.message)
            );
        }
    };

    const handleAddCategory = () => {
        setCategoryToEdit(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCategoryToEdit(null);
    };

    const handleEditCategory = (category) => {
        setCategoryToEdit(category);
        setIsModalOpen(true);
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await deleteCategory(categoryId);
            await fetchCategories(); // Refresh list
            // If the deleted category had an active session, refresh that too
            await fetchActiveSession();
        } catch (error) {
            alert(
                "Failed to delete category: " +
                (error.response?.data?.message || error.message)
            );
        }
    };

    useEffect(() => {
        fetchActiveSession();
        fetchSessions();
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100/20 to-slate-100 
                        dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 py-8 transition-colors duration-300">
            <div className="text-center mb-12 relative">
                {/* Theme Toggle - Positioned top right */}
                <div className="absolute top-0 right-0">
                    <ThemeToggle />
                </div>

                <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Time Fighter
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Track your study sessions across different categories
                </p>
                <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"></div>
            </div>

            {/* Timer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Add Category Card */}
            <div>
                <button
                    onClick={handleAddCategory}
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
            <div className="mt-8 text-center">
                <SessionTable sessions={sessions} />
            </div>

            {/* Statistics Section */}
            <div className="mt-12 text-center">
                <Statistics refreshTrigger={statsRefreshTrigger} />
            </div>
        </div>
    );
};

export default Dashboard;
