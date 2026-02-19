'use client';

import { useState, useEffect, useCallback } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';
import { CONTEST_CONFIG } from '@/lib/config';

interface CountdownTimerProps {
  startedAt: string | null;
  onExpired?: () => void;
}

export default function CountdownTimer({ startedAt, onExpired }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const calculateTimeLeft = useCallback(() => {
    if (!startedAt) return null;

    const start = new Date(startedAt).getTime();
    const durationMs = CONTEST_CONFIG.roundOneDurationMinutes * 60 * 1000;
    const end = start + durationMs;
    const remaining = Math.max(0, end - Date.now());

    return remaining;
  }, [startedAt]);

  useEffect(() => {
    if (!startedAt) return;

    const update = () => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining !== null && remaining <= 0) {
        onExpired?.();
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startedAt, calculateTimeLeft, onExpired]);

  if (timeLeft === null) return null;

  const totalSeconds = Math.ceil(timeLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const isWarning = minutes < 5 && minutes >= 1;
  const isCritical = minutes < 1;

  const urgencyClass = isCritical
    ? 'timer-critical'
    : isWarning
      ? 'timer-warning'
      : 'timer-normal';

  const formatTime = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      className={urgencyClass}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderRadius: 'var(--radius-md)',
        background: isCritical
          ? 'rgba(234, 67, 53, 0.1)'
          : isWarning
            ? 'rgba(251, 188, 4, 0.1)'
            : 'rgba(255, 255, 255, 0.04)',
        border: `1px solid ${
          isCritical
            ? 'rgba(234, 67, 53, 0.3)'
            : isWarning
              ? 'rgba(251, 188, 4, 0.3)'
              : 'var(--border-subtle)'
        }`,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {isCritical ? <AlertTriangle size={16} /> : <Timer size={16} />}
      <span style={{ fontWeight: 700, fontSize: '1rem', fontFamily: "'Space Grotesk', monospace" }}>
        {formatTime(minutes)}:{formatTime(seconds)}
      </span>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>remaining</span>
    </div>
  );
}
