import React from 'react';


const SessionTable = ({ sessions }) => {
   // Empty array = run once on mount

  // Format datetime to readable format
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format duration as HH:MM:SS
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

    return (
    <div className="flex items-center justify-center bg-transparent from-slate-900 to-slate-800 padding-6 mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
        Session History
        </h2>
        
        {sessions.length === 0 ? (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-8 text-center">
            <p className="text-gray-400 text-lg">No completed sessions yet. Start tracking your study time!</p>
        </div>
        ) : (
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden">
            <table className="min-w-full">
            <thead className="bg-slate-900/50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
                {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{session.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{formatTime(session.startTime)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{formatTime(session.endTime)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-cyan-400 font-mono">{formatDuration(session.duration)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        session.status === 'COMPLETED' 
                        ? 'bg-green-900/50 text-green-300 border border-green-500/50' 
                        : session.status === 'ACTIVE'
                        ? 'bg-blue-900/50 text-blue-300 border border-blue-500/50'
                        : 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/50'
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

export default SessionTable;