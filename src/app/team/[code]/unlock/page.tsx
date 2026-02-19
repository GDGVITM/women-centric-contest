'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function UnlockPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState<'loading' | 'waiting' | 'ready' | 'unlocked'>('loading');
  const [members, setMembers] = useState<{ memberNo: number; isSubmitted: boolean }[]>([]);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [checking, setChecking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/teams/${code}/status`);
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members);
        if (data.status === 'round2') {
          setStatus('unlocked');
          setTimeout(() => router.push(`/team/${code}/round2`), 1500);
        } else if (data.status === 'completed') {
          router.push(`/team/${code}/complete`);
        } else if (data.status === 'unlocking') {
          setStatus('ready');
        } else {
          setStatus('waiting');
        }
      }
    } catch {
      // ignore
    }
  }, [code, router]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleUnlock = async () => {
    const key = digits.join('');
    if (key.length !== 6) {
      setError('Enter all 6 digits.');
      return;
    }

    setError('');
    setChecking(true);

    try {
      const res = await fetch(`/api/teams/${code}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      const data = await res.json();
      if (data.unlocked) {
        setStatus('unlocked');
        setTimeout(() => router.push(`/team/${code}/round2`), 1500);
      } else {
        setError(data.message || 'Incorrect key.');
        setAttempts(data.attempts || attempts + 1);
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setChecking(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="page-container">
        <span className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (status === 'unlocked') {
    return (
      <div className="page-container">
        <div className="glass-card animate-fade-in" style={{ maxWidth: 480, width: '100%', padding: '48px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }} className="checkmark-bounce">🔓</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: 'var(--color-success)' }}>Round 2 Unlocked!</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Redirecting to problem statement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="glass-card animate-fade-in" style={{ maxWidth: 520, width: '100%', padding: '48px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔐</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Team Key Unlock</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 28 }}>Team {code}</p>

        {/* Member Status */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 28 }}>
          {members.map((m) => (
            <div key={m.memberNo} style={{ textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: m.isSubmitted ? 'rgba(34,197,94,0.2)' : 'rgba(100,116,139,0.2)',
                border: `2px solid ${m.isSubmitted ? '#22c55e' : '#475569'}`,
                fontSize: '1.2rem', margin: '0 auto 6px'
              }}>
                {m.isSubmitted ? '✓' : '⏳'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>M{m.memberNo}</div>
            </div>
          ))}
        </div>

        {status === 'waiting' ? (
          <div>
            <p style={{ color: 'var(--color-warning)', marginBottom: 8, fontWeight: 600 }}>
              ⏳ Waiting for all members to submit...
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              The key input will unlock once all 3 members submit their output.
            </p>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
              All members have submitted! Enter the 6-digit key to unlock Round 2.
            </p>

            {/* Key Input */}
            <div className="key-input" style={{ marginBottom: 20 }}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  className="key-digit"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={checking}
                />
              ))}
            </div>

            {error && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: 16, padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>
                {error}
              </div>
            )}

            {attempts > 0 && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 12 }}>
                Attempts: {attempts}
              </p>
            )}

            <button
              className="btn-glow"
              onClick={handleUnlock}
              disabled={checking || digits.some(d => !d)}
              style={{ width: '100%', padding: '14px' }}
            >
              {checking ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span className="spinner" style={{ width: 18, height: 18 }} /> Checking...
                </span>
              ) : (
                '🔑 Unlock Round 2'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
