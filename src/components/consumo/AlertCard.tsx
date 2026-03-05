'use client';

import { useEffect, useState } from 'react';

type AlertType = 'error' | 'warning';

interface AlertCardProps {
    type: AlertType;
    message: string;
    time: string;
    delay?: number;
}

export default function AlertCard({ type, message, time, delay = 0 }: AlertCardProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    const isError = type === 'error';

    return (
        <div
            className={`
        flex items-start gap-3 rounded-2xl px-4 py-3 border
        transition-all duration-500
        ${isError ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}
      `}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-12px)',
                transitionDelay: `${delay}ms`,
            }}
        >
      <span className={`text-lg mt-0.5 ${isError ? 'text-red-400' : 'text-amber-400'}`}>
        {isError ? '⚠️' : '🔔'}
      </span>
            <div>
                <p className="text-sm font-medium text-slate-700">{message}</p>
                <p className="text-xs text-slate-400 mt-0.5">{time}</p>
            </div>
        </div>
    );
}