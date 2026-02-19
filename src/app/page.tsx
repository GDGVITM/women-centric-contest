'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [teamCode, setTeamCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    setError('');
    const code = teamCode.trim().toUpperCase();

    if (!/^T(0[1-9]|1[0-9]|20)$/.test(code)) {
      setError('Enter a valid code (T01–T20)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamCode: code }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      router.push(`/team/${code}`);
    } catch {
      setError('Network error. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="glass-card animate-fade-in" style={{ maxWidth: 480, width: '100%', padding: '48px 40px', textAlign: 'center' }}>
        {/* Logo / Title */}
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: '3rem' }}>🔁</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 4, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Break the Loop
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 36, fontSize: '0.95rem' }}>
          Team Coding Competition
        </p>

        {/* Team Code Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', textAlign: 'left', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Team Code
          </label>
          <input
            type="text"
            className="input-glow"
            placeholder="e.g. T01"
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            maxLength={3}
            style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '4px' }}
            disabled={loading}
          />
        </div>

        {error && (
          <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: 16, padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>
            {error}
          </div>
        )}

        <button
          className="btn-glow"
          onClick={handleStart}
          disabled={loading || teamCode.trim().length < 2}
          style={{ width: '100%', fontSize: '1.1rem', padding: '16px' }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span className="spinner" /> Starting...
            </span>
          ) : (
            '🚀 Start Competition'
          )}
        </button>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: 24 }}>
          Enter your team code to begin. Codes: T01 – T20
        </p>
      </div>
    </div>
  );
}
