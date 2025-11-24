import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const MODES = {
    WORK: { id: 'work', label: 'Work', minutes: 25, color: 'from-red-500 to-orange-500' },
    SHORT_BREAK: { id: 'short', label: 'Short Break', minutes: 5, color: 'from-teal-500 to-emerald-500' },
    LONG_BREAK: { id: 'long', label: 'Long Break', minutes: 15, color: 'from-blue-500 to-cyan-500' },
};

const PomodoroPage = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState(MODES.WORK);
    const [timeLeft, setTimeLeft] = useState(mode.minutes * 60);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            // Optional: Play sound here
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode.minutes * 60);
    };

    const changeMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(newMode.minutes * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const calculateProgress = () => {
        const totalSeconds = mode.minutes * 60;
        return ((totalSeconds - timeLeft) / totalSeconds) * 100;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100/20 to-slate-100 
                    dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 py-8 transition-colors duration-300">

            {/* Header */}
            <div className="absolute top-0 left-0 m-4">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Dashboard
                </button>
            </div>

            <div className="absolute top-0 right-0 m-4">
                <ThemeToggle />
            </div>

            <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh]">

                <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Pomodoro Timer
                </h1>

                {/* Timer Card */}
                <div className="relative group w-full max-w-md">
                    {/* Glow Effect */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${mode.color} rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500`}></div>

                    <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">

                        {/* Mode Toggles */}
                        <div className="flex justify-center gap-2 mb-8 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl">
                            {Object.values(MODES).map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => changeMode(m)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${mode.id === m.id
                                            ? `bg-white dark:bg-slate-600 shadow-sm text-gray-900 dark:text-white`
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {/* Timer Display */}
                        <div className="text-center mb-8 relative">
                            <div className="text-8xl font-mono font-bold text-gray-800 dark:text-white tracking-wider">
                                {formatTime(timeLeft)}
                            </div>
                            <div className={`text-lg font-medium mt-2 bg-gradient-to-r ${mode.color} bg-clip-text text-transparent`}>
                                {isActive ? 'FOCUS' : 'PAUSED'}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full mb-8 overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${mode.color} transition-all duration-1000 ease-linear`}
                                style={{ width: `${calculateProgress()}%` }}
                            ></div>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={toggleTimer}
                                className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transform active:scale-95 transition-all duration-200 bg-gradient-to-r ${mode.color} hover:brightness-110`}
                            >
                                {isActive ? 'PAUSE' : 'START'}
                            </button>

                            <button
                                onClick={resetTimer}
                                className="px-8 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200"
                            >
                                RESET
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default PomodoroPage;
