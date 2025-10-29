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
  
  return (
    <div>TimerCard for {category}</div>
  );
};

export default TimerCard;