import React from 'react';

const NextModePreview = ({ nextMode, completedPomodoros }) => {
    if (!nextMode) return null;

    const pomodorosUntilLongBreak = 4 - (completedPomodoros % 4);
    
    return (
        <div className="flex items-center justify-center gap-3 mb-6 px-4 py-2 bg-slate-100 dark:bg-slate-800/30 rounded-full">
            <span className="text-sm text-gray-500 dark:text-gray-400">
                After this:
            </span>
            <div className="flex items-center gap-2">
                <span className="text-lg">{nextMode.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {nextMode.label} ({nextMode.minutes}m)
                </span>
            </div>
            {nextMode.id === 'work' && pomodorosUntilLongBreak > 0 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                    ({pomodorosUntilLongBreak} more until long break)
                </span>
            )}
        </div>
    );
};

export default NextModePreview;
