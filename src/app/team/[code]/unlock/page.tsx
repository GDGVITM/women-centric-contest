'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  KeyRound,
  Check,
  X,
  Lock,
  AlertTriangle,
  Loader2,
  User,
} from 'lucide-react';
import { CONTEST_CONFIG } from '@/lib/config';

export default function UnlockPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [members, setMembers] = useState<{ memberNo: number; isSubmitted: boolean }[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/teams/${code}/status`);
      const data = await res.json();
      if (data.members) setMembers(data.members);
      if (data.status === 'round2') router.push(`/team/${code}/round2`);
    } catch {/* silent */}
  }, [code, router]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setError('');

    // Auto-focus next
    if (value && index < 5) {
      const next = document.getElementById(`digit-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prev = document.getElementById(`digit-${index - 1}`);
      prev?.focus();
    }
  };

  const handleUnlock = async () => {
    const key = digits.join('');
    if (key.length !== 6) {
      setError('Enter all 6 digits.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/teams/${code}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      const data = await res.json();

      if (data.locked) {
        setLocked(true);
        setAttempts(data.attempts);
        return;
      }

      if (data.unlocked) {
        setSuccess(true);
        setTimeout(() => router.push(`/team/${code}/round2`), 1500);
        return;
      }

      setError(data.message || 'Incorrect key.');
      setAttempts(data.attempts || attempts + 1);
      setDigits(['', '', '', '', '', '']);
      document.getElementById('digit-0')?.focus();
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const allSubmitted = members.length > 0 && members.every((m) => m.isSubmitted);

  return (
    <div className="page-container-narrow" style={{ paddingTop: 60 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <div className="badge badge-info" style={{ marginBottom: 16 }}>Team {code}</div>
        <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>
          <span className="gradient-text-warm">Unlock Round 2</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          All members must submit before entering the secret key.
        </p>
      </motion.div>

      {/* Member Status Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 40,
          flexWrap: 'wrap',
        }}
      >
        {members.map((m) => (
          <div
            key={m.memberNo}
            className="glass-card"
            style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <User size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>M{m.memberNo}</span>
            {m.isSubmitted ? (
              <Check size={14} style={{ color: 'var(--accent-success)' }} />
            ) : (
              <Loader2
                size={14}
                style={{ color: 'var(--accent-warning)', animation: 'spin 1s linear infinite' }}
              />
            )}
          </div>
        ))}
      </motion.div>

      {/* Key Input */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card"
        style={{ padding: 40, maxWidth: 460, margin: '0 auto', textAlign: 'center' }}
      >
        {success ? (
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
          >
            <Check size={56} style={{ color: 'var(--accent-success)', marginBottom: 12 }} />
            <h3 style={{ color: 'var(--accent-success)' }}>Unlocked!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 8 }}>
              Redirecting to Round 2...
            </p>
          </motion.div>
        ) : locked ? (
          <div>
            <Lock size={48} style={{ color: 'var(--accent-danger)', marginBottom: 12 }} />
            <h3 style={{ color: 'var(--accent-danger)' }}>Locked Out</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 8 }}>
              Maximum {CONTEST_CONFIG.maxUnlockAttempts} attempts reached. Contact an organizer.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
              <KeyRound size={18} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontWeight: 600 }}>Enter the Secret Key</span>
            </div>

            {/* 6-Digit Input */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  id={`digit-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={!allSubmitted}
                  style={{
                    width: 48,
                    height: 56,
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: "'Space Grotesk', monospace",
                    background: 'var(--bg-secondary)',
                    border: `2px solid ${error ? 'var(--accent-danger)' : d ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>

            {/* Attempt Counter */}
            {attempts > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                marginBottom: 16, fontSize: '0.8rem', color: 'var(--accent-warning)',
              }}>
                <AlertTriangle size={12} />
                {attempts}/{CONTEST_CONFIG.maxUnlockAttempts} attempts used
              </div>
            )}

            {error && (
              <motion.p
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  color: 'var(--accent-danger)', fontSize: '0.85rem', marginBottom: 16,
                }}
              >
                <X size={14} /> {error}
              </motion.p>
            )}

            <button
              className="btn-primary"
              onClick={handleUnlock}
              disabled={loading || !allSubmitted}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Checking...</>
              ) : !allSubmitted ? (
                <><Lock size={16} /> Waiting for all members</>
              ) : (
                <><KeyRound size={16} /> Unlock</>
              )}
            </button>
          </>
        )}
      </motion.div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
