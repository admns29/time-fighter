import React, { useState, useEffect } from 'react';
import { getStatistics } from '../api/sessionApi';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const data = await getStatistics();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading statistics:', error);
      setLoading(false);
    }
  };

  // Format seconds to HH:MM:SS
  const formatDuration = (seconds) => {
    if (!seconds) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate percentage for progress bars
  const getMaxTime = () => {
    if (!stats?.timePerCategory) return 1;
    return Math.max(...Object.values(stats.timePerCategory), 1);
  };

  if (loading) {
    return (
      <div className="mt-12 text-center">
        <p className="text-gray-400">Loading statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const maxTime = getMaxTime();

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
        Statistics
      </h2>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Today's Total */}
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
          <div className="text-gray-400 text-sm mb-2">Today</div>
          <div className="text-3xl font-bold text-cyan-400">{formatDuration(stats.totalTimeToday)}</div>
        </div>

        {/* This Week's Total */}
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
          <div className="text-gray-400 text-sm mb-2">This Week</div>
          <div className="text-3xl font-bold text-purple-400">{formatDuration(stats.totalTimeThisWeek)}</div>
        </div>

        {/* Most Studied */}
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
          <div className="text-gray-400 text-sm mb-2">Most Studied</div>
          <div className="text-2xl font-bold text-pink-400">
            {stats.mostStudiedCategory || 'N/A'}
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
          <div className="text-gray-400 text-sm mb-2">Streak</div>
          <div className="text-3xl font-bold text-orange-400">
            {stats.currentStreak || 0} {stats.currentStreak === 1 ? 'day' : 'days'} 🔥
          </div>
        </div>
      </div>

      {/* Time Per Category */}
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Time Per Category</h3>
        
        {Object.keys(stats.timePerCategory).length === 0 ? (
          <p className="text-gray-400 text-center py-4">No completed sessions yet</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(stats.timePerCategory)
              .sort(([, a], [, b]) => b - a) // Sort by time descending
              .map(([category, duration]) => {
                const percentage = (duration / maxTime) * 100;
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300 font-medium">{category}</span>
                      <span className="text-cyan-400 font-mono">{formatDuration(duration)}</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;