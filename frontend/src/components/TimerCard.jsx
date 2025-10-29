import React, { useState, useEffect } from 'react';
import { startSession, pauseSession, resumeSession, stopSession } from '../api/sessionApi';

const TimerCard = ({ category, activeSession, onSessionUpdate }) => {
  const [displayTime, setDisplayTime] = useState(0);
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Check if this card has the active session
  const isMySession = activeSession && activeSession.category === category;
  const isActive = isMySession && activeSession.status === 'ACTIVE';
  const [prevSessionId, setPrevSessionId] = useState(null);

  useEffect(() => {
    console.log('=== useEffect triggered ===');
    console.log('category:', category);
    console.log('activeSession:', activeSession);
    console.log('isMySession:', isMySession);
    console.log('isActive:', isActive);
    console.log('prevSessionId:', prevSessionId);
    
    if (!isMySession) {
      console.log('Not my session, setting display to 0');
      setDisplayTime(0);
      setPrevSessionId(null);
      return;
    }

    // Session ID changed - new session started
    if (activeSession.id !== prevSessionId) {
      console.log('New session detected, resetting to backend duration:', activeSession.duration);
      const baseDuration = activeSession.duration;
      setDisplayTime(baseDuration);
      setPrevSessionId(activeSession.id);
    }

    if (!isActive) {
      console.log('Session paused, syncing with backend:', activeSession.duration);
      // When paused, always sync with backend
      setDisplayTime(activeSession.duration);
      return;
    }

    console.log('Starting timer interval from current displayTime');
    const interval = setInterval(() => {
      setDisplayTime(prev => {
        console.log('Timer tick, prev:', prev, 'new:', prev + 1);
        return prev + 1;
      });
    }, 1000);

    return () => {
      console.log('Cleaning up interval');
      clearInterval(interval);
    };
  }, [activeSession?.id, activeSession?.duration, activeSession?.status, isMySession, isActive, prevSessionId]);

  const handleStart = async () => {
    try {
      await startSession(category);
      onSessionUpdate();
    } catch (error) {
      alert('Failed to start session');
    }
  };

  const handlePause = async () => {
    try {
      await pauseSession(activeSession.id);
      onSessionUpdate();
    } catch (error) {
      alert('Failed to pause session');
    }
  };

  const handleResume = async () => {
    try {
      await resumeSession(activeSession.id);
      onSessionUpdate();
    } catch (error) {
      alert('Failed to resume session');
    }
  };

  const handleStop = async () => {
    try {
      await stopSession(activeSession.id);
      onSessionUpdate();
    } catch (error) {
      alert('Failed to stop session');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{category}</h3>
      
      <div className="text-4xl font-mono font-bold text-center mb-6 text-gray-700">
        {formatTime(displayTime)}
      </div>
      
      <div className="flex gap-2 justify-center">
        {!isMySession ? (
          <button
            onClick={handleStart}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Start
          </button>
        ) : isActive ? (
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
      
      {isMySession && (
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