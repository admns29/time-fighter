import React, { useState, useEffect } from 'react';
import { startSession, pauseSession, resumeSession, stopSession } from '../api/sessionApi';

const TimerCard = ({ category, categoryData, activeSession, onSessionUpdate, onEditCategory, onDeleteCategory }) => {
  const [displayTime, setDisplayTime] = useState(0);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!activeSession?.goalDuration || activeSession.goalDuration === 0) {
      return 0; // No goal set
    }
    const progress = (displayTime / activeSession.goalDuration) * 100;
    return Math.min(progress, 100); // Cap at 100%
  };

  // Check if this card has the active session
  const isMySession = activeSession && activeSession.category === category;
  const isActive = isMySession && activeSession.status === 'ACTIVE';
  const [prevSessionId, setPrevSessionId] = useState(null);
  const [goalMinutes, setGoalMinutes] = useState(''); // User input for goal
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (categoryData?.defaultGoalDuration && !goalMinutes) {
      setGoalMinutes(Math.floor(categoryData.defaultGoalDuration / 60)); // Convert seconds to minutes
    }
  }, [categoryData]);

  useEffect(() => {
    if (!isMySession) {
      setDisplayTime(0);
      setPrevSessionId(null);
      return;
    }

    // 🕒 If a new or resumed session is detected
    if (activeSession.id !== prevSessionId) {
      let baseDuration = activeSession.duration;

      // 💡 If the session is ACTIVE, calculate time elapsed since startTime
      if (activeSession.status === 'ACTIVE' && activeSession.startTime) {
        const now = new Date();
        const startedAt = new Date(activeSession.startTime);
        const elapsedSinceStart = Math.floor((now - startedAt) / 1000);
        baseDuration += elapsedSinceStart;
      }

      setDisplayTime(baseDuration);
      setPrevSessionId(activeSession.id);
      console.log('activeSession goalDuration:', activeSession?.goalDuration);
      console.log('displayTime initial:', baseDuration);
    }

    // ⏸️ If paused, just show the stored duration
    if (!isActive) {
      setDisplayTime(activeSession.duration);
      return;
    }



    // ▶️ Continue timer while active
    const interval = setInterval(() => {
      setDisplayTime(prev => {
        const newTime = prev + 1;

        // 🎯 Check if goal reached
        if (activeSession.goalDuration && newTime >= activeSession.goalDuration) {
          console.log('Goal reached! Auto-stopping session');
          handleStop(); // Auto-stop session
          clearInterval(interval); // Stop ticking
          return activeSession.goalDuration; // Cap the display
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession?.id, activeSession?.duration, activeSession?.status,
  activeSession?.goalDuration, isMySession, isActive, prevSessionId]);


  const handleStart = async () => {
    try {
      //Convert minutes to seconds
      const goalSeconds = goalMinutes ? parseInt(goalMinutes) * 60 : null;
      await startSession(category, goalSeconds);
      await onSessionUpdate();
    } catch (error) {
      alert('Failed to start session');
    }
  };

  const handlePause = async () => {
    try {
      await pauseSession(activeSession.id);
      await onSessionUpdate();
    } catch (error) {
      alert('Failed to pause session');
    }
  };

  const handleResume = async () => {
    try {
      await resumeSession(activeSession.id);
      await onSessionUpdate();
    } catch (error) {
      alert('Failed to resume session');
    }
  };

  const handleStop = async () => {
    try {
      await stopSession(activeSession.id);
      await onSessionUpdate();
    } catch (error) {
      alert('Failed to stop session');
    }
  };

  const handleEdit = () => {
    onEditCategory(categoryData);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete category "${category}"? This cannot be undone.`)) {
      onDeleteCategory(categoryData.id);
    }
    setShowMenu(false);
  };

  return (
    <div className="relative group">
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg 
      blur opacity-30 group-hover:opacity-60 transition duration-300"></div>

      {/* Card content */}
      <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-2xl p-6 border border-slate-700/50">
        {/* Category with gradient */}
        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
          {categoryData?.icon && <span className="text-2xl">{categoryData.icon}</span>}
          {category}
        </h3>

        {/* Options Menu - Only show when no active session */}
        {!isMySession && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-slate-700/50 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-1 z-10">
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        )}

        {/* NEW: Goal Input - Only show when no active session */}
        {!isMySession && !activeSession && (
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">

            </label>
            <input
              type="number"
              value={goalMinutes}
              onChange={(e) => setGoalMinutes(e.target.value)}
              placeholder="Duration in minutes (Optional)"
              min="1"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 
              py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        )}

        {/* Timer Display with glow */}
        <div className={`text-5xl font-mono font-bold text-center mb-6 transition-all duration-300 ${isActive ? 'text-cyan-400 glow-cyan scale-105' : 'text-gray-400'
          }`}>
          {formatTime(displayTime)}
        </div>

        {/* Progress Bar - Only show if goal is set */}
        {isMySession && activeSession?.goalDuration && (
          <div className="mb-6">
            {/* Goal info text */}
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Progress</span>
              <span>Goal: {formatTime(activeSession.goalDuration)}</span>
            </div>

            {/* Progress bar container */}
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600">
              {/* Progress bar fill */}
              <div
                className={`h-full rounded-full transition-all duration-300 ${calculateProgress() >= 100
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500'
                  }`}
                style={{ width: `${calculateProgress()}%` }}
              >
              </div>
            </div>

            {/* Percentage text */}
            <div className="text-center text-sm text-gray-400 mt-1">
              {calculateProgress().toFixed(0)}%
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 justify-center">
          {!isMySession ? (
            <button
              onClick={handleStart}
              className={`font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg ${activeSession
                ? 'bg-gray-600 cursor-not-allowed opacity-50' // Disabled style
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 hover:shadow-green-500/50 hover:scale-105'
                }`}
            >
              Start
            </button>
          ) : isActive ? (
            <>
              <button
                onClick={handlePause}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 
                text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-yellow-500/50 hover:scale-105"
              >
                Pause
              </button>
              <button
                onClick={handleStop}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white 
                font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/50 hover:scale-105"
              >
                Stop
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleResume}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white 
                font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50 hover:scale-105"
              >
                Resume
              </button>
              <button
                onClick={handleStop}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white 
                font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/50 hover:scale-105"
              >
                Stop
              </button>
            </>
          )}
        </div>

        {/* Status Badge with glow */}
        {isMySession && (
          <div className="mt-5 text-center">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-300 ${isActive
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