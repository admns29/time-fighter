import React, { useState, useEffect } from 'react';
import { startSession, pauseSession, resumeSession, stopSession } from '../api/sessionApi';

const TimerCard = ({ category, activeSession, onSessionUpdate }) => {
  // State variables - data that can change
  const [duration, setDuration] = useState(0); // Total duration in seconds
  const [isActive, setIsActive] = useState(false); // Is timer running?
  const [session, setSession] = useState(null); // Current session data

  // Format seconds into HH:MM:SS display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Check if this category has an active session
  useEffect(() => {
    if (activeSession && activeSession.category === category) {
      setSession(activeSession);
      setDuration(activeSession.duration);
      setIsActive(activeSession.status === 'ACTIVE');
    } else {
      setSession(null);
      setDuration(0);
      setIsActive(false);
    }
  }, [activeSession, category]);

  // Timer that ticks every second when active
  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000); // Run every 1000ms = 1 second
    } else {
      clearInterval(interval);
    }
    
    // Cleanup function - runs when component unmounts or isActive changes
    return () => clearInterval(interval);
  }, [isActive]);

    // Handle Start button click
  const handleStart = async () => {
    try {
      const newSession = await startSession(category);
      setSession(newSession);
      setIsActive(true);
      onSessionUpdate(); // Notify parent to refresh data
    } catch (error) {
      alert('Failed to start session');
    }
  };

  // Handle Pause button click
  const handlePause = async () => {
    try {
      const updatedSession = await pauseSession(session.id);
      setSession(updatedSession);
      setDuration(updatedSession.duration);
      setIsActive(false);
      onSessionUpdate();
    } catch (error) {
      alert('Failed to pause session');
    }
  };

  // Handle Resume button click
  const handleResume = async () => {
    try {
      const updatedSession = await resumeSession(session.id);
      setSession(updatedSession);
      setIsActive(true);
      onSessionUpdate();
    } catch (error) {
      alert('Failed to resume session');
    }
  };

  // Handle Stop button click
  const handleStop = async () => {
    try {
      await stopSession(session.id);
      setSession(null);
      setDuration(0);
      setIsActive(false);
      onSessionUpdate();
    } catch (error) {
      alert('Failed to stop session');
    }
  };
  
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        {/* Category Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">{category}</h3>
        
        {/* Timer Display */}
        <div className="text-4xl font-mono font-bold text-center mb-6 text-gray-700">
            {formatTime(duration)}
        </div>
        
        {/* Buttons */}
        <div className="flex gap-2 justify-center">
            {!session ? (
            // No session - show Start button
            <button
                onClick={handleStart}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
                Start
            </button>
            ) : isActive ? (
            // Session is active - show Pause and Stop buttons
            <>
                <button
                onClick={handlePause}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                Pause
                </button>
                <button
                onClick={handleStop}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                Stop
                </button>
            </>
            ) : (
            // Session is paused - show Resume and Stop buttons
            <>
                <button
                onClick={handleResume}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                Resume
                </button>
                <button
                onClick={handleStop}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                Stop
                </button>
            </>
            )}
        </div>
        
        {/* Session Status Indicator */}
        {session && (
            <div className="mt-4 text-center">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
                {isActive ? 'Active' : 'Paused'}
            </span>
            </div>
        )}
        </div>
    );


};

export default TimerCard;