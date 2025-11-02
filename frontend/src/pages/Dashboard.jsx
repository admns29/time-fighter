import React, { useState, useEffect } from 'react';
import TimerCard from '../components/TimerCard';
import SessionTable from '../components/SessionTable';
import { getCurrentSession, getAllSessions } from '../api/sessionApi'; // Add getAllSessions

const Dashboard = () => {
  const categories = ['LeetCode', 'Python', 'Java', 'Cybersecurity'];
  const [activeSession, setActiveSession] = useState(null);
  const [sessions, setSessions] = useState([]); // Add this state!
  
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

  useEffect(() => {
    fetchActiveSession();
    fetchSessions();
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
              key={category}
              category={category}
              activeSession={activeSession}
              onSessionUpdate={fetchActiveSession}
            />
          ))}
        </div>
        
        {/* Session History Section */}
        <div className="mt-8 text-center">
        <SessionTable sessions={sessions} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;