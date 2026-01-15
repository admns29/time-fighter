import React from 'react';

const ModeSelector = ({ modes, currentMode, onChange }) => {
    return (
        <div className="flex justify-center gap-2 mb-8 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl">
            {Object.values(modes).map((m) => (
                <button
                    key={m.id}
                    onClick={() => onChange(m)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        currentMode.id === m.id
                            ? `bg-white dark:bg-slate-700 shadow-lg text-gray-900 dark:text-white transform scale-105`
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                    }`}
                >
                    <span className="text-lg">{m.icon}</span>
                    <span>{m.label}</span>
                </button>
            ))}
        </div>
    );
};

export default ModeSelector;
