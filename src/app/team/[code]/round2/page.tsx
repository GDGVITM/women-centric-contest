'use client';

import { useParams, useRouter } from 'next/navigation';

export default function Round2Page() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  return (
    <div className="page-container">
      <div className="glass-card animate-fade-in" style={{ maxWidth: 720, width: '100%', padding: '48px 40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
            <span className="badge badge-info">Team {code}</span>
            <span className="badge badge-success">Round 2</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
            🧩 Round 2 — Problem Statement
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            This problem is common for all teams.
          </p>
        </div>

        {/* Problem Statement */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          padding: '28px 24px',
          marginBottom: 32,
          lineHeight: 1.7
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16, color: 'var(--color-accent)' }}>
            💜 &quot;EmpowerHer&quot; — Women Empowerment Campaign Landing Page
          </h2>
          <p style={{ marginBottom: 16, color: 'var(--color-text)' }}>
            Design and build a <strong>single-page landing website</strong> for a fictional women empowerment campaign
            called <strong>&quot;EmpowerHer&quot;</strong>. Your website should be visually stunning, responsive, and inspiring.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10, color: 'var(--color-text)' }}>
            🎯 Required Sections:
          </h3>
          <ul style={{ paddingLeft: 24, marginBottom: 16, color: 'var(--color-text)', listStyleType: 'disc' }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Hero Banner:</strong> A bold headline with a powerful tagline and a call-to-action button
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Impact Statistics:</strong> A section showing key numbers about women in education, workforce, or leadership (use visually appealing counters, icons, or cards)
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Stories of Change:</strong> At least 3 testimonial / story cards featuring fictional women and their achievements
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Get Involved:</strong> A newsletter signup form or a &quot;Join the Movement&quot; section (UI only — no backend needed)
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Footer:</strong> With social media icons and copyright text
            </li>
          </ul>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10, color: 'var(--color-text)' }}>
            📐 Constraints:
          </h3>
          <ul style={{ paddingLeft: 24, marginBottom: 16, color: 'var(--color-text)', listStyleType: 'disc' }}>
            <li style={{ marginBottom: 6 }}>Use only <strong>HTML, CSS, and JavaScript</strong> (no frameworks)</li>
            <li style={{ marginBottom: 6 }}>The page must be <strong>responsive</strong> (mobile-friendly)</li>
            <li style={{ marginBottom: 6 }}>All 3 team members must contribute</li>
          </ul>

          <div style={{
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.2)',
            borderRadius: 8,
            padding: '16px',
            marginTop: 16
          }}>
            <p style={{ fontWeight: 600, color: '#a855f7', marginBottom: 8, fontSize: '0.9rem' }}>
              ⚖️ Judging Criteria
            </p>
            <ul style={{ paddingLeft: 20, color: 'var(--color-text-muted)', fontSize: '0.9rem', listStyleType: 'circle' }}>
              <li>Visual Design & Aesthetics (30%)</li>
              <li>Content & Creativity (25%)</li>
              <li>Responsiveness & Layout (20%)</li>
              <li>Code Quality & Structure (15%)</li>
              <li>Team Collaboration (10%)</li>
            </ul>
          </div>
        </div>

        {/* Proceed Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            className="btn-glow"
            onClick={() => router.push(`/team/${code}/round2/submit`)}
            style={{ padding: '16px 40px', fontSize: '1.05rem' }}
          >
            📝 Proceed to Submission →
          </button>
        </div>
      </div>
    </div>
  );
}
