import React, { useState, useEffect, useCallback } from 'react';
import { startSession, pauseSession, resumeSession, stopSession } from '../api/sessionApi';
import toast from 'react-hot-toast';
import { useTimer } from '../hooks/useTimer';

const TimerCard = ({ category, categoryData, activeSession, onSessionUpdate, onEditCategory, onDeleteCategory }) => {
  const [goalMinutes, setGoalMinutes] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const isMySession = activeSession && activeSession.category === category;

  // Memoize handleStop to prevent stale closure
  const handleStop = useCallback(async () => {
    if (!activeSession?.id) return;

    try {
      await stopSession(activeSession.id);
      await onSessionUpdate();
      toast.success('Session completed! 🎉');
    } catch (error) {
      toast.error('Failed to stop session');
    }
  }, [activeSession?.id, onSessionUpdate]);

  const { displayTime, formatTime, calculateProgress, isActive } = useTimer(activeSession, isMySession, handleStop);

  const handleStart = async () => {
    try {
      const goalSeconds = goalMinutes ? parseInt(goalMinutes) * 60 : null;
      await startSession(category, goalSeconds);
      await onSessionUpdate();
      toast.success(`${category} session started!`);
    } catch (error) {
      toast.error('Failed to start session');
    }
  };

  const handlePause = async () => {
    try {
      await pauseSession(activeSession.id);
      await onSessionUpdate();
      toast.success('Session paused');
    } catch (error) {
      toast.error('Failed to pause session');
    }
  };

  const handleResume = async () => {
    try {
      await resumeSession(activeSession.id);
      await onSessionUpdate();
      toast.success('Session resumed');
    } catch (error) {
      toast.error('Failed to resume session');
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

  // Set default goal from category
  useEffect(() => {
    if (categoryData?.defaultGoalDuration && !goalMinutes) {
      setGoalMinutes(Math.floor(categoryData.defaultGoalDuration / 60));
    }
  }, [categoryData, goalMinutes]);

  return (
    <div className="relative group">
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 
                      rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300">
      </div>

      {/* Card content */}
      <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg 
                      shadow-2xl p-6 border border-slate-200 dark:border-slate-700/50">
        {/* Category with gradient */}
        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 
                      dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
          {categoryData?.icon && <span className="text-2xl">{categoryData.icon}</span>}
          {category}
        </h3>

        {/* Options Menu - Only show when no active session */}
        {!isMySession && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Options"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 
                        rounded hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-lg 
                              border border-slate-200 dark:border-slate-700 py-1 z-10">
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-slate-100 
                              dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 
                              dark:hover:bg-slate-700 hover:text-red-700 dark:hover:text-red-300 transition-colors"
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
              className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-300 
                          dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white 
                          focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        )}

        {/* Timer Display with glow */}
        <div className={`text-5xl font-mono font-bold text-center mb-6 transition-all duration-300 
                        ${isActive ? 'text-cyan-500 dark:text-cyan-400 glow-cyan scale-105' : 'text-gray-500 dark:text-gray-400'
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
            <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-3 
                            overflow-hidden border border-slate-300 dark:border-slate-600">
              {/* Progress bar fill */}
              <div
                className={`h-full rounded-full transition-all duration-300 ${calculateProgress >= 100
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500'
                  }`}
                style={{ width: `${calculateProgress}%` }}
              >
              </div>
            </div>

            {/* Percentage text */}
            <div className="text-center text-sm text-gray-400 mt-1">
              {calculateProgress.toFixed(0)}%
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 justify-center">
          {!isMySession ? (
            <button
              onClick={handleStart}
              className={`font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg ${activeSession
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50' // Disabled style
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white hover:shadow-green-500/50 hover:scale-105'
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
              ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-300 dark:border-green-500/50 shadow-lg shadow-green-500/30'
              : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-500/50 shadow-lg shadow-yellow-500/30'
              }`}>
              {isActive ? '● Active' : '❚❚ Paused'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TimerCard, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.category === nextProps.category &&
    prevProps.categoryData?.id === nextProps.categoryData?.id &&
    prevProps.activeSession?.id === nextProps.activeSession?.id &&
    prevProps.activeSession?.status === nextProps.activeSession?.status &&
    prevProps.activeSession?.duration === nextProps.activeSession?.duration
  );
});