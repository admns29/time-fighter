import React, { useCallback } from 'react';


const SessionTable = ({ sessions }) => {
    // Empty array = run once on mount

    // Memoize format functions
    const formatTime = useCallback((timeString) => {
        if (!timeString) return '-';
        const date = new Date(timeString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    const formatDuration = useCallback((seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, []);

    return (
        <div className="flex flex-col items-center bg-transparent from-slate-900 to-slate-800 py-6 mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 
                        dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
                Session History
            </h2>

            {sessions.length === 0 ? (
                <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border 
                        border-slate-200 dark:border-slate-700/50 p-8 text-center">
                    <p className="text-gray-400 text-lg">No completed sessions yet. Start tracking your study time!</p>
                </div>
            ) : (
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700/50 overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Start Time</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">End Time</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                            {sessions.map((session) => (
                                <tr key={session.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-color duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-medium">{session.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{formatTime(session.startTime)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{formatTime(session.endTime)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-cyan-600 dark:text-cyan-400 font-mono">{formatDuration(session.duration)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${session.status === 'COMPLETED'
                                            ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-500/50'
                                            : session.status === 'ACTIVE'
                                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-500/50'
                                                : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-500/50'
                                            }`}>
                                            {session.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default React.memo(SessionTable);