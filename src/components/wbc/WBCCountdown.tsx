'use client';

import { useState, useEffect } from 'react';

interface WBCCountdownProps {
    targetDate: string; // ISO format or similar
}

export default function WBCCountdown({ targetDate }: WBCCountdownProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const target = new Date(targetDate).getTime();
            const now = new Date().getTime();
            const difference = target - now;

            if (difference <= 0) {
                return {
                    days: '00',
                    hours: '00',
                    minutes: '00',
                    seconds: '00',
                };
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            return {
                days: String(days).padStart(2, '0'),
                hours: String(hours).padStart(2, '0'),
                minutes: String(minutes).padStart(2, '0'),
                seconds: String(seconds).padStart(2, '0'),
            };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) {
        return (
            <div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center border border-border/50 animate-pulse">
                <div className="text-[8px] uppercase font-black tracking-widest mb-2 text-muted-foreground">WBC 2026 Countdown</div>
                <div className="flex items-center gap-3">
                    <div className="text-xl font-black">--</div>
                    <span className="text-lg font-black opacity-20">:</span>
                    <div className="text-xl font-black">--</div>
                    <span className="text-lg font-black opacity-20">:</span>
                    <div className="text-xl font-black">--</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center border border-border/50">
            <div className="text-[8px] uppercase font-black tracking-widest mb-2 text-muted-foreground italic">WBC 2026 Countdown</div>
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                    <span className="text-xl font-black tabular-nums">{timeLeft.days}</span>
                    <span className="text-[7px] uppercase font-bold opacity-60">Days</span>
                </div>
                <span className="text-lg font-black opacity-20">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-black tabular-nums">{timeLeft.hours}</span>
                    <span className="text-[7px] uppercase font-bold opacity-60">Hours</span>
                </div>
                <span className="text-lg font-black opacity-20">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-black tabular-nums">{timeLeft.minutes}</span>
                    <span className="text-[7px] uppercase font-bold opacity-60">Mins</span>
                </div>
                <span className="text-lg font-black opacity-20">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-black tabular-nums text-primary">{timeLeft.seconds}</span>
                    <span className="text-[7px] uppercase font-bold opacity-60">Secs</span>
                </div>
            </div>
        </div>
    );
}
