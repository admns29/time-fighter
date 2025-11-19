import { useState, useEffect, useRef, useMemo } from 'react';

export const useTimer = (activeSession, isMySession, onStop) => {
  const [displayTime, setDisplayTime] = useState(0);
  const [prevSessionId, setPrevSessionId] = useState(null);
  const hasStoppedRef = useRef(false);

  const isActive = isMySession && activeSession?.status === 'ACTIVE';

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}
           :${String(minutes).padStart(2, '0')}
           :${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isMySession) {
      setDisplayTime(0);
      setPrevSessionId(null);
      hasStoppedRef.current = false;
      document.title = 'Time Fighter'; // Reset title
      return;
    }

    // New session detected
    if (activeSession.id !== prevSessionId) {
      setDisplayTime(activeSession.duration);
      setPrevSessionId(activeSession.id);
      hasStoppedRef.current = false;
    }

    // If paused, just show stored duration
    if (!isActive) {
      setDisplayTime(activeSession.duration);
      document.title = `⏸️ ${formatTime(activeSession.duration)} - Time Fighter`;
      return;
    }

    // Active - run timer
    const interval = setInterval(() => {
      const now = Date.now();
      const startedAt = new Date(activeSession.startTime).getTime();
      const elapsed = Math.floor((now - startedAt) / 1000);
      const totalTime = elapsed + (activeSession.duration || 0);

      // Clamp to goal if exists
      const displayValue = activeSession.goalDuration 
        ? Math.min(totalTime, activeSession.goalDuration)
        : totalTime;

      setDisplayTime(displayValue);
      document.title = `▶️ ${formatTime(displayValue)} - Time Fighter`;

      // Check if goal reached
      if (activeSession.goalDuration && 
          totalTime >= activeSession.goalDuration && 
          !hasStoppedRef.current) {
        hasStoppedRef.current = true;
        onStop();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      document.title = 'Time Fighter'; // Cleanup title
    };
  }, [activeSession, isMySession, isActive, onStop, prevSessionId]);

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
