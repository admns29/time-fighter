import { useState, useEffect, useRef, useCallback } from 'react';

export const MODES = {
    WORK: { id: 'work', label: 'Work', minutes: 25, color: 'from-red-500 to-orange-500', icon: '🍅' },
    SHORT_BREAK: { id: 'short', label: 'Short Break', minutes: 5, color: 'from-teal-500 to-emerald-500', icon: '☕' },
    LONG_BREAK: { id: 'long', label: 'Long Break', minutes: 15, color: 'from-blue-500 to-cyan-500', icon: '🌳' },
};

export const usePomodoroTimer = (onTimerComplete) => {
    const [mode, setMode] = useState(MODES.WORK);
    const [timeLeft, setTimeLeft] = useState(MODES.WORK.minutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const timerRef = useRef(null);
    const audioContextRef = useRef(null);

    const playTomatoSound = useCallback(() => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            
            const playNote = (freq, startTime, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.3, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                osc.start(startTime);
                osc.stop(startTime + duration);
            };

            const now = ctx.currentTime;
            playNote(523.25, now, 0.15);
            playNote(659.25, now + 0.15, 0.15);
            playNote(783.99, now + 0.30, 0.25);
        } catch (e) {
            console.log('Audio playback not available');
        }
    }, []);

    const getNextMode = useCallback((currentMode) => {
        if (currentMode.id === 'work') {
            return (completedPomodoros > 0 && completedPomodoros % 4 === 0) ? MODES.LONG_BREAK : MODES.SHORT_BREAK;
        }
        return MODES.WORK;
    }, [completedPomodoros]);

    const autoTransition = useCallback((currentMode) => {
        const nextMode = getNextMode(currentMode);
        setMode(nextMode);
        setTimeLeft(nextMode.minutes * 60);
        setIsActive(false);
    }, [getNextMode]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            playTomatoSound();
            if (mode.id === 'work') {
                setCompletedPomodoros((prev) => prev + 1);
            }
            onTimerComplete?.(mode, () => autoTransition(mode));
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft, mode, onTimerComplete, playTomatoSound, autoTransition]);

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

    const skipToNext = () => {
        if (mode.id === 'work') {
            setCompletedPomodoros((prev) => prev + 1);
        }
        autoTransition(mode);
    };

    return {
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
        getNextMode: () => getNextMode(mode),
    };
};
