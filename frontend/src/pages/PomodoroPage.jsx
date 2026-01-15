import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import CircularProgress from '../components/CircularProgress';
import ModeSelector from '../components/ModeSelector';
import NextModePreview from '../components/NextModePreview';
import { usePomodoroTimer, MODES } from '../hooks/usePomodoroTimer';

const PomodoroPage = () => {
    const navigate = useNavigate();
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [pendingTransition, setPendingTransition] = useState(null);

    const {
        mode,
        timeLeft,
        isActive,
        completedPomodoros,
        toggleTimer,
        resetTimer,
        changeMode,
        formatTime,
        calculateProgress,
        skipToNext,
        getNextMode,
    } = usePomodoroTimer((completedMode, transitionFn) => {
        if (completedMode.id === 'work') {
            setPendingTransition(transitionFn);
            setShowCompletionModal(true);
        } else {
            transitionFn();
        }
    });

    const nextMode = getNextMode();

    const handleComplete = () => {
        setShowCompletionModal(false);
        if (pendingTransition) {
            pendingTransition();
        }
    };

    const handleSkip = () => {
        setShowCompletionModal(false);
        skipToNext();
    };

    useEffect(() => {
        if (showCompletionModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showCompletionModal]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100/20 to-slate-100 
                    dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 py-8 transition-colors duration-300">
            <div className="absolute top-0 left-0 m-4">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 
                             dark:hover:text-cyan-400 transition-colors group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                         stroke="currentColor" className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    <span className="hidden sm:inline">Back to Dashboard</span>
                </button>
            </div>

            <div className="absolute top-0 right-0 m-4">
                <ThemeToggle />
            </div>

            <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh]">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 
                             to-pink-400 bg-clip-text text-transparent text-center">
                    Pomodoro Timer
                </h1>

                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Session</span>
                    <div className="flex gap-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    i < (completedPomodoros % 4)
                                        ? 'bg-gradient-to-r from-red-500 to-orange-500 scale-110'
                                        : 'bg-slate-300 dark:bg-slate-600'
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                        {completedPomodoros} completed
                    </span>
                </div>

                <ModeSelector 
                    modes={MODES} 
                    currentMode={mode} 
                    onChange={changeMode} 
                />

                <NextModePreview nextMode={nextMode} completedPomodoros={completedPomodoros} />

                <div className="relative group mb-8">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${mode.color} rounded-full blur opacity-30 
                                   group-hover:opacity-50 transition duration-500 ${isActive ? 'animate-pulse' : ''}`} 
                         style={{ filter: isActive ? 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.4))' : 'none' }}>
                    </div>
                    
                    <CircularProgress 
                        progress={calculateProgress()} 
                        size={280} 
                        strokeWidth={10}
                        color={mode.color}
                        isActive={isActive}
                    >
                        <div className="text-center">
                            <div className={`text-6xl font-mono font-bold tracking-wider transition-all duration-300 ${
                                isActive 
                                    ? 'text-gray-800 dark:text-white scale-105' 
                                    : 'text-gray-500 dark:text-gray-400'
                            }`}>
                                {formatTime(timeLeft)}
                            </div>
                            <div className={`text-sm font-medium mt-1 bg-gradient-to-r ${mode.color} 
                                          bg-clip-text text-transparent uppercase tracking-widest`}>
                                {isActive ? 'Focus' : timeLeft === 0 ? 'Done!' : 'Paused'}
                            </div>
                        </div>
                    </CircularProgress>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTimer}
                            className={`px-10 py-4 rounded-2xl font-bold text-lg text-white shadow-xl 
                                     transform active:scale-95 transition-all duration-200 
                                     bg-gradient-to-r ${mode.color} hover:brightness-110 hover:scale-105
                                     ${isActive ? 'shadow-red-500/25' : 'shadow-green-500/25'}`}
                        >
                            {isActive ? (
                                <span className="flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    PAUSE
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    </svg>
                                    START
                                </span>
                            )}
                        </button>

                        <button
                            onClick={resetTimer}
                            className="p-4 rounded-2xl font-bold text-gray-600 dark:text-gray-300 
                                     bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 
                                     transition-all duration-200 hover:scale-105 active:scale-95"
                            title="Reset timer"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>

                        <button
                            onClick={skipToNext}
                            className="p-4 rounded-2xl font-bold text-gray-600 dark:text-gray-300 
                                     bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 
                                     transition-all duration-200 hover:scale-105 active:scale-95"
                            title="Skip to next phase"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">Space</kbd> to start/pause
                    </p>
                </div>
            </div>

            {showCompletionModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                     onClick={handleComplete}>
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full text-center 
                                 shadow-2xl transform animate-scale-in"
                         onClick={(e) => e.stopPropagation()}>
                        <div className="text-6xl mb-4 animate-bounce">🍅</div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            Great Work!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            You've completed another Pomodoro session!
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={handleComplete}
                                className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg
                                         bg-gradient-to-r ${nextMode.color} hover:brightness-110
                                         transition-all duration-200`}
                            >
                                <span className="flex items-center gap-2">
                                    <span>{nextMode.icon}</span>
                                    Start {nextMode.label}
                                </span>
                            </button>
                            <button
                                onClick={handleSkip}
                                className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300
                                         bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600
                                         transition-all duration-200"
                            >
                                Skip
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PomodoroPage;
