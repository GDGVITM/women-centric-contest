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
            🏗️ Build a Smart Solution
          </h2>
          <p style={{ marginBottom: 16, color: 'var(--color-text)' }}>
            Design and implement a <strong>dashboard / tool / mini-app</strong> that solves a real-world problem
            using technology. Your solution should demonstrate:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, color: 'var(--color-text)', listStyleType: 'disc' }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Problem Identification:</strong> Clearly define the problem you are solving
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Technical Implementation:</strong> Use any tech stack (web, mobile, CLI, etc.)
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Innovation &amp; Creativity:</strong> Show a unique approach or creative twist
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Team Collaboration:</strong> All 3 members must contribute to the solution
            </li>
          </ul>

          <div style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 8,
            padding: '16px',
            marginTop: 16
          }}>
            <p style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: 8, fontSize: '0.9rem' }}>
              📌 Submission Requirements
            </p>
            <ul style={{ paddingLeft: 20, color: 'var(--color-text-muted)', fontSize: '0.9rem', listStyleType: 'circle' }}>
              <li>Solution Title</li>
              <li>Written explanation of your approach</li>
              <li>Key features of your solution</li>
              <li>Dashboard / Demo link (if applicable)</li>
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
