import React, { useState, useEffect, useMemo } from 'react';
import { getStatistics } from '../api/sessionApi';

const Statistics = ({ refreshTrigger }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null); //Track last update time

    useEffect(() => {
        fetchStatistics();
    }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

    const fetchStatistics = async () => {
        try {
            const data = await getStatistics();
            setStats(data);
            setLastUpdated(new Date()); // Update last updated time
            setLoading(false);
        } catch (error) {
            console.error('Error loading statistics:', error);
            setLoading(false);
        }
    };

    //Format last updated time
    const formatLastUpdated = () => {
        if (!lastUpdated) return '';
        const now = new Date();
        const diff = Math.floor((now - lastUpdated) / 1000); // in seconds

        if (diff < 60) return `${diff} sec ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        return lastUpdated.toLocaleTimeString();
    };

    // Format seconds to HH:MM:SS
    const formatDuration = (seconds) => {
        if (!seconds) return '00:00:00';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Memoize max time calculation
    const getMaxTime = useMemo(() => {
        if (!stats?.timePerCategory) return 1;
        return Math.max(...Object.values(stats.timePerCategory), 1);
    }, [stats?.timePerCategory]);

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

    if (loading) {
        return (
            <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Statistics
                    </h2>
                </div>
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">Loading statistics...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    const maxTime = getMaxTime;

    return (
        <div className="mt-12">
            {/* Header with Refresh Button */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Statistics
                    </h2>
                    {lastUpdated && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Last updated: {formatLastUpdated()}
                        </p>
                    )}
                </div>

                {/* Refresh Button */}
                <button
                    onClick={fetchStatistics}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refresh statistics"
                >
                    <svg
                        className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="hidden sm:inline">Refresh</span>
                </button>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {/* Today's Total */}
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700/50 p-6">
                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Today</div>
                    <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{formatDuration(stats.totalTimeToday)}</div>
                </div>

                {/* This Week's Total */}
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700/50 p-6">
                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">This Week</div>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{formatDuration(stats.totalTimeThisWeek)}</div>
                </div>

                {/* Most Studied */}
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700/50 p-6">
                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Most Studied</div>
                    <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                        {stats.mostStudiedCategory || 'N/A'}
                    </div>
                </div>

                {/* Current Streak */}
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700/50 p-6">
                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Streak</div>
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                        {stats.currentStreak || 0} {stats.currentStreak === 1 ? 'day' : 'days'} 🔥
                    </div>
                </div>
            </div>

            {/* Time Per Category */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700/50 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Time Per Category</h3>

                {Object.keys(stats.timePerCategory).length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-4">No completed sessions yet</p>
                ) : (
                    <div className="space-y-4">
                        {Object.entries(stats.timePerCategory)
                            .sort(([, a], [, b]) => b - a)
                            .map(([category, duration]) => {
                                const percentage = (duration / maxTime) * 100;
                                return (
                                    <div key={category}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">{category}</span>
                                            <span className="text-cyan-600 dark:text-cyan-400 font-mono">{formatDuration(duration)}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-3 overflow-hidden">
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
export default React.memo(Statistics);