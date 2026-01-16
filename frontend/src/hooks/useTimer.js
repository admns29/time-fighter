import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * Custom Hook: useTimer
 * Manages the timer logic for study sessions.
 * Handles real-time updates, goal tracking, and browser tab title updates.
 * 
 * @param {Object} activeSession - The current session object from the backend
 * @param {Boolean} isMySession - Whether the session belongs to the current user
 * @param {Function} onStop - Callback to trigger when the goal is reached
 */
export const useTimer = (activeSession, isMySession, onStop) => {
  const [displayTime, setDisplayTime] = useState(0);
  const [prevSessionId, setPrevSessionId] = useState(null);
  const hasStoppedRef = useRef(false); // Ref to prevent multiple stop calls

  const isActive = isMySession && activeSession?.status === 'ACTIVE';

  // Helper to format seconds into HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}
           :${String(minutes).padStart(2, '0')}
           :${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    // If it's not my session, reset everything
    if (!isMySession) {
      setDisplayTime(0);
      setPrevSessionId(null);
      hasStoppedRef.current = false;
      document.title = 'Time Fighter'; // Reset browser tab title
      return;
    }

    // Detect if we switched to a new session
    if (activeSession.id !== prevSessionId) {
      setDisplayTime(activeSession.duration);
      setPrevSessionId(activeSession.id);
      hasStoppedRef.current = false;
    }

    // If session is paused, just show the stored duration without ticking
    if (!isActive) {
      setDisplayTime(activeSession.duration);
      document.title = `⏸️ ${formatTime(activeSession.duration)} - Time Fighter`;
      return;
    }

    // Active Session: Start the countdown/countup
    const interval = setInterval(() => {
      const now = Date.now();
      const startedAt = new Date(activeSession.startTime).getTime();
      
      // Calculate elapsed time since the last start/resume
      const elapsed = Math.floor((now - startedAt) / 1000);
      
      // Total time is previous duration + current elapsed time
      const totalTime = elapsed + (activeSession.duration || 0);

      // If there is a goal, don't go past it visually
      const displayValue = activeSession.goalDuration 
        ? Math.min(totalTime, activeSession.goalDuration)
        : totalTime;

      setDisplayTime(displayValue);
      document.title = `▶️ ${formatTime(displayValue)} - Time Fighter`;

      // Check if we reached the goal
      if (activeSession.goalDuration && 
          totalTime >= activeSession.goalDuration && 
          !hasStoppedRef.current) {
        hasStoppedRef.current = true;
        onStop(); // Trigger the stop callback
      }
    }, 1000); // Update every second

    // Cleanup function: clears the interval when component unmounts or dependencies change
    return () => {
      clearInterval(interval);
      document.title = 'Time Fighter';
    };
  }, [activeSession, isMySession, isActive, onStop, prevSessionId]);

  // Calculate progress percentage for the progress bar
  const calculateProgress = useMemo(() => {
    if (!activeSession?.goalDuration || activeSession.goalDuration === 0) {
      return 0;
    }
    const progress = (displayTime / activeSession.goalDuration) * 100;
    return Math.min(progress, 100);
  }, [displayTime, activeSession?.goalDuration]);

  return {
    displayTime,
    formatTime,
    calculateProgress,
    isActive
  };
};
