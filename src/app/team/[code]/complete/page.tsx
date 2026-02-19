'use client';

import { useParams } from 'next/navigation';

export default function CompletePage() {
  const { code } = useParams<{ code: string }>();

  return (
    <div className="page-container">
      <div className="glass-card animate-fade-in" style={{ maxWidth: 560, width: '100%', padding: '56px 40px', textAlign: 'center' }}>
        {/* Success Animation */}
        <div style={{ fontSize: '5rem', marginBottom: 20 }} className="checkmark-bounce">
          🎉
        </div>

        <h1 style={{
          fontSize: '2rem', fontWeight: 800, marginBottom: 12,
          background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Submission Received!
        </h1>

        <p style={{ color: 'var(--color-text-muted)', marginBottom: 32, fontSize: '1rem', lineHeight: 1.6 }}>
          Team <strong style={{ color: 'var(--color-text)' }}>{code}</strong> has successfully completed the competition.
          Your submission is now locked.
        </p>

        {/* Confirmation Card */}
        <div style={{
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ color: '#22c55e', fontSize: '1.2rem' }}>✓</span>
            <span style={{ fontWeight: 600, color: '#4ade80' }}>Round 1 — Completed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ color: '#22c55e', fontSize: '1.2rem' }}>✓</span>
            <span style={{ fontWeight: 600, color: '#4ade80' }}>Round 2 — Submitted</span>
          </div>
        </div>

        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          padding: '16px 20px',
        }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            🔒 Your submission is locked and cannot be modified. The judges will review all submissions. Good luck!
          </p>
        </div>

        <div style={{ marginTop: 32 }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
            Thank you for participating in <strong>Break the Loop</strong>! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
