import React, { useState, useEffect } from 'react';
import TimerCard from '../components/TimerCard';
import SessionTable from '../components/SessionTable';
import { getCurrentSession, getAllSessions } from '../api/sessionApi'; // Add getAllSessions
import CategoryModal from '../components/CategoryModal';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../api/categoryApi';
const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [sessions, setSessions] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  
  const fetchActiveSession = async () => {
    try {
      const session = await getCurrentSession();
      console.log('Fetched current session:', session);
      setActiveSession(session);
      await fetchSessions(); // Refresh sessions when active session updates
    } catch (error) {
      console.error('Error fetching current session:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const fetchedSessions = await getAllSessions();
      console.log('Fetched all sessions:', fetchedSessions);
      setSessions(fetchedSessions); // No await needed
    } catch (error) {
      console.error('Error fetching all sessions:', error);
    }
  };
    const fetchCategories = async () => {
    try {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
        alert('Failed to save category: ' + (error.response?.data?.message || error.message));
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
            alert('Failed to delete category: ' + (error.response?.data?.message || error.message));
        }
    };


  useEffect(() => {
    fetchActiveSession();
    fetchSessions();
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with gradient text */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-6xl font-extrabold leading-snug mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent overflow-visible">
            Time Fighter
          </h1>
          <p className="text-gray-400 text-lg">Track your study sessions across different categories</p>
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
        
          {/* NEW: Add Category Card */}
        <div>
        <button
            onClick={handleAddCategory}
            className="bg-slate-800/50 backdrop-blur-sm rounded-lg border-2 border-dashed border-slate-600 hover:border-cyan-500 p-6 transition-all hover:bg-slate-700/50 group"
        >
            <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-cyan-400 transition-colors">
            <span className="text-5xl mb-3">+</span>
            <span className="text-lg font-semibold">Add Category</span>
            </div>
        </button>
        </div>

         {/* NEW: Category Modal */}
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

      </div>
    </div>
  );
};

export default Dashboard;