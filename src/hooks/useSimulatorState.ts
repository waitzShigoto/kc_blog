import { useState, useRef, useCallback } from 'react';

/**
 * A shared hook to manage the state of a simulator, including counters, 
 * history, and automation controls.
 */
export function useSimulatorState<HistoryType>() {
    // UI-bound state
    const [totalDraws, setTotalDraws] = useState(0);
    const [history, setHistory] = useState<HistoryType[]>([]);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [isRolling, setIsRolling] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

    // Synchronous refs for logic/loops
    const totalDrawsRef = useRef(0);
    const countsRef = useRef<Record<string, number>>({});
    const stopRef = useRef(false);

    /**
     * Increments the total draw count and updates specific item statistics.
     */
    const recordDraw = useCallback((key: string) => {
        totalDrawsRef.current += 1;
        setTotalDraws(totalDrawsRef.current);

        countsRef.current[key] = (countsRef.current[key] || 0) + 1;
        setCounts({ ...countsRef.current });

        return totalDrawsRef.current;
    }, []);

    /**
     * Adds an entry to the draw history with an optional limit.
     */
    const addHistory = useCallback((entry: HistoryType, limit: number = 100) => {
        setHistory(prev => [entry, ...prev].slice(0, limit));
    }, []);

    /**
     * Adds multiple entries to history (efficient for batch updates).
     */
    const addBatchHistory = useCallback((entries: HistoryType[], limit: number = 100) => {
        setHistory(prev => [...entries.reverse(), ...prev].slice(0, limit));
    }, []);

    /**
     * Resets all simulator state to initial values.
     */
    const reset = useCallback(() => {
        totalDrawsRef.current = 0;
        countsRef.current = {};
        stopRef.current = false;

        setTotalDraws(0);
        setHistory([]);
        setCounts({});
        setIsRolling(false);
        setShowAnimation(false);
    }, []);

    /**
     * Signal to stop any ongoing loops/automation.
     */
    const requestStop = useCallback(() => {
        stopRef.current = true;
    }, []);

    return {
        // State
        totalDraws,
        history,
        counts,
        isRolling,
        showAnimation,

        // State Setters
        setTotalDraws,
        setHistory,
        setCounts,
        setIsRolling,
        setShowAnimation,

        // Refs
        totalDrawsRef,
        countsRef,
        stopRef,

        // Actions
        recordDraw,
        addHistory,
        addBatchHistory,
        reset,
        requestStop
    };
}
