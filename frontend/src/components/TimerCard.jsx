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
    <div className="relative group">
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
      
      {/* Card content */}
      <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-2xl p-6 border border-slate-700/50">
        {/* Category with gradient */}
        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
          {category}
        </h3>
        
        {/* Timer Display with glow */}
        <div className={`text-5xl font-mono font-bold text-center mb-6 transition-all duration-300 ${
          isActive ? 'text-cyan-400 glow-cyan scale-105' : 'text-gray-400'
        }`}>
          {formatTime(displayTime)}
        </div>
        
        {/* Buttons */}
        <div className="flex gap-2 justify-center">
          {!isMySession ? (
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/50 hover:scale-105"
            >
              Start
            </button>
          ) : isActive ? (
            <>
              <button
                onClick={handlePause}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-yellow-500/50 hover:scale-105"
              >
                Pause
              </button>
              <button
                onClick={handleStop}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/50 hover:scale-105"
              >
                Stop
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleResume}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50 hover:scale-105"
              >
                Resume
              </button>
              <button
                onClick={handleStop}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/50 hover:scale-105"
              >
                Stop
              </button>
            </>
          )}
        </div>
        
        {/* Status Badge with glow */}
        {isMySession && (
          <div className="mt-5 text-center">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-300 ${
              isActive 
                ? 'bg-green-900/50 text-green-300 border-green-500/50 shadow-lg shadow-green-500/30' 
                : 'bg-yellow-900/50 text-yellow-300 border-yellow-500/50 shadow-lg shadow-yellow-500/30'
            }`}>
              {isActive ? '● Active' : '❚❚ Paused'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimerCard;