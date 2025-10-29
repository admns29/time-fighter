import React, { useState, useEffect } from 'react';
import TimerCard from '../components/TimerCard';
import { getCurrentSession } from '../api/sessionApi'; 

    const Dashboard = () => {
    const categories = ['LeetCode', 'Python', 'Java', 'Cybersecurity'];
    const [activeSession, setActiveSession] = useState(null);
    
    const fetchActiveSession = async () => {
        try {
        const session = await getCurrentSession(); // Changed from getActiveSession
        console.log('Fetched current session:', session); // Debug log
        setActiveSession(session);
        } catch (error) {
        console.error('Error fetching current session:', error);
        // Don't reset to null on error
        }
    };

  // Load active session when component mounts
  useEffect(() => {
    fetchActiveSession();
  }, []); // Empty array = run once when component loads

  
    return (
        <div className="min-h-screen bg-gray-100 py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Time Fighter</h1>
            <p className="text-gray-600 mb-8">Track your study sessions across different categories</p>
            
            {/* Timer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
                <TimerCard
                key={category}
                category={category}
                activeSession={activeSession}
                onSessionUpdate={fetchActiveSession}
                />
            ))}
            </div>
        </div>
        </div>
    );
};

export default Dashboard;