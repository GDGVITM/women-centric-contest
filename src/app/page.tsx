'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Code2,
  Users,
  KeyRound,
  Trophy,
  ArrowRight,
  Bug,
  Zap,
  Shield,
} from 'lucide-react';
import { CONTEST_CONFIG } from '@/lib/config';

const CONTEST_STEPS = [
  {
    icon: Users,
    title: 'Join Your Team',
    description: 'Enter your team code and pick a member slot.',
    color: CONTEST_CONFIG.colors.blue,
  },
  {
    icon: Bug,
    title: 'Debug the Code',
    description: `Find and fix bugs in ${CONTEST_CONFIG.roundOneDurationMinutes} minutes across C, Java, or Python.`,
    color: CONTEST_CONFIG.colors.red,
  },
  {
    icon: KeyRound,
    title: 'Unlock Round 2',
    description: 'Once all members submit, enter the secret key together.',
    color: CONTEST_CONFIG.colors.yellow,
  },
  {
    icon: Trophy,
    title: 'Submit & Win',
    description: 'Collaborate on a final solution and submit your work.',
    color: CONTEST_CONFIG.colors.green,
  },
];

export default function LandingPage() {
  const [teamCode, setTeamCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!teamCode.trim()) {
      setError('Please enter your team code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamCode: teamCode.toUpperCase().trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      router.push(`/team/${data.teamCode}`);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: 60, paddingBottom: 60 }}>
      {/* ─── Hero Section ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto', marginBottom: 80 }}
      >
        {/* GDG Tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 9999,
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            marginBottom: 24,
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', gap: 3 }}>
            {Object.values(CONTEST_CONFIG.colors).map((c) => (
              <div key={c} style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span>{CONTEST_CONFIG.organizer}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: 16 }}
        >
          <span className="gradient-text">{CONTEST_CONFIG.name}</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            marginBottom: 40,
            lineHeight: 1.6,
          }}
        >
          {CONTEST_CONFIG.tagline}
          <br />
          <span style={{ fontSize: '0.95rem' }}>
            A team-based debugging competition — find bugs, crack codes, and build solutions.
          </span>
        </motion.p>

        {/* Team Code Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card"
          style={{
            padding: 32,
            maxWidth: 420,
            margin: '0 auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Shield size={16} style={{ color: 'var(--accent-primary)' }} />
            <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Team Code</label>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. T01"
              value={teamCode}
              onChange={(e) => {
                setTeamCode(e.target.value.toUpperCase());
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              maxLength={5}
              style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}
            />
            <button
              className="btn-primary"
              onClick={handleStart}
              disabled={loading}
              style={{ whiteSpace: 'nowrap' }}
            >
              {loading ? (
                <Zap size={16} style={{ animation: 'pulse-glow 1s infinite' }} />
              ) : (
                <>
                  Start <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ color: 'var(--accent-danger)', fontSize: '0.85rem' }}
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </motion.section>

      {/* ─── How It Works ─── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ maxWidth: 900, margin: '0 auto' }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            marginBottom: 40,
            color: 'var(--text-secondary)',
          }}
        >
          How It Works
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}
        >
          {CONTEST_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="glow-card"
              style={{ padding: 24, textAlign: 'center' }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${step.color}15`,
                  border: `1px solid ${step.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <step.icon size={22} style={{ color: step.color }} />
              </div>
              <h3 style={{ fontSize: '0.95rem', marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ─── Tech Bar ─── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          textAlign: 'center',
          marginTop: 60,
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Code2 size={14} /> C
          </span>
          <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Code2 size={14} /> Java
          </span>
          <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Code2 size={14} /> Python
          </span>
        </div>
      </motion.section>
    </div>
  );
}
