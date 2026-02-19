'use client';

import { use } from 'react';
import { motion } from 'motion/react';
import { Trophy, PartyPopper, Github, Home } from 'lucide-react';
import Link from 'next/link';
import { CONTEST_CONFIG } from '@/lib/config';

export default function CompletePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);

  // Generate confetti particles
  const confetti = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    color: Object.values(CONTEST_CONFIG.colors)[i % 4],
    left: Math.random() * 100,
    delay: Math.random() * 2,
    size: 6 + Math.random() * 6,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="page-container-narrow" style={{ paddingTop: 80, paddingBottom: 80, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Confetti */}
      {confetti.map((c) => (
        <motion.div
          key={c.id}
          initial={{ y: -50, opacity: 1, rotate: 0 }}
          animate={{ y: 800, opacity: 0, rotate: c.rotation + 720 }}
          transition={{ duration: 3 + Math.random() * 2, delay: c.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            top: -20,
            left: `${c.left}%`,
            width: c.size,
            height: c.size,
            borderRadius: c.id % 3 === 0 ? '50%' : 2,
            background: c.color,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Trophy */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, delay: 0.3 }}
        style={{ marginBottom: 24 }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'linear-gradient(135deg, var(--gdg-yellow), var(--gdg-green))',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Trophy size={40} color="white" />
        </div>
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <PartyPopper size={24} style={{ color: 'var(--gdg-yellow)' }} />
          <h1 style={{ fontSize: '2.5rem' }}>
            <span className="gradient-text">Well Done!</span>
          </h1>
          <PartyPopper size={24} style={{ color: 'var(--gdg-yellow)', transform: 'scaleX(-1)' }} />
        </div>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
          Team <strong style={{ color: 'var(--text-primary)' }}>{code}</strong> has successfully completed{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{CONTEST_CONFIG.name}</strong>.
        </p>
      </motion.div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card"
        style={{ padding: 32, marginTop: 40, maxWidth: 420, margin: '40px auto 0' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-success">Round 1</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Debug Phase — Completed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-success">Round 2</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Build Phase — Submitted</span>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 32 }}
      >
        <Link href="/" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
          <Home size={14} /> Back Home
        </Link>
        <a
          href={CONTEST_CONFIG.orgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ padding: '10px 20px', fontSize: '0.85rem' }}
        >
          <Github size={14} /> GDG GitHub
        </a>
      </motion.div>

      {/* Footer message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        style={{ marginTop: 48, color: 'var(--text-muted)', fontSize: '0.8rem' }}
      >
        Thank you for participating! Results will be announced by {CONTEST_CONFIG.organizer}.
      </motion.p>
    </div>
  );
}
